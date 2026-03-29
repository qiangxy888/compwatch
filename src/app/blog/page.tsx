import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Blog — Competitive Intelligence, Monitoring & Strategy',
  description: 'Guides on competitor monitoring, competitive analysis, and website change tracking.',
};

const posts = [
  { slug: 'visualping-alternative-2026', title: 'Best Visualping Alternatives in 2026: AI-Powered Options', description: 'Looking for a Visualping alternative? Compare the top website monitoring tools with AI capabilities.', date: '2026-03-29', readTime: '10 min' },
  { slug: 'how-to-monitor-competitor-websites', title: 'How to Monitor Competitor Websites: Complete Guide', description: 'Learn how to track competitor pricing, features, and content changes automatically.', date: '2026-03-28', readTime: '12 min' },
  { slug: 'website-change-detection-tools', title: 'Website Change Detection Tools: 2026 Comparison', description: 'Compare the best tools for detecting website changes — from free to enterprise.', date: '2026-03-25', readTime: '8 min' },
];

export default function BlogPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900">Blog</h1>
        <p className="mt-4 text-lg text-gray-600">Competitive intelligence guides and website monitoring tips.</p>
      </div>
      <div className="space-y-6">
        {posts.map(post => (
          <Link key={post.slug} href={`/blog/${post.slug}`} className="block bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center gap-3 text-sm text-gray-500 mb-2"><time>{post.date}</time><span>·</span><span>{post.readTime}</span></div>
            <h2 className="text-xl font-bold text-gray-900 hover:text-[--color-primary]">{post.title}</h2>
            <p className="mt-2 text-gray-600">{post.description}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
