'use client';

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import Header from '../_components/header';
import Footer from '../_components/footer';
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

      <Header />

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

      <Footer />

    </div>
  );
}