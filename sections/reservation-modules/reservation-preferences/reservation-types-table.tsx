'use client';

import TableHeadCustom from '@/components/table/table-head-custom';
import { Table } from '@/components/ui/table';
import TableBodyWrapper from '@/components/ui/table-body-wrapper';
import React from 'react';
import { RESERVATION_TYPES_TABLE_HEAD } from './constants';
import { ReservationTypeRow } from './reservation-type-row';
import { ReservationType } from './types';

interface ReservationTypesTableProps {
  data: ReservationType[];
  loading?: boolean;
  disabled?: boolean;
  onEdit: (item: ReservationType) => void;
  onDelete: (item: ReservationType) => void;
}

export const ReservationTypesTable: React.FC<ReservationTypesTableProps> = ({ data, loading, disabled, onEdit, onDelete }) => {
  return (
    <div className="overflow-x-auto rounded-lg border">
      <Table className="w-full rounded-md border">
        <TableHeadCustom headLabel={RESERVATION_TYPES_TABLE_HEAD} />

        <TableBodyWrapper
          loading={loading}
          colSpan={RESERVATION_TYPES_TABLE_HEAD.length}
          dataLength={data.length}
          emptyMessage="No reservation types found"
        >
          {data.map((item) => (
            <ReservationTypeRow key={item.id} item={item} disabled={disabled} onEdit={onEdit} onDelete={onDelete} />
          ))}
        </TableBodyWrapper>
      </Table>
    </div>
  );
};
