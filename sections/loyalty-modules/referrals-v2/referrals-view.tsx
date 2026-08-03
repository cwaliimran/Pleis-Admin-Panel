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
  const [user, setUser] = useState('');
  const [referrer, setReferrer] = useState('');
  const [status, setStatus] = useState<ReferralStatus | ''>('');
  const [sortBy, setSortBy] = useState<ReferralSortKey | ''>('');
  const [sortOrder, setSortOrder] = useState<ReferralSortOrder>('');

  const query: ReferralsQuery = useMemo(
    () => ({ page, limit, user, referrer, status, sortBy, sortOrder }),
    [page, limit, user, referrer, status, sortBy, sortOrder]
  );

  const { data, meta, stats, settings, isLoading } = useReferralsView(query);

  // Every filter and sort change invalidates the current offset.
  const handleUserChange = (value: string) => {
    setUser(value);
    setPage(1);
  };

  const handleReferrerChange = (value: string) => {
    setReferrer(value);
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
    setUser('');
    setReferrer('');
    setStatus('');
    setSortBy('');
    setSortOrder('');
    setPage(1);
  };

  return (
    <div className="flex flex-col gap-2 pb-6">
      <ReferralsStatsCards stats={stats} settings={settings} isLoading={isLoading} />

      <ReferralsTable
        data={data}
        meta={meta}
        loading={isLoading}
        onPageChange={setPage}
        sortBy={sortBy}
        sortOrder={sortOrder}
        onSortChange={handleSortChange}
        user={user}
        onUserChange={handleUserChange}
        referrer={referrer}
        onReferrerChange={handleReferrerChange}
        status={status}
        onStatusChange={handleStatusChange}
        onResetFilters={handleResetFilters}
      />
    </div>
  );
};

export default ReferralsViewV2;
