import { LoyaltyEntry } from '../../types/types';

export type PresetId = 'expiring_in_30_days' | 'reversals' | 'manual_adjustments' | 'uncollected_rewards' | 'reward_grants_without_points' | 'promotion_boosted';

export interface PresetOption {
  id: PresetId;
  label: string;
  predicate: (entry: LoyaltyEntry) => boolean;
}

export const PRESET_OPTIONS: PresetOption[] = [
  { id: 'expiring_in_30_days', label: 'Expiring in 30 days', predicate: (e) => Boolean(e.expiresNote) },
  { id: 'reversals', label: 'Reversals', predicate: (e) => e.entryType === 'reversal' },
  { id: 'manual_adjustments', label: 'Manual adjustments', predicate: (e) => e.entryType === 'manual_adjustment' },
  { id: 'uncollected_rewards', label: 'Uncollected rewards', predicate: (e) => e.reward?.collection === 'uncollected' },
  { id: 'reward_grants_without_points', label: 'Reward grants without points', predicate: (e) => e.entryType === 'reward_grant' && e.points === 0 },
  { id: 'promotion_boosted', label: 'Promotion-boosted', predicate: (e) => e.hasPromotion },
];

export const DATE_BASIS_OPTIONS = [{ value: 'created_at', label: 'created_at' }];

export const PERIOD_OPTIONS = [
  { value: 'last_30_days', label: 'Last 30 days' },
  { value: 'current_working_day', label: 'Current working day' },
  { value: 'yesterday', label: 'Yesterday' },
  { value: 'last_7_days', label: 'Last 7 days' },
  { value: 'this_month', label: 'This month' },
  { value: 'last_month', label: 'Last month' },
  { value: 'custom_range', label: 'Custom range...' },
];

export const matchesSearch = (entry: LoyaltyEntry, query: string): boolean => {
  const trimmed = query.trim().toLowerCase();
  if (!trimmed) return true;

  const fields = [entry.userName, entry.description, entry.reward?.label, entry.transactionId];
  return fields.some((field) => field?.toLowerCase().includes(trimmed));
};
