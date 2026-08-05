import type { ApiOrderingSettings } from '@/store/Reducer/ordering-settings-api';
import { DEFAULT_ORDER_ACCEPTANCE_SETTINGS } from './constants';
import { OrderAcceptanceSettings } from './types';

// ============================================================
// Wire → view model
//
// Order acceptance is a single flag on the settings document. `??` rather
// than `||` so a stored `false` survives.
// ============================================================

export const mapApiOrderAcceptance = (record?: ApiOrderingSettings | null): OrderAcceptanceSettings => ({
  automaticOrderAcceptance: Boolean(record?.automaticOrderAcceptance ?? DEFAULT_ORDER_ACCEPTANCE_SETTINGS.automaticOrderAcceptance),
});
