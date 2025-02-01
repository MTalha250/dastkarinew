import Order from "../models/order.js";

export const createOrder = async (req, res) => {
  const {
    name,
    email,
    phone,
    order,
    shippingAddress,
    paymentMethod,
    paymentReceipt,
    subTotal,
    delivery,
    total,
  } = req.body;
  try {
    const newOrder = await Order.create({
      name,
      email,
      phone,
      order,
      shippingAddress,
      paymentMethod,
      paymentReceipt,
      subTotal,
      delivery,
      total,
    });
    res.status(201).json({ message: "Order placed successfully", newOrder });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getOrders = async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getMyOrders = async (req, res) => {
  const { email } = req.params;
  try {
    const orders = await Order.find({ email }).sort({ createdAt: -1 });
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getOrder = async (req, res) => {
  const { id } = req.params;
  try {
    const order = await Order.findById(id);
    res.status(200).json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateOrder = async (req, res) => {
  const { id } = req.params;
  const {
    name,
    email,
    phone,
    order,
    shippingAddress,
    paymentMethod,
    subTotal,
    delivery,
    total,
    status,
    paymentReceipt,
  } = req.body;
  try {
    const newOrder = await Order.findByIdAndUpdate(
      id,
      {
        name,
        email,
        phone,
        order,
        shippingAddress,
        paymentMethod,
        subTotal,
        delivery,
        total,
        status,
        paymentReceipt,
      },
      { new: true }
    );
    res.status(200).json({
      message: "Order updated successfully",
      order: newOrder,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteOrder = async (req, res) => {
  const { id } = req.params;
  try {
    await Order.findByIdAndDelete(id);
    res.status(200).json({ message: "Order deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
