import FAQ from "../models/faq.js";

export const createFAQ = async (req, res) => {
  const { question, answer } = req.body;
  try {
    const faq = await FAQ.create({ question, answer });
    res.status(201).json({ message: "FAQ created successfully", faq });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getFAQs = async (req, res) => {
  try {
    const faqs = await FAQ.find();
    res.status(200).json(faqs);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const getFAQ = async (req, res) => {
  const { id } = req.params;
  try {
    const faq = await FAQ.findById(id);
    res.status(200).json(faq);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const updateFAQ = async (req, res) => {
  const { id } = req.params;
  const { question, answer } = req.body;
  try {
    const faq = await FAQ.findByIdAndUpdate(
      id,
      { question, answer },
      { new: true }
    );
    res.status(200).json({ message: "FAQ updated successfully", faq });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteFAQ = async (req, res) => {
  const { id } = req.params;
  try {
    await FAQ.findByIdAndDelete(id);
    res.status(200).json({ message: "FAQ deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
