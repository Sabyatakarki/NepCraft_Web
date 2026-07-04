'use client';

import Link from 'next/link';
import { Send } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-[#FFF2E5] pt-12 border-t border-[#EFE4D6] mt-auto">
      <div className="px-6 lg:px-16 pb-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">

        {/* Brand */}
        <div className="lg:col-span-1">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-lg font-serif font-black tracking-tight text-[#3D251E]">
              Nep<span className="text-[#C87A53]">Craft</span>
            </span>
          </div>

          <p className="text-[#654E47] text-[11px] leading-relaxed mb-4 max-w-xs">
            Bringing Nepal&apos;s rich heritage to your home. Handmade with
            love, made for you.
          </p>

          <div className="flex items-center gap-3 text-[#3D251E]">
            {/* Facebook */}
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              className="w-6 h-6 rounded-full bg-white flex items-center justify-center border border-[#EFE4D6] hover:text-[#C87A53] transition-colors"
            >
              <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                <path d="M9 8H7v3h2v9h4v-9h3l.5-3H13V6c0-.5.5-1 1-1h2V2h-3a4 4 0 00-4 4v2z" />
              </svg>
            </a>

            {/* Instagram */}
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="w-6 h-6 rounded-full bg-white flex items-center justify-center border border-[#EFE4D6] hover:text-[#C87A53] transition-colors"
            >
              <svg
                className="w-3.5 h-3.5 stroke-current fill-none stroke-2"
                viewBox="0 0 24 24"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
              </svg>
            </a>

            {/* X */}
            <a
              href="https://x.com"
              target="_blank"
              rel="noopener noreferrer"
              className="w-6 h-6 rounded-full bg-white flex items-center justify-center border border-[#EFE4D6] hover:text-[#C87A53] transition-colors"
            >
              <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
            </a>

            {/* YouTube */}
            <a
              href="https://youtube.com"
              target="_blank"
              rel="noopener noreferrer"
              className="w-6 h-6 rounded-full bg-white flex items-center justify-center border border-[#EFE4D6] hover:text-[#C87A53] transition-colors"
            >
              <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                <path d="M23.498 6.163a3.003 3.003 0 00-2.11-2.11C19.517 3.545 12 3.545 12 3.545s-7.517 0-9.388.508a3.003 3.003 0 00-2.11 2.11C0 8.033 0 12 0 12s0 3.967.502 5.837a3.003 3.003 0 002.11 2.11c1.871.508 9.388.508 9.388.508s7.517 0 9.388-.508a3.003 3.003 0 002.11-2.11C24 15.967 24 12 24 12s0-3.967-.502-5.837zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
              </svg>
            </a>
          </div>
        </div>

        {/* Shop */}
        <div>
          <h5 className="text-xs font-bold text-[#3D251E] mb-3 uppercase tracking-wider">
            Shop
          </h5>

          <ul className="space-y-1.5 text-[11px] text-[#654E47]">
            <li><Link href="/Shop" className="hover:text-[#C87A53]">Pottery</Link></li>
            <li><Link href="/Shop" className="hover:text-[#C87A53]">Wooden Work</Link></li>
            <li><Link href="/Shop" className="hover:text-[#C87A53]">Thangka</Link></li>
            <li><Link href="/Shop" className="hover:text-[#C87A53]">Jewelry</Link></li>
            <li><Link href="/Shop" className="hover:text-[#C87A53]">Pashmina Shawls</Link></li>
          </ul>
        </div>

        {/* Others */}
        <div>
          <h5 className="text-xs font-bold text-[#3D251E] mb-3 uppercase tracking-wider">
            Others
          </h5>

            <ul className="space-y-1.5 text-[11px] text-[#654E47]">
        <li><Link href="/aboutus" className="hover:text-[#C87A53]">About Us</Link></li>
        <li><Link href="/artisans" className="hover:text-[#C87A53]">Our Artisans</Link></li>
        <li><Link href="/wishlist" className="hover:text-[#C87A53]">Wishlist</Link></li>
        <li><Link href="/profile" className="hover:text-[#C87A53]">My Account</Link></li>
        </ul>
        </div>

        {/* Help */}
        <div>
          <h5 className="text-xs font-bold text-[#3D251E] mb-3 uppercase tracking-wider">
            Help
          </h5>

          <ul className="space-y-1.5 text-[11px] text-[#654E47]">
            <li><Link href="/faq" className="hover:text-[#C87A53]">FAQ&apos;s</Link></li>
            <li><Link href="/materials" className="hover:text-[#C87A53]">Our Materials</Link></li>
            <li><Link href="/quality" className="hover:text-[#C87A53]">Quality</Link></li>
            <li><Link href="/returns" className="hover:text-[#C87A53]">Returns</Link></li>
            <li><Link href="/privacy-policy" className="hover:text-[#C87A53]">Privacy Policy</Link></li>
          </ul>
        </div>

        {/* Newsletter */}
        <div>
          <h5 className="text-xs font-bold text-[#3D251E] mb-3 uppercase tracking-wider">
            Newsletter
          </h5>

          <p className="text-[11px] text-[#654E47] mb-3 leading-relaxed">
            Follow us to get new updates on arrivals and artisans.
          </p>

          <div className="flex max-w-sm">
            <input
              type="email"
              placeholder="Enter your email"
              className="w-full bg-white border border-[#EFE4D6] rounded-l px-3 py-1.5 text-xs focus:outline-none placeholder-[#A8928A]/60 text-[#3D251E]"
            />

            <button className="bg-[#C87A53] hover:bg-[#B36640] text-white px-3 rounded-r flex items-center justify-center transition-colors">
              <Send className="w-3 h-3" />
            </button>
          </div>
        </div>

      </div>

      <div className="bg-[#3D251E] py-3 text-center text-[10px] text-white/70 tracking-wide font-medium flex items-center justify-center gap-1.5">
        <span className="inline-block border border-white/40 rounded-full w-4 h-4 text-center leading-3 text-[9px]">
          ©
        </span>

        <span>2026 NepCraft. All rights reserved.</span>
      </div>
    </footer>
  );
}