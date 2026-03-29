import WaitlistForm from '@/components/landing/WaitlistForm';

const features = [
  { icon: '🧠', title: 'AI-Powered Summaries', desc: 'Not just "page changed" — get plain-English summaries of what changed and what it means for your business.' },
  { icon: '📧', title: 'Daily Email Digests', desc: 'Wake up to a clean summary of all competitor changes. No dashboard login needed.' },
  { icon: '🏷️', title: 'Smart Categorization', desc: 'Changes auto-tagged as Pricing 💰, Features 🚀, Content 📝, or SEO 🔍 so you can focus on what matters.' },
  { icon: '⚡', title: 'Set It & Forget It', desc: 'Add URLs once. We check daily and only notify you when something meaningful changes.' },
  { icon: '🔒', title: 'No Installation', desc: 'Works in the cloud. No browser extensions, no desktop apps, no code to deploy.' },
  { icon: '💸', title: '99% Cheaper Than Crayon', desc: '$19/month vs $3,000+/month. Enterprise-grade competitor intelligence at indie maker prices.' },
];

const comparison = [
  { feature: 'AI change summaries', compwatch: true, visualping: false, distill: false, crayon: true },
  { feature: 'Change categorization (pricing/feature/content)', compwatch: true, visualping: false, distill: false, crayon: true },
  { feature: 'Business insights', compwatch: true, visualping: false, distill: false, crayon: true },
  { feature: 'Email notifications', compwatch: true, visualping: true, distill: true, crayon: true },
  { feature: 'Free plan', compwatch: true, visualping: true, distill: true, crayon: false },
  { feature: 'No browser extension needed', compwatch: true, visualping: true, distill: false, crayon: true },
  { feature: 'Starting price', compwatch: '$19/mo', visualping: '$16/mo', distill: '$15/mo', crayon: '$3,000+/mo' },
];

const useCases = [
  { icon: '🛒', title: 'E-commerce & DTC', desc: 'Track competitor pricing, product launches, and promotional campaigns. Know when they change prices before your customers do.' },
  { icon: '💻', title: 'SaaS Founders', desc: 'Monitor competitor landing pages, changelogs, and pricing tiers. Stay informed about feature releases and positioning changes.' },
  { icon: '📈', title: 'Marketing Teams', desc: 'Track competitor content strategy, SEO moves, and messaging changes. Spot trends before they become mainstream.' },
  { icon: '🏢', title: 'Agencies', desc: 'Monitor your clients\' competitors at scale. Deliver proactive competitive insights without the manual work.' },
];

const faqs = [
  { q: 'How does CompWatch differ from Visualping?', a: 'Visualping tells you "the page changed" with a screenshot diff. CompWatch uses AI to tell you WHAT changed (pricing went up 34%), categorize it (💰 Pricing), and explain what it means for your business. It\'s the difference between a security camera and a security analyst.' },
  { q: 'What websites can I monitor?', a: 'Any public webpage — competitor pricing pages, landing pages, blogs, changelogs, product pages. We support static HTML sites and most server-rendered pages. JavaScript-heavy SPAs may need our Pro plan (Playwright rendering).' },
  { q: 'How often do you check for changes?', a: 'Free plan: once daily. Pro plan: every 6 hours. Business plan: every hour. You can also trigger manual checks from the dashboard.' },
  { q: 'Is there a free plan?', a: 'Yes! Monitor up to 5 pages for free with daily checks and basic change notifications. AI-powered summaries and categorization require the Pro plan ($19/month).' },
  { q: 'Do I need to install anything?', a: 'No. CompWatch runs in the cloud. Just add URLs and we handle everything. No browser extensions, no code, no maintenance.' },
  { q: 'How accurate is the AI analysis?', a: 'We use Claude (by Anthropic) for analysis. We pre-filter noise (CSS changes, timestamps, counters) before AI processing. Every notification includes a 👍/👎 feedback button so we continuously improve accuracy.' },
];

const emailExample = `🔔 competitor.com — Pricing Page

💰 Pricing Change · Important

🧠 AI Summary
Competitor raised monthly pricing from $29 to $39 (+34%) and introduced
a new "Enterprise" tier at $199/month. Free trial shortened from 14 days
to 7 days.

What changed:
• Monthly plan: $29 → $39 (+34%)
• New "Enterprise" plan added at $199/month
• Free trial: 14 days → 7 days
• Added "Contact Sales" CTA for enterprise

💡 Insight
Competitor is moving upmarket with enterprise pricing while increasing
conversion pressure on self-serve (shorter trial + higher price).
Consider testing your own pricing or highlighting your free tier.`;

const faqSchema = { '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: faqs.map(f => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })) };
const softwareSchema = { '@context': 'https://schema.org', '@type': 'SoftwareApplication', name: 'CompWatch', applicationCategory: 'BusinessApplication', operatingSystem: 'Web', offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' }, description: 'AI-powered competitor website monitoring. Get daily summaries of what your competitors changed.' };

export default function HomePage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareSchema) }} />

      {/* Hero */}
      <section className="bg-gradient-to-br from-indigo-50 via-white to-purple-50 py-20 lg:py-28">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-block bg-indigo-100 text-[--color-primary] text-sm font-semibold px-4 py-1.5 rounded-full mb-6">
            🚀 The Visualping alternative with AI superpowers
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-gray-900 leading-tight">
            What Did Your Competitors <span className="text-[--color-primary]">Just Change?</span>
          </h1>
          <p className="mt-6 text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto">
            Add competitor URLs. Get daily AI summaries of every change — pricing updates, new features, content shifts. Stop guessing, start knowing.
          </p>
          <div className="mt-10">
            <WaitlistForm source="hero" />
          </div>
          <p className="mt-4 text-sm text-gray-500">Free plan: 5 pages, daily checks. No credit card required.</p>
        </div>
      </section>

      {/* Email Preview */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl sm:text-4xl font-bold text-center text-gray-900 mb-4">This Is What You'll Get Every Morning</h2>
          <p className="text-center text-gray-600 mb-12">A clean summary in your inbox. Not screenshots — real intelligence.</p>
          <div className="bg-gray-50 border border-gray-200 rounded-2xl p-6 sm:p-8 max-w-2xl mx-auto shadow-lg">
            <pre className="text-sm text-gray-700 whitespace-pre-wrap font-mono leading-relaxed">{emailExample}</pre>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl sm:text-4xl font-bold text-center text-gray-900">Why CompWatch?</h2>
          <p className="mt-4 text-center text-gray-600">Not another screenshot diff tool. Actual competitive intelligence.</p>
          <div className="mt-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map(f => (
              <div key={f.title} className="bg-white rounded-2xl p-8 hover:shadow-lg transition-shadow">
                <div className="text-4xl mb-4">{f.icon}</div>
                <h3 className="text-xl font-semibold text-gray-900">{f.title}</h3>
                <p className="mt-2 text-gray-600 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Use Cases */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl sm:text-4xl font-bold text-center text-gray-900">Built For</h2>
          <div className="mt-14 grid grid-cols-1 sm:grid-cols-2 gap-8">
            {useCases.map(u => (
              <div key={u.title} className="flex gap-4 p-6 bg-gray-50 rounded-2xl">
                <div className="text-3xl flex-shrink-0">{u.icon}</div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{u.title}</h3>
                  <p className="mt-1 text-gray-600 text-sm leading-relaxed">{u.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Comparison */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl sm:text-4xl font-bold text-center text-gray-900 mb-12">CompWatch vs Alternatives</h2>
          <div className="overflow-x-auto">
            <table className="w-full bg-white rounded-2xl overflow-hidden shadow">
              <thead>
                <tr className="bg-gray-50 text-sm text-gray-600">
                  <th className="text-left p-4 font-semibold">Feature</th>
                  <th className="p-4 font-semibold text-[--color-primary]">CompWatch</th>
                  <th className="p-4 font-semibold">Visualping</th>
                  <th className="p-4 font-semibold">Distill.io</th>
                  <th className="p-4 font-semibold">Crayon</th>
                </tr>
              </thead>
              <tbody>
                {comparison.map((row, i) => (
                  <tr key={i} className="border-t border-gray-100 text-sm">
                    <td className="p-4 text-gray-700 font-medium">{row.feature}</td>
                    {(['compwatch', 'visualping', 'distill', 'crayon'] as const).map(tool => {
                      const val = row[tool];
                      return (
                        <td key={tool} className={`p-4 text-center ${tool === 'compwatch' ? 'bg-indigo-50 font-semibold' : ''}`}>
                          {typeof val === 'boolean' ? (val ? '✅' : '❌') : val}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl sm:text-4xl font-bold text-center text-gray-900 mb-12">FAQ</h2>
          <div className="space-y-4">
            {faqs.map(faq => (
              <details key={faq.q} className="bg-gray-50 rounded-xl border border-gray-200">
                <summary className="flex items-center justify-between px-6 py-5 font-semibold text-gray-900 hover:bg-gray-100 cursor-pointer">
                  {faq.q}
                  <svg className="w-5 h-5 text-gray-500 transition-transform flex-shrink-0 ml-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
                </summary>
                <div className="px-6 pb-5 text-gray-600 leading-relaxed">{faq.a}</div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="py-20 bg-gradient-to-br from-indigo-600 to-purple-700">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">Stop Guessing. Start Monitoring.</h2>
          <p className="text-indigo-200 text-lg mb-10">Join the waitlist and be the first to know when CompWatch launches.</p>
          <WaitlistForm source="bottom-cta" />
        </div>
      </section>
    </>
  );
}
