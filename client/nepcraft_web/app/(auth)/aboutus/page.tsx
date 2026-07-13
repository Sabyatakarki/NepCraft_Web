'use client';

import React from 'react';
import Link from 'next/link';
import Header from "../_components/header";
import {
  Search,
  ShoppingCart,
  Heart,
  User,
  Menu,
  Send
} from 'lucide-react';

export default function AboutUsPage() {
  const missions = [
    {
      title: "Empower Artisans",
      desc: "We help skilled Nepali artisans showcase their handmade crafts and support their local communities.",
      icon: (
        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
      )
    },
    {
      title: "Preserve Heritage",
      desc: "Our mission is to protect and celebrate Nepal's traditional art, culture, and craftsmanship.",
      icon: (
        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      )
    },
    {
      title: "Sustainable Crafts",
      desc: "We encourage eco-friendly handmade products created with natural materials and traditional techniques.",
      icon: (
        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M7 11.5V14m0-2.5v-6a1.5 1.5 0 113 0m-3 6a1.5 1.5 0 00-3 0v2a7.5 7.5 0 0015 0v-5a1.5 1.5 0 00-3 0m-6-3V11m0-5.5v-1a1.5 1.5 0 013 0v1" />
        </svg>
      )
    },
    {
      title: "Global Connection",
      desc: "We aim to bring authentic Nepali handicrafts to people around the world through meaningful shopping experiences.",
      icon: (
        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
        </svg>
      )
    }
  ];

  const artisans = [
    { name: "Pema Tamang", img: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8cHJvZmlsZXxlbnwwfHwwfHx8MA%3D%3D" },
    { name: "Tshring Sherpa", img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=300" },
    { name: "Sushita Shrestha", img: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=300" },
    { name: "Sobha Basnet", img: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300" },
    { name: "Prashant Bist", img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=300" },
    { name: "Tilak Varma", img: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&q=80&w=300" }
  ];

  return (
    <div className="min-h-screen bg-[#FFFDFB] text-[#3D251E] font-sans antialiased">
<Header/>

      {/* === HERO BANNER SECTION === */}
      <section className="relative h-[260px] w-full">
        <div className="absolute inset-0  z-10" />
        <img 
          src="/about.jpg" 
          alt="Nepali Statues" 
          className="w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 z-20 flex flex-col justify-center px-6 lg:px-16 max-w-2xl text-white">
          <h2 className="font-serif text-4xl font-bold mb-4">About Us</h2>
          <p className="text-xs font-light leading-relaxed text-white/90">
            NepCraft connects skilled Nepali artisans with people around the world through authentic handmade crafts inspired by culture, tradition, and creativity.
          </p>
        </div>
      </section>

      {/* === OUR STORY SECTION === */}
      <section className="px-6 lg:px-16 py-16 bg-[#FFFDFB]">
        <h3 className="text-center font-serif text-2xl font-bold text-[#C87A53] mb-8">Our Story</h3>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center max-w-6.5xl mx-auto">
          
          <div className="lg:col-span-7 text-center lg:text-left">
            <p className="text-[#654E47] text-sm leading-loose max-w-2xl mx-auto lg:mx-0">
              NepCraft was created with a simple vision — to preserve Nepal's rich cultural heritage by supporting local artisans and bringing their handmade creations to people around the world. From beautifully crafted clay pots and traditional diyos to handmade textiles and woodwork.
            </p>
            <div className="mt-8 flex justify-center lg:justify-start">
              <Link href="/Shop" className="bg-[#C87A53] text-white text-xs font-semibold px-6 py-2.5 rounded hover:bg-[#B36640] transition shadow-sm">
                View Products
              </Link>
            </div>
          </div>

          {/* Overlapping Image Layout */}
        <div className="lg:col-span-5 flex justify-center items-center gap-4 h-[320px] relative mt-8 lg:mt-0">
        
        {/* Left Image - Smaller, sits lower */}
        <img 
            src="/pottery.jpg" 
            alt="Artisan Crafting 1" 
            className="w-[115px] h-[200px] object-cover rounded-3xl shadow-md transform translate-y-4"
        />
        
        {/* Middle Image - Significantly Higher and Dominant */}
        <img 
            src="/bowl.jpg" 
            alt="Artisan Crafting 2" 
            className="w-[140px] h-[290px] object-cover rounded-3xl shadow-xl z-10  transform -translate-y-0"
        />
    
        <img 
            src="/account.jpg" 
            alt="Artisan Crafting 3" 
            className="w-[115px] h-[200px] object-cover rounded-3xl shadow-md transform translate-y-4"
        />

        </div>

        </div>
      </section>

      {/* === OUR MISSIONS SECTION === */}
      <section className="px-6 lg:px-16 py-9 bg-[#FFFDFB]">
        <h3 className="text-center font-serif text-2xl font-bold text-[#C87A53] mb-12">Our Missions</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6.5xl mx-auto">
          {missions.map((m, i) => (
            <div key={i} className="bg-white rounded-2xl p-6 text-center border border-[#F2E6DA] shadow-[0_8px_30px_rgb(0,0,0,0.03)] relative pt-10">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-[#C87A53] rounded-full flex items-center justify-center shadow-md">
                {m.icon}
              </div>
              <h4 className="font-serif font-bold text-base text-[#3D251E] mb-3">{m.title}</h4>
              <p className="text-[#654E47] text-xs leading-relaxed font-light">{m.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* === MEET OUR ARTISANS SECTION === */}
      <section className="px-6 lg:px-16 py-16 bg-[#FFFDFB]">
        <h3 className="text-center font-serif text-2xl font-bold text-[#C87A53] mb-12">Meet Our Artisans</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 max-w-6.5xl mx-auto">
          {artisans.map((art, i) => (
            <div key={i} className="flex flex-col items-center text-center group">
              <div className="w-24 h-24 rounded-full overflow-hidden border border-[#EFE4D6] shadow-sm mb-3 bg-[#FAF1E6]">
                <img src={art.img} alt={art.name} className="w-full h-full object-cover group-hover:scale-105 transition duration-300" />
              </div>
              <h4 className="text-xs font-semibold text-[#3D251E] tracking-tight">{art.name}</h4>
            </div>
          ))}
        </div>
      </section>

      {/* === FOOTER COMPONENT === */}
      <footer className="bg-[#FFF2E5] pt-12 border-t border-[#EFE4D6]">
        <div className="px-6 lg:px-16 pb-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-lg font-serif font-black text-[#3D251E]">
                Nep<span className="text-[#C87A53]">Craft</span>
              </span>
            </div>
            <p className="text-[#654E47] text-[11px] leading-relaxed mb-4 max-w-xs">
              Bringing Nepal's rich heritage to your home. Handmade with love, made for you.
            </p>
            <div className="flex items-center gap-3 text-[#3D251E]">
              <a href="#" className="w-6 h-6 rounded-full bg-white flex items-center justify-center border border-[#EFE4D6] hover:text-[#C87A53] transition"><span className="text-xs">fb</span></a>
              <a href="#" className="w-6 h-6 rounded-full bg-white flex items-center justify-center border border-[#EFE4D6] hover:text-[#C87A53] transition"><span className="text-xs">ig</span></a>
              <a href="#" className="w-6 h-6 rounded-full bg-white flex items-center justify-center border border-[#EFE4D6] hover:text-[#C87A53] transition"><span className="text-xs">tk</span></a>
              <a href="#" className="w-6 h-6 rounded-full bg-white flex items-center justify-center border border-[#EFE4D6] hover:text-[#C87A53] transition"><span className="text-xs">yt</span></a>
            </div>
          </div>

          <div>
            <h5 className="text-xs font-bold text-[#3D251E] mb-3 uppercase tracking-wider">Shop</h5>
            <ul className="space-y-1.5 text-[11px] text-[#654E47]">
              <li><Link href="/shop" className="hover:text-[#C87A53]">Pottery</Link></li>
              <li><Link href="/shop" className="hover:text-[#C87A53]">WoodenWork</Link></li>
              <li><Link href="/shop" className="hover:text-[#C87A53]">Thangka</Link></li>
              <li><Link href="/shop" className="hover:text-[#C87A53]">Jewelry</Link></li>
              <li><Link href="/shop" className="hover:text-[#C87A53]">Pashmina shawls</Link></li>
            </ul>
          </div>

          <div>
            <h5 className="text-xs font-bold text-[#3D251E] mb-3 uppercase tracking-wider">Others</h5>
            <ul className="space-y-1.5 text-[11px] text-[#654E47]">
              <li><Link href="/about" className="hover:text-[#C87A53]">About Us</Link></li>
              <li><a href="#" className="hover:text-[#C87A53]">Stories</a></li>
              <li><Link href="/artisans" className="hover:text-[#C87A53]">Our Artisans</Link></li>
              <li><a href="#" className="hover:text-[#C87A53]">Contact Us</a></li>
              <li><a href="#" className="hover:text-[#C87A53]">Career</a></li>
            </ul>
          </div>

          <div>
            <h5 className="text-xs font-bold text-[#3D251E] mb-3 uppercase tracking-wider">Help</h5>
            <ul className="space-y-1.5 text-[11px] text-[#654E47]">
              <li><a href="#" className="hover:text-[#C87A53]">FAQ's</a></li>
              <li><a href="#" className="hover:text-[#C87A53]">Our materials</a></li>
              <li><a href="#" className="hover:text-[#C87A53]">Quality</a></li>
              <li><a href="#" className="hover:text-[#C87A53]">Returns</a></li>
              <li><a href="#" className="hover:text-[#C87A53]">Privacy policy</a></li>
            </ul>
          </div>

          <div>
            <h5 className="text-xs font-bold text-[#3D251E] mb-3 uppercase tracking-wider">Newsletter</h5>
            <p className="text-[11px] text-[#654E47] mb-3 leading-relaxed">Follow us to get new updates on arrivals and artisans</p>
            <div className="flex max-w-sm">
              <input type="email" placeholder="Enter your email" className="w-full bg-white border border-[#EFE4D6] rounded-l px-3 py-1.5 text-xs focus:outline-none text-[#3D251E]" />
              <button className="bg-[#C87A53] hover:bg-[#B36640] text-white px-3 rounded-r transition"><Send size={12} /></button>
            </div>
          </div>

        </div>

        <div className="bg-[#3D251E] py-3 text-center text-[10px] text-white/70 tracking-wide font-medium">
          <span>© 2026 NepCraft. All rights reserved.</span>
        </div>
      </footer>

    </div>
  );
}