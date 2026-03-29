import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Privacy Policy', description: 'CompWatch privacy policy.' };

export default function PrivacyPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <h1 className="text-3xl font-extrabold text-gray-900 mb-8">Privacy Policy</h1>
      <div className="prose prose-lg prose-indigo max-w-none text-gray-700">
        <p><strong>Last updated:</strong> March 2026</p>
        <h2>Data We Collect</h2>
        <ul><li><strong>Account data:</strong> Email address, name (optional)</li><li><strong>Monitor data:</strong> URLs you choose to monitor and their public content snapshots</li><li><strong>Usage data:</strong> Basic analytics (page views, feature usage)</li></ul>
        <h2>What We Monitor</h2>
        <p>CompWatch only accesses <strong>publicly available webpages</strong>. We do not bypass paywalls, authentication, or robots.txt restrictions.</p>
        <h2>Data Retention</h2>
        <p>Free plan: 7 days. Pro: 90 days. Business: unlimited. You can delete your account and all data at any time.</p>
        <h2>Third Parties</h2>
        <ul><li><strong>Anthropic (Claude):</strong> Webpage content is sent to Claude API for analysis</li><li><strong>Resend:</strong> Email delivery</li><li><strong>Stripe:</strong> Payment processing</li></ul>
      </div>
    </div>
  );
}
