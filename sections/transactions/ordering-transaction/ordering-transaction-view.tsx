'use client';

import { useGetLoyaltyTransactionsQuery } from '@/store/Reducer/loyalty-transactions-api';
import { formatDate } from '@/utils/format-time';
import { useEffect, useState } from 'react';
import { useCompanySelectionState } from '@/hooks/useCompanySelectionState';
import OrderingTransactionTable from './ordering-transaction-table';

interface LoyaltyTransactionViewProps {
  global?: boolean;
}

const OrderingTransactionView = ({ global }: LoyaltyTransactionViewProps) => {
  // Pagination and filter state
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState<string>('');
  // const [date, setDate] = useState<Date | undefined>(undefined);

  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);

  // const [selectedRecord, setSelectedRecord] = useState<any>(null);

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
    // date: date ? formatDate(date) : undefined,
    startDate: startDate ? formatDate(startDate) : undefined,
    endDate: endDate ? formatDate(endDate) : undefined,
    companyOrganizer: selectedCompany || undefined,
    isGlobal: global || false,
    // walletType: 'globalWallet',
    domainType: 'menuorders',
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
      setLocalData(apiData?.data);
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

  // const handleEdit = (data: string) => {
  //   setSelectedRecord(data);
  //   openModal.onTrue();
  // };

  return (
    <div>
      <OrderingTransactionTable
        data={localData}
        meta={meta}
        loading={isLoading || isFetching}
        // handleEdit={handleEdit}
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
        // date={date}
        startDate={startDate}
        endDate={endDate}
        onDateChange={(newStartDate, newEndDate) => {
          setStartDate(newStartDate);
          setEndDate(newEndDate);
          setPage(1);
        }}
        // onDateChange={(val) => {
        //   setDate(val);
        //   setPage(1);
        // }}
        onResetFilters={() => {
          setStatus('');
          // setDate(undefined);
          setStartDate(undefined);
          setEndDate(undefined);
          setSearch('');
          setPage(1);
        }}
      />
    </div>
  );
};

export default OrderingTransactionView;
