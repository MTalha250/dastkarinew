import CustomOrder from "../models/customOrder.js";

// Create a new custom order
export const createCustomOrder = async (req, res) => {
  try {
    const newOrder = new CustomOrder(req.body);
    const savedOrder = await newOrder.save();
    res.status(201).json({ message: "Custom order created successfully", order: savedOrder });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all custom orders (admin only)
export const getAllCustomOrders = async (req, res, next) => {
  try {
    const orders = await CustomOrder.find().sort({ createdAt: -1 });
      res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update custom order status (admin only)
export const updateCustomOrderStatus = async (req, res, next) => {
  try {
    const updatedOrder = await CustomOrder.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
      );
      res.status(200).json(updatedOrder);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete custom order (admin only)
export const deleteCustomOrder = async (req, res, next) => {
  try {
    await CustomOrder.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Custom order deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}; 