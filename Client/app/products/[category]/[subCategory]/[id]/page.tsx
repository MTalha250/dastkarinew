"use client";
import { useParams } from "next/navigation";
import axios from "axios";
import React, { useEffect, useState } from "react";
import Slider from "@/components/ItemPage/slider";
import ReactLoading from "react-loading";
import Reviews from "@/components/ItemPage/reviews";
import { useWishlistStore } from "@/store/wishlistStore";
import { useCartStore } from "@/store/cartStore";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { MdFavoriteBorder } from "react-icons/md";
import { MdFavorite } from "react-icons/md";
import useAuthStore from "@/store/authStore";
import { Product } from "@/types";
import { GoPlus } from "react-icons/go";
import { HiMinusSmall } from "react-icons/hi2";
import RelatedProducts from "@/components/ItemPage/relatedProducts";
import SEO from "@/components/seo";
import ModelViewer from "@/components/ItemPage/ModelViewer";

const page = () => {
  const { id, category, subCategory } = useParams();
  const [product, setProduct] = useState<Product>();
  const [loading, setLoading] = useState(true);
  const [count, setCount] = useState(1);
  const { inWishlist, addToWishlist, removeFromWishlist } = useWishlistStore();
  const { addItem, addQuantity } = useCartStore();
  const { user, token } = useAuthStore();
  const router = useRouter();
  const [size, setSize] = useState("");
  const [color, setColor] = useState("");

  useEffect(() => {
    getProduct();
  }, []);

  const getProduct = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/product/${id}`
      );
      setProduct(response.data);
      setColor(response.data.variants[0].color);
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  return loading ? (
    <div className="flex justify-center items-center h-screen">
      <ReactLoading type="cylon" color="#2C1810" />
    </div>
  ) : product ? (
    <div className="pt-32 pb-10">
      <SEO
        title={product?.name}
        description={product?.description}
        image={product?.images[0]}
      />
      <div className="flex flex-col">
        <div className="flex flex-col md:flex-row px-6 md:px-12 lg:px-24">
          <div className="w-full md:w-1/2 md:pr-0">
            <div className="relative">
              <Slider photos={product?.images} />
            </div>
            {product.modelUrl && (
              <div className="mt-4">
                <ModelViewer modelUrl={product.modelUrl} />
              </div>
            )}
          </div>
          
          <div className="w-full md:w-1/2 md:pl-10 mt-8 md:mt-0">
            <div className="relative mb-8 pb-6 border-b border-[#DEB887]/30">
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-playfair text-[#2C1810] mb-4">
                {product?.name}
              </h1>
              <p className="text-xl md:text-2xl font-playfair text-[#3C2815]">
                PKR {(product?.finalPrice).toLocaleString()}
                {product?.discount > 0 && (
                  <span className="line-through text-tertiary text-lg ml-3 opacity-70">
                    PKR {product?.price.toLocaleString()}
                  </span>
                )}
              </p>
            </div>

            <div className="space-y-6">
              <div>
                <p className="font-playfair text-[#2C1810] mb-3">Color Selection:</p>
                <div className="flex gap-3 flex-wrap">
                  {product?.variants.map((v: any) => (
                    <button
                      key={v._id}
                      className={`px-4 py-2 font-playfair text-sm transition-all duration-300 relative group ${
                        v.color == color 
                          ? "text-[#2C1810] border-[#DEB887]" 
                          : "text-[#3C2815]/70 border-[#DEB887]/30 hover:border-[#DEB887]"
                      } border`}
                      onClick={() => {
                        setColor(v.color);
                        setSize("");
                      }}
                    >
                      {v.color[0].toUpperCase() + v.color.slice(1)}
                      {v.color == color && (
                        <div className="absolute inset-0 border border-[#DEB887] -m-[2px]"></div>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <p className="font-playfair text-[#2C1810] mb-3">Size Selection:</p>
                <div className="flex gap-3 flex-wrap">
                  {product?.variants
                    .find((v: any) => v.color == color)
                    ?.sizes.sort((a, b) => {
                      const order = ["S", "M", "L", "XL", "XXL", "XXXL"];
                      return order.indexOf(a) - order.indexOf(b);
                    })
                    .map((s: string) => (
                      <button
                        key={s}
                        className={`px-4 py-2 font-playfair text-sm transition-all duration-300 relative group ${
                          s == size 
                            ? "text-[#2C1810] border-[#DEB887]" 
                            : "text-[#3C2815]/70 border-[#DEB887]/30 hover:border-[#DEB887]"
                        } border`}
                        onClick={() => setSize(s)}
                      >
                        {s.toUpperCase()}
                        {s == size && (
                          <div className="absolute inset-0 border border-[#DEB887] -m-[2px]"></div>
                        )}
                      </button>
                    ))}
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-4 pt-4">
                {product?.inStock && (
                  <div className="flex items-center border border-[#DEB887] bg-white">
                    <button
                      className="p-2 text-[#2C1810] hover:bg-[#DEB887]/5 transition-colors"
                      disabled={count <= 1}
                      onClick={() => {
                        if (count > 1) {
                          setCount(count - 1);
                        }
                      }}
                    >
                      <HiMinusSmall size={20} />
                    </button>
                    <span className="font-playfair py-1 w-12 text-center text-[#2C1810]">
                      {count}
                    </span>
                    <button
                      className="p-2 text-[#2C1810] hover:bg-[#DEB887]/5 transition-colors"
                      onClick={() => {
                        setCount(count + 1);
                      }}
                    >
                      <GoPlus size={18} />
                    </button>
                  </div>
                )}
                {product?.inStock ? (
                  <button
                    onClick={() => {
                      if (!size && !color) {
                        toast.error("Please select size and color");
                        return;
                      }
                      if (!size) {
                        toast.error("Please select size");
                        return;
                      }
                      if (!color) {
                        toast.error("Please select color");
                        return;
                      }
                      addItem(
                        {
                          product,
                          quantity: 1,
                          size,
                          color,
                        },
                        user ? true : false,
                        token
                      );
                      for (let i = 1; i < count; i++) {
                        addQuantity(
                          product._id + size + color,
                          user ? true : false,
                          token
                        );
                      }
                      toast.success("Added to cart");
                      setSize("");
                      setCount(1);
                    }}
                    className="bg-[#2C1810] text-[#E8DED1] px-8 py-3 font-playfair hover:bg-[#3C2815] transition-colors relative group"
                  >
                    <div className="absolute inset-0 border border-[#DEB887] opacity-30"></div>
                    <div className="absolute inset-[1px] border border-[#DEB887] opacity-20"></div>
                    Add to Cart
                  </button>
                ) : (
                  <p className="bg-neutral-200 text-[#2C1810] px-8 py-3 font-playfair">
                    Out of Stock
                  </p>
                )}
                <button
                  onClick={() => {
                    if (user) {
                      if (inWishlist(product._id)) {
                        removeFromWishlist(product._id, token);
                        toast.success("Removed from wishlist");
                      } else {
                        addToWishlist(
                          {
                            product,
                          },
                          token
                        );
                        toast.success("Added to wishlist");
                      }
                    } else {
                      toast.error("Please login to add to wishlist");
                      router.push("/login");
                    }
                  }}
                  className="group p-3 border border-[#DEB887]/30 hover:border-[#DEB887] transition-colors"
                >
                  {inWishlist(product._id) ? (
                    <MdFavorite className="text-[#8C0003] text-2xl group-hover:scale-110 transition-transform" />
                  ) : (
                    <MdFavoriteBorder className="text-[#8C0003] text-2xl group-hover:scale-110 transition-transform" />
                  )}
                </button>
              </div>

              {product?.description && (
                <div className="pt-8 border-t border-[#DEB887]/30">
                  <p className="font-playfair text-[#2C1810] mb-3">Description:</p>
                  <p className="text-[#3C2815]/80 leading-relaxed text-justify">
                    {product?.description}
                  </p>
                </div>
              )}

              <div className="pt-4 space-y-2">
                <p className="font-playfair text-[#3C2815]">
                  Category: <span className="text-[#3C2815]/70">{product?.subCategory}, {product?.category}</span>
                </p>
                {product.brand && (
                  <p className="font-playfair text-[#3C2815]">
                    Brand: <span className="text-[#3C2815]/70">{product.brand}</span>
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-16 px-6 md:px-12 lg:px-24">
          <div className="w-full bg-[#FFFFF1] border border-[#DEB887]/30">
            <Reviews
              reviews={product.reviews}
              userEmail={user?.email || ""}
              onSubmitReview={async (review) => {
                try {
                  await axios.post(
                    `${process.env.NEXT_PUBLIC_API_URL}/product/review/${id}`,
                    {
                      review: {
                        name: user?.name,
                        email: user?.email,
                        ...review,
                      },
                    },
                    {
                      headers: {
                        Authorization: `Bearer ${token}`,
                      },
                    }
                  );
                  getProduct();
                  toast.success("Review posted");
                } catch (error) {
                  console.log(error);
                }
              }}
            />
          </div>
          <div className="mt-16">
            <RelatedProducts category={category} subCategory={subCategory} id={id} />
          </div>
        </div>
      </div>
    </div>
  ) : (
    <div className="flex justify-center items-center h-screen">
      <h1 className="text-3xl font-playfair text-[#2C1810]">Product not found</h1>
    </div>
  );
};

export default page;
