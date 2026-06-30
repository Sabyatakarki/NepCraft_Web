'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Search,
  ShoppingCart,
  Heart,
  User,
  Menu,
  Send,
  MapPin,
  Plus,
  Minus
} from 'lucide-react';

type CartItem = {
  _id: string;
  name: string;
  price: number;
  category: string;
  image: string;
  quantity: number; // Stock max
  cartQuantity:number // Added quantity in cart
};

const API_BASE = "http://localhost:5000";
const IMAGE_BASE = "http://localhost:5000/uploads/products";

export default function CartPage() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [recommendedProducts, setRecommendedProducts] = useState<any[]>([]);

  // Load items from local storage
useEffect(() => {
  try {
    const savedCart = localStorage.getItem('nepcraft_cart');
    if (savedCart) {
      setCartItems(JSON.parse(savedCart));
    }
  } catch (error) {
    console.error("Failed to parse cart items:", error);
  } finally {
    setLoading(false);
  }

  fetchRecommendations();
}, []);
  

  // Update storage helper
  const updateLocalStorage = (updatedCart: CartItem[]) => {
    setCartItems(updatedCart);
    localStorage.setItem('nepcraft_cart', JSON.stringify(updatedCart));
  };

  // Handle count increments
  const handleQuantityChange = (id: string, increment: boolean) => {
    const updated = cartItems.map((item) => {
      if (item._id === id) {
        const currentQty = item.cartQuantity || 1;
        const targetQty = increment ? currentQty + 1 : currentQty - 1;
        
        if (targetQty <= 0) return null; // Preps for clean filtering
        return { ...item, cartQuantity: targetQty };
      }
      return item;
    }).filter(Boolean) as CartItem[];

    updateLocalStorage(updated);
  };

  const fetchRecommendations = async () => {
  try {
    const res = await fetch(`${API_BASE}/api/products`);

    const data = await res.json();

    if (data.success) {
      setRecommendedProducts(data.data.slice(0, 5));
    }
  } catch (error) {
    console.error("Failed to fetch recommendations", error);
  }
};

  // Math Calculations based on Layout data 
  const totalItemsCount = cartItems.reduce((acc, item) => acc + (item.cartQuantity || 1), 0);
  const subTotal = cartItems.reduce((acc, item) => acc + (item.price * (item.cartQuantity || 1)), 0);
  const deliveryFare = subTotal > 0 ? 70 : 0;
  const packagingCost = subTotal > 0 ? 40 : 0;
  const grandTotal = subTotal + deliveryFare + packagingCost;

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

          {/* RIGHT - Actions (Cart highlighted dynamically per your request) */}
          <div className="flex items-center justify-end gap-6 text-sm">
            <Link href="/cart" className="flex items-center gap-2 text-[#C87A53] font-bold transition">
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
            <Link href="/shop/pottery" className="block px-4 py-3 text-sm hover:bg-[#FFF2E5]">Pottery</Link>
            <Link href="/shop/thangka" className="block px-4 py-3 text-sm hover:bg-[#FFF2E5]">Thangka</Link>
            <Link href="/shop/accessories" className="block px-4 py-3 text-sm hover:bg-[#FFF2E5]">Accessories</Link>
            <Link href="/shop/idol-statues" className="block px-4 py-3 text-sm hover:bg-[#FFF2E5]">Idol Statues</Link>
            <Link href="/shop/souvenirs" className="block px-4 py-3 text-sm hover:bg-[#FFF2E5]">Souvenirs</Link>
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

      {/* === CART LAYOUT BODY === */}
      <main className="flex-grow px-6 lg:px-16 py-10 max-w-7xl mx-auto w-full">
        <h2 className="text-2xl font-serif font-bold text-left mb-8 tracking-tight">My Shopping cart</h2>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          
          {/* LEFT PANEL - Product list */}
          <div className="lg:col-span-2 space-y-4">
            {loading ? (
              <p className="text-center py-10 text-sm text-[#8C7B75]">Updating your bag status...</p>
            ) : cartItems.length === 0 ? (
              <div className="text-center py-16 bg-white border border-[#F2E6DA] rounded-2xl p-8">
                <ShoppingCart className="mx-auto text-[#A8928A] mb-4" size={40} />
                <p className="text-sm font-medium text-[#654E47] mb-4">Your shopping cart looks empty.</p>
                <Link href="/Shop" className="inline-block bg-[#C87A53] text-white px-5 py-2.5 rounded-lg text-xs font-semibold uppercase tracking-wider hover:bg-[#B36640] transition">
                  Explore Products
                </Link>
              </div>
            ) : (
              cartItems.map((item) => (
                <div key={item._id} className="bg-white border border-[#F2E6DA] p-4 rounded-2xl flex flex-col sm:flex-row gap-4 shadow-[0_4px_20px_rgba(0,0,0,0.01)] text-left">
                  <div className="w-full sm:w-40 aspect-square sm:h-32 bg-[#FAF1E6] rounded-xl overflow-hidden shrink-0 border border-[#FDF9F4]">
                    <img 
                      src={item.image.startsWith('http') ? item.image : `${IMAGE_BASE}/${item.image}`} 
                      alt={item.name} 
                      className="w-full h-full object-cover" 
                    />
                  </div>
                  
                  <div className="flex-grow flex flex-col justify-between py-1">
                    <div>
                      <h4 className="font-serif font-bold text-lg text-[#3D251E] mb-1">{item.name}</h4>
                      <p className="text-xs text-[#8C7B75] leading-relaxed max-w-md mb-2">
                        Authentic handmade clay pots crafted with traditional artistry for everyday use and décor.
                      </p>
                      <div className="flex items-center gap-1 text-xs text-[#A8928A] font-medium">
                        <MapPin size={12} className="text-[#C87A53]" />
                        <span>Product of Bhaktapur, Nepal</span>
                      </div>
                    </div>

                    <div className="flex justify-between items-end mt-4 sm:mt-0">
                      <span className="text-sm font-bold text-[#C87A53]">NPR {item.price}</span>
                      
                      {/* Plus Minus Counter Panel Widget */}
                      <div className="flex items-center bg-[#FFF8F2] border border-[#F2E6DA] rounded-lg overflow-hidden p-1 gap-3">
                        <button 
                          onClick={() => handleQuantityChange(item._id, false)}
                          className="w-6 h-6 rounded bg-[#FFFDFB] border border-[#F2E6DA] flex items-center justify-center text-[#A8928A] hover:bg-[#FFF2E5] transition-colors"
                        >
                          <Minus size={12} />
                        </button>
                        <span className="text-xs font-bold text-[#3D251E] min-w-[14px] text-center">
                          {item.cartQuantity || 1}
                        </span>
                        <button 
                          onClick={() => handleQuantityChange(item._id, true)}
                          className="w-6 h-6 rounded bg-[#C87A53] flex items-center justify-center text-white hover:bg-[#B36640] transition-colors"
                        >
                          <Plus size={12} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* RIGHT PANEL - Order Summary Layout */}
          <div className="bg-white border border-[#F2E6DA] p-6 rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.01)] text-left">
            <h3 className="text-base font-serif font-bold text-[#3D251E] mb-6">Order Summary</h3>
            
            <div className="space-y-4 text-xs text-[#654E47] border-b border-[#F5EBE1] pb-5">
              <div className="flex justify-between">
                <span>Sub total ({totalItemsCount} items)</span>
                <span className="font-semibold text-[#3D251E]">Rs {subTotal}</span>
              </div>
              <div className="flex justify-between">
                <span>Delivery fare</span>
                <span className="font-semibold text-[#3D251E]">Rs {deliveryFare}</span>
              </div>
              <div className="flex justify-between">
                <span>Packaging cost</span>
                <span className="font-semibold text-[#3D251E]">Rs {packagingCost}</span>
              </div>
            </div>

            <div className="flex justify-between items-center pt-5 mb-6">
              <span className="text-sm font-bold text-[#3D251E]">Total</span>
              <span className="text-base font-black text-[#C87A53]">NPR {grandTotal}</span>
            </div>

            <button className="w-full bg-[#C87A53] hover:bg-[#B36640] text-white text-xs font-bold py-3.5 rounded-xl transition uppercase tracking-wider shadow-sm">
              Proceed to Order
            </button>
          </div>

        </div>

        {/* ARTISAN PROMOTION MOTTO RIBBON */}
        <div className="mt-14 bg-[#FFF2E5] border border-[#EFE4D6] rounded-2xl p-5 text-center">
          <div className="flex items-center justify-center gap-2 text-[#C87A53] font-serif font-bold text-sm mb-1">
            <ShoppingCart size={16} className="fill-current" />
            Every purchase supports Nepali Artisans
          </div>
          <p className="text-[11px] text-[#8C7B75]">
            Continue browsing our other local and traditional products also make sure to follow your favorites artisans
          </p>
        </div>

        {/* === RECOMMENDATION CORNER === */}
        <div className="mt-16 text-left">
          <h3 className="text-lg font-serif font-bold text-[#3D251E] mb-6">Your may also like</h3>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {recommendedProducts.map((product) => (
             <div
  key={product._id}
  className="bg-white border border-[#F2E6DA] rounded-xl overflow-hidden p-2 group shadow-[0_2px_10px_rgba(0,0,0,0.01)]"
>
                <div className="aspect-[4/3] bg-[#FAF1E6] rounded-lg overflow-hidden relative">
                 <img
  src={`${IMAGE_BASE}/${product.image}`}
  alt={product.name}
  className="w-full h-full object-cover"
/>
                  <button className="absolute top-2 right-2 w-6 h-6 bg-white/80 rounded-full flex items-center justify-center text-rose-500 shadow-sm">
                    <Heart size={12} className="fill-current" />
                  </button>
                </div>
                <div className="pt-2 px-1 flex justify-between items-end">
                  <div>
                   <p className="text-[10px] font-bold text-[#A8928A] uppercase">
  {product.category}
</p>

<h5 className="text-xs font-bold text-[#3D251E] mt-0.5">
  {product.name}
</h5>

<p className="text-xs font-black text-[#3D251E] mt-1">
  Rs {product.price}
</p>
                  </div>
                  <button className="w-7 h-7 rounded-lg border border-[#EFE4D6] flex items-center justify-center text-[#C87A53] hover:bg-[#FFF2E5] bg-white transition-colors">
                    <ShoppingCart size={12} />
                  </button>
                </div>
              </div>
            ))}
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