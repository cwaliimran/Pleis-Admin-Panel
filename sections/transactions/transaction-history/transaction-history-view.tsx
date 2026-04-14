'use client';

import { useCompanySelection } from '@/app/common/header/company-selection-storage';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useAuth } from '@/hooks/useAuth';
import { useBoolean } from '@/hooks/useBoolean';
import { useCompanySelectionState } from '@/hooks/useCompanySelectionState';
import { useGetOrderTransactionsAnalyticsQuery, useGetTransactionsQuery } from '@/store/Reducer/loyalty-transactions-api';
import { fDate, formatDate, formatStr } from '@/utils/format-time';
import { ChevronDownIcon, Download, Loader2 } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { TransactionDetailModal } from './modal';
import TransactionHistoryTable from './transaction-history-table';
import TransactionStatsSkeleton from './transaction-stats-skeleton';
import { useExportTransactions } from './use-export-transactions';
import TransactionCard from '@/sections/invoices/transaction-card';

interface LoyaltyTransactionViewProps {
  userType: 'super-admin' | 'organizer';
}

const TransactionHistoryView = ({ userType }: LoyaltyTransactionViewProps) => {
  const openModal = useBoolean();

  const { user } = useAuth();

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState('');
  const [type, setType] = useState<string>('');
  const [status, setStatus] = useState<string>('');
  const [paymentStatus, setPaymentStatus] = useState<string>('');
  const [paymentMethod, setPaymentMethod] = useState<string>('');
  const [userTier, setUserTier] = useState<string>('');
  const [minAmount, setMinAmount] = useState<string>('');
  const [maxAmount, setMaxAmount] = useState<string>('');

  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  const [startDatePickerOpen, setStartDatePickerOpen] = useState(false);
  const [endDatePickerOpen, setEndDatePickerOpen] = useState(false);

  const [selectedTransactionId, setSelectedTransactionId] = useState<string | null>(null);
  const { companyId: selectedCompany, organizationId } = useCompanySelectionState();

  const { organizerOrganizationIds } = useCompanySelection();

  const selectedOrganizations = useMemo(() => {
    if (organizationId) return organizationId;
    if (organizerOrganizationIds?.length) return organizerOrganizationIds.join(',');
    return undefined;
  }, [organizationId, organizerOrganizationIds]);

  const companyOrganizerForAnalytics = userType === 'organizer' ? user?.basicInfo?._id : selectedCompany || undefined;
  const hasValidAnalyticsSelection = Boolean(companyOrganizerForAnalytics || selectedOrganizations);
  const shouldFetchAnalytics = userType === 'super-admin' || hasValidAnalyticsSelection;

  const { isExporting, handleExportCSV } = useExportTransactions({
    startDate,
    endDate,
    companyOrganizer: selectedCompany || undefined,
    organizerOrganizationIds,
    userType,
  });

  const {
    data: analyticsData,
    isLoading: isAnalyticsLoading,
    isFetching: isAnalyticsFetching,
    error: analyticsError,
  } = useGetOrderTransactionsAnalyticsQuery(
    {
      companyOrganizer: companyOrganizerForAnalytics,
      organizations: userType === "organizer" && selectedOrganizations as any ,
    },
    {
      skip: !shouldFetchAnalytics,
    }
  );

  const {
    data: apiData,
    isLoading,
    isFetching,
  } = useGetTransactionsQuery(
    {
      page: page - 1,
      search,
      limit,
      type: status === 'all' ? '' : status,
      startDate: startDate ? formatDate(startDate) : undefined,
      endDate: endDate ? formatDate(endDate) : undefined,
      orderType: type === 'all' ? '' : type,
      status: paymentStatus === 'all' ? '' : paymentStatus,
      paymentMethod: paymentMethod === 'all' ? '' : paymentMethod,
      tier: !userTier || userTier.toLowerCase() === 'all' ? '' : userTier,
      startAmount: minAmount || undefined,
      endAmount: maxAmount || undefined,
      companyOrganizer: userType === 'organizer' ? user?.basicInfo?._id : selectedCompany || undefined,
      // Keep existing list behavior: organizer list sends selected organizer org IDs array.
      organization: userType === 'organizer' ? organizerOrganizationIds : undefined,
      isAdmin: userType === 'super-admin',
    },
    {
      // Ensure analytics API is requested and resolved before table API starts.
      skip: !shouldFetchAnalytics || isAnalyticsLoading || isAnalyticsFetching,
    }
  );

  useEffect(() => {
    if (analyticsData) {
    }
  }, [analyticsData]);

  const analyticsStats = analyticsData?.data || [];
  const analyticsStatsByKey = useMemo(() => {
    const statsMap = new Map<string, any>();
    analyticsStats.forEach((item: any) => {
      if (item?.key) {
        statsMap.set(item.key, item);
      }
    });
    return statsMap;
  }, [analyticsStats]);

  useEffect(() => {
    setPage(1);
    setLocalData([]);
    setMeta({
      currentPage: 1,
      totalPages: 1,
      totalRecords: 0,
      limit,
    });
  }, [selectedCompany, organizationId]);

  const analyticsCardConfig = useMemo(() => {
    if (userType === 'organizer') {
      return [
        { key: 'totalTransactions', title: 'Total Transactions', isCurrency: false },
        { key: 'totalAmount', title: 'Total Amount', isCurrency: true },
        { key: 'organizerPayout', title: 'Organizer Payouts', isCurrency: true },
        { key: 'serviceFee', title: 'Service Fees', isCurrency: true },
      ];
    }

    return [
      { key: 'totalTransactions', title: 'Total Transactions', isCurrency: false },
      { key: 'totalAmount', title: 'Total Amount', isCurrency: true },
      { key: 'organizerPayout', title: 'Organizer Payouts', isCurrency: true },
      { key: 'totalCommission', title: 'Pleis Commision', isCurrency: true },
    ];
  }, [userType]);

  const analyticsCards = useMemo(
    () =>
      analyticsCardConfig.map((config) => ({
        title: config.title,
        amount: Number(analyticsStatsByKey.get(config.key)?.value ?? 0),
        raise: `${Number(analyticsStatsByKey.get(config.key)?.growth ?? 0)}%`,
        isCurrency: config.isCurrency,
      })),
    [analyticsStatsByKey, analyticsCardConfig]
  );

  const [localData, setLocalData] = useState<any[]>([]);
  const [meta, setMeta] = useState<any>({
    currentPage: page,
    totalPages: 1,
    totalRecords: 0,
    limit,
  });

  const getTransactionUniqueKey = (item: any): string | undefined => {
    if (item?._id) return `id:${item._id}`;
    if (item?.transactionId) return `tx:${item.transactionId}`;
    if (item?.orderData?.orderNumber) return `order:${item.orderData.orderNumber}`;
    if (item?.orderNumber) return `order:${item.orderNumber}`;
    return undefined;
  };

  useEffect(() => {
    const rawData = Array.isArray(apiData?.data) ? apiData.data : [];
    const seen = new Set<string>();

    const dedupedData = rawData.filter((item, index) => {
      const key = getTransactionUniqueKey(item);
      // Keep items without a stable identifier as-is to avoid accidental data loss.
      if (!key) return true;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });

    setLocalData(dedupedData);
    setMeta(
      apiData?.meta || {
        currentPage: page,
        totalPages: 1,
        totalRecords: 0,
        limit,
      }
    );
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
    <div>
      {/* --------------- LOYALTY TOP STATS ---------------*/}
      <div className="mt-5 grid grid-cols-1 gap-2 md:grid-cols-3 md:gap-x-4 md:gap-y-4 lg:grid-cols-4">
        {shouldFetchAnalytics && (isAnalyticsLoading || isAnalyticsFetching)
          ? <TransactionStatsSkeleton count={analyticsCardConfig.length || 4} />
          : analyticsCards?.map((card: any, index) => <TransactionCard key={index} item={card} />)}
      </div>

      {shouldFetchAnalytics && analyticsError && (
        <p className="mt-3 text-sm text-red-500">
          Error: {(analyticsError as any)?.data?.message || (analyticsError as any)?.error || 'Failed to fetch analytics'}
        </p>
      )}

      {/* --------------- DATE FILTERS & EXPORT ---------------*/}
      <div className="mt-5 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          {/* Start Date */}
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Start Date</label>
            <Popover open={startDatePickerOpen} onOpenChange={setStartDatePickerOpen}>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-44 justify-between font-normal">
                  {startDate ? fDate(startDate, formatStr.split.date) : 'Select start date'}
                  <ChevronDownIcon className="h-4 w-4" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto overflow-hidden p-0" align="start">
                <Calendar
                  mode="single"
                  selected={startDate}
                  captionLayout="dropdown"
                  disabled={endDate ? { after: endDate } : undefined}
                  onSelect={(date) => {
                    setStartDate(date);
                    setStartDatePickerOpen(false);
                    setPage(1);
                  }}
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* End Date */}
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">End Date</label>
            <Popover open={endDatePickerOpen} onOpenChange={setEndDatePickerOpen}>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-44 justify-between font-normal">
                  {endDate ? fDate(endDate, formatStr.split.date) : 'Select end date'}
                  <ChevronDownIcon className="h-4 w-4" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto overflow-hidden p-0" align="start">
                <Calendar
                  mode="single"
                  selected={endDate}
                  captionLayout="dropdown"
                  disabled={startDate ? { before: startDate } : undefined}
                  onSelect={(date) => {
                    setEndDate(date);
                    setEndDatePickerOpen(false);
                    setPage(1);
                  }}
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>

        {/* Export Button */}
        <Button variant="default" className="bg-primary flex items-center gap-2 text-white" onClick={handleExportCSV} disabled={isExporting}>
          {isExporting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
          {isExporting ? 'Exporting...' : 'Export to CSV'}
        </Button>
      </div>

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
        type={type}
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

        onPaymentStatusChange={(val) => {
          setPaymentStatus(val);
          setPage(1);
        }}

        onStatusChange={(val) => {
          setStatus(val);
          setPage(1);
        }}
        onTypeChange={(val) => {
          setType(val);
          setPage(1);
        }}

        paymentMethod={paymentMethod}
        onPaymentMethodChange={(val) => {
          setPaymentMethod(val);
          setPage(1);
        }}
        userTier={userTier}
        onUserTierChange={(val) => {
          setUserTier(val);
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
        onDateChange={(newStartDate, newEndDate) => {
          setStartDate(newStartDate);
          setEndDate(newEndDate);
          setPage(1);
        }}
        onResetFilters={() => {
          setStatus('');
          setType('');
          setSearch('');
          setPaymentStatus('');
          setPaymentMethod('');
          setUserTier('');
          setMinAmount('');
          setMaxAmount('');
          setStartDate(undefined);
          setEndDate(undefined);
          setPage(1);
        }}
      />

      <TransactionDetailModal
        open={openModal.value}
        onClose={handleCloseModal}
        transactionId={selectedTransactionId}
        isAdmin={userType === 'super-admin'}
      />
    </div>
  );
};

export default TransactionHistoryView;
