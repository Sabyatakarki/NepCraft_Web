'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Header from '../_components/header';
import Footer from '../_components/footer'; 
import { 
  User, MapPin, Mail, Phone, Pencil, Clock, ShoppingBag, Heart, 
  LogOut, Loader2, Camera, ShieldCheck, CheckCircle2, AlertCircle, 
  ChevronRight, Sparkles, PackageCheck
} from 'lucide-react';

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
  createdAt?: string;
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

  // Active Tab State ('profile' | 'orders')
  const [activeTab, setActiveTab] = useState<'profile' | 'orders'>('profile');

  // Alert Banner State
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Profile Form States
  const [profile, setProfile] = useState<UserProfile>({
    fullName: '',
    location: 'Kathmandu, Nepal',
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

  // Auto-dismiss toast notification
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setProfile(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return;

    const file = e.target.files[0];
    setSelectedImage(file);

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
      formData.append("location", profile.location);
      formData.append("gender", profile.gender);

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
        setToast({ type: 'success', message: 'Profile details updated successfully!' });
        setProfile((prev) => ({
          ...prev,
          ...data.data,
        }));
        setSelectedImage(null);
      } else {
        setToast({ type: 'error', message: data.message || "Failed to update profile." });
      }
    } catch (error) {
      console.error(error);
      setToast({ type: 'error', message: 'Something went wrong updating your profile.' });
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("nepcraft_cart");
    router.push("/login");
  };

  const profileImage = profile.imageUrl
    ? profile.imageUrl.startsWith("blob:")
      ? profile.imageUrl
      : `http://localhost:5000${profile.imageUrl}`
    : "/default-avatar.png";

  const getStatusBadge = (status: string) => {
    const s = status?.toLowerCase() || 'pending';
    if (s === 'delivered') {
      return <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200/60"><CheckCircle2 size={11} /> Delivered</span>;
    }
    if (s === 'cancelled') {
      return <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2.5 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200/60"><AlertCircle size={11} /> Cancelled</span>;
    }
    return <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200/60"><Clock size={11} /> {status || 'Processing'}</span>;
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#3D251E] font-sans antialiased flex flex-col selection:bg-[#C87A53]/20">
      
      <Header />

      {/* Floating Notification Toast */}
      {toast && (
        <div className="fixed top-20 right-6 z-50 animate-in fade-in slide-in-from-top-4 duration-300">
          <div className={`flex items-center gap-2.5 px-4 py-3 rounded-lg shadow-lg border text-xs font-medium ${
            toast.type === 'success' 
              ? 'bg-emerald-900 text-emerald-50 border-emerald-700' 
              : 'bg-rose-900 text-rose-50 border-rose-700'
          }`}>
            {toast.type === 'success' ? <CheckCircle2 size={16} className="text-emerald-400 shrink-0" /> : <AlertCircle size={16} className="text-rose-400 shrink-0" />}
            <span>{toast.message}</span>
          </div>
        </div>
      )}

      <main className="flex-grow px-4 sm:px-6 lg:px-12 py-10 w-full max-w-7xl mx-auto">
        
        {/* Top Header Banner */}
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-[#EFE4D6] pb-6">
          <div>
            <h1 className="font-serif text-3xl font-bold text-[#3D251E] tracking-tight">Account Settings</h1>
            <p className="text-xs text-[#8C7B75] mt-1">Manage your personal information, profile avatar, and order history.</p>
          </div>
          
          <button 
            type="button"
            onClick={handleLogout}
            className="self-start sm:self-auto inline-flex items-center gap-2 border border-[#E8D9CA] bg-white hover:bg-[#F5EBE1] text-[#6E5D57] hover:text-[#3D251E] text-xs font-medium px-4 py-2 rounded-lg transition-all shadow-xs"
          >
            <LogOut size={14} className="text-[#8C7B75]" />
            Sign Out
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT COLUMN: USER PROFILE SUMMARY CARD */}
          <div className="lg:col-span-4 space-y-6">
            
            <div className="bg-white border border-[#F2E6DA] rounded-2xl p-6 flex flex-col items-center text-center shadow-xs relative overflow-hidden">
              
              {/* Soft decorative background accent */}
              <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-b from-[#FFF2E5] to-transparent pointer-events-none" />

              {/* Avatar Holder */}
              <div className="relative z-10 my-2 group">
                <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white bg-[#FAF1E6] shadow-sm relative transition group-hover:opacity-95">
                  <img 
                    src={profileImage} 
                    alt="Profile Avatar" 
                    className="w-full h-full object-cover"
                  />
                  
                  {/* Subtle Dark Overlay on Hover */}
                  <div 
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white cursor-pointer"
                  >
                    <Camera size={20} />
                    <span className="text-[10px] font-medium mt-1">Change</span>
                  </div>
                </div>

                {/* Edit Button Trigger */}
                <button 
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  aria-label="Upload Profile Picture"
                  className="absolute bottom-1 right-1 bg-[#C87A53] hover:bg-[#B36640] text-white p-2 rounded-full border-2 border-white transition shadow-sm cursor-pointer hover:scale-105 active:scale-95"
                >
                  <Pencil size={12} />
                </button>

                <input
                  type="file"
                  accept="image/*"
                  ref={fileInputRef}
                  onChange={handleImageChange}
                  hidden
                  id="profilePicture"
                />
              </div>

              <div className="z-10 mt-1">
                <h2 className="font-serif text-xl font-bold text-[#3D251E]">
                  {profile.fullName || 'User Profile'}
                </h2>
                <div className="flex items-center justify-center gap-1 text-[11px] text-[#8C7B75] mt-1">
                  <MapPin size={12} className="text-[#C87A53] shrink-0" />
                  <span>{profile.location || 'Kathmandu, Nepal'}</span>
                </div>
              </div>

              {/* Quick Navigation Tabs */}
              <div className="w-full mt-6 pt-6 border-t border-[#F5EBE1] flex flex-col gap-1 text-left">
                <button
                  onClick={() => setActiveTab('profile')}
                  className={`flex items-center justify-between px-4 py-2.5 rounded-lg text-xs font-medium transition ${
                    activeTab === 'profile' 
                      ? 'bg-[#FFF2E5] text-[#C87A53] font-semibold' 
                      : 'text-[#6E5D57] hover:bg-[#FAF1E6]/60'
                  }`}
                >
                  <span className="flex items-center gap-2.5">
                    <User size={15} /> Personal Details
                  </span>
                  <ChevronRight size={14} className={activeTab === 'profile' ? 'opacity-100' : 'opacity-40'} />
                </button>

                <button
                  onClick={() => setActiveTab('orders')}
                  className={`flex items-center justify-between px-4 py-2.5 rounded-lg text-xs font-medium transition ${
                    activeTab === 'orders' 
                      ? 'bg-[#FFF2E5] text-[#C87A53] font-semibold' 
                      : 'text-[#6E5D57] hover:bg-[#FAF1E6]/60'
                  }`}
                >
                  <span className="flex items-center gap-2.5">
                    <ShoppingBag size={15} /> My Orders ({orders.length})
                  </span>
                  <ChevronRight size={14} className={activeTab === 'orders' ? 'opacity-100' : 'opacity-40'} />
                </button>
              </div>

              {/* Sidebar Stats Grid */}
              <div className="w-full border-t border-[#F5EBE1] mt-4 pt-4 grid grid-cols-3 text-center items-center justify-center divide-x divide-[#F5EBE1]">
                <div className="flex flex-col items-center px-1">
                  <Clock size={14} className="text-[#A8928A] mb-1" />
                  <span className="text-[9px] text-[#8C7B75] block leading-none">Member</span>
                  <span className="text-[10px] font-serif font-bold text-[#3D251E] mt-1">{profile.memberSince}</span>
                </div>
                <div className="flex flex-col items-center px-1">
                  <ShoppingBag size={14} className="text-[#A8928A] mb-1" />
                  <span className="text-[9px] text-[#8C7B75] block leading-none">Orders</span>
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

            {/* Loyalty / Verification Badge */}
            <div className="bg-[#FFF2E5]/70 border border-[#E8D9CA] rounded-xl p-4 flex items-center gap-3">
              <div className="p-2 bg-white rounded-lg border border-[#E8D9CA] text-[#C87A53] shrink-0">
                <ShieldCheck size={20} />
              </div>
              <div>
                <h4 className="text-xs font-bold text-[#3D251E]">Verified Account</h4>
                <p className="text-[10px] text-[#8C7B75] mt-0.5">Your email and phone identity are protected with NepCraft.</p>
              </div>
            </div>

          </div>

          {/* RIGHT COLUMN: DYNAMIC TAB CONTENT */}
          <div className="lg:col-span-8">
            
            {activeTab === 'profile' ? (
              /* TAB 1: EDIT PROFILE FORM */
              <div className="bg-white border border-[#F2E6DA] rounded-2xl p-6 lg:p-8 shadow-xs">
                
                <div className="flex items-center justify-between border-b border-[#F5EBE1] pb-4 mb-6">
                  <div>
                    <h3 className="font-serif text-lg font-bold text-[#3D251E]">Personal Information</h3>
                    <p className="text-xs text-[#8C7B75]">Update your personal contact details for shipping and invoices.</p>
                  </div>
                  <Sparkles size={18} className="text-[#C87A53]/50" />
                </div>

                <form onSubmit={handleSaveChanges} className="space-y-6">
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    
                    {/* Full Name */}
                    <div>
                      <label className="block text-xs font-bold text-[#3D251E] mb-2 uppercase tracking-wider">Full Name</label>
                      <div className="relative">
                        <User size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#C87A53]" />
                        <input 
                          type="text" 
                          name="fullName"
                          value={profile.fullName}
                          onChange={handleChange}
                          placeholder="Your Name"
                          className="w-full border border-[#E8D9CA] rounded-lg py-2.5 pl-10 pr-4 text-xs text-[#3D251E] bg-[#FFFDFB] focus:bg-white focus:outline-none focus:border-[#C87A53] focus:ring-1 focus:ring-[#C87A53] transition"
                          required
                        />
                      </div>
                    </div>

                    {/* Email Address */}
                    <div>
                      <label className="block text-xs font-bold text-[#3D251E] mb-2 uppercase tracking-wider">Email Address</label>
                      <div className="relative">
                        <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#C87A53]" />
                        <input 
                          type="email" 
                          name="email"
                          value={profile.email}
                          onChange={handleChange}
                          placeholder="name@example.com"
                          className="w-full border border-[#E8D9CA] rounded-lg py-2.5 pl-10 pr-4 text-xs text-[#3D251E] bg-[#FFFDFB] focus:bg-white focus:outline-none focus:border-[#C87A53] focus:ring-1 focus:ring-[#C87A53] transition"
                          required
                        />
                      </div>
                    </div>

                    {/* Contact Phone Number */}
                    <div>
                      <label className="block text-xs font-bold text-[#3D251E] mb-2 uppercase tracking-wider">Contact Info</label>
                      <div className="relative">
                        <Phone size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#C87A53]" />
                        <input 
                          type="text" 
                          name="phoneNumber"
                          value={profile.phoneNumber}
                          onChange={handleChange}
                          placeholder="+977 9800000000"
                          className="w-full border border-[#E8D9CA] rounded-lg py-2.5 pl-10 pr-4 text-xs text-[#3D251E] bg-[#FFFDFB] focus:bg-white focus:outline-none focus:border-[#C87A53] focus:ring-1 focus:ring-[#C87A53] transition"
                        />
                      </div>
                    </div>

                    {/* Location */}
                    <div>
                      <label className="block text-xs font-bold text-[#3D251E] mb-2 uppercase tracking-wider">Primary Shipping Address</label>
                      <div className="relative">
                        <MapPin size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#C87A53]" />
                        <input 
                          type="text" 
                          name="location"
                          value={profile.location}
                          onChange={handleChange}
                          placeholder="Kathmandu, Nepal"
                          className="w-full border border-[#E8D9CA] rounded-lg py-2.5 pl-10 pr-4 text-xs text-[#3D251E] bg-[#FFFDFB] focus:bg-white focus:outline-none focus:border-[#C87A53] focus:ring-1 focus:ring-[#C87A53] transition"
                        />
                      </div>
                    </div>

                    {/* Gender Select */}
                    <div className="md:col-span-2">
                      <label className="block text-xs font-bold text-[#3D251E] mb-2 uppercase tracking-wider">Gender</label>
                      <div className="relative">
                        <User size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#C87A53]" />
                        <select
                          name="gender"
                          value={profile.gender}
                          onChange={handleChange}
                          className="w-full border border-[#E8D9CA] rounded-lg py-2.5 pl-10 pr-4 text-xs text-[#3D251E] bg-[#FFFDFB] focus:bg-white focus:outline-none focus:border-[#C87A53] focus:ring-1 focus:ring-[#C87A53] transition appearance-none cursor-pointer"
                        >
                          <option value="Not Specified">Prefer not to say</option>
                          <option value="Female">Female</option>
                          <option value="Male">Male</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>
                    </div>

                  </div>

                  {/* Action Buttons Container */}
                  <div className="pt-6 border-t border-[#F5EBE1] flex justify-end items-center gap-3">
                    <button 
                      type="submit" 
                      disabled={loading}
                      className="bg-[#C87A53] hover:bg-[#B36640] text-white font-serif text-xs font-bold px-8 py-3 rounded-lg transition shadow-xs flex items-center gap-2 min-w-[150px] justify-center disabled:opacity-70 cursor-pointer active:scale-98"
                    >
                      {loading ? (
                        <>
                          <Loader2 size={15} className="animate-spin" />
                          Updating...
                        </>
                      ) : (
                        'Save Changes'
                      )}
                    </button>
                  </div>

                </form>
              </div>
            ) : (
              /* TAB 2: FULL ORDER HISTORY VIEW */
              <div className="bg-white border border-[#F2E6DA] rounded-2xl p-6 lg:p-8 shadow-xs">
                
                <div className="flex justify-between items-center border-b border-[#F5EBE1] pb-4 mb-6">
                  <div>
                    <h3 className="font-serif text-lg font-bold text-[#3D251E]">Order History</h3>
                    <p className="text-xs text-[#8C7B75]">Review your past craft purchases and track current shipments.</p>
                  </div>
                  <span className="text-xs font-bold px-3 py-1 bg-[#FAF1E6] text-[#C87A53] rounded-full border border-[#E8D9CA]">
                    {orders.length} {orders.length === 1 ? 'Order' : 'Orders'} Total
                  </span>
                </div>

                {loadingOrders ? (
                  <div className="flex flex-col items-center justify-center py-16 text-[#A8928A] gap-3">
                    <Loader2 className="animate-spin text-[#C87A53]" size={28} />
                    <span className="text-xs font-medium">Fetching your order history...</span>
                  </div>
                ) : orders.length === 0 ? (
                  <div className="text-center py-16 border-2 border-dashed border-[#F2E6DA] rounded-2xl bg-[#FFFDFB] p-6">
                    <PackageCheck size={40} className="mx-auto text-[#A8928A] mb-3 opacity-60" />
                    <h4 className="font-serif text-base font-bold text-[#3D251E]">No Orders Found</h4>
                    <p className="text-xs text-[#8C7B75] max-w-sm mx-auto mt-1 mb-4">
                      You haven't placed any handcrafted orders yet. Explore our marketplace to discover unique items!
                    </p>
                    <Link 
                      href="/" 
                      className="inline-flex items-center gap-1.5 bg-[#C87A53] hover:bg-[#B36640] text-white text-xs font-bold px-5 py-2.5 rounded-lg transition"
                    >
                      Browse Handicrafts
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {orders.map((order) => {
                      const firstItem = order.items?.[0];
                      const totalItemsCount = order.items?.reduce((acc, curr) => acc + curr.quantity, 0) || 0;

                      return (
                        <div 
                          key={order._id}
                          className="border border-[#F2E6DA] hover:border-[#E8D9CA] bg-[#FFFDFB] rounded-xl p-4 sm:p-5 transition flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-2xs hover:shadow-xs"
                        >
                          {/* Order Artwork Thumbnail + Details */}
                          <div className="flex items-center gap-4 min-w-0">
                            <div className="w-20 h-20 rounded-lg overflow-hidden bg-[#FAF1E6] shrink-0 border border-[#FDF9F4]">
                              <img 
                                src={firstItem?.product?.image ? `http://localhost:5000/uploads/products/${firstItem.product.image}` : 'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&q=80&w=300'} 
                                alt={firstItem?.product?.name || "Craft Item"} 
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&q=80&w=300';
                                }}
                              />
                            </div>

                            <div className="min-w-0 space-y-1">
                              <div className="flex items-center gap-2 flex-wrap">
                                <h4 className="font-serif text-sm font-bold text-[#3D251E] truncate">
                                  {firstItem?.product?.name || 'Handicraft Package'}
                                </h4>
                                {getStatusBadge(order.status)}
                              </div>

                              {order.items.length > 1 && (
                                <p className="text-[11px] text-[#C87A53] font-medium italic">
                                  + {order.items.length - 1} additional item(s)
                                </p>
                              )}

                              <div className="flex items-center gap-3 text-[11px] text-[#8C7B75] pt-0.5">
                                <span>Qty: {totalItemsCount}</span>
                                <span>•</span>
                                <span className="font-bold text-[#C87A53]">Rs {order.totalAmount?.toLocaleString()}</span>
                              </div>
                            </div>
                          </div>

                          {/* Action Button */}
                          <div className="flex sm:flex-col items-center sm:items-end justify-between border-t sm:border-t-0 border-[#F5EBE1] pt-3 sm:pt-0 shrink-0">
                            <Link 
                              href="/order" 
                              className="inline-flex items-center gap-1 bg-[#C87A53] hover:bg-[#B36640] text-white text-xs font-bold px-4 py-2 rounded-lg transition"
                            >
                              View Details
                              <ChevronRight size={13} />
                            </Link>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

              </div>
            )}

          </div>

        </div>

      </main>

      <Footer />

    </div>
  );
}