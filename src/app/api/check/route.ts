import { NextResponse } from 'next/server';
import { runAllChecks } from '@/lib/checker';

// POST /api/check — trigger a check run (cron or manual)
// Protected by CRON_SECRET
export async function POST(request: Request) {
  const authHeader = request.headers.get('authorization');
  const cronSecret = process.env.CRON_SECRET;

  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const results = await runAllChecks();
    const changed = results.filter(r => r.changed).length;
    const errors = results.filter(r => r.error).length;

    return NextResponse.json({
      total: results.length,
      changed,
      errors,
      results,
    });
  } catch (err: any) {
    console.error('Check run failed:', err);
    return NextResponse.json({ error: 'Check run failed' }, { status: 500 });
  }
}
