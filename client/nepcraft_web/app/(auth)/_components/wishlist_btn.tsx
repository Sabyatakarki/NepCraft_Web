'use client';

import { Heart } from 'lucide-react';
import { useRouter } from 'next/navigation';

type Props = {
  product: any;
};

export default function WishlistButton({ product }: Props) {
  const router = useRouter();

  const addToWishlist = () => {
    const existingWishlist = JSON.parse(
      localStorage.getItem('nepcraft_wishlist') || '[]'
    );

    const exists = existingWishlist.find(
      (item: any) => item._id === product._id
    );

    if (!exists) {
      existingWishlist.push(product);

      localStorage.setItem(
        'nepcraft_wishlist',
        JSON.stringify(existingWishlist)
      );
    }

    alert('❤️ Added to Wishlist');

    router.push('/wishlist');
  };

  return (
    <button
      onClick={addToWishlist}
      className="w-12 h-12 border border-[#EFE4D6] rounded-lg flex items-center justify-center text-[#A8928A] hover:text-[#C87A53] hover:bg-[#FFF2E5] transition-colors bg-white shadow-sm"
    >
      <Heart size={16} />
    </button>
  );
}