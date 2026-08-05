// ============================================================
// Order timing — view model
//
// The wire carries a single `inAppOrderingSettings.sessionTimerLength`
// number; the on/off switch is derived from it. See `mappers.ts`.
// ============================================================

export interface OrderTimingSettings {
  sessionTimerEnabled: boolean;
  /** Minutes. Not restricted to the presets below — the backend accepts any value. */
  sessionLengthMinutes: number;
}
