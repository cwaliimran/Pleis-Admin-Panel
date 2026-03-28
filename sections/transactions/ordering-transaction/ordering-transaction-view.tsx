'use client';

import { useCompanySelection } from '@/app/common/header/company-selection-storage';
import { useCompanySelectionState } from '@/hooks/useCompanySelectionState';
import { useGetTransactionsQuery } from '@/store/Reducer/loyalty-transactions-api';
import { formatDate } from '@/utils/format-time';
import { useEffect, useState } from 'react';
import OrderingTransactionTable from './ordering-transaction-table';

interface LoyaltyTransactionViewProps {
  userType?: string;
}

const OrderingTransactionView = ({ userType }: LoyaltyTransactionViewProps) => {
  // Pagination and filter state
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState<string>('');
  const [paymentStatus, setPaymentStatus] = useState<string>('');
  const [paymentMethod, setPaymentMethod] = useState<string>('');
  const [minAmount, setMinAmount] = useState<string>('');
  const [maxAmount, setMaxAmount] = useState<string>('');
  // const [date, setDate] = useState<Date | undefined>(undefined);

  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);

  const { companyId: selectedCompany } = useCompanySelectionState();

  const { organizerOrganizationIds } = useCompanySelection();

  const {
    data: apiData,
    isLoading,
    isFetching,
  } = useGetTransactionsQuery({
    page: page - 1,
    search,
    limit,
    status: (paymentStatus === 'all' ? '' : paymentStatus) || (status === 'all' ? '' : status),
    paymentMethod: paymentMethod === 'all' ? '' : paymentMethod,
    startAmount: minAmount || undefined,
    endAmount: maxAmount || undefined,
    // date: date ? formatDate(date) : undefined,
    startDate: startDate ? formatDate(startDate) : undefined,
    endDate: endDate ? formatDate(endDate) : undefined,
    companyOrganizer: selectedCompany || undefined,
    organization: userType === 'organizer' ? organizerOrganizationIds : undefined,
    // isGlobal: global || false,
    // walletType: 'globalWallet',
    // domainType: 'menuorders',
    orderType: 'menuorders',
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
        paymentStatus={paymentStatus}
        onPaymentStatusChange={(val) => {
          setPaymentStatus(val);
          setPage(1);
        }}
        paymentMethod={paymentMethod}
        onPaymentMethodChange={(val) => {
          setPaymentMethod(val);
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
          setPaymentStatus('');
          setPaymentMethod('');
          setMinAmount('');
          setMaxAmount('');
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
