'use client';

import { useCompanySelectionState } from '@/hooks/useCompanySelectionState';
import type { ApiPromotion, ApiPromotionActiveDays, ApiPromotionType, ApiPromotionsMeta } from '@/store/Reducer/promotions-v2-api';
import { useGetPromotionsV2Query } from '@/store/Reducer/promotions-v2-api';
import { format } from 'date-fns';
import { useMemo } from 'react';
import { PROMOTION_TYPE_LABELS, WEEKDAY_ORDER } from './constants';
import { Promotion, PromotionActiveDaysMode, PromotionStats, PromotionType, PromotionsMeta, PromotionsQuery, Weekday } from './types';

const EMPTY_STATS: PromotionStats = {
  totalViews: 0,
  totalFavorites: 0,
  totalParticipations: 0,
  pointsAwarded: 0,
  mostEngaged: null,
};

const API_TYPE_TO_VIEW: Record<ApiPromotionType, PromotionType> = {
  extraPointsForItem: 'extraPoints',
  happyHour: 'happyHour',
  productSale: 'itemDiscount',
  claimPromotion: 'claimPromotion',
};

const VIEW_TYPE_TO_API: Record<PromotionType, ApiPromotionType> = {
  extraPoints: 'extraPointsForItem',
  happyHour: 'happyHour',
  itemDiscount: 'productSale',
  claimPromotion: 'claimPromotion',
};

const toViewType = (type: ApiPromotionType): PromotionType => API_TYPE_TO_VIEW[type] ?? (type as unknown as PromotionType);

const toWeekdays = (days?: string[]): Weekday[] => (days ?? []).filter((day): day is Weekday => WEEKDAY_ORDER.includes(day as Weekday));

interface Schedule {
  activeDaysMode?: PromotionActiveDaysMode;
  activeWeekdays: Weekday[];
}

const toSchedule = (activeDays?: ApiPromotionActiveDays): Schedule => {
  if (!activeDays) return { activeWeekdays: [] };

  if (Array.isArray(activeDays)) {
    return { activeDaysMode: 'specific', activeWeekdays: toWeekdays(activeDays) };
  }

  const mode: PromotionActiveDaysMode | undefined = activeDays.mode === 'all' ? 'all' : activeDays.mode === 'selective' ? 'specific' : undefined;

  return { activeDaysMode: mode, activeWeekdays: toWeekdays(activeDays.days) };
};

const toPromotion = (item: ApiPromotion): Promotion => {
  const menuItems = item.menuItem ?? [];
  // The form scopes items to a single menu, so the first populated one wins.
  const menu = menuItems.find((menuItem) => menuItem.menu?._id)?.menu;

  return {
    id: item._id,
    title: item.title ?? '',
    image: item.image ?? '',
    description: item.description ?? '',
    type: toViewType(item.promotionType),
    status: item.status === 'inactive' ? 'inactive' : 'active',

    menuId: menu?._id,
    menuName: menu?.title,
    qualifyingItemIds: menuItems.map((menuItem) => menuItem._id),
    qualifyingItems: menuItems.map((menuItem) => ({ id: menuItem._id, name: menuItem.title })),

    extraPointsPerPurchase: item.extraPoints ?? 0,
    pointsMultiplier: item.pointsMultiplier ?? 1,
    discountPercent: item.discountedPercent ?? 0,

    startDate: item.startDate ?? '',
    endDate: item.endDate ?? '',
    ...toSchedule(item.activeDays),
    startTime: item.startTime || undefined,
    endTime: item.endTime || undefined,

    views: item.totalViews ?? 0,
    favorites: item.totalFavorites ?? 0,
    participations: item.participants ?? 0,
    pointsAwarded: item.pointsAwarded ?? 0,
    viewToUseRate: item.viewToParticipantPercentage ?? 0,
    avgPointsPerParticipant: item.avgPointsPerParticipant ?? 0,
  };
};

const toStats = (meta?: ApiPromotionsMeta | null): PromotionStats => {
  if (!meta) return EMPTY_STATS;

  const top = meta.highestPromotionType;

  return {
    totalViews: meta.totalViews ?? 0,
    totalFavorites: meta.totalFavorites ?? 0,
    totalParticipations: meta.totalParticipants ?? 0,
    pointsAwarded: meta.totalPointsAwarded ?? 0,
    mostEngaged: top ? { title: PROMOTION_TYPE_LABELS[toViewType(top.promotionType)] ?? top.promotionType, uses: top.participants ?? 0 } : null,
  };
};

const toDateParam = (value?: Date): string | undefined => (value ? format(value, 'yyyy-MM-dd') : undefined);

interface UsePromotionsViewResult {
  data: Promotion[];
  meta: PromotionsMeta;
  stats: PromotionStats;
  isLoading: boolean;
  isFetching: boolean;
}

export const usePromotionsView = (query: PromotionsQuery): UsePromotionsViewResult => {
  const { companyId } = useCompanySelectionState();

  const { page, limit, search, type, startDateFrom, endDateTo } = query;

  const { data, isLoading, isFetching } = useGetPromotionsV2Query(
    {
      companyOrganizer: companyId as string,
      page,
      limit,
      keyword: search.trim() || undefined,
      promotionType: type ? VIEW_TYPE_TO_API[type] : undefined,
      startDate: toDateParam(startDateFrom),
      endDate: toDateParam(endDateTo),
    },
    { skip: !companyId, refetchOnMountOrArgChange: true }
  );

  const promotions = useMemo(() => (data?.data ?? []).map(toPromotion), [data]);

  const meta = useMemo<PromotionsMeta>(
    () => ({
      currentPage: data?.meta?.currentPage ?? page,
      totalPages: data?.meta?.totalPages ?? 1,
      totalRecords: data?.meta?.totalRecords ?? promotions.length,
      limit: data?.meta?.limit ?? limit,
    }),
    [data, page, limit, promotions.length]
  );

  const stats = useMemo(() => toStats(data?.meta), [data]);

  return { data: promotions, meta, stats, isLoading, isFetching };
};
