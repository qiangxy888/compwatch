import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'About CompWatch', description: 'CompWatch is an AI-powered competitor monitoring tool built for indie makers, SaaS founders, and marketing teams.' };

export default function AboutPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <h1 className="text-3xl font-extrabold text-gray-900 mb-8">About CompWatch</h1>
      <div className="prose prose-lg prose-indigo max-w-none text-gray-700">
        <p>CompWatch is an AI-powered competitor monitoring tool. We automatically detect changes on competitor websites and use AI to summarize what changed and what it means for your business.</p>
        <h2>Why We Built This</h2>
        <p>Existing tools like Visualping tell you "the page changed" with a screenshot diff. But that's not intelligence — it's just notification. We built CompWatch because competitive intelligence shouldn't require a $3,000/month Crayon subscription or hours of manual checking.</p>
        <h2>How It Works</h2>
        <ol><li>You add competitor URLs to monitor</li><li>We check them daily (or more frequently on Pro)</li><li>When something changes, AI analyzes the diff</li><li>You get a summary with categorization and business insights</li></ol>
        <h2>Privacy</h2>
        <p>We only monitor public webpages. We don't scrape private content, bypass paywalls, or access anything that requires authentication.</p>
      </div>
    </div>
  );
}
