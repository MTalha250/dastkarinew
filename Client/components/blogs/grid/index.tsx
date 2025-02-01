import { Blog } from "@/types";
import React from "react";
import Card from "../card";
import ReactLoading from "react-loading";

interface Props {
  loading: boolean;
  blogs: Blog[];
}

const Grid = ({ loading, blogs }: Props) => {
  return loading ? (
    <div className="flex justify-center items-center h-screen">
      <ReactLoading type="cylon" color="#000000" />
    </div>
  ) : blogs.length > 0 ? (
    <div className="py-20 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 min-h-screen">
      {blogs.map((blog) => (
        <Card key={blog._id} blog={blog} />
      ))}
    </div>
  ) : (
    <div className="flex justify-center items-center h-screen text-center text-lg text-gray-600 tracking-wide">
      <span>No blogs Found</span>
    </div>
  );
};

export default Grid;
