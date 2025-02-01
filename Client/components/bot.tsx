"use client";
import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { useRouter } from "next/navigation";
import {
  X,
  MessageCircle,
  Send,
  Minimize2,
  Bot,
  Maximize2,
  ShoppingBag,
} from "lucide-react";

// Types and Interfaces
interface Message {
  type: "user" | "bot";
  content: string;
  timestamp: Date;
  products?: Product[];
}

interface Product {
  _id: string;
  name: string;
  price: number;
  finalPrice: number;
  images: string[];
  description?: string;
  category: string;
  subCategory: string;
  inStock: boolean;
  variants?: Array<{
    color: string;
    sizes: string[];
  }>;
  modelUrl?: string;
  reviews?: Array<{
    name: string;
    rating: number;
    comment: string;
    title: string;
  }>;
}

interface StyleProps {
  top?: number | string;
  left?: number | string;
  right?: number | string;
  bottom?: number | string;
}

// Animation Variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.3,
      ease: "easeOut",
    },
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    transition: {
      duration: 0.2,
      ease: "easeIn",
    },
  },
};

const FloatingChatBot: React.FC = () => {
  // State
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      type: "bot",
      content: "آداب! Welcome to Dastkari! I'm your personal assistant for exploring our collection of handcrafted treasures. Feel free to ask about our artisanal pieces, traditional crafts, or any specific heritage items you're looking for.",
      timestamp: new Date(),
    },
  ]);
  const [inputMessage, setInputMessage] = useState<string>("");
  const [isTyping, setIsTyping] = useState<boolean>(false);

  // Refs
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Effects
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  // Functions
  const scrollToBottom = (): void => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSendMessage = async (): Promise<void> => {
    if (!inputMessage.trim()) return;

    try {
      const newUserMessage: Message = {
        type: "user",
        content: inputMessage.trim(),
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, newUserMessage]);
      setInputMessage("");
      setIsTyping(true);

      // Call the chat API
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/chat`, {
        message: inputMessage.trim(),
      });

      const botResponse: Message = {
        type: "bot",
        content: response.data.response,
        timestamp: new Date(),
        products: response.data.products,
      };

      setMessages((prev) => [...prev, botResponse]);
    } catch (error) {
      console.error("Error sending message:", error);
      const errorMessage: Message = {
        type: "bot",
        content:
          "I apologize, but I'm having trouble processing your request. Please try again.",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const formatTime = (date: Date): string => {
    return new Date(date).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatPrice = (price: number): string => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "PKR",
    }).format(price);
  };

  const toggleFullscreen = (): void => {
    setIsFullscreen(!isFullscreen);
  };

  const handleClose = (): void => {
    setIsOpen(false);
    setIsFullscreen(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>): void => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const router = useRouter();

  const ProductCard: React.FC<{ product: Product }> = ({ product }) => {
    const handleClick = () => {
      router.push(`/products/${product.category}/${product.subCategory}/${product._id}`);
    };

    return (
      <div 
        onClick={handleClick}
        className="flex gap-3 p-2 border rounded-lg mt-2 hover:bg-gray-50 transition-colors cursor-pointer"
      >
        <div className="w-16 h-16 relative rounded-md overflow-hidden">
          <img
            src={product.images[0]}
            alt={product.name}
            className="object-cover w-full h-full"
          />
          {product.modelUrl && (
            <div className="absolute bottom-0 right-0 bg-secondary/80 p-1 rounded-tl">
              <span className="text-white text-xs">3D</span>
            </div>
          )}
        </div>
        <div className="flex-1">
          <h4 className="font-medium text-sm">{product.name}</h4>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-sm font-semibold text-secondary">
              {formatPrice(product.finalPrice)}
            </span>
            {product.price !== product.finalPrice && (
              <span className="text-xs text-gray-500 line-through">
                {formatPrice(product.price)}
              </span>
            )}
          </div>
          <div className="flex flex-wrap items-center gap-2 mt-1">
            <span
              className={`text-xs px-2 py-0.5 rounded ${
                product.inStock
                  ? "bg-green-100 text-green-800"
                  : "bg-red-100 text-red-800"
              }`}
            >
              {product.inStock ? "In Stock" : "Out of Stock"}
            </span>
            <span className="text-xs text-gray-500">{product.category}</span>
            {product.variants && product.variants.length > 0 && (
              <span className="text-xs text-gray-500">
                {product.variants[0].color}
              </span>
            )}
          </div>
          {product.reviews && product.reviews.length > 0 && (
            <div className="mt-1 flex items-center gap-1">
              <span className="text-xs text-gray-500">
                {(product.reviews.reduce((acc, review) => acc + review.rating, 0) / product.reviews.length).toFixed(1)}★
              </span>
              <span className="text-xs text-gray-500">
                ({product.reviews.length} reviews)
              </span>
            </div>
          )}
        </div>
      </div>
    );
  };

  const MessageContent: React.FC<{ content: string }> = ({ content }) => {
    return (
      <p 
        className="text-sm whitespace-pre-wrap"
        dangerouslySetInnerHTML={{ 
          __html: content.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                        .replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" class="text-secondary hover:underline">$1</a>')
        }} 
      />
    );
  };

  const TypingIndicator: React.FC = () => (
    <div className="flex items-center gap-1 p-2">
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          animate={{ scale: [1, 1.2, 1] }}
          transition={{
            repeat: Infinity,
            duration: 1,
            delay: i * 0.2,
            ease: "easeInOut",
          }}
          className="w-2 h-2 bg-secondary/50 rounded-full"
        />
      ))}
    </div>
  );

  // Style for positioning
  const positionStyle: StyleProps = isFullscreen
    ? { top: 0, left: 0, right: 0, bottom: 0 }
    : { bottom: "1.5rem", right: "1.5rem" };

  return (
    <div className="fixed z-50" style={positionStyle}>
      <AnimatePresence mode="wait">
        {isOpen ? (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className={`bg-white shadow-2xl overflow-hidden ${
              isFullscreen
                ? "w-full h-full rounded-none"
                : "w-80 sm:w-96 rounded-lg"
            }`}
          >
            {/* Chat Header */}
            <div className="bg-secondary p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Bot className="text-white" size={24} />
                <h3 className="text-white font-serif text-lg">
                  دستکاری | Dastkari Guide
                </h3>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={toggleFullscreen}
                  className="p-1 hover:bg-white/10 rounded-full transition-colors"
                  aria-label="Toggle fullscreen"
                >
                  {isFullscreen ? (
                    <Minimize2 className="text-white" size={18} />
                  ) : (
                    <Maximize2 className="text-white" size={18} />
                  )}
                </button>
                <button
                  onClick={handleClose}
                  className="p-1 hover:bg-white/10 rounded-full transition-colors"
                  aria-label="Close"
                >
                  <X className="text-white" size={18} />
                </button>
              </div>
            </div>

            {/* Chat Messages */}
            <div
              className={`overflow-y-auto p-4 bg-[#F5E6D3]/10 ${
                isFullscreen ? "h-[calc(100vh-8rem)]" : "h-96"
              }`}
            >
              <div className="space-y-4">
                {messages.map((message, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 * index }}
                    className={`flex ${
                      message.type === "user" ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div
                      className={`max-w-[80%] ${
                        message.type === "user"
                          ? "bg-secondary text-white rounded-l-lg rounded-tr-lg"
                          : "bg-white border border-secondary/20 rounded-r-lg rounded-tl-lg"
                      } p-3 shadow-sm`}
                    >
                      <MessageContent content={message.content} />
                      {message.products && message.products.length > 0 && (
                        <div className="mt-2 space-y-2">
                          {message.products.map((product) => (
                            <ProductCard key={product._id} product={product} />
                          ))}
                        </div>
                      )}
                      <p
                        className={`text-xs mt-1 ${
                          message.type === "user"
                            ? "text-white/70"
                            : "text-gray-500"
                        }`}
                      >
                        {formatTime(message.timestamp)}
                      </p>
                    </div>
                  </motion.div>
                ))}
                {isTyping && (
                  <div className="flex justify-start">
                    <div className="bg-white border border-secondary/20 rounded-r-lg rounded-tl-lg p-2">
                      <TypingIndicator />
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            </div>

            {/* Chat Input */}
            <div className="p-4 border-t border-secondary/10 bg-white">
              <div className="flex gap-2">
                <input
                  ref={inputRef}
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask about products, prices, or recommendations..."
                  className="flex-1 px-4 py-2 rounded-lg border border-secondary/20 focus:outline-none focus:border-secondary/40 bg-white"
                  aria-label="Message input"
                />
                <button
                  onClick={handleSendMessage}
                  disabled={!inputMessage.trim()}
                  className="p-2 bg-secondary text-white rounded-lg hover:bg-secondary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  aria-label="Send message"
                >
                  <Send size={20} />
                </button>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.button
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsOpen(true)}
            className="bg-secondary text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-shadow relative group"
            aria-label="Open chat"
          >
            <MessageCircle size={24} />
            <span className="absolute -top-2 -right-2 w-4 h-4 bg-red-500 rounded-full" />
            <motion.div
              initial={false}
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="absolute inset-0 bg-secondary rounded-full -z-10"
            />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
};

export default FloatingChatBot;
