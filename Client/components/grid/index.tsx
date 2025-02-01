import React from "react";
import Card from "@/components/card";
import ReactLoading from "react-loading";
import { Product } from "@/types";

interface Props {
  products: Product[];
  loading: boolean;
  className?: string;
}

const Grid = ({ products, loading, className }: Props) => {
  return loading ? (
    <div className="flex justify-center items-center h-[40vh]">
      <ReactLoading type="cylon" color="#881337" />
    </div>
  ) : products.length > 0 ? (
    <div className={`relative`}>
      <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12 md:gap-16 my-10 ${className}`}>
        {products.map((product: Product) => (
          <div key={product._id} className="transform hover:-translate-y-2 transition-all duration-300">
            <Card product={product} />
          </div>
        ))}
      </div>
    </div>
  ) : (
    <div className="flex justify-center items-center h-[40vh] text-center">
      <span className="text-lg text-rose-900 font-serif italic">
        No Products Found
      </span>
    </div>
  );
};

export default Grid;
