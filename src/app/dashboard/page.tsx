'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';

interface Change {
  ai_summary: string;
  ai_category: string;
  ai_importance: string;
  created_at: string;
}

interface Monitor {
  id: string;
  url: string;
  name: string;
  status: string;
  last_checked_at: string | null;
  last_changed_at: string | null;
  change_count: number;
  error_message: string | null;
  lastChange: Change | null;
}

const CAT_EMOJI: Record<string, string> = { pricing: '💰', feature: '🚀', content: '📝', seo: '🔍', design: '🎨', other: '📋' };
const IMP_COLOR: Record<string, string> = { critical: 'bg-red-100 text-red-800', important: 'bg-yellow-100 text-yellow-800', medium: 'bg-blue-100 text-blue-800', minor: 'bg-gray-100 text-gray-600' };

function timeAgo(date: string) {
  const diff = Date.now() - new Date(date).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

export default function DashboardPage() {
  const [monitors, setMonitors] = useState<Monitor[]>([]);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState(false);
  const [newUrl, setNewUrl] = useState('');
  const [newName, setNewName] = useState('');
  const [adding, setAdding] = useState(false);
  const [showAdd, setShowAdd] = useState(false);
  const [error, setError] = useState('');
  const [checking, setChecking] = useState<string | null>(null);
  const [checkResult, setCheckResult] = useState<{ id: string; msg: string } | null>(null);

  const fetchMonitors = useCallback(async () => {
    try {
      const res = await fetch('/api/monitors');
      if (res.status === 401) { setAuthError(true); setLoading(false); return; }
      const data = await res.json();
      setMonitors(data.monitors || []);
    } catch { /* ignore */ }
    setLoading(false);
  }, []);

  useEffect(() => { fetchMonitors(); }, [fetchMonitors]);

  const addMonitor = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUrl) return;
    setAdding(true);
    setError('');
    try {
      const res = await fetch('/api/monitors', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ url: newUrl, name: newName || new URL(newUrl).hostname }) });
      const data = await res.json();
      if (res.ok) { setNewUrl(''); setNewName(''); setShowAdd(false); fetchMonitors(); }
      else setError(data.error);
    } catch { setError('Failed to add monitor'); }
    setAdding(false);
  };

  const deleteMonitor = async (id: string) => {
    if (!confirm('Delete this monitor and all its history?')) return;
    await fetch(`/api/monitors/${id}`, { method: 'DELETE' });
    fetchMonitors();
  };

  const togglePause = async (id: string, status: string) => {
    await fetch(`/api/monitors/${id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ status: status === 'active' ? 'paused' : 'active' }) });
    fetchMonitors();
  };

  const runCheck = async (id: string) => {
    setChecking(id);
    setCheckResult(null);
    try {
      const res = await fetch(`/api/monitors/${id}/check`, { method: 'POST' });
      const data = await res.json();
      setCheckResult({ id, msg: data.changed ? `🔔 Change detected! ${data.analysis?.summary || ''}` : (data.message || 'No changes.') });
      fetchMonitors();
    } catch {
      setCheckResult({ id, msg: '❌ Check failed' });
    }
    setChecking(null);
  };

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    window.location.href = '/';
  };

  if (authError) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <div className="text-5xl mb-4">🔒</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Sign in required</h1>
          <p className="text-gray-600 mb-6">Sign in to access your monitoring dashboard.</p>
          <Link href="/login" className="px-6 py-3 bg-[--color-primary] text-white rounded-xl font-semibold hover:bg-[--color-primary-dark]">Sign In →</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-500 text-sm mt-1">{monitors.length} monitor{monitors.length !== 1 ? 's' : ''}</p>
        </div>
        <div className="flex gap-3">
          <button onClick={() => setShowAdd(!showAdd)} className="px-4 py-2 bg-[--color-primary] text-white rounded-lg font-semibold text-sm hover:bg-[--color-primary-dark] transition-colors">+ Add Monitor</button>
          <button onClick={handleLogout} className="px-4 py-2 text-gray-500 hover:text-gray-700 text-sm">Logout</button>
        </div>
      </div>

      {/* Add Form */}
      {showAdd && (
        <form onSubmit={addMonitor} className="bg-white border border-gray-200 rounded-xl p-6 mb-6 shadow-sm">
          <h2 className="font-semibold text-gray-900 mb-4">Add Competitor Page</h2>
          <div className="flex flex-col sm:flex-row gap-3">
            <input type="url" value={newUrl} onChange={e => setNewUrl(e.target.value)} placeholder="https://competitor.com/pricing" required className="flex-1 px-4 py-2.5 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-[--color-primary]" />
            <input type="text" value={newName} onChange={e => setNewName(e.target.value)} placeholder="Name (optional)" className="sm:w-48 px-4 py-2.5 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-[--color-primary]" />
            <button type="submit" disabled={adding} className="px-6 py-2.5 bg-[--color-primary] text-white rounded-lg font-semibold text-sm hover:bg-[--color-primary-dark] disabled:opacity-50 whitespace-nowrap">{adding ? 'Adding...' : 'Add'}</button>
          </div>
          {error && <p className="mt-3 text-red-500 text-sm">{error}</p>}
          <p className="mt-3 text-xs text-gray-400">Tip: Add pricing pages, landing pages, and changelogs for best results.</p>
        </form>
      )}

      {loading && <div className="text-center py-12 text-gray-500">Loading...</div>}

      {/* Empty State */}
      {!loading && monitors.length === 0 && (
        <div className="text-center py-16 bg-white border border-gray-200 rounded-2xl">
          <div className="text-6xl mb-4">👁</div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Start monitoring competitors</h2>
          <p className="text-gray-600 mb-2">Add a competitor URL and we'll track every change.</p>
          <p className="text-gray-400 text-sm mb-6">Free plan: 5 pages · Daily checks</p>
          <button onClick={() => setShowAdd(true)} className="px-6 py-3 bg-[--color-primary] text-white rounded-xl font-semibold hover:bg-[--color-primary-dark]">+ Add Your First Monitor</button>
        </div>
      )}

      {/* Monitor List */}
      <div className="space-y-4">
        {monitors.map(m => (
          <div key={m.id} className="bg-white border border-gray-200 rounded-xl p-5 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className={`w-2 h-2 rounded-full flex-shrink-0 ${m.status === 'active' ? 'bg-green-500' : m.status === 'error' ? 'bg-red-500' : 'bg-gray-400'}`} />
                  <h3 className="font-semibold text-gray-900 truncate">{m.name}</h3>
                  {m.change_count > 0 && <span className="text-xs bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full flex-shrink-0">{m.change_count} change{m.change_count > 1 ? 's' : ''}</span>}
                </div>
                <a href={m.url} target="_blank" rel="noopener" className="text-sm text-gray-500 hover:text-[--color-primary] truncate block">{m.url}</a>

                {/* Last change */}
                {m.lastChange && (
                  <div className="mt-3 bg-gray-50 rounded-lg p-3">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span>{CAT_EMOJI[m.lastChange.ai_category] || '📋'}</span>
                      <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${IMP_COLOR[m.lastChange.ai_importance] || ''}`}>{m.lastChange.ai_importance}</span>
                      <span className="text-xs text-gray-400">{timeAgo(m.lastChange.created_at)}</span>
                    </div>
                    <p className="text-sm text-gray-700">{m.lastChange.ai_summary}</p>
                  </div>
                )}

                {/* Check result */}
                {checkResult?.id === m.id && (
                  <div className="mt-2 text-sm text-indigo-600 bg-indigo-50 rounded-lg px-3 py-2">{checkResult.msg}</div>
                )}

                {m.error_message && <p className="mt-2 text-xs text-red-500">⚠️ {m.error_message}</p>}
              </div>

              {/* Actions */}
              <div className="flex items-center gap-1.5 flex-shrink-0">
                <button onClick={() => runCheck(m.id)} disabled={checking === m.id} className="px-3 py-1.5 text-xs bg-indigo-50 text-[--color-primary] rounded-lg hover:bg-indigo-100 disabled:opacity-50 font-medium" title="Check now">
                  {checking === m.id ? '⏳' : '🔄'} Check
                </button>
                <button onClick={() => togglePause(m.id, m.status)} className="p-1.5 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-50" title={m.status === 'active' ? 'Pause' : 'Resume'}>
                  {m.status === 'active' ? '⏸' : '▶️'}
                </button>
                <button onClick={() => deleteMonitor(m.id)} className="p-1.5 text-gray-400 hover:text-red-500 rounded-lg hover:bg-gray-50" title="Delete">🗑</button>
              </div>
            </div>
            <div className="mt-2 text-xs text-gray-400">
              {m.last_checked_at ? `Last checked ${timeAgo(m.last_checked_at)}` : 'Not checked yet'}
            </div>
          </div>
        ))}
      </div>

      {/* Upgrade Banner (show for free users with 3+ monitors) */}
      {monitors.length >= 3 && (
        <div className="mt-8 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl p-6 text-white text-center">
          <h3 className="text-lg font-bold mb-2">Unlock AI-Powered Analysis</h3>
          <p className="text-indigo-100 text-sm mb-4">Upgrade to Pro for AI summaries, 6-hour checks, and 25 monitors.</p>
          <Link href="/pricing" className="inline-block bg-white text-indigo-600 px-6 py-2.5 rounded-xl font-semibold hover:bg-indigo-50 transition-colors">View Plans →</Link>
        </div>
      )}
    </div>
  );
}
