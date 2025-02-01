import express from "express";
import {
  createCustomOrder,
  getAllCustomOrders,
  updateCustomOrderStatus,
  deleteCustomOrder,
} from "../controllers/customOrder.js";
import verifyToken from "../middlewares/verifyToken.js";
import verifyAdmin from "../middlewares/verifyAdmin.js";

const router = express.Router();

// Create custom order
router.post("/", createCustomOrder);

// Get all custom orders (admin only)
router.get("/", verifyToken, verifyAdmin, getAllCustomOrders);

// Update custom order status (admin only)
router.put("/:id", verifyToken, verifyAdmin, updateCustomOrderStatus);

// Delete custom order (admin only)
router.delete("/:id", verifyToken, verifyAdmin, deleteCustomOrder);

export default router; 