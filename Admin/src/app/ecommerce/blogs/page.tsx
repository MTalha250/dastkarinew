"use client";
import React, { useEffect, useState } from "react";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import { Editor } from "@tinymce/tinymce-react";
import { IoMdClose } from "react-icons/io";
import Modal from "react-modal";
import PhotosUploader from "@/components/Uploader";
import toast from "react-hot-toast";
import axios from "axios";
import Loader from "@/components/common/Loader";
import Delete from "@/components/Delete";
import { Blog, BlogCategory } from "@/types";
import { FaEdit } from "react-icons/fa";
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
    backgroundColor: "#1f2937", // Dark mode background color
    color: "#ffffff", // Dark mode text color
    border: "1px solid #4b5563", // Border for dark mode
  },
  overlay: {
    backgroundColor: "rgba(0, 0, 0, 0.75)",
    zIndex: 1000,
  },
};

const Blogs = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [categories, setCategories] = useState<BlogCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [id, setId] = useState<string | null>(null);
  const { token, user } = useAuthStore();

  const initialFormData = {
    author: "",
    authorImage: [] as any,
    title: "",
    titleImage: [] as any,
    description: "",
    content: "",
    category: "",
    timeToRead: "",
  };

  const [formData, setFormData] = useState(initialFormData);

  useEffect(() => {
    getBlogsAndCategories();
  }, []);

  const getBlogsAndCategories = async () => {
    try {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/blog`);
      setBlogs(res.data.blogs);
      const res2 = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/blogCategory`,
      );
      setCategories(res2.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const getBlogs = async () => {
    try {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/blog`);
      setBlogs(res.data.blogs);
    } catch (error) {
      console.error("Failed to fetch blogs:", error);
    }
  };

  const openModal = () => {
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
    setEditMode(false);
    setId(null);
    setFormData(initialFormData);
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if (
      formData.title === "" ||
      formData.description === "" ||
      formData.category === "" ||
      formData.content === "" ||
      formData.author === "" ||
      formData.timeToRead === "" ||
      formData.authorImage.length === 0 ||
      formData.titleImage.length === 0
    ) {
      toast.error("Please fill in all fields");
      return;
    }

    setLoading(true);

    try {
      if (editMode && id !== null) {
        // Update blog
        await axios.put(
          `${process.env.NEXT_PUBLIC_API_URL}/blog/${id}`,
          {
            author: formData.author,
            authorImage: formData.authorImage[0],
            title: formData.title,
            titleImage: formData.titleImage[0],
            description: formData.description,
            content: formData.content,
            category: formData.category,
            timeToRead: formData.timeToRead,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );
        toast.success("Blog updated successfully");
      } else {
        // Add new blog
        await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/blog`,
          {
            author: formData.author,
            authorImage: formData.authorImage[0],
            title: formData.title,
            titleImage: formData.titleImage[0],
            description: formData.description,
            content: formData.content,
            category: formData.category,
            timeToRead: formData.timeToRead,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );
        toast.success("Blog added successfully");
      }

      closeModal();
      getBlogs();
    } catch (error) {
      console.error("Failed to save blog:", error);
      toast.error("Failed to save blog");
    } finally {
      setLoading(false);
    }
  };

  // Filter blogs by search term
  const filteredBlogs = blogs.filter((blog) =>
    blog.title.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  if (!user?.permissions.blogs) {
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
        <Breadcrumb pageName="Blogs" />
        <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
          <div className="flex flex-col items-start justify-between px-4 py-6 sm:flex-row sm:items-center md:px-6 xl:px-7.5">
            <h4 className="mb-4 text-xl font-semibold text-black dark:text-white sm:mb-0">
              All Blogs
            </h4>
            <div className="flex w-full flex-col items-start gap-4 sm:w-auto sm:flex-row sm:items-center">
              <input
                type="text"
                placeholder="Search blogs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full rounded border border-stroke bg-gray px-4.5 py-2 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
              />
              <button
                onClick={openModal}
                className="inline-flex items-center justify-center whitespace-nowrap rounded-md bg-primary px-4 py-2 text-center font-medium text-white hover:bg-opacity-90"
              >
                Add Blog
              </button>
              <Modal
                isOpen={modalIsOpen}
                onRequestClose={closeModal}
                style={customStyles}
                contentLabel={editMode ? "Edit Blog" : "Add Blog"}
              >
                <div className="flex items-center justify-between px-4 py-4 md:px-6 xl:px-7.5">
                  <h4 className="text-xl font-semibold text-white dark:text-white">
                    {editMode ? "Edit Blog" : "Add Blog"}
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
                        htmlFor="author"
                        className="block text-sm font-medium text-white dark:text-white"
                      >
                        Author
                      </label>
                      <input
                        type="text"
                        id="author"
                        name="author"
                        value={formData.author}
                        onChange={(e) =>
                          setFormData({ ...formData, author: e.target.value })
                        }
                        className="w-full rounded border border-stroke bg-gray px-4.5 py-2 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="authorImage"
                        className="block text-sm font-medium text-white dark:text-white"
                      >
                        Author Image
                      </label>
                      <PhotosUploader
                        addedPhotos={formData.authorImage}
                        maxPhotos={1}
                        onChange={(photos: any) =>
                          setFormData({ ...formData, authorImage: photos })
                        }
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="title"
                        className="block text-sm font-medium text-white dark:text-white"
                      >
                        Title
                      </label>
                      <input
                        type="text"
                        id="title"
                        name="title"
                        value={formData.title}
                        onChange={(e) =>
                          setFormData({ ...formData, title: e.target.value })
                        }
                        className="w-full rounded border border-stroke bg-gray px-4.5 py-2 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="titleImage"
                        className="block text-sm font-medium text-white dark:text-white"
                      >
                        Title Image
                      </label>
                      <PhotosUploader
                        addedPhotos={formData.titleImage}
                        maxPhotos={1}
                        onChange={(photos: any) =>
                          setFormData({ ...formData, titleImage: photos })
                        }
                      />
                    </div>
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
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            description: e.target.value,
                          })
                        }
                        className="w-full rounded border border-stroke bg-gray px-4.5 py-2 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="content"
                        className="block text-sm font-medium text-white dark:text-white"
                      >
                        Content
                      </label>
                      <Editor
                        apiKey="g0zqs3p6v9zx7zhnrzgdphkxjcz3dvgt6kl7bxln19etxto6"
                        init={{
                          plugins:
                            "anchor autolink charmap codesample emoticons image link lists media searchreplace table visualblocks wordcount linkchecker",
                          toolbar:
                            "undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | link image media table | align lineheight | numlist bullist indent outdent | emoticons charmap | removeformat",
                        }}
                        value={formData.content}
                        onEditorChange={(content) =>
                          setFormData({ ...formData, content })
                        }
                      />
                    </div>
                    <div>
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
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            category: e.target.value,
                          })
                        }
                        className="w-full appearance-none rounded border border-stroke bg-gray px-4.5 py-2 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                      >
                        <option value="">Select Category</option>
                        {categories.map((category) => (
                          <option key={category._id} value={category.name}>
                            {category.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label
                        htmlFor="timeToRead"
                        className="block text-sm font-medium text-white dark:text-white"
                      >
                        Time to Read
                      </label>
                      <input
                        type="text"
                        id="timeToRead"
                        name="timeToRead"
                        value={formData.timeToRead}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            timeToRead: e.target.value,
                          })
                        }
                        className="w-full rounded border border-stroke bg-gray px-4.5 py-2 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                      />
                    </div>
                  </div>
                  <button
                    type="submit"
                    onClick={handleSubmit}
                    className="mt-4 w-full rounded bg-primary py-2 text-white"
                  >
                    {editMode ? "Update Blog" : "Add Blog"}
                  </button>
                </form>
              </Modal>
            </div>
          </div>
          {loading ? (
            <Loader className="h-[60vh]" />
          ) : filteredBlogs.length > 0 ? (
            <div className="grid grid-cols-1 gap-4 p-4 sm:grid-cols-2 md:grid-cols-3 md:p-6 xl:p-7.5">
              {filteredBlogs.map((blog) => (
                <div
                  key={blog._id}
                  className="rounded-md border border-stroke bg-white p-4 shadow-default dark:border-strokedark dark:bg-boxdark"
                >
                  <img
                    src={blog.titleImage}
                    alt={blog.title}
                    className="h-40 w-full rounded-md object-cover"
                  />
                  <h4 className="mt-4 text-lg font-semibold text-black dark:text-white">
                    {blog.title}
                  </h4>
                  <p className="mt-2 line-clamp-4 text-sm text-black dark:text-white">
                    {blog.description}
                  </p>
                  <div className="mt-4 flex items-center gap-4">
                    <img
                      src={blog.authorImage}
                      alt={blog.author}
                      className="h-10 w-10 rounded-full object-cover"
                    />
                    <div>
                      <p className="text-sm font-medium text-black dark:text-white">
                        {blog.author}
                      </p>
                      <p className="text-gray-600 dark:text-gray-400 text-xs">
                        {blog.timeToRead} min read
                      </p>
                    </div>
                  </div>
                  <div className="mt-4 flex items-center justify-end gap-2">
                    <button
                      onClick={() => {
                        setFormData({
                          author: blog.author,
                          authorImage: [blog.authorImage],
                          title: blog.title,
                          titleImage: [blog.titleImage],
                          description: blog.description,
                          content: blog.content,
                          category: blog.category,
                          timeToRead: blog.timeToRead,
                        });
                        setEditMode(true);
                        setId(blog._id);
                        openModal();
                      }}
                      className="dark:text-white"
                    >
                      <FaEdit size={18} />
                    </button>
                    <Delete
                      api={`/blog/${blog._id}`}
                      message="Blog deleted successfully"
                      fetch={getBlogs}
                    />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="w-full px-4 py-6 text-center text-black dark:text-white">
              No blogs found.
            </p>
          )}
        </div>
      </div>
    </DefaultLayout>
  );
};

export default Blogs;
