'use client';

import { useCompanySelection } from '@/app/common/header/company-selection-storage';
import { useDebounce } from '@/hooks/useDebounce';
import { useCompanySelectionState } from '@/hooks/useCompanySelectionState';
import { useGetTransactionsQuery } from '@/store/Reducer/loyalty-transactions-api';
import { formatDate } from '@/utils/format-time';
import { useEffect, useState } from 'react';
import TicketingTransactionTable from './ticketing-transaction-table';

interface LoyaltyTransactionViewProps {
  global?: boolean;
  userType: 'super-admin' | 'organizer';
}

const TicketingTransactionView = ({ global, userType }: LoyaltyTransactionViewProps) => {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState<string>('');
  const [type, setType] = useState<string>('all');
  const [paymentStatus, setPaymentStatus] = useState<string>('');
  const [validationStatus, setValidationStatus] = useState<string>('');
  const [paymentMethod, setPaymentMethod] = useState<string>('');
  const [event, setEvent] = useState<string>('');
  const [transferredOrSentOnly, setTransferredOrSentOnly] = useState(false);
  const [refundedOnly, setRefundedOnly] = useState(false);
  const [minAmount, setMinAmount] = useState<string>('');
  const [maxAmount, setMaxAmount] = useState<string>('');
  const debouncedEvent = useDebounce(event, 300);

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
    type: type === 'all' ? undefined : type,
    status: paymentStatus === 'all' ? '' : paymentStatus,
    validationStatus: validationStatus === 'all' ? '' : validationStatus,
    paymentMethod: paymentMethod === 'all' ? '' : paymentMethod,
    event: debouncedEvent || undefined,
    transfered: transferredOrSentOnly || undefined,
    sent: transferredOrSentOnly || undefined,
    refunded: refundedOnly || undefined,
    startAmount: minAmount || undefined,
    endAmount: maxAmount || undefined,
    startDate: startDate ? formatDate(startDate) : undefined,
    endDate: endDate ? formatDate(endDate) : undefined,

    companyOrganizer: selectedCompany || undefined,
    organization: userType === 'organizer' ? organizerOrganizationIds : undefined,
    isGlobal: global || false,
    // domainType: 'ticketingorders',
   orderType: 'ticketingbookings',
    isAdmin: userType === 'super-admin',
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

  return (
    <div>
      <TicketingTransactionTable
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
        type={type}
        onTypeChange={(val) => {
          setType(val);
          setPage(1);
        }}
        paymentStatus={paymentStatus}
        onPaymentStatusChange={(val) => {
          setPaymentStatus(val);
          setPage(1);
        }}
        validationStatus={validationStatus}
        onValidationStatusChange={(val) => {
          setValidationStatus(val);
          setPage(1);
        }}
        paymentMethod={paymentMethod}
        onPaymentMethodChange={(val) => {
          setPaymentMethod(val);
          setPage(1);
        }}
        event={event}
        onEventChange={(val) => {
          setEvent(val);
          setPage(1);
        }}
        transferredOrSentOnly={transferredOrSentOnly}
        onTransferredOrSentOnlyChange={(value) => {
          setTransferredOrSentOnly(value);
          setPage(1);
        }}
        refundedOnly={refundedOnly}
        onRefundedOnlyChange={(value) => {
          setRefundedOnly(value);
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
        startDate={startDate}
        endDate={endDate}
        onDateChange={(newStartDate, newEndDate) => {
          setStartDate(newStartDate);
          setEndDate(newEndDate);
          setPage(1);
        }}
        onResetFilters={() => {
          setStatus('');
          setType('all');
          setPaymentStatus('');
          setValidationStatus('');
          setPaymentMethod('');
          setEvent('');
          setTransferredOrSentOnly(false);
          setRefundedOnly(false);
          setMinAmount('');
          setMaxAmount('');
          setStartDate(undefined);
          setEndDate(undefined);
          setSearch('');
          setPage(1);
        }}
      />
    </div>
  );
};

export default TicketingTransactionView;
