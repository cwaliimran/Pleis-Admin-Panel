'use client';

import { useCompanySelectionState } from '@/hooks/useCompanySelectionState';
import type { ApiChallenge, ApiChallengeStats } from '@/store/Reducer/challenges-v2-api';
import { useGetChallengesV2Query } from '@/store/Reducer/challenges-v2-api';
import { useMemo } from 'react';
import { Challenge, ChallengeStats, ChallengesMeta, ChallengesQuery } from './types';

const EMPTY_STATS: ChallengeStats = {
  totalViews: 0,
  totalFavorites: 0,
  totalParticipants: 0,
  totalCompletions: 0,
  mostCompleted: null,
};

const toChallenge = (item: ApiChallenge): Challenge => {
  const reward = item.reward;
  const ticket = reward?.specialTicket;

  return {
    id: item._id,
    name: item.title ?? '',
    image: item.image ?? '',
    description: item.description ?? '',
    taskType: item.taskType,
    rewardType: reward?.rewardType ?? 'points',
    status: item.status,

    taskValue: item.taskValue ?? 0,

    taskMenuItemId: item.taskMenuItem?._id,
    taskMenuItemName: item.taskMenuItem?.title,
    taskMenuId: item.taskMenuItem?.menu,

    pointReward: reward?.rewardValue ?? 0,
    customRewardTitle: reward?.customReward?.title,
    customRewardDescription: reward?.customReward?.description,

    // `specialTicket` comes back as an empty object on every other reward type,
    // so it only counts as present when it actually names an event.
    specialTicket: ticket?.event
      ? {
          eventId: ticket.event._id,
          eventName: ticket.event.basicInfo?.title,
          organizationId: ticket.organization?._id,
          organizationName: ticket.organization?.basicInfo?.name,
          companyName: ticket.companyOrganizer?.companyDetails?.name,
          timeSlotId: ticket.timeSlot ?? undefined,
          isFastTrack: ticket.isFastTrack ?? false,
        }
      : undefined,

    // Write-only on the API; the list never echoes it back.
    repeatable: false,
    claimLimit: item.claimLimit ?? null,
    endDate: item.endDate ?? '',
    tierId: item.tierLimit?._id ?? '',
    tierName: item.tierLimit?.title ?? '',

    views: item.views ?? 0,
    favorites: item.favoritesCount ?? 0,
    participants: item.totalParticipants ?? 0,
    completions: item.completed ?? 0,
    inProgress: item.inProgress ?? 0,
    expired: item.expired ?? 0,
    avgProgress: item.averageProgress ?? 0,
    participationRate: item.participationRate ?? 0,
    completionRate: item.completionRate ?? 0,
  };
};

const toStats = (stats?: ApiChallengeStats | null): ChallengeStats => {
  if (!stats) return EMPTY_STATS;

  const most = stats.mostCompletedChallenge;

  return {
    totalViews: stats.totalViews ?? 0,
    totalFavorites: stats.totalFavorites ?? 0,
    totalParticipants: stats.totalParticipants ?? 0,
    totalCompletions: stats.totalCompletions ?? 0,
    mostCompleted: most?.name ? { name: most.name, completions: most.count ?? 0 } : null,
  };
};

interface UseChallengesViewResult {
  data: Challenge[];
  meta: ChallengesMeta;
  stats: ChallengeStats;
  isLoading: boolean;
  isFetching: boolean;
}

/**
 * Data layer for Challenges V2. Filtering, sorting and paging are all done by
 * the server; this only maps the wire format onto the view model.
 */
export const useChallengesView = (query: ChallengesQuery): UseChallengesViewResult => {
  // Admin picks the company in the header; the page sits behind `CompanyGuard`.
  const { companyId } = useCompanySelectionState();

  const { page, limit, search, taskType, rewardType, status, sortBy, sortOrder } = query;

  const { data, isLoading, isFetching } = useGetChallengesV2Query(
    {
      companyOrganizer: companyId as string,
      page,
      limit,
      keyword: search.trim() || undefined,
      status: status || undefined,
      taskType: taskType || undefined,
      rewardType: rewardType || undefined,
      sortBy: sortBy || undefined,
      sortOrder: sortOrder || undefined,
    },
    { skip: !companyId, refetchOnMountOrArgChange: true }
  );

  const challenges = useMemo(() => (data?.data ?? []).map(toChallenge), [data]);

  const meta = useMemo<ChallengesMeta>(
    () => ({
      currentPage: data?.meta?.currentPage ?? page,
      totalPages: data?.meta?.totalPages ?? 1,
      totalRecords: data?.meta?.totalRecords ?? 0,
      limit: data?.meta?.limit ?? limit,
    }),
    [data, page, limit]
  );

  const stats = useMemo(() => toStats(data?.meta?.stats), [data]);

  return { data: challenges, meta, stats, isLoading, isFetching };
};
