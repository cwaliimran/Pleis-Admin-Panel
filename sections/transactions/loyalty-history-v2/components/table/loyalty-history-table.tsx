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
import { countActiveFilters, FilterValues, LoyaltyFiltersPanel } from '../../advanced-filters';
import { FILTER_COUNT_BADGE } from '../../config/theme';
import { LoyaltyEntry } from '../../types/types';
import { PresetId } from '../filters/filters';
import LoyaltyHistoryFilters from '../filters/loyalty-history-filters';
import LoyaltyHistoryPagination from '../pagination/loyalty-history-pagination';
import LoyaltyHistoryTableRow from './loyalty-history-table-row';

const HEAD_LABEL = [
  { id: 'scope', label: 'Scope', align: 'left' },
  { id: 'user', label: 'User', align: 'left', sortable: true, sortKey: 'userName' },
  { id: 'transactionId', label: 'Transaction ID', align: 'left' },
  { id: 'entry', label: 'Entry', align: 'left' },
  { id: 'source', label: 'Source', align: 'left' },
  { id: 'points', label: 'Points', align: 'left', sortable: true, sortKey: 'points' },
  { id: 'balanceAfter', label: 'Balance after', align: 'left' },
  { id: 'reward', label: 'Reward', align: 'left' },
  { id: 'timestamp', label: 'Timestamp', align: 'left', sortable: true, sortKey: 'timestamp' },
  { id: 'actions', label: '', align: 'center' },
];

interface LoyaltyHistoryTableProps {
  data: LoyaltyEntry[];
  loading?: boolean;
  currentPage: number;
  totalPages: number;
  shownCount: number;
  totalRecords: number;
  onPageChange: (page: number) => void;
  onView: (item: LoyaltyEntry) => void;
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

const LoyaltyHistoryTable: FC<LoyaltyHistoryTableProps> = ({
  data,
  loading,
  currentPage,
  totalPages,
  shownCount,
  totalRecords,
  onPageChange,
  onView,
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
        <h3 className="ml-2 text-xl font-semibold md:ml-0">Loyalty Transaction List</h3>

        <Badge
          onClick={advancedFiltersPanel.onTrue}
          className="text-md flex cursor-pointer items-center gap-2 rounded-3xl border border-gray-300 bg-white px-4 py-2 text-black hover:bg-gray-50 dark:border-gray-600 dark:bg-white dark:hover:bg-gray-100"
        >
          <SlidersHorizontal className="h-4 w-4" />
          <span className="whitespace-nowrap">Filter</span>
          {activeAdvancedFilterCount > 0 && <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${FILTER_COUNT_BADGE}`}>{activeAdvancedFilterCount}</span>}
        </Badge>
      </div>

      <LoyaltyHistoryFilters
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

      <LoyaltyFiltersPanel
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
              <LoyaltyHistoryTableRow key={item.id} item={item} onView={onView} />
            ))}
          </TableBodyWrapper>
        </Table>
      </div>

      <LoyaltyHistoryPagination currentPage={currentPage} totalPages={totalPages} shownCount={shownCount} totalRecords={totalRecords} onPageChange={onPageChange} />
    </Card>
  );
};

export default LoyaltyHistoryTable;
