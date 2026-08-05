import { PaymentSettings } from './types';

/** Used for an organization that has never saved payment methods. */
export const DEFAULT_PAYMENT_SETTINGS: PaymentSettings = {
  inAppPayment: true,
  payNow: true,
  cash: true,
};
