import { getDefaultFilterValues } from './default-values';
import { SavedFilterView } from './types';

export const DEFAULT_SAVED_VIEWS: SavedFilterView[] = [
  {
    id: 'daily-close-out',
    label: 'Daily close-out',
    starred: true,
    values: { ...getDefaultFilterValues(), eventEnded: 'yes', settlementStatus: ['PENDING'] },
  },
  {
    id: 'refund-review',
    label: 'Refund review',
    values: { ...getDefaultFilterValues(), status: ['refunded'] },
  },
];
