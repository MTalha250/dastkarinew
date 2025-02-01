"use client";
import React, { useState } from "react";
import Modal from "react-modal";
import axios from "axios";
import { FaTrashAlt } from "react-icons/fa";
import toast from "react-hot-toast";
import useAuthStore from "@/store/authStore";

interface Props {
  api: string;
  children?: React.ReactNode;
  fetch?: () => void;
  message?: string;
}

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
    padding: "20px",
    borderRadius: "8px",
  },
  overlay: {
    backgroundColor: "rgba(0, 0, 0, 0.75)",
    zIndex: 1000,
  },
};

const Delete = ({ api, children, fetch, message }: Props) => {
  const { token } = useAuthStore();
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const openModal = () => {
    setModalIsOpen(true);
  };
  const closeModal = () => {
    setModalIsOpen(false);
  };

  const handleDelete = async () => {
    try {
      await axios.delete(process.env.NEXT_PUBLIC_API_URL + api, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      toast.success(message || "Deleted successfully");
      fetch && fetch();
      closeModal();
    } catch (error) {
      console.log(error);
      toast.error("Failed to delete");
    }
  };

  return (
    <>
      {children ? (
        <button
          onClick={openModal}
          className="text-red-600 hover:text-red-800 transition-colors"
        >
          {children}
        </button>
      ) : (
        <button onClick={openModal} className="dark:text-white">
          <FaTrashAlt size={18} />
        </button>
      )}
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        style={customStyles}
        contentLabel="Delete Modal"
      >
        <div className="space-y-6 p-4 sm:p-6">
          <h2 className="text-2xl font-semibold text-[#ffffff]">
            Confirm Deletion
          </h2>
          <p className="text-base text-[#d1d5db]">
            Are you sure you want to delete this item? This action cannot be
            undone.
          </p>
          <div className="mt-8 flex justify-end gap-3">
            <button
              onClick={closeModal}
              className="rounded-md bg-[#4b5563] px-5 py-2.5 text-sm font-semibold text-white transition-colors duration-200 ease-in-out hover:bg-[#374151]"
            >
              Cancel
            </button>
            <button
              onClick={handleDelete}
              className="rounded-md bg-[#ef4444] px-5 py-2.5 text-sm font-semibold text-white shadow-md transition-colors duration-200 ease-in-out hover:bg-[#dc2626]"
            >
              Delete
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default Delete;
