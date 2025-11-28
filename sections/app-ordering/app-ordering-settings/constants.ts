import { DeliveryMethod, PaymentTimingOption } from './types';

export const PAYMENT_TIMING_OPTIONS: PaymentTimingOption[] = [
  {
    value: 'acceptance',
    label: 'Charge on Acceptance',
    description: 'Payment is captured when staff accepts the order and begins preparation.',
  },
  {
    value: 'delivery',
    label: 'Charge on Delivery',
    description: 'Payment is captured after the order is fully completed and delivered to the customer.',
  },
];

export const DELIVERY_METHODS: DeliveryMethod[] = [
  {
    id: 'counter',
    icon: '🥡',
    title: 'Counter Pickup',
    description: 'Customers receive an order number and collect items at the counter when ready.',
  },
  {
    id: 'table',
    icon: '🍽️',
    title: 'Table Delivery',
    description: 'Customers enter their table number. Staff delivers orders directly to the table.',
  },
  {
    id: 'togo',
    icon: '🛍️',
    title: 'To Go',
    description: 'Similar to counter pickup but specifically marked for takeaway orders. Packaged for transport.',
  },
];

export const DEFAULT_SETTINGS = {
  payment: {
    instant: true,
    payLater: true,
    cash: false,
  },
  acceptance: {
    enabled: true,
    paymentTiming: 'acceptance' as const,
  },
  delivery: {
    counter: true,
    table: true,
    togo: false,
  },
};

export const ORDER_FLOW_WITH_ACCEPTANCE = [
  { label: 'Sent', key: 'sent' },
  { label: 'Preparing', key: 'preparing' },
  { label: 'Delivered', key: 'delivered' },
];

export const ORDER_FLOW_WITHOUT_ACCEPTANCE = [
  { label: 'Preparing', key: 'preparing' },
  { label: 'Delivered', key: 'delivered' },
];
