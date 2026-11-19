'use client';

import PaginationControls from '@/components/table/pagination-controls';
import TableHeadCustom from '@/components/table/table-head-custom';
import { Button } from '@/components/ui/button';
import { Command, CommandGroup, CommandItem, CommandList, CommandSeparator } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Table } from '@/components/ui/table';
import TableBodyWrapper from '@/components/ui/table-body-wrapper';
import { cn } from '@/lib/utils';
import { Check, ChevronsUpDown, Plus, X } from 'lucide-react';
import React, { useState } from 'react';
import { NEW_FILTER_LABEL, RESERVATION_LIST_TABLE_HEAD, RESERVATION_STATUS_OPTIONS } from './constants';
import { ReservationListRow } from './reservation-list-row';
import { SectionCard } from './section-card';
import { ListFilters, Reservation, ReservationPagination, ReservationStatus } from './types';

export interface ActiveFilterChip {
  key: string;
  label: string;
  onRemove: () => void;
}

interface ReservationListSectionProps {
  data: Reservation[];
  subtitle: string;
  filters: ListFilters;
  onFiltersChange: (filters: ListFilters) => void;
  newCount: number;
  chips: ActiveFilterChip[];
  onClearAll: () => void;
  pagination: ReservationPagination;
  onPageChange: (page: number) => void;
  isLoading: boolean;
  pendingStatusId: string | null;
  onCreate: () => void;
  onEdit: (item: Reservation) => void;
  onSetStatus: (item: Reservation, status: ReservationStatus) => void;
}

/**
 * Reservation list filters (Requirement Set #56, Filters v5 §2.1): New and the
 * statuses (Need confirmation included) are options of one filter list, not
 * separate lists. Statuses are OR'd; New, day, time slot and type are AND'd.
 */
const ListFilterMenu: React.FC<{ filters: ListFilters; onChange: (filters: ListFilters) => void; newCount: number }> = ({
  filters,
  onChange,
  newCount,
}) => {
  const [open, setOpen] = useState(false);
  const activeCount = filters.statuses.length + (filters.isNew ? 1 : 0);

  const toggleStatus = (status: ReservationStatus) =>
    onChange({
      ...filters,
      statuses: filters.statuses.includes(status) ? filters.statuses.filter((s) => s !== status) : [...filters.statuses, status],
    });

  const label =
    activeCount === 0
      ? 'All statuses'
      : activeCount === 1
        ? filters.isNew
          ? NEW_FILTER_LABEL
          : RESERVATION_STATUS_OPTIONS.find((o) => o.value === filters.statuses[0])?.label
        : `${activeCount} filters`;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          role="combobox"
          aria-expanded={open}
          aria-label="Filter reservations"
          className="h-10 w-52 cursor-pointer justify-between bg-white font-normal shadow-none dark:bg-[#1a1a1a]"
        >
          <span className="truncate">{label}</span>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-60 p-0" align="end">
        <Command>
          <CommandList className="max-h-96">
            <CommandGroup heading="Show">
              <CommandItem value="new" onSelect={() => onChange({ ...filters, isNew: !filters.isNew })} className="cursor-pointer">
                <Check className={cn('mr-2 h-4 w-4', filters.isNew ? 'opacity-100' : 'opacity-0')} />
                <span className="flex-1">{NEW_FILTER_LABEL}</span>
                <span className="text-xs text-gray-500 tabular-nums dark:text-gray-400">{newCount}</span>
              </CommandItem>
            </CommandGroup>
            <CommandSeparator />
            <CommandGroup heading="Status">
              <CommandItem value="all-statuses" onSelect={() => onChange({ ...filters, statuses: [] })} className="cursor-pointer">
                <Check className={cn('mr-2 h-4 w-4', filters.statuses.length === 0 ? 'opacity-100' : 'opacity-0')} />
                All statuses
              </CommandItem>
              {RESERVATION_STATUS_OPTIONS.map((option) => (
                <CommandItem key={option.value} value={option.value} onSelect={() => toggleStatus(option.value)} className="cursor-pointer">
                  <Check className={cn('mr-2 h-4 w-4', filters.statuses.includes(option.value) ? 'opacity-100' : 'opacity-0')} />
                  {option.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export const ReservationListSection: React.FC<ReservationListSectionProps> = ({
  data,
  subtitle,
  filters,
  onFiltersChange,
  newCount,
  chips,
  onClearAll,
  pagination,
  onPageChange,
  isLoading,
  pendingStatusId,
  onCreate,
  onEdit,
  onSetStatus,
}) => {
  return (
    <SectionCard
      title="Reservation list"
      subtitle={subtitle}
      headerAction={
        <div className="flex shrink-0 flex-wrap items-center gap-3">
          <ListFilterMenu filters={filters} onChange={onFiltersChange} newCount={newCount} />

          <Button type="button" onClick={onCreate} className="h-10 cursor-pointer gap-1 font-semibold">
            <Plus className="h-4 w-4" />
            Add reservation
          </Button>
        </div>
      }
    >
      {chips.length > 0 && (
        <div className="mb-3 flex flex-wrap items-center gap-2">
          {chips.map((chip) => (
            <span
              key={chip.key}
              className="inline-flex items-center gap-1 rounded-full border border-gray-200 bg-gray-50 py-1 pr-1 pl-3 text-xs font-medium text-gray-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
            >
              {chip.label}
              <button
                type="button"
                onClick={chip.onRemove}
                aria-label={`Remove filter ${chip.label}`}
                className="cursor-pointer rounded-full p-0.5 hover:bg-gray-200 dark:hover:bg-gray-700"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          ))}
          <button type="button" onClick={onClearAll} className="text-primary cursor-pointer text-xs font-semibold hover:underline">
            Clear all
          </button>
        </div>
      )}

      <div className="overflow-x-auto rounded-lg border">
        <Table className="w-full rounded-md border">
          <TableHeadCustom headLabel={RESERVATION_LIST_TABLE_HEAD} />

          <TableBodyWrapper
            loading={isLoading}
            colSpan={RESERVATION_LIST_TABLE_HEAD.length}
            dataLength={data.length}
            emptyMessage="No reservations found"
          >
            {data.map((item) => (
              <ReservationListRow
                key={item.id}
                item={item}
                disabled={pendingStatusId === item.id}
                onEdit={onEdit}
                onSetStatus={onSetStatus}
              />
            ))}
          </TableBodyWrapper>
        </Table>
      </div>

      {pagination.totalPages > 1 && (
        <PaginationControls
          currentPage={pagination.page}
          totalPages={pagination.totalPages}
          totalRecords={pagination.totalRecords}
          limit={pagination.limit}
          onPageChange={onPageChange}
        />
      )}
    </SectionCard>
  );
};
