'use client';

import PaginationControls from '@/components/table/pagination-controls';
import TableHeadCustom, { SortConfig } from '@/components/table/table-head-custom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Table } from '@/components/ui/table';
import TableBodyWrapper from '@/components/ui/table-body-wrapper';
import { Plus } from 'lucide-react';
import React from 'react';
import PromotionsFilterSheet from './components/promotions-filter-sheet';
import { PROMOTIONS_HEAD_LABEL } from './constants';
import PromotionsTableRow from './promotions-table-row';
import { Promotion, PromotionSortKey, PromotionSortOrder, PromotionType, PromotionsMeta } from './types';

interface PromotionsTableProps {
  data: Promotion[];
  meta: PromotionsMeta;
  loading?: boolean;
  isMutating?: boolean;

  onCreate: () => void;
  onViewAnalytics: (item: Promotion) => void;
  onEdit: (item: Promotion) => void;
  onDelete: (item: Promotion) => void;

  onPageChange: (page: number) => void;

  sortBy: PromotionSortKey | '';
  sortOrder: PromotionSortOrder;
  onSortChange: (sortBy: PromotionSortKey | '', sortOrder: PromotionSortOrder) => void;

  search: string;
  onSearchChange: (value: string) => void;
  type: PromotionType | '';
  onTypeChange: (value: PromotionType | '') => void;
  startDateFrom?: Date;
  onStartDateFromChange: (value: Date | undefined) => void;
  endDateTo?: Date;
  onEndDateToChange: (value: Date | undefined) => void;
  onResetFilters: () => void;
}

export const PromotionsTable: React.FC<PromotionsTableProps> = ({
  data,
  meta,
  loading = false,
  isMutating = false,
  onCreate,
  onViewAnalytics,
  onEdit,
  onDelete,
  onPageChange,
  sortBy,
  sortOrder,
  onSortChange,
  search,
  onSearchChange,
  type,
  onTypeChange,
  startDateFrom,
  onStartDateFromChange,
  endDateTo,
  onEndDateToChange,
  onResetFilters,
}) => {
  const sortConfig: SortConfig = {
    key: sortBy || null,
    direction: sortOrder || null,
  };

  /** Cycle on the active column: asc → desc → off. A new column starts at asc. */
  const handleSort = (key: string) => {
    const nextKey = key as PromotionSortKey;

    if (sortBy !== nextKey) {
      onSortChange(nextKey, 'asc');
      return;
    }

    if (sortOrder === 'asc') {
      onSortChange(nextKey, 'desc');
      return;
    }

    onSortChange('', '');
  };

  return (
    <Card className="dark:bg-secondary mt-5 mb-5 px-2 shadow-md md:px-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <h3 className="ml-2 text-xl font-semibold md:ml-0">Promotions</h3>

        <div className="flex flex-wrap items-center gap-2">
          <Button type="button" onClick={onCreate} className="bg-primary hover:bg-primary h-9 cursor-pointer gap-1 rounded-full px-4 text-white">
            <Plus className="h-4 w-4" />
            Create Promotion
          </Button>

          <PromotionsFilterSheet
            search={search}
            onSearchChange={onSearchChange}
            type={type}
            onTypeChange={onTypeChange}
            startDateFrom={startDateFrom}
            onStartDateFromChange={onStartDateFromChange}
            endDateTo={endDateTo}
            onEndDateToChange={onEndDateToChange}
            onReset={onResetFilters}
          />
        </div>
      </div>

      <div className="min-h-[45vh] overflow-x-auto rounded-lg border">
        <Table className="w-full rounded-md border">
          <TableHeadCustom headLabel={PROMOTIONS_HEAD_LABEL} sortConfig={sortConfig} onSort={handleSort} />

          <TableBodyWrapper loading={loading} colSpan={PROMOTIONS_HEAD_LABEL.length} dataLength={data.length} emptyMessage="No promotions found">
            {data.map((item) => (
              <PromotionsTableRow
                key={item.id}
                item={item}
                disabled={isMutating}
                onViewAnalytics={onViewAnalytics}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            ))}
          </TableBodyWrapper>
        </Table>
      </div>

      <PaginationControls
        limit={meta.limit}
        totalPages={meta.totalPages}
        currentPage={meta.currentPage}
        totalRecords={meta.totalRecords}
        onPageChange={onPageChange}
      />
    </Card>
  );
};

export default PromotionsTable;
