import { CollectionStatus, EntryType, LoyaltyScope } from '../types/types';

export const ENTRY_TYPE_CONFIG: Record<EntryType, { label: string; className: string }> = {
  earn: { label: 'Earned', className: 'border-green-300 bg-green-100 text-green-700 dark:border-green-800 dark:bg-green-900/30 dark:text-green-300' },
  spend: { label: 'Redeemed', className: 'border-red-300 bg-red-100 text-red-700 dark:border-red-800 dark:bg-red-900/30 dark:text-red-300' },
  reward_grant: { label: 'Granted', className: 'border-blue-300 bg-blue-100 text-blue-700 dark:border-blue-800 dark:bg-blue-900/30 dark:text-blue-300' },
  reversal: { label: 'Reversed', className: 'border-pink-300 bg-pink-100 text-pink-700 dark:border-pink-800 dark:bg-pink-900/30 dark:text-pink-300' },
  manual_adjustment: { label: 'Adjusted', className: 'border-violet-300 bg-violet-100 text-violet-700 dark:border-violet-800 dark:bg-violet-900/30 dark:text-violet-300' },
  expire: { label: 'Expired', className: 'border-gray-300 bg-gray-100 text-gray-600 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300' },
};

export const SCOPE_CONFIG: Record<LoyaltyScope, { label: string; className: string }> = {
  local: { label: 'Local', className: 'border-blue-600 bg-blue-600 text-white' },
  global: { label: 'Global', className: 'border-gray-300 bg-gray-100 text-gray-700 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200' },
};

export const COLLECTION_CONFIG: Record<CollectionStatus, { label: string; className: string }> = {
  collected: { label: 'collected', className: 'text-gray-500 dark:text-gray-400' },
  uncollected: { label: 'uncollected', className: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300' },
};

export const POINTS_CLASS = (points: number): string => {
  if (points > 0) return 'text-green-600 dark:text-green-400';
  if (points < 0) return 'text-red-500';
  return 'text-gray-500 dark:text-gray-400';
};
