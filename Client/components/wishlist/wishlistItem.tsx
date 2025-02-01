import React from "react";
import { useWishlistStore } from "@/store/wishlistStore";
import { IoIosClose } from "react-icons/io";
import Link from "next/link";
import { Wishlist } from "@/types";
import useAuthStore from "@/store/authStore";

interface Props {
  item: Wishlist;
}

const WishlistItem = ({ item }: Props) => {
  const { user, token } = useAuthStore();
  const { removeFromWishlist } = useWishlistStore();
  
  return (
    <Link
      href={`/products/${item.product.category}/${item.product.subCategory}/${item.product._id}`}
      className="group relative block bg-white p-4 border-2 border-amber-200 hover:border-amber-300 transition-all duration-300"
    >
      <div className="flex items-center space-x-4">
        <div className="relative w-24 h-24 overflow-hidden">
          <img
            src={item.product.images[0]}
            alt={item.product.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 border border-amber-200 opacity-30" />
        </div>
        
        <div className="flex-1">
          <h3 className="font-serif text-lg text-amber-900 mb-1 group-hover:text-amber-800 transition-colors duration-300">
            {item.product.name}
          </h3>
          <p className="text-amber-800 font-serif">
            PKR {item.product.finalPrice.toLocaleString()}
          </p>
        </div>

        <button
          onClick={(e) => {
            e.preventDefault();
            removeFromWishlist(item.product._id, token);
          }}
          className="flex items-center justify-center w-8 h-8 rounded-full bg-amber-800 hover:bg-amber-900 text-[#E8DED1] transition-colors duration-300"
        >
          <IoIosClose className="text-xl" />
        </button>
      </div>
    </Link>
  );
};

export default WishlistItem;
