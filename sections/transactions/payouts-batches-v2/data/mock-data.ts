import { EligibleTransaction, FiscalizeQueueItem, OffAppBatch, OffAppOrder, PayoutStatement } from '../types/types';

export const NEXT_PERIOD_START = '01.07.2026 00:00';
export const DEFAULT_PERIOD_END = '2026-08-11';
export const OFF_APP_COMMISSION_RATE = 0.03;

export const INITIAL_ELIGIBLE_TRANSACTIONS: EligibleTransaction[] = [
  { id: 'elig-1', transactionId: '69ea9cfff5d388fad95ae7', module: 'Ticketing', organizerCompany: 'Cabaret Grupa d.o.o.', organizerNet: 120.0, commissionAmount: 5.0 },
  { id: 'elig-2', transactionId: '69eb630a1168e5d4a1ea5e', module: 'Ticketing', organizerCompany: 'Cabaret Grupa d.o.o.', organizerNet: 45.02, commissionAmount: 2.1 },
  { id: 'elig-3', transactionId: '69ec11095d388fad95ae70', module: 'Ordering', organizerCompany: 'Nokturno Ugostiteljstvo d.o.o.', organizerNet: 50.0, commissionAmount: 2.39 },
  { id: 'elig-4', transactionId: '69e9ccf15d388fad95ae71', module: 'Ordering', organizerCompany: 'Nokturno Ugostiteljstvo d.o.o.', organizerNet: 21.0, commissionAmount: 1.0 },
];

export const INITIAL_OFF_APP_ORDERS: OffAppOrder[] = [
  { id: 'offapp-1', transactionId: '611904', organizerCompany: 'Cabaret Grupa d.o.o.', orderValue: 38.2 },
  { id: 'offapp-2', transactionId: '611977', organizerCompany: 'Cabaret Grupa d.o.o.', orderValue: 61.0 },
];

export const INITIAL_FISCALIZE_QUEUE: FiscalizeQueueItem[] = [
  { transactionId: '289002', module: 'Ticketing', statement: 'PB-2026-06-30', currentStatus: 'FISCALIZATION_FAILED', pleisNet: 2.23 },
  { transactionId: '512773', module: 'Ordering', statement: 'PB-2026-06-30', currentStatus: 'NOT_FISCALIZED', pleisNet: 1.48 },
];

export const INITIAL_PAYOUT_STATEMENTS: PayoutStatement[] = [
  {
    id: 'pb-2026-06-30',
    code: 'PB-2026-06-30',
    fileName: 'INST.20260630.0001.xml',
    msgId: 'INST202606300001',
    periodStart: '01.06.2026',
    periodEnd: '30.06.2026',
    generatedAt: '01.07.2026 09:12',
    generatedBy: 'Tin Manojlović',
    transactionsCount: 143,
    linesCount: 9,
    linesNote: '8 organizers + 1 commission',
    organizerTotal: 12480.2,
    commission: 512.44,
    controlSum: 12992.64,
    status: 'PAID',
    confirmedAt: '01.07.2026 14:38',
  },
];

export const INITIAL_OFF_APP_BATCHES: OffAppBatch[] = [
  {
    id: 'ob-2026-06-30',
    code: 'OB-2026-06-30',
    periodStart: '01.06.2026',
    periodEnd: '30.06.2026',
    generatedAt: '01.07.2026 09:40',
    generatedBy: 'Tin Manojlović',
    ordersCount: 36,
    offAppOrderValue: 2140.8,
    pleisCommission: 64.22,
    linesCount: 4,
    status: 'CONFIRMED',
    confirmedAt: '01.07.2026 15:02',
  },
];
