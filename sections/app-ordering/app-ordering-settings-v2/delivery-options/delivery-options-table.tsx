'use client';

import TableHeadCustom, { SortConfig } from '@/components/table/table-head-custom';
import { Table } from '@/components/ui/table';
import TableBodyWrapper from '@/components/ui/table-body-wrapper';
import { FC } from 'react';
import { DELIVERY_OPTIONS_TABLE_HEAD } from './constants';
import DeliveryOptionRow from './delivery-option-row';
import { DeliveryOption, SortDirection } from './types';

interface DeliveryOptionsTableProps {
  data: DeliveryOption[];
  loading?: boolean;
  disabled?: boolean;
  handleEdit?: (option: DeliveryOption) => void;
  handleGenerateQrCode?: (option: DeliveryOption) => void;
  handleDelete?: (option: DeliveryOption) => void;
  sortBy?: string;
  sortOrder?: SortDirection | '';
  onSortChange?: (key: string, order: SortDirection | '') => void;
}

const DeliveryOptionsTable: FC<DeliveryOptionsTableProps> = ({
  data = [],
  loading,
  disabled,
  handleEdit,
  handleGenerateQrCode,
  handleDelete,
  sortBy = '',
  sortOrder = '',
  onSortChange,
}) => {
  const sortConfig: SortConfig = {
    key: sortBy || null,
    direction: sortOrder === 'asc' || sortOrder === 'desc' ? sortOrder : null,
  };

  // Same cycle as every other table in the app: asc → desc → cleared.
  const handleSort = (key: string) => {
    if (sortBy !== key) {
      onSortChange?.(key, 'asc');
    } else if (sortOrder === 'asc') {
      onSortChange?.(key, 'desc');
    } else if (sortOrder === 'desc') {
      onSortChange?.('', '');
    } else {
      onSortChange?.(key, 'asc');
    }
  };

  return (
    <div className="min-h-[45vh] rounded-lg border">
      <Table className="w-full rounded-md border">
        <TableHeadCustom headLabel={DELIVERY_OPTIONS_TABLE_HEAD} onSort={handleSort} sortConfig={sortConfig} />

        <TableBodyWrapper
          loading={loading}
          colSpan={DELIVERY_OPTIONS_TABLE_HEAD.length}
          dataLength={data?.length || 0}
          emptyMessage="No delivery options found"
        >
          {data?.map((item, idx) => (
            <DeliveryOptionRow
              key={item?.id || idx}
              item={item}
              disabled={disabled}
              handleEdit={handleEdit}
              handleGenerateQrCode={handleGenerateQrCode}
              handleDelete={handleDelete}
            />
          ))}
        </TableBodyWrapper>
      </Table>
    </div>
  );
};

export default DeliveryOptionsTable;
