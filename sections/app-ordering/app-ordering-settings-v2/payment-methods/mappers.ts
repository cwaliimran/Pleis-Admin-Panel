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

  return {
    inAppPayment: Boolean(paymentMethod.inAppPayment),
    payNow: Boolean(paymentMethod.payNow),
    cash: Boolean(paymentMethod.cash),
  };
};
