'use client';

import PaginationControls from '@/components/table/pagination-controls';
import TableHeadCustom, { SortConfig } from '@/components/table/table-head-custom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Table } from '@/components/ui/table';
import TableBodyWrapper from '@/components/ui/table-body-wrapper';
import { Settings2 } from 'lucide-react';
import React from 'react';
import StreaksFilterSheet from './components/streaks-filter-sheet';
import { STREAKS_HEAD_LABEL } from './constants';
import StreaksTableRow from './streaks-table-row';
import { StreakBadge, StreakMember, StreakSortKey, StreakSortOrder, StreaksMeta } from './types';

interface StreaksTableProps {
  data: StreakMember[];
  meta: StreaksMeta;
  loading?: boolean;

  onOpenRules: () => void;
  onViewDetail: (item: StreakMember) => void;

  onPageChange: (page: number) => void;

  sortBy: StreakSortKey | '';
  sortOrder: StreakSortOrder;
  onSortChange: (sortBy: StreakSortKey | '', sortOrder: StreakSortOrder) => void;

  search: string;
  onSearchChange: (value: string) => void;
  badge: StreakBadge | '';
  onBadgeChange: (value: StreakBadge | '') => void;
  lastVisitFrom?: Date;
  onLastVisitFromChange: (value: Date | undefined) => void;
  onResetFilters: () => void;
}

export const StreaksTable: React.FC<StreaksTableProps> = ({
  data,
  meta,
  loading = false,
  onOpenRules,
  onViewDetail,
  onPageChange,
  sortBy,
  sortOrder,
  onSortChange,
  search,
  onSearchChange,
  badge,
  onBadgeChange,
  lastVisitFrom,
  onLastVisitFromChange,
  onResetFilters,
}) => {
  const sortConfig: SortConfig = {
    key: sortBy || null,
    direction: sortOrder || null,
  };

  /** Cycle on the active column: asc → desc → off. A new column starts at asc. */
  const handleSort = (key: string) => {
    const nextKey = key as StreakSortKey;

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
        <h3 className="ml-2 text-xl font-semibold md:ml-0">Streaks List</h3>

        <div className="flex flex-wrap items-center gap-2">
          <Button
            type="button"
            onClick={onOpenRules}
            className="bg-primary hover:bg-primary h-9 cursor-pointer gap-1.5 rounded-full px-4 text-white"
          >
            <Settings2 className="h-4 w-4" />
            Streak Rules
          </Button>

          <StreaksFilterSheet
            search={search}
            onSearchChange={onSearchChange}
            badge={badge}
            onBadgeChange={onBadgeChange}
            lastVisitFrom={lastVisitFrom}
            onLastVisitFromChange={onLastVisitFromChange}
            onReset={onResetFilters}
          />
        </div>
      </div>

      <div className="min-h-[45vh] overflow-x-auto rounded-lg border">
        <Table className="w-full rounded-md border">
          <TableHeadCustom headLabel={STREAKS_HEAD_LABEL} sortConfig={sortConfig} onSort={handleSort} />

          <TableBodyWrapper loading={loading} colSpan={STREAKS_HEAD_LABEL.length} dataLength={data.length} emptyMessage="No streaks found">
            {data.map((item) => (
              <StreaksTableRow key={item.id} item={item} onViewDetail={onViewDetail} />
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

export default StreaksTable;
