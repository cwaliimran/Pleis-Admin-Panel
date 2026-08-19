import { createApi } from '@reduxjs/toolkit/query/react';
import API_ROUTES from '../apiRoutes';
import { customFetchBaseQueryWithRoleRouting } from '../utils/customFetchBaseQueryWithRoleRouting';

// ============================================================
// Referrals V2 — API slice
//
// Owns the wire format only. The view model and the mapping between the two
// live in `sections/loyalty-modules/referrals-v2`.
//
// Note the backend's own spellings: the invitee's name arrives split as
// `firstName` / `lastName` while the referrer arrives pre-joined as
// `referrerUserName`, and the point columns are `userReward` /
// `referrerReward`. They are kept verbatim here and renamed once, in the
// view hook.
// ============================================================

export type ApiReferralStatus = 'active' | 'inactive';

export interface ApiReferral {
  _id: string;
  /** Invitee's user id. The display name comes from `firstName`/`lastName`. */
  user: string;
  /** Referrer's user id. The display name comes from `referrerUserName`. */
  referrer: string;
  companyOrganizer: string;
  type: string;
  purchases: number;
  purchased: boolean;
  /** Points awarded to the invitee. */
  userReward: number;
  /** Points awarded to the referrer. */
  referrerReward: number;
  /** ISO datetime. */
  expiryDate: string;
  status: ApiReferralStatus;
  /** ISO datetime. */
  createdAt: string;

  firstName?: string;
  lastName?: string;
  profileIcon?: string;
  referrerUserName?: string;

  /** How many of the referrer's allowance is left. */
  remainingReferrals?: number;
  /** How many referrals the referrer has made. */
  loyaltyReferralsCount?: number;
  /** The referrer's total allowance. */
  referralLimit?: number;
}

export interface ApiReferralTopReferrer {
  count: number;
  referrer?: { _id: string; name: string } | null;
}

export interface ApiReferralStats {
  totalCompleted?: number;
  totalPending?: number;
  totalPointsGiven?: number;
  topReferrer?: ApiReferralTopReferrer | null;
}

export interface ApiReferralStatusCount {
  total: number;
  active: number;
  inactive: number;
}

export interface ApiReferralsMeta {
  currentPage: number;
  totalPages: number;
  totalRecords: number;
  limit: number;
  LoyaltyReferralCount?: ApiReferralStatusCount | null;
  stats?: ApiReferralStats | null;
}

export interface GetReferralsV2Args {
  companyOrganizer: string;
  /** 1-based, matching what the API returns in `meta.currentPage`. */
  page: number;
  limit: number;
  /** Free-text search, matched against both the invitee and the referrer. */
  keyword?: string;
  status?: ApiReferralStatus;
}

export interface GetReferralsV2Response {
  data: ApiReferral[];
  meta: ApiReferralsMeta | null;
}

export const referralsV2Api = createApi({
  reducerPath: 'referralsV2Api',
  baseQuery: customFetchBaseQueryWithRoleRouting(),
  tagTypes: ['referrals-v2'],

  endpoints: (builder) => ({
    getReferralsV2: builder.query<GetReferralsV2Response, GetReferralsV2Args>({
      query: ({ companyOrganizer, page, limit, keyword, status }) => {
        const params: Record<string, string | number> = { companyOrganizer, page, limit };

        // Each is left off entirely when the filter is cleared.
        if (keyword) params.keyword = keyword;
        if (status) params.status = status;

        return {
          url: '',
          method: 'GET',
          params,
          roleBasedRouting: {
            adminRoute: API_ROUTES.ADMIN_LOYALTY_REFERRALS_V2,
            organizerRoute: API_ROUTES.ORGANIZER_LOYALTY_REFERRALS_V2,
            adminOnlyParams: ['companyOrganizer'],
          },
        };
      },
      transformResponse: (res: { data?: ApiReferral[]; meta?: ApiReferralsMeta }): GetReferralsV2Response => ({
        data: res?.data ?? [],
        meta: res?.meta ?? null,
      }),
      providesTags: ['referrals-v2'],
    }),
  }),
});

export const { useGetReferralsV2Query } = referralsV2Api;
