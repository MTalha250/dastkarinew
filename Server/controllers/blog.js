import Blog from "../models/blog.js";

export const createBlog = async (req, res) => {
  const {
    author,
    authorImage,
    title,
    titleImage,
    description,
    category,
    content,
    timeToRead,
  } = req.body;
  try {
    const blog = await Blog.create({
      author,
      authorImage,
      title,
      titleImage,
      description,
      category,
      content,
      timeToRead,
    });
    res.status(201).json({ message: "Blog created successfully", blog });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getBlogs = async (req, res) => {
  const { page = 1, limit = 12, category } = req.query;
  try {
    let filters = {};
    if (category) {
      filters.category = category;
    }
    const totalBlogs = await Blog.countDocuments(filters);
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const blogs = await Blog.find(filters)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));
    res.status(200).json({
      blogs,
      currentPage: parseInt(page),
      totalPages: Math.ceil(totalBlogs / parseInt(limit)),
      totalBlogs,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getBlogsByCategory = async (req, res) => {
  const { page = 1, limit = 12 } = req.query;
  const { category } = req.params;
  try {
    const totalBlogs = await Blog.countDocuments({ category });
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const blogs = await Blog.find({ category })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));
    res.status(200).json({
      blogs,
      currentPage: parseInt(page),
      totalPages: Math.ceil(totalBlogs / parseInt(limit)),
      totalBlogs,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getBlog = async (req, res) => {
  const { id } = req.params;
  try {
    const blog = await Blog.findById(id);
    res.status(200).json(blog);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateBlog = async (req, res) => {
  const { id } = req.params;
  const {
    author,
    authorImage,
    title,
    titleImage,
    description,
    category,
    content,
    timeToRead,
  } = req.body;
  try {
    const blog = await Blog.findByIdAndUpdate(
      id,
      {
        author,
        authorImage,
        title,
        titleImage,
        description,
        category,
        content,
        timeToRead,
      },
      { new: true }
    );
    res.status(200).json({ message: "Blog updated successfully", blog });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteBlog = async (req, res) => {
  const { id } = req.params;
  try {
    await Blog.findByIdAndDelete(id);
    res.status(200).json({ message: "Blog deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
