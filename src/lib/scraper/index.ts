import * as cheerio from 'cheerio';
import { createHash } from 'crypto';

export interface ScrapeResult {
  success: boolean;
  content: string;      // Cleaned text content
  contentHash: string;   // SHA-256 hash for change detection
  title: string;
  error?: string;
  layer: number;         // Which scrape layer was used
}

// Remove noise elements (nav, footer, scripts, styles, ads)
const REMOVE_SELECTORS = [
  'script', 'style', 'noscript', 'iframe',
  'nav', 'header', 'footer',
  '[role="navigation"]', '[role="banner"]', '[role="contentinfo"]',
  '.cookie-banner', '.cookie-consent', '#cookie',
  '.ad', '.ads', '.advertisement', '[class*="advert"]',
  '.sidebar', 'aside',
  '.social-share', '.share-buttons',
  'svg', 'img',  // Remove images (we only want text)
].join(', ');

// Main content selectors (try in order)
const CONTENT_SELECTORS = [
  'main', 'article', '[role="main"]',
  '#content', '#main', '.content', '.main-content',
  '.post-content', '.entry-content', '.article-body',
];

function extractMainContent($: cheerio.CheerioAPI): string {
  // Remove noise first
  $(REMOVE_SELECTORS).remove();

  // Try to find main content area
  for (const selector of CONTENT_SELECTORS) {
    const el = $(selector);
    if (el.length && el.text().trim().length > 100) {
      return el.text().replace(/\s+/g, ' ').trim();
    }
  }

  // Fallback: use body
  return $('body').text().replace(/\s+/g, ' ').trim();
}

export async function scrapeUrl(url: string): Promise<ScrapeResult> {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15000);

    const response = await fetch(url, {
      signal: controller.signal,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9',
      },
    });

    clearTimeout(timeout);

    if (!response.ok) {
      return { success: false, content: '', contentHash: '', title: '', error: `HTTP ${response.status}`, layer: 1 };
    }

    const html = await response.text();
    const $ = cheerio.load(html);

    const title = $('title').text().trim() || $('h1').first().text().trim() || '';
    const content = extractMainContent($);

    if (content.length < 50) {
      return { success: false, content, contentHash: '', title, error: 'Content too short — may be SPA/JS-rendered page', layer: 1 };
    }

    const contentHash = createHash('sha256').update(content).digest('hex');

    return { success: true, content, contentHash, title, layer: 1 };
  } catch (err: any) {
    const error = err.name === 'AbortError' ? 'Timeout (15s)' : err.message;
    return { success: false, content: '', contentHash: '', title: '', error, layer: 1 };
  }
}
