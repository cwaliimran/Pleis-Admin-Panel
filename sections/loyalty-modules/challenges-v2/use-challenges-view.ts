'use client';

import { useCompanySelectionState } from '@/hooks/useCompanySelectionState';
import type { ApiChallenge, ApiChallengeRef, ApiChallengeStats } from '@/store/Reducer/challenges-v2-api';
import { useGetChallengesV2Query } from '@/store/Reducer/challenges-v2-api';
import { useMemo } from 'react';
import { Challenge, ChallengeItemRef, ChallengeStats, ChallengesMeta, ChallengesQuery } from './types';

const EMPTY_STATS: ChallengeStats = {
  totalViews: 0,
  totalFavorites: 0,
  totalParticipants: 0,
  totalCompletions: 0,
  mostCompleted: null,
};

/**
 * Reference fields arrive either populated or as a bare id, and singly or as a
 * list. Everything is normalised to a list, with the id standing in for a name
 * that was never populated.
 */
const toItemRefs = (value?: ApiChallengeRef[] | ApiChallengeRef | null): ChallengeItemRef[] => {
  if (!value) return [];

  const list = Array.isArray(value) ? value : [value];

  return list.reduce<ChallengeItemRef[]>((refs, entry) => {
    if (typeof entry === 'string') {
      if (entry) refs.push({ id: entry, name: entry, menuId: '', menuName: '' });
      return refs;
    }

    if (!entry?._id) return refs;

    const menu = entry.menu;

    refs.push({
      id: entry._id,
      name: entry.title || entry._id,
      menuId: typeof menu === 'string' ? menu : (menu?._id ?? ''),
      menuName: typeof menu === 'string' ? '' : (menu?.title ?? ''),
    });

    return refs;
  }, []);
};

const toChallenge = (item: ApiChallenge): Challenge => {
  const reward = item.reward;
  const ticket = reward?.specialTicket;
  const [linkedReward] = toItemRefs(reward?.linkedReward);

  return {
    id: item._id,
    name: item.title ?? '',
    image: item.image ?? '',
    description: item.description ?? '',
    taskType: item.taskType,
    rewardType: reward?.rewardType ?? 'points',
    status: item.status,

    taskValue: item.taskValue ?? 0,

    taskMenuItems: toItemRefs(item.taskMenuItem),

    pointReward: reward?.rewardValue ?? 0,
    rewardMenuItems: toItemRefs(reward?.rewardMenuItem),
    linkedRewardId: linkedReward?.id ?? '',
    // The id doubles as the name when unpopulated, which is no use as a label.
    linkedRewardName: linkedReward && linkedReward.name !== linkedReward.id ? linkedReward.name : '',
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

    repeatable: item.repeatComplition ?? false,
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
export const useChallengesView = (query: ChallengesQuery, userType: 'organizer' | 'super-admin' = 'super-admin'): UseChallengesViewResult => {
  // Admin picks the company in the header; the page sits behind `CompanyGuard`. Organizers have no
  // company control — their token scopes the request, so the param is omitted and nothing is skipped.
  const { companyId } = useCompanySelectionState();
  const scopedCompanyId = userType === 'super-admin' ? (companyId ?? undefined) : undefined;
  const companySkip = userType === 'super-admin' && !companyId;

  const { page, limit, search, taskType, rewardType, status, sortBy, sortOrder } = query;

  const { data, isLoading, isFetching } = useGetChallengesV2Query(
    {
      companyOrganizer: scopedCompanyId as string,
      page,
      limit,
      keyword: search.trim() || undefined,
      status: status || undefined,
      taskType: taskType || undefined,
      rewardType: rewardType || undefined,
      sortBy: sortBy || undefined,
      sortOrder: sortOrder || undefined,
    },
    { skip: companySkip, refetchOnMountOrArgChange: true }
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
