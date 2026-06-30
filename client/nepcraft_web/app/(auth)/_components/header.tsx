'use client';

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  Search,
  ShoppingCart,
  Heart,
  User,
  Menu,
} from "lucide-react";

export default function Header() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      setIsLoggedIn(true);
    }
  }, []);

  return (
    <>
      {/* TOP BAR */}
      <header className="border-b border-[#EFE4D6] bg-white px-6 lg:px-16 py-4">
        <div className="grid grid-cols-3 items-center">

          {/* Logo */}
          <div className="flex items-center gap-2 justify-start">
            <img
              src="/vase.png"
              alt="NepCraft Logo"
              className="h-12 w-auto object-contain"
            />

            <div>
              <h1 className="font-serif text-[28px] leading-none text-[#5C4033]">
                NepCraft
              </h1>

              <p className="text-[10px] text-[#8C7B75]">
                Handmade with hearts
              </p>
            </div>
          </div>

          {/* Search */}
          <div className="flex justify-center">
            <div className="relative w-full max-w-md">
              <input
                type="text"
                placeholder="Search products, artisans..."
                className="w-full border border-[#E8D9CA] rounded-md py-2 pl-4 pr-10 text-sm focus:outline-none focus:border-[#C87A53]"
              />

              <Search
                size={18}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#C87A53]"
              />
            </div>
          </div>

          {/* Right */}
          <div className="flex items-center justify-end gap-6 text-sm">

            <Link
              href="/cart"
              className="flex items-center gap-2 hover:text-[#C87A53] transition"
            >
              <ShoppingCart size={18} />
              <span>Cart</span>
            </Link>

            <Link
              href="/wishlist"
              className="flex items-center gap-2 hover:text-[#C87A53] transition"
            >
              <Heart size={18} />
              <span>Wishlist</span>
            </Link>

            {isLoggedIn ? (
              <Link
                href="/profile"
                className="flex items-center gap-2 hover:text-[#C87A53] transition"
              >
                <User size={18} />
                <span>Profile</span>
              </Link>
            ) : (
              <Link
                href="/login"
                className="flex items-center gap-2 hover:text-[#C87A53] transition"
              >
                <User size={18} />
                <span>Login</span>
              </Link>
            )}

          </div>
        </div>
      </header>

      {/* NAVBAR */}
      <div className="px-6 lg:px-16 py-2 flex justify-between items-center border-b border-[#F5EBE1] text-sm font-medium">

        {/* Categories */}
        <div className="relative group">
          <button className="flex items-center gap-2 border border-[#EFE4D6] px-3 py-1.5 rounded bg-white text-xs text-[#654E47] hover:bg-[#FAF4ED] transition-colors">
            <Menu className="w-3.5 h-3.5" />
            Categories
          </button>

          <div className="absolute left-0 top-full mt-1 w-48 bg-white border border-[#EFE4D6] rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">

            <Link href="/Shop" className="block px-4 py-3 text-sm hover:bg-[#FFF2E5]">
              Pottery
            </Link>

            <Link href="/Shop" className="block px-4 py-3 text-sm hover:bg-[#FFF2E5]">
              Thangka
            </Link>

            <Link href="/Shop" className="block px-4 py-3 text-sm hover:bg-[#FFF2E5]">
              Accessories
            </Link>

            <Link href="/Shop" className="block px-4 py-3 text-sm hover:bg-[#FFF2E5]">
              Idol Statues
            </Link>

            <Link href="/Shop" className="block px-4 py-3 text-sm hover:bg-[#FFF2E5]">
              Souvenirs
            </Link>

          </div>
        </div>

        {/* Navbar */}
        <nav className="absolute left-1/2 -translate-x-1/2 flex gap-12 text-[#654E47]">

          <Link href="/home" className="hover:text-[#C87A53]">
            Home
          </Link>

          <Link href="/Shop" className="hover:text-[#C87A53]">
            Shop
          </Link>

          <Link href="/artisans" className="hover:text-[#C87A53]">
            Artisans
          </Link>

          <Link href="/aboutus" className="hover:text-[#C87A53]">
            About Us
          </Link>

        </nav>

        <div className="w-24"></div>

      </div>
    </>
  );
}