import { Ticket } from '../../types/types';

export type PresetId =
  | 'unscanned_for_ended_events'
  | 'rejected_scans'
  | 'transfers_and_gifts'
  | 'refunded'
  | 'invoice_pair_incomplete'
  | 'resale_protected_without_holder_data';

export interface PresetOption {
  id: PresetId;
  label: string;
  predicate: (ticket: Ticket) => boolean;
}

export const PRESET_OPTIONS: PresetOption[] = [
  { id: 'unscanned_for_ended_events', label: 'Unscanned for ended events', predicate: (t) => t.eventEnded && t.scanCount === 0 },
  { id: 'rejected_scans', label: 'Rejected scans', predicate: (t) => Boolean(t.scanResult?.startsWith('rejected')) },
  { id: 'transfers_and_gifts', label: 'Transfers and gifts', predicate: (t) => t.action === 'transfer' || t.action === 'gift' },
  { id: 'refunded', label: 'Refunded', predicate: (t) => t.status === 'refunded' },
  { id: 'invoice_pair_incomplete', label: 'Invoice pair incomplete', predicate: (t) => t.hasTransaction && t.invoiceStatus.length < 2 },
  { id: 'resale_protected_without_holder_data', label: 'Resale-protected without holder data', predicate: (t) => t.resaleProtection !== 'none' && t.holderDataMissing },
];

export const DATE_BASIS_OPTIONS = [
  { value: 'created_at', label: 'created_at' },
  { value: 'scanned_at', label: 'scanned_at' },
  { value: 'transferred_at', label: 'transferred_at' },
  { value: 'refunded_at', label: 'refunded_at' },
  { value: 'event_start_at', label: 'event_start_at' },
];

export const PERIOD_OPTIONS = [
  { value: 'last_30_days', label: 'Last 30 days' },
  { value: 'current_working_day', label: 'Current working day' },
  { value: 'yesterday', label: 'Yesterday' },
  { value: 'last_7_days', label: 'Last 7 days' },
  { value: 'this_month', label: 'This month' },
  { value: 'last_month', label: 'Last month' },
  { value: 'custom_range', label: 'Custom range...' },
];

export const matchesSearch = (ticket: Ticket, query: string): boolean => {
  const trimmed = query.trim().toLowerCase();
  if (!trimmed) return true;

  const fields = [ticket.ticketId, ticket.billkoItemCode, ticket.owner.name, ticket.owner.email, ticket.eventName];
  return fields.some((field) => field?.toLowerCase().includes(trimmed));
};
