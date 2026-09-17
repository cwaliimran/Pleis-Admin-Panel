import { getDefaultFilterValues } from './default-values';
import { SavedFilterView } from './types';

export const DEFAULT_SAVED_VIEWS: SavedFilterView[] = [
  {
    id: 'daily-close-out',
    label: 'Daily close-out',
    starred: true,
    values: { ...getDefaultFilterValues(), entryType: ['earn', 'spend'], hasPromotion: 'yes' },
  },
  {
    id: 'refund-review',
    label: 'Refund review',
    values: { ...getDefaultFilterValues(), entryType: ['reversal'] },
  },
];
