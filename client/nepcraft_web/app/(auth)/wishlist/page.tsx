'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { 
  Heart, 
  ShoppingCart, 
  Trash2, 
  Search, 
  User, 
  Menu, 
  Send,
  MapPin,
  Award
} from 'lucide-react';

type WishlistItem = {
  _id: string;
  name: string;
  price: number;
  image: string;
  category: string;
};

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
const IMAGE_BASE = "http://localhost:5000/uploads/products";

export default function WishlistPage() {
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);
  const [favoriteArtisans, setFavoriteArtisans] = useState<ArtisanItem[]>([]);
  const [loadingArtisans, setLoadingArtisans] = useState(false);

  useEffect(() => {
    // 1. Get saved product wishlist items
    const savedWishlist = localStorage.getItem('nepcraft_wishlist');
    if (savedWishlist) {
      setWishlistItems(JSON.parse(savedWishlist));
    }

    // 2. Get saved artisan profile IDs and fetch their profiles
    const savedArtisanIds = localStorage.getItem('nepcraft_artisan_favorites');
    if (savedArtisanIds) {
      const ids: string[] = JSON.parse(savedArtisanIds);
      if (ids.length > 0) {
        fetchFollowedArtisans(ids);
      }
    }
  }, []);

  const fetchFollowedArtisans = async (ids: string[]) => {
    setLoadingArtisans(true);
    try {
      // Fetch all artisans from your backend endpoint
      const res = await fetch(`${API_BASE}/api/artisans`);
      const json = await res.json();
      
      if (json.success && json.artisans) {
        // Filter array down to profiles currently followed by the user
        const matched = json.artisans.filter((artisan: ArtisanItem) => ids.includes(artisan._id));
        setFavoriteArtisans(matched);
      }
    } catch (error) {
      console.error("Error matching wishlist artisan items:", error);
    } finally {
      setLoadingArtisans(false);
    }
  };

  const removeFromWishlist = (id: string) => {
    const updatedWishlist = wishlistItems.filter((item) => item._id !== id);
    setWishlistItems(updatedWishlist);
    localStorage.setItem('nepcraft_wishlist', JSON.stringify(updatedWishlist));
  };

  const removeArtisanFollow = (id: string) => {
    const updatedArtisans = favoriteArtisans.filter((artisan) => artisan._id !== id);
    setFavoriteArtisans(updatedArtisans);
    
    const savedArtisanIds = localStorage.getItem('nepcraft_artisan_favorites');
    if (savedArtisanIds) {
      const ids: string[] = JSON.parse(savedArtisanIds);
      const filteredIds = ids.filter(favId => favId !== id);
      localStorage.setItem('nepcraft_artisan_favorites', JSON.stringify(filteredIds));
    }
  };

  return (
    <div className="min-h-screen bg-[#FFFDFB] text-[#3D251E] font-sans antialiased flex flex-col">
      
      {/* === TOP BAR HEADER === */}
      <header className="border-b border-[#EFE4D6] bg-white px-6 lg:px-16 py-4">
        <div className="grid grid-cols-3 items-center">
          {/* LEFT - Logo */}
          <div className="flex items-center gap-2 justify-start">
            <img src="/vase.png" alt="NepCraft Logo" className="h-12 w-auto object-contain" />
            <div>
              <h1 className="font-serif text-[28px] leading-none text-[#5C4033]">NepCraft</h1>
              <p className="text-[10px] text-[#8C7B75]">Handmade with hearts</p>
            </div>
          </div>

          {/* CENTER - Search */}
          <div className="flex justify-center">
            <div className="relative w-full max-w-md">
              <input
                type="text"
                placeholder="Search products, artisans..."
                className="w-full border border-[#E8D9CA] rounded-md py-2 pl-4 pr-10 text-sm focus:outline-none focus:border-[#C87A53]"
              />
              <Search size={18} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#C87A53]" />
            </div>
          </div>

          {/* RIGHT - Actions */}
          <div className="flex items-center justify-end gap-6 text-sm">
            <Link href="/cart" className="flex items-center gap-2 hover:text-[#C87A53] transition">
              <ShoppingCart size={18} /> <span>Cart</span>
            </Link>
            <Link href="/wishlist" className="flex items-center gap-2 text-[#C87A53] font-bold transition">
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
            <Link href="/shop" className="block px-4 py-3 text-sm hover:bg-[#FFF2E5]">Pottery</Link>
            <Link href="/shop" className="block px-4 py-3 text-sm hover:bg-[#FFF2E5]">Thangka</Link>
            <Link href="/shop" className="block px-4 py-3 text-sm hover:bg-[#FFF2E5]">Accessories</Link>
            <Link href="/shop" className="block px-4 py-3 text-sm hover:bg-[#FFF2E5]">Idol Statues</Link>
          </div>
        </div>

        <nav className="absolute left-1/2 -translate-x-1/2 flex gap-12 text-[#654E47]">
          <Link href="/home" className="hover:text-[#C87A53] transition-colors">Home</Link>
          <Link href="/Shop" className="hover:text-[#C87A53] transition-colors">Shop</Link>
          <Link href="/artisans" className="hover:text-[#C87A53] transition-colors">Artisans</Link>
          <Link href="/aboutus" className="hover:text-[#C87A53] transition-colors">About Us</Link>
        </nav>

        <div className="w-24"></div>
      </div>

      {/* === MAIN WISHLIST CONTENT === */}
      <main className="flex-grow px-6 py-10 w-full mx-auto max-w-7xl">
        
        {/* ================= SECTION 1: PRODUCT WISHLIST ================= */}
        <section className="mb-14">
          <div className="flex items-center gap-2.5 mb-6 border-b border-[#F5EBE1] pb-3">
            <Heart className="text-[#C87A53] fill-current" size={18} />
            <h2 className="text-lg font-serif font-bold text-[#3D251E] tracking-tight">
              Saved Products
            </h2>
            <span className="text-xs bg-[#FFF2E5] text-[#C87A53] px-2 py-0.5 rounded-full font-bold">
              {wishlistItems.length}
            </span>
          </div>

          {wishlistItems.length === 0 ? (
            <div className="bg-white border border-[#F2E6DA] rounded-xl p-8 text-center max-w-md">
              <p className="text-xs text-[#8C7B75] mb-4">No custom product craftworks pinned to your wishlist yet.</p>
              <Link href="/Shop" className="inline-block bg-[#C87A53] text-white text-[11px] font-semibold px-4 py-2 rounded hover:bg-[#B36640] transition">
                Browse Shop
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {wishlistItems.map((item) => (
                <div key={item._id} className="bg-white border border-[#F2E6DA] rounded-xl p-2.5 flex flex-col justify-between group relative shadow-xs">
                  <div className="aspect-[4/3] bg-[#FAF1E6] rounded-lg overflow-hidden relative border border-[#FDF9F4]">
                    <img
                      src={item.image.startsWith('http') ? item.image : `${IMAGE_BASE}/${item.image}`}
                      alt={item.name}
                      className="w-full h-full object-cover group-hover:scale-102 transition duration-200"
                    />
                  </div>
                  <div className="pt-2 flex flex-col flex-grow justify-between">
                    <div>
                      <span className="text-[8px] font-bold text-[#A8928A] uppercase tracking-wider">
                        {item.category || 'Handcrafted'}
                      </span>
                      <h3 className="font-serif text-xs font-bold text-[#3D251E] tracking-tight line-clamp-1 mt-0.5">
                        {item.name}
                      </h3>
                      <p className="text-[#C87A53] text-xs font-bold mt-0.5">
                        Rs {item.price.toLocaleString()}
                      </p>
                    </div>

                    <div className="flex gap-1.5 mt-3">
                      <Link href="/cart" className="flex-1 bg-[#C87A53] text-white py-1.5 rounded text-[10px] font-semibold flex items-center justify-center gap-1 hover:bg-[#B36640] transition shadow-xs">
                        <ShoppingCart size={11} /> Cart
                      </Link>
                      <button onClick={() => removeFromWishlist(item._id)} className="w-7 h-7 border border-rose-100 text-rose-500 rounded flex items-center justify-center hover:bg-rose-50 transition bg-white shadow-xs">
                        <Trash2 size={11} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* ================= SECTION 2: FOLLOWED ARTISANS ================= */}
        <section className="mb-6">
          <div className="flex items-center gap-2.5 mb-6 border-b border-[#F5EBE1] pb-3">
            <User className="text-[#C87A53]" size={18} />
            <h2 className="text-lg font-serif font-bold text-[#3D251E] tracking-tight">
              Followed Artisans
            </h2>
            <span className="text-xs bg-[#FFF2E5] text-[#C87A53] px-2 py-0.5 rounded-full font-bold">
              {favoriteArtisans.length}
            </span>
          </div>

          {loadingArtisans ? (
            <div className="text-xs font-medium text-[#8C7B75] animate-pulse">Syncing followed portfolios...</div>
          ) : favoriteArtisans.length === 0 ? (
            <div className="bg-white border border-[#F2E6DA] rounded-xl p-8 text-center max-w-md">
              <p className="text-xs text-[#8C7B75] mb-4">You aren't following any master craftspeople yet.</p>
              <Link href="/artisans" className="inline-block bg-[#C87A53] text-white text-[11px] font-semibold px-4 py-2 rounded hover:bg-[#B36640] transition">
                Meet Artisans
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {favoriteArtisans.map((artisan) => (
                <div key={artisan._id} className="bg-white border border-[#F2E6DA] rounded-xl p-4 flex flex-col justify-between relative group shadow-xs text-center md:text-left">
                  
                  {/* Years Experience Floating Tag */}
                  <div className="absolute top-3 right-3 bg-[#FFF2E5] border border-[#F5EBE1] rounded-full px-2 py-0.5 flex items-center gap-1 text-[9px] text-[#C87A53] font-semibold">
                    <Award size={10} />
                    <span>{artisan.experience} yrs</span>
                  </div>

                  <div className="flex flex-col items-center md:items-start pt-1">
                    <div className="w-16 h-16 rounded-full overflow-hidden border border-[#EFE4D6] bg-[#FAF1E6] mb-2.5">
                      <img 
                        src={artisan.image || "/default-avatar.png"} 
                        alt={artisan.name} 
                        className="w-full h-full object-cover" 
                      />
                    </div>
                    
                    <h4 className="font-serif font-bold text-sm text-[#3D251E] line-clamp-1 mb-0.5">
                      {artisan.name}
                    </h4>
                    <p className="text-[9px] font-semibold text-[#A8928A] uppercase tracking-wider mb-2">
                      {artisan.role}
                    </p>
                    <div className="flex items-center gap-1 text-[#C87A53] text-[11px] font-medium mb-2.5">
                      <MapPin size={11} strokeWidth={2.5} />
                      <span>{artisan.location}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 pt-2 border-t border-[#F5EBE1] w-full mt-2">
                    <Link href={`/artisans/${artisan._id}`} className="flex-1 bg-[#C87A53] text-white text-[10px] font-semibold py-1.5 rounded hover:bg-[#B36640] transition text-center shadow-xs">
                      View Profile
                    </Link>
                    <button onClick={() => removeArtisanFollow(artisan._id)} className="w-7 h-7 border border-rose-100 text-rose-500 rounded flex items-center justify-center hover:bg-rose-50 transition bg-white shadow-xs shrink-0">
                      <Trash2 size={11} />
                    </button>
                  </div>

                </div>
              ))}
            </div>
          )}
        </section>

      </main>

      {/* === FOOTER LAYOUT === */}
      <footer className="bg-[#FFF2E5] pt-12 border-t border-[#EFE4D6] mt-auto">
        <div className="px-6 lg:px-16 pb-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 text-left">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-lg font-serif font-black text-[#3D251E]">
                Nep<span className="text-[#C87A53]">Craft</span>
              </span>
            </div>
            <p className="text-[#654E47] text-[11px] leading-relaxed mb-4 max-w-xs">
              Bringing Nepal's rich heritage to your home. Handmade with love, made for you.
            </p>
          </div>
          <div>
            <h5 className="text-xs font-bold text-[#3D251E] mb-3 uppercase tracking-wider">Shop</h5>
            <ul className="space-y-1.5 text-[11px] text-[#654E47]">
              <li><Link href="/Shop" className="hover:text-[#C87A53]">Pottery</Link></li>
              <li><Link href="/Shop" className="hover:text-[#C87A53]">Thangka Painting</Link></li>
            </ul>
          </div>
          <div>
            <h5 className="text-xs font-bold text-[#3D251E] mb-3 uppercase tracking-wider">Company</h5>
            <ul className="space-y-1.5 text-[11px] text-[#654E47]">
              <li><Link href="/aboutus" className="hover:text-[#C87A53]">About Us</Link></li>
              <li><Link href="/artisans" className="hover:text-[#C87A53]">Our Artisans</Link></li>
            </ul>
          </div>
          <div>
            <h5 className="text-xs font-bold text-[#3D251E] mb-3 uppercase tracking-wider">Help</h5>
            <ul className="space-y-1.5 text-[11px] text-[#654E47]">
              <li><a href="#" className="hover:text-[#C87A53]">FAQ's</a></li>
              <li><a href="#" className="hover:text-[#C87A53]">Returns & Privacy</a></li>
            </ul>
          </div>
          <div>
            <h5 className="text-xs font-bold text-[#3D251E] mb-3 uppercase tracking-wider">Newsletter</h5>
            <div className="flex max-w-sm mt-2">
              <input type="email" placeholder="Your email" className="w-full bg-white border border-[#EFE4D6] rounded-l px-3 py-1.5 text-xs focus:outline-none" />
              <button className="bg-[#C87A53] hover:bg-[#B36640] text-white px-3 rounded-r transition"><Send size={12} /></button>
            </div>
          </div>
        </div>

        <div className="bg-[#3D251E] py-3 text-center text-[10px] text-white/70 font-medium tracking-wide">
          <span>© 2026 NepCraft. All rights reserved.</span>
        </div>
      </footer>
    </div>
  );
}