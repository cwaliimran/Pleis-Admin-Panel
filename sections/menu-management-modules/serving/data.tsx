import { ServingRecord } from './types';

// TODO(v2-api): replace with real serving data once the backend endpoint is ready.
export const mockServingData: ServingRecord[] = [
  { _id: 'serving-1', code: 'SERV001', level2: 'food', type: 'Individual', unit: 'pcs', status: 'active', createdAt: '2026-01-01' },
  { _id: 'serving-2', code: 'SERV002', level2: 'food', type: 'Sharing', unit: 'pcs', status: 'active', createdAt: '2026-01-01' },
  { _id: 'serving-4', code: 'SERV004', level2: 'food', type: 'By weight', unit: 'g', status: 'active', createdAt: '2026-01-01' },
  { _id: 'serving-5', code: 'SERV005', level2: 'drink', type: 'Glass', unit: 'l', status: 'active', createdAt: '2026-01-01' },
  { _id: 'serving-6', code: 'SERV006', level2: 'drink', type: 'Bottle', unit: 'l', status: 'active', createdAt: '2026-01-01' },
  { _id: 'serving-7', code: 'SERV007', level2: 'drink', type: 'Draft', unit: 'l', status: 'active', createdAt: '2026-01-01' },
  { _id: 'serving-8', code: 'SERV008', level2: null, type: 'Set menu', status: 'active', createdAt: '2026-01-01' },
  { _id: 'serving-9', code: 'SERV009', level2: null, type: 'Tasting', unit: 'pcs', status: 'active', createdAt: '2026-01-01' },
  { _id: 'serving-10', code: 'SERV010', level2: null, type: 'Combo', status: 'active', createdAt: '2026-01-01' },
];

export const getNextServingCode = (records: ServingRecord[]): string => {
  const maxNumber = records.reduce((max, record) => {
    const num = parseInt(record.code.replace(/\D/g, ''), 10);
    return isNaN(num) ? max : Math.max(max, num);
  }, 0);
  return `SERV${String(maxNumber + 1).padStart(3, '0')}`;
};
