'use client';

import { Avatar, AvatarImage } from '@/components/ui/avatar';
import CustomBadge from '@/components/ui/custom-badge';
import { TableCell, TableRow } from '@/components/ui/table';
import { noImageUrl, noImageUrlDev } from '@/constant/constant';
import { fDate, formatStr } from '@/utils/format-time';
import { getStatusVariant } from '@/utils/short-utils';
import { Pencil, Trash2 } from 'lucide-react';
import { FC } from 'react';
import ImageWithModal from './image-with-modal';
import { TableRowProps } from './types';

const StatusTableRow: FC<TableRowProps> = ({ item, handleDelete, handleEdit }) => {
  return (
    <TableRow className="h-14 w-full transition-colors hover:bg-[#f5f5f5] dark:hover:bg-[#272727]/50">
      <TableCell>
        <Avatar className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-xl bg-gray-100 shadow-sm dark:bg-gray-800">
          {item?.image && item?.image !== noImageUrl && item?.image !== noImageUrlDev ? (
            <AvatarImage src={item?.image} alt="Status Image" className="h-full w-full cursor-pointer object-cover" />
          ) : (
            <span className="text-lg font-semibold text-gray-500 dark:text-gray-300">{item?.title?.[0]?.toUpperCase() || ''}</span>
          )}
        </Avatar>
      </TableCell>

      <TableCell className="text-left capitalize">{item?.title || '-'}</TableCell>

      <TableCell className="text-left capitalize">
        <ImageWithModal src={item?.backgroundImage} title="Background" width={250} height={250} className="h-11 w-20" />
      </TableCell>

      {/* <TableCell className="text-left">{item?.order || 'N/A'}</TableCell> */}

      <TableCell className="text-left">{item?.entryPoints || 'N/A'}</TableCell>

      <TableCell className="text-left">{item?.retainPoints || 'N/A'}</TableCell>

      <TableCell className="text-left">{fDate(item?.updatedAt, formatStr.paramCase.date)}</TableCell>

      <TableCell className="text-left">
        <CustomBadge variant={getStatusVariant(item?.status)}>{item?.status}</CustomBadge>
      </TableCell>

      <TableCell className="text-end">
        <div className="flex gap-2">
          <button
            title="View Venue"
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handleEdit?.(item?._id);
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
    </TableRow>
  );
};
export default StatusTableRow;
