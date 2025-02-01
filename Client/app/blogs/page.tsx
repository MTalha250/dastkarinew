"use client";
import Grid from "@/components/blogs/grid";
import { BlogCategory, Blog } from "@/types";
import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { GoChevronRight, GoChevronLeft } from "react-icons/go";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import SEO from "@/components/seo";

const page = () => {
  const ref = useRef(null as unknown as HTMLDivElement);
  const [categories, setCategories] = useState<BlogCategory[]>([]);
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selected, setSelected] = useState("");

  const fetchBlogCategories = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/blogCategory`
      );
      setCategories(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchBlogs = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/blog?page=${page}&category=${selected}`
      );
      setBlogs(response.data.blogs);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogCategories();
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchBlogs();
  }, [page, selected]);
  return (
    <div className="pt-32 pb-10 px-6 md:px-12 lg:px-24">
      <SEO
        title="Blog | DastKari"
        description="Step into a world where artistry meets heritage through our curated stories and insights. Explore the rich tapestry of South Asian craftsmanship through expert perspectives, collection highlights, and tales of cultural preservation. Discover the stories behind our masterpieces, learn about traditional techniques, and find inspiration in the timeless beauty of authentic artistry."
      />
      <div className="text-center mb-12 flex flex-col items-center">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-mons tracking-wide">
          DastKari Blog
        </h1>
        <p className="text-sm md:text-base mt-4 text-gray-600 max-w-xl">
          Step into a world where artistry meets heritage through our curated
          stories and insights. Explore the rich tapestry of South Asian
          craftsmanship through expert perspectives, collection highlights, and
          tales of cultural preservation. Discover the stories behind our
          masterpieces, learn about traditional techniques, and find inspiration
          in the timeless beauty of authentic artistry.
        </p>
      </div>
      <div className="flex items-center mt-10">
        <div className="pr-2 sm:pr-5 z-10">
          <button
            className="rounded-full border p-2 hover:bg-primary hover:text-white transition duration-300"
            onClick={() => {
              ref.current.scrollLeft -= 200;
            }}
          >
            <GoChevronLeft className="text-lg sm:text-xl" />
          </button>
        </div>
        <div
          ref={ref}
          className="flex overflow-x-hidden gap-2 scrollbar scrollbar-none px-5 w-full"
          style={{
            scrollBehavior: "smooth",
          }}
        >
          <button
            className={
              !selected
                ? "px-4 py-2 font-light hover:border-black border border-black whitespace-nowrap text-sm md:text-base"
                : "px-4 py-2  font-light hover:border-black border border-gray-300 whitespace-nowrap text-sm md:text-base"
            }
            onClick={() => {
              setSelected("");
            }}
          >
            All
          </button>
          {categories.map((tag) => (
            <button
              key={tag._id}
              className={
                selected === tag.name
                  ? "px-4 py-2 font-light hover:border-black border border-black whitespace-nowrap text-sm md:text-base"
                  : "px-4 py-2 font-light hover:border-black border border-gray-300 whitespace-nowrap text-sm md:text-base"
              }
              onClick={() => {
                setSelected(tag.name);
              }}
            >
              {tag.name}
            </button>
          ))}
        </div>
        <div className="pl-2 sm:pl-5">
          <button
            className="rounded-full border p-2 hover:bg-primary hover:text-white transition duration-300"
            onClick={() => {
              ref.current.scrollLeft += 200;
            }}
          >
            <GoChevronRight className="text-lg sm:text-xl" />
          </button>
        </div>
      </div>
      <Grid loading={loading} blogs={blogs} />
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              onClick={() => {
                if (page === 1) return;
                setPage(page - 1);
              }}
              disabled={page === 1}
            />
          </PaginationItem>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <PaginationItem key={p}>
              <PaginationLink
                onClick={() => {
                  setPage(p);
                }}
                isActive={p === page}
              >
                {p}
              </PaginationLink>
            </PaginationItem>
          ))}
          <PaginationItem>
            <PaginationNext
              onClick={() => {
                if (page === totalPages) return;
                setPage(page + 1);
              }}
              disabled={page === totalPages}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
};

export default page;
