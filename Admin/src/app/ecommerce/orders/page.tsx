"use client";
import React, { useEffect, useState } from "react";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import { FaEye } from "react-icons/fa";
import { IoMdClose } from "react-icons/io";
import { Order, OrderStatus } from "@/types";
import axios from "axios";
import useAuthStore from "@/store/authStore";
import Modal from "react-modal";
import Loader from "@/components/common/Loader";
import Delete from "@/components/Delete";
import toast from "react-hot-toast";

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

const OrdersPage = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [zoomImage, setZoomImage] = useState<string | null>(null); // State to track zoom image
  const [searchTerm, setSearchTerm] = useState(""); // State for search input
  const { token, user } = useAuthStore();

  const fetchOrders = async () => {
    try {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/order`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setOrders(res.data);
    } catch (error) {
      console.error("Failed to fetch orders:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // Handle modal opening to view order details
  const openModal = (order: Order) => {
    setSelectedOrder(order);
    setModalIsOpen(true);
  };

  // Handle modal close
  const closeModal = () => {
    setModalIsOpen(false);
    setSelectedOrder(null);
  };

  // Handle status update
  const handleStatusChange = async (orderId: string, newStatus: string) => {
    try {
      await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/order/${orderId}`,
        { status: newStatus },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      toast.success("Order status updated successfully");
      fetchOrders(); // Refresh the orders list
    } catch (error) {
      console.error("Failed to update order status:", error);
      toast.error("Failed to update order status");
    }
  };

  // Filtered orders based on search input
  const filteredOrders = orders.filter(
    (order) =>
      order.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.email.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  if (!user?.permissions.orders) {
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
        <Breadcrumb pageName="Orders" />

        <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
          <div className="flex flex-col items-start justify-between px-4 py-6 sm:flex-row sm:items-center md:px-6 xl:px-7.5">
            <h4 className="mb-4 text-xl font-semibold text-black dark:text-white sm:mb-0">
              All Orders
            </h4>
            <input
              type="text"
              placeholder="Search orders..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded border border-stroke bg-gray px-4 py-2 text-black focus:border-primary dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary sm:w-auto"
            />
          </div>

          {/* Desktop Table Layout */}
          <div className="hidden sm:block">
            <div className="grid grid-cols-10 gap-4 border-t border-stroke px-4 py-4.5 dark:border-strokedark md:px-6 2xl:px-7.5">
              <div className="col-span-2">
                <p className="font-medium text-black dark:text-white">
                  Order Id
                </p>
              </div>
              <div className="col-span-3">
                <p className="font-medium text-black dark:text-white">
                  Customer
                </p>
              </div>
              <div className="col-span-2">
                <p className="font-medium text-black dark:text-white">
                  Total Amount
                </p>
              </div>
              <div className="col-span-2">
                <p className="font-medium text-black dark:text-white">Status</p>
              </div>
              <div className="col-span-1 flex items-center justify-end">
                <p className="font-medium text-black dark:text-white">
                  Actions
                </p>
              </div>
            </div>

            {loading ? (
              <Loader className="h-[60vh]" />
            ) : filteredOrders.length > 0 ? (
              filteredOrders.map((order) => (
                <div
                  key={order._id}
                  className="grid grid-cols-10 items-center gap-4 border-t border-stroke px-4 py-4.5 dark:border-strokedark md:px-6 2xl:px-7.5"
                >
                  <div className="col-span-2">
                    <p className="text-sm text-black dark:text-white">
                      {order._id}
                    </p>
                  </div>
                  <div className="col-span-3">
                    <p className="text-sm text-black dark:text-white">
                      {order.name} ({order.email})
                    </p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-sm text-black dark:text-white">
                      PKR {order.total}
                    </p>
                  </div>
                  <div className="col-span-2">
                    <select
                      value={order.status}
                      onChange={(e) =>
                        handleStatusChange(order._id, e.target.value)
                      }
                      className="w-full appearance-none rounded border border-stroke bg-gray px-4 py-2 text-black focus:border-primary dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                    >
                      <option value={OrderStatus.PENDING}>Pending</option>
                      <option value={OrderStatus.PROCESSING}>Processing</option>
                      <option value={OrderStatus.COMPLETED}>Completed</option>
                      <option value={OrderStatus.CANCELLED}>Cancelled</option>
                    </select>
                  </div>
                  <div className="col-span-1 flex items-center justify-end gap-2">
                    <button
                      onClick={() => openModal(order)}
                      className="dark:text-white"
                    >
                      <FaEye size={18} />
                    </button>
                    <Delete
                      api={`/order/${order._id}`}
                      message="Order deleted successfully"
                      fetch={fetchOrders}
                    />
                  </div>
                </div>
              ))
            ) : (
              <div className="px-4 py-6 text-center text-black dark:text-white">
                No orders found.
              </div>
            )}
          </div>

          {/* Mobile Card Layout */}
          <div className="block px-4 sm:hidden">
            {loading ? (
              <Loader className="h-[60vh]" />
            ) : filteredOrders.length > 0 ? (
              filteredOrders.map((order) => (
                <div
                  key={order._id}
                  className="mb-4 rounded-lg border border-stroke p-4 shadow-sm dark:border-strokedark dark:bg-boxdark"
                >
                  <div className="mb-4 flex items-center justify-between">
                    <div>
                      <p className="text-sm text-black dark:text-white">
                        Order Id: {order._id}
                      </p>
                      <p className="text-sm text-black dark:text-white">
                        Customer: {order.name} ({order.email})
                      </p>
                      <p className="text-sm text-black dark:text-white">
                        Total: PKR {order.total}
                      </p>
                      <p className="text-sm text-black dark:text-white">
                        Status: {order.status}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => openModal(order)}
                        className="dark:text-white"
                      >
                        <FaEye size={18} />
                      </button>
                      <Delete
                        api={`/order/${order._id}`}
                        message="Order deleted successfully"
                        fetch={fetchOrders}
                      />
                    </div>
                  </div>
                  <select
                    value={order.status}
                    onChange={(e) =>
                      handleStatusChange(order._id, e.target.value)
                    }
                    className="w-full appearance-none rounded border border-stroke bg-gray px-4 py-2 text-black focus:border-primary dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                  >
                    <option value={OrderStatus.PENDING}>Pending</option>
                    <option value={OrderStatus.PROCESSING}>Processing</option>
                    <option value={OrderStatus.COMPLETED}>Completed</option>
                    <option value={OrderStatus.CANCELLED}>Cancelled</option>
                  </select>
                </div>
              ))
            ) : (
              <div className="px-4 py-6 text-center text-black dark:text-white">
                No orders found.
              </div>
            )}
          </div>
        </div>

        {selectedOrder && (
          <Modal
            isOpen={modalIsOpen}
            onRequestClose={closeModal}
            style={customStyles}
            contentLabel="Order Details"
          >
            <div className="border-gray-600 flex items-center justify-between border-b pb-4">
              <h4 className="text-2xl font-bold text-white">Order Details</h4>
              <button
                onClick={closeModal}
                className="text-gray-400 transition duration-300 ease-in-out hover:text-white"
              >
                <IoMdClose size={24} />
              </button>
            </div>
            <div className="space-y-5 px-4 py-5">
              <p className="text-gray-300">
                <strong className="text-gray-100">Order Id:</strong>{" "}
                {selectedOrder._id}
              </p>
              <p className="text-gray-300">
                <strong className="text-gray-100">Customer Name:</strong>{" "}
                {selectedOrder.name}
              </p>
              <p className="text-gray-300">
                <strong className="text-gray-100">Email:</strong>{" "}
                {selectedOrder.email}
              </p>
              <p className="text-gray-300">
                <strong className="text-gray-100">Phone:</strong>{" "}
                {selectedOrder.phone}
              </p>
              <p className="text-gray-300">
                <strong className="text-gray-100">Shipping Address:</strong>{" "}
                {selectedOrder.shippingAddress.address},{" "}
                {selectedOrder.shippingAddress.city},{" "}
                {selectedOrder.shippingAddress.country},{" "}
                {selectedOrder.shippingAddress.postalCode}
              </p>
              <p className="text-gray-300">
                <strong className="text-gray-100">Subtotal:</strong> PKR{" "}
                {selectedOrder.subTotal}
              </p>
              <p className="text-gray-300">
                <strong className="text-gray-100">Delivery:</strong> PKR{" "}
                {selectedOrder.delivery === 0 ? "Free" : selectedOrder.delivery}
              </p>
              <p className="text-gray-300">
                <strong className="text-gray-100">Total:</strong> PKR{" "}
                {selectedOrder.total}
              </p>
              <p className="text-gray-300">
                <strong className="text-gray-100">Payment Method:</strong>{" "}
                {selectedOrder.paymentMethod}
              </p>

              {selectedOrder.paymentMethod === "bank" && (
                <div className="flex flex-col">
                  <p className="text-gray-300">
                    <strong className="text-gray-100">Payment Receipt:</strong>
                  </p>
                  <div
                    className="mt-2 h-40 w-40 cursor-pointer overflow-hidden rounded-lg"
                    onClick={() => setZoomImage(selectedOrder.paymentReceipt)} // Set zoom image when clicked
                  >
                    <img
                      src={selectedOrder.paymentReceipt}
                      alt={selectedOrder._id}
                      className="h-full w-full object-contain"
                    />
                  </div>
                </div>
              )}

              <p className="text-gray-300">
                <strong className="text-gray-100">Order Items:</strong>
              </p>
              <ul className="space-y-3">
                {selectedOrder.order.map((item, index) => (
                  <li
                    key={index}
                    className="flex items-center justify-between rounded-lg bg-boxdark p-3 shadow-md transition-all duration-300 ease-in-out"
                  >
                    <span>{item.name}</span>
                    <span className="text-gray-400 text-sm">
                      (Qty: {item.quantity})
                    </span>
                    <span className="text-gray-400 text-sm">
                      (Size: {item.size})
                    </span>
                    <span className="text-gray-400 text-sm">
                      (Color: {item.color})
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </Modal>
        )}

        {/* Zoom Modal */}
        {zoomImage && (
          <Modal
            isOpen={!!zoomImage}
            onRequestClose={() => setZoomImage(null)}
            style={{
              content: {
                top: "50%",
                left: "50%",
                right: "auto",
                bottom: "auto",
                marginRight: "-50%",
                transform: "translate(-50%, -50%)",
                backgroundColor: "transparent",
                border: "none",
                zIndex: 1000,
              },
              overlay: {
                backgroundColor: "rgba(0, 0, 0, 0.9)",
                zIndex: 1000,
              },
            }}
            contentLabel="Zoomed Image"
          >
            <div className="flex justify-end">
              <button
                onClick={() => setZoomImage(null)}
                className="p-2 text-white"
              >
                <IoMdClose size={30} />
              </button>
            </div>
            <div className="flex items-center justify-center">
              <img
                src={zoomImage}
                alt="Zoomed"
                className="max-h-screen max-w-full object-contain"
              />
            </div>
          </Modal>
        )}
      </div>
    </DefaultLayout>
  );
};

export default OrdersPage;
