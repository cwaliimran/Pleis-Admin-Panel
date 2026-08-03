'use client';

import PaginationControls from '@/components/table/pagination-controls';
import TableHeadCustom, { SortConfig } from '@/components/table/table-head-custom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Table } from '@/components/ui/table';
import TableBodyWrapper from '@/components/ui/table-body-wrapper';
import { Plus } from 'lucide-react';
import React from 'react';
import { REWARDS_HEAD_LABEL } from './constants';
import RewardsFilterSheet from './rewards-filter-sheet';
import RewardsTableRow from './rewards-table-row';
import { Reward, RewardSortKey, RewardSortOrder, RewardStatus, RewardType, RewardsMeta } from './types';

interface RewardsTableProps {
  data: Reward[];
  meta: RewardsMeta;
  loading?: boolean;
  isMutating?: boolean;

  onCreate: () => void;
  onViewAnalytics: (item: Reward) => void;
  onEdit: (item: Reward) => void;
  onDelete: (item: Reward) => void;

  onPageChange: (page: number) => void;

  sortBy: RewardSortKey | '';
  sortOrder: RewardSortOrder;
  onSortChange: (sortBy: RewardSortKey | '', sortOrder: RewardSortOrder) => void;

  search: string;
  onSearchChange: (value: string) => void;
  type: RewardType | '';
  typeOptions: { value: string; label: string }[];
  onTypeChange: (value: RewardType | '') => void;
  status: RewardStatus | '';
  onStatusChange: (value: RewardStatus | '') => void;
  onResetFilters: () => void;
}

export const RewardsTable: React.FC<RewardsTableProps> = ({
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
  typeOptions,
  onTypeChange,
  status,
  onStatusChange,
  onResetFilters,
}) => {
  const sortConfig: SortConfig = {
    key: sortBy || null,
    direction: sortOrder || null,
  };

  const handleSort = (key: string) => {
    const nextKey = key as RewardSortKey;

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
        <h3 className="ml-2 text-xl font-semibold md:ml-0">Rewards</h3>

        <div className="flex flex-wrap items-center gap-2">
          <Button type="button" onClick={onCreate} className="bg-primary hover:bg-primary h-9 cursor-pointer gap-1 rounded-full px-4 text-white">
            <Plus className="h-4 w-4" />
            Create Reward
          </Button>

          <RewardsFilterSheet
            search={search}
            onSearchChange={onSearchChange}
            type={type}
            typeOptions={typeOptions}
            onTypeChange={onTypeChange}
            status={status}
            onStatusChange={onStatusChange}
            onReset={onResetFilters}
          />
        </div>
      </div>

      <div className="min-h-[45vh] overflow-x-auto rounded-lg border">
        <Table className="w-full rounded-md border">
          <TableHeadCustom headLabel={REWARDS_HEAD_LABEL} sortConfig={sortConfig} onSort={handleSort} />

          <TableBodyWrapper loading={loading} colSpan={REWARDS_HEAD_LABEL.length} dataLength={data.length} emptyMessage="No rewards found">
            {data.map((item) => (
              <RewardsTableRow
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

export default RewardsTable;
