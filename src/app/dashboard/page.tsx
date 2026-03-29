import type { Metadata } from 'next';
import WaitlistForm from '@/components/landing/WaitlistForm';

export const metadata: Metadata = { title: 'Dashboard — Coming Soon' };

export default function DashboardPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
      <div className="text-6xl mb-6">🚧</div>
      <h1 className="text-3xl font-extrabold text-gray-900 mb-4">Dashboard Coming Soon</h1>
      <p className="text-lg text-gray-600 mb-8">
        We're building the CompWatch dashboard. Join the waitlist to get early access.
      </p>
      <WaitlistForm source="dashboard" />
    </div>
  );
}
