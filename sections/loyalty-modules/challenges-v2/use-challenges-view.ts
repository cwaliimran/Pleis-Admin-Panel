'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { CHALLENGE_REWARD_TYPE_LABELS, CHALLENGE_TASK_TYPE_LABELS, DEFAULT_PAGE_LIMIT } from './constants';
import { MOCK_CHALLENGES } from './mock-data';
import { Challenge, ChallengePayload, ChallengeSortKey, ChallengeStats, ChallengesMeta, ChallengesQuery } from './types';
import { getProgressRatio } from './utils';

const compareBy = (key: ChallengeSortKey, a: Challenge, b: Challenge): number => {
  switch (key) {
    case 'name':
      return a.name.localeCompare(b.name);
    case 'taskType':
      return CHALLENGE_TASK_TYPE_LABELS[a.taskType].localeCompare(CHALLENGE_TASK_TYPE_LABELS[b.taskType]);
    case 'rewardType':
      return CHALLENGE_REWARD_TYPE_LABELS[a.rewardType].localeCompare(CHALLENGE_REWARD_TYPE_LABELS[b.rewardType]);
    case 'status':
      return a.status.localeCompare(b.status);
    case 'avgProgress':
      // Ranked by share of target, not the raw number — see `getProgressRatio`.
      return getProgressRatio(a) - getProgressRatio(b);
    default:
      return a[key] - b[key];
  }
};

const buildStats = (challenges: Challenge[]): ChallengeStats => {
  const mostCompleted = challenges.reduce<Challenge | null>(
    (best, challenge) => (!best || challenge.completions > best.completions ? challenge : best),
    null
  );

  return {
    totalViews: challenges.reduce((sum, challenge) => sum + challenge.views, 0),
    totalFavorites: challenges.reduce((sum, challenge) => sum + challenge.favorites, 0),
    totalParticipants: challenges.reduce((sum, challenge) => sum + challenge.participants, 0),
    totalCompletions: challenges.reduce((sum, challenge) => sum + challenge.completions, 0),
    mostCompleted: mostCompleted ? { name: mostCompleted.name, completions: mostCompleted.completions } : null,
  };
};

interface UseChallengesViewResult {
  data: Challenge[];
  meta: ChallengesMeta;
  stats: ChallengeStats;
  isLoading: boolean;
  isMutating: boolean;
  createChallenge: (payload: ChallengePayload) => Promise<void>;
  updateChallenge: (id: string, payload: ChallengePayload) => Promise<void>;
  deleteChallenge: (id: string) => Promise<void>;
}

/**
 * Mock-backed data layer for Challenges V2. Filtering, sorting and paging happen
 * here so the view and table stay presentational — exactly where the server
 * will take over.
 */
export const useChallengesView = (query: ChallengesQuery): UseChallengesViewResult => {
  const [challenges, setChallenges] = useState<Challenge[]>(MOCK_CHALLENGES);
  const [isLoading, setIsLoading] = useState(false);
  const [isMutating, setIsMutating] = useState(false);

  const { page, limit, search, taskType, rewardType, status, sortBy, sortOrder } = query;

  // Stands in for the request round-trip so the loading states are exercised.
  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => setIsLoading(false), 250);
    return () => clearTimeout(timer);
  }, [page, limit, search, taskType, rewardType, status, sortBy, sortOrder]);

  // Header tiles read every challenge — they should not move when filters change.
  const stats = useMemo(() => buildStats(challenges), [challenges]);

  const filtered = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    return challenges.filter((challenge) => {
      if (keyword && !challenge.name.toLowerCase().includes(keyword)) return false;
      if (taskType && challenge.taskType !== taskType) return false;
      if (rewardType && challenge.rewardType !== rewardType) return false;
      if (status && challenge.status !== status) return false;
      return true;
    });
  }, [challenges, search, taskType, rewardType, status]);

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

  const createChallenge = useCallback(
    async (payload: ChallengePayload) => {
      await runMutation(() => {
        // Counters start at zero — the server owns them from here on.
        const created: Challenge = {
          ...payload,
          id: `chl-${Date.now()}`,
          views: 0,
          favorites: 0,
          participants: 0,
          completions: 0,
          inProgress: 0,
          avgProgress: 0,
        };
        setChallenges((previous) => [created, ...previous]);
      });
    },
    [runMutation]
  );

  const updateChallenge = useCallback(
    async (id: string, payload: ChallengePayload) => {
      await runMutation(() => {
        setChallenges((previous) => previous.map((challenge) => (challenge.id === id ? { ...challenge, ...payload } : challenge)));
      });
    },
    [runMutation]
  );

  const deleteChallenge = useCallback(
    async (id: string) => {
      await runMutation(() => {
        setChallenges((previous) => previous.filter((challenge) => challenge.id !== id));
      });
    },
    [runMutation]
  );

  return {
    data,
    meta: { currentPage, totalPages, totalRecords, limit: pageSize },
    stats,
    isLoading,
    isMutating,
    createChallenge,
    updateChallenge,
    deleteChallenge,
  };
};
