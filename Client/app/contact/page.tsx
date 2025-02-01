"use client";
import React from "react";
import { FiMail, FiPhone, FiMapPin } from "react-icons/fi";
import { useContactInfoStore } from "@/store/contactInfoStore";
import toast from "react-hot-toast";
import axios from "axios";
import SEO from "@/components/seo";

const ContactUs = () => {
  const { contactInfo } = useContactInfoStore();
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [message, setMessage] = React.useState("");
  const [loading, setLoading] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) {
      toast.error("Please fill out all fields");
      return;
    }
    setLoading(true);
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/contact`,
        {
          name,
          email,
          message,
        }
      );
      toast.success(response.data.message || "Message sent successfully");
      setName("");
      setEmail("");
      setMessage("");
    } catch (error) {
      toast.error("Failed to send message. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gradient-to-b from-amber-50 to-amber-100">
      <div className="pt-32 pb-20 px-6 md:px-12 lg:px-24">
        <SEO
          title="Contact Us | DastKari"
          description="Connect with DastKari. Whether you're interested in our collection, need assistance, or want to discuss South Asian heritage art, we're here to help."
        />

        <div className="max-w-6xl mx-auto text-center mb-16">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-serif tracking-wide text-amber-900 mb-4">
            Get in Touch
          </h1>
          <p className="text-amber-800 max-w-2xl mx-auto">
            Whether you're interested in our collection, need assistance with a
            purchase, or want to discuss South Asian heritage art, we're here to
            help.
          </p>
        </div>

        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12">
          <div className="space-y-8">
            <div className="bg-white p-8 rounded-lg shadow-lg border border-amber-200">
              <div className="grid grid-cols-1 gap-8">
                <div className="flex items-center gap-4">
                  <div className="bg-amber-100 p-4 rounded-full">
                    <FiMail className="text-amber-900 text-2xl" />
                  </div>
                  <div className="text-left">
                    <h3 className="font-serif text-lg text-amber-900 mb-1">
                      Email Us
                    </h3>
                    <p className="text-amber-800">{contactInfo?.email}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="bg-amber-100 p-4 rounded-full">
                    <FiPhone className="text-amber-900 text-2xl" />
                  </div>
                  <div className="text-left">
                    <h3 className="font-serif text-lg text-amber-900 mb-1">
                      Call Us
                    </h3>
                    <p className="text-amber-800">{contactInfo?.phone}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="bg-amber-100 p-4 rounded-full">
                    <FiMapPin className="text-amber-900 text-2xl" />
                  </div>
                  <div className="text-left">
                    <h3 className="font-serif text-lg text-amber-900 mb-1">
                      Visit Us
                    </h3>
                    <p className="text-amber-800">
                      Lahore University of Management Sciences (LUMS),
                      <br />
                      DHA, Lahore Cantt. 54792,
                      <br />
                      Lahore, Pakistan
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white p-8 rounded-lg shadow-lg border border-amber-200">
              <h3 className="font-serif text-xl text-amber-900 mb-4">
                Location
              </h3>
              <div className="relative w-full h-[300px]">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3405.0405784753166!2d74.41013595!3d31.4125199!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3919018a8ea548c1%3A0x4a52db69c2c814f!2sLahore%20University%20of%20Management%20Sciences!5e0!3m2!1sen!2s!4v1637336875297!5m2!1sen!2s"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  loading="lazy"
                  className="rounded-lg"
                  allowFullScreen
                ></iframe>
              </div>
            </div>
          </div>

          <div className="bg-white p-8 rounded-lg shadow-lg border border-amber-200">
            <h3 className="font-serif text-xl text-amber-900 mb-6">
              Send us a Message
            </h3>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-amber-900 mb-2 font-medium">
                  Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-amber-200 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  placeholder="Your Name"
                />
              </div>

              <div>
                <label className="block text-amber-900 mb-2 font-medium">
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-amber-200 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  placeholder="Your Email"
                />
              </div>
              <div>
                <label className="block text-amber-900 mb-2 font-medium">
                  Phone
                </label>
                <input
                  type="phone"
                  className="w-full px-4 py-3 rounded-lg border border-amber-200 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  placeholder="Your Phone Number"
                />
              </div>

              <div>
                <label className="block text-amber-900 mb-2 font-medium">
                  Message
                </label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={6}
                  className="w-full px-4 py-3 rounded-lg border border-amber-200 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  placeholder="Your Message"
                ></textarea>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-amber-900 text-white py-3 px-6 rounded-lg hover:bg-amber-800 transition duration-300 disabled:opacity-50"
              >
                {loading ? "Sending..." : "Send Message"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;
