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
  Send,
  MessageCircle,
  Check,
  ChevronRight,
  Sparkles
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

type ProductItem = {
  _id: string;
  name: string;
  price: number;
  category: string;
  image: string;
};

const API_BASE = "http://localhost:5000";
const PRODUCT_IMAGE_BASE = "http://localhost:5000/uploads/products";

export default function ArtisanProfilePage() {
  const params = useParams();
  const artisanId = params.id as string;

  const [artisan, setArtisan] = useState<ArtisanItem | null>(null);
  const [artisanProducts, setArtisanProducts] = useState<ProductItem[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingProducts, setLoadingProducts] = useState(true);
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
        if (json.artisan?.role) {
          fetchRelatedProducts(json.artisan.role);
        }
      }
    } catch (error) {
      console.error("Error retrieving artisan profile details:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchRelatedProducts = async (craftRole: string) => {
    try {
      const res = await fetch(`${API_BASE}/api/products`);
      const json = await res.json();
      
      if (json.data) {
        const filtered = json.data.filter((product: ProductItem) => 
          product.category?.toLowerCase() === craftRole.toLowerCase()
        );
        setArtisanProducts(filtered);
      }
    } catch (error) {
      console.error("Error fetching related artisan products:", error);
    } finally {
      setLoadingProducts(false);
    }
  };

  const handleFollowClick = (id: string, name: string) => {
    let updatedFavorites: string[];
    if (favorites.includes(id)) {
      updatedFavorites = favorites.filter(favId => favId !== id);
      triggerToast(`Removed ${name} from your following list.`);
    } else {
      updatedFavorites = [...favorites, id];
      triggerToast(`You are now following ${name}!`);
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
      <div className="min-h-screen bg-[#FAF6F0] flex flex-col justify-center items-center gap-3 text-sm font-medium text-[#8C7B75]">
        <div className="w-10 h-10 border-3 border-[#C87A53]/30 border-t-[#C87A53] rounded-full animate-spin" />
        <span className="tracking-wide text-xs uppercase font-semibold text-[#654E47]">Loading artisan profile...</span>
      </div>
    );
  }

  if (!artisan) {
    return (
      <div className="min-h-screen bg-[#FAF6F0] flex flex-col justify-center items-center gap-4 text-sm font-medium text-[#3D251E] p-6 text-center">
        <div className="w-16 h-16 rounded-full bg-[#EFE4D6] flex items-center justify-center text-[#C87A53] mb-2">
          <User size={32} />
        </div>
        <p className="text-base font-serif font-semibold">Artisan profile could not be found.</p>
        <p className="text-xs text-[#8C7B75] max-w-sm -mt-2">The profile you are looking for might have been moved or doesn't exist anymore.</p>
        <Link href="/artisans" className="text-xs font-semibold bg-[#C87A53] hover:bg-[#B36640] text-white px-5 py-2.5 rounded-xl shadow-xs transition">
          Return to Artisans
        </Link>
      </div>
    );
  }

  const isLiked = favorites.includes(artisan._id);
  const firstName = artisan.name.split(' ')[0];

  return (
    <div className="min-h-screen bg-[#FAF6F0] text-[#3D251E] font-sans antialiased flex flex-col relative">
      
      {/* Toast Notification */}
      {toast.show && typeof window !== 'undefined' && createPortal(
        <div className="fixed top-6 right-6 z-50 flex items-center gap-3 bg-[#3D251E] text-[#FFFDFB] px-5 py-3.5 rounded-2xl shadow-2xl border border-[#5C4033] max-w-sm transition-all duration-300 animate-in fade-in slide-in-from-top-4">
          <Heart size={16} className="text-[#C87A53] fill-current shrink-0" />
          <p className="text-xs font-medium tracking-wide leading-relaxed">{toast.message}</p>
          <button 
            onClick={() => setToast({ show: false, message: "" })} 
            className="ml-auto p-1 rounded-lg hover:bg-white/10 text-white/60 hover:text-white transition-colors shrink-0"
          >
            <X size={14} />
          </button>
        </div>,
        document.body
      )}

      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-[#EFE4D6] px-6 py-3.5">
        <div className="max-w-7xl mx-auto grid grid-cols-12 items-center gap-4">
          
          <div className="col-span-6 md:col-span-3 flex items-center gap-3">
            <img src="/vase.png" alt="NepCraft Logo" className="h-10 w-auto object-contain" />
            <div>
              <h1 className="font-serif text-2xl leading-none text-[#3D251E] font-bold tracking-tight">
                Nep<span className="text-[#C87A53]">Craft</span>
              </h1>
              <p className="text-[10px] text-[#8C7B75] uppercase tracking-wider font-semibold mt-0.5">Handmade with hearts</p>
            </div>
          </div>

          <div className="hidden md:flex col-span-6 justify-center">
            <div className="relative w-full max-w-md">
              <input 
                type="text" 
                placeholder="Search products, traditional artisans..." 
                className="w-full bg-[#FAF6F0] border border-[#E8D9CA] rounded-full py-2 pl-4 pr-10 text-xs focus:outline-none focus:border-[#C87A53] focus:bg-white transition-all placeholder-[#A8928A]" 
              />
              <Search size={16} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#C87A53]" />
            </div>
          </div>

          <div className="col-span-6 md:col-span-3 flex items-center justify-end gap-5 text-xs font-medium text-[#5C4033]">
            <Link href="/cart" className="flex items-center gap-1.5 hover:text-[#C87A53] transition">
              <ShoppingCart size={17} /> 
              <span className="hidden sm:inline">Cart</span>
            </Link>
            <Link href="/wishlist" className="flex items-center gap-1.5 hover:text-[#C87A53] transition">
              <Heart size={17} /> 
              <span className="hidden sm:inline">Wishlist</span>
            </Link>
            <Link href="/login" className="flex items-center gap-1.5 hover:text-[#C87A53] transition">
              <User size={17} /> 
              <span className="hidden sm:inline">Login</span>
            </Link>
          </div>

        </div>
      </header>

      {/* Navigation Bar */}
      <div className="bg-white border-b border-[#EFE4D6] px-6 py-2.5 text-xs font-medium text-[#654E47]">
        <div className="max-w-7xl mx-auto flex justify-between items-center relative">
          <button className="flex items-center gap-2 border border-[#EFE4D6] px-3.5 py-1.5 rounded-lg bg-[#FAF6F0] hover:bg-[#EFE4D6] transition-colors text-xs font-semibold text-[#3D251E]">
            <Menu className="w-3.5 h-3.5 text-[#C87A53]" /> Categories
          </button>
          
          <nav className="hidden sm:flex gap-8 font-medium">
            <Link href="/home" className="hover:text-[#C87A53] transition-colors">Home</Link>
            <Link href="/Shop" className="hover:text-[#C87A53] transition-colors">Shop</Link>
            <Link href="/artisans" className="text-[#C87A53] font-bold relative after:content-[''] after:absolute after:-bottom-2.5 after:left-0 after:w-full after:h-0.5 after:bg-[#C87A53]">
              Artisans
            </Link>
            <Link href="/aboutus" className="hover:text-[#C87A53] transition-colors">About Us</Link>
          </nav>

          <div className="flex items-center gap-1 text-[11px] text-[#8C7B75]">
            <Link href="/artisans" className="hover:underline">Artisans</Link>
            <ChevronRight size={12} />
            <span className="text-[#3D251E] font-semibold truncate max-w-[100px]">{artisan.name}</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 py-8">
        
        {/* Profile Banner */}
        <section className="bg-white border border-[#EFE4D6] rounded-3xl p-6 sm:p-8 shadow-xs mb-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-[#FFF2E5] via-[#FAF6F0]/40 to-transparent rounded-full -mr-20 -mt-20 pointer-events-none" />

          <div className="flex flex-col md:flex-row items-center md:items-start gap-8 relative z-10">
            {/* Avatar */}
            <div className="relative group shrink-0">
              <div className="w-40 h-40 sm:w-44 sm:h-44 rounded-2xl overflow-hidden border-2 border-[#EFE4D6] shadow-md bg-[#FAF1E6] relative">
                <img 
                  src={getImageUrl(artisan.image)} 
                  alt={artisan.name} 
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
                />
              </div>
              <div className="absolute -bottom-2 -right-2 bg-[#C87A53] text-white text-[10px] font-bold px-2.5 py-1 rounded-full shadow-md flex items-center gap-1">
                <Sparkles size={11} /> Master
              </div>
            </div>

            {/* Info */}
            <div className="flex-grow text-center md:text-left">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-3">
                <div>
                  <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#3D251E] tracking-tight">{artisan.name}</h2>
                  <p className="text-xs font-bold text-[#C87A53] tracking-wider uppercase mt-1">{artisan.role}</p>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-center md:justify-start gap-3">
                  <button className="bg-[#C87A53] hover:bg-[#B36640] text-white text-xs font-semibold px-5 py-2.5 rounded-xl shadow-sm transition-all flex items-center gap-2 hover:scale-[1.02]">
                    <MessageCircle size={15} /> Message
                  </button>
                  <button 
                    onClick={() => handleFollowClick(artisan._id, artisan.name)}
                    className={`flex items-center gap-2 border text-xs font-semibold px-5 py-2.5 rounded-xl transition-all shadow-xs ${
                      isLiked 
                        ? 'bg-[#FFF2E5] border-[#C87A53] text-[#C87A53]' 
                        : 'bg-white border-[#E8D9CA] text-[#654E47] hover:border-[#C87A53] hover:text-[#C87A53]'
                    }`}
                  >
                    <Heart size={15} className={isLiked ? "fill-current text-[#C87A53]" : ""} />
                    <span>{isLiked ? 'Following' : 'Follow'}</span>
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-center md:justify-start gap-1.5 text-[#654E47] text-xs font-medium mb-4">
                <MapPin size={14} className="text-[#C87A53]" />
                <span>{artisan.location}</span>
                <span className="text-[#A8928A]">•</span>
                <span className="text-[#8C7B75]">Nepal Handcraft Guild Verified</span>
              </div>

              <p className="text-[#654E47] text-xs leading-relaxed max-w-2xl font-normal">
                Specialization in traditional {artisan.role.toLowerCase()} with natural clays, authentic hand-glazing, and eco-friendly heritage techniques passed down through generations.
              </p>
            </div>
          </div>
        </section>

        {/* Key Metrics Banner */}
        <section className="grid grid-cols-2 md:grid-cols-4 bg-white border border-[#EFE4D6] rounded-2xl py-4 px-6 gap-6 mb-8 shadow-xs">
          <div className="flex items-center gap-3.5 border-r border-[#F5EBE1] last:border-0 pr-2">
            <div className="w-10 h-10 rounded-xl bg-[#FFF2E5] flex items-center justify-center text-[#C87A53] shrink-0">
              <Award size={20} />
            </div>
            <div>
              <p className="text-sm font-bold text-[#3D251E]">{artisan.experience}+ Years</p>
              <p className="text-[11px] text-[#8C7B75]">Craft Experience</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5 md:border-r border-[#F5EBE1] last:border-0 pr-2">
            <div className="w-10 h-10 rounded-xl bg-[#FFF2E5] flex items-center justify-center text-[#C87A53] shrink-0">
              <ShoppingBag size={20} />
            </div>
            <div>
              <p className="text-sm font-bold text-[#3D251E]">500+ Items</p>
              <p className="text-[11px] text-[#8C7B75]">Handcrafted Sold</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5 border-r border-[#F5EBE1] last:border-0 pr-2">
            <div className="w-10 h-10 rounded-xl bg-[#FFF2E5] flex items-center justify-center text-[#C87A53] shrink-0">
              <Users size={20} />
            </div>
            <div>
              <p className="text-sm font-bold text-[#3D251E]">1.2k</p>
              <p className="text-[11px] text-[#8C7B75]">Community Supporters</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5 last:border-0 pr-2">
            <div className="w-10 h-10 rounded-xl bg-[#FFF2E5] flex items-center justify-center text-[#C87A53] shrink-0">
              <Briefcase size={20} />
            </div>
            <div>
              <p className="text-sm font-bold text-[#3D251E]">Top Rated</p>
              <p className="text-[11px] text-[#8C7B75]">Master Craftsperson</p>
            </div>
          </div>
        </section>

        {/* Bio & Craft Details */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-10">
          
          {/* Biography */}
          <div className="lg:col-span-7 bg-white border border-[#EFE4D6] p-6 sm:p-7 rounded-2xl shadow-xs flex flex-col justify-between">
            <div>
              <h3 className="font-serif text-xl font-bold text-[#3D251E] mb-3">About {firstName}</h3>
              <p className="text-[#654E47] text-xs font-normal leading-relaxed mb-6">
                {artisan.bio || `I am ${artisan.name}, a dedicated artisan based in ${artisan.location}. My work is deeply connected to Nepal's rich cultural traditions, combining organic materials with traditional craftsmanship to create functional works of art.`}
              </p>
            </div>

            <div className="bg-[#FAF6F0] border-l-3 border-[#C87A53] p-4 rounded-r-xl relative">
              <p className="text-xs text-[#5C4033] font-serif italic leading-relaxed">
                “Every piece of clay has a story. I shape it with my hands, but it connects with your heart.”
              </p>
              <span className="block text-right text-[11px] font-bold text-[#C87A53] mt-2 font-sans">— {artisan.name}</span>
            </div>
          </div>

          {/* Specialization Specs */}
          <div className="lg:col-span-5 bg-white border border-[#EFE4D6] p-6 sm:p-7 rounded-2xl shadow-xs flex flex-col justify-between gap-4">
            <h3 className="font-serif text-lg font-bold text-[#3D251E] pb-2 border-b border-[#F5EBE1]">Craft Specifications</h3>
            
            <div className="space-y-4">
              <div className="flex gap-3.5 items-start">
                <div className="bg-[#FFF2E5] p-2 rounded-xl text-[#C87A53] shrink-0 mt-0.5"><Layers size={16} /></div>
                <div>
                  <h4 className="text-xs font-bold text-[#3D251E]">Craft Specialization</h4>
                  <p className="text-xs text-[#654E47] mt-0.5">Traditional Pottery, Terracotta & Earthy Glazes</p>
                </div>
              </div>

              <div className="flex gap-3.5 items-start">
                <div className="bg-[#FFF2E5] p-2 rounded-xl text-[#C87A53] shrink-0 mt-0.5"><Briefcase size={16} /></div>
                <div>
                  <h4 className="text-xs font-bold text-[#3D251E]">Materials Used</h4>
                  <p className="text-xs text-[#654E47] mt-0.5">Natural clay, Organic eco-glazes, Mineral pigments</p>
                </div>
              </div>

              <div className="flex gap-3.5 items-start">
                <div className="bg-[#FFF2E5] p-2 rounded-xl text-[#C87A53] shrink-0 mt-0.5"><Wrench size={16} /></div>
                <div>
                  <h4 className="text-xs font-bold text-[#3D251E]">Techniques</h4>
                  <p className="text-xs text-[#654E47] mt-0.5">Wheel Throwing, Hand Sculpting, Kiln Firing</p>
                </div>
              </div>

              <div className="flex gap-3.5 items-start">
                <div className="bg-[#FFF2E5] p-2 rounded-xl text-[#C87A53] shrink-0 mt-0.5"><Globe size={16} /></div>
                <div>
                  <h4 className="text-xs font-bold text-[#3D251E]">Languages Spoken</h4>
                  <p className="text-xs text-[#654E47] mt-0.5">Nepali, Newari, English</p>
                </div>
              </div>
            </div>
          </div>

        </section>

        {/* Artisan Catalogue */}
        <section className="mb-8">
          <div className="flex justify-between items-end mb-5">
            <div>
              <h3 className="font-serif text-2xl font-bold text-[#3D251E]">{firstName}'s Handmade Creations</h3>
              <p className="text-xs text-[#8C7B75] mt-1">Explore authentic handcrafted pieces created directly in this artisan's workshop.</p>
            </div>
          </div>
          
          {loadingProducts ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[1, 2, 3, 4].map((n) => (
                <div key={n} className="bg-white border border-[#EFE4D6] rounded-2xl p-3 animate-pulse">
                  <div className="w-full aspect-square bg-[#FAF6F0] rounded-xl mb-3" />
                  <div className="h-3 bg-[#FAF6F0] rounded w-3/4 mb-2" />
                  <div className="h-3 bg-[#FAF6F0] rounded w-1/2" />
                </div>
              ))}
            </div>
          ) : artisanProducts.length === 0 ? (
            <div className="text-xs text-[#8C7B75] py-12 bg-white border border-[#EFE4D6] rounded-2xl px-4 text-center">
              No product items are currently catalogued under this artisan's primary role.
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-5">
              {artisanProducts.map((product) => (
                <div key={product._id} className="bg-white border border-[#EFE4D6] rounded-2xl p-3 flex flex-col justify-between group hover:shadow-md transition-all duration-300 relative">
                  
                  <span className="absolute top-5 left-5 bg-white/90 backdrop-blur-xs text-[9px] font-bold tracking-wider px-2 py-0.5 rounded-full text-[#5C4033] border border-[#EFE4D6] uppercase z-10">
                    {product.category}
                  </span>

                  <div className="w-full aspect-square rounded-xl overflow-hidden bg-[#FAF6F0] mb-3 relative">
                    <img 
                      src={product.image.startsWith('http') ? product.image : `${PRODUCT_IMAGE_BASE}/${product.image}`} 
                      alt={product.name} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
                    />
                  </div>

                  <div>
                    <h4 className="text-xs font-semibold text-[#3D251E] mb-1 truncate group-hover:text-[#C87A53] transition-colors">
                      {product.name}
                    </h4>
                    <div className="flex justify-between items-center mt-2 pt-2 border-t border-[#F5EBE1]">
                      <span className="text-xs font-bold text-[#3D251E]">
                        Rs {product.price.toLocaleString()}
                      </span>
                      <button 
                        aria-label="Add to cart"
                        className="p-1.5 border border-[#EFE4D6] rounded-lg hover:bg-[#C87A53] hover:border-[#C87A53] hover:text-white text-[#8C7B75] transition-all"
                      >
                        <ShoppingCart size={13} />
                      </button>
                    </div>
                  </div>

                </div>
              ))}
            </div>
          )}
        </section>

      </main>

      {/* Footer */}
      <footer className="bg-[#FAF6F0] pt-14 border-t border-[#EFE4D6] mt-auto">
        <div className="max-w-7xl mx-auto px-6 pb-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          
          <div className="lg:col-span-1">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xl font-serif font-bold text-[#3D251E]">
                Nep<span className="text-[#C87A53]">Craft</span>
              </span>
            </div>
            <p className="text-[#654E47] text-xs leading-relaxed max-w-xs">
              Connecting local Nepali artisans with people worldwide. Preserving cultural heritage, one handcrafted piece at a time.
            </p>
          </div>

          <div>
            <h5 className="text-xs font-bold text-[#3D251E] mb-3 uppercase tracking-wider">Shop</h5>
            <ul className="space-y-2 text-xs text-[#654E47]">
              <li><Link href="/Shop" className="hover:text-[#C87A53] transition">Pottery & Ceramics</Link></li>
              <li><Link href="/Shop" className="hover:text-[#C87A53] transition">Thangka Painting</Link></li>
              <li><Link href="/Shop" className="hover:text-[#C87A53] transition">Handmade Felt</Link></li>
            </ul>
          </div>

          <div>
            <h5 className="text-xs font-bold text-[#3D251E] mb-3 uppercase tracking-wider">Company</h5>
            <ul className="space-y-2 text-xs text-[#654E47]">
              <li><Link href="/aboutus" className="hover:text-[#C87A53] transition">About Us</Link></li>
              <li><Link href="/artisans" className="hover:text-[#C87A53] transition">Our Artisans</Link></li>
              <li><Link href="/aboutus" className="hover:text-[#C87A53] transition">Our Impact</Link></li>
            </ul>
          </div>

          <div>
            <h5 className="text-xs font-bold text-[#3D251E] mb-3 uppercase tracking-wider">Help & Support</h5>
            <ul className="space-y-2 text-xs text-[#654E47]">
              <li><a href="#" className="hover:text-[#C87A53] transition">FAQ's</a></li>
              <li><a href="#" className="hover:text-[#C87A53] transition">Shipping Policy</a></li>
              <li><a href="#" className="hover:text-[#C87A53] transition">Returns & Privacy</a></li>
            </ul>
          </div>

          <div>
            <h5 className="text-xs font-bold text-[#3D251E] mb-3 uppercase tracking-wider">Stay Connected</h5>
            <p className="text-[11px] text-[#8C7B75] mb-2">Subscribe to discover new artisans and stories.</p>
            <div className="flex max-w-sm">
              <input 
                type="email" 
                placeholder="Your email address" 
                className="w-full bg-white border border-[#EFE4D6] rounded-l-xl px-3 py-2 text-xs focus:outline-none focus:border-[#C87A53]" 
              />
              <button className="bg-[#C87A53] hover:bg-[#B36640] text-white px-3.5 rounded-r-xl transition flex items-center justify-center">
                <Send size={13} />
              </button>
            </div>
          </div>

        </div>

        <div className="bg-[#3D251E] py-4 text-center text-[11px] text-white/60 tracking-wide">
          <span>© 2026 NepCraft Marketplace. All rights reserved.</span>
        </div>
      </footer>

    </div>
  );
}