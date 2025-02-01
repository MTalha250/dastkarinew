import React from "react";
import Link from "next/link";
import { MdFavorite, MdFavoriteBorder } from "react-icons/md";
import { Product } from "@/types";
import { useRouter } from "next/navigation";
import useAuthStore from "@/store/authStore";
import { useWishlistStore } from "@/store/wishlistStore";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import { GiFleurDeLys } from "react-icons/gi";

interface Props {
  product: Product;
}

function Card({ product }: Props) {
  const router = useRouter();
  const { user, token } = useAuthStore();
  const { addToWishlist, removeFromWishlist, inWishlist } = useWishlistStore();

  return (
    <Link
      href={`/products/${product.category}/${product.subCategory}/${product._id}`}
      className="group relative block overflow-hidden bg-white rounded-lg border-2 border-secondary shadow-lg transition-all duration-500 hover:shadow-2xl hover:border-[#8B4513]"
    >
      {/* Ornamental Corners */}
      <div className="absolute top-0 left-0 w-20 h-20">
        <GiFleurDeLys className="absolute top-2 left-2 opacity-20 text-2xl transform -rotate-45" />
        <div className="absolute top-0 left-0 w-full h-full border-t-2 border-l-2 border-secondary opacity-20 rounded-tl-lg" />
      </div>
      <div className="absolute top-0 right-0 w-20 h-20">
        <GiFleurDeLys className="absolute top-2 right-2 opacity-20 text-2xl transform rotate-45" />
        <div className="absolute top-0 right-0 w-full h-full border-t-2 border-r-2 border-secondary opacity-20 rounded-tr-lg" />
      </div>
      <div className="absolute bottom-0 left-0 w-20 h-20">
        <GiFleurDeLys className="absolute bottom-2 left-2 opacity-20 text-2xl transform rotate-[225deg]" />
        <div className="absolute bottom-0 left-0 w-full h-full border-b-2 border-l-2 border-secondary opacity-20 rounded-bl-lg" />
      </div>
      <div className="absolute bottom-0 right-0 w-20 h-20">
        <GiFleurDeLys className="absolute bottom-2 right-2 opacity-20 text-2xl transform rotate-[135deg]" />
        <div className="absolute bottom-0 right-0 w-full h-full border-b-2 border-r-2 border-secondary opacity-20 rounded-br-lg" />
      </div>

      {/* Decorative Pattern */}
      <div className="absolute inset-0 bg-[url('/islamic-pattern.webp')] bg-repeat opacity-5" />

      {/* Image container with smooth zoom effect */}
      <div className="relative h-64 overflow-hidden">
        <div className="absolute inset-0 border-b-2 border-[#DEB887] group-hover:border-[#8B4513] transition-colors duration-500" />
        <img
          src={product.images[0]}
          alt={product.name}
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        {product.discount > 0 && (
          <div className="absolute top-3 left-3 bg-[#2C1810] text-[#E8DED1] px-4 py-2 text-sm font-serif tracking-wider transform -skew-x-6">
            <span className="inline-block transform skew-x-6">
              {product.discount}% OFF
            </span>
          </div>
        )}
      </div>

      {/* Content container */}
      <div className="relative p-6 transition-transform duration-500 group-hover:-translate-y-1">
        {/* Decorative divider */}
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-32 h-px bg-gradient-to-r from-transparent via-[#8B4513]/30 to-transparent" />

        <h3 className="font-serif text-xl tracking-wider truncate text-[#2C1810] group-hover:text-[#8B4513] transition-colors duration-500">
          {product.name}
        </h3>

        <p className="mt-3 text-sm font-light text-[#5C4033] line-clamp-2 leading-relaxed">
          {product.description}
        </p>

        <div className="mt-4 flex items-center justify-between">
          <div className="space-x-3">
            <span className="font-serif text-lg text-[#8B4513] bg-[#DEB887]/10 px-3 py-1 rounded-sm">
              PKR {product.finalPrice.toLocaleString()}
            </span>
            {product.discount > 0 && (
              <span className="text-sm text-[#8B4513]/60 line-through">
                PKR {product.price.toLocaleString()}
              </span>
            )}
          </div>

          {/* View Details text that appears on hover */}
          <span className="text-sm font-serif text-[#8B4513] opacity-0 transform translate-x-4 transition-all duration-500 group-hover:opacity-100 group-hover:translate-x-0 flex items-center gap-2">
            Explore Artifact
            <span className="inline-block transform transition-transform duration-500 group-hover:translate-x-1">
              →
            </span>
          </span>
        </div>
      </div>

      {/* Wishlist button */}
      <button
        onClick={(e) => {
          e.preventDefault();
          if (user) {
            if (inWishlist(product._id)) {
              removeFromWishlist(product._id, token);
              toast.success("Removed from collection");
            } else {
              addToWishlist({ product }, token);
              toast.success("Added to your collection");
            }
          } else {
            toast.error("Please login to add to your collection");
            router.push("/login");
          }
        }}
        className="absolute top-3 right-3 z-20 bg-[#FFFAF0]/90 backdrop-blur-sm shadow-lg border-2 border-[#DEB887] w-10 h-10 rounded-full flex items-center justify-center transform transition-all duration-500 hover:scale-110 hover:border-[#8B4513] hover:shadow-xl group/btn"
      >
        {inWishlist(product._id) ? (
          <MdFavorite className="text-[#8B4513] text-xl transition-transform duration-500 group-hover/btn:scale-110" />
        ) : (
          <MdFavoriteBorder className="text-[#8B4513] text-xl transition-transform duration-500 group-hover/btn:scale-110" />
        )}
      </button>
    </Link>
  );
}

export default Card;
