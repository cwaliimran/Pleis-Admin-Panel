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
import { countActiveFilters, FilterValues, OrderFiltersPanel } from '../../advanced-filters';
import { FILTER_COUNT_BADGE } from '../../config/theme';
import { Order } from '../../types/types';
import { PresetId } from '../filters/filters';
import OrderingHistoryFilters from '../filters/ordering-history-filters';
import OrderingHistoryPagination from '../pagination/ordering-history-pagination';
import OrderingHistoryTableRow from './ordering-history-table-row';

const HEAD_LABEL = [
  { id: 'order', label: 'Order', align: 'left', sortable: true, sortKey: 'orderReference' },
  { id: 'venue', label: 'Venue / Location', align: 'left', sortable: true, sortKey: 'organization' },
  { id: 'round', label: 'Round', align: 'left' },
  { id: 'items', label: 'Items', align: 'left' },
  { id: 'payment', label: 'Payment', align: 'left' },
  { id: 'total', label: 'Total', align: 'left' },
  { id: 'status', label: 'Status', align: 'left' },
  { id: 'handled', label: 'Handled', align: 'left' },
  { id: 'settlement', label: 'Settlement', align: 'left' },
  { id: 'createdAt', label: 'Created', align: 'left', sortable: true, sortKey: 'createdAt' },
  { id: 'actions', label: '', align: 'center' },
];

interface OrderingHistoryTableProps {
  data: Order[];
  loading?: boolean;
  currentPage: number;
  totalPages: number;
  totalRecords: number;
  shownCount: number;
  onPageChange: (page: number) => void;
  onView: (item: Order) => void;
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

const OrderingHistoryTable: FC<OrderingHistoryTableProps> = ({
  data,
  loading,
  currentPage,
  totalPages,
  totalRecords,
  shownCount,
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
        <h3 className="ml-2 text-xl font-semibold md:ml-0">Order List</h3>

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

      <OrderingHistoryFilters
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

      <OrderFiltersPanel
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
              <OrderingHistoryTableRow key={item.id} item={item} onView={onView} />
            ))}
          </TableBodyWrapper>
        </Table>
      </div>

      <OrderingHistoryPagination
        currentPage={currentPage}
        totalPages={totalPages}
        totalRecords={totalRecords}
        shownCount={shownCount}
        onPageChange={onPageChange}
      />
    </Card>
  );
};

export default OrderingHistoryTable;
