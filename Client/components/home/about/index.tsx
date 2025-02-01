import React from "react";
import { motion } from "framer-motion";

const HeritageAbout = () => {
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
        duration: 0.3,
        ease: "easeOut",
      },
    },
  };

  const decorationVariants = {
    hidden: { pathLength: 0, opacity: 0 },
    visible: {
      pathLength: 1,
      opacity: 1,
      transition: {
        duration: 1,
        ease: "easeInOut",
      },
    },
  };

  const CornerDecoration = () => (
    <svg viewBox="0 0 100 100" className="absolute w-12 h-12">
      <motion.path
        d="M0 50 C0 22.4 22.4 0 50 0 C77.6 0 100 22.4 100 50"
        fill="none"
        stroke="currentColor"
        strokeWidth="1"
        className="text-secondary"
        variants={decorationVariants}
        initial="hidden"
        whileInView="visible"
      />
      <motion.path
        d="M20 50 C20 33.4 33.4 20 50 20 C66.6 20 80 33.4 80 50"
        fill="none"
        stroke="currentColor"
        strokeWidth="1"
        className="text-secondary"
        variants={decorationVariants}
        initial="hidden"
        whileInView="visible"
      />
      <motion.path
        d="M40 50 C40 44.4 44.4 40 50 40 C55.6 40 60 44.4 60 50"
        fill="none"
        stroke="currentColor"
        strokeWidth="1"
        className="text-secondary"
        variants={decorationVariants}
        initial="hidden"
        whileInView="visible"
      />
    </svg>
  );

  return (
    <motion.section
      className="relative py-20 px-6 md:px-12 lg:px-24 overflow-hidden"
      initial="hidden"
      whileInView="visible"
      variants={containerVariants}
    >
      <div className="absolute inset-0 opacity-5">
        {[...Array(24)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute"
            initial={{ opacity: 0, rotate: 0 }}
            whileInView={{
              opacity: 1,
              rotate: Math.random() * 360,
              transition: { delay: i * 0.05 },
            }}
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
            }}
          >
            <svg className="w-16 h-16" viewBox="0 0 64 64">
              <motion.path
                d="M32 0L64 32L32 64L0 32Z"
                fill="none"
                stroke="currentColor"
                strokeWidth="0.5"
                className="text-secondary"
                initial={{ pathLength: 0 }}
                whileInView={{ pathLength: 1 }}
                transition={{ duration: 2, delay: i * 0.05 }}
              />
            </svg>
          </motion.div>
        ))}
      </div>

      <motion.div className="text-center relative" variants={containerVariants}>
        <motion.h2
          className="text-5xl md:text-6xl font-serif text-secondary mb-2"
          variants={itemVariants}
        >
          DastKari
        </motion.h2>
        <motion.h3
          className="text-3xl md:text-4xl mb-8 text-secondary"
          style={{ fontFamily: "Noto Nastaliq Urdu" }}
          variants={itemVariants}
        >
          دستکاری
        </motion.h3>

        <motion.div
          className="flex items-center justify-center mb-12"
          variants={itemVariants}
        >
          <motion.div
            className="h-px w-24 bg-gradient-to-r from-transparent via-secondary to-transparent"
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            transition={{ duration: 0.5 }}
          />
          <motion.svg
            className="w-12 h-12 mx-4 text-secondary"
            viewBox="0 0 48 48"
            initial={{ scale: 0, rotate: -180 }}
            whileInView={{ scale: 1, rotate: 0 }}
            transition={{ duration: 0.5 }}
          >
            <path
              fill="currentColor"
              d="M24 0L29 17.5H48L32.5 28.5L37.5 46L24 35L10.5 46L15.5 28.5L0 17.5H19L24 0Z"
            />
          </motion.svg>
          <motion.div
            className="h-px w-24 bg-gradient-to-r from-transparent via-secondary to-transparent"
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            transition={{ duration: 0.5 }}
          />
        </motion.div>

        <motion.p
          className="mt-6 text-lg max-w-3xl mx-auto font-light leading-relaxed"
          variants={itemVariants}
        >
          At DastKari, we honor the timeless tradition of South Asian
          craftsmanship, curating masterpieces that span centuries of artistic
          excellence. Each piece in our collection carries the soul of ancient
          artisans and the legacy of royal ateliers.
        </motion.p>

        <motion.div
          className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8"
          variants={containerVariants}
        >
          {[
            {
              title: "Heritage Craftsmanship",
              text: "We preserve the magnificence of traditional artistry, from delicate Mughal miniatures to masterful Persian calligraphy, each piece telling a story of unparalleled skill and devotion.",
            },
            {
              title: "Royal Heritage",
              text: "Our collection features authenticated pieces from the grand courts of the Mughals, Rajputs, and Nawabs, each artifact carrying the legacy of royal patronage and artistic excellence.",
            },
            {
              title: "Timeless Legacy",
              text: "Each artifact in our collection bridges centuries of artistic evolution, preserving the techniques and traditions that have shaped South Asian decorative arts through generations.",
            },
          ].map((card, index) => (
            <motion.div
              key={index}
              className="h-full"
              variants={itemVariants}
              whileHover={{
                y: -8,
                transition: { duration: 0.3 },
              }}
            >
              <div className="relative bg-white h-full group">
                <div className="absolute inset-0 border border-secondary opacity-50" />
                <div className="absolute inset-[1px] border border-secondary opacity-40" />
                <div className="absolute inset-[2px] border border-secondary opacity-30" />

                <div className="absolute top-0 left-0">
                  <CornerDecoration />
                </div>
                <div className="absolute top-0 right-0 transform rotate-90">
                  <CornerDecoration />
                </div>
                <div className="absolute bottom-0 left-0 transform -rotate-90">
                  <CornerDecoration />
                </div>
                <div className="absolute bottom-0 right-0 transform rotate-180">
                  <CornerDecoration />
                </div>

                <div className="relative p-8 flex flex-col h-full">
                  <motion.h3
                    className="text-2xl font-serif mb-4"
                    variants={itemVariants}
                  >
                    {card.title}
                  </motion.h3>
                  <motion.p className="flex-grow" variants={itemVariants}>
                    {card.text}
                  </motion.p>
                  <motion.div
                    className="mt-6 flex justify-center opacity-50"
                    variants={itemVariants}
                  >
                    <svg className="w-24 h-6" viewBox="0 0 96 24">
                      <motion.path
                        d="M0,12 Q24,0 48,12 T96,12"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="0.5"
                        className="text-secondary"
                        initial={{ pathLength: 0 }}
                        whileInView={{ pathLength: 1 }}
                        transition={{ duration: 1.5, delay: 0.5 }}
                      />
                    </svg>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        <motion.div className="mt-16 text-center" variants={itemVariants}>
          <motion.p
            className="text-lg font-serif italic"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            "In every stroke of the artist's brush, in every chisel mark of the
            sculptor, lies the eternal spirit of our cultural heritage."
          </motion.p>
        </motion.div>

        <motion.div
          className="mt-12 flex justify-center"
          variants={itemVariants}
        >
          <svg
            className="w-48 h-16 text-secondary opacity-30"
            viewBox="0 0 192 64"
          >
            <motion.path
              fill="none"
              stroke="currentColor"
              strokeWidth="0.5"
              d="M0,32 Q48,0 96,32 T192,32"
              initial={{ pathLength: 0 }}
              whileInView={{ pathLength: 1 }}
              transition={{ duration: 2 }}
            />
            <motion.path
              fill="none"
              stroke="currentColor"
              strokeWidth="0.5"
              d="M0,32 Q48,64 96,32 T192,32"
              initial={{ pathLength: 0 }}
              whileInView={{ pathLength: 1 }}
              transition={{ duration: 2, delay: 0.5 }}
            />
          </svg>
        </motion.div>
      </motion.div>
    </motion.section>
  );
};

export default HeritageAbout;
