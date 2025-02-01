import mongoose from "mongoose";

const adminSchema = new mongoose.Schema(
  {
    profileImage: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      unique: true,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      required: true,
      enum: ["admin", "moderator"],
      default: "moderator",
    },
    permissions: {
      products: {
        type: Boolean,
        required: true,
      },
      categories: {
        type: Boolean,
        required: true,
      },
      orders: {
        type: Boolean,
        required: true,
      },
      customers: {
        type: Boolean,
        required: true,
      },
      blogs: {
        type: Boolean,
        required: true,
      },
    },
  },
  {
    timestamps: true,
  }
);

const Admin = mongoose.models.Admin || mongoose.model("Admin", adminSchema);

export default Admin;
