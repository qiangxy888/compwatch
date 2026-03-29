import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { getMonitorById } from '@/lib/db';
import { scrapeUrl } from '@/lib/scraper';
import { analyzeChange } from '@/lib/ai/analyze';
import { getLatestSnapshot, createSnapshot, createChange, updateMonitorStatus, getDb } from '@/lib/db';

// POST /api/monitors/:id/check — manually trigger a check
export async function POST(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { id } = await params;
  const monitor = getMonitorById(id);
  if (!monitor || monitor.user_id !== session.user_id) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  // 1. Scrape
  const scrape = await scrapeUrl(monitor.url);
  if (!scrape.success) {
    updateMonitorStatus(id, 'error', scrape.error);
    return NextResponse.json({ changed: false, error: scrape.error });
  }

  // 2. Compare
  const lastSnapshot = getLatestSnapshot(id);

  if (!lastSnapshot) {
    createSnapshot(id, scrape.content, scrape.contentHash);
    updateMonitorStatus(id, 'active');
    return NextResponse.json({ changed: false, message: 'Baseline captured. Next check will compare against this.' });
  }

  if (lastSnapshot.content_hash === scrape.contentHash) {
    getDb().prepare('UPDATE monitors SET last_checked_at = CURRENT_TIMESTAMP WHERE id = ?').run(id);
    return NextResponse.json({ changed: false, message: 'No changes detected.' });
  }

  // 3. Changed!
  const newSnapshotId = createSnapshot(id, scrape.content, scrape.contentHash);

  let analysis;
  try {
    analysis = await analyzeChange(monitor.url, lastSnapshot.content_text, scrape.content);
  } catch {
    analysis = { summary: 'Changes detected.', category: 'other' as const, importance: 'medium' as const, insight: 'AI analysis unavailable.', changes: ['Content modified'] };
  }

  const changeId = createChange({
    monitorId: id,
    snapshotBeforeId: lastSnapshot.id,
    snapshotAfterId: newSnapshotId,
    diffText: scrape.content.slice(0, 5000),
    aiSummary: analysis.summary,
    aiCategory: analysis.category,
    aiImportance: analysis.importance,
    aiInsight: analysis.insight,
  });

  getDb().prepare('UPDATE monitors SET last_checked_at = CURRENT_TIMESTAMP, last_changed_at = CURRENT_TIMESTAMP, change_count = change_count + 1 WHERE id = ?').run(id);

  return NextResponse.json({ changed: true, changeId, analysis });
}
