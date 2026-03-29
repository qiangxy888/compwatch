'use client';

import { useState } from 'react';
import Link from 'next/link';

const plans = [
  {
    name: 'Free', price: '$0', period: 'forever', highlight: false, plan: 'free',
    features: ['Monitor 5 pages', 'Daily checks', 'Basic change notifications', '7-day history', 'Email notifications'],
    cta: 'Get Started Free', ctaLink: '/login',
  },
  {
    name: 'Pro', price: '$19', yearlyPrice: '$15', period: '/month', highlight: true, plan: 'pro',
    features: ['Monitor 25 pages', 'Check every 6 hours', 'AI-powered summaries', 'Change categorization (💰🚀📝🔍)', '90-day history', 'Slack & Telegram notifications', 'Priority support'],
    cta: 'Start Pro Trial',
  },
  {
    name: 'Business', price: '$49', yearlyPrice: '$39', period: '/month', highlight: false, plan: 'business', badge: 'Coming Soon',
    features: ['Monitor 100 pages', 'Hourly checks', 'Team collaboration', 'API access', 'Unlimited history', 'Weekly competitor reports', 'Custom integrations'],
    cta: 'Join Waitlist',
  },
];

export default function PricingPage() {
  const [interval, setInterval] = useState<'monthly' | 'yearly'>('monthly');
  const [loading, setLoading] = useState<string | null>(null);

  const handleCheckout = async (plan: string) => {
    if (plan === 'free') { window.location.href = '/login'; return; }
    setLoading(plan);
    try {
      const res = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan, interval }),
      });
      const data = await res.json();
      if (data.url) { window.location.href = data.url; }
      else if (res.status === 401) { window.location.href = '/login'; }
      else { alert(data.error || 'Something went wrong'); }
    } catch { alert('Something went wrong'); }
    setLoading(null);
  };

  return (
    <div className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900">Simple, Transparent Pricing</h1>
          <p className="mt-4 text-lg text-gray-600">Start free. Upgrade when you need AI intelligence.</p>
        </div>

        {/* Interval Toggle */}
        <div className="flex justify-center mb-12">
          <div className="bg-gray-100 rounded-full p-1 flex gap-1">
            <button onClick={() => setInterval('monthly')} className={`px-5 py-2 rounded-full text-sm font-medium transition-colors ${interval === 'monthly' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500'}`}>Monthly</button>
            <button onClick={() => setInterval('yearly')} className={`px-5 py-2 rounded-full text-sm font-medium transition-colors ${interval === 'yearly' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500'}`}>
              Yearly <span className="text-green-600 text-xs font-semibold">Save 20%</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {plans.map(p => {
            const displayPrice = interval === 'yearly' && p.yearlyPrice ? p.yearlyPrice : p.price;
            return (
              <div key={p.name} className={`rounded-2xl p-8 ${p.highlight ? 'bg-[--color-primary] text-white ring-4 ring-indigo-200 scale-105' : 'bg-white border border-gray-200'} relative`}>
                {p.badge && <span className="absolute top-4 right-4 bg-yellow-100 text-yellow-800 text-xs font-semibold px-2 py-1 rounded-full">{p.badge}</span>}
                {p.highlight && <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-indigo-900 text-white text-xs font-semibold px-3 py-1 rounded-full">Most Popular</span>}
                <h3 className={`text-lg font-semibold ${p.highlight ? 'text-indigo-100' : 'text-gray-500'}`}>{p.name}</h3>
                <div className="mt-4 flex items-baseline gap-1">
                  <span className="text-4xl font-extrabold">{displayPrice}</span>
                  <span className={`text-sm ${p.highlight ? 'text-indigo-200' : 'text-gray-500'}`}>{p.period}</span>
                </div>
                {interval === 'yearly' && p.yearlyPrice && (
                  <p className={`text-xs mt-1 ${p.highlight ? 'text-indigo-200' : 'text-gray-400'}`}>
                    Billed ${parseInt(p.yearlyPrice.replace('$', '')) * 12}/year
                  </p>
                )}
                <ul className="mt-8 space-y-3">
                  {p.features.map(f => (
                    <li key={f} className="flex items-start gap-2 text-sm">
                      <span className="flex-shrink-0 mt-0.5 text-green-400">✓</span>
                      <span className={p.highlight ? 'text-indigo-100' : 'text-gray-600'}>{f}</span>
                    </li>
                  ))}
                </ul>
                {p.ctaLink ? (
                  <Link href={p.ctaLink} className={`mt-8 w-full py-3 rounded-xl font-semibold text-sm text-center block ${p.highlight ? 'bg-white text-[--color-primary] hover:bg-indigo-50' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>
                    {p.cta}
                  </Link>
                ) : (
                  <button
                    onClick={() => handleCheckout(p.plan)}
                    disabled={loading === p.plan || !!p.badge}
                    className={`mt-8 w-full py-3 rounded-xl font-semibold text-sm ${p.highlight ? 'bg-white text-[--color-primary] hover:bg-indigo-50' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'} disabled:opacity-50`}
                  >
                    {loading === p.plan ? 'Redirecting...' : p.cta}
                  </button>
                )}
              </div>
            );
          })}
        </div>

        {/* FAQ */}
        <div className="mt-20 max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-8">Pricing FAQ</h2>
          <div className="space-y-6">
            {[
              { q: 'Can I switch plans anytime?', a: 'Yes. Upgrade or downgrade at any time. Changes take effect immediately, with prorated billing.' },
              { q: 'What happens when I hit my page limit?', a: "You won't be able to add new monitors until you upgrade or remove existing ones. Existing monitors keep working." },
              { q: 'Is there a free trial for Pro?', a: 'The Free plan is your trial — use it as long as you want. When you need AI analysis and more pages, upgrade to Pro.' },
              { q: 'How does the AI analysis work?', a: 'Our AI (powered by Claude) reads the content diff and tells you what changed, categorizes it (pricing/feature/content), rates its importance, and provides a business insight.' },
              { q: 'What payment methods do you accept?', a: 'All major credit/debit cards via Stripe. We also support Apple Pay and Google Pay.' },
            ].map(({ q, a }) => (
              <div key={q} className="border-b border-gray-100 pb-6">
                <h3 className="font-semibold text-gray-900">{q}</h3>
                <p className="mt-2 text-gray-600 text-sm">{a}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
