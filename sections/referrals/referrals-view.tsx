'use client';

import { useBoolean } from '@/hooks/useBoolean';
import { useGetVenuesQuery } from '@/store/Reducer/venue';
import { formatDate } from '@/utils/format-time';
import { Button } from '@/components/ui/button';
import { useEffect, useState } from 'react';
import RefferralModal from './referrals-modal';
import ReferralsTable from './referrals-table';

interface ReferralsViewProps {
  userType: 'super-admin' | 'organizer';
}

const ReferralsView = ({ userType }: ReferralsViewProps) => {
  const openModal = useBoolean();

  // Pagination and filter state
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState<string>('');
  const [date, setDate] = useState<Date | undefined>(undefined);

  const { data: apiData, isLoading } = useGetVenuesQuery({
    page: page - 1,
    search,
    limit,
    status: status === 'all' ? '' : status,
    date: date ? formatDate(date) : undefined,
  });

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
      <div>
        <div className="mt-3 flex w-full items-center justify-end md:mt-0">
          <Button
            className="bg-primary hover:bg-primary cursor-pointer rounded-4xl py-2 text-white"
            onClick={handleSettingModal}
          >
            Referral Setting
          </Button>
        </div>
      </div>

      <ReferralsTable
        data={localData}
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

      <RefferralModal open={openModal.value} onClose={openModal.onFalse} />
    </div>
  );
};

export default ReferralsView;
