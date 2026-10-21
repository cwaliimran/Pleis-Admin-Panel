'use client';

import TableHeadCustom from '@/components/table/table-head-custom';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Table } from '@/components/ui/table';
import TableBodyWrapper from '@/components/ui/table-body-wrapper';
import { ToggleSwitch } from '@/components/ui/toggle-switch';
import { useBoolean } from '@/hooks/useBoolean';
import { useTableSort } from '@/hooks/useTableSort';
import { SlidersHorizontal } from 'lucide-react';
import { FC } from 'react';
import { countActiveFilters, FilterValues, TicketFiltersPanel } from '../../advanced-filters';
import { FILTER_COUNT_BADGE } from '../../config/theme';
import { Ticket } from '../../types/types';
import { PresetId } from '../filters/filters';
import TicketingHistoryFilters from '../filters/ticketing-history-filters';
import TicketingHistoryPagination from '../pagination/ticketing-history-pagination';
import TicketingHistoryTableRow from './ticketing-history-table-row';

const HEAD_LABEL = [
  { id: 'ticket', label: 'Ticket', align: 'left', sortable: true, sortKey: 'ticketId' },
  { id: 'event', label: 'Event', align: 'left', sortable: true, sortKey: 'eventName' },
  { id: 'type', label: 'Type', align: 'left' },
  { id: 'action', label: 'Action', align: 'left' },
  { id: 'status', label: 'Status', align: 'left' },
  { id: 'owner', label: 'Owner', align: 'left' },
  { id: 'pricePaid', label: 'Price paid', align: 'left' },
  { id: 'scans', label: 'Scans', align: 'left' },
  { id: 'settlement', label: 'Settlement', align: 'left' },
  { id: 'createdAt', label: 'Created', align: 'left', sortable: true, sortKey: 'createdAt' },
  { id: 'actions', label: '', align: 'center' },
];

interface TicketingHistoryTableProps {
  data: Ticket[];
  loading?: boolean;
  currentPage: number;
  totalPages: number;
  shownCount: number;
  latestStateOnly: boolean;
  onLatestStateOnlyChange: (value: boolean) => void;
  onPageChange: (page: number) => void;
  onView: (item: Ticket) => void;
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

const TicketingHistoryTable: FC<TicketingHistoryTableProps> = ({
  data,
  loading,
  currentPage,
  totalPages,
  shownCount,
  latestStateOnly,
  onLatestStateOnlyChange,
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
        <h3 className="ml-2 text-xl font-semibold md:ml-0">Ticket List</h3>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <ToggleSwitch
              checked={latestStateOnly}
              onChange={onLatestStateOnlyChange}
              ariaLabel="Latest state only"
              className={latestStateOnly ? 'bg-blue-600' : ''}
            />
            <span className="text-sm font-medium">Latest state only</span>
          </div>

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
      </div>

      <TicketingHistoryFilters
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

      <TicketFiltersPanel
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
              <TicketingHistoryTableRow key={item.id} item={item} onView={onView} />
            ))}
          </TableBodyWrapper>
        </Table>
      </div>

      <TicketingHistoryPagination
        currentPage={currentPage}
        totalPages={totalPages}
        shownCount={shownCount}
        latestStateOnly={latestStateOnly}
        onPageChange={onPageChange}
      />
    </Card>
  );
};

export default TicketingHistoryTable;
