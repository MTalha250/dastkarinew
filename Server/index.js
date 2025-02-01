import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import adminRoutes from "./routes/admin.js";
import userRoutes from "./routes/user.js";
import productRoutes from "./routes/product.js";
import categoryRoutes from "./routes/category.js";
import orderRoutes from "./routes/order.js";
import blogRoutes from "./routes/blog.js";
import blogCategoryRoutes from "./routes/blogCategory.js";
import dashboardStatsRoutes from "./routes/dashboardStats.js";
import faqRoutes from "./routes/faq.js";
import contactInfoRoutes from "./routes/contactInfo.js";
import contactRoutes from "./routes/contact.js";
import customOrderRoutes from "./routes/customOrder.js";
import newsletterRoutes from "./routes/newsletter.js";
import chatRoutes from "./routes/chat.js";

dotenv.config();

const app = express();
app.use(express.json());
app.use(cookieParser());

app.use(cookieParser());
app.use(
  cors({
    credentials: true,
    origin: [
      "http://localhost:3000",
      "http://localhost:3001",
      /^http:\/\/192\.168\.\d{1,3}\.\d{1,3}:3000$/,
      /^http:\/\/172\.\d{1,3}\.\d{1,3}\.\d{1,3}:3000$/,
      /^http:\/\/10\.\d{1,3}\.\d{1,3}\.\d{1,3}:3000$/,
    ],
  })
);

mongoose.set("strictQuery", false);
mongoose.connect(process.env.MONGODB_URI);

const db = mongoose.connection;

db.once("open", () => {
  console.log("MongoDB connected");
});

db.on("error", (error) => {
  console.log(error);
});

db.on("disconnected", () => {
  console.log("MongoDB disconnected");
});

app.get("/", (req, res) => {
  res.send("Server is running");
});

app.use("/api/admin", adminRoutes);
app.use("/api/user", userRoutes);
app.use("/api/product", productRoutes);
app.use("/api/category", categoryRoutes);
app.use("/api/order", orderRoutes);
app.use("/api/blog", blogRoutes);
app.use("/api/blogCategory", blogCategoryRoutes);
app.use("/api/dashboardStats", dashboardStatsRoutes);
app.use("/api/faq", faqRoutes);
app.use("/api/contactInfo", contactInfoRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/newsletter", newsletterRoutes);
app.use("/api/custom-order", customOrderRoutes);
app.use("/api/chat", chatRoutes);
const PORT = process.env.PORT || 4000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`server is running on port ${PORT}`);
});
