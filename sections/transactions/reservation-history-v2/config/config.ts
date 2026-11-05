import { ReservationCondition, ReservationStatus, ReservationTypeCategory, SettlementStatus, VoucherStatus } from '../types/types';

export const RESERVATION_TYPE_CONFIG: Record<ReservationTypeCategory, { label: string; dotClassName: string }> = {
  standard_table: { label: 'Standard table', dotClassName: 'bg-cyan-500' },
  vip_booth: { label: 'VIP booth', dotClassName: 'bg-violet-500' },
  group_table: { label: 'Group table', dotClassName: 'bg-amber-400' },
};

export const CONDITION_CONFIG: Record<ReservationCondition, { label: string; className: string }> = {
  free: { label: 'free', className: 'border-gray-300 bg-gray-100 text-gray-700 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200' },
  minimum_spend: { label: 'min spend', className: 'border-blue-600 bg-blue-600 text-white' },
};

export const STATUS_CONFIG: Record<ReservationStatus, { className: string }> = {
  new: { className: 'text-gray-900 dark:text-gray-100' },
  awaiting_payment: { className: 'text-amber-500' },
  confirmed: { className: 'text-gray-900 dark:text-gray-100' },
  show: { className: 'text-gray-900 dark:text-gray-100' },
  no_show: { className: 'text-red-500' },
  cancelled: { className: 'text-red-500' },
  expired: { className: 'text-gray-400' },
};

export const VOUCHER_STATUS_CONFIG: Record<VoucherStatus, { className: string }> = {
  ISSUED: { className: 'text-gray-900 dark:text-gray-100' },
  PARTIALLY_USED: { className: 'text-amber-500' },
  USED: { className: 'text-gray-500 dark:text-gray-400' },
  EXPIRED: { className: 'text-gray-400' },
  CANCELLED: { className: 'text-gray-400' },
  FORFEITED: { className: 'text-red-500' },
};

export const SETTLEMENT_CONFIG: Record<Exclude<SettlementStatus, null>, { label: string; className: string }> = {
  PENDING: { label: 'Pending', className: 'text-amber-500' },
  HELD: { label: 'Held', className: 'text-blue-500' },
  SETTLED: { label: 'Settled', className: 'text-green-600 dark:text-green-400' },
  EXCLUDED: { label: 'Excluded', className: 'text-red-500' },
  NO_TRANSACTION: { label: 'No transaction', className: 'text-gray-500 dark:text-gray-400' },
};
