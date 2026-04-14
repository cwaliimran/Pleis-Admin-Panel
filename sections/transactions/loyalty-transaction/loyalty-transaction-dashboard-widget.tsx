'use client';

import { useCompanySelection } from '@/app/common/header/company-selection-storage';
import { useBoolean } from '@/hooks/useBoolean';
import { useCompanySelectionState } from '@/hooks/useCompanySelectionState';
import { useGetLoyaltyTransactionsQuery } from '@/store/Reducer/loyalty-transactions-api';
import { formatDate } from '@/utils/format-time';
import { useEffect, useState } from 'react';
import LoyaltyTransactionTable from './loyalty-transaction-table';
import TransactionModal from './transactions-modal';

interface LoyaltyTransactionDashboardWidgetProps {
  global?: boolean;
  userType?: string;
}

const LoyaltyTransactionDashboardWidget = ({ global = false, userType }: LoyaltyTransactionDashboardWidgetProps) => {
  const openModal = useBoolean();

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState<string>('');
  const [date, setDate] = useState<Date | undefined>(undefined);

  const [selectedRecord, setSelectedRecord] = useState<any>(null);

  const { companyId: selectedCompany } = useCompanySelectionState();
  const { organizerOrganizationIds } = useCompanySelection();

  const {
    data: apiData,
    isLoading,
    isFetching,
  } = useGetLoyaltyTransactionsQuery({
    page: page - 1,
    search,
    limit,
    status: status === 'all' ? '' : status,
    date: date ? formatDate(date) : undefined,
    companyOrganizer: global ? undefined : selectedCompany || undefined,
    organization: userType === 'organizer' ? organizerOrganizationIds : undefined,
    isGlobal: global,
    walletType: 'companyLoyalty',
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

  const handleEdit = (data: string) => {
    setSelectedRecord(data);
    openModal.onTrue();
  };

  return (
    <>
      <LoyaltyTransactionTable
        data={localData}
        meta={meta}
        loading={isLoading || isFetching}
        handleEdit={handleEdit}
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

      <TransactionModal open={openModal.value} onClose={openModal.onFalse} selectedData={selectedRecord} />
    </>
  );
};

export default LoyaltyTransactionDashboardWidget;
