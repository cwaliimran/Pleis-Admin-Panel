'use client';

import PaginationControls from '@/components/table/pagination-controls';
import TableHeadCustom, { SortConfig } from '@/components/table/table-head-custom';
import { Card } from '@/components/ui/card';
import { Table } from '@/components/ui/table';
import TableBodyWrapper from '@/components/ui/table-body-wrapper';
import React from 'react';
import ReferralsFilterSheet from './components/referrals-filter-sheet';
import { REFERRALS_HEAD_LABEL } from './constants';
import ReferralsTableRow from './referrals-table-row';
import { Referral, ReferralSortKey, ReferralSortOrder, ReferralStatus, ReferralsMeta } from './types';

interface ReferralsTableProps {
  data: Referral[];
  meta: ReferralsMeta;
  loading?: boolean;

  onPageChange: (page: number) => void;

  sortBy: ReferralSortKey | '';
  sortOrder: ReferralSortOrder;
  onSortChange: (sortBy: ReferralSortKey | '', sortOrder: ReferralSortOrder) => void;

  keyword: string;
  onKeywordChange: (value: string) => void;
  status: ReferralStatus | '';
  onStatusChange: (value: ReferralStatus | '') => void;
  onResetFilters: () => void;
}

export const ReferralsTable: React.FC<ReferralsTableProps> = ({
  data,
  meta,
  loading = false,
  onPageChange,
  sortBy,
  sortOrder,
  onSortChange,
  keyword,
  onKeywordChange,
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
    const nextKey = key as ReferralSortKey;

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
        <h3 className="ml-2 text-xl font-semibold md:ml-0">Referral List</h3>

        {/* No create button — members generate referrals by sharing their code. */}
        <ReferralsFilterSheet
          keyword={keyword}
          onKeywordChange={onKeywordChange}
          status={status}
          onStatusChange={onStatusChange}
          onReset={onResetFilters}
        />
      </div>

      <div className="min-h-[45vh] overflow-x-auto rounded-lg border">
        <Table className="w-full rounded-md border">
          <TableHeadCustom headLabel={REFERRALS_HEAD_LABEL} sortConfig={sortConfig} onSort={handleSort} />

          <TableBodyWrapper loading={loading} colSpan={REFERRALS_HEAD_LABEL.length} dataLength={data.length} emptyMessage="No referrals found">
            {data.map((item) => (
              <ReferralsTableRow key={item.id} item={item} />
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

export default ReferralsTable;
