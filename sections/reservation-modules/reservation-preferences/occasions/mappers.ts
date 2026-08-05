import type { ApiOccasion } from '@/store/Reducer/occasions-api';
import { Occasion } from './types';

// ============================================================
// Wire → view model
//
// The only place that knows both shapes. Everything downstream works with
// `Occasion` alone.
// ============================================================

export const mapApiOccasion = (occasion: ApiOccasion): Occasion => ({
  id: occasion._id,
  label: occasion.name ?? '',
  status: occasion.status ?? 'active',
});

export const mapApiOccasions = (occasions: ApiOccasion[]): Occasion[] => occasions.map(mapApiOccasion);
