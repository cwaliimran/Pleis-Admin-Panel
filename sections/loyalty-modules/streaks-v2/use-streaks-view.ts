'use client';

import { startOfDay } from 'date-fns';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { DEFAULT_PAGE_LIMIT } from './constants';
import { MOCK_STREAK_MEMBERS, MOCK_STREAK_RULES, MOCK_STREAK_STATS } from './mock-data';
import { StreakMember, StreakRules, StreakSortKey, StreakStats, StreaksMeta, StreaksQuery } from './types';
import { getBadgeRank } from './utils';

const compareBy = (key: StreakSortKey, a: StreakMember, b: StreakMember): number => {
  switch (key) {
    case 'username':
      return a.username.localeCompare(b.username);
    case 'name':
      return a.name.localeCompare(b.name);
    case 'highestBadge':
      return getBadgeRank(a.highestBadge) - getBadgeRank(b.highestBadge);
    case 'lastVisitAt':
      return new Date(a.lastVisitAt).getTime() - new Date(b.lastVisitAt).getTime();
    default:
      return a[key] - b[key];
  }
};

interface UseStreaksViewResult {
  data: StreakMember[];
  meta: StreaksMeta;
  stats: StreakStats;
  rules: StreakRules;
  isLoading: boolean;
  isMutating: boolean;
  saveRules: (rules: StreakRules) => Promise<void>;
}

/**
 * Mock-backed data layer for Streaks V2. Filtering, sorting and paging happen
 * here so the view and table stay presentational — exactly where the server
 * will take over.
 *
 * Streak records are read-only: the app maintains them as members visit. The
 * only thing an admin can change is the global rule set.
 */
export const useStreaksView = (query: StreaksQuery): UseStreaksViewResult => {
  const [members] = useState<StreakMember[]>(MOCK_STREAK_MEMBERS);
  const [rules, setRules] = useState<StreakRules>(MOCK_STREAK_RULES);
  const [isLoading, setIsLoading] = useState(false);
  const [isMutating, setIsMutating] = useState(false);

  const { page, limit, search, badge, lastVisitFrom, sortBy, sortOrder } = query;

  // Stands in for the request round-trip so the loading states are exercised.
  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => setIsLoading(false), 250);
    return () => clearTimeout(timer);
  }, [page, limit, search, badge, lastVisitFrom, sortBy, sortOrder]);

  const filtered = useMemo(() => {
    const keyword = search.trim().toLowerCase();
    // Compare from midnight so a same-day visit is never filtered out.
    const from = lastVisitFrom ? startOfDay(lastVisitFrom).getTime() : null;

    return members.filter((member) => {
      if (keyword && !member.username.toLowerCase().includes(keyword) && !member.name.toLowerCase().includes(keyword)) return false;
      if (badge && member.highestBadge !== badge) return false;
      if (from !== null && new Date(member.lastVisitAt).getTime() < from) return false;
      return true;
    });
  }, [members, search, badge, lastVisitFrom]);

  const sorted = useMemo(() => {
    if (!sortBy || !sortOrder) return filtered;

    const direction = sortOrder === 'asc' ? 1 : -1;
    return [...filtered].sort((a, b) => compareBy(sortBy, a, b) * direction);
  }, [filtered, sortBy, sortOrder]);

  const totalRecords = sorted.length;
  const pageSize = limit || DEFAULT_PAGE_LIMIT;
  const totalPages = Math.max(1, Math.ceil(totalRecords / pageSize));
  // Guards against landing past the end after a filter narrows the result set.
  const currentPage = Math.min(page, totalPages);

  const data = useMemo(() => sorted.slice((currentPage - 1) * pageSize, currentPage * pageSize), [sorted, currentPage, pageSize]);

  const saveRules = useCallback(async (next: StreakRules) => {
    setIsMutating(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 300));
      setRules(next);
    } finally {
      setIsMutating(false);
    }
  }, []);

  return {
    data,
    meta: { currentPage, totalPages, totalRecords, limit: pageSize },
    stats: MOCK_STREAK_STATS,
    rules,
    isLoading,
    isMutating,
    saveRules,
  };
};
