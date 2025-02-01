"use client";
import React, { useEffect, useState } from "react";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import { FaEye } from "react-icons/fa";
import { IoMdClose } from "react-icons/io";
import axios from "axios";
import useAuthStore from "@/store/authStore";
import Modal from "react-modal";
import Loader from "@/components/common/Loader";
import Delete from "@/components/Delete";
import toast from "react-hot-toast";

// Add type declaration for model-viewer element
declare global {
  namespace JSX {
    interface IntrinsicElements {
      'model-viewer': React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement> & {
          src?: string;
          ar?: boolean | string;
          'ar-modes'?: string;
          'camera-controls'?: boolean | string;
          'auto-rotate'?: boolean | string;
          'ios-src'?: string;
          exposure?: string;
          'shadow-intensity'?: string;
          'environment-image'?: string;
          poster?: string;
          alt?: string;
        },
        HTMLElement
      >;
    }
  }
}

interface CustomOrder {
  _id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  country: string;
  postalCode: string;
  modelUrl: string;
  prompt: string;
  paymentMethod: string;
  paymentReceipt: string;
  status: string;
  total: number;
  delivery: number;
  createdAt: string;
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
    backgroundColor: "#1f2937",
    color: "#ffffff",
    border: "1px solid #4b5563",
  },
  overlay: {
    backgroundColor: "rgba(0, 0, 0, 0.75)",
    zIndex: 1000,
  },
};

const CustomOrdersPage = () => {
  const [orders, setOrders] = useState<CustomOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<CustomOrder | null>(null);
  const [zoomImage, setZoomImage] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const { token, user } = useAuthStore();

  const fetchOrders = async () => {
    try {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/custom-order`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setOrders(res.data);
    } catch (error) {
      console.error("Failed to fetch custom orders:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const openModal = (order: CustomOrder) => {
    setSelectedOrder(order);
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
    setSelectedOrder(null);
  };

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    try {
      await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/custom-order/${orderId}`,
        { status: newStatus },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      toast.success("Order status updated successfully");
      fetchOrders();
    } catch (error) {
      console.error("Failed to update order status:", error);
      toast.error("Failed to update order status");
    }
  };

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
        <Breadcrumb pageName="Custom Orders" />

        <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
          <div className="flex flex-col items-start justify-between px-4 py-6 sm:flex-row sm:items-center md:px-6 xl:px-7.5">
            <h4 className="mb-4 text-xl font-semibold text-black dark:text-white sm:mb-0">
              All Custom Orders
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
                <p className="font-medium text-black dark:text-white">Order Id</p>
              </div>
              <div className="col-span-3">
                <p className="font-medium text-black dark:text-white">Customer</p>
              </div>
              <div className="col-span-2">
                <p className="font-medium text-black dark:text-white">Total Amount</p>
              </div>
              <div className="col-span-2">
                <p className="font-medium text-black dark:text-white">Status</p>
              </div>
              <div className="col-span-1 flex items-center justify-end">
                <p className="font-medium text-black dark:text-white">Actions</p>
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
                    <p className="text-sm text-black dark:text-white">{order._id}</p>
                  </div>
                  <div className="col-span-3">
                    <p className="text-sm text-black dark:text-white">
                      {order.name} ({order.email})
                    </p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-sm text-black dark:text-white">PKR {order.total}</p>
                  </div>
                  <div className="col-span-2">
                    <select
                      value={order.status}
                      onChange={(e) => handleStatusChange(order._id, e.target.value)}
                      className="w-full appearance-none rounded border border-stroke bg-gray px-4 py-2 text-black focus:border-primary dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                    >
                      <option value="pending">Pending</option>
                      <option value="processing">Processing</option>
                      <option value="completed">Completed</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </div>
                  <div className="col-span-1 flex items-center justify-end gap-2">
                    <button onClick={() => openModal(order)} className="dark:text-white">
                      <FaEye size={18} />
                    </button>
                    <Delete
                      api={`/custom-order/${order._id}`}
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
                      <button onClick={() => openModal(order)} className="dark:text-white">
                        <FaEye size={18} />
                      </button>
                      <Delete
                        api={`/custom-order/${order._id}`}
                        message="Order deleted successfully"
                        fetch={fetchOrders}
                      />
                    </div>
                  </div>
                  <select
                    value={order.status}
                    onChange={(e) => handleStatusChange(order._id, e.target.value)}
                    className="w-full appearance-none rounded border border-stroke bg-gray px-4 py-2 text-black focus:border-primary dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                  >
                    <option value="pending">Pending</option>
                    <option value="processing">Processing</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
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
              <h4 className="text-2xl font-bold text-white">Custom Order Details</h4>
              <button
                onClick={closeModal}
                className="text-gray-400 transition duration-300 ease-in-out hover:text-white"
              >
                <IoMdClose size={24} />
              </button>
            </div>
            <div className="space-y-5 px-4 py-5">
              <p className="text-gray-300">
                <strong className="text-gray-100">Order Id:</strong> {selectedOrder._id}
              </p>
              <p className="text-gray-300">
                <strong className="text-gray-100">Customer Name:</strong>{" "}
                {selectedOrder.name}
              </p>
              <p className="text-gray-300">
                <strong className="text-gray-100">Email:</strong> {selectedOrder.email}
              </p>
              <p className="text-gray-300">
                <strong className="text-gray-100">Phone:</strong> {selectedOrder.phone}
              </p>
              <p className="text-gray-300">
                <strong className="text-gray-100">Shipping Address:</strong>{" "}
                {selectedOrder.address}, {selectedOrder.city}, {selectedOrder.country},{" "}
                {selectedOrder.postalCode}
              </p>
              <p className="text-gray-300">
                <strong className="text-gray-100">Model Description:</strong>{" "}
                {selectedOrder.prompt}
              </p>
              <div className="flex flex-col">
                <p className="text-gray-300">
                  <strong className="text-gray-100">3D Model Preview:</strong>
                </p>
                <div className="mt-2 h-40 w-40 overflow-hidden rounded-lg">
                  <a href={selectedOrder.modelUrl} target="_blank">
                   3D Model
                  </a>
                </div>
              </div>
              <p className="text-gray-300">
                <strong className="text-gray-100">Total:</strong> PKR{" "}
                {selectedOrder.total}
              </p>
              <p className="text-gray-300">
                <strong className="text-gray-100">Delivery:</strong>{" "}
                {selectedOrder.delivery === 0 ? "Free" : `PKR ${selectedOrder.delivery}`}
              </p>
              <p className="text-gray-300">
                <strong className="text-gray-100">Payment Method:</strong>{" "}
                {selectedOrder.paymentMethod}
              </p>

              {selectedOrder.paymentMethod === "bank" && selectedOrder.paymentReceipt && (
                <div className="flex flex-col">
                  <p className="text-gray-300">
                    <strong className="text-gray-100">Payment Receipt:</strong>
                  </p>
                  <div
                    className="mt-2 h-40 w-40 cursor-pointer overflow-hidden rounded-lg"
                    onClick={() => setZoomImage(selectedOrder.paymentReceipt)}
                  >
                    <img
                      src={selectedOrder.paymentReceipt}
                      alt="Payment Receipt"
                      className="h-full w-full object-contain"
                    />
                  </div>
                </div>
              )}
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
              <button onClick={() => setZoomImage(null)} className="p-2 text-white">
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

export default CustomOrdersPage; 