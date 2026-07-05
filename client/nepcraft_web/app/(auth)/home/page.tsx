'use client';

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Footer from "../_components/footer";
import Header from "../_components/header";
import {
  ShoppingCart,
  Heart,
  ArrowRight,
  Loader2
} from "lucide-react";

type Slide = {
  title: string;
  desc: string;
  img: string;
};

// Defined Product Type matching your database schema
type Product = {
  _id: string;
  name: string;
  price: number;
  image: string;
  category?: string;
};

export default function NepCraftHome() {
  const slides: Slide[] = [
    {
      title: "Discover Handmade Nepalese Crafts",
      desc: "Supports local artisans and brings authentic pieces of Nepal to your doorstep.",
      img: "/landingPage.png"
    },
    {
      title: "Crafted with tradtion, Made with heart",
      desc: "Every single piece is beautifully crafted with culture, care and identity.",
      img: "/image-Photoroom.png"
    },
    {
      title: "Meet the hands behind every Every crafts",
      desc: "Your thoughtful purchase directly keeps rich Nepali heritage thriving and alive.",
      img: "/artisans.png"
    }
  ];

  const [current, setCurrent] = useState(0);
  
  // States for backend products
  const [products, setProducts] = useState<Product[]>([]);
  const [loadingProducts, setLoadingProducts] = useState<boolean>(true);

  // Auto-sliding banner effect
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 4500); 

    return () => clearInterval(interval);
  }, [slides.length]);

  // Fetch Featured Products from Backend API
  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/products");
        const data = await res.json();
        
        if (data.success || Array.isArray(data)) {
          const items = data.data || data;
          setProducts(items.slice(0, 5)); // Take top 5 items for the row layout
        }
      } catch (err) {
        console.error("Failed to load featured products:", err);
      } finally {
        setLoadingProducts(false);
      }
    };

    fetchFeaturedProducts();
  }, []);

  return (
    <div className="min-h-screen bg-[#FFFDFB] text-[#3D251E] font-sans antialiased">
      <Header />
      
      {/* === HERO SLIDER === */}
      <section className="px-6 lg:px-16 py-6">
        <div className="relative rounded-[32px] overflow-hidden min-h-[480px] lg:min-h-[520px] shadow-sm grid grid-cols-1 md:grid-cols-2 group">
          
          <div className="bg-[#FFF2E5] z-10 w-full p-8 lg:p-16 flex flex-col justify-center border-r border-[#FAFDFB]/10">
            <span className="text-[11px] font-bold tracking-widest text-[#C87A53] uppercase mb-3 block">
              Authentic Heritage
            </span>
            <h2 className="text-3xl lg:text-5xl font-serif font-black text-[#3D251E] leading-[1.15] mb-4">
              {slides[current].title}
            </h2>
            <p className="text-sm lg:text-base text-[#654E47] mb-8 max-w-sm font-medium leading-relaxed">
              {slides[current].desc}
            </p>

            <div className="flex flex-wrap gap-4">
              <Link
                href="/Shop"
                className="bg-[#C87A53] hover:bg-[#B36640] text-white text-xs lg:text-sm font-semibold px-7 py-3 rounded-xl shadow-md hover:shadow-lg transition-all active:scale-95"
              >
                Shop Now
              </Link>
              <Link
                href="/artisans"
                className="bg-white/80 backdrop-blur-sm hover:bg-white text-[#3D251E] border border-[#EFE4D6] text-xs lg:text-sm font-semibold px-7 py-3 rounded-xl transition-all active:scale-95 shadow-sm"
              >
                Explore Artisans
              </Link>
            </div>

            <div className="flex gap-2.5 mt-12">
              {slides.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrent(i)}
                  className={`h-2.5 rounded-full transition-all duration-300 ${
                    i === current ? "w-7 bg-[#C87A53]" : "w-2.5 bg-[#C87A53]/30 hover:bg-[#C87A53]/50"
                  }`}
                  aria-label={`Go to slide ${i + 1}`}
                />
              ))}
            </div>
          </div>

          <div className="relative w-full h-full bg-[#FAF1E6]">
            {slides.map((slide, i) => (
              <div
                key={i}
                className={`absolute inset-0 w-full h-full bg-cover bg-center transition-all duration-1000 ease-in-out ${
                  i === current ? "opacity-100 z-10 translate-x-0" : "opacity-0 -z-10 -translate-x-10"
                }`}
                style={{ backgroundImage: `url('${slide.img}')` }}
              />
            ))}
          </div>

        </div>
      </section>

      {/* === SHOP BY CATEGORY SECTION === */}
      <section className="px-6 lg:px-16 py-8">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-serif font-bold text-[#3D251E]">Shop by Category</h3>
          <Link href="/Shop" className="text-xs font-medium text-[#C87A53] flex items-center gap-1 hover:underline">
            View All <ArrowRight className="w-3 h-3" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {[
            { title: "Pottery", icon: "🏺", link: "/Shop?category=pottery" },
            { title: "Pashmina swals", icon: "🧣", link: "/Shop?category=pashmina" },
            { title: "Jewelry", icon: "📿", link: "/Shop?category=jewelry" },
            { title: "Woodwork", icon: "🪵", link: "/Shop?category=woodwork" },
            { title: "Idol statues", icon: "🔱", link: "/Shop?category=idols" },
            { title: "Souvenirs", icon: "🎁", link: "/Shop?category=souvenirs" },
          ].map((cat, idx) => (
            <Link
              href={cat.link}
              key={idx}
              className="bg-[#FFF2E5] border border-[#EFE4D6]/40 rounded-sm py-8 flex flex-col items-center justify-center text-center cursor-pointer transition-all hover:bg-[#FAF1E6]"
            >
              <div className="text-5xl mb-4 select-none">
                {cat.icon}
              </div>
              <span className="text-[11px] font-medium text-[#3D251E] tracking-tight">{cat.title}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* === DYNAMIC FEATURED PRODUCTS GRID ROW === */}
      <section className="px-6 lg:px-16 py-8">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-base font-serif font-bold text-[#3D251E]">Featured Products</h3>
          <Link href="/Shop" className="text-xs font-medium text-[#C87A53] flex items-center gap-1 hover:underline">
            View All <ArrowRight className="w-3 h-3" />
          </Link>
        </div>

        {loadingProducts ? (
          <div className="flex items-center justify-center py-16 text-[#A8928A] gap-2">
            <Loader2 className="animate-spin" size={20} />
            <span className="text-xs font-medium">Fetching unique crafts...</span>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-12 border border-dashed border-[#EFE4D6] rounded-xl bg-white">
            <p className="text-xs text-[#8C7B75]">No products available on the showcase shelf right now.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {products.map((item) => (
              <Link
                href={`/product/${item._id}`}
                key={item._id}
                className="bg-white border border-[#EFE4D6] rounded-xl overflow-hidden shadow-sm flex flex-col justify-between group hover:shadow-xl hover:-translate-y-1 transition-all"
              >
                <div className="relative aspect-square w-full bg-[#FAF1E6] overflow-hidden">
                  <img 
                    src={`http://localhost:5000/uploads/products/${item.image}`} 
                    alt={item.name} 
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300" 
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&q=80&w=400';
                    }}
                  />
                  <button className="absolute top-2 right-2 w-7 h-7 bg-white rounded-full flex items-center justify-center shadow text-[#A8928A] hover:text-red-500 transition-colors z-10">
                    <Heart className="w-3.5 h-3.5" />
                  </button>
                </div>
                <div className="p-3 bg-white">
                  <h4 className="text-[11px] font-medium text-[#A8928A] truncate">{item.name}</h4>
                  <div className="flex items-center justify-between mt-1 pt-2 border-t border-[#F5EBE1]">
                    <span className="text-xs font-bold text-[#3D251E] tracking-tight">Rs {item.price}/-</span>
                    <button className="w-6 h-6 border border-[#EFE4D6] rounded flex items-center justify-center text-[#C87A53] hover:bg-[#FAF1E6] transition-colors">
                      <ShoppingCart className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* === MEET THE ARTISANS === */}
      <section className="px-6 lg:px-16 py-8">
        <div className="bg-[#FFF2E5] rounded-3xl p-6 lg:p-10 flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
          <div className="flex flex-col sm:flex-row items-center gap-6 max-w-xl z-10">
            <div className="w-28 h-28 rounded-full overflow-hidden flex-shrink-0 border-2 border-white shadow-md">
              <img 
                src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=300" 
                alt="Artisan Profile Close-up" 
                className="w-full h-full object-cover"
              />
            </div>
            <div className="text-center sm:text-left">
              <h3 className="text-xl font-serif font-bold text-[#3D251E] mb-2">Meet the artisans</h3>
              <p className="text-[#654E47] text-xs leading-relaxed">
                Every piece has a story. Our story put their heart, skill and tradition into creating the timeless crafts.
              </p>
              <Link
                href="/artisans"
                className="mt-4 border border-[#C87A53] bg-white text-[#C87A53] hover:bg-[#FAF1E6] text-[11px] font-semibold px-4 py-1.5 rounded transition-colors inline-block"
              >
                View Artisans
              </Link>
            </div>
          </div>

          <div className="w-full md:w-auto z-10 flex justify-center">
            <img 
              src="https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&q=80&w=400" 
              alt="Artisan production stage snippet" 
              className="h-44 w-56 object-cover rounded-xl border border-white/50 shadow-md"
            />
          </div>
        </div>
      </section>

      {/* === TRUST BADGES === */}
      <section className="px-6 lg:px-16 py-8">
        <h3 className="text-base font-serif font-bold text-[#3D251E] mb-6">Why choose NepCraft?</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { title: "Supports local artisans", desc: "We help to empower local communities.", icon: "👥" },
            { title: "Eco friendly", desc: "Sustainable materials and eco-friendly practices.", icon: "🌱" },
            { title: "Made with love", desc: "Each piece is unique and crafted with heart.", icon: "💝" },
            { title: "Authentic and ethical", desc: "Fair wages and ethical working conditions.", icon: "🛡️" }
          ].map((box, idx) => (
            <div key={idx} className="bg-white border border-[#EFE4D6] rounded-xl p-4 flex items-start gap-3 shadow-sm">
              <div className="w-10 h-10 rounded-full bg-[#FFF2E5] flex items-center justify-center text-xl flex-shrink-0">
                {box.icon}
              </div>
              <div>
                <h4 className="text-xs font-bold text-[#3D251E] mb-1">{box.title}</h4>
                <p className="text-[11px] text-[#654E47] leading-tight">{box.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <Footer />
    </div>
  );
}