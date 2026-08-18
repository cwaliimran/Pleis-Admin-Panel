import type {
  ApiMenuCatalogue,
  ApiMenuCatalogueItem,
  ApiOrder,
  ApiOrderItem,
  ApiOrderingStatus,
  ApiOrdersMeta,
} from '@/store/Reducer/order-management-v2-api';
import { DEFAULT_PAGE_LIMIT, DELIVERY_TYPE_CONFIG } from './constants';
import { MenuItemOption, Order, OrderCustomer, OrderItem, OrderPagination, OrderRound, OrderTabCounts, OrderingStatus } from './types';

// ============================================================
// Wire → view model
//
// The only place that knows both shapes. Everything downstream works with
// `Order` alone.
// ============================================================

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
 * `tableNumber` is only sent for table service; the other pickup types
 * carry their meaning in the type itself.
 */
const mapDeliveryLabel = (order: ApiOrder): string => {
  const typeLabel = DELIVERY_TYPE_CONFIG[order.pickupType]?.label || 'Delivery';
  if (order.pickupType !== 'tableService') return typeLabel;
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
 * The API has no round/batch field — delivery is tracked per item — so a
 * round is the set of items sharing a delivery state. Buckets keep the
 * order the API returned them in, which puts the earliest batch first.
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

export const mapApiOrder = (order: ApiOrder): Order => {
  const breakdown = order.priceBreakdown;

  return {
    id: order._id,
    orderNumber: order.orderNumber || '',
    placedAt: order.createdAt,
    customer: mapCustomer(order),
    deliveryType: order.pickupType,
    deliveryLabel: mapDeliveryLabel(order),
    tableNumber: order.tableNumber?.trim() || '',
    paymentType: order.paymentMethod,
    paymentStatus: order.paymentStatus,
    status: order.status,
    rounds: mapRounds(order),
    subtotal: breakdown?.itemsTotal ?? order.totalPrice ?? 0,
    tipAmount: breakdown?.tip ?? 0,
    total: breakdown?.finalTotal ?? order.totalPrice ?? 0,
    // Not sent by the API yet; kept so the detail row lights up when it is.
    rejectionReason: undefined,
    rejectionNote: undefined,
  };
};

export const mapApiOrders = (orders: ApiOrder[]): Order[] => (orders ?? []).map(mapApiOrder);

/** Tab badges come from `constantData`, which is returned for both tabs. */
export const mapTabCounts = (meta: ApiOrdersMeta | null | undefined): OrderTabCounts => ({
  active: meta?.constantData?.activeCount ?? 0,
  past: meta?.constantData?.rejectedCompletedCount ?? 0,
});

/**
 * The status endpoint returns only `{ _id, isOrderingEnabled }`. `openedBy`,
 * `openedAt` and `venueName` have no source yet — they stay empty and the
 * copy that used them is commented out in the view.
 */
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

/**
 * Flattens the grouped `menu` into one selectable list. `recommended` is
 * skipped — its items all appear under `menu` too — and so are `combos`,
 * which the update endpoint cannot express.
 */
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

export const mapPagination = (meta: ApiOrdersMeta | null | undefined, fallbackPage: number, fallbackLimit: number): OrderPagination => ({
  currentPage: meta?.currentPage ?? fallbackPage,
  totalPages: meta?.totalPages ?? 0,
  totalRecords: meta?.totalRecords ?? 0,
  limit: meta?.limit ?? fallbackLimit ?? DEFAULT_PAGE_LIMIT,
});
