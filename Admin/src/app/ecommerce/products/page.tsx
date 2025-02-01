"use client";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import { useEffect, useState } from "react";
import { FaEye, FaEdit } from "react-icons/fa";
import { IoMdClose } from "react-icons/io";
import Modal from "react-modal";
import PhotosUploader from "@/components/Uploader";
import toast from "react-hot-toast";
import axios from "axios";
import { Product, Category } from "@/types";
import Loader from "@/components/common/Loader";
import Delete from "@/components/Delete";
import { CiCircleMinus } from "react-icons/ci";
import useAuthStore from "@/store/authStore";
import ReactPaginate from "react-paginate";
import { useRouter, useSearchParams } from "next/navigation";
import ModelUploader from "@/components/Uploader/ModelUploader";

const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
    width: "100%",
    maxWidth: "650px",
    maxHeight: "90vh",
    backgroundColor: "#1f2937",
    color: "#ffffff",
    border: "1px solid #4b5563",
  },
  overlay: {
    backgroundColor: "rgba(0, 0, 0, 0.75)",
    zIndex: 1000,
  },
};

const Products = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [id, setId] = useState("");
  const [colorInput, setColorInput] = useState(""); // For color input in variants
  const [sizeInputs, setSizeInputs] = useState<string[]>([]); // For selected sizes in variants
  const { token, user } = useAuthStore();
  const [selectedCategory, setSelectedCategory] = useState("");
  const [totalPages, setTotalPages] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);
  const navigate = useRouter();
  const searchParams = useSearchParams();
  const pageParam = searchParams.get("page") ?? 1;

  useEffect(() => {
    getProductsAndCategories();
  }, []);
  useEffect(() => {
    getProducts();
  }, [pageParam]);

  const getProductsAndCategories = async () => {
    setLoading(true);
    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/product?page=${pageParam}`,
      );
      setProducts(res.data.products);
      setTotalPages(res.data.totalPages);
      setTotalProducts(res.data.totalProducts);
      const res2 = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/category`,
      );
      setCategories(res2.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const getProducts = async () => {
    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/product?page=${pageParam}`,
      );
      setProducts(res.data.products);
      setTotalPages(res.data.totalPages);
      setTotalProducts(res.data.totalProducts);
    } catch (error) {
      console.error(error);
    }
  };

  const initialFormData: {
    name: string;
    price: number;
    discount: number;
    images: string[];
    modelUrl: string;
    variants: { color: string; sizes: string[] }[];
    category: string;
    subCategory: string;
    inStock: boolean;
    description: string;
    featured: boolean;
    onSale: boolean;
    brand?: string;
    tags: string[];
  } = {
    name: "",
    price: 0,
    discount: 0,
    images: [],
    modelUrl: "",
    variants: [],
    category: "",
    subCategory: "",
    inStock: true,
    description: "",
    featured: false,
    onSale: false,
    brand: "",
    tags: [],
  };

  const [formData, setFormData] = useState(initialFormData);

  const openModal = () => {
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setFormData(initialFormData);
    setEditMode(false);
    setModalIsOpen(false);
  };

  const handleSizeSelection = (size: string) => {
    const updatedSizes = sizeInputs.includes(size)
      ? sizeInputs.filter((s) => s !== size)
      : [...sizeInputs, size];
    setSizeInputs(updatedSizes);
  };

  const handleAddVariant = () => {
    if (colorInput.trim() && sizeInputs.length > 0) {
      setFormData({
        ...formData,
        variants: [
          ...formData.variants,
          { color: colorInput, sizes: sizeInputs },
        ],
      });
      setColorInput("");
      setSizeInputs([]);
    } else {
      toast.error(
        "Please provide a color and select at least one size for the variant.",
      );
    }
  };

  const handleRemoveVariant = (index: number) => {
    const updatedVariants = formData.variants.filter((_, i) => i !== index);
    setFormData({ ...formData, variants: updatedVariants });
  };

  const isFormValid = () => {
    return (
      formData.name.length > 0 &&
      formData.description.length > 0 &&
      formData.category.length > 0 &&
      formData.subCategory.length > 0 &&
      formData.variants.length > 0 &&
      formData.price > 0 &&
      formData.discount >= 0 &&
      formData.images.length > 0
    );
  };

  const handleCategoryChange = (categoryId: string) => {
    setSelectedCategory(categoryId);
    setFormData({ ...formData, category: categoryId, subCategory: "" });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if (!isFormValid()) {
      toast.error("Please fill in all fields");
      return;
    }

    let updatedTags = [...formData.tags];
    if (formData.featured && !updatedTags.includes("featured")) {
      updatedTags.push("featured");
    } else if (!formData.featured && updatedTags.includes("featured")) {
      updatedTags = updatedTags.filter((tag) => tag !== "featured");
    }

    if (formData.onSale && !updatedTags.includes("on sale")) {
      updatedTags.push("on sale");
    } else if (!formData.onSale && updatedTags.includes("on sale")) {
      updatedTags = updatedTags.filter((tag) => tag !== "on sale");
    }

    setLoading(true);
    try {
      const updatedFormData = {
        ...formData,
        tags: updatedTags,
      };

      if (editMode) {
        await axios.put(
          `${process.env.NEXT_PUBLIC_API_URL}/product/${id}`,
          updatedFormData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );
        toast.success("Product updated successfully");
      } else {
        await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/product`,
          updatedFormData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );
        toast.success("Product added successfully");
      }
      closeModal();
      getProducts();
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong, please try again");
    } finally {
      setLoading(false);
    }
  };

  const handleEditProduct = (product: Product) => {
    setFormData({
      name: product.name,
      description: product.description,
      category: product.category,
      subCategory: product.subCategory,
      price: product.price,
      discount: product.discount,
      inStock: product.inStock,
      images: product.images,
      modelUrl: product.modelUrl || "",
      variants: product.variants,
      featured: product.tags.includes("featured"),
      onSale: product.tags.includes("on sale"),
      brand: product.brand || "",
      tags: product.tags,
    });
    setSelectedCategory(product.category);
    setEditMode(true);
    setId(product._id);
    openModal();
  };

  const handlePageClick = (data: any) => {
    navigate.push(`?page=${data.selected + 1}`);
  };

  // Filter products based on the search term
  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  if (!user?.permissions.products) {
    return (
      <DefaultLayout>
        <div className="flex h-[84.4vh] items-center justify-center">
          <h1 className="text-2xl font-semibold text-black dark:text-white">
            You do not have permission to view this page
          </h1>
        </div>
      </DefaultLayout>
    );
  }

  return (
    <DefaultLayout>
      <div className="relative mx-auto min-h-screen max-w-270">
        <Breadcrumb pageName="Products" />
        <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
          <div className="flex flex-col items-start justify-between px-4 py-6 sm:flex-row sm:items-center md:px-6 xl:px-7.5">
            <h4 className="mb-4 text-xl font-semibold text-black dark:text-white sm:mb-0">
              All Products
            </h4>
            <div className="flex w-full flex-col items-start gap-4 sm:w-auto sm:flex-row sm:items-center">
              <p className="w-full rounded border border-stroke px-4.5 py-2 text-black dark:border-strokedark dark:bg-meta-4 dark:text-white">
                {totalProducts} Products
              </p>
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full rounded border border-stroke bg-gray px-4.5 py-2 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary sm:w-auto"
              />
              <button
                onClick={openModal}
                className="inline-flex items-center justify-center whitespace-nowrap rounded-md bg-primary px-4 py-2 text-center font-medium text-white hover:bg-opacity-90"
                disabled={loading}
              >
                Add Product
              </button>
              <Modal
                isOpen={modalIsOpen}
                onRequestClose={closeModal}
                style={customStyles}
                contentLabel="Add Product"
              >
                <div className="flex items-center justify-between px-4 py-4 md:px-6 xl:px-7.5">
                  <h4 className="text-xl font-semibold text-white dark:text-white">
                    {editMode ? "Update Product" : "Add Product"}
                  </h4>
                  <button
                    onClick={closeModal}
                    className="dark:text-white dark:hover:text-white"
                  >
                    <IoMdClose size={18} />
                  </button>
                </div>
                <form className="px-4 py-4 md:px-6 xl:px-7.5">
                  <div className="space-y-4">
                    {/* Images Upload */}
                    <div>
                      <label
                        htmlFor="images"
                        className="block text-sm font-medium text-white dark:text-white"
                      >
                        Images
                      </label>
                      <PhotosUploader
                        addedPhotos={formData.images}
                        maxPhotos={8}
                        onChange={(photos: any) =>
                          setFormData({ ...formData, images: photos })
                        }
                      />
                    </div>

                    {/* 3D Model Upload */}
                    <div>
                      <label
                        htmlFor="model"
                        className="block text-sm font-medium text-white dark:text-white"
                      >
                        3D Model (optional)
                      </label>
                      <ModelUploader
                        modelUrl={formData.modelUrl}
                        onChange={(url: string) =>
                          setFormData({ ...formData, modelUrl: url })
                        }
                      />
                    </div>

                    {/* Product Name */}
                    <div>
                      <label
                        htmlFor="name"
                        className="block text-sm font-medium text-white dark:text-white"
                      >
                        Name
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={(e) =>
                          setFormData({ ...formData, name: e.target.value })
                        }
                        className="w-full rounded border border-stroke bg-gray px-4.5 py-2 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                      />
                    </div>

                    {/* Description */}
                    <div>
                      <label
                        htmlFor="description"
                        className="block text-sm font-medium text-white dark:text-white"
                      >
                        Description
                      </label>
                      <textarea
                        id="description"
                        name="description"
                        value={formData.description}
                        rows={5}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            description: e.target.value,
                          })
                        }
                        className="w-full rounded border border-stroke bg-gray px-4.5 py-2 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                      />
                    </div>

                    <div className="flex flex-col gap-4 sm:flex-row">
                      <div className="w-full">
                        <label
                          htmlFor="category"
                          className="block text-sm font-medium text-white dark:text-white"
                        >
                          Category
                        </label>
                        <select
                          id="category"
                          name="category"
                          value={formData.category}
                          onChange={(e) => handleCategoryChange(e.target.value)}
                          className="w-full appearance-none rounded border border-stroke bg-gray px-4.5 py-2 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white"
                        >
                          <option value="">Select Category</option>
                          {categories.map((category) => (
                            <option key={category._id} value={category.name}>
                              {category.name}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="w-full">
                        <label
                          htmlFor="subCategory"
                          className="block text-sm font-medium text-white dark:text-white"
                        >
                          Sub Category
                        </label>
                        <select
                          id="subCategory"
                          name="subCategory"
                          value={formData.subCategory}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              subCategory: e.target.value,
                            })
                          }
                          className="w-full appearance-none rounded border border-stroke bg-gray px-4.5 py-2 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white"
                          disabled={!selectedCategory}
                        >
                          <option value="">Select Sub Category</option>
                          {selectedCategory &&
                            categories
                              .find((cat) => cat.name === selectedCategory)
                              ?.subCategories.map((sub) => (
                                <option key={sub} value={sub}>
                                  {sub}
                                </option>
                              ))}
                        </select>
                      </div>
                    </div>
                    {/* Variants */}
                    <div>
                      <label className="block text-sm font-medium text-white dark:text-white">
                        Variant
                      </label>
                      <div className="mb-4">
                        <input
                          type="text"
                          placeholder="Color"
                          value={colorInput}
                          onChange={(e) => setColorInput(e.target.value)}
                          className="mb-2 w-full rounded border border-stroke bg-gray px-4.5 py-2 text-black focus:border-primary dark:border-strokedark dark:bg-meta-4 dark:text-white"
                        />
                        <div className="mb-2 flex flex-wrap gap-4">
                          {["Free Size","S", "M", "L", "XL", "XXL", "XXXL"].map((size) => (
                            <label
                              key={size}
                              className="inline-flex items-center"
                            >
                              <input
                                type="checkbox"
                                value={size}
                                checked={sizeInputs.includes(size)}
                                onChange={() => handleSizeSelection(size)}
                                className="mr-2"
                              />
                              <span className="text-sm text-white dark:text-white">
                                {size}
                              </span>
                            </label>
                          ))}
                        </div>
                        <button
                          type="button"
                          onClick={handleAddVariant}
                          className="rounded-md bg-primary px-4 py-2 text-white"
                        >
                          Add Variant
                        </button>
                      </div>
                      <div className="mt-2 flex flex-col space-y-2">
                        {formData.variants.map((variant, index) => (
                          <div
                            key={index}
                            className="text-primary-hover flex items-center justify-between bg-graydark px-3 py-1 text-sm font-medium"
                          >
                            <span>
                              {variant.color} - Sizes:{" "}
                              {variant.sizes.join(", ")}
                            </span>
                            <CiCircleMinus
                              className="cursor-pointer"
                              onClick={() => handleRemoveVariant(index)}
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="flex flex-col gap-4 sm:flex-row">
                      <div className="w-full">
                        <label
                          htmlFor="price"
                          className="block text-sm font-medium text-white dark:text-white"
                        >
                          Price
                        </label>
                        <input
                          type="number"
                          id="price"
                          name="price"
                          value={formData.price}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              price: parseFloat(e.target.value),
                            })
                          }
                          className="w-full rounded border border-stroke bg-gray px-4.5 py-2 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white"
                          min="0"
                        />
                      </div>
                      <div className="w-full">
                        <label
                          htmlFor="discount"
                          className="block text-sm font-medium text-white dark:text-white"
                        >
                          Discount (%)
                        </label>
                        <input
                          type="number"
                          id="discount"
                          name="discount"
                          value={formData.discount}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              discount: parseFloat(e.target.value),
                            })
                          }
                          className="w-full rounded border border-stroke bg-gray px-4.5 py-2 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white"
                          min="0"
                          max="100"
                        />
                      </div>
                    </div>
                    {/* Brand */}
                    {/* <div>
                      <label
                        htmlFor="brand"
                        className="block text-sm font-medium text-white dark:text-white"
                      >
                        Brand (optional)
                      </label>
                      <input
                        type="text"
                        id="brand"
                        name="brand"
                        value={formData.brand}
                        onChange={(e) =>
                          setFormData({ ...formData, brand: e.target.value })
                        }
                        className="w-full rounded border border-stroke bg-gray px-4.5 py-2 text-black focus:border-primary dark:border-strokedark dark:bg-meta-4 dark:text-white"
                      />
                    </div> */}

                    <div className="flex gap-4">
                      <div>
                        <label className="inline-flex items-center">
                          <input
                            type="checkbox"
                            checked={formData.inStock}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                inStock: e.target.checked,
                              })
                            }
                            className="mr-2"
                          />
                          <span className="text-sm text-white dark:text-white">
                            In Stock
                          </span>
                        </label>
                      </div>
                      <div>
                        <label className="inline-flex items-center">
                          <input
                            type="checkbox"
                            checked={formData.featured}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                featured: e.target.checked,
                              })
                            }
                            className="mr-2"
                          />
                          <span className="text-sm text-white dark:text-white">
                            Featured
                          </span>
                        </label>
                      </div>
                      <div>
                        <label className="inline-flex items-center">
                          <input
                            type="checkbox"
                            checked={formData.onSale}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                onSale: e.target.checked,
                              })
                            }
                            className="mr-2"
                          />
                          <span className="text-sm text-white dark:text-white">
                            On Sale
                          </span>
                        </label>
                      </div>
                    </div>
                  </div>

                  <button
                    type="submit"
                    onClick={handleSubmit}
                    className="mt-6 w-full rounded-md bg-primary px-4 py-2 text-center font-medium text-white hover:bg-opacity-90"
                    disabled={loading}
                  >
                    {loading
                      ? "Saving..."
                      : editMode
                        ? "Update Product"
                        : "Add Product"}
                  </button>
                </form>
              </Modal>
            </div>
          </div>

          {/* Desktop and Mobile product lists, and pagination */}
          <div className="hidden min-h-[65vh] flex-col items-center justify-between sm:flex">
            <div className="h-fit w-full">
              <div className="grid grid-cols-9 border-t border-stroke px-4 py-4.5 dark:border-strokedark md:px-6 2xl:px-7.5">
                <div className="col-span-3 flex items-center">
                  <p className="font-medium">Product Name</p>
                </div>
                <div className="col-span-2 hidden items-center sm:flex">
                  <p className="font-medium">Category</p>
                </div>
                <div className="col-span-2 flex items-center">
                  <p className="font-medium">Sub Category</p>
                </div>
                <div className="col-span-1 flex items-center whitespace-nowrap">
                  <p className="font-medium">Price</p>
                </div>
                <div className="col-span-1 flex items-center justify-end">
                  <p className="font-medium">Actions</p>
                </div>
              </div>
              {loading ? (
                <Loader className="h-[60vh]" />
              ) : filteredProducts.length > 0 ? (
                filteredProducts.map((product) => (
                  <div
                    className="grid grid-cols-9 border-t border-stroke px-4 py-4.5 dark:border-strokedark md:px-6 2xl:px-7.5"
                    key={product._id}
                  >
                    <div className="col-span-3 flex items-center">
                      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                        <div className="h-12.5 w-15 rounded-md">
                          <img
                            src={product.images[0]}
                            className="h-15 w-15 object-cover"
                            alt="Product"
                          />
                        </div>
                        <p className="text-sm text-black dark:text-white">
                          {product.name}
                        </p>
                      </div>
                    </div>
                    <div className="col-span-2 hidden items-center sm:flex">
                      <p className="text-sm text-black dark:text-white">
                        {product.category}
                      </p>
                    </div>
                    <div className="col-span-2 flex items-center">
                      <p className="text-sm text-black dark:text-white">
                        {product.subCategory}
                      </p>
                    </div>
                    <div className="col-span-1 flex items-center">
                      <p className="text-red-500 text-sm">
                        PKR {product.finalPrice}
                      </p>
                    </div>
                    <div className="col-span-1 flex items-center justify-end gap-2">
                      <a
                        href={`${process.env.NEXT_PUBLIC_CLIENT_URL}/products/${product.category}/${product.subCategory}/${product._id}`}
                        target="_blank"
                        className="dark:text-white"
                      >
                        <FaEye size={18} />
                      </a>
                      <button
                        onClick={() => handleEditProduct(product)}
                        className="dark:text-white"
                      >
                        <FaEdit size={18} />
                      </button>
                      <Delete
                        api={`/product/${product._id}`}
                        message="Product deleted successfully"
                        fetch={getProducts}
                      />
                    </div>
                  </div>
                ))
              ) : (
                <div className="px-4 py-6 text-center text-black dark:text-white">
                  No products found.
                </div>
              )}
            </div>
            <ReactPaginate
              breakLabel="..."
              nextLabel="next >"
              onPageChange={handlePageClick}
              pageRangeDisplayed={3}
              pageCount={totalPages}
              previousLabel="< previous"
              containerClassName="flex justify-center space-x-2 py-5 mt-5"
              pageClassName="page-item"
              pageLinkClassName="px-3 py-2 bg-gray-200 rounded-md hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600"
              previousClassName="page-item"
              previousLinkClassName="px-3 py-2 bg-gray-200 rounded-md hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600"
              nextClassName="page-item"
              nextLinkClassName="px-3 py-2 bg-gray-200 rounded-md hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600"
              breakClassName="page-item"
              breakLinkClassName="px-3 py-2 bg-gray-200 rounded-md hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600"
              activeClassName="bg-primary text-white"
            />
          </div>

          {/* Mobile Card Layout */}
          <div className="flex min-h-[45vh] flex-col items-center justify-between px-4 sm:hidden">
            <div className="h-fit w-full">
              {loading ? (
                <Loader className="h-[60vh]" />
              ) : filteredProducts.length > 0 ? (
                filteredProducts.map((product) => (
                  <div
                    className="mb-4 rounded-lg border border-stroke p-4 shadow-sm dark:border-strokedark dark:bg-boxdark"
                    key={product._id}
                  >
                    <div className="mb-4 flex items-center">
                      <img
                        src={product.images[0]}
                        className="h-20 w-20 rounded-md object-cover"
                        alt="Product"
                      />
                      <div className="ml-4">
                        <h5 className="text-lg font-semibold text-black dark:text-white">
                          {product.name}
                        </h5>
                        <p className="text-gray-500 dark:text-gray-400 text-sm">
                          {product.category} - {product.subCategory}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="text-red-500 text-sm">
                        PKR {product.finalPrice}
                      </p>
                      <div className="flex items-center gap-2">
                        <a
                          href={`${process.env.NEXT_PUBLIC_CLIENT_URL}/products/${product.category}/${product.subCategory}/${product._id}`}
                          target="_blank"
                          className="dark:text-white"
                        >
                          <FaEye size={18} />
                        </a>
                        <button
                          onClick={() => handleEditProduct(product)}
                          className="dark:text-white"
                        >
                          <FaEdit size={18} />
                        </button>
                        <Delete
                          api={`/product/${product._id}`}
                          message="Product deleted successfully"
                          fetch={getProducts}
                        />
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="px-4 py-6 text-center text-black dark:text-white">
                  No products found.
                </div>
              )}
            </div>
            <ReactPaginate
              breakLabel="..."
              nextLabel="next >"
              onPageChange={handlePageClick}
              pageRangeDisplayed={3}
              pageCount={totalPages}
              previousLabel="< previous"
              containerClassName="flex justify-center space-x-2 py-5 mt-5"
              pageClassName="page-item"
              pageLinkClassName="px-3 py-2 bg-gray-200 rounded-md hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600"
              previousClassName="page-item"
              previousLinkClassName="px-3 py-2 bg-gray-200 rounded-md hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600"
              nextClassName="page-item"
              nextLinkClassName="px-3 py-2 bg-gray-200 rounded-md hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600"
              breakClassName="page-item"
              breakLinkClassName="px-3 py-2 bg-gray-200 rounded-md hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600"
              activeClassName="bg-primary text-white"
            />
          </div>
        </div>
      </div>
    </DefaultLayout>
  );
};

export default Products;
