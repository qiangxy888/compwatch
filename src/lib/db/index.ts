import Database from 'better-sqlite3';
import path from 'path';
import { SCHEMA } from './schema';
import { randomUUID } from 'crypto';

const DB_PATH = process.env.DATABASE_PATH || path.join(process.cwd(), 'data', 'compwatch.db');

let db: Database.Database | null = null;

export function getDb(): Database.Database {
  if (!db) {
    // Ensure data directory exists
    const dir = path.dirname(DB_PATH);
    const fs = require('fs');
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

    db = new Database(DB_PATH);
    db.pragma('journal_mode = WAL');
    db.pragma('foreign_keys = ON');
    db.exec(SCHEMA);
  }
  return db;
}

// Helper: generate ID
export const genId = () => randomUUID().replace(/-/g, '').slice(0, 16);

// ===== Users =====
export function createUser(email: string, name?: string) {
  const id = genId();
  getDb().prepare('INSERT INTO users (id, email, name) VALUES (?, ?, ?)').run(id, email, name || null);
  return id;
}

export function getUserByEmail(email: string) {
  return getDb().prepare('SELECT * FROM users WHERE email = ?').get(email) as any;
}

export function getUserById(id: string) {
  return getDb().prepare('SELECT * FROM users WHERE id = ?').get(id) as any;
}

// ===== Monitors =====
export function createMonitor(userId: string, url: string, name?: string) {
  const id = genId();
  getDb().prepare('INSERT INTO monitors (id, user_id, url, name) VALUES (?, ?, ?, ?)').run(id, userId, url, name || new URL(url).hostname);
  return id;
}

export function getMonitorsByUser(userId: string) {
  return getDb().prepare('SELECT * FROM monitors WHERE user_id = ? ORDER BY created_at DESC').all(userId) as any[];
}

export function getMonitorById(id: string) {
  return getDb().prepare('SELECT * FROM monitors WHERE id = ?').get(id) as any;
}

export function getActiveMonitors() {
  return getDb().prepare('SELECT m.*, u.email, u.plan FROM monitors m JOIN users u ON m.user_id = u.id WHERE m.status = ?').all('active') as any[];
}

export function updateMonitorStatus(id: string, status: string, errorMessage?: string) {
  getDb().prepare('UPDATE monitors SET status = ?, error_message = ?, last_checked_at = CURRENT_TIMESTAMP WHERE id = ?').run(status, errorMessage || null, id);
}

export function countMonitorsByUser(userId: string) {
  const row = getDb().prepare('SELECT COUNT(*) as count FROM monitors WHERE user_id = ?').get(userId) as any;
  return row.count;
}

// ===== Snapshots =====
export function createSnapshot(monitorId: string, contentText: string, contentHash: string) {
  const id = genId();
  getDb().prepare('INSERT INTO snapshots (id, monitor_id, content_text, content_hash) VALUES (?, ?, ?, ?)').run(id, monitorId, contentText, contentHash);
  return id;
}

export function getLatestSnapshot(monitorId: string) {
  return getDb().prepare('SELECT * FROM snapshots WHERE monitor_id = ? ORDER BY fetched_at DESC LIMIT 1').get(monitorId) as any;
}

// ===== Changes =====
export function createChange(data: {
  monitorId: string; snapshotBeforeId?: string; snapshotAfterId: string;
  diffText: string; aiSummary?: string; aiCategory?: string; aiImportance?: string; aiInsight?: string;
}) {
  const id = genId();
  getDb().prepare(`INSERT INTO changes (id, monitor_id, snapshot_before_id, snapshot_after_id, diff_text, ai_summary, ai_category, ai_importance, ai_insight) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`).run(
    id, data.monitorId, data.snapshotBeforeId || null, data.snapshotAfterId,
    data.diffText, data.aiSummary || null, data.aiCategory || null, data.aiImportance || 'medium', data.aiInsight || null
  );
  return id;
}

export function getChangesByMonitor(monitorId: string, limit = 20) {
  return getDb().prepare('SELECT * FROM changes WHERE monitor_id = ? ORDER BY created_at DESC LIMIT ?').all(monitorId, limit) as any[];
}

export function getRecentChanges(userId: string, limit = 50) {
  return getDb().prepare(`
    SELECT c.*, m.url, m.name as monitor_name 
    FROM changes c JOIN monitors m ON c.monitor_id = m.id 
    WHERE m.user_id = ? ORDER BY c.created_at DESC LIMIT ?
  `).all(userId, limit) as any[];
}

// ===== Waitlist =====
export function addToWaitlist(email: string, source?: string) {
  const id = genId();
  try {
    getDb().prepare('INSERT INTO waitlist (id, email, source) VALUES (?, ?, ?)').run(id, email, source || 'landing');
    return { success: true, id };
  } catch (e: any) {
    if (e.message?.includes('UNIQUE')) return { success: false, error: 'already_exists' };
    throw e;
  }
}
