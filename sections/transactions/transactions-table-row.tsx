'use client';

import { TableCell, TableRow } from '@/components/ui/table';
import { Eye } from 'lucide-react';
import { FC } from 'react';
import { TableRowProps } from './types';
import CustomBadge from '@/components/ui/custom-badge';

const TransactionsTableRow: FC<TableRowProps> = ({
  item,
  // handleDelete,
  handleEdit,
}) => {
  return (
    <TableRow className="h-14 w-full transition-colors hover:bg-[#f5f5f5] dark:hover:bg-[#272727]/50">
      <TableCell className="text-left">{item?.organizer}</TableCell>
      <TableCell className="text-left">{item?.user}</TableCell>
      <TableCell className="text-left">TXN-123456</TableCell>
      <TableCell className="text-left">{item?.transactionType}</TableCell>
      <TableCell className="text-left">
        <span className="text-green-600">{item?.points}</span>
      </TableCell>

      <TableCell className="text-left">{item?.reference}</TableCell>
      <TableCell className="text-left">{item?.timestamp}</TableCell>
      <TableCell className="text-center">
        <CustomBadge
          variant={
            item?.status === 'success'
              ? 'success'
              : item?.status === 'failed' || item?.status === 'failed'
                ? 'error'
                : 'default'
          }
        >
          {item?.status}
        </CustomBadge>
      </TableCell>

      <TableCell className="">
        <div className="flex justify-center gap-2">
          <button
            title="View Organization"
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handleEdit?.(item?._id);
            }}
            className="cursor-pointer rounded-md bg-gray-100 p-1.5 transition hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700"
          >
            <Eye className="h-4 w-4 text-gray-700 dark:text-gray-200" />
          </button>
        </div>
      </TableCell>
    </TableRow>
  );
};
export default TransactionsTableRow;
