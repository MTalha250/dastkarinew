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
import useAuthStore from "@/store/authStore";
import { FAQ } from "@/types";

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

const FAQs = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [id, setId] = useState<string>("");
  const { token } = useAuthStore();

  const initialFormData = {
    question: "",
    answer: "",
  };

  const [formData, setFormData] = useState(initialFormData);

  useEffect(() => {
    getFaqs();
  }, []);

  const getFaqs = async () => {
    try {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/faq`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setFaqs(res.data);
    } catch (error) {
      console.error("Failed to fetch FAQs:", error);
    } finally {
      setLoading(false);
    }
  };

  const openModal = () => {
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
    setEditMode(false);
    setId("");
    setFormData(initialFormData);
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if (!formData.question || !formData.answer) {
      toast.error("Please fill in all fields");
      return;
    }

    setLoading(true);

    try {
      if (editMode && id) {
        await axios.put(
          `${process.env.NEXT_PUBLIC_API_URL}/faq/${id}`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );
        toast.success("FAQ updated successfully.");
      } else {
        await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/faq`, formData, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        toast.success("FAQ added successfully");
      }

      closeModal();
      getFaqs();
    } catch (error) {
      console.error("Failed to save FAQ:", error);
      toast.error("Failed to save FAQ");
    } finally {
      setLoading(false);
    }
  };

  const filteredFaqs = faqs.filter((faq: any) =>
    faq.question.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <DefaultLayout>
      <div className="relative mx-auto min-h-screen max-w-270">
        <Breadcrumb pageName="FAQs" />
        <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
          <div className="flex flex-col items-start justify-between px-4 py-6 sm:flex-row sm:items-center md:px-6 xl:px-7.5">
            <h4 className="mb-4 text-xl font-semibold text-black dark:text-white sm:mb-0">
              All FAQs
            </h4>
            <div className="flex w-full flex-col items-start gap-4 sm:w-auto sm:flex-row sm:items-center">
              <input
                type="text"
                placeholder="Search FAQs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full rounded border border-stroke bg-gray px-4 py-2 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary sm:w-auto"
              />
              <button
                onClick={openModal}
                className="inline-flex items-center justify-center whitespace-nowrap rounded-md bg-primary px-4 py-2 text-center font-medium text-white hover:bg-opacity-90"
              >
                Add FAQ
              </button>
              <Modal
                isOpen={modalIsOpen}
                onRequestClose={closeModal}
                style={customStyles}
                contentLabel={editMode ? "Edit FAQ" : "Add FAQ"}
              >
                <div className="flex items-center justify-between px-4 py-4 md:px-6 xl:px-7.5">
                  <h4 className="text-xl font-semibold text-white dark:text-white">
                    {editMode ? "Edit FAQ" : "Add FAQ"}
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
                        htmlFor="question"
                        className="block text-sm font-medium text-white dark:text-white"
                      >
                        Question
                      </label>
                      <input
                        type="text"
                        id="question"
                        name="question"
                        value={formData.question}
                        onChange={(e) =>
                          setFormData({ ...formData, question: e.target.value })
                        }
                        className="w-full rounded border border-stroke bg-gray px-4.5 py-2 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="answer"
                        className="block text-sm font-medium text-white dark:text-white"
                      >
                        Answer
                      </label>
                      <textarea
                        id="answer"
                        name="answer"
                        value={formData.answer}
                        onChange={(e) =>
                          setFormData({ ...formData, answer: e.target.value })
                        }
                        className="w-full rounded border border-stroke bg-gray px-4.5 py-2 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                      ></textarea>
                    </div>
                  </div>
                  <button
                    type="submit"
                    onClick={handleSubmit}
                    className="mt-6 w-full rounded-md bg-primary px-4 py-2 text-center font-medium text-white hover:bg-opacity-90"
                  >
                    {editMode ? "Update FAQ" : "Add FAQ"}
                  </button>
                </form>
              </Modal>
            </div>
          </div>

          {/* Desktop Table Layout */}
          <div className="hidden sm:block">
            <div className="grid grid-cols-12 border-t border-stroke px-4 py-4.5 dark:border-strokedark md:px-6 2xl:px-7.5">
              <div className="col-span-5 flex items-center">
                <p className="font-medium text-black dark:text-white">
                  Question
                </p>
              </div>
              <div className="col-span-5 flex items-center">
                <p className="font-medium text-black dark:text-white">Answer</p>
              </div>
              <div className="col-span-2 flex items-center justify-end">
                <p className="font-medium text-black dark:text-white">
                  Actions
                </p>
              </div>
            </div>

            {loading ? (
              <Loader className="h-[60vh]" />
            ) : filteredFaqs.length > 0 ? (
              filteredFaqs.map((faq: any) => (
                <div
                  key={faq._id}
                  className="grid grid-cols-12 items-center border-t border-stroke px-4 py-4.5 dark:border-strokedark md:px-6 2xl:px-7.5"
                >
                  <div className="col-span-5">
                    <p className="text-sm text-black dark:text-white">
                      {faq.question}
                    </p>
                  </div>
                  <div className="col-span-5">
                    <p className="text-sm text-black dark:text-white">
                      {faq.answer}
                    </p>
                  </div>
                  <div className="col-span-2 flex items-center justify-end gap-2">
                    <button
                      onClick={() => {
                        setFormData({
                          question: faq.question,
                          answer: faq.answer,
                        });
                        setEditMode(true);
                        setId(faq._id);
                        openModal();
                      }}
                      className="dark:text-white"
                    >
                      <FaEdit size={18} />
                    </button>
                    <Delete
                      api={`/faq/${faq._id}`}
                      message="FAQ deleted successfully"
                      fetch={getFaqs}
                    />
                  </div>
                </div>
              ))
            ) : (
              <div className="px-4 py-6 text-center text-black dark:text-white">
                No FAQs found.
              </div>
            )}
          </div>

          {/* Mobile Card Layout */}
          <div className="block px-4 sm:hidden">
            {loading ? (
              <Loader className="h-[60vh]" />
            ) : filteredFaqs.length > 0 ? (
              filteredFaqs.map((faq: any) => (
                <div
                  key={faq._id}
                  className="mb-4 rounded-lg border border-stroke p-4 shadow-sm dark:border-strokedark dark:bg-boxdark"
                >
                  <div className="mb-4 flex flex-col">
                    <div className="mt-4">
                      <p className="text-sm text-black dark:text-white">
                        {faq.question}
                      </p>
                      <p className="text-sm text-black dark:text-white">
                        Answer: {faq.answer}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          setFormData({
                            question: faq.question,
                            answer: faq.answer,
                          });
                          setEditMode(true);
                          setId(faq._id);
                          openModal();
                        }}
                        className="dark:text-white"
                      >
                        <FaEdit size={18} />
                      </button>
                      <Delete
                        api={`/faq/${faq._id}`}
                        message="FAQ deleted successfully"
                        fetch={getFaqs}
                      />
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="px-4 py-6 text-center text-black dark:text-white">
                No FAQs found.
              </div>
            )}
          </div>
        </div>
      </div>
    </DefaultLayout>
  );
};

export default FAQs;
