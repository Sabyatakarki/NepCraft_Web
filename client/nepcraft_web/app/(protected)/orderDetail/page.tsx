'use client';

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Header from "../../(auth)/_components/header"; 
import Footer from "../../(auth)/_components/footer";
import { User, Phone, MapPin, Building, Milestone, CreditCard, ShoppingBag } from 'lucide-react';

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
        router.push("/orders");
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
    <div className="min-h-screen bg-[#FFFDFB] text-[#3D251E] font-sans antialiased flex flex-col">
      <Header />

      <main className="flex-grow px-4 lg:px-16 py-10 w-full max-w-7xl mx-auto">
        <h2 className="font-serif text-2xl font-bold text-[#3D251E] mb-8 border-b border-[#F2E6DA] pb-4">Checkout Details</h2>

        {cartItems.length === 0 ? (
          <div className="bg-white border border-[#F2E6DA] rounded-xl p-12 text-center max-w-md mx-auto my-12">
            <ShoppingBag className="mx-auto text-[#A8928A] mb-4" size={40} />
            <h3 className="font-serif text-lg font-bold text-[#3D251E] mb-2">Your cart is empty</h3>
            <p className="text-xs text-[#8C7B75] mb-6">Add some authentic handmade products to your cart before checking out.</p>
            <button onClick={() => router.push('/Shop')} className="bg-[#C87A53] text-white text-xs font-semibold px-6 py-2.5 rounded hover:bg-[#B36640] transition">
              Go to Shop
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* LEFT SIDE: SHIPPING FORM */}
            <div className="lg:col-span-7 bg-white border border-[#F2E6DA] rounded-xl p-6 shadow-xs space-y-5">
              <h3 className="font-serif text-lg font-bold text-[#3D251E] mb-2 flex items-center gap-2">
                Shipping Information
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Full Name */}
                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-[#3D251E] mb-1.5">Full Name *</label>
                  <div className="relative">
                    <User size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#C87A53]" />
                    <input 
                      type="text" 
                      name="fullName"
                      placeholder="Sabyata Karki"
                      value={form.fullName}
                      onChange={handleChange}
                      className="w-full border border-[#E8D9CA] rounded-md py-2 pl-9 pr-4 text-xs text-[#3D251E] bg-white focus:outline-none focus:border-[#C87A53] placeholder-[#A8928A]/50 transition"
                      required
                    />
                  </div>
                </div>

                {/* Contact Number */}
                <div>
                  <label className="block text-xs font-bold text-[#3D251E] mb-1.5">Contact Number *</label>
                  <div className="relative">
                    <Phone size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#C87A53]" />
                    <input 
                      type="text" 
                      name="contact"
                      placeholder="98XXXXXXXX"
                      value={form.contact}
                      onChange={handleChange}
                      className="w-full border border-[#E8D9CA] rounded-md py-2 pl-9 pr-4 text-xs text-[#3D251E] bg-white focus:outline-none focus:border-[#C87A53] placeholder-[#A8928A]/50 transition"
                      required
                    />
                  </div>
                </div>

                {/* City */}
                <div>
                  <label className="block text-xs font-bold text-[#3D251E] mb-1.5">City *</label>
                  <div className="relative">
                    <Building size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#C87A53]" />
                    <input 
                      type="text" 
                      name="city"
                      placeholder="Kathmandu"
                      value={form.city}
                      onChange={handleChange}
                      className="w-full border border-[#E8D9CA] rounded-md py-2 pl-9 pr-4 text-xs text-[#3D251E] bg-white focus:outline-none focus:border-[#C87A53] placeholder-[#A8928A]/50 transition"
                      required
                    />
                  </div>
                </div>

                {/* Current Address */}
                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-[#3D251E] mb-1.5">Current Address *</label>
                  <div className="relative">
                    <MapPin size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#C87A53]" />
                    <input 
                      type="text" 
                      name="address"
                      placeholder="Dhumbarahi-04"
                      value={form.address}
                      onChange={handleChange}
                      className="w-full border border-[#E8D9CA] rounded-md py-2 pl-9 pr-4 text-xs text-[#3D251E] bg-white focus:outline-none focus:border-[#C87A53] placeholder-[#A8928A]/50 transition"
                      required
                    />
                  </div>
                </div>

                {/* Landmark */}
                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-[#3D251E] mb-1.5">Landmark <span className="text-gray-400 font-normal">(Optional)</span></label>
                  <div className="relative">
                    <Milestone size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#C87A53]" />
                    <input 
                      type="text" 
                      name="landmark"
                      placeholder="Near Chowk / School"
                      value={form.landmark}
                      onChange={handleChange}
                      className="w-full border border-[#E8D9CA] rounded-md py-2 pl-9 pr-4 text-xs text-[#3D251E] bg-white focus:outline-none focus:border-[#C87A53] placeholder-[#A8928A]/50 transition"
                    />
                  </div>
                </div>

                {/* Payment Option Selection */}
                <div className="md:col-span-2 pt-2">
                  <label className="block text-xs font-bold text-[#3D251E] mb-1.5">Payment Gateway</label>
                  <div className="relative">
                    <CreditCard size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#C87A53]" />
                    <select 
                      name="paymentMethod"
                      value={form.paymentMethod}
                      onChange={handleChange}
                      className="w-full border border-[#E8D9CA] rounded-md py-2 pl-9 pr-4 text-xs text-[#3D251E] bg-white focus:outline-none focus:border-[#C87A53] appearance-none cursor-pointer transition"
                    >
                      <option value="eSewa">eSewa Wallet</option>
                      <option value="Khalti">Khalti Wallet</option>
                      <option value="Cash On Hand">Cash On Hand</option>
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-[#3D251E]">
                      ▼
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT SIDE: ORDER SUMMARY CARD */}
            <div className="lg:col-span-5 bg-[#FFFBF7] border border-[#F2E6DA] rounded-xl p-5 sticky top-6">
              <h3 className="font-serif text-lg font-bold text-[#3D251E] mb-4">Order Summary</h3>
              
              {/* Product Checkout List */}
              <div className="divide-y divide-[#F2E6DA] max-h-72 overflow-y-auto pr-1 space-y-3 mb-4">
                {cartItems.map((item) => (
                  <div key={item._id} className="flex gap-3 pt-3 first:pt-0 items-center">
                    <div className="w-16 h-16 rounded-lg overflow-hidden bg-[#FAF1E6] shrink-0 border border-[#EFE4D6]">
                      <img
                        src={`http://localhost:5000/uploads/products/${item.image}`}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-grow min-w-0">
                      <h4 className="text-xs font-bold text-[#3D251E] truncate mb-0.5">{item.name}</h4>
                      <p className="text-[10px] text-[#8C7B75]">Quantity: {item.cartQuantity}</p>
                      <p className="text-[11px] text-[#C87A53] font-medium mt-0.5">Rs {item.price.toLocaleString()}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pricing Totals Box */}
              <div className="border-t border-[#E8D9CA] pt-4 space-y-2">
                <div className="flex justify-between text-xs text-[#654E47]">
                  <span>Subtotal</span>
                  <span>Rs {totalAmount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-xs text-[#654E47]">
                  <span>Shipping Fee</span>
                  <span className="text-emerald-600 font-medium">Free</span>
                </div>
                <div className="flex justify-between font-serif text-sm font-bold text-[#3D251E] pt-2 border-t border-dashed border-[#E8D9CA]">
                  <span>Total Amount</span>
                  <span>Rs {totalAmount.toLocaleString()}</span>
                </div>
              </div>

              {/* Checkout Placement Call-to-Action */}
              <button 
                onClick={placeOrder}
                disabled={isSubmitting}
                className="w-full mt-6 bg-[#C87A53] hover:bg-[#B36640] disabled:bg-gray-400 text-white font-serif text-sm py-2.5 rounded-md transition shadow-xs font-semibold"
              >
                {isSubmitting ? "Processing Transaction..." : "Place Order"}
              </button>
            </div>

          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}