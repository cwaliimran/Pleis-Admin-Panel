import { DaypartRecord } from './types';

// TODO(v2-api): replace with real daypart data once the backend endpoint is ready.
export const mockDaypartData: DaypartRecord[] = [
  { _id: 'daypart-1', code: 'DP001', name: 'breakfast', startTime: '06:00', endTime: '10:30', status: 'active', createdAt: '2026-01-01' },
  { _id: 'daypart-2', code: 'DP002', name: 'brunch', startTime: '10:30', endTime: '12:30', status: 'active', createdAt: '2026-01-01' },
  { _id: 'daypart-3', code: 'DP003', name: 'lunch', startTime: '12:00', endTime: '15:00', status: 'active', createdAt: '2026-01-01' },
  { _id: 'daypart-4', code: 'DP004', name: 'afternoon', startTime: '15:00', endTime: '17:30', status: 'active', createdAt: '2026-01-01' },
  { _id: 'daypart-5', code: 'DP005', name: 'dinner', startTime: '18:00', endTime: '22:00', status: 'active', createdAt: '2026-01-01' },
  { _id: 'daypart-6', code: 'DP006', name: 'late night', startTime: '22:00', endTime: '05:00', status: 'active', createdAt: '2026-01-01' },
  { _id: 'daypart-7', code: 'DP007', name: 'all day', startTime: '00:00', endTime: '23:59', isAllDay: true, status: 'active', createdAt: '2026-01-01' },
];

export const getNextDaypartCode = (records: DaypartRecord[]): string => {
  const maxNumber = records.reduce((max, record) => {
    const num = parseInt(record.code.replace(/\D/g, ''), 10);
    return isNaN(num) ? max : Math.max(max, num);
  }, 0);
  return `DP${String(maxNumber + 1).padStart(3, '0')}`;
};
