'use client';

import React, { useMemo, useState } from 'react';
import ReferralsStatsCards from './components/referrals-stats-cards';
import { DEFAULT_PAGE_LIMIT } from './constants';
import ReferralsTable from './referrals-table';
import { ReferralSortKey, ReferralSortOrder, ReferralStatus, ReferralsQuery } from './types';
import { useReferralsView } from './use-referrals-view';


export const ReferralsViewV2: React.FC = () => {
  const [page, setPage] = useState(1);
  const [limit] = useState(DEFAULT_PAGE_LIMIT);
  // The endpoint takes a single `keyword`, so the User and Referrer inputs
  // share this one value.
  const [keyword, setKeyword] = useState('');
  const [status, setStatus] = useState<ReferralStatus | ''>('');
  const [sortBy, setSortBy] = useState<ReferralSortKey | ''>('');
  const [sortOrder, setSortOrder] = useState<ReferralSortOrder>('');

  const query: ReferralsQuery = useMemo(
    () => ({ page, limit, keyword, status, sortBy, sortOrder }),
    [page, limit, keyword, status, sortBy, sortOrder]
  );

  const { data, meta, stats, isLoading, isFetching } = useReferralsView(query);

  // Every filter and sort change invalidates the current offset.
  const handleKeywordChange = (value: string) => {
    setKeyword(value);
    setPage(1);
  };

  const handleStatusChange = (value: ReferralStatus | '') => {
    setStatus(value);
    setPage(1);
  };

  const handleSortChange = (nextSortBy: ReferralSortKey | '', nextSortOrder: ReferralSortOrder) => {
    setSortBy(nextSortBy);
    setSortOrder(nextSortOrder);
    setPage(1);
  };

  const handleResetFilters = () => {
    setKeyword('');
    setStatus('');
    setSortBy('');
    setSortOrder('');
    setPage(1);
  };

  return (
    <div className="flex flex-col gap-2 pb-6">
      <ReferralsStatsCards stats={stats} isLoading={isLoading} />

      <ReferralsTable
        data={data}
        meta={meta}
        loading={isLoading || isFetching}
        onPageChange={setPage}
        sortBy={sortBy}
        sortOrder={sortOrder}
        onSortChange={handleSortChange}
        keyword={keyword}
        onKeywordChange={handleKeywordChange}
        status={status}
        onStatusChange={handleStatusChange}
        onResetFilters={handleResetFilters}
      />
    </div>
  );
};

export default ReferralsViewV2;
