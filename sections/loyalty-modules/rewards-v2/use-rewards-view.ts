'use client';

import { useCompanySelectionState } from '@/hooks/useCompanySelectionState';
import type { ApiReward, ApiRewardStats } from '@/store/Reducer/rewards-v2-api';
import { useGetRewardTypesQuery, useGetRewardsV2Query } from '@/store/Reducer/rewards-v2-api';
import { useMemo } from 'react';
import { REWARD_TYPE_OPTIONS_LIMIT } from './constants';
import { Reward, RewardStats, RewardsMeta, RewardsQuery } from './types';

const EMPTY_STATS: RewardStats = {
  totalViews: 0,
  totalFavorites: 0,
  totalClaims: 0,
  totalRedemptions: 0,
  mostClaimed: null,
};

const toReward = (item: ApiReward): Reward => ({
  id: item._id,
  name: item.title ?? '',
  image: item.image ?? '',
  type: item.sortingType ?? '',
  status: item.status,
  creationMethod: item.rewardType,

  // Older records predate these flags; a missing flag means the reward is a
  // normal browsable one, so metrics stay meaningful.
  availableAsReward: item.availableAsReward ?? true,
  challengeOnly: item.challengeOnly ?? false,
  isPromotionOnly: item.isPromotionOnly ?? false,

  menuId: item.menuItem?.menu?._id,
  menuName: item.menuItem?.menu?.title,
  menuItemId: item.menuItem?._id,
  menuItemName: item.menuItem?.title,

  eventId: item.event ?? undefined,
  ticketId: item.ticket ?? undefined,
  timeSlotId: item.timeSlot ?? undefined,
  isFastTrack: item.isFastTrack ?? false,

  pointCost: item.minPointsRequiredToClaim ?? 0,
  totalLimit: item.claimLimit ?? null,
  maxClaimsPerUser: item.maxLimitPerUser ?? null,
  tierId: item.tierLimit?._id ?? '',
  tierName: item.tierLimit?.title ?? '',
  percentOff: item.percentOff ?? 0,
  endDate: item.endDate ?? '',
  description: item.description ?? '',

  views: item.views ?? 0,
  favorites: item.favoritesCount ?? 0,
  claims: item.claimed ?? 0,
  redeemed: item.redeemed ?? 0,
  conversion: item.conversion ?? 0,
  redemptionRate: item.redemptionRate ?? 0,
});

const toStats = (stats?: ApiRewardStats | null): RewardStats => {
  if (!stats) return EMPTY_STATS;

  const most = stats.mostClaimedReward;

  return {
    totalViews: stats.totalViews ?? 0,
    totalFavorites: stats.totalFavorites ?? 0,
    totalClaims: stats.totalClaims ?? 0,
    totalRedemptions: stats.totalRedemptions ?? 0,
    mostClaimed: most?.name ? { name: most.name, claims: most.count ?? 0 } : null,
  };
};

interface UseRewardsViewResult {
  data: Reward[];
  meta: RewardsMeta;
  stats: RewardStats;
  /** Distinct grouping values, for the Type filter. */
  typeOptions: { value: string; label: string }[];
  isLoading: boolean;
  isFetching: boolean;
}

/**
 * Data layer for Rewards V2. Filtering, sorting and paging are all done by the
 * server; this only maps the wire format onto the view model.
 */
export const useRewardsView = (query: RewardsQuery, userType: 'organizer' | 'super-admin' = 'super-admin'): UseRewardsViewResult => {
  // Admin picks the company in the header; the page sits behind `CompanyGuard`. Organizers have no
  // company control — their token scopes the request, so the param is omitted and nothing is skipped.
  const { companyId } = useCompanySelectionState();
  const scopedCompanyId = userType === 'super-admin' ? (companyId ?? undefined) : undefined;
  const companySkip = userType === 'super-admin' && !companyId;

  const { page, limit, search, type, status, sortBy, sortOrder } = query;

  const { data, isLoading, isFetching } = useGetRewardsV2Query(
    {
      companyOrganizer: scopedCompanyId as string,
      page,
      limit,
      keyword: search.trim() || undefined,
      status: status || undefined,
      sortingType: type || undefined,
      sortBy: sortBy || undefined,
      sortOrder: sortOrder || undefined,
    },
    { skip: companySkip, refetchOnMountOrArgChange: true }
  );

  const { data: rewardTypes } = useGetRewardTypesQuery(
    { companyOrganizer: scopedCompanyId as string, limit: REWARD_TYPE_OPTIONS_LIMIT },
    { skip: companySkip }
  );

  const rewards = useMemo(() => (data?.data ?? []).map(toReward), [data]);

  // The endpoint returns one row per reward, so the same grouping value can
  // repeat — deduped here so the dropdown lists each option once.
  const typeOptions = useMemo(() => {
    const distinct = Array.from(new Set((rewardTypes ?? []).map((option) => option.sortingType).filter(Boolean)));
    distinct.sort((a, b) => a.localeCompare(b));
    return distinct.map((value) => ({ value, label: value }));
  }, [rewardTypes]);

  const meta = useMemo<RewardsMeta>(
    () => ({
      currentPage: data?.meta?.currentPage ?? page,
      totalPages: data?.meta?.totalPages ?? 1,
      totalRecords: data?.meta?.totalRecords ?? 0,
      limit: data?.meta?.limit ?? limit,
    }),
    [data, page, limit]
  );

  const stats = useMemo(() => toStats(data?.meta?.stats), [data]);

  return { data: rewards, meta, stats, typeOptions, isLoading, isFetching };
};
