import Product from "../models/product.js";
import User from "../models/user.js";
import Order from "../models/order.js";
import Blog from "../models/blog.js";

export const getDashboardStats = async (req, res) => {
  try {
    const productCount = await Product.countDocuments();
    const userCount = await User.countDocuments();
    const orders = await Order.find({ status: "completed" });
    const blogCount = await Blog.countDocuments();

    res.status(200).json({
      productCount,
      userCount,
      orders,
      blogCount,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
