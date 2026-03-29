import type { Metadata } from 'next';
import WaitlistForm from '@/components/landing/WaitlistForm';

export const metadata: Metadata = {
  title: 'Pricing — CompWatch AI Competitor Monitoring',
  description: 'CompWatch pricing: Free (5 pages), Pro $19/mo (25 pages + AI analysis), Business $49/mo (100 pages). 99% cheaper than Crayon.',
};

const plans = [
  {
    name: 'Free', price: '$0', period: 'forever', highlight: false,
    features: ['Monitor 5 pages', 'Daily checks', 'Basic change notifications', '7-day history', 'Email notifications'],
    cta: 'Get Started Free',
  },
  {
    name: 'Pro', price: '$19', period: '/month', highlight: true,
    features: ['Monitor 25 pages', 'Check every 6 hours', 'AI-powered summaries', 'Change categorization (💰🚀📝🔍)', '90-day history', 'Slack & Telegram notifications', 'Priority support'],
    cta: 'Start Pro Trial',
  },
  {
    name: 'Business', price: '$49', period: '/month', highlight: false, badge: 'Coming Soon',
    features: ['Monitor 100 pages', 'Hourly checks', 'Team collaboration', 'API access', 'Unlimited history', 'Weekly competitor reports', 'Custom integrations'],
    cta: 'Join Waitlist',
  },
];

export default function PricingPage() {
  return (
    <div className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900">Simple, Transparent Pricing</h1>
          <p className="mt-4 text-lg text-gray-600">Start free. Upgrade when you need AI intelligence.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {plans.map(plan => (
            <div key={plan.name} className={`rounded-2xl p-8 ${plan.highlight ? 'bg-[--color-primary] text-white ring-4 ring-indigo-200 scale-105' : 'bg-white border border-gray-200'} relative`}>
              {plan.badge && <span className="absolute top-4 right-4 bg-yellow-100 text-yellow-800 text-xs font-semibold px-2 py-1 rounded-full">{plan.badge}</span>}
              <h3 className={`text-lg font-semibold ${plan.highlight ? 'text-indigo-100' : 'text-gray-500'}`}>{plan.name}</h3>
              <div className="mt-4 flex items-baseline gap-1">
                <span className="text-4xl font-extrabold">{plan.price}</span>
                <span className={`text-sm ${plan.highlight ? 'text-indigo-200' : 'text-gray-500'}`}>{plan.period}</span>
              </div>
              <ul className="mt-8 space-y-3">
                {plan.features.map(f => (
                  <li key={f} className="flex items-start gap-2 text-sm">
                    <span className="flex-shrink-0 mt-0.5">{plan.highlight ? '✓' : '✓'}</span>
                    <span className={plan.highlight ? 'text-indigo-100' : 'text-gray-600'}>{f}</span>
                  </li>
                ))}
              </ul>
              <button className={`mt-8 w-full py-3 rounded-xl font-semibold text-sm ${plan.highlight ? 'bg-white text-[--color-primary] hover:bg-indigo-50' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>
                {plan.cta}
              </button>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <p className="text-gray-600 mb-6">Not ready to commit? Join the waitlist for launch updates.</p>
          <WaitlistForm source="pricing" />
        </div>
      </div>
    </div>
  );
}
