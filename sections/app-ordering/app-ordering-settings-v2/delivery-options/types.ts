import { CustomBadgeVariant } from '../types';

// ============================================================
// Delivery options — view model
//
// The wire shape lives in `store/Reducer/delivery-options-api.ts`;
// `mappers.ts` is the only place that knows both.
// ============================================================

export type DeliveryOptionType = 'counterPickup' | 'tableDelivery' | 'toGo';

export type DeliveryOptionStatus = 'active' | 'inactive';

export interface DeliveryOption {
  /** The record's `_id`. */
  id: string;
  /** `title` on the wire. */
  name: string;
  /** `deliveryMethod` on the wire. */
  type: DeliveryOptionType;
  status: DeliveryOptionStatus;
  /** Backend-generated; the customer-facing QR link is derived from it. */
  publicId: string | null;
}

export type DeliveryOptionPayload = Pick<DeliveryOption, 'name' | 'type' | 'status'>;

export type SortDirection = 'asc' | 'desc' | null;

export type { CustomBadgeVariant };
