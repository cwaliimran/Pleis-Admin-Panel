import { Transaction } from '../../types/types';

export type PresetId =
  | 'ready_for_payout'
  | 'ready_for_off_app_batch'
  | 'in_pending_batch'
  | 'excluded'
  | 'fiscalization_failed'
  | 'documents_missing'
  | 'reconciliation_exceptions'
  | 'failed_payments';

export interface PresetOption {
  id: PresetId;
  label: string;
  predicate: (transaction: Transaction) => boolean;
}

export const PRESET_OPTIONS: PresetOption[] = [
  {
    id: 'ready_for_payout',
    label: 'Ready for payout',
    predicate: (t) => t.settlementStatus === 'PENDING' && Boolean(t.settlementNote?.toLowerCase().includes('eligible')),
  },
  {
    id: 'ready_for_off_app_batch',
    label: 'Ready for off-app batch',
    predicate: (t) => t.settlementStatus === 'PENDING' && Boolean(t.settlementNote?.toLowerCase().includes('off-app batch')),
  },
  { id: 'in_pending_batch', label: 'In the pending batch', predicate: (t) => t.settlementStatus === 'HELD' },
  { id: 'excluded', label: 'Excluded', predicate: (t) => t.settlementStatus === 'EXCLUDED' },
  { id: 'fiscalization_failed', label: 'Fiscalization failed', predicate: (t) => t.fiscalizationStatus === 'FISCALIZATION_FAILED' },
  { id: 'documents_missing', label: 'Documents missing', predicate: (t) => t.documents.length === 0 },
  {
    id: 'reconciliation_exceptions',
    label: 'Reconciliation exceptions',
    predicate: (t) => t.settlementStatus === null && t.status === 'completed' && t.amount > 0,
  },
  { id: 'failed_payments', label: 'Failed payments', predicate: (t) => t.status === 'failed' },
];

export const DATE_BASIS_OPTIONS = [
  { value: 'captured_at', label: 'captured_at' },
  { value: 'created_at', label: 'created_at' },
  { value: 'updated_at', label: 'updated_at' },
  { value: 'payout_eligible_at', label: 'payout_eligible_at' },
  { value: 'settled_at', label: 'settled_at' },
  { value: 'fiscalized_at', label: 'fiscalized_at' },
  { value: 'document_generated_at', label: 'document_generated_at' },
  { value: 'excluded_at', label: 'excluded_at' },
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

export const matchesSearch = (transaction: Transaction, query: string): boolean => {
  const trimmed = query.trim().toLowerCase();
  if (!trimmed) return true;

  const fields = [transaction.transactionId, transaction.reference, transaction.user?.name, transaction.user?.email, transaction.organization];

  return fields.some((field) => field?.toLowerCase().includes(trimmed));
};
