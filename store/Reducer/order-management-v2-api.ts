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

export type ApiPaymentMethod = 'applePay' | 'card' | 'cash';

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

export interface ApiPriceBreakdown {
  itemsTotal: number;
  saleDiscount: number;
  promoDiscount: number;
  tax: number;
  finalTotal: number;
  promoCode: string | null;
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
  deliveredall?: boolean;
  /** Sent with `status: 'rejected'` only. */
  reasonForRejection?: string;
  noteForRejection?: string;
  /** Sent with `status: 'cancelled'` only. */
  reasonForCancellation?: string;
  noteForCancellation?: string;
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
  tagTypes: ['order-management-v2', 'order-management-v2-status'],

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
      query: ({ id, status, paymentStatus, deliveredMenuItem, deliveredall, ...reasons }) => {
        const body: Record<string, unknown> = {};

        if (status) body.status = status;
        if (paymentStatus) body.paymentStatus = paymentStatus;
        if (deliveredMenuItem) body.deliveredMenuItem = deliveredMenuItem;
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

export const { useGetOrdersV2Query, useUpdateOrderV2Mutation, useGetOrderingStatusV2Query, useUpdateOrderingStatusV2Mutation } = orderManagementV2Api;
