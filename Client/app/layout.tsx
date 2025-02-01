"use client";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Toaster } from "react-hot-toast";
import { useEffect } from "react";
import useAuthStore from "@/store/authStore";
import { loginBack } from "@/hooks/auth";
import { useCartStore } from "@/store/cartStore";
import { useWishlistStore } from "@/store/wishlistStore";
import { useContactInfoStore } from "@/store/contactInfoStore";
import FloatingChatBot from "@/components/bot";
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { user, setUser, setToken } = useAuthStore();
  const { initCart } = useCartStore();
  const { initWishlist } = useWishlistStore();
  const { fetchContactInfo } = useContactInfoStore();

  useEffect(() => {
    handleLoginBack();
    fetchContactInfo();
  }, []);

  useEffect(() => {
    if (user) {
      initCart(user.cart);
      initWishlist(user.wishlist);
    }
  }, [user]);

  const handleLoginBack = async () => {
    try {
      const res = await loginBack();
      if (!res) {
        setToken("");
        setUser(null);
        localStorage.removeItem("token");
        return;
      }
      if (res?.user) setUser(res.user);
      if (res?.token) setToken(res.token);
    } catch (error: any) {
      setToken("");
      setUser(null);
      localStorage.removeItem("token");
    }
  };

  return (
    <html lang="en">
      <head>
        <title>DastKari</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta
          name="description"
          content="Immerse yourself in the timeless elegance of traditional South Asian artistry, where each masterpiece is crafted with unparalleled attention to detail and cultural significance. Our collection celebrates centuries of artistic heritage, featuring authenticated pieces that blend historical grandeur with contemporary sophistication, transforming your space into a sanctuary of cultural refinement."
        />
      </head>
      <body className="tracking-wide">
        <div>
          <Navbar />
          <div>{children}</div>
          <Footer />
          <Toaster
            position="bottom-right"
            toastOptions={{
              duration: 5000,
              style: {
                background: "var(--color-secondary)",
                color: "#FDF8EC",
                border: "1px solid rgba(139, 69, 19, 0.2)",
                fontFamily: "serif",
              },
              success: {
                style: {
                  background: "#2C1810",
                  border: "1px solid rgba(139, 69, 19, 0.3)",
                  color: "#FDF8EC",
                },
                iconTheme: {
                  primary: "#DEB887",
                  secondary: "#2C1810",
                },
              },
              error: {
                style: {
                  background: "#3B1D1D",
                  border: "1px solid rgba(139, 69, 19, 0.3)",
                  color: "#FDF8EC",
                },
                iconTheme: {
                  primary: "#DEB887",
                  secondary: "#3B1D1D",
                },
              },
              loading: {
                style: {
                  background: "#1F2937",
                  border: "1px solid rgba(139, 69, 19, 0.3)",
                  color: "#FDF8EC",
                },
                iconTheme: {
                  primary: "#DEB887",
                  secondary: "#1F2937",
                },
              },
            }}
          />
          <FloatingChatBot />
        </div>
      </body>
    </html>
  );
}
