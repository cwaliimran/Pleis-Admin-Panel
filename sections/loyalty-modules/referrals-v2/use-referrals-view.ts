'use client';

import { useCompanySelectionState } from '@/hooks/useCompanySelectionState';
import type { ApiReferral, ApiReferralStats } from '@/store/Reducer/referrals-v2-api';
import { useGetReferralsV2Query } from '@/store/Reducer/referrals-v2-api';
import { useMemo } from 'react';
import { Referral, ReferralStats, ReferralsMeta, ReferralsQuery } from './types';

const EMPTY_STATS: ReferralStats = {
  completed: 0,
  pending: 0,
  pointsGiven: 0,
  topReferrer: null,
};

/** The invitee arrives as split name parts; the referrer arrives pre-joined. */
const toFullName = (firstName?: string, lastName?: string): string => [firstName, lastName].filter(Boolean).join(' ').trim();

const toReferral = (item: ApiReferral): Referral => ({
  id: item._id,
  user: toFullName(item.firstName, item.lastName) || '—',
  referrer: item.referrerUserName || '—',
  refLimit: item.referralLimit ?? 0,
  refCount: item.loyaltyReferralsCount ?? 0,
  userPoints: item.userReward ?? 0,
  referrerPoints: item.referrerReward ?? 0,
  createdAt: item.createdAt ?? '',
  expiryDate: item.expiryDate ?? '',
  status: item.status,
});

const toStats = (stats?: ApiReferralStats | null): ReferralStats => {
  if (!stats) return EMPTY_STATS;

  const top = stats.topReferrer;

  return {
    completed: stats.totalCompleted ?? 0,
    pending: stats.totalPending ?? 0,
    pointsGiven: stats.totalPointsGiven ?? 0,
    topReferrer: top?.referrer?.name ? { username: top.referrer.name, referrals: top.count ?? 0 } : null,
  };
};

interface UseReferralsViewResult {
  data: Referral[];
  meta: ReferralsMeta;
  stats: ReferralStats;
  isLoading: boolean;
  isFetching: boolean;
}

/**
 * Data layer for Referrals V2. Filtering and paging are done by the server;
 * this only maps the wire format onto the view model.
 *
 * Referrals are read-only: members generate them by sharing their code, so
 * there are no mutations in this module.
 */
export const useReferralsView = (query: ReferralsQuery): UseReferralsViewResult => {
  // Admin picks the company in the header; the page sits behind `CompanyGuard`.
  const { companyId } = useCompanySelectionState();

  const { page, limit, keyword, status } = query;

  const { data, isLoading, isFetching } = useGetReferralsV2Query(
    {
      companyOrganizer: companyId as string,
      page,
      limit,
      keyword: keyword.trim() || undefined,
      status: status || undefined,
    },
    { skip: !companyId, refetchOnMountOrArgChange: true }
  );

  const referrals = useMemo(() => (data?.data ?? []).map(toReferral), [data]);

  const meta = useMemo<ReferralsMeta>(
    () => ({
      currentPage: data?.meta?.currentPage ?? page,
      totalPages: data?.meta?.totalPages ?? 1,
      totalRecords: data?.meta?.totalRecords ?? 0,
      limit: data?.meta?.limit ?? limit,
    }),
    [data, page, limit]
  );

  const stats = useMemo(() => toStats(data?.meta?.stats), [data]);

  return { data: referrals, meta, stats, isLoading, isFetching };
};
