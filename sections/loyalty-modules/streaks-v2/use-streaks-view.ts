'use client';

import { useCompanySelectionState } from '@/hooks/useCompanySelectionState';
import type { ApiStreakRules, ApiUserStreak, ApiUsersStreaksCount } from '@/store/Reducer/streaks-v2-api';
import { useGetStreakRulesQuery, useGetUsersStreaksQuery, useUpdateStreakRulesMutation } from '@/store/Reducer/streaks-v2-api';
import { formatDate } from '@/utils/format-time';
import { useCallback, useMemo } from 'react';
import { STREAK_BADGE_ORDER } from './constants';
import { StreakBadge, StreakMember, StreakRules, StreakStats, StreaksMeta, StreaksQuery } from './types';

const EMPTY_STATS: StreakStats = {
  avgStreakPerUser: 0,
  longestStreak: 0,
  badgesAwarded: 0,
  topStreaker: null,
};

const toMember = (item: ApiUserStreak): StreakMember => {
  const user = item.user;

  return {
    id: item._id,
    username: user?.username ?? '',
    // One of the two names can be missing, so joining beats interpolating.
    name: [user?.firstName, user?.lastName].filter(Boolean).join(' '),
    photo: user?.profileIcon ?? '',

    streak: item.streak ?? 0,
    longestStreak: item.longestStreak ?? 0,
    // The API sends '' rather than null before the first badge; the label
    // component already renders null as an em dash.
    highestBadge: item.badge || null,
    visits: item.visits ?? 0,
    lastVisitAt: item.lastVisitAt ?? '',
  };
};

const toStats = (count?: ApiUsersStreaksCount | null): StreakStats => {
  if (!count) return EMPTY_STATS;

  const top = count.topStreaker;

  return {
    avgStreakPerUser: count.averageStreak ?? 0,
    longestStreak: count.highestStreak ?? 0,
    badgesAwarded: count.totalBadgesAwarded ?? 0,
    topStreaker: top?.username ? { username: top.username, visits: top.visits ?? 0 } : null,
  };
};

/**
 * The API holds the ladder as an array keyed by `title`; the UI wants one entry
 * per tier. A rule set missing any tier cannot drive the ladder, so it reads as
 * unset rather than being silently filled with zeros.
 */
const toRules = (rules: ApiStreakRules | null): StreakRules | null => {
  if (!rules?.countBase || !rules.badges?.length) return null;

  const visitsByTier = new Map(rules.badges.map((badge) => [badge.title, badge.visits]));

  if (STREAK_BADGE_ORDER.some((badge) => typeof visitsByTier.get(badge) !== 'number')) return null;

  const thresholds = Object.fromEntries(STREAK_BADGE_ORDER.map((badge) => [badge, visitsByTier.get(badge)])) as Record<StreakBadge, number>;

  return { countBase: rules.countBase, thresholds };
};

interface UseStreaksViewResult {
  data: StreakMember[];
  meta: StreaksMeta;
  stats: StreakStats;
  /** `null` until a rule set has been saved for this company. */
  rules: StreakRules | null;
  isLoading: boolean;
  isFetching: boolean;
  isRulesLoading: boolean;
  isMutating: boolean;
  saveRules: (rules: StreakRules) => Promise<void>;
}

/**
 * Data layer for Streaks V2. Filtering, sorting and paging are all done by the
 * server; this only maps the wire format onto the view model.
 *
 * Streak records are read-only — the app maintains them as members visit. The
 * only thing an admin can change is the global rule set.
 */
export const useStreaksView = (query: StreaksQuery, userType: 'organizer' | 'super-admin' = 'super-admin'): UseStreaksViewResult => {
  // Admin picks the company in the header; the page sits behind `CompanyGuard`. Organizers have no
  // company control — their token scopes the request, so the param is omitted and nothing is skipped.
  const { companyId } = useCompanySelectionState();
  const scopedCompanyId = userType === 'super-admin' ? (companyId ?? undefined) : undefined;
  const companySkip = userType === 'super-admin' && !companyId;

  const { page, limit, search, badge, lastVisitFrom, sortBy, sortOrder } = query;

  const { data, isLoading, isFetching } = useGetUsersStreaksQuery(
    {
      companyOrganizer: scopedCompanyId as string,
      page,
      limit,
      keyword: search.trim() || undefined,
      badge: badge || undefined,
      // Local date parts, so an evening pick does not roll back a day in UTC.
      lastVisitedFrom: formatDate(lastVisitFrom),
      sortBy: sortBy || undefined,
      sortOrder: sortOrder || undefined,
    },
    { skip: companySkip, refetchOnMountOrArgChange: true }
  );

  const { data: rulesData, isLoading: isRulesLoading } = useGetStreakRulesQuery(
    { companyOrganizer: scopedCompanyId as string },
    { skip: companySkip }
  );

  const [updateStreakRules, { isLoading: isMutating }] = useUpdateStreakRulesMutation();

  const members = useMemo(() => (data?.data ?? []).map(toMember), [data]);

  const rules = useMemo(() => toRules(rulesData ?? null), [rulesData]);

  const stats = useMemo(() => toStats(data?.meta?.UsersStreaksCount), [data]);

  const meta = useMemo<StreaksMeta>(
    () => ({
      currentPage: data?.meta?.currentPage ?? page,
      totalPages: data?.meta?.totalPages ?? 1,
      totalRecords: data?.meta?.totalRecords ?? 0,
      limit: data?.meta?.limit ?? limit,
    }),
    [data, page, limit]
  );

  const saveRules = useCallback(
    async (next: StreakRules) => {
      if (companySkip) throw new Error('Please select a company first.');

      // Always a PUT — the endpoint upserts, so a first-time save and an edit
      // are the same request.
      await updateStreakRules({
        ...(scopedCompanyId ? { companyOrganizer: scopedCompanyId } : {}),
        countBase: next.countBase,
        badges: STREAK_BADGE_ORDER.map((badge) => ({ title: badge, visits: next.thresholds[badge] })),
      }).unwrap();
    },
    [companySkip, scopedCompanyId, updateStreakRules]
  );

  return { data: members, meta, stats, rules, isLoading, isFetching, isRulesLoading, isMutating, saveRules };
};
