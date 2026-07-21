import { DietTagRecord } from './types';

// TODO(v2-api): replace with real diet tag data once the backend endpoint is ready.
export const mockDietTagsData: DietTagRecord[] = [
  { _id: 'diet-1', code: 'DIET001', tag: 'vegetarian', description: 'No meat, dairy allowed', status: 'active', createdAt: '2026-01-01' },
  { _id: 'diet-2', code: 'DIET002', tag: 'vegan', description: 'No animal-origin ingredients', status: 'active', createdAt: '2026-01-01' },
  { _id: 'diet-3', code: 'DIET003', tag: 'pescatarian', description: 'Fish allowed, no meat', status: 'active', createdAt: '2026-01-01' },
  { _id: 'diet-4', code: 'DIET004', tag: 'gluten_free', description: 'No gluten', status: 'active', createdAt: '2026-01-01' },
  { _id: 'diet-5', code: 'DIET005', tag: 'lactose_free', description: 'No lactose', status: 'active', createdAt: '2026-01-01' },
  { _id: 'diet-6', code: 'DIET006', tag: 'keto', description: 'Very low carbohydrate, high fat', status: 'active', createdAt: '2026-01-01' },
  { _id: 'diet-7', code: 'DIET007', tag: 'low_carb', description: 'Reduced carbohydrate content', status: 'active', createdAt: '2026-01-01' },
  { _id: 'diet-8', code: 'DIET008', tag: 'high_protein', description: 'Elevated protein content', status: 'active', createdAt: '2026-01-01' },
  { _id: 'diet-9', code: 'DIET009', tag: 'halal', description: 'Halal standard', status: 'active', createdAt: '2026-01-01' },
  { _id: 'diet-10', code: 'DIET010', tag: 'kosher', description: 'Kosher standard', status: 'active', createdAt: '2026-01-01' },
  { _id: 'diet-11', code: 'DIET011', tag: 'low_sugar', description: 'Reduced added sugar', status: 'active', createdAt: '2026-01-01' },
  { _id: 'diet-12', code: 'DIET012', tag: 'spicy', description: 'Heavily spiced', status: 'active', createdAt: '2026-01-01' },
];

export const getNextDietTagCode = (records: DietTagRecord[]): string => {
  const maxNumber = records.reduce((max, record) => {
    const num = parseInt(record.code.replace(/\D/g, ''), 10);
    return isNaN(num) ? max : Math.max(max, num);
  }, 0);
  return `DIET${String(maxNumber + 1).padStart(3, '0')}`;
};
