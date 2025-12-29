'use client';

import { Button } from '@/components/ui/button';
import { useBoolean } from '@/hooks/useBoolean';
import { useGetGlobalReferralSettingQuery, useGetReferralsQuery } from '@/store/Reducer/referrals-api';
import { formatDate } from '@/utils/format-time';
import { useEffect, useState } from 'react';
import RefferralModal from './referrals-modal';
import ReferralsTable from './referrals-table';

interface ReferralsViewProps {
  userType: 'super-admin' | 'organizer';
  global?: boolean;
}

const ReferralsView = ({ userType, global }: ReferralsViewProps) => {
  const openModal = useBoolean();

  // Pagination and filter state
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState<string>('');
  const [date, setDate] = useState<Date | undefined>(undefined);

  const { data: apiData, isLoading } = useGetReferralsQuery({
    page: page - 1,
    search,
    limit,
    status: status === 'all' ? '' : status,
    date: date ? formatDate(date) : undefined,
    isGlobal: global,
  });

  const { data: referralSettingData, isLoading: isSettingLoading } = useGetGlobalReferralSettingQuery({});
  const setting = referralSettingData?.data?.[0] || {};

  const [localData, setLocalData] = useState<any[]>([]);

  const [meta, setMeta] = useState<any>({
    currentPage: page,
    totalPages: 1,
    totalRecords: 0,
    limit,
  });

  useEffect(() => {
    if (apiData?.data) {
      setLocalData(apiData.data);
      setMeta(
        apiData.meta || {
          currentPage: page,
          totalPages: 1,
          totalRecords: 0,
          limit,
        }
      );
    }
  }, [apiData, page, limit]);

  const handleSettingModal = () => {
    openModal.onTrue();
  };

  return (
    <div>
      <div className="mt-3 flex w-full items-center justify-end md:mt-0">
        {isSettingLoading ? (
          <Button className="bg-primary cursor-not-allowed rounded-4xl py-2 text-white" disabled>
            <span className="mr-2 inline-block h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent align-middle" />
            Loading...
          </Button>
        ) : (
          <Button className="bg-primary hover:bg-primary cursor-pointer rounded-4xl py-2 text-white" onClick={handleSettingModal}>
            Referral Setting
          </Button>
        )}
      </div>

      <ReferralsTable
        data={localData}
        global={global}
        meta={meta}
        userType={userType}
        loading={isLoading}
        onPageChange={setPage}
        onLimitChange={(l) => {
          setLimit(l);
          setPage(1);
        }}
        onSearch={(val) => {
          setSearch(val);
          setPage(1);
        }}
        search={search}
        limit={limit}
        page={page}
        status={status}
        onStatusChange={(val) => {
          setStatus(val);
          setPage(1);
        }}
        date={date}
        onDateChange={(val) => {
          setDate(val);
          setPage(1);
        }}
        onResetFilters={() => {
          setStatus('');
          setDate(undefined);
          setSearch('');
          setPage(1);
        }}
      />

      <RefferralModal open={openModal.value} onClose={openModal.onFalse} referralSettingData={setting} />
    </div>
  );
};

export default ReferralsView;
