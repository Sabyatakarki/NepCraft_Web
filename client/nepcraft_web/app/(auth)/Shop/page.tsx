'use client';

import React, { useEffect, useState, useRef } from 'react';
import { createPortal } from 'react-dom';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import Footer from "../_components/footer";
import {
  Search,
  ShoppingCart,
  Heart,
  User,
  Menu,
  ChevronDown,
  X,
  Sparkles,
  Palette,
  Layers,
  Flame,
  Package,
  ArrowRight
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
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Header Search State
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);

  const pathname = usePathname();
  const router = useRouter();
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Toast State
  const [toast, setToast] = useState<{ show: boolean; message: string }>({ show: false, message: "" });

  useEffect(() => {
    fetchProducts();
    const savedWishlist = localStorage.getItem('nepcraft_wishlist');
    if (savedWishlist) {
      const parsed: WishlistItem[] = JSON.parse(savedWishlist);
      setWishlistIds(parsed.map(item => item._id));
    }
    const token = localStorage.getItem("token");
    if (token) setIsLoggedIn(true);
  }, []);

  // Search Autosuggestions Engine
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSuggestions([]);
      setIsLoadingSuggestions(false);
      return;
    }

    setIsLoadingSuggestions(true);

    const timer = setTimeout(async () => {
      try {
        const encodedQuery = encodeURIComponent(searchQuery.trim());

        const [productsRes, artisansRes] = await Promise.all([
          fetch(`${API_BASE}/api/products?search=${encodedQuery}`),
          fetch(`${API_BASE}/api/artisans?search=${encodedQuery}`).catch(() => null)
        ]);

        let productItems: any[] = [];
        let artisanItems: any[] = [];

        if (productsRes && productsRes.ok) {
          const pData = await productsRes.json();
          const pList = pData.data || pData;
          productItems = Array.isArray(pList) ? pList.map((p: any) => ({ ...p, type: 'Product' })) : [];
        }

        if (artisansRes && artisansRes.ok) {
          const aData = await artisansRes.json();
          const aList = aData.data || aData;
          artisanItems = Array.isArray(aList) ? aList.map((a: any) => ({ ...a, type: 'Artisan' })) : [];
        }

        const combined = [...productItems, ...artisanItems];
        setSuggestions(combined.slice(0, 6));
      } catch (err) {
        console.error("Combined suggestions fetch error:", err);
      } finally {
        setIsLoadingSuggestions(false);
      }
    }, 200);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Close search dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    setShowDropdown(false);
    router.push(`/Shop?search=${encodeURIComponent(searchQuery.trim())}`);
  };

  const triggerToast = (msg: string) => {
    setToast({ show: true, message: msg });
    setTimeout(() => {
      setToast(prev => (prev.message === msg ? { show: false, message: "" } : prev));
    }, 4000);
  };

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

  const filteredProducts =
    selectedCategory === "Categories"
      ? products
      : products.filter(
          (product) =>
            product.category?.toLowerCase() === selectedCategory.toLowerCase()
        );

  const categoriesList = [
    { name: "Pottery & Ceramics", categoryKey: "Pottery", icon: Flame },
    { name: "Thangka Paintings", categoryKey: "Thangka", icon: Palette },
    { name: "Craft Accessories", categoryKey: "Accessories", icon: Sparkles },
    { name: "Statues & Metalwork", categoryKey: "Idol Statues", icon: Layers },
    { name: "Souvenirs & Gifts", categoryKey: "Souvenirs", icon: Package },
  ];

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

      {/* HEADER SECTION (Matching Header.tsx UI) */}
      <header className="sticky top-0 z-50 bg-[#FAF7F2]/95 backdrop-blur-md border-b border-[#F2E6DA] text-[#3D251E] transition-all">
        
        {/* TOP HEADER SECTION */}
        <div className="w-full px-4 sm:px-6 lg:px-8 py-3">
          <div className="grid grid-cols-12 items-center gap-4">

            {/* 1. LEFT CORNER: BRAND LOGO */}
            <div className="col-span-6 md:col-span-3 flex items-center justify-start">
              <Link href="/home" className="group flex items-center gap-3 transition-transform duration-200 active:scale-98">
                <div className="w-10 h-10 rounded-xl bg-[#FFF2E5] border border-[#E8D9CA] p-1.5 flex items-center justify-center shadow-2xs group-hover:bg-[#FAF1E6] transition-colors">
                  <img 
                    src="/vase.png" 
                    alt="NepCraft Logo" 
                    className="h-full w-auto object-contain group-hover:scale-105 transition-transform" 
                    onError={(e) => {
                      (e.target as HTMLElement).style.display = 'none';
                    }}
                  />
                </div>
                <div className="text-left">
                  <h1 className="font-serif text-2xl font-bold tracking-tight text-[#3D251E] group-hover:text-[#C87A53] transition-colors leading-tight">
                    NepCraft
                  </h1>
                  <p className="text-[10px] tracking-widest uppercase font-medium text-[#8C7B75]">
                    Handmade with Heart
                  </p>
                </div>
              </Link>
            </div>

            {/* 2. CENTER: COMBINED SEARCH BAR */}
            <div className="col-span-12 md:col-span-6 order-last md:order-none" ref={dropdownRef}>
              <div className="relative w-full max-w-lg mx-auto">
                <form onSubmit={handleSearchSubmit} className="relative flex items-center">
                  <input
                    type="text"
                    placeholder="Search craft items, artisans, or origins..."
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      setShowDropdown(true);
                    }}
                    onFocus={() => setShowDropdown(true)}
                    className="w-full bg-white border border-[#E8D9CA] hover:border-[#C87A53]/50 focus:border-[#C87A53] rounded-xl py-2 pl-4 pr-11 text-xs text-[#3D251E] placeholder:text-[#A8928A] shadow-2xs focus:outline-none focus:ring-2 focus:ring-[#C87A53]/15 transition-all"
                  />

                  {searchQuery ? (
                    <button 
                      type="button" 
                      onClick={() => setSearchQuery("")}
                      className="absolute right-10 text-[#A8928A] hover:text-[#3D251E] transition-colors p-1"
                    >
                      <X size={14} />
                    </button>
                  ) : null}

                  <button 
                    type="submit" 
                    aria-label="Submit Search"
                    className="absolute right-2 text-white bg-[#C87A53] hover:bg-[#B36640] p-1.5 rounded-lg transition-colors shadow-2xs cursor-pointer active:scale-95"
                  >
                    <Search size={14} />
                  </button>
                </form>

                {/* SEARCH SUGGESTIONS OVERLAY */}
                {showDropdown && searchQuery.trim().length > 0 && (
                  <div className="absolute left-0 right-0 top-full mt-2 bg-white border border-[#F2E6DA] rounded-xl shadow-xl overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                    {isLoadingSuggestions ? (
                      <div className="p-4 text-center text-xs text-[#8C7B75] flex items-center justify-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-[#C87A53] animate-ping" />
                        Searching marketplace...
                      </div>
                    ) : suggestions.length > 0 ? (
                      <div className="py-1.5 divide-y divide-[#F5EBE1]">
                        <div className="px-3 py-1.5 text-[10px] uppercase font-bold text-[#A8928A] tracking-wider">
                          Top Results
                        </div>
                        <div className="py-1">
                          {suggestions.map((item: any) => (
                            <div
                              key={item._id}
                              onClick={() => {
                                setSearchQuery(item.name);
                                setShowDropdown(false);
                                const destination = item.type === 'Artisan' ? '/artisans' : '/Shop';
                                router.push(`${destination}?search=${encodeURIComponent(item.name)}`);
                              }}
                              className="px-4 py-2.5 hover:bg-[#FFF2E5] cursor-pointer text-xs text-[#3D251E] flex items-center justify-between transition-colors group"
                            >
                              <span className="font-medium group-hover:text-[#C87A53] transition-colors truncate pr-2">
                                {item.name}
                              </span>
                              <span className={`text-[9px] px-2 py-0.5 rounded-md font-semibold tracking-wide uppercase shrink-0 border ${
                                item.type === 'Artisan' 
                                  ? 'bg-amber-50 text-amber-800 border-amber-200' 
                                  : 'bg-[#FAF1E6] text-[#8C7B75] border-[#E8D9CA]'
                              }`}>
                                {item.type}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <div className="p-4 text-center text-xs text-[#8C7B75]">
                        No crafts or artisans found matching "{searchQuery}"
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* 3. RIGHT CORNER: USER ACTIONS & CART */}
            <div className="col-span-6 md:col-span-3 flex items-center justify-end gap-1 sm:gap-2">
              
              {/* Cart Link */}
              <Link 
                href="/cart" 
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                  pathname === "/cart" 
                    ? "bg-[#FFF2E5] text-[#C87A53] font-bold" 
                    : "text-[#6E5D57] hover:bg-white hover:text-[#3D251E]"
                }`}
              >
                <ShoppingCart size={18} className={pathname === "/cart" ? "text-[#C87A53]" : "text-[#8C7B75]"} />
                <span className="hidden sm:inline">Cart</span>
              </Link>

              {/* Wishlist Link */}
              <Link 
                href="/wishlist" 
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                  pathname === "/wishlist" 
                    ? "bg-[#FFF2E5] text-[#C87A53] font-bold" 
                    : "text-[#6E5D57] hover:bg-white hover:text-[#3D251E]"
                }`}
              >
                <Heart size={18} className={pathname === "/wishlist" ? "text-[#C87A53]" : "text-[#8C7B75]"} />
                <span className="hidden sm:inline">Wishlist</span>
              </Link>

              {/* Profile / Auth Link */}
              <Link 
                href={isLoggedIn ? "/profile" : "/login"} 
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium transition-all border ${
                  pathname === "/profile" || pathname === "/login"
                    ? "bg-[#C87A53] text-white border-[#C87A53] font-semibold"
                    : "bg-white text-[#3D251E] border-[#E8D9CA] hover:border-[#C87A53]/50"
                }`}
              >
                <User size={16} />
                <span>{isLoggedIn ? "Profile" : "Sign In"}</span>
              </Link>

            </div>

          </div>
        </div>

        {/* SECONDARY NAVIGATION BAR */}
        <div className="border-t border-[#F2E6DA] bg-white/60">
          <div className="w-full px-4 sm:px-6 lg:px-8 py-1.5 flex items-center justify-between relative text-xs">
            
            {/* LEFT SIDE CATEGORIES DROPDOWN MENU */}
            <div className="relative group hidden sm:block">
              <button className="flex items-center gap-2 border border-[#E8D9CA] px-3.5 py-1.5 rounded-lg bg-white text-[#3D251E] font-medium hover:bg-[#FFF2E5] hover:border-[#C87A53]/40 transition-all cursor-pointer shadow-2xs">
                <Menu className="w-3.5 h-3.5 text-[#C87A53]" />
                <span>{selectedCategory}</span>
                <ChevronDown className="w-3.5 h-3.5 text-[#8C7B75] group-hover:rotate-180 transition-transform duration-200" />
              </button>

              {/* Dropdown Menu Panel */}
              <div className="absolute left-0 top-full mt-2 w-56 bg-white border border-[#F2E6DA] rounded-xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 p-1.5">
                {categoriesList.map((cat) => {
                  const CategoryIcon = cat.icon;
                  return (
                    <button 
                      key={cat.name} 
                      onClick={() => setSelectedCategory(cat.categoryKey)}
                      className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-medium text-[#6E5D57] hover:bg-[#FFF2E5] hover:text-[#C87A53] transition-colors text-left"
                    >
                      <span className="flex items-center gap-2.5">
                        <CategoryIcon size={14} className="text-[#C87A53]" />
                        {cat.name}
                      </span>
                      <ArrowRight size={12} className="opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-[#C87A53]" />
                    </button>
                  );
                })}
                <button 
                  onClick={() => setSelectedCategory("Categories")}
                  className="w-full text-left px-3 py-2 rounded-lg text-xs font-bold text-[#C87A53] hover:bg-[#FFF2E5] border-t border-[#F2E6DA] mt-1"
                >
                  Show All Categories
                </button>
              </div>
            </div>

            {/* CENTER NAVIGATION LINKS */}
            <nav className="flex items-center gap-8 font-medium text-[#6E5D57] mx-auto lg:mx-0">
              {[
                { name: "Home", href: "/home" },
                { name: "Shop", href: "/Shop" },
                { name: "Artisans", href: "/artisans" },
                { name: "About Us", href: "/aboutus" },
              ].map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    className={`relative py-1 transition-colors hover:text-[#C87A53] ${
                      isActive ? "text-[#C87A53] font-bold" : ""
                    }`}
                  >
                    {link.name}
                    {isActive && (
                      <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#C87A53] rounded-full animate-in fade-in zoom-in duration-200" />
                    )}
                  </Link>
                );
              })}
            </nav>

            {/* Quick Notice / Extra Tagline */}
            <div className="hidden lg:flex items-center gap-1.5 text-[11px] text-[#8C7B75]">
              <Sparkles size={13} className="text-[#C87A53]" />
              <span>Authentic Nepali Heritage</span>
            </div>

          </div>
        </div>

      </header>

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

      <Footer />

    </div>
  );
}