'use client';

import { useBoolean } from '@/hooks/useBoolean';
import { showSuccess } from '@/utils/toast';
import React, { useMemo, useState } from 'react';
import { LoyaltyViewProps } from '../types';
import StreaksStatsCards from './components/streaks-stats-cards';
import { DEFAULT_PAGE_LIMIT } from './constants';
import StreakDetailModal from './modals/streak-detail-modal';
import StreakRulesModal from './modals/streak-rules-modal';
import StreaksTable from './streaks-table';
import { StreakBadge, StreakMember, StreakRules, StreakSortKey, StreakSortOrder, StreaksQuery } from './types';
import { useStreaksView } from './use-streaks-view';


export const StreaksViewV2: React.FC<LoyaltyViewProps> = ({ userType = 'super-admin' }) => {
  const [page, setPage] = useState(1);
  const [limit] = useState(DEFAULT_PAGE_LIMIT);
  const [search, setSearch] = useState('');
  const [badge, setBadge] = useState<StreakBadge | ''>('');
  const [lastVisitFrom, setLastVisitFrom] = useState<Date | undefined>(undefined);
  const [sortBy, setSortBy] = useState<StreakSortKey | ''>('');
  const [sortOrder, setSortOrder] = useState<StreakSortOrder>('');

  const [viewing, setViewing] = useState<StreakMember | null>(null);

  const detailModal = useBoolean();
  const rulesModal = useBoolean();

  const query: StreaksQuery = useMemo(
    () => ({ page, limit, search, badge, lastVisitFrom, sortBy, sortOrder }),
    [page, limit, search, badge, lastVisitFrom, sortBy, sortOrder]
  );

  const { data, meta, stats, rules, isLoading, isFetching, isRulesLoading, isMutating, saveRules } = useStreaksView(query, userType);

  // Every filter and sort change invalidates the current offset.
  const handleSearchChange = (value: string) => {
    setSearch(value);
    setPage(1);
  };

  const handleBadgeChange = (value: StreakBadge | '') => {
    setBadge(value);
    setPage(1);
  };

  const handleLastVisitFromChange = (value: Date | undefined) => {
    setLastVisitFrom(value);
    setPage(1);
  };

  const handleSortChange = (nextSortBy: StreakSortKey | '', nextSortOrder: StreakSortOrder) => {
    setSortBy(nextSortBy);
    setSortOrder(nextSortOrder);
    setPage(1);
  };

  const handleResetFilters = () => {
    setSearch('');
    setBadge('');
    setLastVisitFrom(undefined);
    setSortBy('');
    setSortOrder('');
    setPage(1);
  };

  const handleViewDetail = (item: StreakMember) => {
    setViewing(item);
    detailModal.onTrue();
  };

  const handleSaveRules = async (next: StreakRules) => {
    await saveRules(next);
    showSuccess('Streak rules saved');
  };

  return (
    <div className="flex flex-col gap-2 pb-6">
      {/* The Current Rules tile reads off the rule set, so it waits on both. */}
      <StreaksStatsCards stats={stats} rules={rules} isLoading={isLoading || isRulesLoading} />

      <StreaksTable
        data={data}
        meta={meta}
        loading={isLoading || isFetching}
        onOpenRules={rulesModal.onTrue}
        rulesLoading={isRulesLoading}
        onViewDetail={handleViewDetail}
        onPageChange={setPage}
        sortBy={sortBy}
        sortOrder={sortOrder}
        onSortChange={handleSortChange}
        search={search}
        onSearchChange={handleSearchChange}
        badge={badge}
        onBadgeChange={handleBadgeChange}
        lastVisitFrom={lastVisitFrom}
        onLastVisitFromChange={handleLastVisitFromChange}
        onResetFilters={handleResetFilters}
      />

      <StreakDetailModal
        open={detailModal.value}
        member={viewing}
        rules={rules}
        onClose={() => {
          detailModal.onFalse();
          setViewing(null);
        }}
      />

      <StreakRulesModal
        open={rulesModal.value}
        rules={rules}
        isSubmitting={isMutating}
        onSubmit={handleSaveRules}
        onClose={rulesModal.onFalse}
      />
    </div>
  );
};

export default StreaksViewV2;
