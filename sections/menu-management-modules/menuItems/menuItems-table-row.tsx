'use client';

import { Avatar, AvatarImage } from '@/components/ui/avatar';
import CustomBadge from '@/components/ui/custom-badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { TableCell, TableRow } from '@/components/ui/table';
import { Pencil, Trash2 } from 'lucide-react';
import { FC } from 'react';
import { TableRowProps } from './types';
import { noImageUrl, noImageUrlDev } from '@/constant/constant';
import { capitalizeFirstLetter } from '@/utils/format-time';

const MenuItemTableRow: FC<TableRowProps> = ({ item, handleDelete, handleEdit }) => {
  return (
    <TableRow className="h-14 w-full transition-colors hover:bg-[#f5f5f5] dark:hover:bg-[#272727]/50">
      <TableCell>
        <Avatar className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-xl bg-gray-100 shadow-sm dark:bg-gray-800">
          {item?.image && item.image !== noImageUrl && item.image !== noImageUrlDev ? (
            <AvatarImage src={item?.image} alt="Store" className="h-full w-full cursor-pointer object-cover" />
          ) : (
            <span className="text-lg font-semibold text-gray-500 dark:text-gray-300">{item?.title?.[0]?.toUpperCase() || ''}</span>
          )}
        </Avatar>
      </TableCell>

      <TableCell className="text-left capitalize">{item?.title || '-'}</TableCell>

      <TableCell className="text-left">
        {item?.description.length > 22 ? (
          <Dialog>
            <DialogTrigger asChild>
              <span className="cursor-pointer hover:text-blue-600" title="Click to view full description">
                {item?.description.slice(0, 22) + '...'}
              </span>
            </DialogTrigger>
            <DialogContent aria-describedby={undefined} className="dark:bg-secondary max-w-md">
              <DialogHeader>
                <DialogTitle>Description</DialogTitle>
              </DialogHeader>
              <div className="py-4">
                <p className="text-sm leading-relaxed text-gray-700 dark:text-gray-300">{capitalizeFirstLetter(item?.description)}</p>
              </div>
            </DialogContent>
          </Dialog>
        ) : (
          capitalizeFirstLetter(item?.description || '-')
        )}
      </TableCell>

      <TableCell className="text-left capitalize">{item?.menu?.title || '-'}</TableCell>

      <TableCell className="text-left capitalize">{item?.taxPercent || '-'}%</TableCell>

      <TableCell className="text-left capitalize">{item?.type || '-'}</TableCell>

      <TableCell className="text-left capitalize">{item?.category?.title || '-'}</TableCell>

      <TableCell className="text-left">{item?.basePrice || '-'}</TableCell>

      <TableCell className="text-left">{item?.discountPrice || '-'}</TableCell>

      <TableCell className="text-left">
        <CustomBadge variant={item.status === 'active' ? 'success' : item.status === 'inactive' ? 'error' : 'info'}>{item.status}</CustomBadge>
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
export default MenuItemTableRow;
