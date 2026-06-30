'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { createPortal } from 'react-dom';
import Link from 'next/link';
import {
  Search,
  ShoppingCart,
  Heart,
  User,
  Menu,
  MapPin,
  X,
  Award,
  ShoppingBag,
  Users,
  Briefcase,
  Layers,
  Wrench,
  Globe,
  Send
} from 'lucide-react';

type ArtisanItem = {
  _id: string;
  name: string;
  role: string;
  location: string;
  bio: string;
  image: string;
  experience: number;
};

const MOCK_PRODUCTS = [
  { id: '1', title: 'Handmade clay pots', price: 'Rs 450/-', img: 'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&q=80&w=300' },
  { id: '2', title: 'Metallic utensils', price: 'Rs 450/-', img: 'https://images.unsplash.com/photo-1618220179428-22790b461013?auto=format&fit=crop&q=80&w=300' },
  { id: '3', title: 'Flower vase', price: 'Rs 450/-', img: 'https://images.unsplash.com/photo-1581781870027-04212e231e96?auto=format&fit=crop&q=80&w=300' },
  { id: '4', title: 'Clay Diya', price: 'Rs 100/-', img: 'https://images.unsplash.com/photo-1605714457788-b223d463f25c?auto=format&fit=crop&q=80&w=300' },
];

const API_BASE = "http://localhost:5000";

export default function ArtisanProfilePage() {
  const params = useParams();
  const artisanId = params.id as string;

  const [artisan, setArtisan] = useState<ArtisanItem | null>(null);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<{ show: boolean; message: string }>({ show: false, message: "" });

  useEffect(() => {
    if (artisanId) {
      fetchArtisanDetail();
    }
    const savedFavorites = localStorage.getItem('nepcraft_artisan_favorites');
    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites));
    }
  }, [artisanId]);

  const fetchArtisanDetail = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/artisans/${artisanId}`);
      const json = await res.json();
      
      if (json.success) {
        setArtisan(json.artisan);
      }
    } catch (error) {
      console.error("Error retrieving artisan profile details:", error);
    } finally {
      setLoading(false);
    }
  };

  // Follow button syncs perfectly to your wishlist localStorage state
  const handleFollowClick = (id: string, name: string) => {
    let updatedFavorites: string[];
    if (favorites.includes(id)) {
      updatedFavorites = favorites.filter(favId => favId !== id);
      triggerToast(`Removed ${name} from your wishlist.`);
    } else {
      updatedFavorites = [...favorites, id];
      triggerToast(`Added ${name} to your wishlist page!`);
    }
    setFavorites(updatedFavorites);
    localStorage.setItem('nepcraft_artisan_favorites', JSON.stringify(updatedFavorites));
  };

  const triggerToast = (msg: string) => {
    setToast({ show: true, message: msg });
    setTimeout(() => {
      setToast(prev => (prev.message === msg ? { show: false, message: "" } : prev));
    }, 4000);
  };

  const getImageUrl = (image: string) => {
    return image || "/default-avatar.png";
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FFFDFB] flex justify-center items-center text-sm font-medium text-[#8C7B75]">
        <span className="animate-pulse">Loading artisan profile portfolio...</span>
      </div>
    );
  }

  if (!artisan) {
    return (
      <div className="min-h-screen bg-[#FFFDFB] flex flex-col justify-center items-center gap-4 text-sm font-medium text-[#3D251E]">
        <p>Artisan profile data could not be found.</p>
        <Link href="/artisans" className="text-xs bg-[#C87A53] text-white px-4 py-2 rounded-lg">Return to Artisans</Link>
      </div>
    );
  }

  const isLiked = favorites.includes(artisan._id);

  return (
    <div className="min-h-screen bg-[#FFFDFB] text-[#3D251E] font-sans antialiased flex flex-col relative">
      
      {/* === GLOBAL PORTAL TOAST POPUP === */}
      {toast.show && typeof window !== 'undefined' && createPortal(
        <div className="fixed top-6 right-6 z-[100] flex items-center gap-3 bg-[#3D251E] text-[#FFFDFB] px-5 py-3.5 rounded-xl shadow-[0_20px_50px_rgba(0,0,0,0.3)] border border-[#5C4033] max-w-sm pointer-events-auto transition-all duration-300 animate-in slide-in-from-top-5">
          <Heart size={16} className="text-[#C87A53] fill-current shrink-0" />
          <p className="text-xs font-medium tracking-wide leading-relaxed">{toast.message}</p>
          <button onClick={() => setToast({ show: false, message: "" })} className="ml-4 p-1 rounded-lg hover:bg-white/10 text-white/60 hover:text-white transition-colors shrink-0">
            <X size={14} />
          </button>
        </div>,
        document.body
      )}

      {/* === HEADER (Standard matching image_a14f79.png) === */}
      <header className="border-b border-[#EFE4D6] bg-white px-6 py-4">
        <div className="grid grid-cols-3 items-center">
          <div className="flex items-center gap-2 justify-start">
            <img src="/vase.png" alt="NepCraft Logo" className="h-12 w-auto object-contain" />
            <div>
              <h1 className="font-serif text-[28px] leading-none text-[#5C4033] font-normal">NepCraft</h1>
              <p className="text-[10px] text-[#8C7B75] mt-0.5">Handmade with hearts</p>
            </div>
          </div>
          <div className="flex justify-center">
            <div className="relative w-full max-w-md">
              <input type="text" placeholder="Search products, artisans" className="w-full border border-[#E8D9CA] rounded-md py-2 pl-4 pr-10 text-sm focus:outline-none focus:border-[#C87A53] placeholder-[#A8928A]/60" />
              <Search size={18} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#C87A53]" />
            </div>
          </div>
          <div className="flex items-center justify-end gap-6 text-sm">
            <Link href="/cart" className="flex items-center gap-2 hover:text-[#C87A53] transition"><ShoppingCart size={18} /> <span>Cart</span></Link>
            <Link href="/wishlist" className="flex items-center gap-2 hover:text-[#C87A53] transition"><Heart size={18} /> <span>Wishlist</span></Link>
            <Link href="/login" className="flex items-center gap-2 hover:text-[#C87A53] transition"><User size={18} /> <span>Login</span></Link>
          </div>
        </div>
      </header>

      {/* === NAVIGATION BAR === */}
      <div className="px-6 py-2 flex justify-between items-center border-b border-[#F5EBE1] text-sm font-medium relative bg-white">
        <div className="relative group">
          <button className="flex items-center gap-2 border border-[#EFE4D6] px-3 py-1.5 rounded bg-white text-xs text-[#654E47] hover:bg-[#FAF4ED] transition-colors">
            <Menu className="w-3.5 h-3.5" /> Categories
          </button>
        </div>
        <nav className="absolute left-1/2 -translate-x-1/2 flex gap-12 text-[#654E47]">
          <Link href="/home" className="hover:text-[#C87A53] transition-colors">Home</Link>
          <Link href="/Shop" className="hover:text-[#C87A53] transition-colors">Shop</Link>
          <Link href="/artisans" className="text-[#C87A53] font-bold border-b border-[#C87A53] pb-0.5">Artisans</Link>
          <Link href="/aboutus" className="hover:text-[#C87A53] transition-colors">About Us</Link>
        </nav>
        <div className="w-24" />
      </div>

      {/* === MAIN CONTENT - Streamlined margins to match Figma padding === */}
      <main className="flex-grow px-6 py-10 w-full mx-auto">
        
        {/* ARTISAN INTRO SECTION */}
        <section className="flex flex-col md:flex-row items-center md:items-start gap-8 mb-10">
          <div className="w-48 h-48 rounded-full overflow-hidden shrink-0 border border-[#EFE4D6] shadow-sm bg-[#FAF1E6]">
            <img src={getImageUrl(artisan.image)} alt={artisan.name} className="w-full h-full object-cover" />
          </div>

          <div className="flex-grow text-center md:text-left pt-1">
            <h2 className="font-serif text-3xl font-bold text-[#3D251E] mb-1">{artisan.name}</h2>
            <p className="text-xs font-semibold text-[#A8928A] tracking-wide mb-2 uppercase">{artisan.role}</p>
            
            <div className="flex items-center justify-center md:justify-start gap-1 text-[#C87A53] text-xs font-medium mb-3">
              <MapPin size={13} strokeWidth={2.5} />
              <span>{artisan.location}</span>
            </div>
            
            <p className="text-[#654E47] text-xs font-light leading-relaxed max-w-xl mb-5">
              Specialization in traditional {artisan.role.toLowerCase()} with natural clay and earthy finishes.
            </p>

            <div className="flex items-center justify-center md:justify-start gap-3">
              <button className="bg-[#C87A53] hover:bg-[#B36640] text-white text-xs font-semibold px-5 py-2 rounded transition shadow-xs">
                Message Artisan
              </button>
              <button 
                onClick={() => handleFollowClick(artisan._id, artisan.name)}
                className={`flex items-center gap-1.5 border text-xs font-semibold px-5 py-2 rounded transition shadow-xs ${
                  isLiked ? 'bg-[#FFF2E5] border-[#C87A53] text-[#C87A53]' : 'bg-white border-[#EFE4D6] text-[#A8928A] hover:text-[#C87A53]'
                }`}
              >
                <Heart size={13} className={isLiked ? "fill-current text-[#C87A53]" : ""} />
                <span>{isLiked ? 'Following' : 'Follow'}</span>
              </button>
            </div>
          </div>
        </section>

        {/* STATS BANNER */}
        <section className="grid grid-cols-2 md:grid-cols-4 bg-[#FFFBF7] border border-[#F2E6DA] rounded-lg py-3 px-4 gap-4 mb-10 text-center items-center">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-2 border-r border-[#EFE4D6] last:border-0">
            <Award className="text-[#C87A53]" size={18} />
            <div className="text-left">
              <p className="text-xs font-bold text-[#3D251E]">{artisan.experience}+</p>
              <p className="text-[9px] text-[#8C7B75]">Years of Experience</p>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-2 md:border-r border-[#EFE4D6] last:border-0">
            <ShoppingBag className="text-[#C87A53]" size={18} />
            <div className="text-left">
              <p className="text-xs font-bold text-[#3D251E]">500+</p>
              <p className="text-[9px] text-[#8C7B75]">Products Sold</p>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-2 border-r border-[#EFE4D6] last:border-0">
            <Users className="text-[#C87A53]" size={18} />
            <div className="text-left">
              <p className="text-xs font-bold text-[#3D251E]">1.2k</p>
              <p className="text-[9px] text-[#8C7B75]">Customer engaged</p>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-2 last:border-0">
            <Briefcase className="text-[#C87A53]" size={18} />
            <div className="text-left">
              <p className="text-xs font-bold text-[#3D251E]">Featured</p>
              <p className="text-[9px] text-[#8C7B75]">Top artisans</p>
            </div>
          </div>
        </section>

        {/* BIOGRAPHY & SIDE SPECS */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12">
          <div className="lg:col-span-7">
            <h3 className="font-serif text-lg font-bold text-[#3D251E] mb-3">About {artisan.name.split(' ')[0]}</h3>
            <p className="text-[#654E47] text-xs font-light leading-relaxed mb-5">
              {artisan.bio || `I am ${artisan.name}, a pottery artist from ${artisan.location}. Inspired from her grandmother she started her pottery skills as a hobby. I creates beautiful and Eco-friendly pottery that blends tradition with functionality.`}
            </p>

            <div className="bg-[#FFFBF7] border border-[#F2E6DA] p-4 rounded-lg italic relative max-w-lg">
              <span className="text-3xl text-[#C87A53]/20 font-serif absolute top-1 left-2 leading-none">“</span>
              <p className="text-xs text-[#5C4033] leading-relaxed pl-4">
                Every piece of clay has a story. I shaped it with my hands, but it connects with your heart
              </p>
              <span className="block text-right text-[10px] font-bold text-[#3D251E] mt-1 font-serif">_{artisan.name}</span>
            </div>
          </div>

          <div className="lg:col-span-5 bg-white border border-[#F2E6DA] p-5 rounded-xl flex flex-col gap-4">
            <div className="flex gap-3 items-start">
              <div className="bg-[#FFF2E5] p-2 rounded-lg text-[#C87A53]"><Layers size={15} /></div>
              <div>
                <h4 className="text-xs font-bold text-[#3D251E] mb-0.5">Craft Specialization</h4>
                <p className="text-xs text-[#654E47] font-light">Traditional Pottery, Terracota, Earthy elements</p>
              </div>
            </div>
            <div className="flex gap-3 items-start">
              <div className="bg-[#FFF2E5] p-2 rounded-lg text-[#C87A53]"><Briefcase size={15} /></div>
              <div>
                <h4 className="text-xs font-bold text-[#3D251E] mb-0.5">Materials</h4>
                <p className="text-xs text-[#654E47] font-light">Natural clay, Organic glaze</p>
              </div>
            </div>
            <div className="flex gap-3 items-start">
              <div className="bg-[#FFF2E5] p-2 rounded-lg text-[#C87A53]"><Wrench size={15} /></div>
              <div>
                <h4 className="text-xs font-bold text-[#3D251E] mb-0.5">Techniques</h4>
                <p className="text-xs text-[#654E47] font-light">Wheel Throwing, Hand Building, Traditional Touch</p>
              </div>
            </div>
            <div className="flex gap-3 items-start">
              <div className="bg-[#FFF2E5] p-2 rounded-lg text-[#C87A53]"><Globe size={15} /></div>
              <div>
                <h4 className="text-xs font-bold text-[#3D251E] mb-0.5">Language</h4>
                <p className="text-xs text-[#654E47] font-light">Nepali, English</p>
              </div>
            </div>
          </div>
        </section>

        {/* PRODUCTS LIST */}
        <section className="mb-6">
          <h3 className="font-serif text-lg font-bold text-[#3D251E] mb-4">{artisan.name.split(' ')[0]}'s Top Selling Products</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {MOCK_PRODUCTS.map((product) => (
              <div key={product.id} className="bg-white border border-[#F2E6DA] rounded-xl p-2.5 flex flex-col justify-between group relative shadow-xs">
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-xs text-[8px] px-1.5 py-0.5 rounded font-medium text-[#3D251E] border border-[#EFE4D6]">
                  Pottery
                </div>
                <div className="w-full aspect-square rounded-lg overflow-hidden bg-[#FAF1E6] mb-2.5">
                  <img src={product.img} alt={product.title} className="w-full h-full object-cover group-hover:scale-102 transition duration-200" />
                </div>
                <div>
                  <h4 className="text-xs font-medium text-[#3D251E] mb-1 truncate">{product.title}</h4>
                  <div className="flex justify-between items-center mt-2 pt-1.5 border-t border-[#F5EBE1]">
                    <span className="text-xs font-bold text-[#3D251E]">{product.price}</span>
                    <button className="p-1 border border-[#EFE4D6] rounded hover:bg-[#FFF2E5] hover:text-[#C87A53] text-[#A8928A] transition">
                      <ShoppingCart size={12} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
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