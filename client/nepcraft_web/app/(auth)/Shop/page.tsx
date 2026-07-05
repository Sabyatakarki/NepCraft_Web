'use client';

import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import Link from 'next/link';
import Footer from "../_components/footer";
import {
  Search,
  ShoppingCart,
  Heart,
  User,
  Menu,
  Send,
  ChevronDown,
  X
} from 'lucide-react';

type ProductItem = {
  _id: string;
  name: string;
  price: number;
  category: string;
  image: string;
};

type WishlistItem = {
  _id: string;
  name: string;
  price: number;
  image: string;
  category: string;
};

const API_BASE = "http://localhost:5000";
const IMAGE_BASE = "http://localhost:5000/uploads/products";

export default function ShopPage() {
  const [products, setProducts] = useState<ProductItem[]>([]);
  const [wishlistIds, setWishlistIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("Categories");
  
  // Dark Global Portal Toast State (Matches Artisans style)
  const [toast, setToast] = useState<{ show: boolean; message: string }>({ show: false, message: "" });

  useEffect(() => {
    fetchProducts();
    const savedWishlist = localStorage.getItem('nepcraft_wishlist');
    if (savedWishlist) {
      const parsed: WishlistItem[] = JSON.parse(savedWishlist);
      setWishlistIds(parsed.map(item => item._id));
    }
  }, []);

  const triggerToast = (msg: string) => {
    setToast({ show: true, message: msg });
    setTimeout(() => {
      setToast(prev => (prev.message === msg ? { show: false, message: "" } : prev));
    }, 4000);
  };

  const filteredProducts =
  selectedCategory === "Categories"
    ? products
    : products.filter(
        (product) =>
          product.category?.toLowerCase() ===
          selectedCategory.toLowerCase()
      );

  const fetchProducts = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/products`);
      const json = await res.json();
      setProducts(json.data || []);
    } catch (error) {
      console.log("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleWishlist = (product: ProductItem) => {
    const savedWishlist = localStorage.getItem('nepcraft_wishlist');
    let currentWishlist: WishlistItem[] = savedWishlist ? JSON.parse(savedWishlist) : [];
    
    const isAlreadyExist = currentWishlist.some(item => item._id === product._id);

    if (isAlreadyExist) {
      currentWishlist = currentWishlist.filter(item => item._id !== product._id);
      setWishlistIds(prev => prev.filter(id => id !== product._id));
      triggerToast(`Removed ${product.name} from your wishlist.`);
    } else {
      const newItem: WishlistItem = {
        _id: product._id,
        name: product.name,
        price: product.price,
        image: product.image,
        category: product.category
      };
      currentWishlist.push(newItem);
      setWishlistIds(prev => [...prev, product._id]);
      triggerToast(`Added ${product.name} to wishlist!`);
    }

    localStorage.setItem('nepcraft_wishlist', JSON.stringify(currentWishlist));
  };

  return (
    <div className="min-h-screen bg-[#FFFDFB] text-[#3D251E] font-sans antialiased flex flex-col relative">

      {/* === GLOBAL PORTAL NOTIFICATION TOAST POPUP === */}
      {toast.show && typeof window !== 'undefined' && createPortal(
        <div className="fixed top-6 right-6 z-[100] flex items-center gap-3 bg-[#3D251E] text-[#FFFDFB] px-5 py-3.5 rounded-xl shadow-[0_20px_50px_rgba(0,0,0,0.3)] border border-[#5C4033] max-w-sm pointer-events-auto transition-all duration-300 animate-in slide-in-from-top-5">
          <Heart size={16} className="text-[#C87A53] fill-current shrink-0" />
          <p className="text-xs font-medium tracking-wide leading-relaxed">{toast.message}</p>
          <button 
            onClick={() => setToast({ show: false, message: "" })}
            className="ml-4 p-1 rounded-lg hover:bg-white/10 text-white/60 hover:text-white transition-colors shrink-0"
          >
            <X size={14}/>
          </button>
        </div>,
        document.body
      )}

      {/* TOP BAR */}
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
            <Link href="/wishlist" className="flex items-center gap-2 hover:text-[#C87A53] transition">
              <Heart size={18} /> <span>Wishlist</span>
            </Link>
            <Link href="/profile" className="flex items-center gap-2 hover:text-[#C87A53] transition">
              <User size={18} /> <span>Profile</span>
            </Link>
          </div>
        </div>
      </header>

      {/* NAVBAR WITH WORKING CATEGORY FILTER */}
      <div className="px-6 lg:px-16 py-2 flex justify-between items-center border-b border-[#F5EBE1] text-sm font-medium relative bg-white">
        {/* LEFT - Categories Dropdown */}
        <div className="relative group">
          <button className="flex items-center gap-2 border border-[#EFE4D6] px-3 py-1.5 rounded bg-white text-xs text-[#654E47] hover:bg-[#FAF4ED] transition-colors">
  <Menu className="w-3.5 h-3.5" />
  <span>{selectedCategory}</span>
  <ChevronDown size={12} className="text-[#A8928A]" />
</button>
          <div className="absolute left-0 top-full mt-1 w-48 bg-white border border-[#EFE4D6] rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
            <button onClick={() => setSelectedCategory("Pottery")} className="block w-full text-left px-4 py-2.5 text-xs hover:bg-[#FFF2E5]">Pottery</button>
            <button onClick={() => setSelectedCategory("Thangka")} className="block w-full text-left px-4 py-2.5 text-xs hover:bg-[#FFF2E5]">Thangka</button>
            <button onClick={() => setSelectedCategory("Accessories")} className="block w-full text-left px-4 py-2.5 text-xs hover:bg-[#FFF2E5]">Accessories</button>
            <button onClick={() => setSelectedCategory("Idol Statues")} className="block w-full text-left px-4 py-2.5 text-xs hover:bg-[#FFF2E5]">Idol Statues</button>
            <button onClick={() => setSelectedCategory("Souvenirs")} className="block w-full text-left px-4 py-2.5 text-xs hover:bg-[#FFF2E5]">Souvenirs</button>
            <button onClick={() => setSelectedCategory("Categories")}className="block w-full text-left px-4 py-2.5 text-xs hover:bg-[#FFF2E5] font-bold text-[#C87A53] border-t border-[#F5EBE1]">Show All</button>
          </div>
        </div>

        {/* CENTER - Navbar Links */}
        <nav className="absolute left-1/2 -translate-x-1/2 flex gap-12 text-[#654E47]">
          <Link href="/home" className="hover:text-[#C87A53] transition-colors">Home</Link>
          <Link href="/Shop" className="text-[#C87A53] font-bold border-b border-[#C87A53] pb-0.5">Shop</Link>
          <Link href="/artisans" className="hover:text-[#C87A53] transition-colors">Artisans</Link>
          <Link href="/aboutus" className="hover:text-[#C87A53] transition-colors">About Us</Link>
        </nav>

        <div className="w-24"></div>
      </div>

      {/* UTILITY BAR */}
      <div className="px-6 lg:px-16 pt-8 pb-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <p className="font-serif font-black text-sm text-[#3D251E] tracking-wide">
         Active Category: {selectedCategory} ({filteredProducts.length})
        </p>
      </div>

      {/* PRODUCTS CATALOGUE GRID */}
      <section className="px-6 lg:px-16 pb-16 flex-grow">
        {loading ? (
          <div className="flex justify-center items-center py-24 text-sm font-medium text-[#8C7B75]">
            <span className="animate-pulse">Loading NepCraft catalog...</span>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {filteredProducts.map((item) => {
              const isWishlisted = wishlistIds.includes(item._id);
              return (
                <div
                  key={item._id}
                  className="bg-white border border-[#F2E6DA] rounded-2xl p-4 shadow-[0_4px_20px_rgba(0,0,0,0.01)] flex flex-col justify-between group hover:shadow-[0_4px_25px_rgba(199,122,83,0.06)] transition-all duration-300 relative"
                >
                  <div>
                    {/* IMAGE CONTAINER */}
                    <div className="aspect-square bg-[#FAF1E6] rounded-xl overflow-hidden relative border border-[#FDF9F4]">
                      <Link href={`/Shop/${item._id}`}>
                        <img
                          src={`${IMAGE_BASE}/${item.image}`}
                          alt={item.name}
                          className="w-full h-full object-cover group-hover:scale-102 transition duration-300 cursor-pointer"
                        />
                      </Link>

                      {/* FLOATING HEART ACTION */}
                      <button 
                        onClick={() => handleToggleWishlist(item)}
                        className="absolute top-2.5 right-2.5 w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm shadow-sm flex items-center justify-center transition-all duration-200 hover:scale-105 active:scale-95 border border-[#EFE4D6] z-10 group/heart"
                      >
                        <Heart 
                          size={15} 
                          className={`transition-colors duration-200 ${
                            isWishlisted 
                              ? "fill-rose-500 text-rose-500" 
                              : "text-[#654E47] group-hover/heart:text-rose-500"
                          }`} 
                        />
                      </button>
                    </div>

                    {/* METADATA */}
                    <div className="pt-3 pb-2 text-left">
                      <p className="text-[10px] font-semibold text-[#A8928A] uppercase tracking-wider mb-0.5">
                        {item.category || 'Handcrafted'}
                      </p>
                      <h4 className="font-serif font-bold text-sm text-[#3D251E] tracking-tight line-clamp-1 group-hover:text-[#C87A53] transition-colors">
                        {item.name}
                      </h4>
                    </div>
                  </div>

                  {/* PRICE & FOOTER CART */}
                  <div className="flex justify-between items-center pt-2 mt-1 border-t border-[#F5EBE1]">
                    <span className="text-sm font-black text-[#3D251E] tracking-tight">
                      Rs {item.price.toLocaleString()}
                    </span>

                    <div className="flex items-center gap-1.5">
                      <button className="w-8 h-8 rounded-lg border border-[#EFE4D6] flex items-center justify-center text-[#C87A53] hover:bg-[#FFF2E5] transition-colors bg-white shadow-sm">
                        <ShoppingCart size={14} />
                      </button>
                    </div>
                  </div>

                </div>
              );
            })}
          </div>
        )}
      </section>
      <Footer/>

    </div>
  );
}