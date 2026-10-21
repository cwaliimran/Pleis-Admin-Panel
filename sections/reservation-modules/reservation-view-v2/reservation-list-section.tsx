'use client';

import PaginationControls from '@/components/table/pagination-controls';
import TableHeadCustom from '@/components/table/table-head-custom';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table } from '@/components/ui/table';
import TableBodyWrapper from '@/components/ui/table-body-wrapper';
import { cn } from '@/lib/utils';
import { Plus } from 'lucide-react';
import React from 'react';
import { LIST_FILTER_OPTIONS, LIST_QUICK_TABS, RESERVATION_LIST_TABLE_HEAD, SELECT_ITEM_CLASS, type ListQuickTabId } from './constants';
import { ReservationListRow } from './reservation-list-row';
import { SectionCard } from './section-card';
import { ListFilter, Reservation, ReservationPagination, ReservationStatus } from './types';

interface ReservationListSectionProps {
  data: Reservation[];
  subtitle: string;
  filter: ListFilter;
  onFilterChange: (filter: ListFilter) => void;
  pagination: ReservationPagination;
  onPageChange: (page: number) => void;
  isLoading: boolean;
  pendingStatusId: string | null;
  onCreate: () => void;
  onEdit: (item: Reservation) => void;
  onSetStatus: (item: Reservation, status: ReservationStatus) => void;
  activeTab: ListQuickTabId | null;
  onTabChange: (tab: ListQuickTabId | null) => void;
}

export const ReservationListSection: React.FC<ReservationListSectionProps> = ({
  data,
  subtitle,
  filter,
  onFilterChange,
  pagination,
  onPageChange,
  isLoading,
  pendingStatusId,
  onCreate,
  onEdit,
  onSetStatus,
  activeTab,
  onTabChange,
}) => {
  const isQuickTab = Boolean(activeTab);

  return (
    <SectionCard
      title="Reservation list"
      subtitle={subtitle}
      headerAction={
        <div className="flex shrink-0 flex-wrap items-center gap-3">
          <div className="flex overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700">
            {LIST_QUICK_TABS.map((tab, index) => {
              const isActive = activeTab === tab.id;

              return (
                <button
                  key={tab.id}
                  type="button"
                  aria-pressed={isActive}
                  onClick={() => onTabChange(isActive ? null : tab.id)}
                  className={cn(
                    'h-10 cursor-pointer px-4 text-sm font-semibold whitespace-nowrap transition-colors',
                    index > 0 && 'border-l border-gray-200 dark:border-gray-700',
                    isActive
                      ? 'bg-primary text-white'
                      : 'bg-white text-gray-700 hover:bg-gray-50 dark:bg-[#1a1a1a] dark:text-gray-200 dark:hover:bg-gray-800'
                  )}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>

          <Select value={filter} onValueChange={(next) => onFilterChange(next as ListFilter)} disabled={isQuickTab}>
            <SelectTrigger className="h-10 w-52 cursor-pointer bg-white shadow-none dark:bg-[#1a1a1a] disabled:cursor-not-allowed disabled:opacity-50">
              <SelectValue placeholder="All statuses" />
            </SelectTrigger>
            <SelectContent>
              {LIST_FILTER_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value} className={SELECT_ITEM_CLASS}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button type="button" onClick={onCreate} className="h-10 cursor-pointer gap-1 font-semibold">
            <Plus className="h-4 w-4" />
            Add reservation
          </Button>
        </div>
      }
    >
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
