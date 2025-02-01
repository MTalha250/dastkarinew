import React from "react";
import img1 from "@/assets/p1.jpg";
import img2 from "@/assets/p2.jpg";
import img3 from "@/assets/p3.jpg";
import { FaPeopleGroup } from "react-icons/fa6";
import { motion } from "framer-motion";

const testimonials = [
  {
    id: 1,
    name: "Dr. Amira Shah",
    image: img1.src,
    title: "Art Historian",
    quote:
      "Heritage Haven's collection is simply magnificent. Their careful curation of Mughal-era inspired pieces has helped me find authentic treasures that tell stories of our rich past. The intricate details and craftsmanship of each piece reflect the grandeur of historical artistry.",
  },
  {
    id: 2,
    name: "Raja Mehmood Khan",
    image: img2.src,
    title: "Antique Collector",
    quote:
      "As a collector of South Asian antiquities for over two decades, I've never encountered such a thoughtfully curated selection. Each artifact in Heritage Haven's collection carries the essence of our cultural legacy, making it a true sanctuary for history enthusiasts.",
  },
  {
    id: 3,
    name: "Professor Zara Hussain",
    image: img3.src,
    title: "Cultural Preservationist",
    quote:
      "Heritage Haven doesn't just sell artifacts; they preserve stories of our civilization. Their collection of traditional crafts and historical pieces has helped me create a living museum in my home, each item resonating with the echoes of our rich heritage.",
  },
];

const Testimonials = () => {
  return (
    <section className="py-20 px-6 md:px-12 lg:px-24 relative">
      <div className="text-center mb-16 relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex items-center justify-center gap-3 mb-4"
        >
          <FaPeopleGroup className="text-secondary text-2xl sm:text-3xl md:text-4xl" />
          <h2 className="text-2xl sm:text-3xl md:text-4xl tracking-wider text-secondary">
            Voices of Heritage
          </h2>
        </motion.div>
        <p className="mt-4 font-light italic">
          Stories from our distinguished collectors and connoisseurs
        </p>
        <div className="absolute left-1/2 -bottom-4 transform -translate-x-1/2 w-24 h-1 bg-secondary" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-12">
        {testimonials.map((testimonial, index) => (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            key={testimonial.id}
            className="bg-white p-8 rounded-lg border border-secondary shadow-xl hover:shadow-2xl transition-all duration-500 relative overflow-hidden group"
          >
            {/* Decorative Border */}
            <div className="absolute inset-0 border-2 border-[#8B4513] opacity-10 rounded-lg" />

            <div className="w-24 h-24 mx-auto mb-6 relative">
              <div className="absolute inset-0 border-2 border-[#8B4513] rounded-full transform rotate-45 group-hover:rotate-90 transition-transform duration-500" />
              <img
                src={testimonial.image}
                alt={testimonial.name}
                className="object-cover rounded-full w-full h-full border-4 border-[#DEB887]"
              />
            </div>

            <p className="text-base mb-6 italic leading-relaxed">
              <span className="text-secondary text-3xl font-serif">❝</span>
              {testimonial.quote}
              <span className="text-secondary text-3xl font-serif">❞</span>
            </p>

            <div className="text-center">
              <h3 className="text-xl font-medium text-[#2C1810] font-serif">
                {testimonial.name}
              </h3>
              <p className="text-[#8B4513] mt-1 text-sm">{testimonial.title}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default Testimonials;
