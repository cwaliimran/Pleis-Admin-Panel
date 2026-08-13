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

  // ---- `buyMenuItem` task only. The API links exactly one item. ----
  taskMenuItemId?: string;
  taskMenuItemName?: string;
  taskMenuId?: string;

  // ---- Reward branches ----
  /** `points` reward only. */
  pointReward: number;
  /** `customReward` only — free text rather than a linked record. */
  customRewardTitle?: string;
  customRewardDescription?: string;
  /** `specialTicket` only. */
  specialTicket?: ChallengeSpecialTicket;

  /**
   * Progress resets to 0 on completion so the challenge can be done again.
   * Write-only — the list does not echo it, so it reads back as `false`.
   */
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

/**
 * Values the form collects. Still the pre-integration shape — it is rewritten
 * against the real body when the write endpoints land.
 */
export interface ChallengePayload {
  name: string;
  image: string;
  description: string;
  taskType: ChallengeTaskType;
  rewardType: ChallengeRewardType;
  status: ChallengeStatus;
  taskValue: number;
  qualifyingMenuId?: string;
  qualifyingItemIds: string[];
  pointReward: number;
  rewardMenuId?: string;
  rewardItemIds: string[];
  linkedRewardId?: string;
  repeatable: boolean;
  claimLimit: number | null;
  endDate: string;
  tierLimit: string;
}

/** Option shape the form's item pickers render. */
export interface MenuItemOption {
  id: string;
  menuId: string;
  name: string;
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
