'use client';

import TableHeadCustom from '@/components/table/table-head-custom';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Table } from '@/components/ui/table';
import TableBodyWrapper from '@/components/ui/table-body-wrapper';
import { useBoolean } from '@/hooks/useBoolean';
import { useTableSort } from '@/hooks/useTableSort';
import { SlidersHorizontal } from 'lucide-react';
import { FC } from 'react';
import { countActiveFilters, FilterValues, TransactionFiltersPanel } from '../../advanced-filters';
import { FILTER_COUNT_BADGE } from '../../config/theme';
import { Transaction } from '../../types/types';
import TransactionHistoryFilters from '../filters/transaction-history-filters';
import { PresetId } from '../filters/filters';
import TransactionHistoryPagination from '../pagination/transaction-history-pagination';
import TransactionHistoryTableRow from './transaction-history-table-row';

const HEAD_LABEL = [
  { id: 'user', label: 'User', align: 'left', sortable: true, sortKey: 'user.name' },
  { id: 'organization', label: 'Organization', align: 'left', sortable: true, sortKey: 'organization' },
  { id: 'transactionId', label: 'Transaction ID', align: 'left' },
  { id: 'type', label: 'Type', align: 'left' },
  { id: 'amount', label: 'Amount', align: 'left' },
  { id: 'commission', label: 'Commission', align: 'left' },
  { id: 'organizerNet', label: 'Organizer net', align: 'left' },
  { id: 'pleisNet', label: 'Pleis net', align: 'left' },
  { id: 'payment', label: 'Payment', align: 'left' },
  { id: 'settlement', label: 'Settlement', align: 'left' },
  { id: 'fiscalization', label: 'Fiscalization', align: 'left' },
  { id: 'documents', label: 'Documents', align: 'left' },
  { id: 'capturedAt', label: 'Captured', align: 'left', sortable: true, sortKey: 'capturedAt' },
  { id: 'actions', label: '', align: 'center' },
];

interface TransactionHistoryTableProps {
  data: Transaction[];
  loading?: boolean;
  currentPage: number;
  totalPages: number;
  totalRecords: number;
  shownCount: number;
  onPageChange: (page: number) => void;
  onView: (item: Transaction) => void;
  onDownloadDocuments: (item: Transaction) => void;
  onExclude: (item: Transaction) => void;
  dateBasis: string;
  onDateBasisChange: (value: string) => void;
  period: string;
  onPeriodChange: (value: string) => void;
  customStartDate?: Date;
  customEndDate?: Date;
  onCustomDateChange: (start: Date | undefined, end: Date | undefined) => void;
  search: string;
  onSearchChange: (value: string) => void;
  activePreset: PresetId | null;
  onPresetChange: (preset: PresetId | null) => void;
  advancedFilters: FilterValues;
  onApplyAdvancedFilters: (values: FilterValues) => void;
  onClearAdvancedFilters: () => void;
}

const TransactionHistoryTable: FC<TransactionHistoryTableProps> = ({
  data,
  loading,
  currentPage,
  totalPages,
  totalRecords,
  shownCount,
  onPageChange,
  onView,
  onDownloadDocuments,
  onExclude,
  dateBasis,
  onDateBasisChange,
  period,
  onPeriodChange,
  customStartDate,
  customEndDate,
  onCustomDateChange,
  search,
  onSearchChange,
  activePreset,
  onPresetChange,
  advancedFilters,
  onApplyAdvancedFilters,
  onClearAdvancedFilters,
}) => {
  const { sortedData, sortConfig, handleSort } = useTableSort({ data });
  const advancedFiltersPanel = useBoolean(false);
  const activeAdvancedFilterCount = countActiveFilters(advancedFilters);

  return (
    <Card className="dark:bg-secondary mt-5 mb-5 px-2 shadow-md md:px-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <h3 className="ml-2 text-xl font-semibold md:ml-0">Transaction History List</h3>

        <Badge
          onClick={advancedFiltersPanel.onTrue}
          className="text-md flex cursor-pointer items-center gap-2 rounded-3xl border border-gray-300 bg-white px-4 py-2 text-black hover:bg-gray-50 dark:border-gray-600 dark:bg-white dark:hover:bg-gray-100"
        >
          <SlidersHorizontal className="h-4 w-4" />
          <span className="whitespace-nowrap">Filter</span>
          {activeAdvancedFilterCount > 0 && (
            <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${FILTER_COUNT_BADGE}`}>{activeAdvancedFilterCount}</span>
          )}
        </Badge>
      </div>

      <TransactionHistoryFilters
        dateBasis={dateBasis}
        onDateBasisChange={onDateBasisChange}
        period={period}
        onPeriodChange={onPeriodChange}
        customStartDate={customStartDate}
        customEndDate={customEndDate}
        onCustomDateChange={onCustomDateChange}
        search={search}
        onSearchChange={onSearchChange}
        activePreset={activePreset}
        onPresetChange={onPresetChange}
      />

      <TransactionFiltersPanel
        open={advancedFiltersPanel.value}
        onOpenChange={advancedFiltersPanel.setValue}
        values={advancedFilters}
        onApply={onApplyAdvancedFilters}
        onClear={onClearAdvancedFilters}
      />

      <div className="mt-4 min-h-[45vh] rounded-lg border">
        <Table className="w-full rounded-md border">
          <TableHeadCustom headLabel={HEAD_LABEL} onSort={handleSort} sortConfig={sortConfig} />

          <TableBodyWrapper loading={loading} colSpan={HEAD_LABEL.length} dataLength={sortedData?.length || 0}>
            {sortedData?.map((item) => (
              <TransactionHistoryTableRow key={item.id} item={item} onView={onView} onDownloadDocuments={onDownloadDocuments} onExclude={onExclude} />
            ))}
          </TableBodyWrapper>
        </Table>
      </div>

      <TransactionHistoryPagination
        currentPage={currentPage}
        totalPages={totalPages}
        totalRecords={totalRecords}
        shownCount={shownCount}
        onPageChange={onPageChange}
      />
    </Card>
  );
};

export default TransactionHistoryTable;
