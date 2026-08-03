// ============================================================
// Challenges V2 — domain types
//
// Served by `mock-data.ts` through `use-challenges-view.ts` until the real
// endpoints exist. The query/meta shapes deliberately mirror the RTK Query
// list contract (`{ data, meta }`) so swapping the hook for a generated
// `useGetChallengesQuery` is a drop-in change.
// ============================================================

export type ChallengeStatus = 'active' | 'inactive';

/** What the member has to do. Keys match the V1 API vocabulary. */
export type ChallengeTaskType = 'visit' | 'earnPoints' | 'referUsers' | 'buyMenuItem';

/** What they get for finishing it. */
export type ChallengeRewardType = 'points' | 'menuItem' | 'linkedReward';

/** Column keys the table can sort by. Sent to the API as `sortBy`. */
export type ChallengeSortKey =
  | 'name'
  | 'taskType'
  | 'rewardType'
  | 'status'
  | 'views'
  | 'favorites'
  | 'participants'
  | 'completions'
  | 'avgProgress';

/** Empty string means "no sort" and is omitted from the request. */
export type ChallengeSortOrder = 'asc' | 'desc' | '';

export interface Challenge {
  id: string;
  name: string;
  /** Empty string falls back to the initial-letter avatar. */
  image: string;
  description: string;
  taskType: ChallengeTaskType;
  rewardType: ChallengeRewardType;
  status: ChallengeStatus;

  /** Target the member must reach — 2 visits, 500 points, and so on. */
  taskValue: number;

  /** `buyMenuItem` only — any of these purchases count toward the goal. */
  qualifyingMenuId?: string;
  qualifyingItemIds: string[];

  /** `points` reward only. */
  pointReward: number;
  /** `menuItem` reward only — the claimer picks one and gets a QR for it. */
  rewardMenuId?: string;
  rewardItemIds: string[];
  /** `linkedReward` only — id of an existing reward used as the payout. */
  linkedRewardId?: string;

  /** Progress resets to 0 on completion so the challenge can be done again. */
  repeatable: boolean;
  /** Total claims across all users. `null` means unlimited. */
  claimLimit: number | null;
  /** ISO `yyyy-MM-dd`. */
  endDate: string;
  /** Id of the minimum tier required, `''` when any tier qualifies. */
  tierLimit: string;

  // ---------- Analytics (server-owned) ----------
  views: number;
  favorites: number;
  /** Members who started the challenge at least once. */
  participants: number;
  completions: number;
  /** Started but not yet finished. The rest of `participants` expired. */
  inProgress: number;
  /** Mean progress across participants, in the same unit as `taskValue`. */
  avgProgress: number;
}

/** Values the form collects — the analytics counters stay server-owned. */
export type ChallengePayload = Omit<
  Challenge,
  'id' | 'views' | 'favorites' | 'participants' | 'completions' | 'inProgress' | 'avgProgress'
>;

/** Header tiles. Derived from every challenge, not just the current page. */
export interface ChallengeStats {
  totalViews: number;
  totalFavorites: number;
  totalParticipants: number;
  totalCompletions: number;
  /** `null` while there is nothing to rank. */
  mostCompleted: { name: string; completions: number } | null;
}

export interface ChallengesQuery {
  /** 1-based, as shown in the UI. */
  page: number;
  limit: number;
  search: string;
  /** Empty string means every task type. */
  taskType: ChallengeTaskType | '';
  /** Empty string means every reward type. */
  rewardType: ChallengeRewardType | '';
  /** Empty string means every status. */
  status: ChallengeStatus | '';
  sortBy: ChallengeSortKey | '';
  sortOrder: ChallengeSortOrder;
}

export interface ChallengesMeta {
  currentPage: number;
  totalPages: number;
  totalRecords: number;
  limit: number;
}

// ---------- Reference data ----------

export interface MenuOption {
  id: string;
  name: string;
}

export interface MenuItemOption {
  id: string;
  menuId: string;
  name: string;
}

export interface TierOption {
  id: string;
  name: string;
}

/** An existing reward a challenge can hand out. */
export interface LinkedRewardOption {
  id: string;
  name: string;
}
