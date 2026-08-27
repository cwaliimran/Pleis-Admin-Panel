import { createApi } from '@reduxjs/toolkit/query/react';
import API_ROUTES from '../apiRoutes';
import { customFetchBaseQueryWithRoleRouting } from '../utils/customFetchBaseQueryWithRoleRouting';

// ============================================================
// Rewards V2 — API slice
//
// Owns the wire format only. The view model and the mapping between the two
// live in `sections/loyalty-modules/rewards-v2`.
//
// Note the backend's own spellings: `title` for the name, `sortingType` for
// the free-text grouping, `rewardType` for the creation method, and
// `minPointsRequiredToClaim` / `claimLimit` / `maxLimitPerUser` for the point
// cost and the two limits. They are kept verbatim here and renamed once, in
// the view hook.
// ============================================================

export type ApiRewardStatus = 'active' | 'inactive';

export type ApiRewardType = 'customReward' | 'buyMenuItemReward' | 'ticketReward';

/** Accepted `sortBy` values — these are the response's own field names. */
export type ApiRewardSortBy = 'title' | 'sortingType' | 'status' | 'views' | 'favoritesCount' | 'claimed' | 'redeemed' | 'conversion';

export type ApiRewardSortOrder = 'asc' | 'desc';

export interface ApiRewardTier {
  _id: string;
  title: string;
}

export interface ApiRewardMenu {
  _id: string;
  title: string;
}

/** Populated on `buyMenuItemReward` only, and only ever one item. */
export interface ApiRewardMenuItem {
  _id: string;
  title: string;
  menu?: ApiRewardMenu | null;
}

export interface ApiReward {
  _id: string;
  title: string;
  image?: string;
  description?: string;
  rewardType: ApiRewardType;
  sortingType?: string;
  /** ISO `yyyy-MM-dd`. */
  endDate?: string;
  minPointsRequiredToClaim?: number;
  /** `null` means unlimited. */
  claimLimit?: number | null;
  /** `null` means unlimited. Absent on older records. */
  maxLimitPerUser?: number | null;
  percentOff?: number;
  tierLimit?: ApiRewardTier | null;
  companyOrganizer?: string;
  status: ApiRewardStatus;

  /** Absent on older records; treated as browsable when missing. */
  availableAsReward?: boolean;
  challengeOnly?: boolean;
  isPromotionOnly?: boolean;

  menuItem?: ApiRewardMenuItem | null;

  /** Ticket rewards. Ids only — not populated. */
  event?: string | null;
  ticket?: string | null;
  timeSlot?: string | null;
  isFastTrack?: boolean;

  createdAt?: string;
  updatedAt?: string;

  // ---- Server-computed metrics ----
  views?: number;
  favoritesCount?: number;
  claimed?: number;
  redeemed?: number;
  /** Whole percent. */
  conversion?: number;
  /** Whole percent. */
  redemptionRate?: number;
}

export interface ApiRewardStats {
  totalViews?: number;
  totalFavorites?: number;
  totalClaims?: number;
  totalRedemptions?: number;
  /** `name` is `null` when nothing has been claimed yet. */
  mostClaimedReward?: { name: string | null; count: number } | null;
}

export interface ApiRewardsMeta {
  currentPage: number;
  totalPages: number;
  totalRecords: number;
  limit: number;
  stats?: ApiRewardStats | null;
}

export interface GetRewardsV2Args {
  /** Admin only — an organizer's token identifies the company, so it is omitted. */
  companyOrganizer?: string;
  /** 1-based, matching what the API returns in `meta.currentPage`. */
  page: number;
  limit: number;
  /** Free-text name search. */
  keyword?: string;
  status?: ApiRewardStatus;
  /** The free-text grouping value, not an id. */
  sortingType?: string;
  sortBy?: ApiRewardSortBy;
  sortOrder?: ApiRewardSortOrder;
}

export interface GetRewardsV2Response {
  data: ApiReward[];
  meta: ApiRewardsMeta | null;
}

// ============================================================
// Write shape
//
// Two quirks the backend expects and that are deliberate here:
//  - `availableAsReward` and `challengeOnly` go over as the strings "true" /
//    "false", even though the read side returns real booleans.
//  - `isPromotionOnly` is a real boolean.
// ============================================================

export type ApiBooleanString = 'true' | 'false';

export interface RewardWriteBody {
  rewardType: ApiRewardType;
  /** Azure blob key, not a full URL. */
  image: string;
  title: string;
  description?: string;
  sortingType: string;
  /** ISO `yyyy-MM-dd`. */
  endDate: string;
  minPointsRequiredToClaim: number;
  claimLimit?: number;
  maxLimitPerUser?: number;
  percentOff?: number;
  tierLimit: string;
  status: ApiRewardStatus;
  isPromotionOnly: boolean;
  availableAsReward: ApiBooleanString;
  challengeOnly: ApiBooleanString;

  /** `buyMenuItemReward` only. */
  menuItem?: string;
  /** `ticketReward` only. */
  event?: string;
  ticket?: string;
}

export interface CreateRewardArgs extends RewardWriteBody {
  /** Admin only — an organizer's token identifies the company, so it is omitted. */
  companyOrganizer?: string;
}

export interface UpdateRewardArgs extends RewardWriteBody {
  id: string;
  /** Admin only — an organizer's token identifies the company, so it is omitted. */
  companyOrganizer?: string;
}

export interface RewardMutationResponse {
  message?: string;
  data?: unknown;
}

export interface ApiRewardTypeOption {
  _id: string;
  sortingType: string;
}

export interface GetRewardTypesArgs {
  /** Admin only — an organizer's token identifies the company, so it is omitted. */
  companyOrganizer?: string;
  limit?: number;
}

export const rewardsV2Api = createApi({
  reducerPath: 'rewardsV2Api',
  baseQuery: customFetchBaseQueryWithRoleRouting(),
  tagTypes: ['rewards-v2', 'reward-types'],

  endpoints: (builder) => ({
    getRewardsV2: builder.query<GetRewardsV2Response, GetRewardsV2Args>({
      query: ({ companyOrganizer, page, limit, keyword, status, sortingType, sortBy, sortOrder }) => {
        const params: Record<string, string | number> = { page, limit };
        // Omitted for organizers — the token identifies the company.
        if (companyOrganizer) params.companyOrganizer = companyOrganizer;

        // Each is left off entirely when the filter is cleared.
        if (keyword) params.keyword = keyword;
        if (status) params.status = status;
        if (sortingType) params.sortingType = sortingType;
        // Only a complete pair is a sort; either half alone is meaningless.
        if (sortBy && sortOrder) {
          params.sortBy = sortBy;
          params.sortOrder = sortOrder;
        }

        return {
          url: '',
          method: 'GET',
          params,
          roleBasedRouting: {
            adminRoute: API_ROUTES.ADMIN_LOYALTY_REWARDS_V2,
            organizerRoute: API_ROUTES.ORGANIZER_LOYALTY_REWARDS_V2,
            adminOnlyParams: ['companyOrganizer'],
          },
        };
      },
      transformResponse: (res: { data?: ApiReward[]; meta?: ApiRewardsMeta }): GetRewardsV2Response => ({
        data: res?.data ?? [],
        meta: res?.meta ?? null,
      }),
      providesTags: ['rewards-v2'],
    }),

    getRewardTypes: builder.query<ApiRewardTypeOption[], GetRewardTypesArgs>({
      query: ({ companyOrganizer, limit }) => {
        const params: Record<string, string | number> = {};
        // Omitted for organizers — the token identifies the company.
        if (companyOrganizer) params.companyOrganizer = companyOrganizer;
        if (limit !== undefined) params.limit = limit;

        return {
          url: '',
          method: 'GET',
          params,
          roleBasedRouting: {
            adminRoute: API_ROUTES.ADMIN_LOYALTY_REWARD_TYPES,
            organizerRoute: API_ROUTES.ORGANIZER_LOYALTY_REWARD_TYPES,
            adminOnlyParams: ['companyOrganizer'],
          },
        };
      },
      transformResponse: (res: { data?: ApiRewardTypeOption[] }): ApiRewardTypeOption[] => res?.data ?? [],
      providesTags: ['reward-types'],
    }),

    createRewardV2: builder.mutation<RewardMutationResponse, CreateRewardArgs>({
      query: (body) => ({
        url: '',
        method: 'POST',
        body,
        roleBasedRouting: {
          adminRoute: API_ROUTES.ADMIN_LOYALTY_REWARDS(false),
          organizerRoute: API_ROUTES.ORGANIZER_LOYALTY_REWARDS,
        },
      }),
      // A new reward can introduce a grouping value the Type filter has not seen.
      invalidatesTags: ['rewards-v2', 'reward-types'],
    }),

    updateRewardV2: builder.mutation<RewardMutationResponse, UpdateRewardArgs>({
      query: ({ id, ...body }) => ({
        url: '',
        method: 'PUT',
        body,
        roleBasedRouting: {
          adminRoute: API_ROUTES.ADMIN_LOYALTY_REWARDS_BY_ID(id, false),
          organizerRoute: API_ROUTES.ORGANIZER_LOYALTY_REWARDS_BY_ID(id),
        },
      }),
      invalidatesTags: ['rewards-v2', 'reward-types'],
    }),

    deleteRewardV2: builder.mutation<RewardMutationResponse, { id: string }>({
      query: ({ id }) => ({
        url: '',
        method: 'DELETE',
        roleBasedRouting: {
          adminRoute: API_ROUTES.ADMIN_LOYALTY_REWARDS_BY_ID(id, false),
          organizerRoute: API_ROUTES.ORGANIZER_LOYALTY_REWARDS_BY_ID(id),
        },
      }),
      invalidatesTags: ['rewards-v2', 'reward-types'],
    }),
  }),
});

export const {
  useGetRewardsV2Query,
  useGetRewardTypesQuery,
  useCreateRewardV2Mutation,
  useUpdateRewardV2Mutation,
  useDeleteRewardV2Mutation,
} = rewardsV2Api;
