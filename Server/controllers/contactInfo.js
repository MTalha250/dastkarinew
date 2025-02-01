import ContactInfo from "../models/contactInfo.js";

export const getContactInfo = async (req, res) => {
  try {
    const contactInfo = await ContactInfo.findOne();
    res.status(200).json(contactInfo);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const updateContactInfo = async (req, res) => {
  const {
    email,
    phone,
    whatsapp,
    address,
    facebook,
    instagram,
    linkedin,
    map,
  } = req.body;
  try {
    const contactInfo = await ContactInfo.findOneAndUpdate(
      {},
      {
        email,
        phone,
        whatsapp,
        address,
        facebook,
        instagram,
        linkedin,
        map,
      },
      { new: true }
    );
    res
      .status(200)
      .json({ message: "Contact info updated successfully", contactInfo });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
