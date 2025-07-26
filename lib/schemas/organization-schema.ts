import * as Yup from "yup";

export const defaultValues = {
  image: null,
  name: "",
  email: "",
  phone: "",
  region: "",
  type: "",
  category: "",
  location: "",
  city: "",
  country: "",
  description: "",
  instagram: "",
  facebook: "",
  youtube: "",
  linkedin: "",
  commission: "",
  businessId: "",
  companyName: "",
  accountName: "",
  accountNumber: "",
  oib: "",
  address: "",
  postalCode: "",
  bankCity: "",
  bankCountry: "",
  galleryImages: [],
};

export const schema = Yup.object().shape({
  //  Basic Info
  image: Yup.mixed().nullable(),
  name: Yup.string().required("Organization name is required"),
  email: Yup.string().email("Invalid email"),
  phone: Yup.string(),
  region: Yup.string(),
  type: Yup.string(),
  category: Yup.string(),
  location: Yup.string().required("Location is required"),
  city: Yup.string(),
  country: Yup.string(),
  description: Yup.string(),
  galleryImages: Yup.array().nullable(),

  // Social Links
  instagram: Yup.string().url("Invalid Instagram URL").nullable().notRequired(),
  facebook: Yup.string().url("Invalid Facebook URL").nullable().notRequired(),
  youtube: Yup.string().url("Invalid YouTube URL").nullable().notRequired(),
  linkedin: Yup.string().url("Invalid LinkedIn URL").nullable().notRequired(),

  //  Business Details
  commission: Yup.string(),
  businessId: Yup.string(),

  //  Bank Details
  companyName: Yup.string(),
  accountName: Yup.string(),
  accountNumber: Yup.string(),
  oib: Yup.string(),
  address: Yup.string(),
  postalCode: Yup.string(),
  bankCity: Yup.string(),
  bankCountry: Yup.string(),
});
