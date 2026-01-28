'use client';

import { TruncatedTextWithModal } from '@/components/common/long-text-modal';
import { Avatar, AvatarImage } from '@/components/ui/avatar';
import { TableCell, TableRow } from '@/components/ui/table';
import { noImageUrl, noImageUrlDev } from '@/constant/constant';
import { fDate, formatStr } from '@/utils/format-time';
import { Pencil, Trash2 } from 'lucide-react';
import { FC } from 'react';
import { TableRowProps } from './types';

const ReviewsTableRow: FC<TableRowProps> = ({ user, item, handleEdit, handleDelete }) => {
  return (
    <TableRow className="h-14 w-full transition-colors hover:bg-[#f5f5f5] dark:hover:bg-[#272727]/50">
      <TableCell>
        <Avatar className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-xl bg-gray-100 shadow-sm dark:bg-gray-800">
          {item?.userDetails?.profileIcon && item?.userDetails?.profileIcon !== noImageUrl && item?.userDetails?.profileIcon !== noImageUrlDev ? (
            <AvatarImage src={item?.userDetails?.profileIcon} alt="Menu Item" className="h-full w-full cursor-pointer object-cover" />
          ) : (
            <span className="text-lg font-semibold text-gray-500 dark:text-gray-300">{item?.userDetails?.firstName?.[0]?.toUpperCase() || ''}</span>
          )}
        </Avatar>
      </TableCell>

      <TableCell className="text-left capitalize">
        {item?.userDetails?.firstName || ''} {item?.userDetails?.lastName || ''}
      </TableCell>

      <TableCell className="text-left">{item?.organizationDetails?.basicInfo?.name || 'N/A'}</TableCell>

      <TableCell className="text-left">{item?.rating || 'N/A'}</TableCell>

      <TableCell className="text-left">
        <TruncatedTextWithModal text={item?.comment} title="Review" />
      </TableCell>

      <TableCell className="text-left">{fDate(item?.createdAt, formatStr.split.date)}</TableCell>

      {user?.accountState?.userType === 'admin' && (
        <TableCell className="text-end">
          <div className="flex gap-2">
            <button
              title="View Venue"
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleEdit?.(item?._id, item?.comment);
              }}
              className="cursor-pointer rounded-md bg-gray-100 p-1.5 transition hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700"
            >
              <Pencil className="h-4 w-4 text-gray-700 dark:text-gray-200" />
            </button>

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
      )}
    </TableRow>
  );
};
export default ReviewsTableRow;
