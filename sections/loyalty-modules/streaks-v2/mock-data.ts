import { StreakMember, StreakRules, StreakStats } from './types';

/**
 * Placeholder dataset for Streaks V2. Replace with the real endpoints once they
 * exist — nothing outside `use-streaks-view.ts` reads this.
 */

export const MOCK_STREAK_RULES: StreakRules = {
  countBase: 'week',
  thresholds: {
    bronze: 3,
    silver: 7,
    gold: 14,
    platinum: 30,
  },
};

/**
 * Aggregates across the entire member base — deliberately not derived from
 * `MOCK_STREAK_MEMBERS`, which is only the loaded page. In production these
 * come from the stats endpoint.
 */
export const MOCK_STREAK_STATS: StreakStats = {
  avgStreakPerUser: 2.4,
  longestStreak: 11,
  longestStreakUsername: 'nightowl',
  badgesAwarded: 58,
  topStreaker: { username: 'nightowl', visits: 11 },
};

export const MOCK_STREAK_MEMBERS: StreakMember[] = [
  {
    id: 'stk-1',
    username: 'bridges',
    name: 'Tin Manojlović',
    photo: '',
    streak: 1,
    longestStreak: 3,
    highestBadge: 'bronze',
    visits: 3,
    lastVisitAt: '2026-03-09T11:21:00',
  },
  {
    id: 'stk-2',
    username: 'nightowl',
    name: 'Ana Kovač',
    photo: '',
    streak: 11,
    longestStreak: 11,
    highestBadge: 'silver',
    visits: 11,
    lastVisitAt: '2026-03-10T23:48:00',
  },
  {
    // Streak lapsed back to 0, but the badge earned along the way is kept.
    id: 'stk-3',
    username: 'luka_92',
    name: 'Luka Horvat',
    photo: '',
    streak: 0,
    longestStreak: 7,
    highestBadge: 'silver',
    visits: 7,
    lastVisitAt: '2026-03-01T19:02:00',
  },
];
