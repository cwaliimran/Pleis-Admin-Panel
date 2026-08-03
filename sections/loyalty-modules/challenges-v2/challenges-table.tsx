'use client';

import PaginationControls from '@/components/table/pagination-controls';
import TableHeadCustom, { SortConfig } from '@/components/table/table-head-custom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Table } from '@/components/ui/table';
import TableBodyWrapper from '@/components/ui/table-body-wrapper';
import { Plus } from 'lucide-react';
import React from 'react';
import ChallengesFilterSheet from './components/challenges-filter-sheet';
import ChallengesTableRow from './challenges-table-row';
import { CHALLENGES_HEAD_LABEL } from './constants';
import {
  Challenge,
  ChallengeRewardType,
  ChallengeSortKey,
  ChallengeSortOrder,
  ChallengeStatus,
  ChallengeTaskType,
  ChallengesMeta,
} from './types';

interface ChallengesTableProps {
  data: Challenge[];
  meta: ChallengesMeta;
  loading?: boolean;
  isMutating?: boolean;

  onCreate: () => void;
  onViewAnalytics: (item: Challenge) => void;
  onEdit: (item: Challenge) => void;
  onDelete: (item: Challenge) => void;

  onPageChange: (page: number) => void;

  sortBy: ChallengeSortKey | '';
  sortOrder: ChallengeSortOrder;
  onSortChange: (sortBy: ChallengeSortKey | '', sortOrder: ChallengeSortOrder) => void;

  search: string;
  onSearchChange: (value: string) => void;
  taskType: ChallengeTaskType | '';
  onTaskTypeChange: (value: ChallengeTaskType | '') => void;
  rewardType: ChallengeRewardType | '';
  onRewardTypeChange: (value: ChallengeRewardType | '') => void;
  status: ChallengeStatus | '';
  onStatusChange: (value: ChallengeStatus | '') => void;
  onResetFilters: () => void;
}

export const ChallengesTable: React.FC<ChallengesTableProps> = ({
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
  taskType,
  onTaskTypeChange,
  rewardType,
  onRewardTypeChange,
  status,
  onStatusChange,
  onResetFilters,
}) => {
  const sortConfig: SortConfig = {
    key: sortBy || null,
    direction: sortOrder || null,
  };

  /** Cycle on the active column: asc → desc → off. A new column starts at asc. */
  const handleSort = (key: string) => {
    const nextKey = key as ChallengeSortKey;

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
        <h3 className="ml-2 text-xl font-semibold md:ml-0">Challenges</h3>

        <div className="flex flex-wrap items-center gap-2">
          <Button type="button" onClick={onCreate} className="bg-primary hover:bg-primary h-9 cursor-pointer gap-1 rounded-full px-4 text-white">
            <Plus className="h-4 w-4" />
            Create Challenge
          </Button>

          <ChallengesFilterSheet
            search={search}
            onSearchChange={onSearchChange}
            taskType={taskType}
            onTaskTypeChange={onTaskTypeChange}
            rewardType={rewardType}
            onRewardTypeChange={onRewardTypeChange}
            status={status}
            onStatusChange={onStatusChange}
            onReset={onResetFilters}
          />
        </div>
      </div>

      <div className="min-h-[45vh] overflow-x-auto rounded-lg border">
        <Table className="w-full rounded-md border">
          <TableHeadCustom headLabel={CHALLENGES_HEAD_LABEL} sortConfig={sortConfig} onSort={handleSort} />

          <TableBodyWrapper loading={loading} colSpan={CHALLENGES_HEAD_LABEL.length} dataLength={data.length} emptyMessage="No challenges found">
            {data.map((item) => (
              <ChallengesTableRow
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

export default ChallengesTable;
