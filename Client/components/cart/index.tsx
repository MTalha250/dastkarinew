import React from "react";
import { BsCart2 } from "react-icons/bs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useCartStore } from "@/store/cartStore";
import CartItem from "./cartItem";
import useAuthStore from "@/store/authStore";
import { Cart } from "@/types";
import Link from "next/link";

const CartComp = () => {
  const { items, clearCart } = useCartStore();
  const { user, token } = useAuthStore();

  const calculateTotal = () => {
    let total = 0;
    items.forEach((item) => {
      total += item.product.finalPrice * item.quantity;
    });
    return total;
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="relative outline-none">
        <BsCart2 className="inline-block text-3xl hover:scale-125 transition duration-200 text-[#E8DED1]" />
        {user && (
          <span className="-top-2 -right-1 h-4 w-4 absolute bg-offwhite text-secondary font-semibold rounded-full p-0.5 text-[10px] flex justify-center items-center">
            {items.length}
          </span>
        )}
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-screen max-w-[450px] h-[70vh] p-5 bg-[#fffbec] border-2 border-secondary">
        {user ? (
          <div className="w-full h-full">
            {items.length ? (
              <div className="h-full flex flex-col">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-serif tracking-wide text-amber-900">
                    Your Cart
                  </h2>
                  <button
                    onClick={() => clearCart(user ? true : false, token)}
                    className="py-2 px-4 bg-amber-800 text-[#E8DED1] hover:bg-amber-900 transition duration-200 font-serif tracking-wide text-sm"
                  >
                    Clear Cart
                  </button>
                </div>
                <div className="flex-1 overflow-auto">
                  <div className="space-y-4">
                    {items.map((item: Cart) => (
                      <CartItem
                        key={item.product._id + item.size + item.color}
                        item={item}
                      />
                    ))}
                  </div>
                </div>
                <div className="mt-6 pt-4 border-t-2 border-amber-200">
                  <div className="flex justify-between items-center mb-4">
                    <span className="font-serif text-lg text-amber-900">
                      Total:
                    </span>
                    <span className="font-serif text-lg text-amber-900">
                      PKR {calculateTotal().toLocaleString()}
                    </span>
                  </div>
                  <Link
                    href="/checkout"
                    className="block w-full py-3 px-4 bg-amber-800 text-[#E8DED1] hover:bg-amber-900 transition duration-200 text-center font-serif tracking-wide"
                  >
                    Checkout
                  </Link>
                </div>
              </div>
            ) : (
              <div className="h-full flex items-center justify-center">
                <p className="text-lg font-serif tracking-wide text-amber-900 text-center">
                  Your cart is empty
                </p>
              </div>
            )}
          </div>
        ) : (
          <div className="h-full flex items-center justify-center">
            <p className="text-lg font-serif tracking-wide text-amber-900 text-center">
              Please login to view your cart
            </p>
          </div>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default CartComp;
