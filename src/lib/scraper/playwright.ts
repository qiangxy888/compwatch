/**
 * Layer 2: Playwright-based scraping for SPA/JS-heavy sites
 * Uses playwright-core with external browser (Browserless, BrowserBase, or local Chrome)
 */
import { chromium, type Browser, type Page } from 'playwright-core';
import { createHash } from 'crypto';
import type { ScrapeResult } from './index';

const BROWSER_WS = process.env.BROWSER_WS_ENDPOINT; // e.g. wss://chrome.browserless.io?token=xxx
const BROWSER_TIMEOUT = 25_000; // 25s total budget
const PAGE_TIMEOUT = 15_000;

// Selectors to remove (same as layer 1)
const REMOVE_SCRIPT = `
  document.querySelectorAll('script, style, noscript, iframe, nav, header, footer, svg, img, [role="navigation"], [role="banner"], [role="contentinfo"], .cookie-banner, .cookie-consent, .ad, .ads, .advertisement, .sidebar, aside, .social-share').forEach(el => el.remove());
`;

const CONTENT_SELECTORS = [
  'main', 'article', '[role="main"]',
  '#content', '#main', '.content', '.main-content',
  '.post-content', '.entry-content', '.article-body',
];

let _browser: Browser | null = null;

async function getBrowser(): Promise<Browser> {
  if (_browser?.isConnected()) return _browser;

  if (BROWSER_WS) {
    // Connect to remote browser (Browserless, BrowserBase)
    _browser = await chromium.connect(BROWSER_WS, { timeout: 10_000 });
  } else {
    // Try local Chrome/Chromium
    const executablePath = process.env.CHROME_PATH || findChrome();
    if (!executablePath) {
      throw new Error('No browser available. Set BROWSER_WS_ENDPOINT or CHROME_PATH.');
    }
    _browser = await chromium.launch({
      executablePath,
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage'],
      timeout: 10_000,
    });
  }
  return _browser;
}

function findChrome(): string | undefined {
  const paths = [
    '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    '/usr/bin/google-chrome',
    '/usr/bin/chromium-browser',
    '/usr/bin/chromium',
  ];
  // Dynamic import not needed — just return the path string
  // Runtime will check if it exists when launching
  return paths[0]; // Default to macOS Chrome
}

async function extractContent(page: Page): Promise<{ content: string; title: string }> {
  // Remove noise
  await page.evaluate(REMOVE_SCRIPT);

  const title = await page.title();

  // Try content selectors
  for (const selector of CONTENT_SELECTORS) {
    const text = await page.evaluate((sel: string) => {
      const el = document.querySelector(sel);
      return el ? (el as HTMLElement).innerText.replace(/\s+/g, ' ').trim() : '';
    }, selector);
    if (text.length > 100) {
      return { content: text, title };
    }
  }

  // Fallback: body text
  const bodyText = await page.evaluate(() =>
    document.body.innerText.replace(/\s+/g, ' ').trim()
  );
  return { content: bodyText, title };
}

export async function scrapeWithPlaywright(url: string): Promise<ScrapeResult> {
  let page: Page | null = null;

  try {
    const browser = await getBrowser();
    const context = await browser.newContext({
      userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      viewport: { width: 1280, height: 720 },
      locale: 'en-US',
    });

    // Block unnecessary resources for speed
    await context.route('**/*.{png,jpg,jpeg,gif,svg,woff,woff2,ttf,eot,ico,mp4,webm,mp3}', route => route.abort());
    await context.route('**/{analytics,tracking,ads,facebook,twitter,doubleclick}*', route => route.abort());

    page = await context.newPage();

    // Navigate and wait for content to render
    await page.goto(url, {
      waitUntil: 'networkidle',
      timeout: PAGE_TIMEOUT,
    });

    // Extra wait for SPA hydration
    await page.waitForTimeout(2000);

    const { content, title } = await extractContent(page);

    await context.close();

    if (content.length < 50) {
      return {
        success: false,
        content,
        contentHash: '',
        title,
        error: 'Content too short even after JS rendering',
        layer: 2,
      };
    }

    const contentHash = createHash('sha256').update(content).digest('hex');

    return { success: true, content, contentHash, title, layer: 2 };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Playwright scraping failed';
    return { success: false, content: '', contentHash: '', title: '', error: message, layer: 2 };
  } finally {
    if (page) {
      try { await page.close(); } catch { /* ignore */ }
    }
  }
}

/** Cleanup: close browser on shutdown */
export async function closeBrowser(): Promise<void> {
  if (_browser) {
    try { await _browser.close(); } catch { /* ignore */ }
    _browser = null;
  }
}
