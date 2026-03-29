import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import GoogleAnalytics from '@/components/analytics/GoogleAnalytics';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: { default: 'CompWatch — AI Competitor Monitoring | Visualping Alternative', template: '%s | CompWatch' },
  description: 'AI-powered competitor website monitoring. Get daily summaries of what your competitors changed — pricing, features, content, SEO. The smart Visualping alternative.',
  keywords: ['competitor monitoring', 'website change detection', 'visualping alternative', 'competitor analysis tool', 'website monitoring', 'competitive intelligence'],
  openGraph: { title: 'CompWatch — AI Competitor Monitoring', description: 'Know what your competitors changed. AI summaries, not screenshots.', type: 'website' },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-white text-gray-900 antialiased`}>
        <GoogleAnalytics />
        <Header />
        <main className="min-h-screen">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
