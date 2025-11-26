'use client';

import PaginationControls from '@/components/table/pagination-controls';
import TableHeadCustom from '@/components/table/table-head-custom';
import { Card } from '@/components/ui/card';
import { Table } from '@/components/ui/table';
import TableBodyWrapper from '@/components/ui/table-body-wrapper';
import { useTableSort } from '@/hooks/useTableSort';
import { FC } from 'react';
import { SamplePageProps } from './types';
import ClubsTableRow from './clubs-table-row';

const HEAD_LABEL = [
  { id: 'name', label: 'Club Name', align: 'left' },
  { id: 'dateLinked', label: 'Date Linked', align: 'left' },
  { id: 'status', label: 'Status', align: 'left' },
  { id: 'actions', label: 'Action', align: 'center' },
];

const INCOMING_HEAD_LABEL = [
  { id: 'name', label: 'Club Name', align: 'left' },
  { id: 'dateLinked', label: 'Requested Date', align: 'left' },
  { id: 'status', label: 'Status', align: 'left' },
  { id: 'actions', label: 'Action', align: 'center' },
];

const ClubsTable: FC<SamplePageProps> = ({
  data = [],
  meta,
  title,
  type,
  loading,
  handleRejectRequest,
  handleAcceptRequest,
  handleUnLinkClub,
  onPageChange,
  limit = 10,
}) => {
  // Pagination logic
  const totalPages = meta?.totalPages || 1;
  const currentPage = meta?.currentPage || 1;
  const totalRecords = meta?.totalRecords || 0;

  const { sortedData, sortConfig, handleSort } = useTableSort({
    data: data || [],
  });

  const headLabel = type === 'pending' ? INCOMING_HEAD_LABEL : HEAD_LABEL;

  return (
    <div>
      <div className="grid grid-cols-12">
        <Card className="dark:bg-secondary col-span-12 mt-5 mb-5 px-2 shadow-md md:px-8 lg:col-span-12">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <h3 className="ml-2 text-xl font-semibold md:ml-0">{title}</h3>
          </div>

          <div className="min-h-[45vh] rounded-lg border">
            <Table className="w-full rounded-md border">
              <TableHeadCustom headLabel={headLabel} onSort={handleSort} sortConfig={sortConfig} />

              <TableBodyWrapper loading={loading} colSpan={HEAD_LABEL.length} dataLength={sortedData?.length || 0}>
                {sortedData?.map((item, idx) => (
                  <ClubsTableRow
                    key={item?._id || idx}
                    type={type}
                    item={item}
                    handleRejectRequest={handleRejectRequest}
                    handleAcceptRequest={handleAcceptRequest}
                    handleUnLinkClub={handleUnLinkClub}
                  />
                ))}
              </TableBodyWrapper>
            </Table>
          </div>

          <PaginationControls
            limit={limit}
            totalPages={totalPages}
            currentPage={currentPage}
            totalRecords={totalRecords}
            onPageChange={(p) => onPageChange?.(p)}
          />
        </Card>
      </div>
    </div>
  );
};

export default ClubsTable;
