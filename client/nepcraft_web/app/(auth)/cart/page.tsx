'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from "next/navigation";
import Header from '../_components/header';
import Footer from '../_components/footer';
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
  const router = useRouter();
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
      <Header />

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

          <button
          type="button"
          onClick={() => router.push("/orderDetail")}
          className="w-full bg-[#C87A53] hover:bg-[#B36640] text-white text-xs font-bold py-3.5 rounded-xl transition uppercase tracking-wider shadow-sm"
        >
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
          <h3 className="text-lg font-serif font-bold text-[#3D251E] mb-6">You may also like</h3>
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

      <Footer />
    </div>
  );
}