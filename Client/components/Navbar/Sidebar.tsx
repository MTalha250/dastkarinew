import React from "react";
import {
  Sheet,
  SheetContent,
  SheetClose,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { HiBars3 } from "react-icons/hi2";
import { CiUser } from "react-icons/ci";
import Link from "next/link";
import useAuthStore from "@/store/authStore";
import { logout } from "@/hooks/auth";
import toast from "react-hot-toast";
import Cart from "../cart";
import Wishlist from "../wishlist";
import Profile from "../profile";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Category } from "@/types";

const Sidebar = ({ categories }: { categories: Category[] }) => {
  const { user, setToken, setUser } = useAuthStore();

  return (
    <Sheet>
      <SheetTrigger className="md:hidden">
        <HiBars3 className="inline-block text-3xl hover:scale-125 transition duration-200" />
      </SheetTrigger>
      <SheetContent>
        <div className="flex space-x-3 md:space-x-5 items-center">
          <Wishlist />
          <Cart />
          {user?.name ? (
            <DropdownMenu>
              <DropdownMenuTrigger className="outline-none ring-0">
                <CiUser className="text-3xl text-gray-800 hover:text-gray-900 hover:scale-110 transition-transform duration-300 cursor-pointer" />
              </DropdownMenuTrigger>
              <DropdownMenuContent className="rounded-none shadow-lg py-2 bg-white border border-gray-200">
                <Profile />
                <DropdownMenuItem
                  className="flex items-center justify-center text-gray-700 hover:bg-neutral-100 py-2 transition-colors"
                  onClick={() => {
                    logout();
                    setUser(null);
                    setToken(null);
                    toast.success("Logged out successfully");
                  }}
                >
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link href="/login">
              <SheetClose>
                <CiUser className="text-3xl text-gray-800 hover:text-gray-900 hover:scale-110 transition-transform duration-300 cursor-pointer" />
              </SheetClose>
            </Link>
          )}
        </div>
        <div className="mt-20 flex flex-col gap-5 items-center justify-center text-lg">
          <Link
            href="/"
            className="flex items-center pb-1 border-b border-transparent hover:border-gray-900 transition-all duration-300 font-mons tracking-widest"
          >
            <SheetClose>HOME</SheetClose>
          </Link>
          <Accordion type="single" collapsible>
            <AccordionItem value="item">
              <AccordionTrigger
                noArrow
                className="py-0 flex justify-center text-center items-center pb-1 border-b border-transparent hover:border-gray-900 transition-all duration-300 font-mons tracking-widest"
              >
                SHOP
              </AccordionTrigger>
              <AccordionContent className="py-2 text-base tracking-wide text-center uppercase font-mons font-light">
                <ul>
                  <li>
                    <Link href={`/products/`} className="inline-block py-2">
                      <SheetClose>Our Catalogue</SheetClose>
                    </Link>
                  </li>
                  {categories.map((category) => (
                    <Accordion key={category._id} type="single" collapsible>
                      <AccordionItem value={category._id}>
                        <AccordionTrigger
                          className="py-1 my-1 flex text-center justify-center items-center font-light border-b border-transparent hover:border-gray-900 transition-all duration-300"
                          noArrow
                        >
                          {category.name}
                        </AccordionTrigger>
                        <AccordionContent>
                          <ul>
                            <li>
                              <Link
                                href={`/products/${category.name}`}
                                className="inline-block py-1"
                              >
                                <SheetClose>All {category.name}</SheetClose>
                              </Link>
                            </li>
                            {category.subCategories.map(
                              (subCategory, index) => (
                                <li key={index}>
                                  <Link
                                    href={`/products/${category.name}/${subCategory}`}
                                    className="inline-block py-1"
                                  >
                                    <SheetClose>{subCategory}</SheetClose>
                                  </Link>
                                </li>
                              )
                            )}
                          </ul>
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  ))}
                </ul>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
          <Link
            href="/search"
            className="flex items-center pb-1 border-b border-transparent hover:border-gray-900 transition-all duration-300 font-mons tracking-widest"
          >
            <SheetClose>SEARCH</SheetClose>
          </Link>
          <Link
            href="/blogs"
            className="flex items-center pb-1 border-b border-transparent hover:border-gray-900 transition-all duration-300 font-mons tracking-widest"
          >
            <SheetClose>BLOGS</SheetClose>
          </Link>
          <Link
            href="/about"
            className="flex items-center pb-1 border-b border-transparent hover:border-gray-900 transition-all duration-300 font-mons tracking-widest"
          >
            <SheetClose>ABOUT US</SheetClose>
          </Link>
          <Link
            href="/contact"
            className="flex items-center pb-1 border-b border-transparent hover:border-gray-900 transition-all duration-300 font-mons tracking-widest"
          >
            <SheetClose>CONTACT</SheetClose>
          </Link>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default Sidebar;
