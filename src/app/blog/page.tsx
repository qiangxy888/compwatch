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
  { slug: 'track-competitor-pricing-changes', title: 'How to Track Competitor Pricing Changes Automatically', description: 'Learn how to set up automated competitor price monitoring to stay ahead of market changes.', date: '2026-03-27', readTime: '9 min' },
  { slug: 'competitive-intelligence-for-startups', title: 'Competitive Intelligence for Startups: A Practical Guide', description: 'How startups can build an effective competitive intelligence system on a budget.', date: '2026-03-26', readTime: '11 min' },
  { slug: 'distill-io-vs-visualping', title: 'Distill.io vs Visualping: Which Is Better in 2026?', description: 'Head-to-head comparison of Distill.io and Visualping for website change monitoring.', date: '2026-03-24', readTime: '8 min' },
  { slug: 'monitor-competitor-website-changes-ecommerce', title: 'How E-commerce Brands Monitor Competitor Websites', description: 'E-commerce specific guide to monitoring competitor pricing, promotions, and product changes.', date: '2026-03-22', readTime: '10 min' },
  { slug: 'website-monitoring-api-build-vs-buy', title: 'Website Monitoring API: Build vs. Buy in 2026', description: 'Should you build your own website change detection system or use an existing API?', date: '2026-03-20', readTime: '12 min' },
  { slug: 'competitor-pricing-strategy-saas', title: 'Competitor Pricing Strategy for SaaS: How to React', description: 'Framework for responding to competitor pricing changes.', date: '2026-03-18', readTime: '10 min' },
  { slug: 'hexowatch-alternative', title: 'Best Hexowatch Alternatives for Website Monitoring (2026)', description: 'Looking for a Hexowatch alternative? Compare tools.', date: '2026-03-16', readTime: '7 min' },
  { slug: 'competitive-analysis-template', title: 'Competitive Analysis Template: Free Framework for 2026', description: 'Step-by-step framework for analyzing competitors.', date: '2026-03-14', readTime: '11 min' },
  { slug: 'website-change-notification-tools', title: 'Website Change Notification Tools: Get Alerted Instantly', description: 'Set up instant notifications when a website changes.', date: '2026-03-12', readTime: '7 min' },
  { slug: 'crayon-alternative-affordable', title: 'Affordable Crayon Alternatives for Competitive Intelligence', description: 'Crayon costs $3,000+/month. Here are affordable alternatives.', date: '2026-03-10', readTime: '8 min' },
  { slug: 'monitor-competitor-seo-strategy', title: "How to Monitor Your Competitor's SEO Strategy", description: 'Track competitor keywords, content, and ranking changes.', date: '2026-03-08', readTime: '10 min' },
  { slug: 'market-intelligence-for-product-managers', title: 'Market Intelligence for Product Managers: Tools & Workflows', description: 'How PMs can use competitive intelligence for better product decisions.', date: '2026-03-06', readTime: '9 min' },
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
