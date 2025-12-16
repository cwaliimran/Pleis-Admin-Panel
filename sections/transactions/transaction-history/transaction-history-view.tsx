'use client';

import { useBoolean } from '@/hooks/useBoolean';
import { useCompanySelectionState } from '@/hooks/useCompanySelectionState';
import { useGetLoyaltyTransactionsQuery } from '@/store/Reducer/loyalty-transactions-api';
import { formatDate } from '@/utils/format-time';
import { useEffect, useState } from 'react';
import TransactionModal from './transactions-modal';
import TransactionHistoryTable from './transaction-history-table';

interface LoyaltyTransactionViewProps {
  global?: boolean;
}

const TransactionHistoryView = ({ global }: LoyaltyTransactionViewProps) => {
  const openModal = useBoolean();

  // Pagination and filter state (unchanged pattern)
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState<string>('');

  // 🔹 Added start / end date (instead of single date)
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);

  const [selectedRecord, setSelectedRecord] = useState<any>(null);
  const { companyId: selectedCompany } = useCompanySelectionState();

  const {
    data: apiData,
    isLoading,
    isFetching,
  } = useGetLoyaltyTransactionsQuery({
    page: page - 1,
    search,
    limit,
    type: status === 'all' ? '' : status,
    startDate: startDate ? formatDate(startDate) : undefined,
    endDate: endDate ? formatDate(endDate) : undefined,
    companyOrganizer: selectedCompany || undefined,
    isGlobal: global || false,
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
    <div>
      <TransactionHistoryTable
        data={localData}
        meta={meta}
        loading={isLoading || isFetching}
        handleEdit={handleEdit}
        page={page}
        limit={limit}
        search={search}
        status={status}
        startDate={startDate}
        endDate={endDate}
        onPageChange={setPage}
        onLimitChange={(l) => {
          setLimit(l);
          setPage(1);
        }}
        onSearch={(val) => {
          setSearch(val);
          setPage(1);
        }}
        onStatusChange={(val) => {
          setStatus(val);
          setPage(1);
        }}
        onDateChange={(newStartDate, newEndDate) => {
          setStartDate(newStartDate);
          setEndDate(newEndDate);
          setPage(1);
        }}
        onResetFilters={() => {
          setStatus('');
          setSearch('');
          setStartDate(undefined);
          setEndDate(undefined);
          setPage(1);
        }}
      />

      <TransactionModal open={openModal.value} onClose={openModal.onFalse} selectedData={selectedRecord} />
    </div>
  );
};

export default TransactionHistoryView;

// 'use client';

// import { useBoolean } from '@/hooks/useBoolean';
// import { useCompanySelectionState } from '@/hooks/useCompanySelectionState';
// import { useGetLoyaltyTransactionsQuery } from '@/store/Reducer/loyalty-transactions-api';
// import { formatDate } from '@/utils/format-time';
// import { useEffect, useState } from 'react';
// import TransactionModal from './transactions-modal';
// import TransactionHistoryTable from './transaction-history-table';

// interface LoyaltyTransactionViewProps {
//   global?: boolean;
// }

// const TransactionHistoryView = ({ global }: LoyaltyTransactionViewProps) => {
//   const openModal = useBoolean();

//   // Pagination and filter state
//   const [page, setPage] = useState(1);
//   const [limit, setLimit] = useState(10);
//   const [search, setSearch] = useState('');
//   const [status, setStatus] = useState<string>('');
//   const [date, setDate] = useState<Date | undefined>(undefined);

//   const [selectedRecord, setSelectedRecord] = useState<any>(null);

//   const { companyId: selectedCompany } = useCompanySelectionState();

//   const {
//     data: apiData,
//     isLoading,
//     isFetching,
//   } = useGetLoyaltyTransactionsQuery({
//     page: page - 1,
//     search,
//     limit,
//     status: status === 'all' ? '' : status,
//     date: date ? formatDate(date) : undefined,
//     companyOrganizer: selectedCompany || undefined,
//     isGlobal: global || false,
//     // walletType: 'companyLoyalty',
//   });

//   const [localData, setLocalData] = useState<any[]>([]);

//   const [meta, setMeta] = useState<any>({
//     currentPage: page,
//     totalPages: 1,
//     totalRecords: 0,
//     limit,
//   });

//   useEffect(() => {
//     if (apiData?.data) {
//       setLocalData(apiData?.data);
//       setMeta(
//         apiData.meta || {
//           currentPage: page,
//           totalPages: 1,
//           totalRecords: 0,
//           limit,
//         }
//       );
//     }
//   }, [apiData, page, limit]);

//   const handleEdit = (data: string) => {
//     setSelectedRecord(data);
//     openModal.onTrue();
//   };

//   return (
//     <div>
//       <TransactionHistoryTable
//         data={localData}
//         meta={meta}
//         loading={isLoading || isFetching}
//         handleEdit={handleEdit}
//         onPageChange={setPage}
//         onLimitChange={(l) => {
//           setLimit(l);
//           setPage(1);
//         }}
//         onSearch={(val) => {
//           setSearch(val);
//           setPage(1);
//         }}
//         search={search}
//         limit={limit}
//         page={page}
//         status={status}
//         onStatusChange={(val) => {
//           setStatus(val);
//           setPage(1);
//         }}
//         // date={date}
//         // onDateChange={(val) => {
//         //   setDate(val);
//         //   setPage(1);
//         // }}
//         startDate={filters.startDate}
//         endDate={filters.endDate}
//         onDateChange={onDateChange}
//         onResetFilters={() => {
//           setStatus('');
//           setDate(undefined);
//           setSearch('');
//           setPage(1);
//         }}
//       />

//       <TransactionModal open={openModal.value} onClose={openModal.onFalse} selectedData={selectedRecord} />
//     </div>
//   );
// };

// export default TransactionHistoryView;
