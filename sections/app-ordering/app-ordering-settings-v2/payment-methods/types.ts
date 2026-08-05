// ============================================================
// Payment methods — view model
//
// The wire shape lives in `store/Reducer/ordering-settings-api.ts`;
// `mappers.ts` is the only place that knows both.
// ============================================================

export interface PaymentSettings {
  /** Master switch for the connected payment provider. */
  inAppPayment: boolean;
  /** true → charge once the order is accepted. false → pay later, bill settled after delivery. */
  payNow: boolean;
  /** Cash at the venue. Settled by staff confirming receipt in the app. */
  cash: boolean;
}
