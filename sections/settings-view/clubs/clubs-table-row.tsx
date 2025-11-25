'use client';

import CustomBadge from '@/components/ui/custom-badge';
import { TableCell, TableRow } from '@/components/ui/table';
import { fDate, formatStr } from '@/utils/format-time';
import { Check, Trash2 } from 'lucide-react';
import { FC } from 'react';
import { TableRowProps } from './types';

const ClubsTableRow: FC<TableRowProps> = ({ item, type, handleRejectRequest, handleAcceptRequest, handleUnLinkClub }) => {
  return (
    <TableRow className="h-14 w-full transition-colors hover:bg-[#f5f5f5] dark:hover:bg-[#272727]/50">
      <TableCell className="text-left capitalize">{item?.selectedUserData?.user?.clubName || '-'}</TableCell>
      <TableCell className="text-left">{fDate(item?.createdAt, formatStr.paramCase.date)}</TableCell>

      <TableCell className="text-left">
        <CustomBadge variant={item?.selectedUserData?.status === 'pending' ? 'warning' : item?.selectedUserData?.status === 'accepted' ? 'success' : 'info'}>
          {item?.selectedUserData?.status ? item?.selectedUserData?.status : 'N/A'}
        </CustomBadge>
      </TableCell>

      <TableCell className="text-end">
        <div className="flex items-center justify-center gap-2">
          {type === 'pending' ? (
            <>
              <button
                title="Approve Club"
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleAcceptRequest?.(item?._id);
                }}
                className="cursor-pointer rounded-md bg-green-100 p-1.5 transition hover:bg-green-200 dark:bg-green-900 dark:hover:bg-green-800"
              >
                <Check className="h-4 w-4 text-green-600 dark:text-green-300" />
              </button>

              <button
                title="Reject Club"
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleRejectRequest?.(item?._id);
                }}
                className="cursor-pointer rounded-md bg-red-100 p-1.5 transition hover:bg-red-200 dark:bg-red-900 dark:hover:bg-red-800"
              >
                <Trash2 className="h-4 w-4 text-red-600 dark:text-red-300" />
              </button>
            </>
          ) : (
            <button
              title="Delete Club"
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleUnLinkClub?.(item?._id);
              }}
              className="cursor-pointer rounded-md bg-red-100 p-1.5 transition hover:bg-red-200 dark:bg-red-900 dark:hover:bg-red-800"
            >
              <Trash2 className="h-4 w-4 text-red-600 dark:text-red-300" />
            </button>
          )}
        </div>
      </TableCell>
    </TableRow>
  );
};

export default ClubsTableRow;
