import React, { useState } from "react";
import {
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
  FaFeatherAlt,
} from "react-icons/fa";
import { GiAncientColumns } from "react-icons/gi";
import Link from "next/link";
import { useContactInfoStore } from "@/store/contactInfoStore";
import toast from "react-hot-toast";
import axios from "axios";

const Footer = () => {
  const { contactInfo } = useContactInfoStore();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast.error("Please enter your email address");
      return;
    }
    setLoading(true);
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/newsletter`,
        {
          email,
        }
      );
      toast.success(response.data.message || "Subscribed successfully");
      setEmail("");
    } catch (error: any) {
      if (error.response.status === 400) {
        toast.error(error.response.data.message || "Email already subscribed");
      } else {
        toast.error("Something went wrong. Please try again later");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <footer className="bg-[#2C1810] text-[#E8DED1] py-12">
      <div className="container mx-auto px-6">
        <div className="px-6 md:px-16 lg:px-24 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Logo and Brief Description */}
          <div>
            <Link href="/" className="block">
              <h1 
                className="text-5xl font-bold text-[#DEB887] mb-12 transition-transform duration-300 hover:scale-105" 
                style={{ fontFamily: 'Noto Nastaliq Urdu' }}
              >
                دستکاری
              </h1>
            </Link>
            <p className="mt-6 text-[#DEB887] leading-relaxed text-justify font-light">
              Preserving the essence of our rich cultural heritage through
              carefully curated artifacts and antiquities. Each piece tells a
              story of centuries past.
            </p>
            <div className="mt-6 flex space-x-4">
              {/* Social Media Icons */}
              {contactInfo?.facebook && (
                <a
                  href={contactInfo.facebook}
                  target="_blank"
                  className="hover:text-[#DEB887] transition duration-300"
                >
                  <FaFacebookF size={24} />
                </a>
              )}
              {contactInfo?.instagram && (
                <a
                  href={contactInfo.instagram}
                  target="_blank"
                  className="hover:text-[#DEB887] transition duration-300"
                >
                  <FaInstagram size={24} />
                </a>
              )}
              {contactInfo?.linkedin && (
                <a
                  href={contactInfo.linkedin}
                  target="_blank"
                  className="hover:text-[#DEB887] transition duration-300"
                >
                  <FaLinkedinIn size={24} />
                </a>
              )}
            </div>
          </div>

          {/* Navigation Links */}
          <div className="md:pl-10">
            <h3 className="text-xl font-serif text-[#DEB887] mb-4 flex items-center gap-2">
              <GiAncientColumns className="text-[#8B4513]" />
              Explore
            </h3>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/"
                  className="text-[#E8DED1] hover:text-[#DEB887] transition duration-300"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="/shop"
                  className="text-[#E8DED1] hover:text-[#DEB887] transition duration-300"
                >
                  Collection
                </Link>
              </li>
              <li>
                <Link
                  href="/blogs"
                  className="text-[#E8DED1] hover:text-[#DEB887] transition duration-300"
                >
                  Heritage Stories
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="text-[#E8DED1] hover:text-[#DEB887] transition duration-300"
                >
                  Our Legacy
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-[#E8DED1] hover:text-[#DEB887] transition duration-300"
                >
                  Connect
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-xl font-serif text-[#DEB887] mb-4 flex items-center gap-2">
              <FaFeatherAlt className="text-[#8B4513]" />
              Contact Us
            </h3>
            <ul className="space-y-4 text-[#E8DED1]">
              <li>
                <strong className="text-[#DEB887]">Phone:</strong>{" "}
                <a
                  href={`tel:${contactInfo?.phone}`}
                  target="_blank"
                  className="hover:text-[#DEB887]"
                >
                  {contactInfo?.phone}
                </a>
              </li>
              <li>
                <strong className="text-[#DEB887]">Whatsapp:</strong>{" "}
                <a
                  href={`https://wa.me/${contactInfo?.whatsapp.replace(
                    /\s/g,
                    ""
                  )}`}
                  target="_blank"
                  className="hover:text-[#DEB887]"
                >
                  {contactInfo?.whatsapp}
                </a>
              </li>
              <li>
                <strong className="text-[#DEB887]">Email:</strong>{" "}
                <a
                  href={`mailto:${contactInfo?.email}`}
                  target="_blank"
                  className="hover:text-[#DEB887]"
                >
                  {contactInfo?.email}
                </a>
              </li>
              <li>
                <strong className="text-[#DEB887]">Address:</strong>
                <p className="mt-1">{contactInfo?.address}</p>
              </li>
            </ul>
          </div>

          {/* Subscribe to Newsletter */}
          <div>
            <h3 className="text-xl font-serif text-[#DEB887] mb-4">
              Heritage Updates
            </h3>
            <p className="text-[#E8DED1] mb-4 font-light">
              Subscribe to receive updates about new acquisitions and historical
              discoveries.
            </p>
            <form onSubmit={handleSubscribe} className="flex">
              <input
                type="email"
                className="bg-[#3C2415] text-[#E8DED1] px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#DEB887] w-full border border-[#8B4513]"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <button
                disabled={loading}
                className="bg-[#8B4513] text-[#E8DED1] px-4 py-2 ml-2 hover:bg-[#6B3410] transition duration-300"
              >
                {loading ? "Subscribing..." : "Subscribe"}
              </button>
            </form>
          </div>
        </div>

        <div className="mt-12 border-t border-[#3C2415] pt-8">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center">
            <p className="text-[#DEB887]">
              © 2024 Dastkari. All rights reserved.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <Link
                href="/privacy-policy"
                className="text-[#E8DED1] hover:text-[#DEB887] transition duration-300"
              >
                Privacy Policy
              </Link>
              <Link
                href="/terms-of-service"
                className="text-[#E8DED1] hover:text-[#DEB887] transition duration-300"
              >
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
