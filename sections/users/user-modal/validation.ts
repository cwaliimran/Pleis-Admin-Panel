// validation.ts
import * as Yup from 'yup';

type RoleKey = 'admin' | 'organizer' | 'manager' | 'staff' | 'guest' | 'user';

export const generateValidationSchema = (
  role: RoleKey,
  isEdit: boolean = false
) => {
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
      : Yup.string()
          .min(6, 'Password must be at least 6 characters')
          .required('Password is required'),
  };

  let specific: Record<string, any> = {};

  switch (role) {
    case 'organizer':
      specific = {
        organizationName: Yup.string().required(
          'Organization Name is required'
        ),
        companyName: Yup.string().required('Company Name is required'),
        oib: Yup.string()
          .required('VAT is required')
          .max(11, 'VAT must be at most 11 characters'),
        bankAccountNumber: Yup.string().required(
          'Bank Account Number is required'
        ),
        representativeName: Yup.string().required(
          'Representative Name is required'
        ),
        location: Yup.object()
          .shape({
            fullAddress: Yup.string().required('Full address is required'),
            country: Yup.string().required('Country is required'),
            city: Yup.string().required('City is required'),
            state: Yup.string().required('State is required'),
            postalCode: Yup.string().required('Postal code is required'),
            coordinates: Yup.array()
              .of(Yup.number())
              .length(2, 'Coordinates must be an array of 2 numbers')
              .nullable()
              .default(null),
          })
          .required('Location is required'),
        suppliers: Yup.array()
          .of(Yup.string())
          .min(1, 'At least one supplier is required')
          .required(),
      };
      break;
    case 'manager':
      specific = {
        organizations: Yup.array()
          .of(Yup.string())
          .min(1, 'At least one organization is required')
          .required(),
      };
      break;
    case 'staff':
      specific = {
        organizations: Yup.array()
          .of(Yup.string())
          .min(1, 'At least one organization is required')
          .required(),
        modules: Yup.array()
          .of(Yup.string())
          .min(1, 'At least one module is required')
          .required(),
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
