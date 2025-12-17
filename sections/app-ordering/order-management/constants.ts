import { OrderStatus, DeliveryType } from './types';

export const STATUS_CONFIG: Record<OrderStatus, { label: string; className: string }> = {
  pending: { label: 'Pending', className: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400' },
  sent: { label: 'Sent', className: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400' },
  preparing: { label: 'Preparing', className: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400' },
  delivered: { label: 'Delivered', className: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' },
  'waiting-payment': { label: 'Waiting Payment', className: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400' },
  paid: { label: 'Paid', className: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400' },
  canceled: { label: 'Canceled', className: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400' },
};

export const DELIVERY_TYPE_CONFIG: Record<DeliveryType, { icon: string; label: string }> = {
  table: { icon: '🍽️', label: 'Table' },
  pickup: { icon: '🥡', label: 'Pickup' },
  togo: { icon: '🛍️', label: 'To Go' },
};

export const TAB_CONFIG = [
  { id: 'active' as const, label: 'Active Orders' },
  { id: 'preorders' as const, label: 'Preorders' },
  { id: 'past' as const, label: 'Past Orders' },
];

export const ACTIVE_ORDER_SUB_TABS = [
  { id: 'new-order' as const, label: 'New Order' },
  { id: 'in-progress' as const, label: 'In Progress' },
  { id: 'completed' as const, label: 'Completed' },
];

export const DELIVERY_FILTER_BUTTONS = [
  { id: 'all' as const, label: 'All' },
  { id: 'table' as const, label: 'Table' },
  { id: 'togo' as const, label: 'To go' },
  { id: 'preorders' as const, label: 'Preorders' },
];

export const FILTER_STATUS_OPTIONS: { id: OrderStatus; label: string }[] = [
  { id: 'sent', label: 'Sent' },
  { id: 'preparing', label: 'Preparing' },
  { id: 'delivered', label: 'Delivered' },
  { id: 'waiting-payment', label: 'Waiting for Payment' },
];

export const FILTER_DELIVERY_OPTIONS: { id: DeliveryType; label: string }[] = [
  { id: 'table', label: 'Table Service' },
  { id: 'pickup', label: 'Pickup' },
  { id: 'togo', label: 'To Go' },
];
