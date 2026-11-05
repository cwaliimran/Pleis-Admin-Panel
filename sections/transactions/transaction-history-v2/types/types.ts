export type TransactionCategory = 'ticketing' | 'ordering' | 'reservations' | 'subscriptions' | 'loyalty';

export type TransactionStatus = 'completed' | 'refunded' | 'failed';

export type SettlementStatus = 'PENDING' | 'HELD' | 'PAID' | 'EXCLUDED' | null;

export type FiscalizationStatus = 'NOT_FISCALIZED' | 'FISCALIZED' | 'FISCALIZATION_FAILED' | null;

export type DocumentCode = 'INV' | 'CONF' | 'STORNO' | 'ERACUN';

export type PayoutStatus = 'PENDING' | 'HELD' | 'PAID' | 'EXCLUDED';

export interface TransactionUser {
  name: string;
  email: string;
}

export interface TransactionParty {
  name: string;
  subtitle: string;
}

export interface TransactionDocument {
  code: DocumentCode;
  label: string;
  subtitle: string;
}

export interface PaymentAttempt {
  index: number;
  status: 'succeeded' | 'failed' | 'refunded';
  detail: string;
}

export interface MoneySplit {
  gross: number;
  commissionRate: number | null;
  commissionAmount: number | null;
  organizerNet: number | null;
  serviceFeeLabel?: string;
  serviceFeeAmount?: number;
  gatewayCostLabel?: string;
  gatewayCostAmount?: number;
  pleisNet: number;
}

export interface SettlementDetail {
  track?: string;
  status: SettlementStatus;
  batch?: string;
  eligibility?: string;
}

export interface FiscalizationDetail {
  status: FiscalizationStatus;
  documentStatus: string;
  documents: TransactionDocument[];
}

export interface TransactionDetail {
  moneySplit: MoneySplit;
  parties: {
    buyer: TransactionParty;
    organizer?: TransactionParty;
    pleis: TransactionParty;
  };
  settlement: SettlementDetail;
  fiscalization: FiscalizationDetail;
  paymentAttempts: PaymentAttempt[];
}

export interface Transaction {
  id: string;
  transactionId: string;
  reference: string;
  user: TransactionUser | null;
  organization: string | null;
  category: TransactionCategory;
  subtype: string;
  status: TransactionStatus;
  amount: number;
  amountNote?: string;
  commissionRate: number | null;
  commissionAmount: number | null;
  organizerNet: number | null;
  pleisNet: number;
  pleisNetNote?: string;
  paymentMethod?: string;
  paymentSubNote?: string;
  settlementStatus: SettlementStatus;
  settlementNote?: string;
  fiscalizationStatus: FiscalizationStatus;
  documents: DocumentCode[];
  capturedAt: string | null;
  detail: TransactionDetail;
}

export interface TransactionStat {
  key: string;
  title: string;
  value: string;
  note?: string;
  raise: string;
}
