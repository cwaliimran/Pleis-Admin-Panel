'use client';

import PaginationControls from '@/components/table/pagination-controls';
import TableHeadCustom from '@/components/table/table-head-custom';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table } from '@/components/ui/table';
import TableBodyWrapper from '@/components/ui/table-body-wrapper';
import { Plus } from 'lucide-react';
import React from 'react';
import { LIST_FILTER_OPTIONS, RESERVATION_LIST_TABLE_HEAD, SELECT_ITEM_CLASS } from './constants';
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
}) => {
  return (
    <SectionCard
      title="Reservation list"
      subtitle={subtitle}
      headerAction={
        <div className="flex shrink-0 flex-wrap items-center gap-3">
          <Select value={filter} onValueChange={(next) => onFilterChange(next as ListFilter)}>
            <SelectTrigger className="h-10 w-52 cursor-pointer bg-white shadow-none dark:bg-[#1a1a1a]">
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
