'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Header from '../../(auth)/_components/header';
import Footer from '../../(auth)/_components/footer';
import { ShoppingBag, Package, MapPin, CreditCard, ExternalLink } from 'lucide-react';

const API_BASE = 'http://localhost:5000/api/orders';

export default function OrdersPage() {
  const router = useRouter();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem('token');

      const res = await fetch(`${API_BASE}/my-orders`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (data.success) {
        setOrders(data.data);
      } else {
        alert(data.message);
      }
    } catch (err) {
      console.error(err);
      alert('Failed to fetch orders');
    } finally {
      setLoading(false);
    }
  };

  const getStatusStyles = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'delivered':
        return 'bg-emerald-50 text-emerald-700 border-emerald-100';
      case 'processing':
      case 'order received':
        return 'bg-amber-50 text-amber-700 border-amber-100';
      case 'cancelled':
        return 'bg-rose-50 text-rose-700 border-rose-100';
      default:
        return 'bg-blue-50 text-blue-700 border-blue-100';
    }
  };

  return (
    <div className="min-h-screen bg-[#FFFDFB] text-[#3D251E] font-sans antialiased flex flex-col">
      <Header />

      <main className="flex-grow px-4 lg:px-16 py-12 w-full max-w-5xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 pb-5 border-b border-[#F2E6DA]">
          <div>
            <h2 className="font-serif text-3xl font-bold text-[#3D251E]">My Purchase History</h2>
            <p className="text-xs text-[#8C7B75] mt-1">Track and manage your orders</p>
          </div>
        </div>

        {loading ? (
          <div className="space-y-6 py-12 animate-pulse">
            <div className="h-56 bg-[#FAF1E6] rounded-xl w-full" />
            <div className="h-56 bg-[#FAF1E6] rounded-xl w-full" />
          </div>
        ) : orders.length === 0 ? (
          <div className="bg-white border border-[#F2E6DA] rounded-xl p-16 text-center max-w-md mx-auto my-12">
            <ShoppingBag className="mx-auto text-[#A8928A] mb-4" size={44} />
            <h3 className="font-serif text-xl font-bold text-[#3D251E] mb-2">Your history is empty</h3>
            <p className="text-xs text-[#8C7B75] mb-6 leading-relaxed">
              Looks like you haven't discovered any artisan or handcrafted products yet.
            </p>
            <button
              onClick={() => router.push('/Shop')}
              className="bg-[#C87A53] text-white text-xs font-semibold px-8 py-3 rounded-md hover:bg-[#B36640] transition shadow-xs"
            >
              Start Exploring
            </button>
          </div>
        ) : (
          <div className="space-y-8">
            {orders.map((order: any) => (
              <div
                key={order._id}
                className="bg-white border border-[#F2E6DA] rounded-xl overflow-hidden shadow-xs hover:shadow-sm transition-all duration-200"
              >
                {/* Minimalist Top Metadata Strip */}
                <div className="bg-[#FFFBF7] px-6 py-4 border-b border-[#F2E6DA] flex flex-wrap justify-between items-center gap-4 text-xs">
                  <div className="flex items-center gap-6">
                    <div>
                      <span className="text-[#8C7B75] text-[10px] block uppercase tracking-wider font-semibold">Order Hash Reference</span>
                      <span className="font-mono text-[#3D251E] font-medium tracking-tight">#{order._id.toUpperCase()}</span>
                    </div>
                    <div>
                      <span className="text-[#8C7B75] text-[10px] block uppercase tracking-wider font-semibold">Grand Total</span>
                      <span className="font-serif font-bold text-sm text-[#3D251E]">Rs {order.totalAmount.toLocaleString()}</span>
                    </div>
                  </div>

                  <span className={`text-[11px] font-semibold px-3 py-1 rounded-md border tracking-wide uppercase ${getStatusStyles(order.status)}`}>
                    {order.status || 'Received'}
                  </span>
                </div>

                {/* Sub-Layout Container */}
                <div className="p-6 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                  
                  {/* Left Column: List of items with significantly expanded images */}
                  <div className="lg:col-span-8 space-y-5">
                    <div className="text-xs text-[#8C7B75] uppercase tracking-wider font-bold flex items-center gap-2 border-b border-[#FAF1E6] pb-2">
                      <Package size={14} className="text-[#C87A53]" />
                      Ordered Items ({order.items.length})
                    </div>

                    <div className="divide-y divide-[#FAF1E6]">
                      {order.items.map((item: any) => (
                        <div key={item._id} className="py-4 flex gap-5 first:pt-0 last:pb-0 items-center">
                          {/* Expanded Image Box */}
                          <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-xl overflow-hidden bg-[#FAF1E6] shrink-0 border border-[#EFE4D6]">
                            <img
                              src={`http://localhost:5000/uploads/products/${item.product?.image}`}
                              alt={item.product?.name}
                              className="w-full h-full object-cover transform hover:scale-105 transition duration-300"
                            />
                          </div>

                          {/* Content Segment */}
                          <div className="flex-1 min-w-0 space-y-1.5">
                            <h4 className="text-sm font-serif font-bold text-[#3D251E] truncate">
                              {item.product?.name || 'Handicraft Masterpiece'}
                            </h4>
                            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-[#8C7B75]">
                              <p>Unit Price: <span className="text-[#3D251E]">Rs {item.price}</span></p>
                              <p>Quantity: <span className="font-mono text-[#3D251E] font-bold">× {item.quantity}</span></p>
                            </div>
                            <p className="text-xs font-bold text-[#C87A53] pt-0.5">
                              Subtotal: Rs {(item.price * item.quantity).toLocaleString()}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  
                  <div className="lg:col-span-4 bg-[#FFFDFB] border border-[#F5EBE1] rounded-xl p-5 space-y-4 text-xs">
                    <div>
                      <div className="flex items-center gap-1.5 text-[#3D251E] font-bold mb-2">
                        <MapPin size={14} className="text-[#C87A53]" />
                        <span>Shipping Location</span>
                      </div>
                      <p className="text-[#8C7B75] leading-relaxed pl-5 bg-white p-2.5 rounded border border-[#FAF1E6]">
                        {order.address}, {order.city}
                      </p>
                    </div>

                    <div className="pt-2 border-t border-[#FAF1E6]">
                      <div className="flex items-center gap-1.5 text-[#3D251E] font-bold mb-2">
                        <CreditCard size={14} className="text-[#C87A53]" />
                        <span>Payment Terms</span>
                      </div>
                      <div className="flex justify-between items-center bg-white p-2.5 rounded border border-[#FAF1E6] pl-5">
                        <span className="text-[#8C7B75]">Method Used:</span>
                        <span className="font-medium text-[#3D251E] tracking-wide uppercase text-[10px] bg-[#FAF1E6] px-2 py-0.5 rounded">
                          {order.paymentMethod}
                        </span>
                      </div>
                    </div>
                  </div>

                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}