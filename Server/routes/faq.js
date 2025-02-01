import express from "express";
import {
  createFAQ,
  updateFAQ,
  getFAQ,
  getFAQs,
  deleteFAQ,
} from "../controllers/faq.js";
import verifyToken from "../middlewares/verifyToken.js";
import verifyAdmin from "../middlewares/verifyAdmin.js";

const router = express.Router();

router.post("/", verifyToken, verifyAdmin, createFAQ);
router.get("/", getFAQs);
router.get("/:id", getFAQ);
router.put("/:id", verifyToken, verifyAdmin, updateFAQ);
router.delete("/:id", verifyToken, verifyAdmin, deleteFAQ);

export default router;
