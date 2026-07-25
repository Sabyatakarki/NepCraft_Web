import Link from "next/link";
import { 
  ChevronRight, 
  ShieldCheck, 
  Truck, 
  Sparkles, 
  Heart, 
  Award,
  Clock,
  RotateCcw
} from "lucide-react";

import AddToCartButton from "@/app/(auth)/_components/add_to_cart_button";
import WishlistButton from "@/app/(auth)/_components/wishlist_btn";

// Import your existing Header and Footer components here:
import Header from "../../_components/header";
import Footer from "../../_components/footer";

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
    <div className="min-h-screen bg-[#FFFDFB] text-[#3D251E] font-sans antialiased flex flex-col selection:bg-[#C87A53]/20 selection:text-[#C87A53]">

      {/* HEADER COMPONENT */}
      <Header />

      {/* === MAIN PRODUCT SECTION === */}
      <main className="flex-grow px-6 lg:px-16 py-8 max-w-7xl mx-auto w-full">

       

        {/* PRODUCT GRID CONTAINER */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-14 items-start mb-16">
          
          {/* LEFT: COMPACT & ELEGANT IMAGE DISPLAY (5 cols) */}
          <div className="md:col-span-5 flex flex-col items-center">
            <div className="relative w-full max-w-md aspect-square bg-[#FAF7F2] rounded-2xl overflow-hidden border border-[#EFE4D6] shadow-sm group">
              
              {/* Product Craft Badge */}
              <div className="absolute top-3.5 left-3.5 z-10">
                <span className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider bg-white/95 backdrop-blur-md text-[#C87A53] px-3 py-1 rounded-full border border-[#E8D9CA] shadow-2xs">
                  <Sparkles size={11} />
                  Authentic Nepali Craft
                </span>
              </div>

              {/* Main Image with Smooth Hover Effect */}
              <img
                src={`${API_BASE}/uploads/products/${product.image}`}
                alt={product.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
              />
            </div>

            {/* Thumbnail Gallery Preview */}
            <div className="flex gap-3 mt-3 w-full max-w-md justify-start">
              <button className="w-16 h-16 rounded-xl border-2 border-[#C87A53] overflow-hidden bg-[#FAF7F2] p-0.5 shadow-2xs transition-all">
                <img 
                  src={`${API_BASE}/uploads/products/${product.image}`} 
                  alt={product.name} 
                  className="w-full h-full object-cover rounded-lg" 
                />
              </button>
            </div>
          </div>

          {/* RIGHT: PRODUCT DETAILS & PURCHASING (7 cols) */}
          <div className="md:col-span-7 flex flex-col text-left">
            
            {/* Category Pill */}
            <div className="mb-3">
              <span className="inline-block text-[10px] font-bold text-[#C87A53] uppercase tracking-widest bg-[#FFF2E5] px-3 py-1 rounded-md border border-[#E8D9CA]">
                {product.category || 'Handcrafted'}
              </span>
            </div>

            {/* Product Title */}
            <h1 className="font-serif text-2xl md:text-3xl lg:text-4xl font-bold text-[#3D251E] tracking-tight leading-snug mb-3">
              {product.name}
            </h1>

            {/* Price & Stock Status Bar */}
            <div className="flex items-center gap-4 mb-5 border-b border-[#F5EBE1] pb-5">
              <span className="text-2xl md:text-3xl font-extrabold text-[#C87A53] tracking-tight">
                Rs {product.price?.toLocaleString()}
              </span>
              <span className={`text-xs font-semibold px-3 py-1 rounded-full border ${
                product.quantity > 0 
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                  : 'bg-rose-50 text-rose-700 border-rose-200'
              }`}>
                {product.quantity > 0 ? `In Stock (${product.quantity} left)` : "Out of Stock"}
              </span>
            </div>

            {/* Product Description */}
            <p className="text-xs md:text-sm text-[#654E47] leading-relaxed mb-6">
              {product.description || "Handcrafted with devotion by local Nepalese artisans using traditional techniques passed down through generations. Every item possesses subtle unique traits inherent to true handmade craft."}
            </p>

            {/* ARTISAN SUPPORT CARD */}
            <div className="bg-[#FAF7F2] border border-[#EFE4D6] rounded-xl p-3.5 mb-6 flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-[#FFF2E5] border border-[#E8D9CA] flex items-center justify-center shrink-0 text-[#C87A53]">
                <Award size={18} />
              </div>
              <div className="text-left">
                <h4 className="text-xs font-bold text-[#3D251E]">Empowering Local Heritage</h4>
                <p className="text-[11px] text-[#8C7B75]">Every purchase directly supports sustainable artisan livelihoods in Nepal.</p>
              </div>
            </div>

            {/* CTA ACTION BUTTONS */}
            <div className="flex flex-col sm:flex-row gap-3 mb-6">
              <div className="flex-1">
                <AddToCartButton product={product} />
              </div>
              <WishlistButton product={product} />
            </div>

            {/* TRUST & GUARANTEE BADGES */}
            <div className="grid grid-cols-2 gap-3 pt-5 border-t border-[#F5EBE1] text-xs text-[#654E47]">
              <div className="flex items-center gap-2">
                <ShieldCheck size={16} className="text-[#C87A53] shrink-0" />
                <span>100% Genuine Handcraft</span>
              </div>
              <div className="flex items-center gap-2">
                <Truck size={16} className="text-[#C87A53] shrink-0" />
                <span>Safe & Secure Packaging</span>
              </div>
            </div>

          </div>
        </div>

        {/* DETAILS & SPECIFICATIONS GRID */}
        <section className="border border-[#F2E6DA] bg-white rounded-2xl p-6 md:p-8 mb-12 shadow-2xs">
          <h3 className="font-serif text-lg font-bold text-[#3D251E] mb-4 border-b border-[#F5EBE1] pb-3 text-left">
            Craftsmanship & Care
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs text-[#654E47] leading-relaxed text-left">
            <div>
              <h4 className="font-semibold text-[#3D251E] uppercase tracking-wider text-[11px] mb-1.5 flex items-center gap-1.5">
                <Sparkles size={13} className="text-[#C87A53]" /> Materials & Finish
              </h4>
              <p>Made from locally sourced, authentic natural materials. Clean gently with a soft dry cloth. Keep away from harsh moisture or direct extreme elements.</p>
            </div>
            <div>
              <h4 className="font-semibold text-[#3D251E] uppercase tracking-wider text-[11px] mb-1.5 flex items-center gap-1.5">
                <Clock size={13} className="text-[#C87A53]" /> Cultural Origin
              </h4>
              <p>Crafted in the Kathmandu Valley, Nepal. Preserving indigenous artisan techniques and traditional Himalayan art forms.</p>
            </div>
            <div>
              <h4 className="font-semibold text-[#3D251E] uppercase tracking-wider text-[11px] mb-1.5 flex items-center gap-1.5">
                <RotateCcw size={13} className="text-[#C87A53]" /> Delivery & Returns
              </h4>
              <p>Carefully wrapped in eco-conscious protective materials. Standard dispatch within 2-4 business days.</p>
            </div>
          </div>
        </section>

      </main>

      {/* FOOTER COMPONENT */}
      <Footer />

    </div>
  );
}