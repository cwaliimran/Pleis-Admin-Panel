'use client';

import { useCompanySelection } from '@/app/common/header/company-selection-storage';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useAuth } from '@/hooks/useAuth';
import { useBoolean } from '@/hooks/useBoolean';
import { useCompanySelectionState } from '@/hooks/useCompanySelectionState';
import { transactionHistoryData } from '@/sections/loyalty/data';
import { useGetTransactionsQuery } from '@/store/Reducer/loyalty-transactions-api';
import { fDate, formatDate, formatStr } from '@/utils/format-time';
import { ChevronDownIcon, Download, Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { TransactionDetailModal } from './modal';
import TransactionHistoryTable from './transaction-history-table';
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
  const [minAmount, setMinAmount] = useState<string>('');
  const [maxAmount, setMaxAmount] = useState<string>('');

  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  const [startDatePickerOpen, setStartDatePickerOpen] = useState(false);
  const [endDatePickerOpen, setEndDatePickerOpen] = useState(false);

  const [selectedTransactionId, setSelectedTransactionId] = useState<string | null>(null);
  const { companyId: selectedCompany } = useCompanySelectionState();

  const { organizerOrganizationIds } = useCompanySelection();

  const { isExporting, handleExportCSV } = useExportTransactions({
    startDate,
    endDate,
    companyOrganizer: selectedCompany || undefined,
    organizerOrganizationIds,
    userType,
  });
  
  const {
    data: apiData,
    isLoading,
    isFetching,
  } = useGetTransactionsQuery({
    page: page - 1,
    search,
    limit,
    type: status === 'all' ? '' : status,
    startDate: startDate ? formatDate(startDate) : undefined,
    endDate: endDate ? formatDate(endDate) : undefined,
    orderType: type === 'all' ? '' : type,
    status: paymentStatus === 'all' ? '' : paymentStatus,
    paymentMethod: paymentMethod === 'all' ? '' : paymentMethod,
    startAmount: minAmount || undefined,
    endAmount: maxAmount || undefined,
    // companyOrganizer: selectedCompany || undefined,
    companyOrganizer: userType === 'organizer' ? user?.basicInfo?._id : selectedCompany || undefined,
    organization: userType === 'organizer' ? organizerOrganizationIds : undefined,
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
    <div>
      {/* --------------- LOYALTY TOP STATS ---------------*/}
      <div className="mt-5 grid grid-cols-1 gap-2 md:grid-cols-3 md:gap-x-4 md:gap-y-4 lg:grid-cols-4">
        {transactionHistoryData?.map((card: any, index) => (
          <TransactionCard key={index} item={card} />
        ))}
      </div>

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
