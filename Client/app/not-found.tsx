import Link from "next/link";
import React from "react";
import img from "@/assets/notfound.png";
import SEO from "@/components/seo";
const page = () => {
  return (
    <div className="w-full h-screen flex items-center justify-center px-8">
      <SEO
        title="Page Not Found"
        description="Page Not Found"
        image={img.src}
      />
      <div>
        <img src={img.src} alt="" className="w-[400px]" />
        <h1 className="font-mons my-10 text-center text-3xl md:text-4xl tracking-wide">
          Page Not Found
        </h1>
        <p className="text-center text-xl">
          Go back to{" "}
          <Link
            href="/"
            className="font-mons tracking-wide text-primary underline italic"
          >
            Home Page
          </Link>
        </p>
      </div>
    </div>
  );
};

export default page;
