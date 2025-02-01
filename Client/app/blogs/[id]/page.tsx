"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import axios from "axios";
import { Blog, Product } from "@/types";
import SEO from "@/components/seo";
import Grid from "@/components/grid";

const Page = () => {
  const { id } = useParams();
  const [blog, setBlog] = useState<Blog>();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchRecommendedProducts = async (category: string) => {
    setLoading(true);
    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/product/featured?limit=4&category=${category}`
      );
      setProducts(res.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/blog/${id}`
        );
        setBlog(res.data);
        if (res.data.category) {
          await fetchRecommendedProducts(res.data.category);
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, [id]);

  return (
    <div className="px-6 md:px-12 lg:px-24 pt-32 pb-20">
      <div className="flex flex-col lg:flex-row gap-10 lg:gap-20">
        <div className="w-full lg:w-2/3 space-y-8">
          <div className="bg-[#2C1810] p-8 border border-[#DEB887] relative overflow-hidden">
            <div className="absolute inset-0 truck-art-pattern opacity-10"></div>
            <h1 className="text-3xl md:text-4xl font-serif text-[#DEB887] relative z-10 mb-4">
              {blog?.title}
            </h1>
            <p className="text-[#E8DED1] relative z-10 text-lg">
              {blog?.description}
            </p>
          </div>
          <div className="flex flex-col sm:flex-row justify-between p-6 bg-[#2C1810] border border-[#DEB887]">
            <div className="flex items-center gap-4">
              <div className="relative group">
                <div className="absolute -inset-1 rounded-full border border-[#DEB887] opacity-30"></div>
                <img
                  src={blog?.authorImage}
                  alt="author"
                  className="w-12 h-12 rounded-full object-cover"
                />
              </div>
              <div>
                <p className="text-[#DEB887] font-serif">{blog?.author}</p>
                <p className="text-[#E8DED1] text-sm">
                  {blog?.timeToRead} min read •{" "}
                  {blog?.createdAt.slice(0, 10).split("-").reverse().join("-")}
                </p>
              </div>
            </div>
          </div>
          <div className="relative group">
            <div className="absolute -inset-1 border border-[#DEB887] opacity-30"></div>
            <img
              src={blog?.titleImage}
              alt={blog?.title}
              className="w-full h-[50vh] object-cover"
            />
          </div>
          <div
            dangerouslySetInnerHTML={{ __html: blog?.content || "" }}
            className="prose prose-lg max-w-none prose-headings:font-serif prose-headings:text-[#2C1810] prose-p:text-gray-700 prose-a:text-[#2C1810] prose-strong:text-[#2C1810]"
          ></div>
        </div>
        <div className="w-full lg:w-1/3 lg:sticky lg:h-fit top-24 space-y-8">
          <div className="bg-[#2C1810] p-6 border border-[#DEB887] relative overflow-hidden">
            <div className="absolute inset-0 truck-art-pattern opacity-10"></div>
            <div className="relative z-10">
              <h3 className="text-2xl font-serif text-[#DEB887] mb-6">
                Recommended Products
              </h3>
              <div className="mb-6">
                <Grid
                  products={products}
                  loading={loading}
                  className="!grid-cols-1 sm:!grid-cols-2 lg:!grid-cols-1 gap-4"
                />
              </div>
              <Link
                href="/products"
                className="block w-full text-center px-8 py-3 bg-[#DEB887] text-[#2C1810] text-base font-serif transition duration-300 hover:bg-[#E8DED1]"
              >
                Explore All Products
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
