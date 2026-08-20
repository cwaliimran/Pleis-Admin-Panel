// ============================================================
// Challenges V2 — domain types
//
// The view model the components render. `use-challenges-view.ts` maps the wire
// format (`store/Reducer/challenges-v2-api.ts`) onto this once, so nothing
// below the hook deals with the backend's own field names.
// ============================================================

import type { ApiChallengeRewardType, ApiChallengeSortBy, ApiChallengeStatus, ApiChallengeTaskType } from '@/store/Reducer/challenges-v2-api';

export type ChallengeStatus = ApiChallengeStatus;

/** What the member has to do. */
export type ChallengeTaskType = ApiChallengeTaskType;

/** What they get for finishing it. */
export type ChallengeRewardType = ApiChallengeRewardType;

/** Column keys the table can sort by. `status` is deliberately absent — the API does not sort by it. */
export type ChallengeSortKey = ApiChallengeSortBy;

/** Empty string means "no sort" and is omitted from the request. */
export type ChallengeSortOrder = 'asc' | 'desc' | '';

/** `specialTicket` payout. Every id comes back populated with its name. */
export interface ChallengeSpecialTicket {
  eventId?: string;
  eventName?: string;
  organizationId?: string;
  organizationName?: string;
  companyName?: string;
  timeSlotId?: string;
  isFastTrack: boolean;
}

/** A menu item reference. `name` falls back to the id when unpopulated. */
export interface ChallengeItemRef {
  id: string;
  name: string;
  /** Parent menu, used to seed the form's menu filter. `''` when unpopulated. */
  menuId: string;
  menuName: string;
}

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

  /** `buyMenuItem` task only — any one of these items counts toward the goal. */
  taskMenuItems: ChallengeItemRef[];

  // ---- Reward branches ----
  /** `points` reward only. */
  pointReward: number;
  /** `menuItem` reward only. */
  rewardMenuItems: ChallengeItemRef[];
  /** `linkedReward` only — an existing reward record. */
  linkedRewardId: string;
  /** Empty while the endpoint returns the reward as a bare id. */
  linkedRewardName: string;
  /** `customReward` only — legacy free text rather than a linked record. */
  customRewardTitle?: string;
  customRewardDescription?: string;
  /** `specialTicket` only — legacy. */
  specialTicket?: ChallengeSpecialTicket;

  /** Progress resets to 0 on completion so the challenge can be done again. */
  repeatable: boolean;
  /** Total claims across all users. `null` means unlimited. */
  claimLimit: number | null;
  /** ISO `yyyy-MM-dd`. */
  endDate: string;
  /** Minimum tier required. `''` when any tier qualifies. */
  tierId: string;
  tierName: string;

  // ---------- Analytics (server-owned) ----------
  views: number;
  favorites: number;
  /** Members who started the challenge at least once. */
  participants: number;
  completions: number;
  /** Started but not yet finished. */
  inProgress: number;
  /** Started, ran out of time, never finished. */
  expired: number;
  /** Mean progress as a whole percent of the target, not a raw count. */
  avgProgress: number;
  /** Whole percent — share of viewers who went on to start it. */
  participationRate: number;
  /** Whole percent — share of participants who finished. */
  completionRate: number;
}

/** Header tiles. Computed by the server across every challenge, not the page. */
export interface ChallengeStats {
  totalViews: number;
  totalFavorites: number;
  totalParticipants: number;
  totalCompletions: number;
  /** `null` while there is nothing to rank. */
  mostCompleted: { name: string; completions: number } | null;
}

export interface ChallengesQuery {
  /** 1-based, as shown in the UI and as the API expects it. */
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
