'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { 
  Heart, 
  ShoppingCart, 
  Trash2, 
  User, 
  MapPin,
  Award,
  Sparkles,
  ArrowRight,
  ExternalLink
} from 'lucide-react';
import Header from '../_components/header';
import Footer from '../_components/footer';

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
      const res = await fetch(`${API_BASE}/api/artisans`);
      const json = await res.json();
      
      if (json.success && json.artisans) {
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
    <div className="min-h-screen bg-[#FAF6F0] text-[#3D251E] font-sans antialiased flex flex-col">
      
     
      <Header />

      
      <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10">

        
        <section className="mb-14">
          <div className="flex items-center justify-between mb-6 border-b border-[#EFE4D6] pb-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#FFF2E5] flex items-center justify-center text-[#C87A53] border border-[#E8D9CA]">
                <Heart size={18} className="fill-current" />
              </div>
              <div>
                <h2 className="text-xl font-serif font-bold text-[#3D251E] tracking-tight">
                  Saved Products
                </h2>
                <p className="text-[11px] text-[#8C7B75]">Handcrafted creations saved for later</p>
              </div>
            </div>
            <span className="text-xs bg-[#FFF2E5] border border-[#E8D9CA] text-[#C87A53] px-3 py-1 rounded-full font-bold">
              {wishlistItems.length} {wishlistItems.length === 1 ? 'Item' : 'Items'}
            </span>
          </div>

          {wishlistItems.length === 0 ? (
            <div className="bg-white border border-[#EFE4D6] rounded-2xl p-10 text-center max-w-md mx-auto shadow-xs">
              <div className="w-14 h-14 rounded-2xl bg-[#FFF2E5] text-[#C87A53] flex items-center justify-center mx-auto mb-4 border border-[#E8D9CA]">
                <Heart size={24} />
              </div>
              <h3 className="font-serif font-bold text-base text-[#3D251E] mb-1">Your wishlist is empty</h3>
              <p className="text-xs text-[#8C7B75] mb-5 leading-relaxed">
                You haven't saved any handcrafted items yet. Explore our shop to find unique Nepalese artwork.
              </p>
              <Link href="/Shop" className="inline-flex items-center gap-2 bg-[#C87A53] hover:bg-[#B36640] text-white text-xs font-semibold px-5 py-2.5 rounded-xl shadow-xs transition-all">
                <span>Browse Marketplace</span>
                <ArrowRight size={14} />
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
              {wishlistItems.map((item) => (
                <div key={item._id} className="bg-white border border-[#EFE4D6] rounded-2xl p-3 flex flex-col justify-between group hover:shadow-md transition-all duration-300 relative">
                  
                 
                  <span className="absolute top-5 left-5 bg-white/90 backdrop-blur-xs text-[9px] font-bold tracking-wider px-2 py-0.5 rounded-full text-[#5C4033] border border-[#EFE4D6] uppercase z-10">
                    {item.category || 'Handcrafted'}
                  </span>

                  <div className="w-full aspect-[4/3] rounded-xl overflow-hidden bg-[#FAF6F0] mb-3 relative border border-[#F5EBE1]">
                    <img
                      src={item.image.startsWith('http') ? item.image : `${IMAGE_BASE}/${item.image}`}
                      alt={item.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>

                  
                  <div className="flex flex-col flex-grow justify-between">
                    <div>
                      <h3 className="font-serif text-xs font-bold text-[#3D251E] tracking-tight line-clamp-1 group-hover:text-[#C87A53] transition-colors">
                        {item.name}
                      </h3>
                      <p className="text-[#C87A53] text-xs font-bold mt-1">
                        Rs {item.price.toLocaleString()}
                      </p>
                    </div>

                  
                    <div className="flex items-center gap-2 mt-4 pt-3 border-t border-[#F5EBE1]">
                      <Link 
                        href="/cart" 
                        className="flex-1 bg-[#C87A53] hover:bg-[#B36640] text-white py-2 rounded-xl text-[11px] font-semibold flex items-center justify-center gap-1.5 transition shadow-xs"
                      >
                        <ShoppingCart size={13} />
                        <span>Add to Cart</span>
                      </Link>
                      <button 
                        onClick={() => removeFromWishlist(item._id)} 
                        aria-label="Remove item"
                        className="p-2 border border-[#EFE4D6] text-rose-500 hover:bg-rose-50 hover:border-rose-200 rounded-xl transition bg-white shadow-xs shrink-0"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>

                </div>
              ))}
            </div>
          )}
        </section>

      
        <section className="mb-8">
          <div className="flex items-center justify-between mb-6 border-b border-[#EFE4D6] pb-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#FFF2E5] flex items-center justify-center text-[#C87A53] border border-[#E8D9CA]">
                <User size={18} />
              </div>
              <div>
                <h2 className="text-xl font-serif font-bold text-[#3D251E] tracking-tight">
                  Followed Artisans
                </h2>
                <p className="text-[11px] text-[#8C7B75]">Master craftspeople you're following</p>
              </div>
            </div>
            <span className="text-xs bg-[#FFF2E5] border border-[#E8D9CA] text-[#C87A53] px-3 py-1 rounded-full font-bold">
              {favoriteArtisans.length} {favoriteArtisans.length === 1 ? 'Artisan' : 'Artisans'}
            </span>
          </div>

          {loadingArtisans ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {[1, 2, 3, 4].map((n) => (
                <div key={n} className="bg-white border border-[#EFE4D6] rounded-2xl p-4 animate-pulse">
                  <div className="w-16 h-16 rounded-full bg-[#FAF6F0] mb-3 mx-auto" />
                  <div className="h-3 bg-[#FAF6F0] rounded w-3/4 mx-auto mb-2" />
                  <div className="h-3 bg-[#FAF6F0] rounded w-1/2 mx-auto" />
                </div>
              ))}
            </div>
          ) : favoriteArtisans.length === 0 ? (
            <div className="bg-white border border-[#EFE4D6] rounded-2xl p-10 text-center max-w-md mx-auto shadow-xs">
              <div className="w-14 h-14 rounded-2xl bg-[#FFF2E5] text-[#C87A53] flex items-center justify-center mx-auto mb-4 border border-[#E8D9CA]">
                <User size={24} />
              </div>
              <h3 className="font-serif font-bold text-base text-[#3D251E] mb-1">No followed artisans</h3>
              <p className="text-xs text-[#8C7B75] mb-5 leading-relaxed">
                Follow local Nepalese artisans to support their craft and get quick access to their unique collections.
              </p>
              <Link href="/artisans" className="inline-flex items-center gap-2 bg-[#C87A53] hover:bg-[#B36640] text-white text-xs font-semibold px-5 py-2.5 rounded-xl shadow-xs transition-all">
                <span>Meet Artisans</span>
                <ArrowRight size={14} />
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
              {favoriteArtisans.map((artisan) => (
                <div key={artisan._id} className="bg-white border border-[#EFE4D6] rounded-2xl p-5 flex flex-col justify-between relative group hover:shadow-md transition-all duration-300">
                  
                  
                  <div className="absolute top-4 right-4 bg-[#FFF2E5] border border-[#E8D9CA] rounded-full px-2.5 py-0.5 flex items-center gap-1 text-[10px] text-[#C87A53] font-bold">
                    <Award size={11} />
                    <span>{artisan.experience} yrs</span>
                  </div>

                
                  <div className="flex flex-col items-center text-center pt-2">
                    <div className="w-20 h-20 rounded-2xl overflow-hidden border-2 border-[#EFE4D6] bg-[#FAF1E6] mb-3 shadow-xs">
                      <img 
                        src={artisan.image || "/default-avatar.png"} 
                        alt={artisan.name} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
                      />
                    </div>
                    
                    <h4 className="font-serif font-bold text-base text-[#3D251E] line-clamp-1 mb-0.5">
                      {artisan.name}
                    </h4>
                    <p className="text-[10px] font-bold text-[#C87A53] uppercase tracking-wider mb-2">
                      {artisan.role}
                    </p>
                    <div className="flex items-center gap-1 text-[#654E47] text-xs font-medium mb-3">
                      <MapPin size={12} className="text-[#C87A53]" />
                      <span>{artisan.location}</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 pt-3 border-t border-[#F5EBE1] w-full mt-2">
                    <Link 
                      href={`/artisans/${artisan._id}`} 
                      className="flex-1 bg-[#C87A53] hover:bg-[#B36640] text-white text-[11px] font-semibold py-2 rounded-xl transition text-center shadow-xs flex items-center justify-center gap-1.5"
                    >
                      <span>View Profile</span>
                      <ExternalLink size={12} />
                    </Link>
                    <button 
                      onClick={() => removeArtisanFollow(artisan._id)} 
                      aria-label="Unfollow artisan"
                      className="p-2 border border-[#EFE4D6] text-rose-500 hover:bg-rose-50 hover:border-rose-200 rounded-xl transition bg-white shadow-xs shrink-0"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>

                </div>
              ))}
            </div>
          )}
        </section>

      </main>

      {/* Footer Component */}
      <Footer />
    </div>
  );
}