import mongoose from "mongoose";

const customOrderSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    country: {
      type: String,
      required: true,
    },
    postalCode: {
      type: String,
      required: true,
    },
    modelUrl: {
      type: String,
      required: true,
    },
    prompt: {
      type: String,
      required: true,
    },
    paymentMethod: {
      type: String,
      enum: ["bank", "cod"],
      required: true,
    },
    paymentReceipt: {
      type: String,
      default: "",
    },
    status: {
      type: String,
      enum: ["pending", "processing", "completed", "cancelled"],
      default: "pending",
    },
    total: {
      type: Number,
      required: true,
    },
    delivery: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const CustomOrder = mongoose.models.CustomOrder || mongoose.model("CustomOrder", customOrderSchema);

export default CustomOrder; 