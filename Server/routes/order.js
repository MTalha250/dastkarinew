import express from "express";
import {
  createOrder,
  getOrders,
  getOrder,
  updateOrder,
  deleteOrder,
  getMyOrders,
} from "../controllers/order.js";
import verifyToken from "../middlewares/verifyToken.js";
import verifyAdmin from "../middlewares/verifyAdmin.js";

const router = express.Router();

router.post("/", createOrder);
router.get("/", verifyToken, verifyAdmin, getOrders);
router.get("/:id", verifyToken, verifyAdmin, getOrder);
router.get("/my-orders/:email", verifyToken, getMyOrders);
router.put("/:id", verifyToken, verifyAdmin, updateOrder);
router.delete("/:id", verifyToken, verifyAdmin, deleteOrder);

export default router;
