import { createApi } from '@reduxjs/toolkit/query/react';
import API_ROUTES from '../apiRoutes';
import { customFetchBaseQueryWithRoleRouting } from '../utils/customFetchBaseQueryWithRoleRouting';

// ============================================================
// Challenges V2 — API slice
//
// Owns the wire format only. The view model and the mapping between the two
// live in `sections/loyalty-modules/challenges-v2`.
//
// Note the backend's own naming: `title` for the name, the payout nested under
// `reward`, and the analytics counters spelled `favoritesCount`,
// `totalParticipants` and `completed`. They are kept verbatim here and renamed
// once, in the view hook.
// ============================================================

export type ApiChallengeStatus = 'active' | 'inactive';

export type ApiChallengeTaskType = 'visit' | 'earnPoints' | 'buyMenuItem' | 'referUsers';

export type ApiChallengeRewardType = 'points' | 'menuItem' | 'customReward' | 'specialTicket';

/** Accepted `sortBy` values. Note `status` is not among them. */
export type ApiChallengeSortBy =
  | 'title'
  | 'taskType'
  | 'rewardType'
  | 'views'
  | 'favorites'
  | 'participants'
  | 'completions'
  | 'avgProgress';

export type ApiChallengeSortOrder = 'asc' | 'desc';

export interface ApiChallengeTier {
  _id: string;
  title: string;
  image?: string;
}

/** Populated on `buyMenuItem` tasks — one item, not a list. */
export interface ApiChallengeMenuItem {
  _id: string;
  title: string;
  image?: string;
  description?: string;
  menu?: string;
}

export interface ApiChallengeSpecialTicket {
  companyOrganizer?: { _id: string; companyDetails?: { name?: string } } | null;
  organization?: { _id: string; basicInfo?: { name?: string } } | null;
  event?: { _id: string; basicInfo?: { title?: string } } | null;
  timeSlot?: string | null;
  isFastTrack?: boolean;
}

export interface ApiChallengeCustomReward {
  title?: string;
  description?: string;
  image?: string;
}

/**
 * The payout. `specialTicket` is present but empty (`{}`) on every other
 * reward type, so its own fields decide whether it means anything.
 */
export interface ApiChallengeReward {
  rewardType: ApiChallengeRewardType;
  /** Points awarded when `rewardType` is `points`. */
  rewardValue?: number;
  specialTicket?: ApiChallengeSpecialTicket | null;
  customReward?: ApiChallengeCustomReward | null;
}

export interface ApiChallenge {
  _id: string;
  title: string;
  image?: string;
  description?: string;
  taskType: ApiChallengeTaskType;
  taskValue?: number;
  taskMenuItem?: ApiChallengeMenuItem | null;
  /** `null` means unlimited. */
  claimLimit?: number | null;
  /** ISO `yyyy-MM-dd`. */
  endDate?: string;
  tierLimit?: ApiChallengeTier | null;
  companyOrganizer?: string;
  status: ApiChallengeStatus;
  reward?: ApiChallengeReward | null;
  createdAt?: string;
  updatedAt?: string;

  // ---- Server-computed analytics ----
  views?: number;
  favoritesCount?: number;
  totalParticipants?: number;
  completed?: number;
  inProgress?: number;
  expired?: number;
  /** Whole percent of the target, not a raw count. */
  averageProgress?: number;
  /** Whole percent. */
  participationRate?: number;
  /** Whole percent. */
  completionRate?: number;
}

export interface ApiChallengeStats {
  totalViews?: number;
  totalFavorites?: number;
  totalParticipants?: number;
  totalCompletions?: number;
  /** `name` is `null` when nothing has been completed yet. */
  mostCompletedChallenge?: { name: string | null; count: number } | null;
}

export interface ApiChallengesMeta {
  currentPage: number;
  totalPages: number;
  totalRecords: number;
  limit: number;
  stats?: ApiChallengeStats | null;
}

export interface GetChallengesV2Args {
  companyOrganizer: string;
  /** 1-based, matching what the API returns in `meta.currentPage`. */
  page: number;
  limit: number;
  keyword?: string;
  status?: ApiChallengeStatus;
  taskType?: ApiChallengeTaskType;
  rewardType?: ApiChallengeRewardType;
  sortBy?: ApiChallengeSortBy;
  sortOrder?: ApiChallengeSortOrder;
}

export interface GetChallengesV2Response {
  data: ApiChallenge[];
  meta: ApiChallengesMeta | null;
}

export const challengesV2Api = createApi({
  reducerPath: 'challengesV2Api',
  baseQuery: customFetchBaseQueryWithRoleRouting(),
  tagTypes: ['challenges-v2'],

  endpoints: (builder) => ({
    getChallengesV2: builder.query<GetChallengesV2Response, GetChallengesV2Args>({
      query: ({ companyOrganizer, page, limit, keyword, status, taskType, rewardType, sortBy, sortOrder }) => {
        const params: Record<string, string | number> = { companyOrganizer, page, limit };

        // Each is left off entirely when the filter is cleared.
        if (keyword) params.keyword = keyword;
        if (status) params.status = status;
        if (taskType) params.taskType = taskType;
        if (rewardType) params.rewardType = rewardType;
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
            adminRoute: API_ROUTES.ADMIN_LOYALTY_CHALLENGES_V2,
            organizerRoute: API_ROUTES.ORGANIZER_LOYALTY_CHALLENGES_V2,
            adminOnlyParams: ['companyOrganizer'],
          },
        };
      },
      transformResponse: (res: { data?: ApiChallenge[]; meta?: ApiChallengesMeta }): GetChallengesV2Response => ({
        data: res?.data ?? [],
        meta: res?.meta ?? null,
      }),
      providesTags: ['challenges-v2'],
    }),
  }),
});

export const { useGetChallengesV2Query } = challengesV2Api;
