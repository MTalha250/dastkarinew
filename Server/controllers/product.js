import Product from "../models/product.js";

export const createProduct = async (req, res) => {
  const {
    name,
    price,
    discount,
    images,
    modelUrl,
    variants,
    tags,
    brand,
    category,
    subCategory,
    inStock,
    description,
  } = req.body;
  try {
    const newProduct = await Product.create({
      name,
      price,
      discount,
      images,
      modelUrl,
      variants,
      tags,
      brand,
      category,
      subCategory,
      inStock,
      description,
    });
    res
      .status(201)
      .json({ message: "Product created successfully", newProduct });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getProducts = async (req, res) => {
  const { page = 1, limit = 12 } = req.query;
  try {
    const totalProducts = await Product.countDocuments();
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const products = await Product.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));
    res.status(200).json({
      products,
      currentPage: parseInt(page),
      totalPages: Math.ceil(totalProducts / parseInt(limit)),
      totalProducts,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getProductsByCategory = async (req, res) => {
  const { page = 1, limit = 12 } = req.query;
  const { category } = req.params;
  try {
    const totalProducts = await Product.countDocuments({ category });
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const products = await Product.find({ category })
      .sort({ createdAt: -1 })

      .skip(skip)
      .limit(parseInt(limit));
    res.status(200).json({
      products,
      currentPage: parseInt(page),
      totalPages: Math.ceil(totalProducts / parseInt(limit)),
      totalProducts,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getProductsBySubCategory = async (req, res) => {
  const { page = 1, limit = 12 } = req.query;
  const { category, subCategory } = req.params;

  const parsedPage = parseInt(page);
  const parsedLimit = parseInt(limit);
  try {
    const totalProducts = await Product.countDocuments({
      category,
      subCategory,
    });
    const skip = (parsedPage - 1) * parsedLimit;
    const products = await Product.find({
      category,
      subCategory,
    })
      .sort({
        createdAt: -1,
      })
      .skip(skip)
      .limit(parsedLimit);
    res.status(200).json({
      products,
      currentPage: parsedPage,
      totalPages: Math.ceil(totalProducts / parsedLimit),
      totalProducts,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const getFeaturedProducts = async (req, res) => {
  try {
    const products = await Product.find({
      tags: { $in: ["featured"] },
    }).sort({ createdAt: -1 });
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getSaleProducts = async (req, res) => {
  try {
    const products = await Product.find({
      tags: { $in: ["on sale"] },
    }).sort({ createdAt: -1 });
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const checkIfThereAreProductsOnSale = async (req, res) => {
  try {
    const products = await Product.find({
      tags: { $in: ["on sale"] },
    });
    if (products.length > 0) {
      res.json({
        bool: true,
        message: "There are products on sale",
      });
    } else {
      res.json({
        bool: false,
        message: "There are no products on sale",
      });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getProduct = async (req, res) => {
  const { id } = req.params;
  try {
    const product = await Product.findById(id);
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateProduct = async (req, res) => {
  const { id } = req.params;
  const {
    name,
    price,
    discount,
    images,
    modelUrl,
    variants,
    tags,
    brand,
    category,
    subCategory,
    inStock,
    description,
  } = req.body;
  try {
    const product = await Product.findByIdAndUpdate(
      id,
      {
        name,
        price,
        discount,
        images,
        modelUrl,
        variants,
        tags,
        brand,
        category,
        subCategory,
        inStock,
        description,
        finalPrice: price - price * (discount / 100),
      },
      { new: true }
    );
    res.status(200).json({
      message: "Product updated successfully",
      product,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const addReview = async (req, res) => {
  const { id } = req.params;
  const { review } = req.body;
  try {
    const product = await Product.findById(id);
    product.reviews.unshift(review);
    await product.save();
    res.status(200).json({
      message: "Review added successfully",
      product,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteProduct = async (req, res) => {
  const { id } = req.params;
  try {
    await Product.findByIdAndDelete(id);
    res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const filterProducts = async (req, res) => {
  const {
    category,
    subCategory,
    query,
    color,
    size,
    min,
    max,
    page = 1,
    limit = 12,
  } = req.query;

  let filters = {};

  // Filter by category and subCategory
  if (category) {
    filters.category = category;
  }
  if (subCategory) {
    filters.subCategory = subCategory;
  }

  // General text search across different fields
  if (query) {
    filters.$or = [
      { name: { $regex: query, $options: "i" } },
      { description: { $regex: query, $options: "i" } },
      { category: { $regex: query, $options: "i" } },
      { subCategory: { $regex: query, $options: "i" } },
      { "variants.color": { $regex: query, $options: "i" } }, // Updated to reflect path within variants
      { "variants.sizes": { $regex: query, $options: "i" } }, // Updated to reflect path within variants
    ];
  }

  // Filter by color
  if (color) {
    const colorsArray = color.split(",").map((c) => c.trim());
    filters["variants.color"] = { $in: colorsArray }; // Corrected path for color within variants
  }

  // Filter by size
  if (size) {
    const sizesArray = size.split(",").map((s) => s.trim());
    filters["variants.sizes"] = { $in: sizesArray }; // Corrected path for sizes within variants
  }

  // Price range filtering
  const parsedMin = parseFloat(min);
  const parsedMax = parseFloat(max);
  if (min >= 0 && max > 0) {
    if (!isNaN(parsedMin) && !isNaN(parsedMax)) {
      filters.finalPrice = { $gte: parsedMin, $lte: parsedMax };
    } else if (!isNaN(parsedMin)) {
      filters.finalPrice = { $gte: parsedMin };
    } else if (!isNaN(parsedMax)) {
      filters.finalPrice = { $lte: parsedMax };
    }
  }

  // Pagination setup
  const parsedPage = parseInt(page);
  const parsedLimit = parseInt(limit);

  try {
    // Count documents that match the filters
    const totalProducts = await Product.countDocuments(filters);
    const skip = (parsedPage - 1) * parsedLimit;

    // Retrieve products based on filters, sorted by creation date
    const products = await Product.find(filters)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parsedLimit);

    // Respond with the result
    res.json({
      products,
      currentPage: parsedPage,
      totalPages: Math.ceil(totalProducts / parsedLimit),
      totalProducts,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const filterValues = async (req, res) => {
  try {
    const categories = await Product.find().distinct("category");
    const subCategories = await Product.find().distinct("subCategory");
    const colors = await Product.find().distinct("variants.color");
    const sizes = await Product.find().distinct("variants.sizes");
    const maxPrice = await Product.find().sort({ finalPrice: -1 }).limit(1);

    res.json({
      categories,
      subCategories,
      colors,
      sizes,
      maxPrice: maxPrice[0].finalPrice,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
