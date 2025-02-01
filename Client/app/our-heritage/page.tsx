"use client";

import React from "react";
import { motion } from "framer-motion";
import SEO from "@/components/seo";
import Image from "next/image";

const artisans = [
  {
    id: 1,
    name: "Ustad Abdul Kareem",
    expertise: "Master Calligrapher",
    image: "/artisans/artisan-1.jpg",
    story: "With over 40 years of experience in traditional Islamic calligraphy, Ustad Abdul Kareem has dedicated his life to preserving the ancient art of Arabic and Persian script. His work adorns numerous historical monuments and private collections.",
    featured_work: "Specialized in Nastaliq and Thuluth scripts"
  },
  {
    id: 2,
    name: "Amira Bibi",
    expertise: "Textile Artisan",
    image: "/artisans/artisan-2.jpg",
    story: "A third-generation textile artist, Amira Bibi carries forward the legacy of intricate embroidery and mirror work that has been passed down through generations. Her pieces tell stories of cultural motifs and traditional patterns.",
    featured_work: "Known for Phulkari and Zardozi work"
  },
  {
    id: 3,
    name: "Mohammad Rafi",
    expertise: "Miniature Painter",
    image: "/artisans/artisan-3.png",
    story: "Trained in the traditional Mughal miniature painting techniques, Mohammad Rafi brings historical scenes to life with incredible detail and precision. His work preserves the storytelling tradition of South Asian art.",
    featured_work: "Specializes in historical scene recreation"
  }
];

const HeritageSection = ({ children, className = "" }: { children: React.ReactNode, className?: string }) => (
  <motion.section 
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6 }}
    className={`py-16 ${className}`}
  >
    {children}
  </motion.section>
);

const OurHeritage = () => {
  return (
    <div className="pt-32 bg-gradient-to-b from-amber-50 to-white">
      <SEO
        title="Our Heritage | DastKari"
        description="Discover the rich cultural heritage and master artisans behind DastKari's collection. Our heritage spans centuries of South Asian craftsmanship and artistic excellence."
      />

      {/* Hero Section */}
      <HeritageSection className="px-6 md:px-12 lg:px-24">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-serif text-amber-900 mb-6">
              Our Cultural Heritage
            </h1>
            <p className="text-lg text-amber-800 max-w-3xl mx-auto leading-relaxed">
              At DastKari, we are custodians of centuries-old artistic traditions, 
              preserving and celebrating the rich cultural heritage of South Asia 
              through our carefully curated collection and master artisans.
            </p>
          </div>
        </div>
      </HeritageSection>

      {/* Heritage Timeline */}
      <HeritageSection className="bg-[#FFFBEC] px-6 md:px-12 lg:px-24">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-serif text-amber-900 mb-12 text-center">
            A Legacy of Craftsmanship
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="space-y-8">
              <motion.div 
                className="bg-white p-8 border border-amber-200 shadow-sm"
                whileHover={{ y: -5 }}
                transition={{ duration: 0.3 }}
              >
                <h3 className="text-xl font-serif text-amber-900 mb-4">Mughal Era Excellence</h3>
                <p className="text-amber-800">
                  Our collection features pieces that draw inspiration from the golden age 
                  of Mughal artistry, where master craftsmen created works of unparalleled 
                  beauty and sophistication.
                </p>
              </motion.div>
              <motion.div 
                className="bg-white p-8 border border-amber-200 shadow-sm"
                whileHover={{ y: -5 }}
                transition={{ duration: 0.3 }}
              >
                <h3 className="text-xl font-serif text-amber-900 mb-4">Regional Traditions</h3>
                <p className="text-amber-800">
                  Each region of South Asia contributes its unique artistic vocabulary, 
                  from the intricate patterns of Kashmir to the bold geometrics of Sindh.
                </p>
              </motion.div>
            </div>
            <div className="space-y-8 md:mt-12">
              <motion.div 
                className="bg-white p-8 border border-amber-200 shadow-sm"
                whileHover={{ y: -5 }}
                transition={{ duration: 0.3 }}
              >
                <h3 className="text-xl font-serif text-amber-900 mb-4">Sacred Arts</h3>
                <p className="text-amber-800">
                  Islamic calligraphy and geometric patterns blend with local motifs, 
                  creating a unique artistic language that speaks of both devotion and cultural synthesis.
                </p>
              </motion.div>
              <motion.div 
                className="bg-white p-8 border border-amber-200 shadow-sm"
                whileHover={{ y: -5 }}
                transition={{ duration: 0.3 }}
              >
                <h3 className="text-xl font-serif text-amber-900 mb-4">Contemporary Vision</h3>
                <p className="text-amber-800">
                  While honoring traditional techniques, we embrace contemporary interpretations 
                  that keep our cultural heritage vibrant and relevant.
                </p>
              </motion.div>
            </div>
          </div>
        </div>
      </HeritageSection>

      {/* Master Artisans */}
      <HeritageSection className="px-6 md:px-12 lg:px-24">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-serif text-amber-900 mb-12 text-center">
            Our Master Artisans
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {artisans.map((artisan) => (
              <motion.div
                key={artisan.id}
                className="bg-white border border-amber-200 overflow-hidden"
                whileHover={{ y: -10 }}
                transition={{ duration: 0.3 }}
              >
                <div className="relative h-64 w-full">
                  <Image
                    src={artisan.image}
                    alt={artisan.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-serif text-amber-900 mb-2">{artisan.name}</h3>
                  <p className="text-amber-700 font-medium mb-4">{artisan.expertise}</p>
                  <p className="text-amber-800 mb-4">{artisan.story}</p>
                  <p className="text-amber-700 italic text-sm">{artisan.featured_work}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </HeritageSection>

      {/* Call to Action */}
      <HeritageSection className="bg-[#FFFBEC] px-6 md:px-12 lg:px-24">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-serif text-amber-900 mb-6">
            Join Us in Preserving Our Heritage
          </h2>
          <p className="text-lg text-amber-800 mb-8">
            Every piece in our collection helps support traditional artisans and 
            preserve centuries-old techniques for future generations.
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            className="bg-[#8B4513] text-[#E8DED1] px-8 py-3 font-serif hover:bg-[#6B3410] transition duration-300"
          >
            Explore Our Collection
          </motion.button>
        </div>
      </HeritageSection>
    </div>
  );
};

export default OurHeritage; 