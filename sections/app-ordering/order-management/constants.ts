import { ApiOrderStatus, ApiPickupType, ApiOrderType, FrontendDeliveryType } from './types';

export const STATUS_CONFIG: Record<ApiOrderStatus | 'preorder', { label: string; className: string }> = {
  pending: { label: 'New Order', className: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400' },
  confirmed: { label: 'In Progress', className: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400' },
  completed: { label: 'Completed', className: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' },
  cancelled: { label: 'Cancelled', className: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400' },
  preorder: { label: 'Preorder', className: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400' },
};

export const PAYMENT_STATUS_CONFIG: Record<'pending' | 'paid' | 'failed', { label: string; className: string }> = {
  pending: {
    label: 'Pending',
    className: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
  },
  paid: {
    label: 'Paid',
    className: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  },
  failed: {
    label: 'Failed',
    className: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
  },
};

export const DELIVERY_TYPE_CONFIG: Record<FrontendDeliveryType, { icon: string; label: string }> = {
  table: { icon: '🍽️', label: 'Table Service' },
  togo: { icon: '🛍️', label: 'To Go' },
  preorder: { icon: '📅', label: 'Preorder' },
  counter: { icon: '🏪', label: 'Counter' },
};

export const ORDER_TYPE_CONFIG: Record<ApiOrderType, { label: string; className: string }> = {
  walkIn: { label: 'Walk-in', className: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' },
  preorder: { label: 'Preorder', className: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400' },
  online: { label: 'Online', className: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' },
  qr: { label: 'QR', className: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400' },
  phone: { label: 'Phone', className: 'bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-400' },
};

export const TAB_CONFIG = [
  { id: 'active' as const, label: 'Active Orders' },
  { id: 'preorders' as const, label: 'Preorders' },
  { id: 'past' as const, label: 'Past Orders' },
];

export const ACTIVE_ORDER_SUB_TABS = [
  { id: 'new-order' as const, label: 'New Order' },
  { id: 'in-progress' as const, label: 'In Progress' },
  { id: 'completed' as const, label: 'Waiting For Payment' },
];

export const DELIVERY_FILTER_BUTTONS = [
  { id: 'all' as const, label: 'All' },
  { id: 'counter' as const, label: 'Counter' },
  { id: 'tableService' as const, label: 'Table' },
  { id: 'togo' as const, label: 'To go' },
  { id: 'preorder' as const, label: 'Preorders' },
];

export const FILTER_STATUS_OPTIONS: { id: ApiOrderStatus; label: string }[] = [
  { id: 'pending', label: 'New Order' },
  { id: 'confirmed', label: 'In Progress' },
  { id: 'completed', label: 'Completed' },
  { id: 'cancelled', label: 'Cancelled' },
  { id: 'preorder', label: 'Preorder' },
];

export const FILTER_DELIVERY_OPTIONS: { id: FrontendDeliveryType; label: string }[] = [
  { id: 'table', label: 'Table Service' },
  { id: 'togo', label: 'To Go' },
  { id: 'preorder', label: 'Preorder' },
  { id: 'counter', label: 'Counter' },
];

// API parameter mappings
export const API_ORDER_STATUS_MAP = {
  active: 'active',
  preorders: 'preorder',
  past: 'postorders',
} as const;

export const API_ACTIVE_SUB_TAB_MAP = {
  'new-order': 'new',
  'in-progress': 'inProgress',
  completed: 'completed',
} as const;

// Helper to map API pickupType to frontend deliveryType
export const mapPickupTypeToDeliveryType = (pickupType?: ApiPickupType): FrontendDeliveryType => {
  if (pickupType === 'tableService') return 'table';
  if (pickupType === 'togo') return 'togo';
  if (pickupType === 'preorder') return 'preorder';
  if (pickupType === 'counter') return 'counter';
  return 'table'; // default
};

// Helper to map frontend deliveryFilter to API pickupType
export const mapDeliveryFilterToPickupType = (filter: 'all' | 'tableService' | 'togo' | 'preorder' | 'counter'): string | undefined => {
  if (filter === 'all') return undefined;
  return filter;
};
