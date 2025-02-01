import mongoose from "mongoose";

const newsletterSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
});

const Newsletter =
  mongoose.models.Newsletter || mongoose.model("Newsletter", newsletterSchema);

export default Newsletter;
