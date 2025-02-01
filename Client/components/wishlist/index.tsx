import React from "react";
import { CiHeart } from "react-icons/ci";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useWishlistStore } from "@/store/wishlistStore";
import WishlistItem from "./wishlistItem";
import useAuthStore from "@/store/authStore";
import { Wishlist } from "@/types";

const WishlistComp = () => {
  const { wishlist, clearWishlist } = useWishlistStore();
  const { user, token } = useAuthStore();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="relative outline-none">
        <CiHeart className="inline-block text-3xl hover:scale-125 transition duration-200 text-[#E8DED1]" />
        {user && (
          <span className="-top-2 -right-1 h-4 w-4 absolute bg-offwhite text-secondary rounded-full p-0.5 text-[10px] flex justify-center items-center">
            {wishlist.length}
          </span>
        )}
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-screen max-w-[450px] h-[70vh] p-5 bg-[#fffbec] border-2 border-secondary">
        {user ? (
          <div className="w-full h-full">
            {wishlist.length ? (
              <div className="h-full">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-serif tracking-wide text-amber-900">
                    Your Collection
                  </h2>
                  <button
                    onClick={() => clearWishlist(token)}
                    className="py-2 px-4 bg-amber-800 text-[#E8DED1] hover:bg-amber-900 transition duration-200 font-serif tracking-wide text-sm"
                  >
                    Clear Collection
                  </button>
                </div>
                <div className="flex flex-col justify-between h-[calc(100%-4rem)] pt-3 pb-10 overflow-auto">
                  <div className="space-y-4">
                    {wishlist.map((item: Wishlist) => (
                      <WishlistItem key={item.product._id} item={item} />
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="h-full flex items-center justify-center">
                <p className="text-lg font-serif tracking-wide text-amber-900 text-center">
                  Your collection is empty
                </p>
              </div>
            )}
          </div>
        ) : (
          <div className="h-full flex items-center justify-center">
            <p className="text-lg font-serif tracking-wide text-amber-900 text-center">
              Please login to view your collection
            </p>
          </div>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default WishlistComp;
