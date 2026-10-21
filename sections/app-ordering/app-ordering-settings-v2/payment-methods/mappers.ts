import type { ApiOrderingSettings } from '@/store/Reducer/ordering-settings-api';
import { DEFAULT_PAYMENT_SETTINGS } from './constants';
import { PaymentSettings } from './types';

// ============================================================
// Wire → view model
//
// Payment methods sit under `paymentMethod` on the settings document. The
// field names already match; the mapper coerces the flags to real booleans
// and supplies defaults for an organization with no record yet.
// ============================================================

export const mapApiPaymentMethods = (record?: ApiOrderingSettings | null): PaymentSettings => {
  const paymentMethod = record?.paymentMethod;
  if (!paymentMethod) return DEFAULT_PAYMENT_SETTINGS;

  const inAppPayment = Boolean(paymentMethod.inAppPayment);

  return {
    inAppPayment,
    // Charge-at-accept only exists with a provider — never show Pay now on without one.
    payNow: inAppPayment && Boolean(paymentMethod.payNow),
    cash: Boolean(paymentMethod.cash),
  };
};

/**
 * Pay now is charge-at-accept through the in-app provider. With in-app
 * payment off the form still holds the last `payNow` value (the switch is
 * only disabled), so the write must force it off rather than echo `true`.
 */
export const toApiPaymentMethods = (values: PaymentSettings): PaymentSettings => ({
  inAppPayment: values.inAppPayment,
  payNow: values.inAppPayment && values.payNow,
  cash: values.cash,
});
