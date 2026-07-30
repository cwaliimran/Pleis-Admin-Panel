'use client';

import TableHeadCustom from '@/components/table/table-head-custom';
import { Button } from '@/components/ui/button';
import { Table } from '@/components/ui/table';
import TableBodyWrapper from '@/components/ui/table-body-wrapper';
import { cn } from '@/lib/utils';
import { Plus } from 'lucide-react';
import React from 'react';
import { LIST_FILTER_OPTIONS, RESERVATION_LIST_TABLE_HEAD } from './constants';
import { ReservationListRow } from './reservation-list-row';
import { SectionCard } from './section-card';
import { ListFilter, Reservation, ReservationStatus } from './types';

interface ReservationListSectionProps {
  data: Reservation[];
  /** "Mon 02/06 · slot 19:00 · Standard table" — reflects the active selection. */
  subtitle: string;
  filter: ListFilter;
  onFilterChange: (filter: ListFilter) => void;
  isLoading: boolean;
  isMutating: boolean;
  onCreate: () => void;
  onEdit: (item: Reservation) => void;
  onDelete: (item: Reservation) => void;
  onSetStatus: (item: Reservation, status: ReservationStatus) => void;
}

export const ReservationListSection: React.FC<ReservationListSectionProps> = ({
  data,
  subtitle,
  filter,
  onFilterChange,
  isLoading,
  isMutating,
  onCreate,
  onEdit,
  onDelete,
  onSetStatus,
}) => {
  return (
    <SectionCard
      title="Reservation list"
      subtitle={subtitle}
      headerAction={
        <div className="flex shrink-0 flex-wrap items-center gap-3">
          <div className="inline-flex rounded-lg border border-gray-200 p-0.5 dark:border-gray-700">
            {LIST_FILTER_OPTIONS.map((option) => (
              <button
                key={option.value}
                type="button"
                aria-pressed={filter === option.value}
                onClick={() => onFilterChange(option.value)}
                className={cn(
                  'cursor-pointer rounded-md px-3 py-1.5 text-sm font-semibold transition-colors',
                  filter === option.value
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800'
                )}
              >
                {option.label}
              </button>
            ))}
          </div>

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
                disabled={isMutating}
                onEdit={onEdit}
                onDelete={onDelete}
                onSetStatus={onSetStatus}
              />
            ))}
          </TableBodyWrapper>
        </Table>
      </div>
    </SectionCard>
  );
};
