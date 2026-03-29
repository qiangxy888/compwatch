export interface User {
  id: string;
  email: string;
  name: string | null;
  plan: 'free' | 'pro' | 'business';
  stripe_customer_id: string | null;
  stripe_subscription_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface Session {
  id: string;
  user_id: string;
  expires_at: string;
  created_at: string;
  // Joined fields
  email?: string;
  name?: string;
  plan?: string;
  stripe_customer_id?: string;
}

export interface MagicLink {
  id: string;
  email: string;
  token: string;
  expires_at: string;
  used: number;
  created_at: string;
}

export interface Monitor {
  id: string;
  user_id: string;
  url: string;
  name: string;
  check_interval: number;
  last_checked_at: string | null;
  last_changed_at: string | null;
  change_count: number;
  status: 'active' | 'paused' | 'error';
  error_message: string | null;
  scrape_layer: number;
  created_at: string;
  // Joined fields
  email?: string;
  plan?: string;
}

export interface Snapshot {
  id: string;
  monitor_id: string;
  content_text: string;
  content_hash: string;
  fetched_at: string;
}

export interface Change {
  id: string;
  monitor_id: string;
  snapshot_before_id: string | null;
  snapshot_after_id: string;
  diff_text: string;
  ai_summary: string | null;
  ai_category: string | null;
  ai_importance: 'critical' | 'important' | 'medium' | 'minor';
  ai_insight: string | null;
  notified_at: string | null;
  user_feedback: 'useful' | 'not_useful' | null;
  created_at: string;
  // Joined fields
  url?: string;
  monitor_name?: string;
}

export interface WaitlistEntry {
  id: string;
  email: string;
  source: string | null;
  created_at: string;
}
