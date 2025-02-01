"use client";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import { useEffect, useState } from "react";
import { FaEdit } from "react-icons/fa";
import { IoMdClose } from "react-icons/io";
import Modal from "react-modal";
import PhotosUploader from "@/components/Uploader";
import toast from "react-hot-toast";
import axios from "axios";
import Loader from "@/components/common/Loader";
import Delete from "@/components/Delete";
import { Admin, Permissions, Role } from "@/types";
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

const Admins = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [id, setId] = useState<string>("");
  const [password, setPassword] = useState("");
  const { user, token } = useAuthStore();

  const initialFormData: Admin = {
    _id: "",
    profileImage: "",
    name: "",
    username: "",
    role: Role.MODERATOR,
    permissions: {
      customers: false,
      categories: false,
      products: false,
      blogs: false,
      orders: false,
    },
    createdAt: "",
    updatedAt: "",
  };

  const [formData, setFormData] = useState<Admin>(initialFormData);

  useEffect(() => {
    getAdmins();
  }, []);

  const getAdmins = async () => {
    try {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/admin`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setAdmins(res.data);
    } catch (error) {
      console.error("Failed to fetch admins:", error);
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
    setPassword(""); // Reset password field
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if (
      !formData.profileImage ||
      !formData.name ||
      !formData.username ||
      !formData.role ||
      (!editMode && !password)
    ) {
      toast.error("Please fill in all fields");
      return;
    }

    setLoading(true);

    try {
      if (editMode && id !== null) {
        // Update admin
        await axios.put(
          `${process.env.NEXT_PUBLIC_API_URL}/admin/${id}`,
          {
            ...formData,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );
        toast.success(
          "Admin updated successfully. Changes will be reflected after the next login.",
        );
      } else {
        // Add new admin
        await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/admin`,
          {
            ...formData,
            password,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );
        toast.success("Admin added successfully");
      }

      closeModal();
      getAdmins();
    } catch (error) {
      console.error("Failed to save admin:", error);
      toast.error("Failed to save admin");
    } finally {
      setLoading(false);
    }
  };

  // Filter admins by search term
  const filteredAdmins = admins.filter((admin) =>
    admin.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  if (user?.role !== Role.ADMIN) {
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
        <Breadcrumb pageName="Admins" />
        <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
          <div className="flex flex-col items-start justify-between px-4 py-6 sm:flex-row sm:items-center md:px-6 xl:px-7.5">
            <h4 className="mb-4 text-xl font-semibold text-black dark:text-white sm:mb-0">
              All Admins
            </h4>
            <div className="flex w-full flex-col items-start gap-4 sm:w-auto sm:flex-row sm:items-center">
              <input
                type="text"
                placeholder="Search admins..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full rounded border border-stroke bg-gray px-4 py-2 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary sm:w-auto"
              />
              <button
                onClick={openModal}
                className="inline-flex items-center justify-center whitespace-nowrap rounded-md bg-primary px-4 py-2 text-center font-medium text-white hover:bg-opacity-90"
              >
                Add Admin
              </button>
              <Modal
                isOpen={modalIsOpen}
                onRequestClose={closeModal}
                style={customStyles}
                contentLabel={editMode ? "Edit Admin" : "Add Admin"}
              >
                <div className="flex items-center justify-between px-4 py-4 md:px-6 xl:px-7.5">
                  <h4 className="text-xl font-semibold text-white dark:text-white">
                    {editMode ? "Edit Admin" : "Add Admin"}
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
                        htmlFor="profile_pic"
                        className="block text-sm font-medium text-white dark:text-white"
                      >
                        Profile Picture
                      </label>
                      <PhotosUploader
                        addedPhotos={
                          formData.profileImage ? [formData.profileImage] : []
                        }
                        maxPhotos={1}
                        onChange={(photos: any) =>
                          setFormData({ ...formData, profileImage: photos[0] })
                        }
                      />
                    </div>
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
                    <div>
                      <label
                        htmlFor="username"
                        className="block text-sm font-medium text-white dark:text-white"
                      >
                        Username
                      </label>
                      <input
                        type="text"
                        id="username"
                        name="username"
                        value={formData.username}
                        onChange={(e) =>
                          setFormData({ ...formData, username: e.target.value })
                        }
                        className="w-full rounded border border-stroke bg-gray px-4.5 py-2 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="role"
                        className="block text-sm font-medium text-white dark:text-white"
                      >
                        Role
                      </label>
                      <select
                        id="role"
                        name="role"
                        value={formData.role}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            role: e.target.value as Role,
                          })
                        }
                        className="w-full appearance-none rounded border border-stroke bg-gray px-4.5 py-2 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                      >
                        <option value="admin">Admin</option>
                        <option value="moderator">Moderator</option>
                      </select>
                    </div>
                    {!editMode && (
                      <div>
                        <label
                          htmlFor="password"
                          className="block text-sm font-medium text-white dark:text-white"
                        >
                          Password
                        </label>
                        <input
                          type="password"
                          id="password"
                          name="password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="w-full rounded border border-stroke bg-gray px-4.5 py-2 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                        />
                      </div>
                    )}
                    <div>
                      <label
                        htmlFor="permissions"
                        className="block text-sm font-medium text-white dark:text-white"
                      >
                        Permissions
                      </label>
                      <div className="space-y-2">
                        {Object.keys(formData.permissions).map((permission) => (
                          <div key={permission} className="flex items-center">
                            <input
                              type="checkbox"
                              id={permission}
                              name={permission}
                              checked={
                                formData.permissions[
                                  permission as keyof Permissions
                                ] as boolean
                              }
                              onChange={() =>
                                setFormData({
                                  ...formData,
                                  permissions: {
                                    ...formData.permissions,
                                    [permission]:
                                      !formData.permissions[
                                        permission as keyof Permissions
                                      ],
                                  },
                                })
                              }
                              className="border-gray-300 h-4 w-4 rounded text-primary focus:ring-primary dark:border-strokedark dark:bg-meta-4 dark:focus:ring-primary"
                            />
                            <label
                              htmlFor={permission}
                              className="ml-2 text-sm font-medium text-white dark:text-white"
                            >
                              {permission}
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  <button
                    type="submit"
                    onClick={handleSubmit}
                    className="mt-6 w-full rounded-md bg-primary px-4 py-2 text-center font-medium text-white hover:bg-opacity-90"
                  >
                    {editMode ? "Update Admin" : "Add Admin"}
                  </button>
                </form>
              </Modal>
            </div>
          </div>

          {/* Desktop Table Layout */}
          <div className="hidden sm:block">
            <div className="grid grid-cols-9 border-t border-stroke px-4 py-4.5 dark:border-strokedark md:px-6 2xl:px-7.5">
              <div className="col-span-2 flex items-center">
                <p className="font-medium text-black dark:text-white">
                  Profile Picture
                </p>
              </div>
              <div className="col-span-2 flex items-center">
                <p className="font-medium text-black dark:text-white">Name</p>
              </div>
              <div className="col-span-2 flex items-center">
                <p className="font-medium text-black dark:text-white">
                  Username
                </p>
              </div>
              <div className="col-span-2 flex items-center">
                <p className="font-medium text-black dark:text-white">Role</p>
              </div>
              <div className="col-span-1 flex items-center justify-end">
                <p className="font-medium text-black dark:text-white">
                  Actions
                </p>
              </div>
            </div>

            {loading ? (
              <Loader className="h-[60vh]" />
            ) : filteredAdmins.length > 0 ? (
              filteredAdmins.map((admin) => (
                <div
                  key={admin._id}
                  className="grid grid-cols-9 items-center border-t border-stroke px-4 py-4.5 dark:border-strokedark md:px-6 2xl:px-7.5"
                >
                  <div className="col-span-2 flex items-center">
                    <img
                      src={admin.profileImage}
                      alt={admin.name}
                      className="h-12 w-12 rounded-full object-cover"
                    />
                  </div>
                  <div className="col-span-2">
                    <p className="text-sm text-black dark:text-white">
                      {admin.name}
                    </p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-sm text-black dark:text-white">
                      {admin.username}
                    </p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-sm text-black dark:text-white">
                      {admin.role[0].toUpperCase() + admin.role.slice(1)}
                    </p>
                  </div>
                  <div className="col-span-1 flex items-center justify-end gap-2">
                    <button
                      onClick={() => {
                        setFormData({
                          name: admin.name,
                          username: admin.username,
                          role: admin.role,
                          profileImage: admin.profileImage,
                          permissions: admin.permissions,
                          createdAt: admin.createdAt,
                          updatedAt: admin.updatedAt,
                          _id: admin._id,
                        });
                        setPassword(""); // Reset the password field when editing
                        setEditMode(true);
                        setId(admin._id);
                        openModal();
                      }}
                      className="dark:text-white"
                    >
                      <FaEdit size={18} />
                    </button>
                    <Delete
                      api={`/admin/${admin._id}`}
                      message="Admin deleted successfully"
                      fetch={getAdmins}
                    />
                  </div>
                </div>
              ))
            ) : (
              <div className="px-4 py-6 text-center text-black dark:text-white">
                No admins found.
              </div>
            )}
          </div>

          {/* Mobile Card Layout */}
          <div className="block px-4 sm:hidden">
            {loading ? (
              <Loader className="h-[60vh]" />
            ) : filteredAdmins.length > 0 ? (
              filteredAdmins.map((admin) => (
                <div
                  key={admin._id}
                  className="mb-4 rounded-lg border border-stroke p-4 shadow-sm dark:border-strokedark dark:bg-boxdark"
                >
                  <div className="mb-4 flex flex-col">
                    <img
                      src={admin.profileImage}
                      alt={admin.name}
                      className="h-12 w-12 rounded-full object-cover"
                    />
                    <div className="mt-4">
                      <p className="text-sm text-black dark:text-white">
                        {admin.name}
                      </p>
                      <p className="text-sm text-black dark:text-white">
                        Username: {admin.username}
                      </p>
                      <p className="text-sm text-black dark:text-white">
                        Role:{" "}
                        {admin.role[0].toUpperCase() + admin.role.slice(1)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          setFormData({
                            name: admin.name,
                            username: admin.username,
                            role: admin.role,
                            profileImage: admin.profileImage,
                            permissions: admin.permissions,
                            createdAt: admin.createdAt,
                            updatedAt: admin.updatedAt,
                            _id: admin._id,
                          });
                          setPassword(""); // Reset the password field when editing
                          setEditMode(true);
                          setId(admin._id);
                          openModal();
                        }}
                        className="dark:text-white"
                      >
                        <FaEdit size={18} />
                      </button>
                      <Delete
                        api={`/admin/${admin._id}`}
                        message="Admin deleted successfully"
                        fetch={getAdmins}
                      />
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="px-4 py-6 text-center text-black dark:text-white">
                No admins found.
              </div>
            )}
          </div>
        </div>
      </div>
    </DefaultLayout>
  );
};

export default Admins;
