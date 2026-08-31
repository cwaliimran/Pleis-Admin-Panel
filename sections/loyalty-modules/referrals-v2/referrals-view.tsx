'use client';

import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { useBoolean } from '@/hooks/useBoolean';
import { useCompanySelectionState } from '@/hooks/useCompanySelectionState';
import { useGetLocalReferralSettingQuery } from '@/store/Reducer/referrals-api';
import React, { useMemo, useState } from 'react';
import ReferralModal from '../referrals/referrals-modal';
import { LoyaltyViewProps } from '../types';
import ReferralsStatsCards from './components/referrals-stats-cards';
import { DEFAULT_PAGE_LIMIT } from './constants';
import ReferralsTable from './referrals-table';
import { ReferralSortKey, ReferralSortOrder, ReferralStatus, ReferralsQuery } from './types';
import { useReferralsView } from './use-referrals-view';

export const ReferralsViewV2: React.FC<LoyaltyViewProps> = ({ userType = 'super-admin' }) => {
  const settingModal = useBoolean();
  const [page, setPage] = useState(1);
  const [limit] = useState(DEFAULT_PAGE_LIMIT);

  const [keyword, setKeyword] = useState('');
  const [status, setStatus] = useState<ReferralStatus | ''>('');
  const [sortBy, setSortBy] = useState<ReferralSortKey | ''>('');
  const [sortOrder, setSortOrder] = useState<ReferralSortOrder>('');

  const query: ReferralsQuery = useMemo(
    () => ({ page, limit, keyword, status, sortBy, sortOrder }),
    [page, limit, keyword, status, sortBy, sortOrder]
  );

  const { data, meta, stats, isLoading, isFetching } = useReferralsView(query, userType);

  // Both V2 pages are the company-scoped view, so the settings modal always targets the local
  // (non-global) endpoints. Admins scope by the header company; an organizer's own id is the scope.
  const { user } = useAuth();
  const { companyId } = useCompanySelectionState();
  const scopedCompanyId = userType === 'super-admin' ? companyId || undefined : undefined;

  const { data: localReferralSettingData, isLoading: isSettingLoading } = useGetLocalReferralSettingQuery(
    { companyOrganizer: scopedCompanyId },
    { skip: userType === 'super-admin' && !companyId }
  );

  const referralSetting = localReferralSettingData?.data || {};
  const modalCompanyId = userType === 'super-admin' ? companyId : user?.basicInfo?._id || undefined;

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
      <div className="mt-3 mb-2 flex w-full items-center justify-end md:mt-0">
        {isSettingLoading ? (
          <Button className="bg-primary cursor-not-allowed rounded-4xl py-2 text-white" disabled>
            <span className="mr-2 inline-block h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent align-middle" />
            Loading...
          </Button>
        ) : (
          <Button className="bg-primary hover:bg-primary cursor-pointer rounded-4xl py-2 text-white" onClick={settingModal.onTrue}>
            Referral Setting
          </Button>
        )}
      </div>

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

      <ReferralModal
        open={settingModal.value}
        onClose={settingModal.onFalse}
        referralSettingData={referralSetting}
        global={false}
        companyId={modalCompanyId}
      />
    </div>
  );
};

export default ReferralsViewV2;
