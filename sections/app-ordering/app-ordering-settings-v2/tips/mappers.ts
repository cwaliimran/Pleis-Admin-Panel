import type { ApiInAppOrderingSettings, ApiOrganizationTips, ApiTipPreset } from '@/store/Reducer/organization';
import { DEFAULT_TIP_SETTINGS } from './constants';
import { TipPreset, TipSettings } from './types';

// ============================================================
// Wire ↔ view model
//
// `tipType` and our `unit` share the same values, so presets only differ
// by field name and by the id the backend assigns.
// ============================================================

/** Presets the user just added have no `_id` yet — key them locally so drag/remove still work. */
const localPresetId = (index: number) => `preset_local_${index}`;

const mapPreset = (preset: ApiTipPreset, index: number): TipPreset => ({
  id: preset._id || localPresetId(index),
  unit: preset.tipType,
  value: Number(preset.value) || 0,
});

export const mapApiTips = (settings?: ApiInAppOrderingSettings | null): TipSettings => {
  const tips = settings?.tips;
  if (!tips) return DEFAULT_TIP_SETTINGS;

  return {
    enabled: Boolean(tips.enableCustomerTipping),
    presets: (tips.tipPresets ?? []).map(mapPreset),
    allowCustomAmount: Boolean(tips.allowCustomTips),
  };
};

/**
 * `id` is deliberately dropped — the backend assigns `_id` itself, and
 * echoing a locally generated one back would be meaningless.
 */
export const toApiTips = (tips: TipSettings): ApiOrganizationTips => ({
  enableCustomerTipping: tips.enabled,
  allowCustomTips: tips.allowCustomAmount,
  tipPresets: tips.presets.map((preset) => ({ tipType: preset.unit, value: preset.value })),
});
