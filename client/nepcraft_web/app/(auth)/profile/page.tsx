'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Header from '../_components/header';
import Footer from '../_components/footer'; 
import { User, MapPin, Mail, Phone, Pencil, Clock, ShoppingBag, Heart, LogOut, Loader2 } from 'lucide-react';

type UserProfile = {
  fullName: string;
  location: string;
  email: string;
  phoneNumber: string;
  gender: string;
  imageUrl: string;
  memberSince: string;
  wishlistCount: number;
};

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
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Profile Form States
  const [profile, setProfile] = useState<UserProfile>({
    fullName: '',
    location: 'Kathmandu, Nepal', // Fallback context matching default
    email: '',
    phoneNumber: '',
    gender: 'Not Specified',
    imageUrl: '',
    memberSince: 'May 2026',
    wishlistCount: 5,
  });

  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  // Dynamic order states loaded from API
  const [orders, setOrders] = useState<OrderItemResponse[]>([]);
  const [loadingOrders, setLoadingOrders] = useState<boolean>(true);

  useEffect(() => {
    fetchProfile();
    fetchOrderHistory();
  }, []);

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const res = await fetch("http://localhost:5000/api/auth/profile", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (data.success) {
        // Fallback checks handle parameters expected by UI not provided explicitly by update schema
        setProfile((prev) => ({
          ...prev,
          ...data.data,
          fullName: data.data.fullName || prev.fullName,
          email: data.data.email || prev.email,
          phoneNumber: data.data.phoneNumber || prev.phoneNumber,
          imageUrl: data.data.imageUrl || prev.imageUrl,
        }));
      }
    } catch (error) {
      console.error("Error fetching user profile:", error);
    }
  };

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

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return;

    const file = e.target.files[0];
    setSelectedImage(file);

    // Preview image before uploading
    setProfile((prev) => ({
      ...prev,
      imageUrl: URL.createObjectURL(file),
    }));
  };

  const handleSaveChanges = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      const formData = new FormData();
      formData.append("fullName", profile.fullName);
      formData.append("email", profile.email);
      formData.append("phoneNumber", profile.phoneNumber);

      if (selectedImage) {
        formData.append("profilePicture", selectedImage);
      }

      const res = await fetch("http://localhost:5000/api/auth/update-profile", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await res.json();

      if (data.success) {
        alert("Profile updated successfully!");
        setProfile((prev) => ({
          ...prev,
          ...data.data,
        }));
        setSelectedImage(null);
      } else {
        alert(data.message || "Failed to update profile.");
      }
    } catch (error) {
      console.error(error);
      alert("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("nepcraft_cart");
    router.push("/login");
  };

  // Determine dynamic profile layout image address context
  const profileImage = profile.imageUrl
    ? profile.imageUrl.startsWith("blob:")
      ? profile.imageUrl
      : `http://localhost:5000${profile.imageUrl}`
    : "/default-avatar.png";

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
                  src={profileImage} 
                  alt="Profile" 
                  className="w-full h-full object-cover"
                />
              </div>
              
              {/* Trigger click on hidden input element */}
              <button 
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="absolute bottom-1 right-2 bg-[#C87A53] hover:bg-[#B36640] text-white p-2 rounded-full border-2 border-white transition shadow-sm cursor-pointer"
              >
                <Pencil size={12} className="fill-current" />
              </button>

              {/* Hidden File Input UI Element */}
              <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                onChange={handleImageChange}
                hidden
                id="profilePicture"
              />
            </div>

            <h3 className="font-serif text-lg font-bold text-[#3D251E] mb-0.5">{profile.fullName || 'User Profile'}</h3>
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
                      name="fullName"
                      value={profile.fullName}
                      onChange={handleChange}
                      className="w-full border border-[#E8D9CA] rounded-md py-2.5 pl-10 pr-4 text-xs text-[#3D251E] bg-white focus:outline-none focus:border-[#C87A53] transition"
                      required
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
                      required
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
                      name="phoneNumber"
                      value={profile.phoneNumber}
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
                  disabled={loading}
                  className="bg-[#C87A53] hover:bg-[#B36640] text-white font-serif text-sm px-10 py-2.5 rounded-md transition shadow-xs flex items-center gap-2 min-w-[150px] justify-center disabled:opacity-70"
                >
                  {loading ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      Saving...
                    </>
                  ) : (
                    'Save changes'
                  )}
                </button>
              </div>

            </form>
          </div>
        </div>

        {/* ORDER HISTORY GRID SECTION */}
        <section className="mb-6">
          <div className="flex justify-between items-baseline mb-4">
            <h3 className="font-serif text-xl font-bold text-[#3D251E]">Recent Orders</h3>
            <Link href="/order" className="text-xs font-serif text-[#C87A53] hover:underline flex items-center gap-0.5">
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
              {orders.slice(0, 3).map((order) => {
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