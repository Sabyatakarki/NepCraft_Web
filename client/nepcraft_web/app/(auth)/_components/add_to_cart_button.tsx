'use client';

import { useState } from "react";
import { ShoppingBag } from "lucide-react";

type Product = {
  _id: string;
  name: string;
  price: number;
  category: string;
  image: string;
  quantity: number;
};

export default function AddToCartButton({
  product,
}: {
  product: Product;
}) {
  const [message, setMessage] = useState("");

  const handleAddToCart = () => {
    const existingCart = JSON.parse(
      localStorage.getItem("nepcraft_cart") || "[]"
    );

    const existingProduct = existingCart.find(
      (item: Product) => item._id === product._id
    );

    if (existingProduct) {
      existingProduct.cartQuantity =
        (existingProduct.cartQuantity || 1) + 1;
    } else {
      existingCart.push({
        ...product,
        cartQuantity: 1,
      });
    }

    localStorage.setItem(
      "nepcraft_cart",
      JSON.stringify(existingCart)
    );

    setMessage("✅ Added to Cart");

    setTimeout(() => {
      setMessage("");
    }, 2000);
  };

  return (
    <div className="flex-1">
      <button
        onClick={handleAddToCart}
        className="w-full bg-[#C87A53] text-white text-xs font-semibold px-6 py-3.5 rounded-lg hover:bg-[#B36640] transition shadow-sm flex items-center justify-center gap-2 uppercase tracking-wider"
      >
        <ShoppingBag size={15} />
        Add to Cart
      </button>

      {message && (
        <p className="text-green-600 text-xs mt-2 font-medium">
          {message}
        </p>
      )}
    </div>
  );
}