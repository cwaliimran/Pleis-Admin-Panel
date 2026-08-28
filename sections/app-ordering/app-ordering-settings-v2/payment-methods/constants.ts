import { PaymentSettings } from './types';

/**
 * Used for an organization that has never saved payment methods.
 *
 * Everything off: a `null` `paymentMethod` means nothing has been configured,
 * so the toggles must not claim a method is enabled when the backend holds no
 * such value.
 */
export const DEFAULT_PAYMENT_SETTINGS: PaymentSettings = {
  inAppPayment: false,
  payNow: false,
  cash: false,
};
