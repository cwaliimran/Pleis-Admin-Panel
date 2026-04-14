'use client';

import { useCompanySelection } from '@/app/common/header/company-selection-storage';
import { useCompanySelectionState } from '@/hooks/useCompanySelectionState';
import { useGetTransactionsQuery } from '@/store/Reducer/loyalty-transactions-api';
import { formatDate } from '@/utils/format-time';
import { useEffect, useState } from 'react';
import ReservationTransactionTable from './reservation-transaction-table';

const ReservationTransactionView = ({ userType }: { userType: 'super-admin' | 'organizer' }) => {
  // Pagination and filter state
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState<string>('');
  const [paymentStatus, setPaymentStatus] = useState<string>('');
  const [paymentMethod, setPaymentMethod] = useState<string>('');
  const [minimalSpendRes, setMinimalSpendRes] = useState<string>('');
  const [transactionStartDate, setTransactionStartDate] = useState<Date | undefined>(undefined);
  const [transactionEndDate, setTransactionEndDate] = useState<Date | undefined>(undefined);
  const [reservationStartDate, setReservationStartDate] = useState<Date | undefined>(undefined);
  const [reservationEndDate, setReservationEndDate] = useState<Date | undefined>(undefined);
  const [reservationDate, setReservationDate] = useState<Date | undefined>(undefined);
  const [timeStart, setTimeStart] = useState('');
  const [timeEnd, setTimeEnd] = useState('');
  const [reservationTimeline, setReservationTimeline] = useState<string>('');
  const [prepayOnly, setPrepayOnly] = useState(false);
  const [ticketRequiredOnly, setTicketRequiredOnly] = useState(false);
  const [cancelledOnly, setCancelledOnly] = useState(false);
  const [noShowOnly, setNoShowOnly] = useState(false);
  const [date, setDate] = useState<Date | undefined>(undefined);

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
    status: paymentStatus === 'all' ? '' : paymentStatus,
    paymentMethod: paymentMethod === 'all' ? '' : paymentMethod,
    resStartDate: reservationStartDate ? formatDate(reservationStartDate) : undefined,
    resEndDate: reservationEndDate ? formatDate(reservationEndDate) : undefined,
    resDate: reservationDate ? formatDate(reservationDate) : undefined,
    resStartTime: timeStart || undefined,
    resEndTime: timeEnd || undefined,
    futureRes: reservationTimeline === 'future' ? true : undefined,
    pastRes: reservationTimeline === 'past' ? true : undefined,
    paidRes: paymentStatus === 'paid' ? true : undefined,
    minimalSpendRes: minimalSpendRes || undefined,
    prePay: prepayOnly || undefined,
    ticketRequiredRes: ticketRequiredOnly || undefined,
    cancelledRes: cancelledOnly || undefined,
    noShowRes: noShowOnly || undefined,
    // date: transactionStartDate ? formatDate(transactionStartDate) : date ? formatDate(date) : undefined,
    // date: transactionStartDate ? formatDate(transactionStartDate) : date ? formatDate(date) : undefined,
    date: date ? formatDate(date) : undefined,
    startDate: transactionStartDate ? formatDate(transactionStartDate) : undefined,
    endDate: transactionEndDate ? formatDate(transactionEndDate) : undefined,
    companyOrganizer: selectedCompany || undefined,
    organization: userType === 'organizer' ? organizerOrganizationIds : undefined,
    // domainType: 'userreservations',
    orderType: 'userreservations',
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
      <ReservationTransactionTable
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
        minimalSpendRes={minimalSpendRes}
        onMinimalSpendResChange={(val) => {
          setMinimalSpendRes(val);
          setPage(1);
        }}
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
        transactionStartDate={transactionStartDate}
        transactionEndDate={transactionEndDate}
        onTransactionDateRangeChange={(start, end) => {
          console.log({ start, end });
          setTransactionStartDate(start);
          setTransactionEndDate(end);
          setPage(1);
        }}
        reservationStartDate={reservationStartDate}
        reservationEndDate={reservationEndDate}
        onReservationDateRangeChange={(start, end) => {
          setReservationStartDate(start);
          setReservationEndDate(end);
          setPage(1);
        }}
        reservationDate={reservationDate}
        onReservationDateChange={(value) => {
          setReservationDate(value);
          setPage(1);
        }}
        timeStart={timeStart}
        onTimeStartChange={(value) => {
          setTimeStart(value);
          setPage(1);
        }}
        timeEnd={timeEnd}
        onTimeEndChange={(value) => {
          setTimeEnd(value);
          setPage(1);
        }}
        reservationTimeline={reservationTimeline}
        onReservationTimelineChange={(value) => {
          setReservationTimeline(value);
          setPage(1);
        }}
        prepayOnly={prepayOnly}
        onPrepayOnlyChange={(value) => {
          setPrepayOnly(value);
          setPage(1);
        }}
        ticketRequiredOnly={ticketRequiredOnly}
        onTicketRequiredOnlyChange={(value) => {
          setTicketRequiredOnly(value);
          setPage(1);
        }}
        cancelledOnly={cancelledOnly}
        onCancelledOnlyChange={(value) => {
          setCancelledOnly(value);
          setPage(1);
        }}
        noShowOnly={noShowOnly}
        onNoShowOnlyChange={(value) => {
          setNoShowOnly(value);
          setPage(1);
        }}
        onResetFilters={() => {
          setStatus('');
          setPaymentStatus('');
          setPaymentMethod('');
          setMinimalSpendRes('');
          setTransactionStartDate(undefined);
          setTransactionEndDate(undefined);
          setReservationStartDate(undefined);
          setReservationEndDate(undefined);
          setReservationDate(undefined);
          setTimeStart('');
          setTimeEnd('');
          setReservationTimeline('');
          setPrepayOnly(false);
          setTicketRequiredOnly(false);
          setCancelledOnly(false);
          setNoShowOnly(false);
          setDate(undefined);
          setSearch('');
          setPage(1);
        }}
      />
    </div>
  );
};

export default ReservationTransactionView;
