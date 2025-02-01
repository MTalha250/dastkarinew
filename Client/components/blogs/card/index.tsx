import React from "react";
import Link from "next/link";
import { Blog } from "@/types";
import { motion } from "framer-motion";

interface Props {
  blog: Blog;
}

const Card = ({ blog }: Props) => {
  return (
    <Link
      href={`/blogs/${blog._id}`}
      key={blog._id}
      className="group relative bg-[#2C1810] overflow-hidden h-fit transition-all duration-500 hover:shadow-2xl"
    >
      {/* Decorative border */}
      <div className="absolute inset-0 border border-[#DEB887] opacity-30" />
      <div className="absolute inset-[1px] border border-[#DEB887] opacity-20" />

      {/* Image container with overlay */}
      <div className="relative h-48 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#2C1810]/30 to-transparent z-10" />
        <img
          src={blog.titleImage}
          alt={blog.title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
      </div>

      <div className="relative p-6 border-t border-[#DEB887]/20">
        {/* Corner decorations */}
        <div className="absolute top-0 right-0 w-12 h-12 border-t border-r border-[#DEB887]/30 transform translate-x-6 -translate-y-6" />
        <div className="absolute bottom-0 left-0 w-12 h-12 border-b border-l border-[#DEB887]/30 transform -translate-x-6 translate-y-6" />

        {/* Content */}
        <h2 className="text-xl font-serif tracking-wide mb-3 text-[#DEB887] group-hover:text-[#E8DED1] transition-colors duration-300">
          {blog.title}
        </h2>

        <p className="text-[#E8DED1]/80 mb-4 line-clamp-3 text-justify font-light">
          {blog.description}
        </p>

        {/* Author section */}
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="relative">
              <div className="absolute inset-0 border-2 border-[#DEB887]/50 rounded-full transform rotate-45 group-hover:rotate-90 transition-transform duration-500" />
              <img
                src={blog.authorImage}
                alt={blog.author}
                className="w-10 h-10 rounded-full object-cover border-2 border-[#DEB887]"
              />
            </div>
            <div className="ml-4">
              <p className="text-[#DEB887] font-serif">{blog.author}</p>
              <p className="text-[#E8DED1]/60 text-sm">
                {blog.timeToRead} min read
              </p>
            </div>
          </div>

          {/* Read more arrow that appears on hover */}
          <motion.span
            className="text-[#DEB887] opacity-0 transform translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            →
          </motion.span>
        </div>
      </div>
    </Link>
  );
};

export default Card;
