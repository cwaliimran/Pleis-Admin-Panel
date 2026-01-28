'use client';

import { Avatar, AvatarImage } from '@/components/ui/avatar';
import CustomBadge from '@/components/ui/custom-badge';
import { TableCell, TableRow } from '@/components/ui/table';
import { noImageUrl, noImageUrlDev } from '@/constant/constant';
import { fDate, formatStr } from '@/utils/format-time';
import { Pencil, Trash2 } from 'lucide-react';
import { FC } from 'react';
import { TableRowProps } from './types';
import { TruncatedTextWithModal } from '@/components/common/long-text-modal';

const HelpSupportTableRow: FC<TableRowProps> = ({ item, handleDelete, handleEdit }) => {
  return (
    <TableRow className="h-14 transition-colors hover:bg-[#f5f5f5] dark:hover:bg-[#272727]/50">
      {/* Photo */}
      <TableCell>
        <Avatar className="h-10 w-10 rounded-lg bg-gray-100 dark:bg-gray-800">
          {item?.user?.profileIcon && item?.user?.profileIcon !== noImageUrl && item?.user?.profileIcon !== noImageUrlDev ? (
            <AvatarImage src={item.user.profileIcon} alt={item.user.username} className="object-cover" />
          ) : (
            <span className="text-sm font-semibold text-gray-500">{item?.user?.firstName?.[0]?.toUpperCase()}</span>
          )}
        </Avatar>
      </TableCell>

      {/* Username */}
      <TableCell className="text-left font-medium capitalize">{item?.user?.firstName || '-'}</TableCell>

      {/* Ticket Number */}
      <TableCell className="text-left font-medium capitalize">{item?.ticket || '-'}</TableCell>

      {/* Subject */}
      <TableCell className="text-left">{item?.subject || '-'}</TableCell>

      {/* Description */}
      <TableCell className="max-w-[320px] truncate text-left text-sm text-gray-600 dark:text-gray-300">
        <TruncatedTextWithModal text={item?.message} title="Description" />
      </TableCell>

      {/* Created At */}
      <TableCell className="text-left">{fDate(item?.createdAt, formatStr.split.date)}</TableCell>

      {/* Status */}
      <TableCell className="text-left">
        <CustomBadge variant={item.status === 'closed' ? 'error' : item.status === 'pending' ? 'warning' : 'success'}>{item?.status}</CustomBadge>
      </TableCell>

      {/* Actions */}
      <TableCell className="text-center">
        <div className="flex justify-center gap-2">
          <button
            title="reply"
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handleEdit?.(item);
            }}
            className="cursor-pointer rounded-md bg-gray-100 p-1.5 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700"
          >
            <Pencil className="h-4 w-4" />
          </button>

          <button
            title="delete"
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handleDelete?.(item?._id);
            }}
            className="cursor-pointer rounded-md bg-red-100 p-1.5 hover:bg-red-200 dark:bg-red-900 dark:hover:bg-red-800"
          >
            <Trash2 className="h-4 w-4 text-red-600 dark:text-red-300" />
          </button>
        </div>
      </TableCell>
    </TableRow>
  );
};

export default HelpSupportTableRow;
