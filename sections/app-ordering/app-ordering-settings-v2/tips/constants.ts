import { TipPresetUnit, TipSettings } from './types';

export const TIP_UNIT_CONFIG: Record<TipPresetUnit, { symbol: string; label: string }> = {
  percentage: { symbol: '%', label: 'Percentage' },
  fixed: { symbol: '€', label: 'Fixed amount' },
};

export const TIP_UNIT_OPTIONS: { value: TipPresetUnit; label: string }[] = [
  { value: 'percentage', label: TIP_UNIT_CONFIG.percentage.symbol },
  { value: 'fixed', label: TIP_UNIT_CONFIG.fixed.symbol },
];

/** Guard rails so the checkout chip row stays usable. */
export const MAX_TIP_PRESETS = 6;
export const MAX_TIP_PERCENTAGE = 100;
export const MAX_TIP_FIXED_AMOUNT = 999;

/** Used for an organization that has never saved tip settings. */
export const DEFAULT_TIP_SETTINGS: TipSettings = {
  enabled: false,
  presets: [],
  allowCustomAmount: false,
};
