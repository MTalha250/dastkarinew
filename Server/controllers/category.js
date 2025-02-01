import Category from "../models/category.js";
import Product from "../models/product.js";

export const createCategory = async (req, res) => {
  const { name, subCategories } = req.body;
  try {
    const newCategory = await Category.create({ name, subCategories });
    res
      .status(201)
      .json({ message: "Category created successfully", newCategory });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getCategories = async (req, res) => {
  try {
    const categories = await Category.find();
    const productsInCategory = await Promise.all(
      categories.map(async (category) => {
        const products = await Product.countDocuments({
          category: category.name,
        });
        return { ...category._doc, products };
      })
    );
    res.status(200).json(productsInCategory);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getCategory = async (req, res) => {
  const { id } = req.params;
  try {
    const category = await Category.findById(id);
    const products = await Product.countDocuments({ category: id });
    res.status(200).json({ ...category._doc, products });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateCategory = async (req, res) => {
  const { id } = req.params;
  const { name, subCategories } = req.body;
  try {
    const category = await Category.findByIdAndUpdate(
      id,
      { name, subCategories },
      { new: true }
    );
    res
      .status(200)
      .json({ message: "Category updated successfully", category });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteCategory = async (req, res) => {
  const { id } = req.params;
  try {
    await Category.findByIdAndDelete(id);
    res.status(200).json({ message: "Category deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
