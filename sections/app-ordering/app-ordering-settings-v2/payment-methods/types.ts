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
  /** Off App Payment Options (order-settings prototype v2.3). Cash at the venue — receipt marker Gotovina. */
  cash: boolean;
  /** Card on the venue's own terminal — receipt marker Kartica. */
  card: boolean;
  /** A voucher or any other method the venue accepts — receipt marker Ostalo. */
  other: boolean;
}
