'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Header from '../_components/header';
import Footer from '../_components/footer'; 
import { User, MapPin, Mail, Phone, Pencil, Clock, ShoppingBag, Heart, LogOut } from 'lucide-react';

type UserProfile = {
  name: string;
  location: string;
  email: string;
  phone: string;
  gender: string;
  memberSince: string;
  orderHistoryCount: number;
  wishlistCount: number;
};

type OrderItem = {
  id: string;
  title: string;
  qty: number;
  price: number;
  status: string;
  img: string;
};

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
    orderHistoryCount: 3,
    wishlistCount: 10,
  });

  // Mocked Order History
  const [orders, setOrders] = useState<OrderItem[]>([
    { id: '1', title: 'Ceramic cups', qty: 1, price: 300, status: 'Order received', img: 'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&q=80&w=300' },
    { id: '2', title: 'Ceramic cups', qty: 1, price: 300, status: 'Order received', img: 'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&q=80&w=300' },
    { id: '3', title: 'Ceramic cups', qty: 1, price: 300, status: 'Order received', img: 'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&q=80&w=300' },
  ]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfile(prev => ({ ...prev, [name]: value }));
  };

  const handleSaveChanges = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Changes saved successfully!');
  };

  const handleLogout = () => {
    // Clear dynamic session records securely 
    localStorage.removeItem('token');
    localStorage.removeItem('nepcraft_cart');
    
    // Smooth client-side route navigation replacement
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
                <span className="text-[11px] font-bold text-[#3D251E] mt-0.5">{profile.orderHistoryCount}</span>
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
            <h3 className="font-serif text-xl font-bold text-[#3D251E]">Order History</h3>
            <Link href="/orders" className="text-xs font-serif text-[#C87A53] hover:underline flex items-center gap-0.5">
              View all
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {orders.map((order, index) => (
              <div 
                key={`${order.id}-${index}`} 
                className="bg-white border border-[#F2E6DA] rounded-xl p-3 flex gap-4 items-center shadow-xs"
              >
                {/* Order Item Craft Artwork Thumbnail */}
                <div className="w-24 h-20 rounded-lg overflow-hidden bg-[#FAF1E6] shrink-0 border border-[#FDF9F4]">
                  <img src={order.img} alt={order.title} className="w-full h-full object-cover" />
                </div>

                {/* Info and Navigation Actions */}
                <div className="flex-grow flex flex-col justify-between h-full py-0.5">
                  <div>
                    <h4 className="font-serif text-xs font-bold text-[#3D251E] tracking-tight">{order.title}</h4>
                    <p className="text-[10px] text-[#8C7B75] mt-0.5">Qty : {order.qty}</p>
                    <p className="text-[#C87A53] text-[11px] font-bold mt-0.5">NPR {order.price}</p>
                  </div>
                  
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-[10px] text-emerald-600 font-medium">{order.status}</span>
                    <Link 
                      href={`/orders/${order.id}`} 
                      className="bg-[#C87A53] hover:bg-[#B36640] text-white text-[9px] px-3 py-1 rounded transition font-medium"
                    >
                      View details
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

      </main>

      <Footer />

    </div>
  );
}