import type { ApiDeliveryOption, DeliveryOptionBody } from '@/store/Reducer/delivery-options-api';
import { DeliveryOption, DeliveryOptionPayload } from './types';

// ============================================================
// Wire ↔ view model
//
// The only place that knows both shapes. Everything downstream works
// with `DeliveryOption` alone.
// ============================================================

export const mapApiDeliveryOption = (option: ApiDeliveryOption): DeliveryOption => ({
  id: option._id,
  name: option.title ?? '',
  type: option.deliveryMethod,
  status: option.status,
  publicId: option.publicId ?? null,
});

export const mapApiDeliveryOptions = (options: ApiDeliveryOption[]): DeliveryOption[] => options.map(mapApiDeliveryOption);

/** The enums match the wire values, so only the two field names are renamed. */
export const toDeliveryOptionBody = (payload: DeliveryOptionPayload): DeliveryOptionBody => ({
  title: payload.name,
  deliveryMethod: payload.type,
  status: payload.status,
});
