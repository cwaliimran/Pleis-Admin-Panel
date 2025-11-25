'use client';

import { useBoolean } from '@/hooks/useBoolean';
import { useCompanySelectionState } from '@/hooks/useCompanySelectionState';
import { useGetMembersQuery } from '@/store/Reducer/members-api';
import { formatDate } from '@/utils/format-time';
import { useEffect, useState } from 'react';
import GiftPointsModal from './gift-points-modal';
import LoyaltyMembersTable from './members-table';

interface PromotionsViewProps {
  global?: boolean;
  usertype: string;
}

const LoyaltyMembersView = ({ global, usertype }: PromotionsViewProps) => {
  const openGiftModal = useBoolean();

  // Pagination and filter state
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState<string>('');
  const [date, setDate] = useState<Date | undefined>(undefined);

  const [selectedId, setSelectedId] = useState<string | null>(null);

  const { companyId } = useCompanySelectionState();

  const { data: apiData, isLoading } = useGetMembersQuery({
    page: page - 1,
    search,
    limit,
    status: status === 'all' ? '' : status,
    date: date ? formatDate(date) : undefined,
    companyOrganizer: companyId || undefined,
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

  const handleGiftModal = (id: string) => {
    setSelectedId(id);
    openGiftModal.onTrue();
  };

  return (
    <div>
      <LoyaltyMembersTable
        data={localData}
        meta={meta}
        global={global}
        usertype={usertype}
        loading={isLoading}
        handleGiftModal={handleGiftModal}
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

      {openGiftModal.value && (
        <GiftPointsModal open={openGiftModal.value} onClose={openGiftModal.onFalse} companyOrganizer={companyId || ''} userId={selectedId || ''} />
      )}
    </div>
  );
};

export default LoyaltyMembersView;
