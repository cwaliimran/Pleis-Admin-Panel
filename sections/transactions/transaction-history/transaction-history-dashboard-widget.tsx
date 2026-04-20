'use client';

import { useBoolean } from '@/hooks/useBoolean';
import { useGetTransactionsQuery } from '@/store/Reducer/loyalty-transactions-api';
import { useEffect, useState } from 'react';
import { TransactionDetailModal } from './modal';
import TransactionHistoryTable from './transaction-history-table';
import { useAuth } from '@/hooks/useAuth';
import { formatDate } from '@/utils/format-time';

const TransactionHistoryDashboardWidget = ({ userType }: { userType: string }) => {
  const openModal = useBoolean();
  const { user } = useAuth();

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState('');
  const [type, setType] = useState<string>('');
  const [status, setStatus] = useState<string>('');
  const [paymentStatus, setPaymentStatus] = useState<string>('');
  const [paymentMethod, setPaymentMethod] = useState<string>('');
  const [minAmount, setMinAmount] = useState<string>('');
  const [maxAmount, setMaxAmount] = useState<string>('');
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  const [userTier, setUserTier] = useState<string>('');

  const [selectedTransactionId, setSelectedTransactionId] = useState<string | null>(null);

  const {
    data: apiData,
    isLoading,
    isFetching,
  } = useGetTransactionsQuery({
    page: page - 1,
    search,
    limit,
    startDate: startDate ? formatDate(startDate) : undefined,
    endDate: endDate ? formatDate(endDate) : undefined,
    type: status === 'all' ? '' : status,
    tier: !userTier || userTier.toLowerCase() === 'all' ? '' : userTier,
    orderType: type === 'all' ? '' : type,
    status: paymentStatus === 'all' ? '' : paymentStatus,
    paymentMethod: paymentMethod === 'all' ? '' : paymentMethod,
    startAmount: minAmount || undefined,
    endAmount: maxAmount || undefined,
    companyOrganizer: userType === 'organizer' ? user?.basicInfo?._id : '',
    isAdmin: true,
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

  const handleEdit = (data: any) => {
    setSelectedTransactionId(data?._id || null);
    openModal.onTrue();
  };

  const handleCloseModal = () => {
    openModal.onFalse();
    setSelectedTransactionId(null);
  };

  return (
    <>
      <TransactionHistoryTable
        data={localData}
        meta={meta}
        loading={isLoading || isFetching}
        handleEdit={handleEdit}
        page={page}
        limit={limit}
        search={search}
        status={status}
        paymentStatus={paymentStatus}
        paymentMethod={paymentMethod}
        type={type}
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
        startDate={startDate}
        endDate={endDate}
        onDateChange={(newStartDate?: Date, newEndDate?: Date) => {
          setStartDate(newStartDate);
          setEndDate(newEndDate);
          setPage(1);
        }}

        onPaymentMethodChange={(val) => {
          setPaymentMethod(val);
          setPage(1);
        }}
        onPaymentStatusChange={(val) => {
          setPaymentStatus(val);
          setPage(1);
        }}
        minAmount={minAmount}
        onMinAmountChange={(val) => {
          setMinAmount(val);
          setPage(1);
        }}
        maxAmount={maxAmount}
        onMaxAmountChange={(val) => {
          setMaxAmount(val);
          setPage(1);
        }}
        onTypeChange={(val) => {
          setType(val);
          setPage(1);
        }}
        userTier={userTier}
        onUserTierChange={(val) => {
          setUserTier(val);
          setPage(1);
        }}
        onResetFilters={() => {
          setStatus('');
          setType('');
          setSearch('');
          setPaymentMethod('');
          setPaymentStatus('');
          setMinAmount('');
          setMaxAmount('');
          setPage(1);
          setStartDate(undefined);
          setEndDate(undefined);
          setUserTier('');
        }}
      />

      <TransactionDetailModal open={openModal.value} onClose={handleCloseModal} transactionId={selectedTransactionId} isAdmin={true} />
    </>
  );
};

export default TransactionHistoryDashboardWidget;
