import express from "express";
import {
  createBlogCategory,
  getBlogCategories,
  getBlogCategory,
  updateBlogCategory,
  deleteBlogCategory,
} from "../controllers/blogCategory.js";
import verifyToken from "../middlewares/verifyToken.js";
import verifyAdmin from "../middlewares/verifyAdmin.js";

const router = express.Router();

router.post("/", verifyToken, verifyAdmin, createBlogCategory);
router.get("/", getBlogCategories);
router.get("/:id", getBlogCategory);
router.put("/:id", verifyToken, verifyAdmin, updateBlogCategory);
router.delete("/:id", verifyToken, verifyAdmin, deleteBlogCategory);

export default router;
