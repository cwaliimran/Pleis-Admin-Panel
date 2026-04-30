import { validateCroatianIBAN } from "@/lib/validators";
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
  accountNumber: Yup.string()
    .optional()
    .test('croatian-iban', 'Invalid IBAN', function (value) {
      if (!value) return true;
      const iban = value.replace(/\s/g, '').toUpperCase();
      if (!iban.startsWith('HR'))
        return this.createError({ message: 'Bank Account Number must be an IBAN starting with HR' });
      if (iban.length !== 21)
        return this.createError({ message: `IBAN must be exactly 21 characters (got ${iban.length})` });
      if (!validateCroatianIBAN(value))
        return this.createError({ message: 'Invalid IBAN: check digits do not match (MOD 97 failed)' });
      return true;
    }),
  oib: Yup.string(),
  address: Yup.string(),
  postalCode: Yup.string(),
  bankCity: Yup.string(),
  bankCountry: Yup.string(),
});
