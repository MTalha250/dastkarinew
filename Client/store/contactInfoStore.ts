import { create } from "zustand";
import { ContactInfo } from "@/types";
import axios from "axios";

type ContactInfoStore = {
  contactInfo: ContactInfo | null;
  fetchContactInfo: () => void;
};

export const useContactInfoStore = create<ContactInfoStore>((set) => ({
  contactInfo: null,
  fetchContactInfo: async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/contactInfo`
      );
      set({ contactInfo: response.data });
    } catch (error) {
      console.log(error);
    }
  },
}));
