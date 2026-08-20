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

/**
 * `customReward` (free text) and `specialTicket` are legacy — records still hold
 * them and the list renders them, but only the first three can be created here.
 */
export type ApiChallengeRewardType = 'points' | 'menuItem' | 'linkedReward' | 'customReward' | 'specialTicket';

/**
 * Reference fields come back either as a bare id or as a populated document,
 * depending on the endpoint. Both are accepted so the mapper never has to guess.
 * Menu items carry their parent menu, which is what seeds the form's menu filter.
 */
export type ApiChallengeRef =
  | string
  | {
      _id: string;
      title?: string;
      menu?: { _id: string; title?: string } | string | null;
    };

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
 * The payout. `specialTicket` and `customReward` are present but empty on every
 * other reward type, so their own fields decide whether they mean anything.
 */
export interface ApiChallengeReward {
  rewardType: ApiChallengeRewardType;
  /** Points awarded when `rewardType` is `points`. 0 on every other type. */
  rewardValue?: number;
  /** `menuItem` only. Ids are not populated; `[]` on every other type. */
  rewardMenuItem?: ApiChallengeRef[] | ApiChallengeRef | null;
  /** `linkedReward` only — the id of a reward record. `null` otherwise. */
  linkedReward?: ApiChallengeRef | null;
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
  /** `buyMenuItem` only. Written as an array of ids, read back populated. */
  taskMenuItem?: ApiChallengeRef[] | ApiChallengeRef | null;
  /** `null` means unlimited. */
  claimLimit?: number | null;
  /** ISO `yyyy-MM-dd`. */
  endDate?: string;
  tierLimit?: ApiChallengeTier | null;
  companyOrganizer?: string;
  status: ApiChallengeStatus;
  /**
   * Progress resets on completion so the challenge can be done again. Note the
   * backend's spelling, and that it reads back as a real boolean while the
   * write side expects the string "true" / "false". Absent on older records.
   */
  repeatComplition?: boolean;
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

// ============================================================
// Write shape
//
// Writes go to the v1 routes — there is no `/v2` create, update or delete.
// Two quirks the backend expects and that are deliberate here:
//  - `repeatComplition` is spelled exactly like that, and goes over as the
//    string "true" / "false" even though the read side returns a boolean.
//  - `rewardMenuItem` is an array. A bare string is accepted and normalised
//    into one, but the array is what comes back, so the array is what we send.
// ============================================================

export type ApiChallengeBooleanString = 'true' | 'false';

/** Only these three are creatable; the legacy two have no inputs in the form. */
export type ApiChallengeWritableRewardType = 'points' | 'menuItem' | 'linkedReward';

export interface ChallengeRewardWriteBody {
  rewardType: ApiChallengeWritableRewardType;
  /** `points` only. */
  rewardValue?: number;
  /** `menuItem` only. */
  rewardMenuItem?: string[];
  /** `linkedReward` only — the id of an existing reward record. */
  linkedReward?: string;
}

export interface ChallengeWriteBody {
  companyOrganizer: string;
  /** Azure blob key, not a full URL. */
  image: string;
  title: string;
  description?: string;
  taskType: ApiChallengeTaskType;
  taskValue: number;
  /** `buyMenuItem` only, and a full replacement of the stored list. */
  taskMenuItem?: string[];
  claimLimit?: number;
  /** ISO `yyyy-MM-dd`. */
  endDate: string;
  tierLimit: string;
  repeatComplition: ApiChallengeBooleanString;
  status: ApiChallengeStatus;
  reward: ChallengeRewardWriteBody;
}

export interface UpdateChallengeV2Args extends ChallengeWriteBody {
  id: string;
}

export interface ChallengeMutationResponse {
  message?: string;
  data?: unknown;
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

    createChallengeV2: builder.mutation<ChallengeMutationResponse, ChallengeWriteBody>({
      query: (body) => ({
        url: '',
        method: 'POST',
        body,
        roleBasedRouting: {
          adminRoute: API_ROUTES.ADMIN_LOYALTY_CHALLENGE(false),
          organizerRoute: API_ROUTES.ORGANIZER_LOYALTY_CHALLENGE,
        },
      }),
      invalidatesTags: ['challenges-v2'],
    }),

    updateChallengeV2: builder.mutation<ChallengeMutationResponse, UpdateChallengeV2Args>({
      query: ({ id, ...body }) => ({
        url: '',
        method: 'PUT',
        body,
        roleBasedRouting: {
          adminRoute: API_ROUTES.ADMIN_LOYALTY_CHALLENGE_BY_ID(id, false),
          organizerRoute: API_ROUTES.ORGANIZER_LOYALTY_CHALLENGE_BY_ID(id),
        },
      }),
      invalidatesTags: ['challenges-v2'],
    }),

    deleteChallengeV2: builder.mutation<ChallengeMutationResponse, { id: string }>({
      query: ({ id }) => ({
        url: '',
        method: 'DELETE',
        roleBasedRouting: {
          adminRoute: API_ROUTES.ADMIN_LOYALTY_CHALLENGE_BY_ID(id, false),
          organizerRoute: API_ROUTES.ORGANIZER_LOYALTY_CHALLENGE_BY_ID(id),
        },
      }),
      invalidatesTags: ['challenges-v2'],
    }),
  }),
});

export const {
  useGetChallengesV2Query,
  useCreateChallengeV2Mutation,
  useUpdateChallengeV2Mutation,
  useDeleteChallengeV2Mutation,
} = challengesV2Api;
