export type PayoutStatementStatus = 'PENDING' | 'PAID' | 'CANCELLED';

export type OffAppBatchStatus = 'PENDING' | 'CONFIRMED' | 'CANCELLED';

export type FiscalizationCurrentStatus = 'NOT_FISCALIZED' | 'FISCALIZATION_FAILED';

export type TransactionModule = 'Ticketing' | 'Ordering' | 'Reservation' | 'Loyalty';

export interface EligibleTransaction {
  id: string;
  transactionId: string;
  module: TransactionModule;
  organizerCompany: string;
  organizerNet: number;
  commissionAmount: number;
}

export interface OffAppOrder {
  id: string;
  transactionId: string;
  organizerCompany: string;
  orderValue: number;
}

export interface FiscalizeQueueItem {
  transactionId: string;
  module: TransactionModule;
  statement: string;
  currentStatus: FiscalizationCurrentStatus;
  pleisNet: number;
}

export interface PayoutStatement {
  id: string;
  code: string;
  fileName: string;
  msgId: string;
  periodStart: string;
  periodEnd: string;
  generatedAt: string;
  generatedBy: string;
  transactionsCount: number;
  linesCount: number;
  linesNote: string;
  organizerTotal: number;
  commission: number;
  controlSum: number;
  status: PayoutStatementStatus;
  confirmedAt?: string;
}

export interface OffAppBatch {
  id: string;
  code: string;
  periodStart: string;
  periodEnd: string;
  generatedAt: string;
  generatedBy: string;
  ordersCount: number;
  offAppOrderValue: number;
  pleisCommission: number;
  linesCount: number;
  status: OffAppBatchStatus;
  confirmedAt?: string;
}
