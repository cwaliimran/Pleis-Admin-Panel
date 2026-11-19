import { DocumentCode, FiscalizationStatus, SettlementStatus, TransactionCategory } from '../types/types';

export const CATEGORY_CONFIG: Record<TransactionCategory, { label: string; dotClassName: string }> = {
  ticketing: { label: 'Ticketing', dotClassName: 'bg-violet-500' },
  ordering: { label: 'Ordering', dotClassName: 'bg-cyan-500' },
  reservations: { label: 'Reservations', dotClassName: 'bg-amber-400' },
  subscriptions: { label: 'Subscriptions', dotClassName: 'bg-slate-400' },
  loyalty: { label: 'Loyalty', dotClassName: 'bg-pink-500' },
};

export const SETTLEMENT_CONFIG: Record<Exclude<SettlementStatus, null>, { label: string; className: string }> = {
  PENDING: { label: 'Pending', className: 'text-amber-500' },
  HELD: { label: 'Held', className: 'text-blue-500' },
  PAID: { label: 'Paid', className: 'text-green-600 dark:text-green-400' },
  EXCLUDED: { label: 'Excluded', className: 'text-red-500' },
};

export const FISCALIZATION_CONFIG: Record<Exclude<FiscalizationStatus, null>, { label: string; className: string }> = {
  NOT_FISCALIZED: { label: 'Not Fiscalized', className: 'text-muted-foreground' },
  FISCALIZED: { label: 'Fiscalized', className: 'text-green-600 dark:text-green-400' },
  FISCALIZATION_FAILED: { label: 'Fiscalization Failed', className: 'text-red-500' },
};

export const DOCUMENT_LABEL: Record<DocumentCode, string> = {
  INV: 'INV',
  CONF: 'CONF',
  STORNO: 'STORNO',
  ERACUN: 'eRAČUN',
};
