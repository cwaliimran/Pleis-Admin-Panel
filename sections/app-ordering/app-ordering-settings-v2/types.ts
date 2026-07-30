// ============================================================
// Ordering Settings V2 — domain types
//
// These mirror the shape the backend is expected to expose at
// `inAppOrderingSettings`. Until those endpoints exist the shape is
// served by `mock-data.ts` through `use-ordering-settings.ts`.
// ============================================================

export type UserType = 'organizer' | 'super-admin';

/** Mirrors the variants accepted by the shared `CustomBadge` chip. */
export type CustomBadgeVariant = 'success' | 'error' | 'info' | 'warning' | 'default';

// ---------- Payment ----------

export interface PaymentSettings {
  /** Master switch for the connected payment provider. When off, cash at the venue is the only option. */
  inAppPayment: boolean;
  /** true → charge at checkout. false → pay later, bill settled after delivery. */
  payNow: boolean;
}

// ---------- Tips ----------

export type TipPresetUnit = 'percentage' | 'fixed';

export interface TipPreset {
  id: string;
  unit: TipPresetUnit;
  value: number;
}

export interface TipSettings {
  enabled: boolean;
  /** Order is meaningful — it drives the chip order shown to the customer. */
  presets: TipPreset[];
  allowCustomAmount: boolean;
}

// ---------- Delivery options ----------

export type DeliveryOptionType = 'counterPickup' | 'tableDelivery' | 'toGo';

export type DeliveryOptionStatus = 'active' | 'inactive';

export interface DeliveryOption {
  id: string;
  name: string;
  type: DeliveryOptionType;
  status: DeliveryOptionStatus;
  /** Populated once a QR code has been generated for this option. */
  qrCodeUrl?: string | null;
}

export type DeliveryOptionPayload = Pick<DeliveryOption, 'name' | 'type' | 'status'>;

// ---------- Order timing ----------

export type SessionLengthMinutes = 15 | 20 | 30 | 45 | 60;

export interface OrderTimingSettings {
  sessionTimerEnabled: boolean;
  sessionLengthMinutes: SessionLengthMinutes;
}

// ---------- Aggregate ----------

export interface OrderingSettings {
  payment: PaymentSettings;
  tips: TipSettings;
  deliveryOptions: DeliveryOption[];
  orderTiming: OrderTimingSettings;
}

// ---------- Table sorting (delivery options list) ----------

export type SortDirection = 'asc' | 'desc' | null;
