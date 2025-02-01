import Newsletter from "../models/newsletter.js";

export const createNewsletter = async (req, res) => {
  const { email } = req.body;
  try {
    const existingNewsletter = await Newsletter.findOne({ email });
    if (existingNewsletter) {
      return res.status(400).json({ message: "Email already subscribed" });
    }
    const newsletter = await Newsletter.create({ email });
    res.status(201).json({ message: "Subscribed successfully", newsletter });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getNewsletters = async (req, res) => {
  try {
    const newsletters = await Newsletter.find().sort({ createdAt: -1 });
    res.status(200).json(newsletters);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};
