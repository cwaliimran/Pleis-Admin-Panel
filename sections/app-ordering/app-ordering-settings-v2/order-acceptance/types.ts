// ============================================================
// Order acceptance — view model
//
// The wire shape lives in `store/Reducer/ordering-settings-api.ts`;
// `mappers.ts` is the only place that knows both.
// ============================================================

export interface OrderAcceptanceSettings {
  /** true → incoming orders go straight to preparation. false → staff must confirm each one. */
  automaticOrderAcceptance: boolean;
}
