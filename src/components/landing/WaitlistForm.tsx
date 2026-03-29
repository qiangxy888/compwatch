'use client';

import { useState } from 'react';

export default function WaitlistForm({ source = 'hero' }: { source?: string }) {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setStatus('loading');
    try {
      const res = await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, source }),
      });
      const data = await res.json();
      setStatus('success');
      setMessage(data.message || 'You\'re on the list!');
      setEmail('');
    } catch {
      setStatus('error');
      setMessage('Something went wrong. Please try again.');
    }
  };

  if (status === 'success') {
    return (
      <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-center">
        <p className="text-green-800 font-semibold">✅ {message}</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
      <input
        type="email"
        value={email}
        onChange={e => setEmail(e.target.value)}
        placeholder="your@email.com"
        required
        className="flex-1 px-4 py-3 rounded-xl border border-gray-300 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[--color-primary] focus:border-transparent"
      />
      <button
        type="submit"
        disabled={status === 'loading'}
        className="px-6 py-3 bg-[--color-primary] text-white rounded-xl font-semibold hover:bg-[--color-primary-dark] disabled:opacity-50 pulse-glow whitespace-nowrap"
      >
        {status === 'loading' ? 'Joining...' : 'Get Early Access →'}
      </button>
      {status === 'error' && <p className="text-red-500 text-sm mt-1">{message}</p>}
    </form>
  );
}
