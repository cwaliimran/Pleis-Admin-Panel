import { Order } from '../../types/types';

export type PresetId =
  | 'open_tabs'
  | 'off_app_awaiting_fiscalization'
  | 'cancelled_and_rejected'
  | 'orders_with_a_tip'
  | 'voucher_funded_orders'
  | 'unnotified_cancellations';

export interface PresetOption {
  id: PresetId;
  label: string;
  predicate: (order: Order) => boolean;
}

export const PRESET_OPTIONS: PresetOption[] = [
  { id: 'open_tabs', label: 'Open tabs', predicate: (o) => o.paymentType === 'pay_later' && o.status === 'awaiting_payment' },
  {
    id: 'off_app_awaiting_fiscalization',
    label: 'Off-app awaiting fiscalization',
    predicate: (o) => o.settlementTrack === 'offapp' && o.fiscalizationStatus !== 'FISCALIZED',
  },
  { id: 'cancelled_and_rejected', label: 'Cancelled and rejected', predicate: (o) => o.status === 'cancelled' || o.status === 'rejected' },
  { id: 'orders_with_a_tip', label: 'Orders with a tip', predicate: (o) => Boolean(o.tipAmount && o.tipAmount > 0) },
  { id: 'voucher_funded_orders', label: 'Voucher-funded orders', predicate: (o) => Boolean(o.voucherDiscount && o.voucherDiscount > 0) },
  { id: 'unnotified_cancellations', label: 'Unnotified cancellations', predicate: (o) => o.status === 'cancelled' && o.customerNotified === false },
];

export const DATE_BASIS_OPTIONS = [
  { value: 'order_created_at', label: 'order_created_at' },
  { value: 'paid_at', label: 'paid_at' },
  { value: 'delivered_at', label: 'delivered_at' },
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

export const matchesSearch = (order: Order, query: string): boolean => {
  const trimmed = query.trim().toLowerCase();
  if (!trimmed) return true;

  const fields = [order.orderReference, order.transactionRef, order.locationLabel, order.handledBy];
  return fields.some((field) => field?.toLowerCase().includes(trimmed));
};
