type Cart = {
  product: Product;
  quantity: number;
  size: string;
  color: string;
};

type Wishlist = {
  product: Product;
};

type User = {
  _id: string;
  email: string;
  password: string;
  name: string;
  phone: string;
  address: string;
  cart: Cart[];
  wishlist: Wishlist[];
  createdAt: string;
  updatedAt: string;
};

type Review = {
  _id: string;
  name: string;
  email: string;
  rating: number;
  title: string;
  comment: string;
  createdAt: string;
  updatedAt: string;
};

type Product = {
  _id: string;
  name: string;
  price: number;
  discount: number;
  finalPrice: number;
  images: string[];
  modelUrl?: string;
  variants: [
    {
      color: string;
      sizes: string[];
    }
  ];
  tags: string[];
  brand: string;
  category: string;
  subCategory: string;
  inStock: boolean;
  description: string;
  reviews: Review[];
  createdAt: string;
  updatedAt: string;
};

type Category = {
  _id: string;
  name: string;
  subCategories: string[];
  products: number;
  createdAt: string;
  updatedAt: string;
};

type Blog = {
  _id: string;
  author: string;
  authorImage: string;
  title: string;
  titleImage: string;
  description: string;
  category: string;
  content: string;
  timeToRead: string;
  createdAt: string;
  updatedAt: string;
};

type BlogCategory = {
  _id: string;
  name: string;
  blogs: number;
  createdAt: string;
  updatedAt: string;
};

enum OrderStatus {
  PENDING = "pending",
  PROCESSING = "processing",
  COMPLETED = "completed",
  CANCELLED = "cancelled",
}

type Order = {
  _id: string;
  name: string;
  email: string;
  phone: string;
  order: [
    {
      quantity: number;
      size: string;
      color: string;
      image: string;
      name: string;
      price: number;
    }
  ];
  status: OrderStatus;
  shippingAddress: {
    address: string;
    city: string;
    postalCode: string;
    country: string;
  };
  paymentMethod: string;
  paymentReceipt: string;
  subTotal: number;
  delivery: number;
  total: number;
  createdAt: string;
  updatedAt: string;
};

type FAQ = {
  _id: string;
  question: string;
  answer: string;
  createdAt: string;
  updatedAt: string;
};

type ContactInfo = {
  email: string;
  phone: string;
  whatsapp: string;
  address: string;
  facebook: string;
  instagram: string;
  linkedin: string;
  map: string;
};

export type {
  Cart,
  Wishlist,
  User,
  Product,
  Review,
  Category,
  Blog,
  FAQ,
  BlogCategory,
  ContactInfo,
  Order,
};

export { OrderStatus };
