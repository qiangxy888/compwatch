import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-[--color-primary] rounded-lg flex items-center justify-center"><span className="text-white font-bold text-sm">👁</span></div>
              <span className="text-xl font-bold text-white">Comp<span className="text-[--color-primary-light]">Watch</span></span>
            </div>
            <p className="text-sm leading-relaxed">AI-powered competitor monitoring. Know what your competitors changed — before your customers do.</p>
          </div>
          <div>
            <h3 className="font-semibold text-white mb-4">Product</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/pricing" className="hover:text-white">Pricing</Link></li>
              <li><Link href="/blog" className="hover:text-white">Blog</Link></li>
              <li><Link href="/dashboard" className="hover:text-white">Dashboard</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-white mb-4">Our Tools</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="https://invoicefly.co" target="_blank" rel="noopener" className="hover:text-white">Invoice Generator</a></li>
              <li><a href="https://aiwritingcheck.com" target="_blank" rel="noopener" className="hover:text-white">AI Content Detector</a></li>
              <li><a href="https://wordcounthub.com" target="_blank" rel="noopener" className="hover:text-white">Word Counter</a></li>
              <li><a href="https://clearcut.tools" target="_blank" rel="noopener" className="hover:text-white">Background Remover</a></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-white mb-4">Legal</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/about" className="hover:text-white">About</Link></li>
              <li><Link href="/privacy" className="hover:text-white">Privacy</Link></li>
            </ul>
          </div>
        </div>
        <div className="mt-10 pt-8 border-t border-gray-800 text-center text-sm">
          © {new Date().getFullYear()} CompWatch. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
