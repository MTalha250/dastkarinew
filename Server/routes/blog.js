import express from "express";
import {
  createBlog,
  getBlogs,
  getBlogsByCategory,
  getBlog,
  updateBlog,
  deleteBlog,
} from "../controllers/blog.js";
import verifyToken from "../middlewares/verifyToken.js";
import verifyAdmin from "../middlewares/verifyAdmin.js";

const router = express.Router();

router.post("/", verifyToken, verifyAdmin, createBlog);
router.get("/", getBlogs);
router.get("/category/:category", getBlogsByCategory);
router.get("/:id", getBlog);
router.put("/:id", verifyToken, verifyAdmin, updateBlog);
router.delete("/:id", verifyToken, verifyAdmin, deleteBlog);

export default router;
