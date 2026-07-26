'use client';

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Header from "../../(auth)/_components/header"; 
import Footer from "../../(auth)/_components/footer";
import { User, Phone, MapPin, Building, Milestone, CreditCard, ShoppingBag, ArrowRight, ShieldCheck, Truck } from 'lucide-react';

const API_BASE = "http://localhost:5000/api/orders";

type CartItem = {
  _id: string;
  name: string;
  price: number;
  image: string;
  cartQuantity: number;
};

export default function OrderPage() {
  const router = useRouter();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [form, setForm] = useState({
    fullName: "",
    contact: "",
    address: "",
    city: "",
    landmark: "",
    paymentMethod: "eSewa",
  });

  useEffect(() => {
    const cart = localStorage.getItem("nepcraft_cart");
    if (cart) {
      setCartItems(JSON.parse(cart));
    }
  }, []);

  const totalAmount = cartItems.reduce(
    (total, item) => total + item.price * item.cartQuantity,
    0
  );

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const placeOrder = async () => {
    if (!form.fullName || !form.contact || !form.address || !form.city) {
      alert("Please fill in all mandatory shipping information fields.");
      return;
    }

    if (cartItems.length === 0) {
      alert("Your cart is empty.");
      return;
    }

    try {
      setIsSubmitting(true);
      const token = localStorage.getItem("token");

      const items = cartItems.map((item) => ({
        product: item._id,
        quantity: item.cartQuantity,
        price: item.price,
      }));

      const res = await fetch(API_BASE, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          items,
          fullName: form.fullName,
          contact: form.contact,
          address: form.address,
          city: form.city,
          landmark: form.landmark,
          paymentMethod: form.paymentMethod,
          totalAmount,
        }),
      });

      const data = await res.json();

      if (data.success) {
        alert("Order placed successfully!");
        localStorage.removeItem("nepcraft_cart");
        router.push("/order");
      } else {
        alert(data.message || "Failed to process transaction.");
      }
    } catch (error) {
      console.error(error);
      alert("Failed to place order");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF6F0] text-[#3D251E] font-sans antialiased flex flex-col">
      <Header />

      <main className="flex-grow px-4 sm:px-6 lg:px-12 py-10 w-full max-w-6xl mx-auto">
        {/* Header Header/Breadcrumb area */}
        <div className="mb-8">
          <h1 className="font-serif text-3xl font-bold text-[#3D251E] tracking-tight">Checkout</h1>
          <p className="text-xs text-[#8C7B75] mt-1">Complete your shipping details to place your artisan order.</p>
        </div>

        {cartItems.length === 0 ? (
          <div className="bg-white border border-[#F2E6DA] rounded-2xl p-12 text-center max-w-md mx-auto my-12 shadow-xs">
            <div className="w-16 h-16 bg-[#FAF1E6] rounded-full flex items-center justify-center mx-auto mb-4 text-[#C87A53]">
              <ShoppingBag size={28} />
            </div>
            <h3 className="font-serif text-xl font-bold text-[#3D251E] mb-2">Your cart is empty</h3>
            <p className="text-xs text-[#8C7B75] leading-relaxed mb-6">
              Add some authentic handmade products to your cart before proceeding to checkout.
            </p>
            <button 
              onClick={() => router.push('/Shop')} 
              className="inline-flex items-center justify-center gap-2 bg-[#C87A53] hover:bg-[#B36640] text-white text-xs font-medium px-6 py-3 rounded-lg transition-all shadow-xs hover:shadow-md"
            >
              Go to Shop <ArrowRight size={14} />
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* LEFT SIDE: SHIPPING FORM */}
            <div className="lg:col-span-7 bg-white border border-[#F2E6DA] rounded-2xl p-6 sm:p-8 shadow-xs space-y-6">
              <div>
                <h2 className="font-serif text-xl font-bold text-[#3D251E] border-b border-[#F2E6DA] pb-3">
                  Shipping Information
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Full Name */}
                <div className="md:col-span-2 space-y-1.5">
                  <label className="block text-xs font-semibold text-[#5A423A]">
                    Full Name <span className="text-[#C87A53]">*</span>
                  </label>
                  <div className="relative">
                    <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#A8928A]" />
                    <input 
                      type="text" 
                      name="fullName"
                      placeholder="Sabyata Karki"
                      value={form.fullName}
                      onChange={handleChange}
                      className="w-full border border-[#E8D9CA] rounded-lg py-2.5 pl-10 pr-4 text-xs text-[#3D251E] bg-white focus:outline-none focus:ring-2 focus:ring-[#C87A53]/20 focus:border-[#C87A53] placeholder-[#A8928A]/60 transition"
                      required
                    />
                  </div>
                </div>

                {/* Contact Number */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-[#5A423A]">
                    Contact Number <span className="text-[#C87A53]">*</span>
                  </label>
                  <div className="relative">
                    <Phone size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#A8928A]" />
                    <input 
                      type="text" 
                      name="contact"
                      placeholder="98XXXXXXXX"
                      value={form.contact}
                      onChange={handleChange}
                      className="w-full border border-[#E8D9CA] rounded-lg py-2.5 pl-10 pr-4 text-xs text-[#3D251E] bg-white focus:outline-none focus:ring-2 focus:ring-[#C87A53]/20 focus:border-[#C87A53] placeholder-[#A8928A]/60 transition"
                      required
                    />
                  </div>
                </div>

                {/* City */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-[#5A423A]">
                    City <span className="text-[#C87A53]">*</span>
                  </label>
                  <div className="relative">
                    <Building size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#A8928A]" />
                    <input 
                      type="text" 
                      name="city"
                      placeholder="Kathmandu"
                      value={form.city}
                      onChange={handleChange}
                      className="w-full border border-[#E8D9CA] rounded-lg py-2.5 pl-10 pr-4 text-xs text-[#3D251E] bg-white focus:outline-none focus:ring-2 focus:ring-[#C87A53]/20 focus:border-[#C87A53] placeholder-[#A8928A]/60 transition"
                      required
                    />
                  </div>
                </div>

                {/* Current Address */}
                <div className="md:col-span-2 space-y-1.5">
                  <label className="block text-xs font-semibold text-[#5A423A]">
                    Current Address <span className="text-[#C87A53]">*</span>
                  </label>
                  <div className="relative">
                    <MapPin size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#A8928A]" />
                    <input 
                      type="text" 
                      name="address"
                      placeholder="Dhumbarahi-04"
                      value={form.address}
                      onChange={handleChange}
                      className="w-full border border-[#E8D9CA] rounded-lg py-2.5 pl-10 pr-4 text-xs text-[#3D251E] bg-white focus:outline-none focus:ring-2 focus:ring-[#C87A53]/20 focus:border-[#C87A53] placeholder-[#A8928A]/60 transition"
                      required
                    />
                  </div>
                </div>

                {/* Landmark */}
                <div className="md:col-span-2 space-y-1.5">
                  <label className="block text-xs font-semibold text-[#5A423A]">
                    Landmark <span className="text-[#A8928A] font-normal">(Optional)</span>
                  </label>
                  <div className="relative">
                    <Milestone size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#A8928A]" />
                    <input 
                      type="text" 
                      name="landmark"
                      placeholder="Near Chowk / School"
                      value={form.landmark}
                      onChange={handleChange}
                      className="w-full border border-[#E8D9CA] rounded-lg py-2.5 pl-10 pr-4 text-xs text-[#3D251E] bg-white focus:outline-none focus:ring-2 focus:ring-[#C87A53]/20 focus:border-[#C87A53] placeholder-[#A8928A]/60 transition"
                    />
                  </div>
                </div>

                {/* Payment Option Selection */}
                <div className="md:col-span-2 space-y-1.5 pt-2">
                  <label className="block text-xs font-semibold text-[#5A423A]">
                    Payment Gateway
                  </label>
                  <div className="relative">
                    <CreditCard size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#A8928A]" />
                    <select 
                      name="paymentMethod"
                      value={form.paymentMethod}
                      onChange={handleChange}
                      className="w-full border border-[#E8D9CA] rounded-lg py-2.5 pl-10 pr-10 text-xs text-[#3D251E] bg-white focus:outline-none focus:ring-2 focus:ring-[#C87A53]/20 focus:border-[#C87A53] appearance-none cursor-pointer transition"
                    >
                      <option value="eSewa">eSewa Wallet</option>
                      <option value="Khalti">Khalti Wallet</option>
                      <option value="Cash On Hand">Cash On Hand</option>
                    </select>
                    <div className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-[#8C7B75]">
                      <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                        <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT SIDE: ORDER SUMMARY CARD */}
            <div className="lg:col-span-5 bg-white border border-[#F2E6DA] rounded-2xl p-6 shadow-xs sticky top-6 space-y-5">
              <h2 className="font-serif text-xl font-bold text-[#3D251E] border-b border-[#F2E6DA] pb-3">
                Order Summary
              </h2>
              
              {/* Product Checkout List */}
              <div className="divide-y divide-[#F8F1E9] max-h-72 overflow-y-auto pr-1">
                {cartItems.map((item) => (
                  <div key={item._id} className="flex gap-3 py-3 first:pt-0 last:pb-0 items-center">
                    <div className="w-14 h-14 rounded-lg overflow-hidden bg-[#FAF1E6] shrink-0 border border-[#F2E6DA] relative">
                      <img
                        src={`http://localhost:5000/uploads/products/${item.image}`}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                      <span className="absolute bottom-0 right-0 bg-[#3D251E] text-white text-[9px] font-bold px-1.5 py-0.5 rounded-tl-md">
                        x{item.cartQuantity}
                      </span>
                    </div>
                    <div className="flex-grow min-w-0">
                      <h3 className="text-xs font-semibold text-[#3D251E] truncate">{item.name}</h3>
                      <p className="text-[11px] text-[#8C7B75] mt-0.5">Rs {item.price.toLocaleString()} each</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-bold text-[#C87A53]">
                        Rs {(item.price * item.cartQuantity).toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pricing Totals Box */}
              <div className="bg-[#FAF6F0] rounded-xl p-4 space-y-2.5 border border-[#F2E6DA]">
                <div className="flex justify-between text-xs text-[#654E47]">
                  <span>Subtotal</span>
                  <span>Rs {totalAmount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-xs text-[#654E47]">
                  <span>Shipping Fee</span>
                  <span className="text-emerald-700 font-medium bg-emerald-50 px-2 py-0.5 rounded-full text-[10px]">
                    Free Delivery
                  </span>
                </div>
                <div className="flex justify-between font-serif text-sm font-bold text-[#3D251E] pt-2.5 border-t border-[#E8D9CA]">
                  <span>Total Amount</span>
                  <span className="text-[#C87A53]">Rs {totalAmount.toLocaleString()}</span>
                </div>
              </div>

              {/* Checkout Placement Call-to-Action */}
              <button 
                onClick={placeOrder}
                disabled={isSubmitting}
                className="w-full bg-[#C87A53] hover:bg-[#B36640] disabled:bg-[#D3C7C0] text-white font-medium text-xs py-3.5 rounded-lg transition-all shadow-xs hover:shadow-md flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <span>Processing Order...</span>
                ) : (
                  <>
                    <span>Confirm Order</span>
                    <ArrowRight size={14} />
                  </>
                )}
              </button>

              {/* Security & Trust Badges */}
              <div className="grid grid-cols-2 gap-2 pt-2 text-[10px] text-[#8C7B75]">
                <div className="flex items-center gap-1.5">
                  <ShieldCheck size={14} className="text-[#C87A53]" />
                  <span>Secure Checkout</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Truck size={14} className="text-[#C87A53]" />
                  <span>Doorstep Delivery</span>
                </div>
              </div>
            </div>

          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}