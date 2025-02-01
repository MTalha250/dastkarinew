"use client";
import React from "react";
import axios from "axios";
import { useEffect, useState } from "react";
import { Product } from "@/types";
import Grid from "@/components/grid";
import { GiTreasureMap } from "react-icons/gi";
import { motion } from "framer-motion";

// Decorative corner pattern component
const CornerPattern = () => (
  <svg viewBox="0 0 100 100" className="absolute w-16 h-16">
    <path
      d="M0 50 C0 22.4 22.4 0 50 0 C77.6 0 100 22.4 100 50"
      fill="none"
      stroke="currentColor"
      strokeWidth="1"
      className="text-amber-700"
    />
    <path
      d="M20 50 C20 33.4 33.4 20 50 20 C66.6 20 80 33.4 80 50"
      fill="none"
      stroke="currentColor"
      strokeWidth="1"
      className="text-amber-600"
    />
  </svg>
);

const Discover = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getProducts();
  }, []);

  const getProducts = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/product/featured`
      );
      setProducts(response.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="px-6 md:px-16 lg:px-24 relative">
      <div className="text-center mb-16 relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="flex items-center justify-center gap-3 mb-4"
        >
          <GiTreasureMap className="text-2xl sm:text-3xl md:text-4xl" />
          <h2 className="text-2xl sm:text-3xl md:text-4xl tracking-wider text-secondary">
            Featured Treasures
          </h2>
        </motion.div>
        <p className="mt-4 font-light italic">
          Discover our carefully curated collection of timeless artifacts
        </p>
        <div className="absolute left-1/2 -bottom-4 transform -translate-x-1/2 w-24 h-1 bg-secondary" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.2 }}
      >
        <Grid products={products} loading={loading} />
      </motion.div>
    </section>
  );
};

export default Discover;
