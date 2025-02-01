import React, { useState } from "react";
import { FaStar, FaRegStar, FaEdit, FaTrashAlt } from "react-icons/fa";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { Review } from "@/types";
import useAuthStore from "@/store/authStore";

interface ReviewsProps {
  reviews: Review[];
  userEmail: string;
  onSubmitReview: (review: Partial<Review>) => void;
  className?: string;
}

const Reviews: React.FC<ReviewsProps> = ({
  reviews,
  userEmail,
  onSubmitReview,
  className = "",
}) => {
  const { user } = useAuthStore();
  const router = useRouter();
  const [hover, setHover] = useState<number>(-1);
  const [review, setReview] = useState<Partial<Review>>({
    rating: 0,
    title: "",
    comment: "",
  });

  const labels: { [key: number]: string } = {
    1: "Useless",
    2: "Poor",
    3: "Ok",
    4: "Good",
    5: "Excellent",
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setReview((prev) => ({
      ...prev,
      [name]: name === "rating" ? Number(value) : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (review.rating === 0 || review.title === "" || review.comment === "") {
      toast.error("Please fill all the fields");
      return;
    }
    onSubmitReview(review);
    setReview({ rating: 0, title: "", comment: "" });
  };

  const renderStars = (value: number, readOnly = false) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      if (i <= value) {
        stars.push(
          <FaStar
            key={i}
            onMouseEnter={() => !readOnly && setHover(i)}
            onMouseLeave={() => !readOnly && setHover(-1)}
            onClick={() => !readOnly && setReview({ ...review, rating: i })}
            style={{ cursor: readOnly ? "default" : "pointer" }}
            className="text-primary-dark"
          />
        );
      } else {
        stars.push(
          <FaRegStar
            key={i}
            onMouseEnter={() => !readOnly && setHover(i)}
            onMouseLeave={() => !readOnly && setHover(-1)}
            onClick={() => !readOnly && setReview({ ...review, rating: i })}
            style={{ cursor: readOnly ? "default" : "pointer" }}
            className="text-primary-dark"
          />
        );
      }
    }
    return stars;
  };

  return (
    <div className={`w-full py-12 bg-white pl-6 pr-12 ${className}`}>
      <h1 className="text-3xl md:text-4xl font-playfair text-[#2C1810] mb-8">
        Customer Reviews
      </h1>
      {!user && (
        <p className="text-center text-[#3C2815]/70 font-playfair">
          Please{" "}
          <button
            onClick={() => router.push("/login")}
            className="text-[#8C0003] underline hover:text-[#2C1810] transition-colors"
          >
            login
          </button>{" "}
          to share your experience
        </p>
      )}
      <Accordion type="multiple">
        <AccordionItem value="write-review" className="border-none">
          <AccordionTrigger
            disabled={!user}
            className="border-b border-[#DEB887]/30 w-full flex flex-col sm:flex-row justify-between p-3"
          >
            <div className="mb-3 sm:mb-0 flex items-center w-full">
              <div className="flex text-[#DEB887]">
                {renderStars(
                  reviews.length > 0
                    ? reviews.reduce((s, r) => (s = s + r.rating), 0) /
                        reviews.length
                    : 0,
                  true
                )}
              </div>
              <span className="ml-2 text-[#3C2815]/70 font-playfair">({reviews.length})</span>
            </div>
            <button className="text-sm py-2 px-4 bg-[#2C1810] font-playfair text-[#E8DED1] flex items-center gap-2 shrink-0 mx-2 hover:bg-[#3C2815] transition-colors relative group">
              <div className="absolute inset-0 border border-[#DEB887] opacity-30"></div>
              <div className="absolute inset-[1px] border border-[#DEB887] opacity-20"></div>
              <FaEdit /> Write a Review
            </button>
          </AccordionTrigger>
          <AccordionContent>
            <form
              onSubmit={(e) => handleSubmit(e)}
              className="flex flex-col border-b border-[#DEB887]/30 p-6"
            >
              <h2 className="font-playfair text-xl text-[#2C1810] mb-6">Share Your Experience</h2>
              <p className="font-playfair text-[#3C2815] mb-2">
                Rating <span className="text-[#8C0003]">*</span>
              </p>
              <div className="flex items-center mb-6">
                <div className="flex text-[#DEB887]">{renderStars(review.rating || 0)}</div>
                {review.rating !== null && (
                  <span className="ml-2 font-playfair text-[#3C2815]/70">
                    {labels[hover !== -1 ? hover : review.rating || 0]}
                  </span>
                )}
              </div>
              <label htmlFor="title" className="font-playfair text-[#3C2815] mb-2">
                Title <span className="text-[#8C0003]">*</span>
              </label>
              <input
                type="text"
                className="w-full border border-[#DEB887]/30 p-3 mb-6 outline-none focus:border-[#DEB887] transition-colors bg-transparent"
                id="title"
                name="title"
                value={review.title || ""}
                onChange={(e) => handleChange(e)}
              />
              <label htmlFor="review" className="font-playfair text-[#3C2815] mb-2">
                Review <span className="text-[#8C0003]">*</span>
              </label>
              <textarea
                className="w-full border border-[#DEB887]/30 p-3 mb-6 outline-none focus:border-[#DEB887] transition-colors bg-transparent"
                id="comment"
                name="comment"
                rows={3}
                value={review.comment || ""}
                onChange={(e) => handleChange(e)}
              />

              <button className="font-playfair ml-auto bg-[#2C1810] text-[#E8DED1] px-8 py-3 hover:bg-[#3C2815] transition-colors relative group">
                <div className="absolute inset-0 border border-[#DEB887] opacity-30"></div>
                <div className="absolute inset-[1px] border border-[#DEB887] opacity-20"></div>
                Post Review
              </button>
            </form>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
      <div className="py-8">
        {reviews.length > 0 ? (
          reviews
            .sort(
              (a, b) =>
                new Date(b.createdAt).getTime() -
                new Date(a.createdAt).getTime()
            )
            .map((d, i) => (
              <div
                className="w-full border-b border-[#DEB887]/30 py-6 group flex gap-4"
                key={i}
              >
                <span className="shrink-0 text-center leading-10 font-playfair text-[#E8DED1] h-12 w-12 bg-[#2C1810] mt-1 relative group">
                  <div className="absolute inset-0 border border-[#DEB887] opacity-30"></div>
                  {d.name?.slice(0, 1)}
                </span>
                <div className="w-full flex flex-col space-y-2">
                  <h2 className="flex justify-between font-playfair text-[#2C1810]">
                    <span>{d.name}</span>
                    <span className="text-[#3C2815]/70 text-sm">
                      {d.createdAt?.slice(0, 10).split("-").reverse().join("-")}
                    </span>
                  </h2>
                  <div className="items-center w-full flex justify-between">
                    <div className="flex text-[#DEB887]">{renderStars(d.rating, true)}</div>
                  </div>
                  <h3 className="font-playfair text-[#2C1810]">{d.title}</h3>
                  <p className="text-[#3C2815]/80 leading-relaxed">{d.comment}</p>
                </div>
              </div>
            ))
        ) : (
          <p className="text-center text-[#3C2815]/70 font-playfair">
            Be the first to share your thoughts about this piece.
          </p>
        )}
      </div>
    </div>
  );
};

export default Reviews;
