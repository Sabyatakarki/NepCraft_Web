'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Header from '../_components/header';
import Footer from '../_components/footer'; 
import { User, MapPin, Mail, Phone, Pencil, Clock, ShoppingBag, Heart, LogOut, Loader2 } from 'lucide-react';

type UserProfile = {
  name: string;
  location: string;
  email: string;
  phone: string;
  gender: string;
  memberSince: string;
  wishlistCount: number;
};

// Updated type mapping to align with your API schema structure
type OrderItemResponse = {
  _id: string;
  totalAmount: number;
  status: string;
  items: Array<{
    _id: string;
    quantity: number;
    price: number;
    product?: {
      name: string;
      image: string;
    };
  }>;
};

const API_BASE = 'http://localhost:5000/api/orders';

export default function ProfilePage() {
  const router = useRouter();

  // Profile Form States
  const [profile, setProfile] = useState<UserProfile>({
    name: 'Sabyata Karki',
    location: 'Dhumbarahi, Kathmandu',
    email: 'Sabyatakarki05@gmail.com',
    phone: '977+ 9847378337',
    gender: 'Female',
    memberSince: 'May 2026',
    wishlistCount: 10,
  });

  // Dynamic order states loaded from API
  const [orders, setOrders] = useState<OrderItemResponse[]>([]);
  const [loadingOrders, setLoadingOrders] = useState<boolean>(true);

  useEffect(() => {
    fetchOrderHistory();
  }, []);

  const fetchOrderHistory = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const res = await fetch(`${API_BASE}/my-orders`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (data.success) {
        // Keeps only the latest 3 elements for the dashboard snapshot feed
        setOrders(data.data || []);
      }
    } catch (err) {
      console.error('Error fetching profile dynamic history:', err);
    } finally {
      setLoadingOrders(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfile(prev => ({ ...prev, [name]: value }));
  };

  const handleSaveChanges = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Changes saved successfully!');
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('nepcraft_cart');
    router.push('/login');
  };

  return (
    <div className="min-h-screen bg-[#FFFDFB] text-[#3D251E] font-sans antialiased flex flex-col">
      
      <Header />

      <main className="flex-grow px-6 lg:px-16 py-10 w-full max-w-7xl mx-auto">
        
        <h2 className="font-serif text-2xl font-bold text-[#3D251E] mb-8">Profile Section</h2>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-14">
          
          {/* LEFT SIDEBAR: AVATAR CARD */}
          <div className="lg:col-span-4 bg-white border border-[#F2E6DA] rounded-xl p-6 flex flex-col items-center relative shadow-xs">
            <div className="relative w-40 h-40 mb-4">
              <div className="w-full h-full rounded-full overflow-hidden border border-[#EFE4D6] bg-[#FAF1E6]">
                <img 
                  src="https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&q=80&w=400" 
                  alt="User Avatar" 
                  className="w-full h-full object-cover"
                />
              </div>
              <button className="absolute bottom-1 right-2 bg-[#C87A53] hover:bg-[#B36640] text-white p-2 rounded-full border-2 border-white transition shadow-sm">
                <Pencil size={12} className="fill-current" />
              </button>
            </div>

            <h3 className="font-serif text-lg font-bold text-[#3D251E] mb-0.5">{profile.name}</h3>
            <p className="text-[11px] text-[#8C7B75] mb-6">{profile.location}</p>

            {/* Sidebar Stats Grid */}
            <div className="w-full border-t border-[#F5EBE1] pt-4 grid grid-cols-3 text-center items-center justify-center divide-x divide-[#F5EBE1]">
              <div className="flex flex-col items-center px-1">
                <Clock size={14} className="text-[#A8928A] mb-1" />
                <span className="text-[9px] text-[#8C7B75] block leading-none">Member since</span>
                <span className="text-[9px] font-serif font-bold text-[#3D251E] mt-1">{profile.memberSince}</span>
              </div>
              <div className="flex flex-col items-center px-1">
                <ShoppingBag size={14} className="text-[#A8928A] mb-1" />
                <span className="text-[9px] text-[#8C7B75] block leading-none">Order History</span>
                <span className="text-[11px] font-bold text-[#3D251E] mt-0.5">
                  {loadingOrders ? '...' : orders.length}
                </span>
              </div>
              <div className="flex flex-col items-center px-1">
                <Heart size={14} className="text-[#A8928A] mb-1" />
                <span className="text-[9px] text-[#8C7B75] block leading-none">Wishlist</span>
                <span className="text-[11px] font-bold text-[#3D251E] mt-0.5">{profile.wishlistCount}</span>
              </div>
            </div>
          </div>

          {/* RIGHT PANELS: EDIT PROFILE FORM */}
          <div className="lg:col-span-8 bg-white border border-[#F2E6DA] rounded-xl p-6 lg:p-8 shadow-xs">
            <form onSubmit={handleSaveChanges} className="space-y-6">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Full Name */}
                <div>
                  <label className="block text-sm font-bold text-[#3D251E] mb-2">Full Name</label>
                  <div className="relative">
                    <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#C87A53]" />
                    <input 
                      type="text" 
                      name="name"
                      value={profile.name}
                      onChange={handleChange}
                      className="w-full border border-[#E8D9CA] rounded-md py-2.5 pl-10 pr-4 text-xs text-[#3D251E] bg-white focus:outline-none focus:border-[#C87A53] transition"
                    />
                  </div>
                </div>

                {/* Location */}
                <div>
                  <label className="block text-sm font-bold text-[#3D251E] mb-2">Location</label>
                  <div className="relative">
                    <MapPin size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#C87A53]" />
                    <input 
                      type="text" 
                      name="location"
                      value={profile.location}
                      onChange={handleChange}
                      className="w-full border border-[#E8D9CA] rounded-md py-2.5 pl-10 pr-4 text-xs text-[#3D251E] bg-white focus:outline-none focus:border-[#C87A53] transition"
                    />
                  </div>
                </div>

                {/* Email Address */}
                <div>
                  <label className="block text-sm font-bold text-[#3D251E] mb-2">Email Address</label>
                  <div className="relative">
                    <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#C87A53]" />
                    <input 
                      type="email" 
                      name="email"
                      value={profile.email}
                      onChange={handleChange}
                      className="w-full border border-[#E8D9CA] rounded-md py-2.5 pl-10 pr-4 text-xs text-[#3D251E] bg-white focus:outline-none focus:border-[#C87A53] transition"
                    />
                  </div>
                </div>

                {/* Contact Info */}
                <div>
                  <label className="block text-sm font-bold text-[#3D251E] mb-2">Contact Info</label>
                  <div className="relative">
                    <Phone size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#C87A53]" />
                    <input 
                      type="text" 
                      name="phone"
                      value={profile.phone}
                      onChange={handleChange}
                      className="w-full border border-[#E8D9CA] rounded-md py-2.5 pl-10 pr-4 text-xs text-[#3D251E] bg-white focus:outline-none focus:border-[#C87A53] transition"
                    />
                  </div>
                </div>

                {/* Gender */}
                <div>
                  <label className="block text-sm font-bold text-[#3D251E] mb-2">Gender</label>
                  <div className="relative">
                    <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#C87A53]" />
                    <input 
                      type="text" 
                      name="gender"
                      value={profile.gender}
                      onChange={handleChange}
                      className="w-full border border-[#E8D9CA] rounded-md py-2.5 pl-10 pr-4 text-xs text-[#3D251E] bg-white focus:outline-none focus:border-[#C87A53] transition"
                    />
                  </div>
                </div>
              </div>

              {/* Action Buttons Container */}
              <div className="pt-4 flex justify-end items-center gap-4">
                <button 
                  type="button"
                  onClick={handleLogout}
                  className="flex items-center gap-2 border border-[#E8D9CA] hover:bg-[#FAF6F0] text-[#8C7B75] hover:text-[#3D251E] font-serif text-sm px-6 py-2.5 rounded-md transition shadow-xs"
                >
                  <LogOut size={15} />
                  Log out
                </button>
                
                <button 
                  type="submit" 
                  className="bg-[#C87A53] hover:bg-[#B36640] text-white font-serif text-sm px-10 py-2.5 rounded-md transition shadow-xs"
                >
                  Save changes
                </button>
              </div>

            </form>
          </div>
        </div>

        {/* ORDER HISTORY GRID SECTION */}
        <section className="mb-6">
          <div className="flex justify-between items-baseline mb-4">
            <h3 className="font-serif text-xl font-bold text-[#3D251E]">Recent Orders</h3>
            <Link href="/orders" className="text-xs font-serif text-[#C87A53] hover:underline flex items-center gap-0.5">
              View all
            </Link>
          </div>

          {loadingOrders ? (
            <div className="flex items-center justify-center py-12 text-[#A8928A] gap-2">
              <Loader2 className="animate-spin" size={20} />
              <span className="text-xs font-medium">Loading history...</span>
            </div>
          ) : orders.length === 0 ? (
            <div className="text-center py-12 border border-dashed border-[#F2E6DA] rounded-xl bg-white">
              <p className="text-xs text-[#8C7B75]">No transactions recorded yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {/* Slice to show only the most recent 3 items inside dashboard overview snippet */}
              {orders.slice(0, 3).map((order) => {
                // Safely grab information from the first nested item wrapper block
                const directItem = order.items?.[0];
                return (
                  <div 
                    key={order._id} 
                    className="bg-white border border-[#F2E6DA] rounded-xl p-3 flex gap-4 items-center shadow-xs"
                  >
                    {/* Dynamic Artwork Thumbnail */}
                    <div className="w-24 h-20 rounded-lg overflow-hidden bg-[#FAF1E6] shrink-0 border border-[#FDF9F4]">
                      <img 
                        src={`http://localhost:5000/uploads/products/${directItem?.product?.image}`} 
                        alt={directItem?.product?.name || "Handicraft Artwork"} 
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          // Fallback source placeholder 
                          (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&q=80&w=300';
                        }}
                      />
                    </div>

                    {/* Info Metadata Block */}
                    <div className="flex-grow flex flex-col justify-between h-full py-0.5 min-w-0">
                      <div className="min-w-0">
                        <h4 className="font-serif text-xs font-bold text-[#3D251E] tracking-tight truncate">
                          {directItem?.product?.name || 'Order Package Summary'}
                        </h4>
                        {order.items.length > 1 && (
                          <p className="text-[9px] text-[#C87A53] font-medium font-sans italic">
                            + {order.items.length - 1} more item(s)
                          </p>
                        )}
                        <p className="text-[10px] text-[#8C7B75] mt-0.5">Total Qty: {order.items.reduce((acc, current) => acc + current.quantity, 0)}</p>
                        <p className="text-[#C87A53] text-[11px] font-bold mt-0.5">Rs {order.totalAmount.toLocaleString()}</p>
                      </div>
                      
                      <div className="flex justify-between items-center mt-2 gap-2">
                        <span className="text-[10px] text-amber-600 font-medium capitalize truncate max-w-[80px]">
                          {order.status || 'Received'}
                        </span>
                        <Link 
                          href={`/order`} 
                          className="bg-[#C87A53] hover:bg-[#B36640] text-white text-[9px] px-3 py-1 rounded transition font-medium shrink-0"
                        >
                          View Details
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>

      </main>

      <Footer />

    </div>
  );
}