import * as Yup from 'yup';
import { BundleFormValues } from './bundle-modal.types';

export const bundleSchema = Yup.object().shape({
  name: Yup.string().required('Bundle name is required').default(''),
  description: Yup.string().required('Description is required').default(''),
  event: Yup.string().default(''),
  startDate: Yup.string().required('Start date is required').default(''),
  endDate: Yup.string().required('End date is required').default(''),
  price: Yup.number()
    .transform((value, originalValue) => (originalValue === '' ? undefined : value))
    .required('Bundle price is required')
    .min(0, 'Price must be at least 0')
    .test('max-one-decimal', 'Bundle price can have at most 1 decimal place', (value) => {
      if (value === undefined || value === null) return true;
      return /^\d+(\.\d)?$/.test(String(value));
    })
    .default(0),
  tickets: Yup.array()
    .of(
      Yup.object().shape({
        ticketId: Yup.string().required('Ticket is required'),
        quantity: Yup.number().required('Quantity is required').min(1, 'Quantity must be at least 1'),
      })
    )
    .default([]),
  reservations: Yup.array()
    .of(
      Yup.object().shape({
        reservationId: Yup.string().required('Reservation is required'),
        quantity: Yup.number().required('Quantity is required').min(1, 'Quantity must be at least 1'),
      })
    )
    .default([]),
  preorders: Yup.array()
    .of(
      Yup.object().shape({
        menuItemId: Yup.string().required('Menu item is required'),
        quantity: Yup.number().required('Quantity is required').min(1, 'Quantity must be at least 1'),
      })
    )
    .default([]),
  status: Yup.string()
    .oneOf(['active', 'inactive'] as const)
    .default('active'),
}) as Yup.ObjectSchema<BundleFormValues>;

export const defaultValues: BundleFormValues = {
  name: '',
  description: '',
  event: '',
  startDate: '',
  endDate: '',
  price: 0,
  tickets: [],
  reservations: [],
  preorders: [],
  status: 'active',
};
