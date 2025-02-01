import React from "react";
import { useCartStore } from "@/store/cartStore";
import { IoIosClose } from "react-icons/io";
import { AiOutlineMinus, AiOutlinePlus } from "react-icons/ai";
import Link from "next/link";
import { Cart } from "@/types";
import useAuthStore from "@/store/authStore";

interface Props {
  item: Cart;
}

const CartItem = ({ item }: Props) => {
  const { user, token } = useAuthStore();
  const { addItem, removeItem, deleteItem } = useCartStore();

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
          <p className="text-amber-800 font-serif mb-2">
            PKR {item.product.finalPrice.toLocaleString()}
          </p>
          <div className="flex items-center space-x-2 text-sm text-amber-800">
            <span className="capitalize">{item.color}</span>
            <span>•</span>
            <span className="uppercase">{item.size}</span>
          </div>
        </div>

        <div className="flex flex-col items-end space-y-2">
          <button
            onClick={(e) => {
              e.preventDefault();
              deleteItem(
                item.product._id + item.size + item.color,
                user ? true : false,
                token
              );
            }}
            className="flex items-center justify-center w-8 h-8 rounded-full bg-amber-800 hover:bg-amber-900 text-[#E8DED1] transition-colors duration-300"
          >
            <IoIosClose className="text-xl" />
          </button>

          <div className="flex items-center space-x-2 bg-amber-50 border-2 border-amber-200 rounded-full">
            <button
              onClick={(e) => {
                e.preventDefault();
                removeItem(
                  item.product._id + item.size + item.color,
                  user ? true : false,
                  token
                );
              }}
              className="w-6 h-6 flex items-center justify-center hover:text-amber-900 transition-colors"
            >
              <AiOutlineMinus className="text-sm" />
            </button>
            <span className="text-sm font-serif text-amber-900 w-6 text-center">
              {item.quantity}
            </span>
            <button
              onClick={(e) => {
                e.preventDefault();
                addItem(
                  {
                    product: item.product,
                    quantity: 1,
                    size: item.size,
                    color: item.color,
                  },
                  user ? true : false,
                  token
                );
              }}
              className="w-6 h-6 flex items-center justify-center hover:text-amber-900 transition-colors"
            >
              <AiOutlinePlus className="text-sm" />
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default CartItem;
