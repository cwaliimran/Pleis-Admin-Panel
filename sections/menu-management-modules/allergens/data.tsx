import { AllergenRecord } from './types';

// TODO(v2-api): replace with real allergen data once the backend endpoint is ready.
// The 14 EU-regulated mandatory allergens (Regulation (EU) No 1169/2011, Annex II).
export const mockAllergensData: AllergenRecord[] = [
  { _id: 'allergen-1', code: 'ALR001', name: 'Gluten', status: 'active', createdAt: '2026-01-01' },
  { _id: 'allergen-2', code: 'ALR002', name: 'Eggs', status: 'active', createdAt: '2026-01-01' },
  { _id: 'allergen-3', code: 'ALR003', name: 'Milk', status: 'active', createdAt: '2026-01-01' },
  { _id: 'allergen-4', code: 'ALR004', name: 'Nuts', status: 'active', createdAt: '2026-01-01' },
  { _id: 'allergen-5', code: 'ALR005', name: 'Peanuts', status: 'active', createdAt: '2026-01-01' },
  { _id: 'allergen-6', code: 'ALR006', name: 'Soy', status: 'active', createdAt: '2026-01-01' },
  { _id: 'allergen-7', code: 'ALR007', name: 'Fish', status: 'active', createdAt: '2026-01-01' },
  { _id: 'allergen-8', code: 'ALR008', name: 'Shellfish', status: 'active', createdAt: '2026-01-01' },
  { _id: 'allergen-9', code: 'ALR009', name: 'Crustaceans', status: 'active', createdAt: '2026-01-01' },
  { _id: 'allergen-10', code: 'ALR010', name: 'Celery', status: 'active', createdAt: '2026-01-01' },
  { _id: 'allergen-11', code: 'ALR011', name: 'Mustard', status: 'active', createdAt: '2026-01-01' },
  { _id: 'allergen-12', code: 'ALR012', name: 'Sesame', status: 'active', createdAt: '2026-01-01' },
  { _id: 'allergen-13', code: 'ALR013', name: 'Sulfites', status: 'active', createdAt: '2026-01-01' },
  { _id: 'allergen-14', code: 'ALR014', name: 'Lupin', status: 'active', createdAt: '2026-01-01' },
];

export const getNextAllergenCode = (records: AllergenRecord[]): string => {
  const maxNumber = records.reduce((max, record) => {
    const num = parseInt(record.code.replace(/\D/g, ''), 10);
    return isNaN(num) ? max : Math.max(max, num);
  }, 0);
  return `ALR${String(maxNumber + 1).padStart(3, '0')}`;
};
