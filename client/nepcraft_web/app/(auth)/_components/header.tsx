'use client';

import Link from "next/link";
import { useEffect, useState, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Search, ShoppingCart, Heart, User, Menu } from "lucide-react";

export default function Header() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  
  const pathname = usePathname();
  const router = useRouter();
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) setIsLoggedIn(true);
  }, []);

  // Simplified dual-fetch suggestions engine (Triggers on 1 letter)
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSuggestions([]);
      return;
    }

    const fetchCombinedSuggestions = async () => {
      try {
        const encodedQuery = encodeURIComponent(searchQuery);

        // Fetch products and artisans at the same time
        const [productsRes, artisansRes] = await Promise.all([
          fetch(`http://localhost:5000/api/products?search=${encodedQuery}`),
          fetch(`http://localhost:5000/api/artisans?search=${encodedQuery}`).catch(() => null) // catch block avoids crashing if artisans route doesn't exist yet
        ]);

        let productItems = [];
        let artisanItems = [];

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

        // Merge both arrays together into a single list
        const combined = [...productItems, ...artisanItems];
        setSuggestions(combined.slice(0, 6)); // Limit to top 6 total hits
      } catch (err) {
        console.error("Combined suggestions fetch error:", err);
      }
    };

    fetchCombinedSuggestions();
  }, [searchQuery]);

  // Close dropdown when clicking outside
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
    
    // Redirects appropriately based on what they are looking for
    router.push(`/Shop?search=${encodeURIComponent(searchQuery.trim())}`);
  };

  return (
    <>
      {/* TOP BAR */}
      <header className="border-b border-[#EFE4D6] bg-white px-6 lg:px-16 py-4">
        <div className="grid grid-cols-3 items-center">

          {/* Logo */}
          <div className="flex items-center gap-2 justify-start">
            <img src="/vase.png" alt="NepCraft Logo" className="h-12 w-auto object-contain" />
            <div>
              <h1 className="font-serif text-[28px] leading-none text-[#5C4033]">NepCraft</h1>
              <p className="text-[10px] text-[#8C7B75]">Handmade with hearts</p>
            </div>
          </div>

          {/* Combined Search Box */}
          <div className="flex justify-center relative" ref={dropdownRef}>
            <form onSubmit={handleSearchSubmit} className="relative w-full max-w-md z-50">
              <input
                type="text"
                placeholder="Search products, artisans..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setShowDropdown(true);
                }}
                onFocus={() => setShowDropdown(true)}
                className="w-full border border-[#E8D9CA] rounded-md py-2 pl-4 pr-10 text-sm focus:outline-none focus:border-[#C87A53] bg-white"
              />
              <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 text-[#C87A53]">
                <Search size={18} />
              </button>
            </form>

            {/* Suggestions Overlay displaying custom Type tags */}
            {showDropdown && searchQuery.trim().length > 0 && suggestions.length > 0 && (
              <div className="absolute left-0 right-0 top-full mt-1 bg-white border border-[#EFE4D6] rounded-md shadow-xl max-w-md mx-auto overflow-hidden z-50">
                <div className="py-1">
                  {suggestions.map((item: any) => (
                    <div
                      key={item._id}
                      onClick={() => {
                        setSearchQuery(item.name);
                        setShowDropdown(false);
                        // Redirect to /artisans page if it's an artisan, otherwise go to /Shop
                        const destination = item.type === 'Artisan' ? '/artisans' : '/Shop';
                        router.push(`${destination}?search=${encodeURIComponent(item.name)}`);
                      }}
                      className="px-4 py-2 hover:bg-[#FFF2E5] cursor-pointer text-xs text-[#3D251E] flex justify-between items-center"
                    >
                      <span className="font-medium truncate">{item.name}</span>
                      <span className={`text-[9px] px-1.5 py-0.5 rounded font-mono uppercase tracking-wider ${
                        item.type === 'Artisan' 
                          ? 'bg-[#E3F2FD] text-blue-700' 
                          : 'bg-[#FAF1E6] text-[#8C7B75]'
                      }`}>
                        {item.type}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Links Section */}
          <div className="flex items-center justify-end gap-6 text-sm">
            <Link href="/cart" className={`flex items-center gap-2 transition ${pathname === "/cart" ? "text-[#C87A53] font-bold" : "hover:text-[#C87A53]"}`}>
              <ShoppingCart size={18} />
              <span>Cart</span>
            </Link>

            <Link href="/wishlist" className={`flex items-center gap-2 transition ${pathname === "/wishlist" ? "text-[#C87A53] font-bold" : "hover:text-[#C87A53]"}`}>
              <Heart size={18} />
              <span>Wishlist</span>
            </Link>

            <Link href={isLoggedIn ? "/profile" : "/login"} className={`flex items-center gap-2 transition ${pathname === "/profile" || pathname === "/login" ? "text-[#C87A53] font-bold" : "hover:text-[#C87A53]"}`}>
              <User size={18} />
              <span>{isLoggedIn ? "Profile" : "Login"}</span>
            </Link>
          </div>

        </div>
      </header>

      {/* NAVIGATION BAR */}
      <div className="px-6 lg:px-16 py-2 flex justify-between items-center border-b border-[#F5EBE1] text-sm font-medium relative">
        <div className="relative group">
          <button className="flex items-center gap-2 border border-[#EFE4D6] px-3 py-1.5 rounded bg-white text-xs text-[#654E47] hover:bg-[#FAF4ED] transition-colors">
            <Menu className="w-3.5 h-3.5" />
            Categories
          </button>
          <div className="absolute left-0 top-full mt-1 w-48 bg-white border border-[#EFE4D6] rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
            <Link href="/Shop" className="block px-4 py-3 text-sm hover:bg-[#FFF2E5]">Pottery</Link>
            <Link href="/Shop" className="block px-4 py-3 text-sm hover:bg-[#FFF2E5]">Thangka</Link>
            <Link href="/Shop" className="block px-4 py-3 text-sm hover:bg-[#FFF2E5]">Accessories</Link>
            <Link href="/Shop" className="block px-4 py-3 text-sm hover:bg-[#FFF2E5]">Idol Statues</Link>
            <Link href="/Shop" className="block px-4 py-3 text-sm hover:bg-[#FFF2E5]">Souvenirs</Link>
          </div>
        </div>

        <nav className="absolute left-1/2 -translate-x-1/2 flex gap-12 text-[#654E47]">
          <Link href="/home" className={`pb-0.5 transition-colors ${pathname === "/home" ? "text-[#C87A53] font-bold border-b border-[#C87A53]" : "hover:text-[#C87A53]"}`}>Home</Link>
          <Link href="/Shop" className={`pb-0.5 transition-colors ${pathname === "/Shop" ? "text-[#C87A53] font-bold border-b border-[#C87A53]" : "hover:text-[#C87A53]"}`}>Shop</Link>
          <Link href="/artisans" className={`pb-0.5 transition-colors ${pathname === "/artisans" ? "text-[#C87A53] font-bold border-b border-[#C87A53]" : "hover:text-[#C87A53]"}`}>Artisans</Link>
          <Link href="/aboutus" className={`pb-0.5 transition-colors ${pathname === "/aboutus" ? "text-[#C87A53] font-bold border-b border-[#C87A53]" : "hover:text-[#C87A53]"}`}>About Us</Link>
        </nav>
        <div className="w-24"></div>
      </div>
    </>
  );
}