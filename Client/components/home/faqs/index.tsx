"use client";
import React, { useEffect, useState } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { FAQ } from "@/types";
import axios from "axios";
import { GiScrollUnfurled } from "react-icons/gi";
import { motion } from "framer-motion";

const Faqs = () => {
  const [faqs, setFaqs] = useState<FAQ[]>([]);

  const fetchFaqs = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/faq`
      );
      setFaqs(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchFaqs();
  }, []);

  return (
    <section className="px-6 md:px-16 lg:px-24 pb-20 relative">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16 relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex items-center justify-center gap-3 mb-4"
          >
            <GiScrollUnfurled className="text-secondary text-2xl sm:text-3xl md:text-4xl" />
            <h2 className="text-2xl sm:text-3xl md:text-4xl text-secondary tracking-wider">
              Knowledge Repository
            </h2>
          </motion.div>
          <p className="italic font-light">
            Discover answers to common inquiries about our heritage collection
          </p>
          <div className="absolute left-1/2 -bottom-4 transform -translate-x-1/2 w-24 h-1 bg-secondary" />
        </div>

        <div className="mt-10 relative">
          <div className="absolute inset-0 bg-white backdrop-blur-sm rounded-lg -m-6 p-6" />
          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                key={faq._id}
              >
                <AccordionItem
                  value={`item-${faq._id}`}
                  className="border border-secondary rounded-lg overflow-hidden bg-white/80 backdrop-blur-sm"
                >
                  <AccordionTrigger className="px-6 py-4 text-lg font-serif tracking-wide hover:bg-[#FBF7F0] transition-all duration-300">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="px-6 py-4 text-base text-[#5C4033] leading-relaxed border-t border-[#DEB887]/30">
                    <p className="font-light">{faq.answer}</p>
                  </AccordionContent>
                </AccordionItem>
              </motion.div>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
};

export default Faqs;
