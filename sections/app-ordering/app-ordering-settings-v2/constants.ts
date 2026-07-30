import { CustomBadgeVariant, DeliveryOptionStatus, DeliveryOptionType, OrderingSettings, SessionLengthMinutes, TipPresetUnit } from './types';

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
  { id: 'type', label: 'Type', align: 'left', sortable: true, sortKey: 'type' },
  { id: 'status', label: 'Status', align: 'left', sortable: true, sortKey: 'status' },
  { id: 'actions', label: 'Action', align: 'center' },
];

// ============================================================
// Tips
// ============================================================

export const TIP_UNIT_CONFIG: Record<TipPresetUnit, { symbol: string; label: string }> = {
  percentage: { symbol: '%', label: 'Percentage' },
  fixed: { symbol: '€', label: 'Fixed amount' },
};

export const TIP_UNIT_OPTIONS: { value: TipPresetUnit; label: string }[] = [
  { value: 'percentage', label: TIP_UNIT_CONFIG.percentage.symbol },
  { value: 'fixed', label: TIP_UNIT_CONFIG.fixed.symbol },
];

/** Guard rails so the checkout chip row stays usable. */
export const MAX_TIP_PRESETS = 6;
export const MAX_TIP_PERCENTAGE = 100;
export const MAX_TIP_FIXED_AMOUNT = 999;

// ============================================================
// Order timing
// ============================================================

export const SESSION_LENGTH_OPTIONS: { value: SessionLengthMinutes; label: string }[] = [
  { value: 15, label: '15 minutes' },
  { value: 20, label: '20 minutes' },
  { value: 30, label: '30 minutes' },
  { value: 45, label: '45 minutes' },
  { value: 60, label: '60 minutes' },
];

// ============================================================
// Defaults — used for a venue that has never saved settings
// ============================================================

export const DEFAULT_ORDERING_SETTINGS: OrderingSettings = {
  payment: {
    inAppPayment: true,
    payNow: true,
  },
  tips: {
    enabled: false,
    presets: [],
    allowCustomAmount: false,
  },
  deliveryOptions: [],
  orderTiming: {
    sessionTimerEnabled: false,
    sessionLengthMinutes: 30,
  },
};
