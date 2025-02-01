"use client";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { useState, useEffect } from "react";
import useAuthStore from "@/store/authStore";
import axios from "axios";
import toast from "react-hot-toast";
import { ContactInfo } from "@/types";

const ContactInfoPage = () => {
  const { token } = useAuthStore();
  const [contactInfo, setContactInfo] = useState<ContactInfo>({
    email: "",
    phone: "",
    whatsapp: "",
    address: "",
    facebook: "",
    instagram: "",
    linkedin: "",
    map: "",
  });

  useEffect(() => {
    getContactInfo();
  }, []);

  const getContactInfo = async () => {
    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/contactInfo`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      setContactInfo(res.data);
    } catch (error) {
      console.error("Failed to fetch contact info:", error);
    }
  };

  const handleInputChange = (e: any) => {
    const { name, value } = e.target;
    setContactInfo((prevInfo) => ({
      ...prevInfo,
      [name]: value,
    }));
  };

  const handleSaveChanges = async (e: any) => {
    e.preventDefault();
    try {
      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/contactInfo`,
        contactInfo,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      toast.success(
        response.data.message || "Contact info updated successfully",
      );
    } catch (error) {
      toast.error("Failed to update contact info");
    }
  };

  return (
    <DefaultLayout>
      <div className="relative mx-auto min-h-screen max-w-270">
        <Breadcrumb pageName="Contact Info" />
        <div className="rounded-sm border border-stroke bg-white p-7 shadow-default dark:border-strokedark dark:bg-boxdark">
          <h3 className="mb-6 text-xl font-semibold text-black dark:text-white">
            Update Contact Information
          </h3>
          <form onSubmit={handleSaveChanges}>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div>
                <label
                  className="block text-sm font-medium text-black dark:text-white"
                  htmlFor="email"
                >
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={contactInfo?.email}
                  onChange={handleInputChange}
                  className="w-full rounded border border-stroke bg-gray px-4 py-3 text-black dark:border-strokedark dark:bg-meta-4 dark:text-white"
                />
              </div>

              <div>
                <label
                  className="block text-sm font-medium text-black dark:text-white"
                  htmlFor="phone"
                >
                  Phone
                </label>
                <input
                  type="text"
                  name="phone"
                  value={contactInfo?.phone}
                  onChange={handleInputChange}
                  className="w-full rounded border border-stroke bg-gray px-4 py-3 text-black dark:border-strokedark dark:bg-meta-4 dark:text-white"
                />
              </div>

              <div>
                <label
                  className="block text-sm font-medium text-black dark:text-white"
                  htmlFor="whatsapp"
                >
                  WhatsApp
                </label>
                <input
                  type="text"
                  name="whatsapp"
                  value={contactInfo?.whatsapp}
                  onChange={handleInputChange}
                  className="w-full rounded border border-stroke bg-gray px-4 py-3 text-black dark:border-strokedark dark:bg-meta-4 dark:text-white"
                />
              </div>

              <div>
                <label
                  className="block text-sm font-medium text-black dark:text-white"
                  htmlFor="address"
                >
                  Address
                </label>
                <input
                  type="text"
                  name="address"
                  value={contactInfo?.address}
                  onChange={handleInputChange}
                  className="w-full rounded border border-stroke bg-gray px-4 py-3 text-black dark:border-strokedark dark:bg-meta-4 dark:text-white"
                />
              </div>

              <div>
                <label
                  className="block text-sm font-medium text-black dark:text-white"
                  htmlFor="facebook"
                >
                  Facebook
                </label>
                <input
                  type="text"
                  name="facebook"
                  value={contactInfo?.facebook}
                  onChange={handleInputChange}
                  className="w-full rounded border border-stroke bg-gray px-4 py-3 text-black dark:border-strokedark dark:bg-meta-4 dark:text-white"
                />
              </div>

              <div>
                <label
                  className="block text-sm font-medium text-black dark:text-white"
                  htmlFor="instagram"
                >
                  Instagram
                </label>
                <input
                  type="text"
                  name="instagram"
                  value={contactInfo?.instagram}
                  onChange={handleInputChange}
                  className="w-full rounded border border-stroke bg-gray px-4 py-3 text-black dark:border-strokedark dark:bg-meta-4 dark:text-white"
                />
              </div>

              <div>
                <label
                  className="block text-sm font-medium text-black dark:text-white"
                  htmlFor="linkedin"
                >
                  LinkedIn
                </label>
                <input
                  type="text"
                  name="linkedin"
                  value={contactInfo?.linkedin}
                  onChange={handleInputChange}
                  className="w-full rounded border border-stroke bg-gray px-4 py-3 text-black dark:border-strokedark dark:bg-meta-4 dark:text-white"
                />
              </div>

              <div>
                <label
                  className="block text-sm font-medium text-black dark:text-white"
                  htmlFor="map"
                >
                  Map URL
                </label>
                <input
                  type="text"
                  name="map"
                  value={contactInfo.map}
                  onChange={handleInputChange}
                  className="w-full rounded border border-stroke bg-gray px-4 py-3 text-black dark:border-strokedark dark:bg-meta-4 dark:text-white"
                />
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                type="submit"
                className="rounded bg-primary px-6 py-2 text-white hover:bg-opacity-90"
              >
                Save Changes
              </button>
            </div>
          </form>
        </div>
      </div>
    </DefaultLayout>
  );
};

export default ContactInfoPage;
