"use client";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import { useEffect, useState } from "react";
import { FaEdit } from "react-icons/fa";
import { IoMdClose } from "react-icons/io";
import Modal from "react-modal";
import toast from "react-hot-toast";
import axios from "axios";
import Loader from "@/components/common/Loader";
import Delete from "@/components/Delete";
import { Category } from "@/types";
import useAuthStore from "@/store/authStore";

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
    color: "#f9fafb",
    border: "1px solid #374151",
  },
  overlay: {
    backgroundColor: "rgba(0, 0, 0, 0.75)",
    zIndex: 1000,
  },
};

const Categories = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [id, setId] = useState<string | null>(null);
  const { token, user } = useAuthStore();

  const initialFormData = {
    name: "",
    subCategories: [] as string[],
  };
  const [formData, setFormData] = useState(initialFormData);
  const [subCategoryInput, setSubCategoryInput] = useState("");

  useEffect(() => {
    getCategories();
  }, []);

  const getCategories = async () => {
    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/category`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      setCategories(res.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const openModal = () => setModalIsOpen(true);
  const closeModal = () => {
    setModalIsOpen(false);
    setEditMode(false);
    setId(null);
    setFormData(initialFormData);
    setSubCategoryInput("");
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if (formData.name === "") {
      toast.error("Please fill in the category name");
      return;
    }

    setLoading(true);
    try {
      if (editMode && id !== null) {
        await axios.put(
          `${process.env.NEXT_PUBLIC_API_URL}/category/${id}`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );
        toast.success("Category updated successfully");
      } else {
        await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/category`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );
        toast.success("Category added successfully");
      }

      closeModal();
      getCategories();
    } catch (error) {
      toast.error("Failed to save category");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddSubCategory = () => {
    if (subCategoryInput.trim()) {
      setFormData({
        ...formData,
        subCategories: [...formData.subCategories, subCategoryInput],
      });
      setSubCategoryInput("");
    } else {
      toast.error("Subcategory name cannot be empty");
    }
  };

  const handleRemoveSubCategory = (subCategory: string) => {
    setFormData({
      ...formData,
      subCategories: formData.subCategories.filter(
        (sub) => sub !== subCategory,
      ),
    });
  };

  const filteredCategories = categories.filter((category) =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  if (!user?.permissions.categories) {
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
        <Breadcrumb pageName="Product Categories" />
        <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
          <div className="flex flex-col items-start justify-between px-4 py-6 sm:flex-row sm:items-center md:px-6 xl:px-7.5">
            <h4 className="mb-4 text-xl font-semibold text-black dark:text-white sm:mb-0">
              All Categories
            </h4>
            <div className="flex w-full flex-col items-start gap-4 sm:w-auto sm:flex-row sm:items-center">
              <input
                type="text"
                placeholder="Search categories..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full rounded border border-stroke bg-gray px-4.5 py-2 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary sm:w-auto"
              />
              <button
                onClick={openModal}
                className="inline-flex items-center justify-center whitespace-nowrap rounded-md bg-primary px-4 py-2 text-center font-medium text-white hover:bg-opacity-90"
              >
                Add Category
              </button>
              <Modal
                isOpen={modalIsOpen}
                onRequestClose={closeModal}
                style={customStyles}
                contentLabel="Add Category"
              >
                <div className="flex items-center justify-between px-4 py-4 md:px-6 xl:px-7.5">
                  <h4 className="text-xl font-semibold text-white dark:text-white">
                    {editMode ? "Edit Category" : "Add Category"}
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

                    {/* Subcategories Section */}
                    <div>
                      <label
                        htmlFor="subCategories"
                        className="block text-sm font-medium text-white dark:text-white"
                      >
                        Subcategories
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          id="subCategory"
                          value={subCategoryInput}
                          onChange={(e) => setSubCategoryInput(e.target.value)}
                          className="w-full rounded border border-stroke bg-gray px-4.5 py-2 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white"
                        />
                        <button
                          type="button"
                          onClick={handleAddSubCategory}
                          className="rounded-md bg-primary px-4 py-2 text-white"
                        >
                          Add
                        </button>
                      </div>

                      {/* Display added subcategories */}
                      {formData.subCategories.length > 0 && (
                        <ul className="mt-2 text-white">
                          {formData.subCategories.map((subCategory, index) => (
                            <li
                              key={index}
                              className="flex items-center justify-between"
                            >
                              <span>{subCategory}</span>
                              <button
                                type="button"
                                onClick={() =>
                                  handleRemoveSubCategory(subCategory)
                                }
                                className="text-red-500 hover:underline"
                              >
                                Remove
                              </button>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </div>
                  <button
                    type="submit"
                    onClick={handleSubmit}
                    className="mt-6 w-full rounded-md bg-primary px-4 py-2 text-center font-medium text-white hover:bg-opacity-90"
                  >
                    {editMode ? "Update Category" : "Add Category"}
                  </button>
                </form>
              </Modal>
            </div>
          </div>

          {/* Desktop Table Layout */}
          <div className="hidden sm:block">
            <div className="grid grid-cols-10 border-t border-stroke px-4 py-4.5 dark:border-strokedark md:px-6 2xl:px-7.5">
              <div className="col-span-2 flex items-center">
                <p className="font-medium">Category Name</p>
              </div>
              <div className="col-span-2 flex items-center">
                <p className="font-medium">Sub Categories</p>
              </div>
              <div className="col-span-2 flex items-center">
                <p className="font-medium">Products</p>
              </div>
              <div className="col-span-2 flex items-center">
                <p className="font-medium">Created On</p>
              </div>
              <div className="col-span-2 flex items-center justify-end">
                <p className="font-medium">Actions</p>
              </div>
            </div>

            {loading ? (
              <Loader className="h-[60vh]" />
            ) : filteredCategories.length > 0 ? (
              filteredCategories.map((category, key) => (
                <div
                  className="grid grid-cols-10 border-t border-stroke px-4 py-4.5 dark:border-strokedark md:px-6 2xl:px-7.5"
                  key={key}
                >
                  <div className="col-span-2 flex items-center">
                    <p className="text-sm text-black dark:text-white">
                      {category.name}
                    </p>
                  </div>
                  <div className="col-span-2 flex items-center">
                    <p className="text-sm text-black dark:text-white">
                      {category.subCategories.length}
                    </p>
                  </div>
                  <div className="col-span-2 flex items-center">
                    <p className="text-sm text-black dark:text-white">
                      {category.products}
                    </p>
                  </div>
                  <div className="col-span-2 flex items-center">
                    <p className="text-sm text-black dark:text-white">
                      {new Date(category.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="col-span-2 flex items-center justify-end gap-2">
                    <button
                      onClick={() => {
                        setFormData({
                          name: category.name,
                          subCategories: category.subCategories,
                        });
                        setEditMode(true);
                        setId(category._id);
                        openModal();
                      }}
                      className="dark:text-white"
                    >
                      <FaEdit size={18} />
                    </button>
                    <Delete
                      api={`/category/${category._id}`}
                      message="Category deleted successfully"
                      fetch={getCategories}
                    />
                  </div>
                </div>
              ))
            ) : (
              <div className="px-4 py-6 text-center text-black dark:text-white">
                No categories found.
              </div>
            )}
          </div>

          {/* Mobile Card Layout */}
          <div className="block px-4 sm:hidden">
            {loading ? (
              <Loader className="h-[60vh]" />
            ) : filteredCategories.length > 0 ? (
              filteredCategories.map((category, key) => (
                <div
                  className="mb-4 rounded-lg border border-stroke p-4 shadow-sm dark:border-strokedark dark:bg-boxdark"
                  key={key}
                >
                  <div className="mb-4 flex items-center">
                    <div>
                      <h5 className="text-lg font-semibold text-black dark:text-white">
                        {category.name}
                      </h5>
                      <p className="text-gray-500 dark:text-gray-400 text-sm">
                        {category.subCategories.length} Subcategories
                      </p>
                      <p className="text-gray-500 dark:text-gray-400 text-sm">
                        {category.products} Products
                      </p>
                      <p className="text-gray-500 dark:text-gray-400 text-sm">
                        Created:{" "}
                        {new Date(category.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          setFormData({
                            name: category.name,
                            subCategories: category.subCategories,
                          });
                          setEditMode(true);
                          setId(category._id);
                          openModal();
                        }}
                        className="dark:text-white"
                      >
                        <FaEdit size={18} />
                      </button>
                      <Delete
                        api={`/category/${category._id}`}
                        message="Category deleted successfully"
                        fetch={getCategories}
                      />
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="px-4 py-6 text-center text-black dark:text-white">
                No categories found.
              </div>
            )}
          </div>
        </div>
      </div>
    </DefaultLayout>
  );
};

export default Categories;
