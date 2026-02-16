// validation.ts
import * as Yup from 'yup';

type RoleKey = 'admin' | 'organizer' | 'manager' | 'staff' | 'guest' | 'user';

export const generateValidationSchema = (role: RoleKey, isEdit: boolean = false) => {
  const common = {
    image: Yup.mixed().nullable(),
    firstName: Yup.string().required('First Name is required'),
    lastName: Yup.string().required('Last Name is required'),
    email: Yup.string()
      .email('Invalid email')
      .required('Email is required')
      .transform((value) => (value ? value.toLowerCase() : value)),
    phone: Yup.string().required('Phone is required'),
    phoneCode: Yup.string().required('Phone country code is required'),
    password: isEdit
      ? Yup.string().min(6, 'Password must be at least 6 characters').nullable()
      : Yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
  };

  let specific: Record<string, any> = {};

  switch (role) {
    case 'organizer':
      specific = {
        organizationName: Yup.string().required('Organization Name is required'),
        companyName: Yup.string()
          .required('Company Name is required')
          .matches(/^[A-Za-z\s]+$/, 'Company Name must only contain letters and spaces')
          .max(100, 'Company Name must be at most 100 characters'),
        oib: Yup.string()
          .required('VAT is required')
          .matches(/^\d{1,11}$/, 'VAT must be at most 11 digits')
          .max(11, 'VAT must be at most 11 digits'),
        bankAccountNumber: Yup.string()
          .required('Bank Account Number is required')
          .transform((value) => (typeof value === 'string' ? value.replace(/\s+/g, '') : value))
          .min(5, 'Bank Account Number must be at least 5 characters')
          .max(34, 'Bank Account Number must be at most 34 characters')
          .matches(/^[A-Za-z0-9]+$/, 'Bank Account Number must be alphanumeric')
          .test('iban-or-numeric', 'Invalid Bank Account Number', function (value) {
            if (!value) return false;
            // IBAN detection: starts with 2 letters, then 2 digits
            const isIBAN = /^[A-Za-z]{2}\d{2}/.test(value);
            if (isIBAN) {
              // Mod-97 check for IBAN
              // Rearrange: move first 4 chars to end
              const rearranged = value.slice(4) + value.slice(0, 4);
              // Replace letters with numbers (A=10, B=11, ..., Z=35)
              const converted = rearranged.replace(/[A-Za-z]/g, (char) => (char.toUpperCase().charCodeAt(0) - 55).toString());
              // Mod-97 check
              let remainder = converted;
              while (remainder.length > 2) {
                remainder = (parseInt(remainder.slice(0, 9), 10) % 97).toString() + remainder.slice(9);
              }
              return parseInt(remainder, 10) % 97 === 1;
            } else {
              // Non-IBAN: must be numeric
              return /^\d+$/.test(value);
            }
          }),
        representativeName: Yup.string()
          .required('Representative Name is required')
          .matches(/^[A-Za-z\s]+$/, 'Representative Name must only contain letters and spaces')
          .max(100, 'Representative Name must be at most 100 characters'),
        location: Yup.object()
          .shape({
            fullAddress: Yup.string().required('Full address is required'),
            country: Yup.string().required('Country is required'),
            city: Yup.string().required('City is required'),
            state: Yup.string().required('State is required'),
            postalCode: Yup.string().required('Postal code is required'),
            coordinates: Yup.array().of(Yup.number()).length(2, 'Coordinates must be an array of 2 numbers').nullable().default(null),
          })
          .required('Location is required'),
        suppliers: Yup.array()
          .of(Yup.string())
          // .min(1, 'At least one supplier is required')
          // .required(),
          .optional(),
      };
      break;
    case 'manager':
      specific = {
        organizations: Yup.array().of(Yup.string()).min(1, 'At least one organization is required').required(),
      };
      break;
    case 'staff':
      specific = {
        organizations: Yup.array().of(Yup.string()).min(1, 'At least one organization is required').required(),
        modules: Yup.array().of(Yup.string()).min(1, 'At least one module is required').required(),
      };
      break;
    case 'user':
      specific = {
        username: Yup.string().required('Username is required'),
        dob: Yup.date().required('Date of Birth is required'),
        gender: Yup.string().required('Gender is required'),
        // organizations: Yup.array().of(Yup.string()).min(1, 'At least one organization is required').required(),
      };
      break;
    default:
      break;
  }

  return Yup.object().shape({ ...common, ...specific });
};
