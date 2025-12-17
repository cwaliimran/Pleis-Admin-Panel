'use client';

import { useBoolean } from '@/hooks/useBoolean';
import { useCompanySelectionState } from '@/hooks/useCompanySelectionState';
import { useGetLoyaltyTransactionsQuery } from '@/store/Reducer/loyalty-transactions-api';
import { fDate, formatDate, formatStr } from '@/utils/format-time';
import { useEffect, useState } from 'react';
import TransactionHistoryTable from './transaction-history-table';
import TransactionModal from './transactions-modal';
import { transactionHistoryData } from '@/sections/loyalty/data';
import InvoiceCard from '@/sections/invoices/notificationCard';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { ChevronDownIcon, Download } from 'lucide-react';

interface LoyaltyTransactionViewProps {
  global?: boolean;
}

const TransactionHistoryView = ({ global }: LoyaltyTransactionViewProps) => {
  const openModal = useBoolean();

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState<string>('');

  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  const [startDatePickerOpen, setStartDatePickerOpen] = useState(false);
  const [endDatePickerOpen, setEndDatePickerOpen] = useState(false);

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
      {/* --------------- LOYALTY TOP STATS ---------------*/}
      <div className="mt-5 grid grid-cols-1 gap-2 md:grid-cols-3 md:gap-x-4 md:gap-y-4 lg:grid-cols-4">
        {transactionHistoryData?.map((card: any, index) => (
          <InvoiceCard key={index} item={card} />
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
                  {startDate ? fDate(startDate, formatStr.paramCase.date) : 'Select start date'}
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
                  {endDate ? fDate(endDate, formatStr.paramCase.date) : 'Select end date'}
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
        <Button variant="default" className="bg-primary flex items-center gap-2 text-white">
          <Download className="h-4 w-4" />
          Export to CSV
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
