import React, { useEffect, useState } from "react";
import { Product } from "@/types";
import axios from "axios";
import Grid from "@/components/grid";

interface Props {
  id: string | string[];
  category: string | string[];
  subCategory: string | string[];
}

const RelatedProducts = ({ category, subCategory, id }: Props) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/product/filter?category=${category}&subCategory=${subCategory}`
      );
      setProducts(response.data.products);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [category, subCategory]);

  return (
    <div className="py-20">
      <h1 className="text-2xl sm:text-3xl md:text-4xl tracking-wider font-mons">
        Similar Products
      </h1>
      <Grid
        products={products.filter((product) => product._id !== id)}
        loading={loading}
      />
    </div>
  );
};

export default RelatedProducts;
