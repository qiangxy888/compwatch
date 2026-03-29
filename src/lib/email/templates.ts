import type { ChangeAnalysis } from '../ai/analyze';

const CATEGORY_EMOJI: Record<string, string> = {
  pricing: '💰',
  feature: '🚀',
  content: '📝',
  seo: '🔍',
  design: '🎨',
  other: '📋',
};

const IMPORTANCE_COLOR: Record<string, string> = {
  critical: '#DC2626',
  important: '#F59E0B',
  medium: '#3B82F6',
  minor: '#9CA3AF',
};

export function buildChangeEmail(data: {
  monitorName: string;
  url: string;
  analysis: ChangeAnalysis;
  dashboardUrl: string;
}) {
  const { monitorName, url, analysis, dashboardUrl } = data;
  const emoji = CATEGORY_EMOJI[analysis.category] || '📋';
  const color = IMPORTANCE_COLOR[analysis.importance] || '#3B82F6';

  return {
    subject: `${emoji} ${monitorName} changed — ${analysis.summary.slice(0, 60)}`,
    html: `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin:0;padding:0;background:#f3f4f6;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
  <div style="max-width:600px;margin:0 auto;padding:24px;">
    <!-- Header -->
    <div style="background:white;border-radius:12px;padding:24px;margin-bottom:16px;border-left:4px solid ${color};">
      <div style="display:flex;align-items:center;margin-bottom:12px;">
        <span style="font-size:24px;margin-right:8px;">${emoji}</span>
        <span style="font-size:13px;color:#6B7280;text-transform:uppercase;letter-spacing:0.5px;font-weight:600;">${analysis.category} change · ${analysis.importance}</span>
      </div>
      <h1 style="margin:0 0 8px;font-size:20px;color:#111827;">${monitorName}</h1>
      <a href="${url}" style="color:#6B7280;font-size:13px;text-decoration:none;">${url}</a>
    </div>

    <!-- AI Summary -->
    <div style="background:white;border-radius:12px;padding:24px;margin-bottom:16px;">
      <h2 style="margin:0 0 12px;font-size:16px;color:#111827;">🧠 AI Summary</h2>
      <p style="margin:0 0 16px;font-size:15px;color:#374151;line-height:1.6;">${analysis.summary}</p>
      
      ${analysis.changes.length > 0 ? `
      <div style="background:#F9FAFB;border-radius:8px;padding:16px;margin-bottom:16px;">
        <h3 style="margin:0 0 8px;font-size:14px;color:#6B7280;">What changed:</h3>
        <ul style="margin:0;padding:0 0 0 20px;color:#374151;font-size:14px;line-height:1.8;">
          ${analysis.changes.map(c => `<li>${c}</li>`).join('')}
        </ul>
      </div>` : ''}

      ${analysis.insight ? `
      <div style="background:#EFF6FF;border-radius:8px;padding:16px;border-left:3px solid #3B82F6;">
        <h3 style="margin:0 0 4px;font-size:14px;color:#1E40AF;">💡 Insight</h3>
        <p style="margin:0;font-size:14px;color:#1E40AF;line-height:1.5;">${analysis.insight}</p>
      </div>` : ''}
    </div>

    <!-- CTA -->
    <div style="text-align:center;margin-bottom:16px;">
      <a href="${dashboardUrl}" style="display:inline-block;background:#4F46E5;color:white;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:600;font-size:14px;">View Full Details →</a>
    </div>

    <!-- Feedback -->
    <div style="background:white;border-radius:12px;padding:16px;text-align:center;">
      <p style="margin:0 0 8px;font-size:13px;color:#6B7280;">Was this notification useful?</p>
      <a href="${dashboardUrl}/feedback?useful=true" style="text-decoration:none;font-size:20px;margin:0 8px;">👍</a>
      <a href="${dashboardUrl}/feedback?useful=false" style="text-decoration:none;font-size:20px;margin:0 8px;">👎</a>
    </div>

    <!-- Footer -->
    <div style="text-align:center;padding:24px 0;color:#9CA3AF;font-size:12px;">
      <p>CompWatch — AI Competitor Monitoring</p>
      <a href="${dashboardUrl}/settings" style="color:#9CA3AF;">Notification Settings</a> · <a href="${dashboardUrl}/unsubscribe" style="color:#9CA3AF;">Unsubscribe</a>
    </div>
  </div>
</body>
</html>`,
  };
}

export function buildWelcomeEmail(email: string) {
  return {
    subject: '🔔 Welcome to CompWatch — Your AI competitor monitor is ready',
    html: `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin:0;padding:0;background:#f3f4f6;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
  <div style="max-width:600px;margin:0 auto;padding:24px;">
    <div style="background:white;border-radius:12px;padding:32px;text-align:center;">
      <h1 style="margin:0 0 8px;font-size:24px;color:#111827;">Welcome to CompWatch 🎉</h1>
      <p style="margin:0 0 24px;color:#6B7280;">Your AI-powered competitor monitoring is ready.</p>
      <div style="background:#F9FAFB;border-radius:8px;padding:20px;text-align:left;margin-bottom:24px;">
        <h3 style="margin:0 0 12px;font-size:16px;color:#111827;">What happens next:</h3>
        <ol style="margin:0;padding:0 0 0 20px;color:#374151;line-height:2;">
          <li>Add up to 5 competitor URLs to monitor (free plan)</li>
          <li>We check them daily for changes</li>
          <li>You get AI-powered change summaries in your inbox</li>
        </ol>
      </div>
      <a href="#" style="display:inline-block;background:#4F46E5;color:white;padding:14px 28px;border-radius:8px;text-decoration:none;font-weight:600;">Add Your First Competitor →</a>
    </div>
  </div>
</body>
</html>`,
  };
}
