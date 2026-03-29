import { smartScrape } from './scraper';
import { analyzeChange } from './ai/analyze';
import { buildChangeEmail } from './email/templates';
import { sendEmail } from './email/send';
import {
  getActiveMonitors, getLatestSnapshot, createSnapshot,
  createChange, updateMonitorStatus, getDb,
} from './db';

export interface CheckResult {
  monitorId: string;
  url: string;
  changed: boolean;
  error?: string;
  changeId?: string;
}

// Check a single monitor
async function checkMonitor(monitor: any): Promise<CheckResult> {
  const { id, url, email, name, scrape_layer } = monitor;

  // 1. Scrape (auto-upgrade to Playwright for layer 2 monitors)
  const scrape = await smartScrape(url, scrape_layer || 1);
  if (!scrape.success) {
    updateMonitorStatus(id, 'error', scrape.error);
    return { monitorId: id, url, changed: false, error: scrape.error };
  }

  // 2. Compare with last snapshot
  const lastSnapshot = getLatestSnapshot(id);

  if (!lastSnapshot) {
    // First scrape — save baseline, no change notification
    createSnapshot(id, scrape.content, scrape.contentHash);
    updateMonitorStatus(id, 'active');
    return { monitorId: id, url, changed: false };
  }

  if (lastSnapshot.content_hash === scrape.contentHash) {
    // No change
    updateMonitorStatus(id, 'active');
    return { monitorId: id, url, changed: false };
  }

  // 3. Content changed! Save new snapshot
  const newSnapshotId = createSnapshot(id, scrape.content, scrape.contentHash);

  // 4. AI analysis
  let analysis;
  try {
    analysis = await analyzeChange(url, lastSnapshot.content_text, scrape.content);
  } catch (err: any) {
    analysis = {
      summary: 'Changes detected but AI analysis failed.',
      category: 'other' as const,
      importance: 'medium' as const,
      insight: err.message,
      changes: ['Content has been modified'],
    };
  }

  // 5. Save change record
  const changeId = createChange({
    monitorId: id,
    snapshotBeforeId: lastSnapshot.id,
    snapshotAfterId: newSnapshotId,
    diffText: scrape.content.slice(0, 5000), // Store truncated for now
    aiSummary: analysis.summary,
    aiCategory: analysis.category,
    aiImportance: analysis.importance,
    aiInsight: analysis.insight,
  });

  // 6. Send notification email (skip minor changes)
  if (analysis.importance !== 'minor') {
    try {
      const emailContent = buildChangeEmail({
        monitorName: name,
        url,
        analysis,
        dashboardUrl: process.env.NEXT_PUBLIC_APP_URL || 'https://compwatch.ai',
      });
      await sendEmail(email, emailContent.subject, emailContent.html);

      // Mark as notified
      getDb().prepare('UPDATE changes SET notified_at = CURRENT_TIMESTAMP WHERE id = ?').run(changeId);
    } catch (err: any) {
      console.error(`Failed to send notification for ${url}:`, err.message);
    }
  }

  // Update monitor
  getDb().prepare('UPDATE monitors SET last_checked_at = CURRENT_TIMESTAMP, last_changed_at = CURRENT_TIMESTAMP WHERE id = ?').run(id);

  return { monitorId: id, url, changed: true, changeId };
}

// Run all active monitors
export async function runAllChecks(): Promise<CheckResult[]> {
  const monitors = getActiveMonitors();
  const results: CheckResult[] = [];

  for (const monitor of monitors) {
    try {
      const result = await checkMonitor(monitor);
      results.push(result);
      // Rate limit: 1 second between requests
      await new Promise(r => setTimeout(r, 1000));
    } catch (err: any) {
      results.push({ monitorId: monitor.id, url: monitor.url, changed: false, error: err.message });
    }
  }

  return results;
}
