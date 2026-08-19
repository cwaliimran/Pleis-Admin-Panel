import { createApi } from '@reduxjs/toolkit/query/react';
import API_ROUTES from '../apiRoutes';
import { customFetchBaseQueryWithRoleRouting } from '../utils/customFetchBaseQueryWithRoleRouting';

// ============================================================
// Promotions V2 — API slice
//
// Owns the wire format only. The view model and the mapping between the two
// live in `sections/loyalty-modules/promotions-v2`.
//
// Note the backend's own spellings: `promotionType` uses `extraPointsForItem`
// and `productSale` where the UI says "extra points" and "item discount", the
// per-type amounts are `extraPoints` / `pointsMultiplier` / `discountedPercent`,
// and the metrics are `totalViews` / `totalFavorites` / `participants`. They are
// kept verbatim here and renamed once, in the view hook.
// ============================================================

export type ApiPromotionStatus = 'active' | 'inactive';

/** `claimPromotion` is legacy and may still come back on old records. */
export type ApiPromotionType = 'extraPointsForItem' | 'happyHour' | 'productSale' | 'claimPromotion';

/** Populated, not an id — the list endpoint inlines the title. */
export interface ApiPromotionMenuItem {
  _id: string;
  title: string;
}

export interface ApiPromotionActiveDaysObject {
  /** `selective` is the backend's word for "specific days only". */
  mode?: 'all' | 'selective';
  days?: string[];
  _id?: string;
}

/** Older records send a bare weekday array instead of the object. */
export type ApiPromotionActiveDays = ApiPromotionActiveDaysObject | string[] | null;

export interface ApiPromotion {
  _id: string;
  title: string;
  image?: string;
  description?: string;
  promotionType: ApiPromotionType;
  status: ApiPromotionStatus;
  companyOrganizer?: string;

  /** Usually `yyyy-MM-dd`, but some records carry a time too. */
  startDate?: string;
  endDate?: string;
  /** 24h `HH:mm`, or `null` for no time restriction. */
  startTime?: string | null;
  endTime?: string | null;
  activeDays?: ApiPromotionActiveDays;

  /** `extraPointsForItem` and `productSale` only. */
  menuItem?: ApiPromotionMenuItem[];
  /** `extraPointsForItem` only. */
  extraPoints?: number;
  /** `happyHour` only. */
  pointsMultiplier?: number;
  /** `productSale` only, as a whole percent off. */
  discountedPercent?: number;

  createdAt?: string;
  updatedAt?: string;

  // ---- Server-computed metrics ----
  totalViews?: number;
  totalFavorites?: number;
  participants?: number;
  pointsAwarded?: number;
  avgPointsPerParticipant?: number;
  /** Whole percent. */
  viewToParticipantPercentage?: number;

  recurringDetails?: unknown;
}

export interface ApiPromotionTypeBreakdown {
  promotionType: ApiPromotionType;
  participants: number;
  pointsAwarded: number;
  totalViews: number;
  totalFavorites: number;
}

export interface ApiPromotionsMeta {
  _id?: string | null;

  // ---- Aggregates across every promotion ----
  totalViews?: number;
  totalFavorites?: number;
  totalParticipants?: number;
  totalPointsAwarded?: number;
  promotionTypeBreakdown?: ApiPromotionTypeBreakdown[];
  /** The type with the most participants — a category, not one promotion. */
  highestPromotionType?: { promotionType: ApiPromotionType; participants: number } | null;

  // ---- Pagination ----
  // Not returned yet. Read when present so paging starts working as soon as
  // the backend adds these; until then the view falls back to a single page.
  currentPage?: number;
  totalPages?: number;
  totalRecords?: number;
  limit?: number;
}

export interface GetPromotionsV2Args {
  companyOrganizer: string;
  /** 1-based, matching what the API expects. */
  page: number;
  limit: number;
  /** Free-text title search. */
  keyword?: string;
  status?: ApiPromotionStatus;
  /** ISO `yyyy-MM-dd`. Only promotions starting on or after this date. */
  startDate?: string;
  /** ISO `yyyy-MM-dd`. Only promotions ending on or before this date. */
  endDate?: string;
  promotionType?: ApiPromotionType;
}

export interface GetPromotionsV2Response {
  data: ApiPromotion[];
  meta: ApiPromotionsMeta | null;
}

// ============================================================
// Write shape
//
// Quirks the backend expects, kept verbatim from the documented payloads:
//  - `pointsMultiplier` goes over as a string ("1.5"), while `extraPoints` and
//    `discountedPercent` are real numbers.
//  - `activeDays.days` is omitted entirely when the mode is `all`.
//  - `menuItem` is a plain array of ids on write, even though the read side
//    returns populated `{ _id, title }` objects.
//  - `image` is an Azure blob key, not a full URL.
// ============================================================

export interface PromotionActiveDaysBody {
  mode: 'all' | 'selective';
  days?: string[];
}

export interface PromotionWriteBody {
  companyOrganizer: string;
  /** Azure blob key, not a full URL. */
  image: string;
  promotionType: ApiPromotionType;
  title: string;
  description?: string;
  /** ISO `yyyy-MM-dd`. */
  startDate: string;
  endDate: string;
  /** 24h `HH:mm`. Optional for every type. */
  startTime?: string;
  endTime?: string;
  status: ApiPromotionStatus;
  activeDays: PromotionActiveDaysBody;

  /** `extraPointsForItem` and `productSale` only. */
  menuItem?: string[];
  /** `extraPointsForItem` only. */
  extraPoints?: number;
  /** `happyHour` only — a string, per the API contract. */
  pointsMultiplier?: string;
  /** `productSale` only. */
  discountedPercent?: number;
}

export type CreatePromotionV2Args = PromotionWriteBody;

export interface UpdatePromotionV2Args extends PromotionWriteBody {
  id: string;
}

export interface PromotionMutationResponse {
  message?: string;
  data?: unknown;
}

export const promotionsV2Api = createApi({
  reducerPath: 'promotionsV2Api',
  baseQuery: customFetchBaseQueryWithRoleRouting(),
  tagTypes: ['promotions-v2'],

  endpoints: (builder) => ({
    getPromotionsV2: builder.query<GetPromotionsV2Response, GetPromotionsV2Args>({
      query: ({ companyOrganizer, page, limit, keyword, status, startDate, endDate, promotionType }) => {
        const params: Record<string, string | number> = { companyOrganizer, page, limit };

        // Each is left off entirely when the filter is cleared.
        if (keyword) params.keyword = keyword;
        if (status) params.status = status;
        if (startDate) params.startDate = startDate;
        if (endDate) params.endDate = endDate;
        if (promotionType) params.promotionType = promotionType;

        return {
          url: '',
          method: 'GET',
          params,
          roleBasedRouting: {
            adminRoute: API_ROUTES.ADMIN_LOYALTY_PROMOTIONS_V2,
            organizerRoute: API_ROUTES.ORGANIZER_LOYALTY_PROMOTIONS_V2,
            adminOnlyParams: ['companyOrganizer'],
          },
        };
      },
      transformResponse: (res: { data?: ApiPromotion[]; meta?: ApiPromotionsMeta }): GetPromotionsV2Response => ({
        data: res?.data ?? [],
        meta: res?.meta ?? null,
      }),
      providesTags: ['promotions-v2'],
    }),

    createPromotionV2: builder.mutation<PromotionMutationResponse, CreatePromotionV2Args>({
      query: (body) => ({
        url: '',
        method: 'POST',
        body,
        roleBasedRouting: {
          adminRoute: API_ROUTES.ADMIN_LOYALTY_PROMOTIONS_V2,
          organizerRoute: API_ROUTES.ORGANIZER_LOYALTY_PROMOTIONS_V2,
        },
      }),
      invalidatesTags: ['promotions-v2'],
    }),

    updatePromotionV2: builder.mutation<PromotionMutationResponse, UpdatePromotionV2Args>({
      query: ({ id, ...body }) => ({
        url: '',
        method: 'PUT',
        body,
        roleBasedRouting: {
          adminRoute: API_ROUTES.ADMIN_LOYALTY_PROMOTIONS_V2_BY_ID(id),
          organizerRoute: API_ROUTES.ORGANIZER_LOYALTY_PROMOTIONS_V2_BY_ID(id),
        },
      }),
      invalidatesTags: ['promotions-v2'],
    }),

    deletePromotionV2: builder.mutation<PromotionMutationResponse, { id: string }>({
      query: ({ id }) => ({
        url: '',
        method: 'DELETE',
        roleBasedRouting: {
          adminRoute: API_ROUTES.ADMIN_LOYALTY_PROMOTIONS_V2_BY_ID(id),
          organizerRoute: API_ROUTES.ORGANIZER_LOYALTY_PROMOTIONS_V2_BY_ID(id),
        },
      }),
      invalidatesTags: ['promotions-v2'],
    }),
  }),
});

export const {
  useGetPromotionsV2Query,
  useCreatePromotionV2Mutation,
  useUpdatePromotionV2Mutation,
  useDeletePromotionV2Mutation,
} = promotionsV2Api;
