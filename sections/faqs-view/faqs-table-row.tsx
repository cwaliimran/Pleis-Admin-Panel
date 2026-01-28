'use client';

import { TruncatedTextWithModal } from '@/components/common/long-text-modal';
import { TableCell, TableRow } from '@/components/ui/table';
import { fDate, formatStr } from '@/utils/format-time';
import { Pencil, Trash2 } from 'lucide-react';
import { FC } from 'react';
import { TableRowProps } from './types';

const FaqsTableRow: FC<TableRowProps> = ({ item, handleEdit, handleDelete }) => {
  const getType = (type: string) => {
    switch (type) {
      case 'saved_events':
        return 'Saved Events';
      case 'saved_organizers':
        return 'Saved Organizers';
      case 'purchases':
        return 'Purchases';
      default:
        return '-';
    }
  };

  return (
    <TableRow className="h-14 w-full transition-colors hover:bg-[#f5f5f5] dark:hover:bg-[#272727]/50">
      <TableCell className="text-left capitalize">{item?.question || '-'}</TableCell>

      <TableCell className="text-left">
        <TruncatedTextWithModal text={item?.answer} title="Answer" />
      </TableCell>

      <TableCell className="text-left">{getType(item?.type)}</TableCell>

      <TableCell className="text-left">{fDate(item?.createdAt, formatStr.split.date)}</TableCell>

      <TableCell className="text-end">
        <div className="flex gap-2">
          <button
            title="Edit Promo Code"
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handleEdit?.(item);
            }}
            className="cursor-pointer rounded-md bg-gray-100 p-1.5 transition hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700"
          >
            <Pencil className="h-4 w-4 text-gray-700 dark:text-gray-200" />
          </button>

          <button
            title="Delete Promo Code"
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handleDelete?.(item?._id);
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
export default FaqsTableRow;
