'use client';

import { endOfDay, startOfDay } from 'date-fns';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { DEFAULT_PAGE_LIMIT, PROMOTION_TYPE_LABELS } from './constants';
import { MOCK_PROMOTIONS } from './mock-data';
import { Promotion, PromotionPayload, PromotionSortKey, PromotionStats, PromotionsMeta, PromotionsQuery } from './types';

const compareBy = (key: PromotionSortKey, a: Promotion, b: Promotion): number => {
  switch (key) {
    case 'title':
      return a.title.localeCompare(b.title);
    case 'type':
      return PROMOTION_TYPE_LABELS[a.type].localeCompare(PROMOTION_TYPE_LABELS[b.type]);
    case 'status':
      return a.status.localeCompare(b.status);
    default:
      return a[key] - b[key];
  }
};

const buildStats = (promotions: Promotion[]): PromotionStats => {
  const mostEngaged = promotions.reduce<Promotion | null>(
    (best, promotion) => (!best || promotion.participations > best.participations ? promotion : best),
    null
  );

  return {
    totalViews: promotions.reduce((sum, promotion) => sum + promotion.views, 0),
    totalFavorites: promotions.reduce((sum, promotion) => sum + promotion.favorites, 0),
    totalParticipations: promotions.reduce((sum, promotion) => sum + promotion.participations, 0),
    pointsAwarded: promotions.reduce((sum, promotion) => sum + promotion.pointsAwarded, 0),
    mostEngaged: mostEngaged ? { title: mostEngaged.title, uses: mostEngaged.participations } : null,
  };
};

interface UsePromotionsViewResult {
  data: Promotion[];
  meta: PromotionsMeta;
  stats: PromotionStats;
  isLoading: boolean;
  isMutating: boolean;
  createPromotion: (payload: PromotionPayload) => Promise<void>;
  updatePromotion: (id: string, payload: PromotionPayload) => Promise<void>;
  deletePromotion: (id: string) => Promise<void>;
}

/**
 * Mock-backed data layer for Promotions V2. Filtering, sorting and paging happen
 * here so the view and table stay presentational — exactly where the server
 * will take over.
 */
export const usePromotionsView = (query: PromotionsQuery): UsePromotionsViewResult => {
  const [promotions, setPromotions] = useState<Promotion[]>(MOCK_PROMOTIONS);
  const [isLoading, setIsLoading] = useState(false);
  const [isMutating, setIsMutating] = useState(false);

  const { page, limit, search, type, startDateFrom, endDateTo, sortBy, sortOrder } = query;

  // Stands in for the request round-trip so the loading states are exercised.
  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => setIsLoading(false), 250);
    return () => clearTimeout(timer);
  }, [page, limit, search, type, startDateFrom, endDateTo, sortBy, sortOrder]);

  // Header tiles read every promotion — they should not move when filters change.
  const stats = useMemo(() => buildStats(promotions), [promotions]);

  const filtered = useMemo(() => {
    const keyword = search.trim().toLowerCase();
    // Widen to whole days so a same-day promotion is never filtered out.
    const from = startDateFrom ? startOfDay(startDateFrom).getTime() : null;
    const to = endDateTo ? endOfDay(endDateTo).getTime() : null;

    return promotions.filter((promotion) => {
      if (keyword && !promotion.title.toLowerCase().includes(keyword)) return false;
      if (type && promotion.type !== type) return false;
      if (from !== null && new Date(promotion.startDate).getTime() < from) return false;
      if (to !== null && new Date(promotion.endDate).getTime() > to) return false;
      return true;
    });
  }, [promotions, search, type, startDateFrom, endDateTo]);

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

  const createPromotion = useCallback(
    async (payload: PromotionPayload) => {
      await runMutation(() => {
        // Counters start at zero — the server owns them from here on.
        const created: Promotion = { ...payload, id: `prm-${Date.now()}`, views: 0, favorites: 0, participations: 0, pointsAwarded: 0 };
        setPromotions((previous) => [created, ...previous]);
      });
    },
    [runMutation]
  );

  const updatePromotion = useCallback(
    async (id: string, payload: PromotionPayload) => {
      await runMutation(() => {
        setPromotions((previous) => previous.map((promotion) => (promotion.id === id ? { ...promotion, ...payload } : promotion)));
      });
    },
    [runMutation]
  );

  const deletePromotion = useCallback(
    async (id: string) => {
      await runMutation(() => {
        setPromotions((previous) => previous.filter((promotion) => promotion.id !== id));
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
    createPromotion,
    updatePromotion,
    deletePromotion,
  };
};
