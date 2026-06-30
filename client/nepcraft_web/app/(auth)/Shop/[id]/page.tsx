import Link from "next/link";
import {
  Search,
  ShoppingCart,
  Heart,
  User,
  Menu,
  Send,
  ChevronDown,
  ArrowLeft,
  ShoppingBag
} from 'lucide-react';

import AddToCartButton from "@/app/(auth)/_components/add_to_cart_button";
import WishlistButton from '@/app/(auth)/_components/wishlist_btn';




const API_BASE = "http://localhost:5000";

async function getProduct(id: string) {
  const res = await fetch(`${API_BASE}/api/products/${id}`, {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Product not found");
  }

  const data = await res.json();
  return data.data;
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = await getProduct(id);

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
        
        {/* LEFT - Categories Dropdown */}
        <div className="relative group">
          <button className="flex items-center gap-2 border border-[#EFE4D6] px-3 py-1.5 rounded bg-white text-xs text-[#654E47] hover:bg-[#FAF4ED] transition-colors">
            <Menu className="w-3.5 h-3.5" /> Categories
          </button>
          <div className="absolute left-0 top-full mt-1 w-48 bg-white border border-[#EFE4D6] rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
            <Link href="/shop/pottery" className="block px-4 py-3 text-sm hover:bg-[#FFF2E5]">Pottery</Link>
            <Link href="/shop/thangka" className="block px-4 py-3 text-sm hover:bg-[#FFF2E5]">Thangka</Link>
            <Link href="/shop/accessories" className="block px-4 py-3 text-sm hover:bg-[#FFF2E5]">Accessories</Link>
            <Link href="/shop/idol-statues" className="block px-4 py-3 text-sm hover:bg-[#FFF2E5]">Idol Statues</Link>
            <Link href="/shop/souvenirs" className="block px-4 py-3 text-sm hover:bg-[#FFF2E5]">Souvenirs</Link>
          </div>
        </div>

        {/* CENTER - Links */}
        <nav className="absolute left-1/2 -translate-x-1/2 flex gap-12 text-[#654E47]">
          <Link href="/home" className="hover:text-[#C87A53] transition-colors">Home</Link>
          <Link href="/Shop" className="text-[#C87A53] font-bold border-b border-[#C87A53] pb-0.5">Shop</Link>
          <Link href="/artisans" className="hover:text-[#C87A53] transition-colors">Artisans</Link>
          <Link href="/aboutus" className="hover:text-[#C87A53] transition-colors">About Us</Link>
        </nav>

        {/* RIGHT Empty Space */}
        <div className="w-24"></div>
      </div>

      {/* === MAIN PRODUCT CONTENT === */}
      <main className="flex-grow px-6 lg:px-16 py-10">
        
        {/* Navigation Action */}
        <div className="mb-8">
          <Link
            href="/Shop"
            className="inline-flex items-center gap-2 text-xs font-bold text-[#C87A53] uppercase tracking-wider hover:text-[#B36640] transition-colors group"
          >
            <ArrowLeft size={14} className="group-hover:-translate-x-0.5 transition-transform" /> 
            Back to Shop
          </Link>
        </div>

        {/* Product Container Card */}
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-16 bg-white border border-[#F2E6DA] p-6 md:p-10 rounded-2xl shadow-[0_4px_30px_rgba(0,0,0,0.01)]">
          
          {/* Left Side: Product Image Display */}
          <div className="aspect-square md:h-[480px] w-full bg-[#FAF1E6] rounded-xl overflow-hidden border border-[#FDF9F4]">
            <img
              src={`${API_BASE}/uploads/products/${product.image}`}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Right Side: Product Details */}
          <div className="flex flex-col justify-center text-left">
            
            {/* Category Tag */}
            <span className="inline-block self-start text-[10px] font-bold text-[#A8928A] uppercase tracking-wider bg-[#FAF1E6] px-2.5 py-1 rounded-md mb-3 border border-[#EFE4D6]">
              {product.category || 'Handcrafted'}
            </span>

            {/* Product Name */}
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-[#3D251E] tracking-tight mb-4">
              {product.name}
            </h2>

            {/* Price Tag */}
            <p className="text-2xl md:text-3xl font-black text-[#C87A53] tracking-tight mb-6">
              Rs {product.price.toLocaleString()}
            </p>

            <hr className="border-[#F5EBE1] mb-6" />

            {/* Meta Information List */}
            <div className="space-y-3 mb-8 text-sm text-[#654E47]">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-[#3D251E] w-24">Availability:</span>
                <span className={product.quantity > 0 ? "text-emerald-600 font-medium" : "text-rose-600 font-medium"}>
                  {product.quantity > 0 ? `In Stock (${product.quantity} items available)` : "Out of Stock"}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-[#3D251E] w-24">Craft Origin:</span>
                <span className="font-light">Authentic Artisan Collective, Nepal</span>
              </div>
            </div>

            {/* Add to Cart CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <AddToCartButton product={product} />
              <WishlistButton product={product} />
            </div>

          </div>
        </div>
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
              <li><Link href="/Shop" className="hover:text-[#C87A53]">Woodcarving</Link></li>
              <li><Link href="/Shop" className="hover:text-[#C87A53]">Idol Statues</Link></li>
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