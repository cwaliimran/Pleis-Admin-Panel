'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { DEFAULT_PAGE_LIMIT } from './constants';
import { MOCK_REWARDS } from './mock-data';
import { Reward, RewardPayload, RewardSortKey, RewardStats, RewardsMeta, RewardsQuery } from './types';
import { getConversion } from './utils';

/** Rows the sort cannot rank (a "—" metric) always sink to the bottom. */
const compareBy = (key: RewardSortKey, a: Reward, b: Reward): number => {
  switch (key) {
    case 'name':
      return a.name.localeCompare(b.name);
    case 'type':
      return a.type.localeCompare(b.type);
    case 'status':
      return a.status.localeCompare(b.status);
    case 'conversion': {
      const left = getConversion(a);
      const right = getConversion(b);
      if (left === null || right === null) return left === right ? 0 : left === null ? 1 : -1;
      return left - right;
    }
    case 'views':
    case 'favorites': {
      // Not browsable means "no data", which is different from zero.
      const left = a.availableAsReward ? a[key] : null;
      const right = b.availableAsReward ? b[key] : null;
      if (left === null || right === null) return left === right ? 0 : left === null ? 1 : -1;
      return left - right;
    }
    default:
      return a[key] - b[key];
  }
};

const buildStats = (rewards: Reward[]): RewardStats => {
  const mostClaimed = rewards.reduce<Reward | null>((best, reward) => (!best || reward.claims > best.claims ? reward : best), null);

  return {
    totalViews: rewards.reduce((sum, reward) => sum + (reward.availableAsReward ? reward.views : 0), 0),
    totalFavorites: rewards.reduce((sum, reward) => sum + (reward.availableAsReward ? reward.favorites : 0), 0),
    totalClaims: rewards.reduce((sum, reward) => sum + reward.claims, 0),
    totalRedemptions: rewards.reduce((sum, reward) => sum + reward.redeemed, 0),
    mostClaimed: mostClaimed ? { name: mostClaimed.name, claims: mostClaimed.claims } : null,
  };
};

interface UseRewardsViewResult {
  data: Reward[];
  meta: RewardsMeta;
  stats: RewardStats;
  /** Distinct types present in the data, for the filter dropdown. */
  typeOptions: { value: string; label: string }[];
  isLoading: boolean;
  isMutating: boolean;
  createReward: (payload: RewardPayload) => Promise<void>;
  updateReward: (id: string, payload: RewardPayload) => Promise<void>;
  deleteReward: (id: string) => Promise<void>;
}

/**
 * Mock-backed data layer for Rewards V2. Filtering, sorting and paging happen
 * here so the view and table stay presentational — exactly where the server
 * will take over.
 */
export const useRewardsView = (query: RewardsQuery): UseRewardsViewResult => {
  const [rewards, setRewards] = useState<Reward[]>(MOCK_REWARDS);
  const [isLoading, setIsLoading] = useState(false);
  const [isMutating, setIsMutating] = useState(false);

  const { page, limit, search, type, status, sortBy, sortOrder } = query;

  // Stands in for the request round-trip so the loading states are exercised.
  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => setIsLoading(false), 250);
    return () => clearTimeout(timer);
  }, [page, limit, search, type, status, sortBy, sortOrder]);

  // Header tiles read every reward — they should not move when filters change.
  const stats = useMemo(() => buildStats(rewards), [rewards]);

  const typeOptions = useMemo(() => {
    const distinct = Array.from(new Set(rewards.map((reward) => reward.type).filter(Boolean)));
    distinct.sort((a, b) => a.localeCompare(b));
    return distinct.map((value) => ({ value, label: value }));
  }, [rewards]);

  const filtered = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    return rewards.filter((reward) => {
      if (keyword && !reward.name.toLowerCase().includes(keyword)) return false;
      if (type && reward.type !== type) return false;
      if (status && reward.status !== status) return false;
      return true;
    });
  }, [rewards, search, type, status]);

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

  /** Stands in for the mutation round-trip. */
  const runMutation = useCallback(async (mutate: () => void) => {
    setIsMutating(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 300));
      mutate();
    } finally {
      setIsMutating(false);
    }
  }, []);

  const createReward = useCallback(
    async (payload: RewardPayload) => {
      await runMutation(() => {
        // Counters start at zero — the server owns them from here on.
        const created: Reward = { ...payload, id: `rwd-${Date.now()}`, views: 0, favorites: 0, claims: 0, redeemed: 0 };
        setRewards((previous) => [created, ...previous]);
      });
    },
    [runMutation]
  );

  const updateReward = useCallback(
    async (id: string, payload: RewardPayload) => {
      await runMutation(() => {
        setRewards((previous) => previous.map((reward) => (reward.id === id ? { ...reward, ...payload } : reward)));
      });
    },
    [runMutation]
  );

  const deleteReward = useCallback(
    async (id: string) => {
      await runMutation(() => {
        setRewards((previous) => previous.filter((reward) => reward.id !== id));
      });
    },
    [runMutation]
  );

  return {
    data,
    meta: { currentPage, totalPages, totalRecords, limit: pageSize },
    stats,
    typeOptions,
    isLoading,
    isMutating,
    createReward,
    updateReward,
    deleteReward,
  };
};
