import React, { useEffect, useState } from "react";
import Link from "next/link";
import Sidebar from "./Sidebar";
import { useCartStore } from "@/store/cartStore";
import { useWishlistStore } from "@/store/wishlistStore";
import { CiUser } from "react-icons/ci";
import { VscChevronDown } from "react-icons/vsc";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Profile from "../profile";
import toast from "react-hot-toast";
import Cart from "../cart";
import Wishlist from "../wishlist";
import { motion } from "framer-motion";
import useAuthStore from "@/store/authStore";
import { logout } from "@/hooks/auth";
import { Category } from "@/types";
import axios from "axios";

const Navbar = () => {
  const { initCart } = useCartStore();
  const [activeDropdown, setActiveDropdown] = useState(false);
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null);
  const { initWishlist } = useWishlistStore();
  const { user, setToken, setUser } = useAuthStore();
  const [categories, setCategories] = useState<Category[]>([]);
  const [sale, setSale] = useState(false);

  const fetchCategories = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/category`
      );
      setCategories(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const checkSale = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/product/check`
      );
      setSale(response.data.bool);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchCategories();
    checkSale();
  }, []);

  useEffect(() => {
    if (user) {
      initCart(user.cart);
      initWishlist(user.wishlist);
    }
  }, [user]);

  const handleLogout = () => {
    logout();
    setUser(null);
    setToken(null);
    toast.success("Logged out successfully");
  };

  return (
    <div className="top-0 z-50 fixed w-full">
      <div className="relative bg-[#2C1810] shadow-lg text-[#E8DED1] px-6 md:px-16 lg:px-24 py-5 w-full overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-[#3C2815] via-[#2C1810] to-[#3C2815] animate-gradient-shift opacity-30"></div>
        <div className="absolute inset-0 truck-art-pattern opacity-10"></div>

        <div className="relative flex items-center justify-between">
          <Link href="/" className="relative group">
            <h1
              className="text-4xl -mt-4 font-bold text-[#DEB887] transition-transform duration-300 group-hover:scale-105"
              style={{ fontFamily: "Noto Nastaliq Urdu" }}
            >
              دستکاری
            </h1>
          </Link>

          <div className="hidden lg:flex space-x-6 xl:space-x-12 items-center justify-center text-sm">
            <div className="relative group">
              <Link
                href="/"
                className="flex items-center pb-1 font-mons tracking-widest relative overflow-hidden text-[#E8DED1] hover:text-[#DEB887] transition-colors duration-300"
              >
                HOME
                <div className="absolute bottom-0 left-0 w-full h-0.5 bg-[#DEB887] transform translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-500"></div>
              </Link>
            </div>

            <div className="relative group">
              <div
                onMouseEnter={() => {
                  if (timeoutId) clearTimeout(timeoutId);
                  setActiveDropdown(true);
                }}
                onMouseLeave={() => {
                  const timeout = setTimeout(() => {
                    setActiveDropdown(false);
                  }, 300); // 300ms delay before closing
                  setTimeoutId(timeout);
                }}
                className="relative"
              >
                <Link
                  href="/products"
                  className="flex items-center pb-1 font-mons tracking-widest relative overflow-hidden text-[#E8DED1] hover:text-[#DEB887] transition-colors duration-300"
                >
                  SHOP
                  <VscChevronDown className="ml-1" />
                  <div className="absolute bottom-0 left-0 w-full h-0.5 bg-[#DEB887] transform translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-500"></div>
                </Link>

                {activeDropdown && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="fixed mt-2 left-auto"
                    style={{ zIndex: 1000 }}
                    onMouseEnter={() => {
                      if (timeoutId) {
                        clearTimeout(timeoutId);
                      }
                      setActiveDropdown(true);
                    }}
                    onMouseLeave={() => {
                      const timeout = setTimeout(() => {
                        setActiveDropdown(false);
                      }, 300);
                      setTimeoutId(timeout);
                    }}
                  >
                    <div className="shadow-xl bg-[#2C1810] border border-[#DEB887] p-5 w-[550px]">
                      <div className="w-full flex flex-wrap gap-10">
                        {categories.map((category, index) => (
                          <div key={index} className="flex flex-col">
                            <Link
                              href={`/products/${category.name}`}
                              className="text-[#DEB887] hover:text-[#E8DED1] transition duration-300 uppercase"
                            >
                              {category.name}
                            </Link>
                            <div className="mt-3 flex flex-col space-y-2">
                              {category.subCategories.length > 0 &&
                                category.subCategories.map(
                                  (subCategory, subIndex) => (
                                    <Link
                                      key={subIndex}
                                      href={`/products/${category.name}/${subCategory}`}
                                      className="text-sm text-[#E8DED1] hover:text-[#DEB887] transition-colors"
                                    >
                                      {subCategory}
                                    </Link>
                                  )
                                )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>
            </div>

            {sale && (
              <div className="relative group">
                <Link
                  href="/sale"
                  className="flex items-center pb-1 font-mons tracking-widest relative overflow-hidden text-[#E8DED1] hover:text-[#DEB887] transition-colors duration-300"
                >
                  SALE
                  <div className="absolute bottom-0 left-0 w-full h-0.5 bg-[#DEB887] transform translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-500"></div>
                </Link>
              </div>
            )}

            {["SEARCH", "CUSTOM", "BLOGS", "ABOUT", "CONTACT"].map((item) => (
              <div key={item} className="relative group">
                <Link
                  href={`/${item.toLowerCase().replace(" ", "")}`}
                  className="flex items-center pb-1 font-mons tracking-widest relative overflow-hidden text-[#E8DED1] hover:text-[#DEB887] transition-colors duration-300"
                >
                  {item}
                  <div className="absolute bottom-0 left-0 w-full h-0.5 bg-[#DEB887] transform translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-500"></div>
                </Link>
              </div>
            ))}
          </div>

          <div className="flex items-center space-x-3 md:space-x-5 font-medium">
            <Wishlist />
            <Cart />

            {user?.name ? (
              <DropdownMenu>
                <DropdownMenuTrigger className="outline-none ring-0">
                  <div className="relative group">
                    <CiUser className="text-3xl text-[#E8DED1] hover:text-[#DEB887] hover:scale-110 transition-all duration-300 cursor-pointer" />
                    <div className="absolute -inset-1 rounded-full border-2 border-[#DEB887] opacity-0 group-hover:opacity-100 transition-all duration-300 scale-110"></div>
                  </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="rounded-none shadow-lg py-2 bg-[#2C1810] border border-[#DEB887] group">
                  <Profile />
                  <DropdownMenuItem
                    className="flex items-center justify-center group"
                    onClick={handleLogout}
                  >
                    <button
                      onClick={handleLogout}
                      className="text-sm transition duration-200 w-full text-white group-hover:text-black"
                    >
                      Logout
                    </button>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link href="/login">
                <div className="relative group">
                  <CiUser className="text-3xl text-[#E8DED1] hover:text-[#DEB887] hover:scale-110 transition-all duration-300 cursor-pointer" />
                  <div className="absolute -inset-1 rounded-full border-2 border-[#DEB887] opacity-0 group-hover:opacity-100 transition-all duration-300 scale-110"></div>
                </div>
              </Link>
            )}
            <Sidebar categories={categories} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
