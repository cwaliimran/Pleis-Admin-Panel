import { Reservation } from '../../types/types';

export type PresetId =
  | 'todays_arrivals'
  | 'awaiting_payment_deadline_passed'
  | 'no_shows_with_forfeited_voucher'
  | 'vouchers_with_balance_expiring_soon'
  | 'free_reservations'
  | 'prepaid_reservations';

export interface PresetOption {
  id: PresetId;
  label: string;
  predicate: (reservation: Reservation) => boolean;
}

export const PRESET_OPTIONS: PresetOption[] = [
  { id: 'todays_arrivals', label: "Today's arrivals", predicate: (r) => r.isToday },
  { id: 'awaiting_payment_deadline_passed', label: 'Awaiting payment, deadline passed', predicate: (r) => r.status === 'awaiting_payment' && Boolean(r.deadlinePassed) },
  { id: 'no_shows_with_forfeited_voucher', label: 'No-shows with a forfeited voucher', predicate: (r) => r.status === 'no_show' && r.voucher?.status === 'FORFEITED' },
  {
    id: 'vouchers_with_balance_expiring_soon',
    label: 'Vouchers with balance, expiring in 7 days',
    predicate: (r) => Boolean(r.voucher && r.voucher.balance > 0 && r.voucher.expiringWithin7Days),
  },
  { id: 'free_reservations', label: 'Free reservations', predicate: (r) => r.condition === 'free' },
  { id: 'prepaid_reservations', label: 'Prepaid reservations', predicate: (r) => r.condition === 'minimum_spend' },
];

export const DATE_BASIS_OPTIONS = [
  { value: 'slot_start', label: 'slot_start' },
  { value: 'created_at', label: 'created_at' },
  { value: 'confirmed_at', label: 'confirmed_at' },
  { value: 'checked_in_at', label: 'checked_in_at' },
  { value: 'cancelled_at', label: 'cancelled_at' },
];

export const PERIOD_OPTIONS = [
  { value: 'current_working_day', label: 'Current working day' },
  { value: 'last_30_days', label: 'Last 30 days' },
  { value: 'yesterday', label: 'Yesterday' },
  { value: 'last_7_days', label: 'Last 7 days' },
  { value: 'this_month', label: 'This month' },
  { value: 'last_month', label: 'Last month' },
  { value: 'custom_range', label: 'Custom range...' },
];

export const matchesSearch = (reservation: Reservation, query: string): boolean => {
  const trimmed = query.trim().toLowerCase();
  if (!trimmed) return true;

  const fields = [reservation.reservationId, reservation.guestName, reservation.contactPhone, reservation.voucher?.code];
  return fields.some((field) => field?.toLowerCase().includes(trimmed));
};
