'use client';

import { TableCell, TableRow } from '@/components/ui/table';
import { Check, Trash2 } from 'lucide-react';
import { FC } from 'react';
import { TableRowProps } from './types';
import CustomBadge from '@/components/ui/custom-badge';
import { getStatusVariant } from '@/utils/short-utils';

const LinkedClubsTableRow: FC<TableRowProps> = ({
  item,
  handleDelete,
  tableName,
}) => {
  return (
    <TableRow className="h-14 w-full transition-colors hover:bg-[#f5f5f5] dark:hover:bg-[#272727]/50">
      <TableCell className="text-left">{item.name}</TableCell>
      <TableCell className="text-left">{item.dateLinked}</TableCell>
      <TableCell className="text-left">
        <CustomBadge
          variant={getStatusVariant(
            tableName === 'Incoming Requests' ? 'pending' : item?.status
          )}
        >
          {tableName === 'Incoming Requests' ? 'pending' : item?.status}
        </CustomBadge>
      </TableCell>

      <TableCell className="max-w-40">
        <div className="flex justify-start gap-2">
          {tableName === 'Incoming Requests' && (
            <button
              title="View Venue"
              type="button"
              className="cursor-pointer rounded-md bg-green-100 p-1.5 transition hover:bg-green-200 dark:bg-green-900 dark:hover:bg-green-800"
            >
              <Check className="h-4 w-4 text-green-600 dark:text-green-300" />
            </button>
          )}

          <button
            title="View Venue"
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
export default LinkedClubsTableRow;
