'use client';

import { useCompanySelectionState } from '@/hooks/useCompanySelectionState';
import { useGetLoyaltyTransactionsQuery } from '@/store/Reducer/loyalty-transactions-api';
import { formatDate } from '@/utils/format-time';
import { useEffect, useState } from 'react';
import GlobalLoyaltyTransactionTable from './global-loyalty-transaction-table';

interface GlobalLoyaltyTransactionDashboardWidgetProps {
  global?: boolean;
}

const GlobalLoyaltyTransactionDashboardWidget = ({ global = false }: GlobalLoyaltyTransactionDashboardWidgetProps) => {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState<string>('');
  const [date, setDate] = useState<Date | undefined>(undefined);

  const { companyId: selectedCompany } = useCompanySelectionState();

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
    isGlobal: global,
    walletType: 'globalWallet',
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

  return (
    <GlobalLoyaltyTransactionTable
      data={localData}
      meta={meta}
      loading={isLoading || isFetching}
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
  );
};

export default GlobalLoyaltyTransactionDashboardWidget;
