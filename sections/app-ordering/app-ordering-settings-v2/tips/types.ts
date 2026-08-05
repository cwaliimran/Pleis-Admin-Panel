// ============================================================
// Tips — view model
//
// The wire shape lives under `inAppOrderingSettings.tips` on the
// organization document (`store/Reducer/organization.tsx`); `mappers.ts`
// is the only place that knows both.
// ============================================================

/** Matches the wire's `tipType` values exactly. */
export type TipPresetUnit = 'percentage' | 'fixed';

export interface TipPreset {
  /** The preset's `_id`, or a locally generated one for a preset just added. */
  id: string;
  /** `tipType` on the wire. */
  unit: TipPresetUnit;
  value: number;
}

export interface TipSettings {
  /** `enableCustomerTipping` on the wire. */
  enabled: boolean;
  /** Order is meaningful — it drives the chip order shown to the customer. */
  presets: TipPreset[];
  /** `allowCustomTips` on the wire. */
  allowCustomAmount: boolean;
}
