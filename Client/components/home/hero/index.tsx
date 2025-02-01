import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";

const HeroSection = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4,
        ease: "easeOut",
      },
    },
  };

  const IslamicPattern = () => (
    <svg viewBox="0 0 100 100" className="absolute w-full h-full opacity-10">
      <motion.path
        d="M20,20 L80,20 L80,80 L20,80 Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="0.5"
        className="text-secondary"
        initial={{ pathLength: 0 }}
        whileInView={{ pathLength: 1 }}
        transition={{ duration: 0.8 }}
      />
      <motion.path
        d="M50,20 C65,35 65,65 50,80 C35,65 35,35 50,20"
        fill="none"
        stroke="currentColor"
        strokeWidth="0.5"
        className="text-secondary"
        initial={{ pathLength: 0 }}
        whileInView={{ pathLength: 1 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      />
      <motion.path
        d="M20,50 C35,65 65,65 80,50 C65,35 35,35 20,50"
        fill="none"
        stroke="currentColor"
        strokeWidth="0.5"
        className="text-secondary"
        initial={{ pathLength: 0 }}
        whileInView={{ pathLength: 1 }}
        transition={{ duration: 0.8, delay: 0.4 }}
      />
    </svg>
  );

  const WindowImage = () => {
    return (
      <motion.div
        variants={containerVariants}
        className="relative aspect-[4/5] max-w-2xl mx-auto h-[50vh]"
      >
        {/* Window Frame */}
        <div className="absolute -inset-8 bg-secondary/5 border border-secondary/20" />

        {/* Window Shutters */}
        <motion.div
          className="absolute inset-0 z-20 flex"
          initial="closed"
          animate="open"
          variants={{
            closed: { opacity: 1 },
            open: { opacity: 1 },
          }}
        >
          {/* Left Shutter */}
          <motion.div
            className="w-1/2 bg-[#F5E6D3] border-r border-secondary/20"
            variants={{
              closed: { x: 0 },
              open: { x: "-100%" },
            }}
            transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1], delay: 0.5 }}
          >
            <div className="absolute right-4 top-1/2 -translate-y-1/2">
              <div className="w-2 h-8 bg-secondary/30 rounded-full" />
            </div>
          </motion.div>

          {/* Right Shutter */}
          <motion.div
            className="w-1/2 bg-[#F5E6D3] border-l border-secondary/20"
            variants={{
              closed: { x: 0 },
              open: { x: "100%" },
            }}
            transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1], delay: 0.5 }}
          >
            <div className="absolute left-4 top-1/2 -translate-y-1/2">
              <div className="w-2 h-8 bg-secondary/30 rounded-full" />
            </div>
          </motion.div>
        </motion.div>

        {/* Window Content */}
        <motion.div
          variants={itemVariants}
          className="relative"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 1.3 }}
        >
          {/* Decorative Frame */}
          <div className="absolute -inset-4 border border-secondary opacity-10" />
          <div className="absolute -inset-2 border border-secondary opacity-20" />
          <div className="absolute inset-0 border border-secondary opacity-30" />

          {/* Background Gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-secondary/10 to-transparent" />

          {/* Main Image */}
          <div className="relative h-full overflow-hidden">
            <img
              src="/hero-image.webp"
              alt="Heritage Masterpiece"
              className="object-cover w-full h-[50vh]"
            />

            {/* Pattern Overlay */}
            <div className="absolute inset-0">
              <IslamicPattern />
            </div>

            {/* Window Arch Decoration */}
            <motion.div
              className="absolute -top-1 left-0 right-0"
              initial={{ y: -100 }}
              animate={{ y: 0 }}
              transition={{ duration: 0.6, delay: 1.5 }}
            >
              <svg viewBox="0 0 100 20" className="w-full opacity-30">
                <path
                  d="M0,20 Q50,0 100,20"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="0.5"
                  className="text-secondary"
                />
              </svg>
            </motion.div>
          </div>

          {/* Window Frame Details */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-[2px] bg-secondary/20" />
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1/2 h-[2px] bg-secondary/20" />
          </div>
        </motion.div>
      </motion.div>
    );
  };

  return (
    <motion.section
      className="min-h-screen relative overflow-hidden bg-gradient-to-b from-[#F5E6D3] to-white"
      initial="hidden"
      whileInView="visible"
      variants={containerVariants}
      viewport={{ once: true }}
    >
      {/* Ornamental Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 opacity-10 bg-[url('/islamic-pattern.webp')] bg-repeat bg-[length:64px_64px]" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/30 to-white/50" />
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-6 md:px-12 lg:px-24 py-24 md:py-32 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left Column - Text Content */}
          <motion.div
            variants={containerVariants}
            className="text-center lg:text-left"
          >
            {/* Decorative Top Element */}
            <motion.div
              variants={itemVariants}
              className="mb-8 flex justify-center lg:justify-start"
            >
              <svg
                className="w-32 h-8 text-secondary opacity-40"
                viewBox="0 0 128 32"
              >
                <motion.path
                  d="M0,16 Q32,0 64,16 T128,16"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="0.5"
                  initial={{ pathLength: 0 }}
                  whileInView={{ pathLength: 1 }}
                  transition={{ duration: 0.8 }}
                />
              </svg>
            </motion.div>

            <motion.div
              variants={itemVariants}
              className="relative inline-block mb-6"
            >
              <h1 className="text-6xl md:text-7xl lg:text-8xl font-serif text-secondary relative z-10">
                DastKari
              </h1>
              <div className="absolute -inset-4 border border-secondary opacity-10" />
              <div className="absolute -inset-2 border border-secondary opacity-20" />
            </motion.div>

            <motion.h2
              variants={itemVariants}
              className="text-4xl md:text-5xl mb-8 text-secondary/90"
              style={{ fontFamily: "Noto Nastaliq Urdu" }}
            >
              دستکاری
            </motion.h2>

            <motion.p
              variants={itemVariants}
              className="text-xl md:text-2xl text-secondary/80 mb-12 font-light leading-relaxed max-w-2xl mx-auto lg:mx-0"
            >
              Embark on a journey through centuries of South Asian artistry,
              where each masterpiece tells a story of cultural richness and
              timeless craftsmanship.
            </motion.p>

            <motion.div
              variants={itemVariants}
              className="flex flex-col sm:flex-row gap-6 justify-center lg:justify-start"
            >
              <Link
                href={"/products"}
                className="group relative px-10 py-4 bg-secondary text-white font-serif text-lg hover:bg-secondary/90 transition-colors duration-300 overflow-hidden"
              >
                <span className="relative z-10">Explore Collection</span>
              </Link>
              <Link
                href={"/our-heritage"}
                className="group relative px-10 py-4 text-secondary font-serif text-lg overflow-hidden"
              >
                <span className="relative z-10">Our Heritage</span>
                <motion.div
                  className="absolute inset-0 border border-secondary opacity-30"
                  initial={false}
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.3 }}
                />
                <motion.div
                  className="absolute inset-[2px] border border-secondary opacity-20"
                  initial={false}
                  whileHover={{ scale: 1.1 }}
                  transition={{ duration: 0.3 }}
                />
              </Link>
            </motion.div>
          </motion.div>

          {/* Right Column - Window Image */}
          <WindowImage />
        </div>

        {/* Bottom Decoration */}
        <motion.div
          className="mt-10 flex justify-center"
          variants={itemVariants}
        >
          <div className="relative">
            <svg
              className="w-64 h-16 text-secondary opacity-30"
              viewBox="0 0 256 64"
            >
              <motion.path
                fill="none"
                stroke="currentColor"
                strokeWidth="0.5"
                d="M0,32 Q64,0 128,32 T256,32"
                initial={{ pathLength: 0 }}
                whileInView={{ pathLength: 1 }}
                transition={{ duration: 1 }}
              />
              <motion.path
                fill="none"
                stroke="currentColor"
                strokeWidth="0.5"
                d="M0,32 Q64,64 128,32 T256,32"
                initial={{ pathLength: 0 }}
                whileInView={{ pathLength: 1 }}
                transition={{ duration: 1, delay: 0.2 }}
              />
            </svg>
          </div>
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
        <div className="text-center">
          <p className="text-secondary/50 text-sm mb-2 font-serif">
            Scroll to Explore
          </p>
          <svg
            className="w-6 h-12 text-secondary opacity-50 mx-auto"
            viewBox="0 0 24 48"
          >
            <motion.path
              d="M12 0L12 48M12 48L4 36M12 48L20 36"
              fill="none"
              stroke="currentColor"
              strokeWidth="1"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1, repeat: Infinity }}
            />
          </svg>
        </div>
      </div>
    </motion.section>
  );
};

export default HeroSection;
