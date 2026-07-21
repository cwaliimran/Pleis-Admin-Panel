'use client';

import CustomBadge from '@/components/ui/custom-badge';
import { TableCell, TableRow } from '@/components/ui/table';
import { fDate, formatStr } from '@/utils/format-time';
import { Pencil, Trash2 } from 'lucide-react';
import { FC } from 'react';
import { TableRowProps } from './types';
import { getAppliesToLabel } from './utils';

const formatDateTime = (value: string) => fDate(value, `${formatStr.split.date} HH:mm`);

const DiscountTableRow: FC<TableRowProps> = ({ item, handleDelete, handleEdit }) => {
  const appliesToLabel = getAppliesToLabel(item.itemIds);

  return (
    <TableRow className="h-14 w-full transition-colors hover:bg-[#f5f5f5] dark:hover:bg-[#272727]/50">
      <TableCell className="text-left font-semibold">{item.title}</TableCell>

      <TableCell className="text-left">
        <CustomBadge variant={item.type === 'percentage' ? 'warning' : 'info'}>{item.type === 'percentage' ? '% Percentage' : '€ Fixed'}</CustomBadge>
      </TableCell>

      <TableCell className="text-left font-semibold">{item.type === 'percentage' ? `${item.value}%` : `€${item.value.toFixed(2)}`}</TableCell>

      <TableCell className="text-left">
        <div>{item.itemIds.length} items</div>
        <div className="text-muted-foreground text-xs">{appliesToLabel}</div>
      </TableCell>

      <TableCell className="text-left">{formatDateTime(item.startDate)}</TableCell>

      <TableCell className="text-left">{formatDateTime(item.endDate)}</TableCell>

      <TableCell className="text-left">
        <CustomBadge variant={item.status === 'active' ? 'success' : 'default'}>{item.status}</CustomBadge>
      </TableCell>

      <TableCell className="text-end">
        <div className="flex justify-center gap-2">
          <button
            title="Edit Discount"
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handleEdit?.(item._id);
            }}
            className="cursor-pointer rounded-md bg-gray-100 p-1.5 transition hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700"
          >
            <Pencil className="h-4 w-4 text-gray-700 dark:text-gray-200" />
          </button>

          <button
            title="Delete Discount"
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handleDelete?.(item._id);
            }}
            className="cursor-pointer rounded-md bg-red-100 p-1.5 transition hover:bg-red-200 dark:bg-red-900 dark:hover:bg-red-800"
          >
            <Trash2 className="h-4 w-4 text-red-600 dark:text-red-300" />
          </button>
        </div>
      </TableCell>
    </TableRow>
  );
};

export default DiscountTableRow;
