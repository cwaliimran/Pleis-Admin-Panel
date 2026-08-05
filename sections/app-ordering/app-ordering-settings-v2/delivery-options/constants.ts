import { CustomBadgeVariant, DeliveryOptionStatus, DeliveryOptionType } from './types';

// ============================================================
// Delivery option type
// ============================================================

/** `variant` values feed `CustomBadge`, the shared chip used by every table in the app. */
export const DELIVERY_OPTION_TYPE_CONFIG: Record<DeliveryOptionType, { label: string; variant: CustomBadgeVariant }> = {
  counterPickup: { label: 'Counter pickup', variant: 'info' },
  tableDelivery: { label: 'Table delivery', variant: 'warning' },
  toGo: { label: 'To go', variant: 'error' },
};

export const DELIVERY_OPTION_TYPE_OPTIONS: { value: DeliveryOptionType; label: string }[] = (
  Object.keys(DELIVERY_OPTION_TYPE_CONFIG) as DeliveryOptionType[]
).map((type) => ({ value: type, label: DELIVERY_OPTION_TYPE_CONFIG[type].label }));

// ============================================================
// Delivery option status
// ============================================================

export const DELIVERY_OPTION_STATUS_CONFIG: Record<DeliveryOptionStatus, { label: string; variant: CustomBadgeVariant }> = {
  active: { label: 'Active', variant: 'success' },
  inactive: { label: 'Inactive', variant: 'error' },
};

export const DELIVERY_OPTION_STATUS_OPTIONS: { value: DeliveryOptionStatus; label: string }[] = [
  { value: 'active', label: 'Active' },
  { value: 'inactive', label: 'Inactive' },
];

// ============================================================
// Delivery options table
// ============================================================

export const DELIVERY_OPTIONS_TABLE_HEAD = [
  { id: 'name', label: 'Name', align: 'left', sortable: true, sortKey: 'name' },
  { id: 'type', label: 'Type', align: 'left' },
  { id: 'status', label: 'Status', align: 'left'},
  { id: 'actions', label: 'Action', align: 'center' },
];
