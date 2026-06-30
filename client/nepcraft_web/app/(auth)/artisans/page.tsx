'use client';

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import Link from 'next/link';
import {
  Search,
  ShoppingCart,
  Heart,
  User,
  Menu,
  Send,
  MapPin,
  ChevronDown,
  X,
  Award
} from 'lucide-react';

// 2. Updated Artisan Type to perfectly match Backend Model
type ArtisanItem = {
  _id: string;
  name: string;
  role: string;
  location: string;
  bio: string;
  image: string;
  experience: number;
};

const API_BASE = "http://localhost:5000";

export default function ArtisansPage() {
  const [artisansList, setArtisansList] = useState<ArtisanItem[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]); 
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCraftType, setSelectedCraftType] = useState("All");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [toast, setToast] = useState<{ show: boolean; message: string }>({ show: false, message: "" });

  useEffect(() => {
    fetchArtisans();
    const savedFavorites = localStorage.getItem('nepcraft_artisan_favorites');
    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites));
    }
  }, []);

  // 1. Fixed Fetch Function to grab the correct "artisans" array key
  const fetchArtisans = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/artisans`);
      const json = await res.json();

      if (json.success) {
        setArtisansList(json.artisans);
      }
    } catch (error) {
      console.error("Error fetching artisans:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleFavoriteClick = (id: string, name: string) => {
    let updatedFavorites: string[];
    if (favorites.includes(id)) {
      updatedFavorites = favorites.filter(favId => favId !== id);
      triggerToast(`Removed ${name} from your wishlist.`);
    } else {
      updatedFavorites = [...favorites, id];
      triggerToast(`Added ${name} to wishlist!`);
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

  // 4. Updated getImageUrl function supporting clean fallback paths
  const getImageUrl = (image: string) => {
    if (!image) {
      return "/default-avatar.png"; // Dynamic fallback image asset
    }
    return image;
  };

  // Dynamic search and layout filtering
  const filteredArtisans = artisansList.filter(artisan => {
    const matchesSearch = artisan.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          artisan.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCraft = selectedCraftType === "All" || 
                         artisan.role?.toLowerCase() === selectedCraftType.toLowerCase();
    return matchesSearch && matchesCraft;
  });

  const uniqueCraftTypes = ["All", ...Array.from(new Set(artisansList.map(a => a.role).filter(Boolean)))];

  return (
    <div className="min-h-screen bg-[#FFFDFB] text-[#3D251E] font-sans antialiased flex flex-col relative">

      {/* === GLOBAL PORTAL NOTIFICATION TOAST POPUP === */}
      {toast.show && typeof window !== 'undefined' && createPortal(
        <div className="fixed top-6 right-6 z- flex items-center gap-3 bg-[#3D251E] text-[#FFFDFB] px-5 py-3.5 rounded-xl shadow-[0_20px_50px_rgba(0,0,0,0.3)] border border-[#5C4033] max-w-sm pointer-events-auto transition-all duration-300 animate-in slide-in-from-top-5">
          <Heart size={16} className="text-[#C87A53] fill-current shrink-0" />
          <p className="text-xs font-medium tracking-wide leading-relaxed">{toast.message}</p>
          <button 
            onClick={() => setToast({ show: false, message: "" })}
            className="ml-4 p-1 rounded-lg hover:bg-white/10 text-white/60 hover:text-white transition-colors shrink-0"
          >
            <X size={14} />
          </button>
        </div>,
        document.body
      )}

      {/* === TOP BAR HEADER === */}
      <header className="border-b border-[#EFE4D6] bg-white px-6 lg:px-16 py-4">
        <div className="grid grid-cols-3 items-center">
          {/* LOGO */}
          <div className="flex items-center gap-2 justify-start">
            <img src="/vase.png" alt="NepCraft Logo" className="h-12 w-auto object-contain" />
            <div>
              <h1 className="font-serif text-[28px] leading-none text-[#5C4033] font-normal">NepCraft</h1>
              <p className="text-[10px] text-[#8C7B75] mt-0.5">Handmade with hearts</p>
            </div>
          </div>

          {/* SEARCH */}
          <div className="flex justify-center">
            <div className="relative w-full max-w-md">
              <input
                type="text"
                placeholder="Search products, artisans..."
                className="w-full border border-[#E8D9CA] rounded-md py-2 pl-4 pr-10 text-sm focus:outline-none focus:border-[#C87A53] placeholder-[#A8928A]/60"
              />
              <Search size={18} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#C87A53]" />
            </div>
          </div>

          {/* RIGHT - Actions */}
          <div className="flex items-center justify-end gap-6 text-sm">
            <Link href="/cart" className="flex items-center gap-2 hover:text-[#C87A53] transition">
              <ShoppingCart size={18} /> <span>Cart</span>
            </Link>
            <Link href="/wishlist" className="flex items-center gap-2 hover:text-[#C87A53] transition">
              <Heart size={18} /> <span>Wishlist</span>
            </Link>
            <Link href="/login" className="flex items-center gap-2 hover:text-[#C87A53] transition">
              <User size={18} /> <span>Login</span>
            </Link>
          </div>
        </div>
      </header>

      {/* === NAVBAR === */}
      <div className="px-6 lg:px-16 py-2 flex justify-between items-center border-b border-[#F5EBE1] text-sm font-medium relative bg-white">
        <div className="relative group">
          <button className="flex items-center gap-2 border border-[#EFE4D6] px-3 py-1.5 rounded bg-white text-xs text-[#654E47] hover:bg-[#FAF4ED] transition-colors">
            <Menu className="w-3.5 h-3.5" /> Categories
          </button>
          <div className="absolute left-0 top-full mt-1 w-48 bg-white border border-[#EFE4D6] rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
            <Link href="/shop" className="block px-4 py-2.5 text-xs hover:bg-[#FFF2E5]">Pottery</Link>
            <Link href="/shop" className="block px-4 py-2.5 text-xs hover:bg-[#FFF2E5]">Pashmina Shawls</Link>
            <Link href="/shop" className="block px-4 py-2.5 text-xs hover:bg-[#FFF2E5]">Jewelry</Link>
            <Link href="/shop" className="block px-4 py-2.5 text-xs hover:bg-[#FFF2E5]">Woodwork</Link>
          </div>
        </div>

        <nav className="absolute left-1/2 -translate-x-1/2 flex gap-12 text-[#654E47]">
          <Link href="/home" className="hover:text-[#C87A53] transition-colors">Home</Link>
          <Link href="/Shop" className="hover:text-[#C87A53] transition-colors">Shop</Link>
          <Link href="/artisans" className="text-[#C87A53] font-bold border-b border-[#C87A53] pb-0.5">Artisans</Link>
          <Link href="/aboutus" className="hover:text-[#C87A53] transition-colors">About Us</Link>
        </nav>
        <div className="w-24" />
      </div>

      {/* === HERO BANNER SECTION === */}
      <section className="px-6 lg:px-16 pt-6 pb-2">
        <div className="bg-[#FFECD9] rounded-2xl overflow-hidden grid grid-cols-1 md:grid-cols-12 items-center min-h-[250px]">
          <div className="p-8 md:p-12 md:col-span-5 flex flex-col justify-center">
            <h2 className="font-serif text-3xl font-bold mb-3 text-[#3D251E] leading-tight max-w-sm">
              The Heart Behind Every Handmade Piece
            </h2>
            <p className="text-xs text-[#654E47] font-light leading-relaxed mb-6 max-w-sm">
              Meet and greet the talented artisans of Nepal who keep traditions alive with their skills and passion.
            </p>
            <div>
              <button className="bg-[#C87A53] text-white text-xs font-semibold px-5 py-2.5 rounded hover:bg-[#B36640] transition shadow-sm">
                DM Artisans
              </button>
            </div>
          </div>
          <div className="md:col-span-7 hidden md:block min-h-[250px]">
            <img src="/artisans.png" alt="Artisans" className="w-full h-[280px] object-cover" />
          </div>
        </div>
      </section>

      {/* === UTILITIES FILTER BAR === */}
      <div className="px-6 lg:px-16 pt-6 pb-2 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex flex-col sm:flex-row gap-3 items-center w-full sm:w-auto relative">
          <div className="relative w-full sm:w-64">
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search artisans..." 
              className="w-full bg-white border border-[#EFE4D6] rounded-md py-1.5 pl-3 pr-8 text-xs focus:outline-none focus:border-[#C87A53] text-[#3D251E]"
            />
            <Search size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#A8928A]" />
          </div>
          
          {/* Craft Type Selector */}
          <div className="relative w-full sm:w-auto">
            <button 
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center justify-between gap-2 border border-[#EFE4D6] px-3 py-1.5 rounded bg-[#FFF2E5] text-xs text-[#3D251E] font-medium w-full sm:w-auto min-w-[130px]"
            >
              <span>Craft: <strong>{selectedCraftType}</strong></span>
              <ChevronDown size={14} className="text-[#C87A53]" />
            </button>
            {isDropdownOpen && (
              <div className="absolute left-0 mt-1 w-40 bg-white border border-[#EFE4D6] rounded-lg shadow-lg z-30 py-1">
                {uniqueCraftTypes.map((type) => (
                  <button
                    key={type}
                    onClick={() => {
                      setSelectedCraftType(type || "All");
                      setIsDropdownOpen(false);
                    }}
                    className="block w-full text-left px-4 py-2 text-xs text-[#3D251E] hover:bg-[#FFF2E5] font-medium"
                  >
                    {type}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        <p className="font-serif font-black text-sm text-[#3D251E] self-end sm:self-auto">
          All Artisans ({filteredArtisans.length})
        </p>
      </div>

      {/* === ARTISANS GRID LAYOUT === */}
      <section className="px-6 lg:px-16 pb-16 pt-4 flex-grow">
        {loading ? (
          <div className="flex justify-center items-center py-24 text-sm font-medium text-[#8C7B75]">
            <span className="animate-pulse">Loading NepCraft artisans...</span>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredArtisans.map((artisan) => {
              const isLiked = favorites.includes(artisan._id);
              return (
                <div 
                  key={artisan._id} 
                  className="bg-white border border-[#F2E6DA] rounded-2xl p-5 shadow-[0_4px_20px_rgba(0,0,0,0.02)] flex flex-col justify-between relative group hover:shadow-[0_4px_25px_rgba(199,122,83,0.06)] transition-all duration-300"
                >
                  {/* Experience Badge layout */}
                  <div className="absolute top-4 right-4 bg-[#FFF2E5] border border-[#F5EBE1] rounded-full px-2 py-0.5 flex items-center gap-1 text-[10px] text-[#C87A53] font-semibold shadow-sm z-10">
                    <Award size={10} />
                    <span>{artisan.experience} yrs</span>
                  </div>

                  <div className="flex flex-col items-center pt-2">
                    <div className="w-28 h-28 rounded-full overflow-hidden border border-[#EFE4D6] shadow-sm bg-[#FAF1E6] mb-4">
                      {/* 3. Updated Image path source configuration */}
                      <img 
                        src={getImageUrl(artisan.image)} 
                        alt={artisan.name} 
                        className="w-full h-full object-cover group-hover:scale-105 transition duration-300" 
                      />
                    </div>

                    <div className="w-full text-left">
                      <h3 className="font-serif font-bold text-base text-[#3D251E] mb-0.5 tracking-tight">
                        {artisan.name}
                      </h3>
                      <p className="text-[11px] font-semibold text-[#A8928A] uppercase tracking-wider mb-2">
                        {artisan.role}
                      </p>
                      
                      <div className="flex items-center gap-1 text-[#C87A53] text-xs font-medium mb-2">
                        <MapPin size={12} strokeWidth={2.5} />
                        <span>{artisan.location}</span>
                      </div>

                      <p className="text-[#654E47] text-xs font-light leading-relaxed line-clamp-3 mb-4 min-h-[54px]">
                        {artisan.bio}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pt-2 border-t border-[#F5EBE1] w-full">
                    <Link href={`/artisans/${artisan._id}`} className="flex-1 bg-[#C87A53] text-white text-xs font-semibold py-2 rounded-lg hover:bg-[#B36640] transition text-center shadow-sm">
                      View Profile
                    </Link>
                    <button 
                      onClick={() => handleFavoriteClick(artisan._id, artisan.name)}
                      className={`w-8 h-8 border border-[#EFE4D6] rounded-lg flex items-center justify-center transition-colors bg-white shadow-sm ${
                        isLiked ? 'text-[#C87A53]' : 'text-[#A8928A] hover:text-[#C87A53] hover:bg-[#FFF2E5]'
                      }`}
                    >
                      <Heart size={14} className={isLiked ? "fill-current" : ""} />
                    </button>
                  </div>

                </div>
              );
            })}
          </div>
        )}
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