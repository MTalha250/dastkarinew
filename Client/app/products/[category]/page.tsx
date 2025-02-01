"use client";
import React, { useEffect, useState } from "react";
//@ts-ignore
import RangeSlider from "react-range-slider-input";
import "react-range-slider-input/dist/style.css";
import axios from "axios";
import { Product } from "@/types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { GoFilter } from "react-icons/go";
import Grid from "@/components/grid";
import { useParams } from "next/navigation";
import SEO from "@/components/seo";

const page = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [sort, setSort] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const { category } = useParams();
  const [filters, setFilters] = useState({
    minPrice: 0,
    maxPrice: 0,
    sizes: [] as string[],
    colors: [] as string[],
  });
  const [filterValues, setFilterValues] = useState({
    sizes: [] as string[],
    colors: [] as string[],
    maxPrice: 0,
  });

  useEffect(() => {
    getFilterValues();
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
    getProducts();
  }, [page]);

  const getProducts = async (filter?: boolean) => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/product/filter?min=${
          filters.minPrice
        }&max=${filters.maxPrice}&size=${filters.sizes.join(
          ","
        )}&color=${filters.colors.join(",")}&page=${
          filter ? 1 : page
        }&category=${category}`
      );
      setProducts(response.data.products);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const getFilterValues = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/product/filterValues`
      );
      setFilterValues({
        sizes: response.data.sizes,
        colors: response.data.colors,
        maxPrice: response.data.maxPrice,
      });
      setFilters({
        minPrice: 0,
        maxPrice: response.data.maxPrice,
        sizes: [],
        colors: [],
      });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="pt-32 px-6 md:px-12 lg:px-24">
      <SEO
        title={`${decodeURIComponent(category.toString())} | DastKari`}
        description={`Explore our curated collection of ${decodeURIComponent(
          category.toString()
        )} masterpieces, each piece a testament to South Asian artistic excellence. From delicate miniatures to intricate calligraphy, discover authenticated treasures that reflect centuries of cultural heritage and royal craftsmanship.`}
      />
      <div className="text-center mb-12 flex flex-col items-center">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-mons tracking-wide">
          {decodeURIComponent(category.toString())}
        </h1>
        <p className="text-sm md:text-base mt-4 text-gray-600 max-w-xl">
          Explore our curated collection of{" "}
          {decodeURIComponent(category.toString())} masterpieces, each piece a
          testament to South Asian artistic excellence. From delicate miniatures
          to intricate calligraphy, discover authenticated treasures that
          reflect centuries of cultural heritage and royal craftsmanship.
        </p>
      </div>
      <div className="w-full my-10">
        <div className="flex justify-center">
          <div className="flex justify-center w-full max-w-sm">
            <Select onValueChange={(e) => setSort(e)}>
              <SelectTrigger className="h-full rounded-none w-1/2 flex items-center justify-center gap-2 border border-black font-light px-4">
                <SelectValue placeholder={"Sort By"} />
              </SelectTrigger>
              <SelectContent className="rounded-none">
                <SelectItem className="font-light" value="name">
                  Name
                </SelectItem>
                <SelectItem className="font-light" value="price-low-to-high">
                  Price (Low to High)
                </SelectItem>
                <SelectItem className="font-light" value="price-high-to-low">
                  Price (High to Low)
                </SelectItem>
                <SelectItem className="font-light" value="newest">
                  Newest
                </SelectItem>
                <SelectItem className="font-light" value="oldest">
                  Oldest
                </SelectItem>
                <SelectItem className="font-light" value="discount">
                  Discount
                </SelectItem>
              </SelectContent>
            </Select>
            <Sheet>
              <SheetTrigger className="w-1/2 flex items-center justify-center gap-2 border border-black font-light py-2 px-4">
                <GoFilter />
                Filters
              </SheetTrigger>
              <SheetContent className="h-screen flex flex-col">
                <h1 className="text-lg md:text-2xl font-mons font-light pb-5 border-b border-black">
                  Filters
                </h1>
                <h2 className="font-mons font-light pt-5">Price Range: </h2>
                <div id="range">
                  <RangeSlider
                    min={0}
                    max={filterValues.maxPrice || 10000}
                    step={1}
                    value={[filters.minPrice, filters.maxPrice]}
                    onInput={(value: any) => {
                      setFilters({
                        ...filters,
                        minPrice: value[0],
                        maxPrice: value[1],
                      });
                    }}
                  />
                </div>
                <div className="flex items-center">
                  <input
                    type="number"
                    placeholder="Min"
                    value={filters.minPrice}
                    onChange={(e) => {
                      const value = +e.target.value;
                      if (value <= filters.maxPrice && value >= 0)
                        setFilters({ ...filters, minPrice: value });
                    }}
                    className="border border-black rounded-none w-1/2 p-2 outline-none placeholder:font-light font-light"
                  />
                  <span className="mx-2">-</span>
                  <input
                    type="number"
                    placeholder="Max"
                    value={filters.maxPrice}
                    onChange={(e) => {
                      const value = +e.target.value;
                      if (
                        value >= filters.minPrice &&
                        value <= filterValues.maxPrice
                      )
                        setFilters({ ...filters, maxPrice: value });
                    }}
                    className="border border-black rounded-none w-1/2 p-2 outline-none placeholder:font-light font-light"
                  />
                </div>

                <h2 className="font-mons font-light pt-5">Colors: </h2>
                <div className="flex flex-wrap gap-2">
                  {filterValues.colors.map((color) => (
                    <button
                      key={color}
                      onClick={() =>
                        setFilters({
                          ...filters,
                          colors: filters.colors.includes(color)
                            ? filters.colors.filter((c) => c !== color)
                            : [...filters.colors, color],
                        })
                      }
                      className={`font-mons font-light py-1 px-3 hover:border-black border rounded-none ${
                        filters.colors.includes(color)
                          ? "border-black"
                          : "border-gray-300"
                      }`}
                    >
                      {color}
                    </button>
                  ))}
                </div>
                <h2 className="font-mons font-light pt-5">Sizes: </h2>
                <div className="flex flex-wrap gap-2">
                  {filterValues.sizes
                    .sort((a, b) => {
                      const order = ["S", "M", "L", "XL", "XXL", "XXXL"];
                      return order.indexOf(a) - order.indexOf(b);
                    })
                    .map((size) => (
                      <button
                        key={size}
                        onClick={() =>
                          setFilters({
                            ...filters,
                            sizes: filters.sizes.includes(size)
                              ? filters.sizes.filter((s) => s !== size)
                              : [...filters.sizes, size],
                          })
                        }
                        className={`font-mons font-light py-1 px-3  hover:border-black border rounded-none ${
                          filters.sizes.includes(size)
                            ? "border-black"
                            : "border-gray-300"
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                </div>
                <div className="flex flex-col gap-2 mt-auto">
                  <button
                    onClick={() => {
                      setFilters({
                        minPrice: 0,
                        maxPrice: filterValues.maxPrice,
                        sizes: [],
                        colors: [],
                      });
                    }}
                    className="font-mons flex justify-center py-2 bg-[#2C1810] text-white transition duration-200"
                  >
                    Clear
                  </button>
                  <SheetClose
                    onClick={() => {
                      setPage(1);
                      getProducts(true);
                    }}
                    className="font-mons flex justify-center py-2 bg-secondary hover:bg-primary-hover text-white transition duration-200"
                  >
                    Apply
                  </SheetClose>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
        <Grid
          products={
            sort === "name"
              ? products.slice().sort((a, b) => a.name.localeCompare(b.name))
              : sort === "price-low-to-high"
              ? products.slice().sort((a, b) => a.finalPrice - b.finalPrice)
              : sort === "price-high-to-low"
              ? products.slice().sort((a, b) => b.finalPrice - a.finalPrice)
              : sort === "newest"
              ? products
                  .slice()
                  .sort(
                    (a, b) =>
                      new Date(b.createdAt).getTime() -
                      new Date(a.createdAt).getTime()
                  )
              : sort === "oldest"
              ? products
                  .slice()
                  .sort(
                    (a, b) =>
                      new Date(a.createdAt).getTime() -
                      new Date(b.createdAt).getTime()
                  )
              : sort === "discount"
              ? products.filter((product) => product.discount > 0)
              : products
          }
          loading={loading}
        />
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
    </div>
  );
};

export default page;
