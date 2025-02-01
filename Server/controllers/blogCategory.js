import BlogCategory from "../models/blogCategory.js";
import Blog from "../models/blog.js";

export const createBlogCategory = async (req, res) => {
  const { name } = req.body;
  try {
    const blogCategory = await BlogCategory.create({ name });
    res
      .status(201)
      .json({ message: "Blog category created successfully", blogCategory });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getBlogCategories = async (req, res) => {
  try {
    const blogCategories = await BlogCategory.find();

    const blogsInCategory = await Promise.all(
      blogCategories.map(async (category) => {
        const blogs = await Blog.countDocuments({ category: category.name });
        return { ...category._doc, blogs };
      })
    );

    res.status(200).json(blogsInCategory);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getBlogCategory = async (req, res) => {
  const { id } = req.params;
  try {
    const blogCategory = await BlogCategory.findById(id);
    const blogs = await Blog.countDocuments({ category: id });
    res.status(200).json({ ...blogCategory._doc, blogs });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateBlogCategory = async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;
  try {
    const blogCategory = await BlogCategory.findByIdAndUpdate(
      id,
      { name },
      { new: true }
    );
    res
      .status(200)
      .json({ message: "Blog category updated successfully", blogCategory });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteBlogCategory = async (req, res) => {
  const { id } = req.params;
  try {
    await BlogCategory.findByIdAndDelete(id);
    res.status(200).json({ message: "Blog category deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
