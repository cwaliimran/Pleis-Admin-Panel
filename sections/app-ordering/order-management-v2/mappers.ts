import type {
  ApiComboCatalogueEntry,
  ApiMenuCatalogue,
  ApiMenuCatalogueItem,
  ApiOrder,
  ApiOrderCombo,
  ApiOrderComboItem,
  ApiOrderItem,
  ApiOrderingStatus,
  ApiOrdersMeta,
} from '@/store/Reducer/order-management-v2-api';
import type { ApiDeliveryOption } from '@/store/Reducer/delivery-options-api';
import { DEFAULT_PAGE_LIMIT, DELIVERY_TYPE_CONFIG } from './constants';
import {
  ComboOption,
  DeliveryOptionFilter,
  DeliveryType,
  MenuItemOption,
  Order,
  OrderCombo,
  OrderComboItem,
  OrderCustomer,
  OrderItem,
  OrderPagination,
  OrderRound,
  OrderTabCounts,
  OrderingStatus,
} from './types';

// Wire → view model. The only place that knows both shapes.

const EMPTY_CUSTOMER: OrderCustomer = { id: '', name: 'Unknown customer', username: '', email: '', tier: '', avatarUrl: null };

const mapCustomer = (order: ApiOrder): OrderCustomer => {
  const user = order.user;
  if (!user) return EMPTY_CUSTOMER;

  const fullName = [user.firstName, user.lastName].filter(Boolean).join(' ').trim();

  return {
    id: user._id || '',
    name: fullName || user.username || EMPTY_CUSTOMER.name,
    username: user.username || '',
    email: user.email || '',
    tier: order.clubMemberInfo?.tierKey || '',
    avatarUrl: user.profileIcon || null,
  };
};

/**
 * The backend renamed the pickup vocabulary; older orders still carry the
 * old spelling, so both are folded onto the current set here. Everything
 * downstream — the badges, the filters, the action rules — sees one set.
 */
const LEGACY_PICKUP_TYPE: Record<string, DeliveryType> = {
  tableService: 'tableDelivery',
  counter: 'counterPickup',
  togo: 'toGo',
};

const mapPickupType = (value: ApiOrder['pickupType']): DeliveryType => (LEGACY_PICKUP_TYPE[value] ?? value) as DeliveryType;

/**
 * `deliveryOption.title` is the backend's own wording and wins when present.
 * The `pickupType` lookup stays as the fallback for orders placed before
 * delivery options existed.
 */
const mapDeliveryLabel = (order: ApiOrder): string => {
  const optionTitle = order.deliveryOption?.title?.trim();
  if (optionTitle) return optionTitle;

  const pickupType = mapPickupType(order.pickupType);
  const typeLabel = DELIVERY_TYPE_CONFIG[pickupType]?.label || 'Delivery';
  if (pickupType !== 'tableDelivery') return typeLabel;
  return order.tableNumber?.trim() || typeLabel;
};

const mapItem = (item: ApiOrderItem): OrderItem => ({
  id: item._id,
  menuItemId: item.menuItem,
  name: item.menuItemSnapShot?.title?.trim() || 'Unknown item',
  quantity: item.quantity ?? 0,
  lineTotal: item.finalPrice ?? 0,
  // The API has no per-item instruction field yet.
  note: undefined,
});

/**
 * A round is the set of items sharing a delivery state — the API has no
 * batch field. Buckets keep API order, which puts the earliest batch first.
 */
const mapRounds = (order: ApiOrder): OrderRound[] => {
  const buckets = new Map<boolean, OrderRound>();

  (order.items ?? []).forEach((item) => {
    const isDelivered = Boolean(item.isdelivered);
    let bucket = buckets.get(isDelivered);

    if (!bucket) {
      bucket = {
        id: `${order._id}-${isDelivered ? 'delivered' : 'pending'}`,
        label: isDelivered ? 'Delivered items' : 'Not delivered yet',
        isDelivered,
        items: [],
      };
      buckets.set(isDelivered, bucket);
    }

    bucket.items.push(mapItem(item));
  });

  return [...buckets.values()];
};

const mapComboItem = (item: ApiOrderComboItem): OrderComboItem => ({
  id: item._id,
  menuItemId: item.menuItem,
  name: item.menuItemSnapShot?.title?.trim() || 'Unknown item',
});

/** The snapshot is the pricing fallback because it is what the customer saw. */
const mapCombo = (combo: ApiOrderCombo): OrderCombo => {
  const snapshot = combo.comboSnapShot;
  const quantity = combo.quantity ?? 0;
  const unitFinalPrice = combo.unitFinalPrice ?? snapshot?.salePrice ?? 0;

  return {
    id: combo._id,
    comboId: combo.combo,
    name: snapshot?.name?.trim() || 'Unknown combo',
    description: snapshot?.description?.trim() || '',
    quantity,
    isDelivered: Boolean(combo.isdelivered),
    priceMode: snapshot?.priceMode || '',
    unitPrice: combo.unitPrice ?? snapshot?.originalPrice ?? 0,
    unitFinalPrice,
    lineTotal: combo.finalPrice ?? unitFinalPrice * quantity,
    items: (combo.items ?? []).map(mapComboItem),
  };
};

const mapCombos = (order: ApiOrder): OrderCombo[] => (order.combos ?? []).map(mapCombo);

export const mapApiOrder = (order: ApiOrder): Order => {
  const breakdown = order.priceBreakdown;

  return {
    id: order._id,
    orderNumber: order.orderNumber || '',
    placedAt: order.createdAt,
    customer: mapCustomer(order),
    deliveryType: mapPickupType(order.pickupType),
    deliveryOption: {
      id: order.deliveryOption?._id || '',
      title: order.deliveryOption?.title?.trim() || '',
    },
    deliveryLabel: mapDeliveryLabel(order),
    tableNumber: order.tableNumber?.trim() || '',
    paymentType: order.paymentMethod,
    // The stricter flow, so a missing value never allows handing an order
    // over before it has been paid for.
    paymentTiming: order.paymentTiming || 'payNow',
    paymentStatus: order.paymentStatus,
    status: order.status,
    rounds: mapRounds(order),
    combos: mapCombos(order),
    subtotal: breakdown?.itemsTotal ?? order.totalPrice ?? 0,
    saleDiscount: breakdown?.saleDiscount ?? 0,
    promoDiscount: breakdown?.promoDiscount ?? 0,
    voucherDiscount: breakdown?.voucherDiscount ?? 0,
    tax: breakdown?.tax ?? 0,
    promoCode: breakdown?.promoCode?.trim() || '',
    tipAmount: breakdown?.tip ?? 0,
    total: breakdown?.finalTotal ?? order.totalPrice ?? 0,
    // Not sent by the API yet; kept so the detail row lights up when it is.
    rejectionReason: undefined,
    rejectionNote: undefined,
  };
};

export const mapApiOrders = (orders: ApiOrder[]): Order[] => (orders ?? []).map(mapApiOrder);

/** Returned for both tabs, so the badges are always in sync. */
export const mapTabCounts = (meta: ApiOrdersMeta | null | undefined): OrderTabCounts => ({
  active: meta?.constantData?.activeCount ?? 0,
  past: meta?.constantData?.rejectedCompletedCount ?? 0,
});

/** The endpoint returns only `{ _id, isOrderingEnabled }` — the rest has no source yet. */
export const mapOrderingStatus = (status: ApiOrderingStatus | null | undefined): OrderingStatus | null => {
  if (!status) return null;

  return {
    isOpen: Boolean(status.isOrderingEnabled),
    openedBy: null,
    openedAt: null,
    venueName: '',
  };
};

// ---------- Menu catalogue → picker options ----------

const mapMenuItemOption = (item: ApiMenuCatalogueItem, subCategory: string): MenuItemOption => ({
  id: item._id,
  name: item.title?.trim() || 'Unknown item',
  // `salePrice` already has any active discount applied.
  price: item.salePrice ?? item.basePrice ?? 0,
  category: item.subCategory?.trim() || subCategory,
  imageUrl: item.image || null,
  isAvailable: item.status !== 'inactive' && item.isAvailableInStock !== false,
});

/** `recommended` is skipped — its items all appear under `menu` too. */
export const mapMenuItemOptions = (catalogue: ApiMenuCatalogue | null | undefined): MenuItemOption[] => {
  const seen = new Set<string>();
  const options: MenuItemOption[] = [];

  (catalogue?.menu ?? []).forEach((group) => {
    (group.items ?? []).forEach((item) => {
      if (!item?._id || seen.has(item._id)) return;

      seen.add(item._id);
      options.push(mapMenuItemOption(item, group.subCategory));
    });
  });

  return options;
};

/** Billed at `salePrice` whatever the price mode; `originalPrice` only ever renders struck through. */
const mapComboOption = (combo: ApiComboCatalogueEntry): ComboOption => {
  const originalPrice = combo.originalPrice ?? 0;

  return {
    id: combo._id,
    name: combo.name?.trim() || 'Unknown combo',
    description: combo.description?.trim() || '',
    priceMode: combo.priceMode || '',
    price: combo.salePrice ?? originalPrice,
    originalPrice,
    isAvailable: combo.status !== 'inactive',
    items: (combo.menuItems ?? [])
      .filter((item) => item?._id)
      .map((item) => ({ id: item._id, name: item.title?.trim() || 'Unknown item' })),
  };
};

export const mapComboOptions = (catalogue: ApiMenuCatalogue | null | undefined): ComboOption[] => {
  const seen = new Set<string>();
  const options: ComboOption[] = [];

  (catalogue?.combos ?? []).forEach((combo) => {
    if (!combo?._id || seen.has(combo._id)) return;

    seen.add(combo._id);
    options.push(mapComboOption(combo));
  });

  return options;
};

/**
 * Inactive options are kept — an option can be retired while orders placed
 * against it are still in the list, and those have to stay filterable.
 */
export const mapDeliveryOptionFilters = (options: ApiDeliveryOption[] | null | undefined): DeliveryOptionFilter[] =>
  (options ?? [])
    .filter((option) => option?._id)
    .map((option) => ({
      id: option._id,
      title: option.title?.trim() || 'Untitled option',
      method: option.deliveryMethod,
      isActive: option.status !== 'inactive',
    }));

export const mapPagination = (meta: ApiOrdersMeta | null | undefined, fallbackPage: number, fallbackLimit: number): OrderPagination => ({
  currentPage: meta?.currentPage ?? fallbackPage,
  totalPages: meta?.totalPages ?? 0,
  totalRecords: meta?.totalRecords ?? 0,
  limit: meta?.limit ?? fallbackLimit ?? DEFAULT_PAGE_LIMIT,
});
