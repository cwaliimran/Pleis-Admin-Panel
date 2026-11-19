import { FiscalizationStatus, OrderStatus, SettlementStatus } from '../types/types';

export const STATUS_CONFIG: Record<OrderStatus, { className: string }> = {
  sent: { className: 'text-gray-900 dark:text-gray-100' },
  preparing: { className: 'text-gray-900 dark:text-gray-100' },
  delivered: { className: 'text-green-600 dark:text-green-400' },
  awaiting_payment: { className: 'text-amber-500' },
  paid: { className: 'text-green-600 dark:text-green-400' },
  rejected: { className: 'text-red-500' },
  cancelled: { className: 'text-red-500' },
};

export const SETTLEMENT_CONFIG: Record<Exclude<SettlementStatus, null>, { label: string; className: string }> = {
  PENDING: { label: 'Pending', className: 'text-amber-500' },
  HELD: { label: 'Held', className: 'text-blue-500' },
  SETTLED: { label: 'Settled', className: 'text-green-600 dark:text-green-400' },
  EXCLUDED: { label: 'Excluded', className: 'text-red-500' },
};

export const FISCALIZATION_CONFIG: Record<Exclude<FiscalizationStatus, null>, { label: string; className: string }> = {
  NOT_FISCALIZED: { label: 'Not fiscalized', className: 'text-muted-foreground' },
  FISCALIZED: { label: 'Fiscalized', className: 'text-green-600 dark:text-green-400' },
  FISCALIZATION_FAILED: { label: 'Fiscalization failed', className: 'text-red-500' },
};
