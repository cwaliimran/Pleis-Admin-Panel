import { BrandRecord } from './types';

// TODO(v2-api): replace with real brand data once the backend endpoint is ready.
export const mockBrandsData: BrandRecord[] = [
  { _id: 'brand-1', name: "Hendrick's", principal: 'William Grant & Sons', status: 'active', createdAt: '2026-01-01' },
  { _id: 'brand-2', name: 'San Pellegrino', principal: 'Nestlé', status: 'active', createdAt: '2026-01-01' },
  { _id: 'brand-3', name: 'Aperol', principal: 'Campari Group', status: 'active', createdAt: '2026-01-01' },
  { _id: 'brand-4', name: 'Johnnie Walker', principal: 'Diageo', status: 'active', createdAt: '2026-02-14' },
  { _id: 'brand-5', name: 'Red Bull', principal: 'Red Bull GmbH', status: 'inactive', createdAt: '2026-02-14' },
];
