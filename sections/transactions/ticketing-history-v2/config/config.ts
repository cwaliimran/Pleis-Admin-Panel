import { SettlementStatus, TicketStatus, TicketTypeCategory } from '../types/types';

export const TICKET_TYPE_CONFIG: Record<TicketTypeCategory, { label: string; dotClassName: string }> = {
  standard: { label: 'Standard', dotClassName: 'bg-cyan-500' },
  vip: { label: 'VIP', dotClassName: 'bg-violet-500' },
  season_pass: { label: 'Season pass', dotClassName: 'bg-amber-400' },
};

export const STATUS_CONFIG: Record<TicketStatus, { className: string }> = {
  active: { className: 'text-gray-900 dark:text-gray-100' },
  used: { className: 'text-gray-900 dark:text-gray-100' },
  partially_used: { className: 'text-amber-500' },
  expired: { className: 'text-gray-400' },
  refunded: { className: 'text-red-500' },
  superseded: { className: 'text-gray-400' },
  cancelled: { className: 'text-red-500' },
};

export const SETTLEMENT_CONFIG: Record<Exclude<SettlementStatus, null>, { label: string; className: string }> = {
  PENDING: { label: 'Pending', className: 'text-amber-500' },
  HELD: { label: 'Held', className: 'text-blue-500' },
  SETTLED: { label: 'Settled', className: 'text-green-600 dark:text-green-400' },
  EXCLUDED: { label: 'Excluded', className: 'text-red-500' },
  NO_TRANSACTION: { label: 'No transaction', className: 'text-gray-500 dark:text-gray-400' },
};
