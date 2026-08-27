import { createApi } from '@reduxjs/toolkit/query/react';
import API_ROUTES from '../apiRoutes';
import { customFetchBaseQueryWithRoleRouting } from '../utils/customFetchBaseQueryWithRoleRouting';

// ============================================================
// Streaks V2 — API slice
//
// Two unrelated resources sit behind this slice:
//  - `users-streaks`, the read-only per-member records the app maintains,
//  - `streaks`, the single global rule set an admin edits.
//
// Owns the wire format only. The view model and the mapping between the two
// live in `sections/loyalty-modules/streaks-v2`.
//
// Note the backend's own naming: the member is nested under `user`, the earned
// tier is `badge` (empty string, not null, before the first one), the header
// aggregates hang off `meta.UsersStreaksCount`, and the rule ladder is an array
// of `{ title, visits }` rather than a per-tier object. All kept verbatim here
// and renamed once, in the view hook.
// ============================================================

export type ApiStreakBadge = 'bronze' | 'silver' | 'gold' | 'platinum';

export type ApiStreakCountBase = 'day' | 'week' | 'month';

/**
 * Accepted `sortBy` values. Note the name columns use the API's own spellings
 * (`userName`, `userFirstName`) and that there is no badge sort.
 */
export type ApiUserStreakSortBy = 'userName' | 'userFirstName' | 'streak' | 'longestStreak' | 'visits' | 'status' | 'lastVisitAt';

export type ApiStreakSortOrder = 'asc' | 'desc';

export interface ApiStreakUser {
  _id: string;
  profileIcon?: string;
  firstName?: string;
  lastName?: string;
  username?: string;
  email?: string;
}

export interface ApiUserStreak {
  _id: string;
  user?: ApiStreakUser | null;
  companyOrganizer?: string;
  organization?: string;
  organizationLogo?: string;

  visits?: number;
  streak?: number;
  longestStreak?: number;
  /** `''` — not `null` — until the first badge is earned. */
  badge?: ApiStreakBadge | '';
  /** ISO datetime. */
  lastVisitAt?: string;
  lastBadgeAwardedAt?: string | null;

  createdAt?: string;
  updatedAt?: string;
}

/** Header aggregates, computed across every member rather than the page. */
export interface ApiUsersStreaksCount {
  highestStreak?: number;
  totalBadgesAwarded?: number;
  averageStreak?: number;
  topStreaker?: {
    name?: string;
    username?: string;
    streak?: number;
    visits?: number;
    badge?: ApiStreakBadge | '';
  } | null;
}

export interface ApiUsersStreaksMeta {
  currentPage: number;
  totalPages: number;
  totalRecords: number;
  limit: number;
  UsersStreaksCount?: ApiUsersStreaksCount | null;
}

export interface GetUsersStreaksArgs {
  /** Admin only — an organizer's token identifies the company, so it is omitted. */
  companyOrganizer?: string;
  /** 1-based, matching what the API returns in `meta.currentPage`. */
  page: number;
  limit: number;
  /** Free-text search across username and name. */
  keyword?: string;
  badge?: ApiStreakBadge;
  /** ISO `yyyy-MM-dd`. Note the backend's spelling — "visited", not "visit". */
  lastVisitedFrom?: string;
  sortBy?: ApiUserStreakSortBy;
  sortOrder?: ApiStreakSortOrder;
}

export interface GetUsersStreaksResponse {
  data: ApiUserStreak[];
  meta: ApiUsersStreaksMeta | null;
}

// ============================================================
// Rule set
//
// One document per company. There is no create/update split: the PUT upserts,
// so the modal always sends the same request whether or not a rule set exists.
// ============================================================

export interface ApiStreakBadgeRule {
  title: ApiStreakBadge;
  /** Consecutive visits needed to earn the tier. */
  visits: number;
  _id?: string;
}

export interface ApiStreakRules {
  _id?: string;
  countBase?: ApiStreakCountBase;
  badges?: ApiStreakBadgeRule[];
  companyOrganizer?: string;
  status?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface UpdateStreakRulesArgs {
  /** Admin only — an organizer's token identifies the company, so it is omitted. */
  companyOrganizer?: string;
  countBase: ApiStreakCountBase;
  /** Sent in tier order; `_id` is read-only and deliberately not echoed back. */
  badges: { title: ApiStreakBadge; visits: number }[];
}

export interface StreakRulesMutationResponse {
  message?: string;
  data?: unknown;
}

export const streaksV2Api = createApi({
  reducerPath: 'streaksV2Api',
  baseQuery: customFetchBaseQueryWithRoleRouting(),
  tagTypes: ['users-streaks', 'streak-rules'],

  endpoints: (builder) => ({
    getUsersStreaks: builder.query<GetUsersStreaksResponse, GetUsersStreaksArgs>({
      query: ({ companyOrganizer, page, limit, keyword, badge, lastVisitedFrom, sortBy, sortOrder }) => {
        const params: Record<string, string | number> = { page, limit };
        // Omitted for organizers — the token identifies the company.
        if (companyOrganizer) params.companyOrganizer = companyOrganizer;

        // Each is left off entirely when the filter is cleared.
        if (keyword) params.keyword = keyword;
        if (badge) params.badge = badge;
        if (lastVisitedFrom) params.lastVisitedFrom = lastVisitedFrom;
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
            adminRoute: API_ROUTES.ADMIN_LOYALTY_USERS_STREAKS,
            organizerRoute: API_ROUTES.ORGANIZER_LOYALTY_USERS_STREAKS,
            adminOnlyParams: ['companyOrganizer'],
          },
        };
      },
      transformResponse: (res: { data?: ApiUserStreak[]; meta?: ApiUsersStreaksMeta }): GetUsersStreaksResponse => ({
        data: res?.data ?? [],
        meta: res?.meta ?? null,
      }),
      providesTags: ['users-streaks'],
    }),

    getStreakRules: builder.query<ApiStreakRules | null, { companyOrganizer?: string }>({
      query: ({ companyOrganizer }) => ({
        url: '',
        method: 'GET',
        params: { companyOrganizer },
        roleBasedRouting: {
          adminRoute: API_ROUTES.ADMIN_LOYALTY_STREAKS,
          organizerRoute: API_ROUTES.ORGANIZER_LOYALTY_STREAKS,
          adminOnlyParams: ['companyOrganizer'],
        },
      }),
      // A company with no rule set yet answers 200 with `data: {}`, which is
      // collapsed to `null` here so "never configured" is a single check.
      transformResponse: (res: { data?: ApiStreakRules }): ApiStreakRules | null => {
        const rules = res?.data;
        return rules && Object.keys(rules).length > 0 ? rules : null;
      },
      providesTags: ['streak-rules'],
    }),

    updateStreakRules: builder.mutation<StreakRulesMutationResponse, UpdateStreakRulesArgs>({
      query: (body) => ({
        url: '',
        method: 'PUT',
        body,
        roleBasedRouting: {
          adminRoute: API_ROUTES.ADMIN_LOYALTY_STREAKS,
          organizerRoute: API_ROUTES.ORGANIZER_LOYALTY_STREAKS,
        },
      }),
      // Moving a threshold can change which badge a member holds, so the list
      // is refetched alongside the rules rather than left showing stale tiers.
      invalidatesTags: ['streak-rules', 'users-streaks'],
    }),
  }),
});

export const { useGetUsersStreaksQuery, useGetStreakRulesQuery, useUpdateStreakRulesMutation } = streaksV2Api;
