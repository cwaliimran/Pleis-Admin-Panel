'use client';

import { useEffect, useMemo, useState } from 'react';
import { DEFAULT_PAGE_LIMIT, REFERRAL_STATUS_RANK } from './constants';
import { MOCK_REFERRALS, MOCK_REFERRAL_SETTINGS, MOCK_REFERRAL_STATS } from './mock-data';
import { Referral, ReferralSettings, ReferralSortKey, ReferralStats, ReferralsMeta, ReferralsQuery } from './types';

const compareBy = (key: ReferralSortKey, a: Referral, b: Referral): number => {
  switch (key) {
    case 'user':
      return a.user.localeCompare(b.user);
    case 'referrer':
      return a.referrer.localeCompare(b.referrer);
    case 'status':
      return REFERRAL_STATUS_RANK[a.status] - REFERRAL_STATUS_RANK[b.status];
    case 'createdAt':
    case 'expiryDate':
      return new Date(a[key]).getTime() - new Date(b[key]).getTime();
    default:
      return a[key] - b[key];
  }
};

interface UseReferralsViewResult {
  data: Referral[];
  meta: ReferralsMeta;
  stats: ReferralStats;
  settings: ReferralSettings;
  isLoading: boolean;
}

/**
 * Mock-backed data layer for Referrals V2. Filtering, sorting and paging happen
 * here so the view and table stay presentational — exactly where the server
 * will take over.
 *
 * Referrals are read-only: members generate them by sharing their code, so
 * there are no mutations in this module.
 */
export const useReferralsView = (query: ReferralsQuery): UseReferralsViewResult => {
  const [referrals] = useState<Referral[]>(MOCK_REFERRALS);
  const [isLoading, setIsLoading] = useState(false);

  const { page, limit, user, referrer, status, sortBy, sortOrder } = query;

  // Stands in for the request round-trip so the loading states are exercised.
  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => setIsLoading(false), 250);
    return () => clearTimeout(timer);
  }, [page, limit, user, referrer, status, sortBy, sortOrder]);

  const filtered = useMemo(() => {
    const userKeyword = user.trim().toLowerCase();
    const referrerKeyword = referrer.trim().toLowerCase();

    return referrals.filter((referral) => {
      if (userKeyword && !referral.user.toLowerCase().includes(userKeyword)) return false;
      if (referrerKeyword && !referral.referrer.toLowerCase().includes(referrerKeyword)) return false;
      if (status && referral.status !== status) return false;
      return true;
    });
  }, [referrals, user, referrer, status]);

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

  return {
    data,
    meta: { currentPage, totalPages, totalRecords, limit: pageSize },
    stats: MOCK_REFERRAL_STATS,
    settings: MOCK_REFERRAL_SETTINGS,
    isLoading,
  };
};
