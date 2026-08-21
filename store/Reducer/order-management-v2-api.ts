import { createApi } from '@reduxjs/toolkit/query/react';
import API_ROUTES from '../apiRoutes';
import { customFetchBaseQueryWithRoleRouting } from '../utils/customFetchBaseQueryWithRoleRouting';

// ============================================================
// Order Management V2 — API slice
//
// Owns the wire format only. The view model and the mapping between the
// two live in `sections/app-ordering/order-management-v2`.
// ============================================================

// ---------- Wire enums ----------

export type ApiOrderStatus = 'pending' | 'confirmed' | 'sent' | 'pendingPayment' | 'completed' | 'cancelled' | 'rejected' | 'preorder';

export type ApiPickupType = 'tableService' | 'counter' | 'togo';

export type ApiPaymentMethod = 'applePay' | 'card' | 'cash' | 'payLater';

export type ApiPaymentStatus = 'pending' | 'paid' | 'failed';

/** Which bucket of statuses to list — the backend decides the membership. */
export type ApiOrderTab = 'active' | 'past';

export type ApiDateRange = 'today' | 'yesterday' | 'last7days' | 'thisMonth';

// ---------- Wire shapes ----------

export interface ApiOrderUser {
  _id: string;
  username?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  profileIcon?: string | null;
}

/**
 * The snapshot is the full menu item as it was when ordered; only the
 * fields the order UI reads are typed here.
 */
export interface ApiMenuItemSnapShot {
  _id: string;
  title?: string;
  description?: string;
  image?: string | null;
  basePrice?: number;
  taxPercent?: number;
}

export interface ApiOrderItem {
  _id: string;
  menuItem: string;
  quantity: number;
  /** Per item, not per order — this is what groups items into rounds. */
  isdelivered: boolean;
  /** Line total for the whole quantity, not the unit price. */
  finalPrice: number;
  menuItemSnapShot?: ApiMenuItemSnapShot | null;
}

/** How a combo prices itself against the sum of its member items. */
export type ApiComboPriceMode = 'fixed_amount_off_sum' | 'fixed_combo_price' | 'percentage_off_sum';

/** A member item of a combo. It carries no quantity — one of each per combo unit. */
export interface ApiOrderComboItem {
  _id: string;
  menuItem: string;
  menuItemSnapShot?: ApiMenuItemSnapShot | null;
}

export interface ApiComboSnapShot {
  _id: string;
  name?: string;
  description?: string;
  priceMode?: ApiComboPriceMode;
  /** The price-mode's operand: an amount off, a percentage, or the fixed price. */
  price?: number;
  status?: string;
  /** Sum of the member items before the combo rule is applied. */
  originalPrice?: number;
  salePrice?: number;
  hasDiscount?: boolean;
}

/** Combos sit alongside `items` on an order, not inside it. */
export interface ApiOrderCombo {
  _id: string;
  /** The combo definition `_id`. */
  combo: string;
  quantity: number;
  /**
   * Not sent by the API yet — combos come back without any delivery state.
   * Read optimistically so the UI lights up the moment the backend adds it.
   */
  isdelivered?: boolean;
  items: ApiOrderComboItem[];
  /** Member-item sum for one unit, before the combo rule. */
  unitPrice: number;
  /** What one unit is actually billed at. */
  unitFinalPrice: number;
  saleDiscountPerUnit?: number;
  /** Line total for the whole quantity. */
  finalPrice: number;
  comboSnapShot?: ApiComboSnapShot | null;
}

export interface ApiPriceBreakdown {
  /** Already includes combos, counted at their pre-discount `unitPrice`. */
  itemsTotal: number;
  saleDiscount: number;
  promoDiscount: number;
  voucherDiscount?: number;
  tax: number;
  finalTotal: number;
  promoCode: string | null;
  /** Booked separately as "Napojnica" at 0% tax. */
  tip?: number;
}

export interface ApiOrderClubMemberInfo {
  _id: string;
  tierKey?: string | null;
}

export interface ApiOrder {
  _id: string;
  organization: string;
  user: ApiOrderUser | null;
  items: ApiOrderItem[];
  /** Absent on older orders; an order can also be combos-only with `items: []`. */
  combos?: ApiOrderCombo[];
  totalPrice: number;
  priceBreakdown?: ApiPriceBreakdown | null;
  status: ApiOrderStatus;
  paymentMethod: ApiPaymentMethod;
  paymentStatus: ApiPaymentStatus;
  orderType: string;
  pickupType: ApiPickupType;
  /** Present only when `pickupType` is `tableService`. */
  tableNumber?: string;
  orderNumber: string;
  createdAt: string;
  clubMemberInfo?: ApiOrderClubMemberInfo | null;
}

/** Tab badge counts — returned on every list response regardless of tab. */
export interface ApiOrdersConstantData {
  activeCount: number;
  rejectedCompletedCount: number;
}

export interface ApiOrdersMeta {
  currentPage: number;
  totalPages: number;
  totalRecords: number;
  limit: number;
  constantData?: ApiOrdersConstantData | null;
}

export interface GetOrdersV2Response {
  data: ApiOrder[];
  meta: ApiOrdersMeta | null;
}

/** In-app ordering switch, per organization. */
export interface ApiOrderingStatus {
  _id: string;
  isOrderingEnabled: boolean;
}

export interface UpdateOrderingStatusV2Args {
  organization: string;
  isOrderingEnabled: boolean;
}

/**
 * One endpoint drives every order mutation; the caller sends only the keys
 * that apply. Note the backend's lowercase `deliveredall`.
 */
export interface UpdateOrderV2Args {
  /** The order `_id`. */
  id: string;
  status?: ApiOrderStatus;
  paymentStatus?: ApiPaymentStatus;
  /** Comma-separated **menuItem** ids — not the order-item `_id`s. */
  deliveredMenuItem?: string;
  /**
   * Comma-separated order-combo line ids — the `combos[]._id`s on this order,
   * not the combo definition ids and not their member menu items. Note this
   * is keyed differently from `deliveredMenuItem` just above.
   */
  deliveredCombo?: string;
  deliveredall?: boolean;
  /** Sent with `status: 'rejected'` only. */
  reasonForRejection?: string;
  noteForRejection?: string;
  /** Sent with `status: 'cancelled'` only. */
  reasonForCancellation?: string;
  noteForCancellation?: string;
}

/**
 * One combo line on the update payload. `items` is the combo's member menu
 * item ids, and the backend expects `quantity` as a string.
 */
export interface UpdateOrderComboV2 {
  combo: string;
  items: string[];
  quantity: string;
}

/** Rewrites a still-pending order. `updateOrderV2` only advances its status. */
export interface UpdateOrderDetailsV2Args {
  /** The order `_id`. */
  id: string;
  items: { menuItem: string; quantity: number }[];
  /**
   * Sent on every rewrite, empty array included — the endpoint replaces the
   * whole list, so omitting it is how combos would be lost.
   */
  combos?: UpdateOrderComboV2[];
  /** The `_id` of the user the order belongs to. */
  userId?: string;
  pickupType?: ApiPickupType;
  /** Required by the backend when `pickupType` is `tableService`. */
  tableNumber?: string;
}

// ---------- Menu catalogue (for the update modal's item picker) ----------

/** The endpoint returns the full menu document; only what the picker reads is typed. */
export interface ApiMenuCatalogueItem {
  _id: string;
  title?: string;
  description?: string;
  image?: string | null;
  subCategory?: string;
  basePrice?: number;
  taxPercent?: number;
  /** Price after any active discount — this is what an order line is billed at. */
  salePrice?: number;
  originalPrice?: number;
  hasDiscount?: boolean;
  status?: string;
  isAvailableInStock?: boolean;
}

export interface ApiMenuCatalogueGroup {
  subCategory: string;
  items: ApiMenuCatalogueItem[];
}

/**
 * A combo as the catalogue offers it, before it is put on an order. Its
 * `menuItems` are fixed by the definition — the admin picks the combo as a
 * whole and sets a quantity, never its members.
 */
export interface ApiComboCatalogueEntry {
  _id: string;
  name?: string;
  description?: string;
  /** An object once populated, `null` for combos not tied to a sub-category. */
  subCategory?: { _id: string; title?: string; status?: string } | null;
  priceMode?: ApiComboPriceMode;
  price?: number;
  status?: string;
  menuItems?: ApiMenuCatalogueItem[];
  /** Sum of the member items before the combo rule. */
  originalPrice?: number;
  /** What one unit is billed at, after the rule. */
  salePrice?: number;
  hasDiscount?: boolean;
}

export interface ApiMenuCatalogue {
  organization?: { _id: string; basicInfo?: { name?: string } } | null;
  recommended?: ApiMenuCatalogueItem[];
  menu?: ApiMenuCatalogueGroup[];
  combos?: ApiComboCatalogueEntry[];
}

// ---------- Query args ----------

export interface GetOrdersV2Args {
  organization?: string;
  /** Which tab to list. */
  status: ApiOrderTab;
  /** 0-based here; the API is 1-based. */
  page: number;
  limit: number;
  keyword?: string;
  orderStatus?: ApiOrderStatus;
  pickupFilter?: ApiPickupType;
  paymentMethod?: ApiPaymentMethod;
  range?: ApiDateRange;
}

export const orderManagementV2Api = createApi({
  reducerPath: 'orderManagementV2Api',
  baseQuery: customFetchBaseQueryWithRoleRouting(),
  tagTypes: ['order-management-v2', 'order-management-v2-status', 'order-management-v2-menu'],

  endpoints: (builder) => ({
    getOrdersV2: builder.query<GetOrdersV2Response, GetOrdersV2Args>({
      query: ({ organization, status, page, limit, keyword, orderStatus, pickupFilter, paymentMethod, range }) => {
        const params: Record<string, string | number> = {
          page: page + 1,
          limit,
          status,
        };

        if (organization) params.organization = organization;
        if (keyword) params.keyword = keyword;
        if (orderStatus) params.orderStatus = orderStatus;
        if (pickupFilter) params.pickupFilter = pickupFilter;
        if (paymentMethod) params.paymentMethod = paymentMethod;
        if (range) params.range = range;

        return {
          url: '',
          method: 'GET',
          params,
          roleBasedRouting: {
            adminRoute: API_ROUTES.ADMIN_ORDER_MANAGEMENT_GET,
            organizerRoute: API_ROUTES.ORGANIZER_ORDER_MANAGEMENT_GET,
          },
        };
      },
      transformResponse: (res: { data?: ApiOrder[]; meta?: ApiOrdersMeta }): GetOrdersV2Response => ({
        data: res?.data ?? [],
        meta: res?.meta ?? null,
      }),
      providesTags: ['order-management-v2'],
    }),

    updateOrderV2: builder.mutation<{ message?: string; data?: ApiOrder }, UpdateOrderV2Args>({
      query: ({ id, status, paymentStatus, deliveredMenuItem, deliveredCombo, deliveredall, ...reasons }) => {
        const body: Record<string, unknown> = {};

        if (status) body.status = status;
        if (paymentStatus) body.paymentStatus = paymentStatus;
        if (deliveredMenuItem) body.deliveredMenuItem = deliveredMenuItem;
        if (deliveredCombo) body.deliveredCombo = deliveredCombo;
        if (deliveredall !== undefined) body.deliveredall = deliveredall;

        // Checked against `undefined`, not truthiness — an empty note is a
        // valid value the backend expects to receive.
        (['reasonForRejection', 'noteForRejection', 'reasonForCancellation', 'noteForCancellation'] as const).forEach((key) => {
          if (reasons[key] !== undefined) body[key] = reasons[key];
        });

        return {
          url: '',
          method: 'PUT',
          body,
          roleBasedRouting: {
            adminRoute: API_ROUTES.ADMIN_ORDER_MANAGEMENT_UPDATE(id),
            organizerRoute: API_ROUTES.ORGANIZER_ORDER_MANAGEMENT_UPDATE(id),
          },
        };
      },

      // No `invalidatesTags` — the caller refetches the list explicitly once
      // the write lands, so it can keep the table's loading bar suppressed
      // for the whole round trip. Invalidating here would refetch a second time.
    }),

    updateOrderDetailsV2: builder.mutation<{ message?: string; data?: ApiOrder }, UpdateOrderDetailsV2Args>({
      query: ({ id, items, combos, userId, pickupType, tableNumber }) => {
        const body: Record<string, unknown> = { items };

        // Checked against `undefined` rather than length — an empty array is
        // the caller saying "this order has no combos any more".
        if (combos !== undefined) body.combos = combos;
        if (userId) body.userId = userId;
        if (pickupType) body.pickupType = pickupType;
        if (tableNumber) body.tableNumber = tableNumber;

        return {
          url: '',
          method: 'PUT',
          body,
          roleBasedRouting: {
            adminRoute: API_ROUTES.ADMIN_ORDER_MANAGEMENT_UPDATE_ORDER(id),
            organizerRoute: API_ROUTES.ORGANIZER_ORDER_MANAGEMENT_UPDATE_ORDER(id),
          },
        };
      },

      // No `invalidatesTags`, for the same reason as `updateOrderV2` above.
    }),

    /** Unpaginated, and not role-routed — `/app/...` is shared by both roles. */
    getMenuItemsV2: builder.query<ApiMenuCatalogue | null, { organization?: string }>({
      query: ({ organization }) => ({
        url: API_ROUTES.APP_MENU_ITEMS_V2,
        method: 'GET',
        params: organization ? { organization } : {},
      }),
      transformResponse: (res: { data?: ApiMenuCatalogue }): ApiMenuCatalogue | null => res?.data ?? null,
      providesTags: ['order-management-v2-menu'],
    }),

    getOrderingStatusV2: builder.query<ApiOrderingStatus | null, { organization?: string }>({
      query: ({ organization }) => {
        const params: Record<string, string> = {};
        if (organization) params.organization = organization;

        return {
          url: '',
          method: 'GET',
          params,
          roleBasedRouting: {
            adminRoute: API_ROUTES.ADMIN_ORDER_MANAGEMENT_STATUS,
            organizerRoute: API_ROUTES.ORGANIZER_ORDER_MANAGEMENT_STATUS,
          },
        };
      },
      transformResponse: (res: { data?: ApiOrderingStatus }): ApiOrderingStatus | null => res?.data ?? null,
      providesTags: ['order-management-v2-status'],
    }),

    updateOrderingStatusV2: builder.mutation<{ message?: string; data?: boolean }, UpdateOrderingStatusV2Args>({
      query: ({ organization, isOrderingEnabled }) => ({
        url: '',
        method: 'PUT',
        body: { isOrderingEnabled },
        roleBasedRouting: {
          adminRoute: API_ROUTES.ADMIN_ORDER_MANAGEMENT_STATUS_BY_ID(organization),
          organizerRoute: API_ROUTES.ORGANIZER_ORDER_MANAGEMENT_STATUS_BY_ID(organization),
        },
      }),
      invalidatesTags: ['order-management-v2-status'],
    }),
  }),
});

export const {
  useGetOrdersV2Query,
  useUpdateOrderV2Mutation,
  useUpdateOrderDetailsV2Mutation,
  useGetMenuItemsV2Query,
  useGetOrderingStatusV2Query,
  useUpdateOrderingStatusV2Mutation,
} = orderManagementV2Api;
