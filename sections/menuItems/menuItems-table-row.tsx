'use client';

import { TableCell, TableRow } from '@/components/ui/table';
import { Pencil, Trash2 } from 'lucide-react';
import { FC } from 'react';
import { TableRowProps } from './types';

import { Avatar, AvatarImage } from '@/components/ui/avatar';
import CustomBadge from '@/components/ui/custom-badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

const MenuItemTableRow: FC<TableRowProps> = ({
  item,
  handleDelete,
  handleEdit,
}) => {
  return (
    <TableRow className="h-14 w-full transition-colors hover:bg-[#f5f5f5] dark:hover:bg-[#272727]/50">
      <TableCell>
        <Avatar className="h-8 w-8">
          <AvatarImage
            src="https://github.com/shadcn.png"
            alt={item.photo}
            className="object-cover"
          />
        </Avatar>
      </TableCell>
      <TableCell className="text-left">{item.name}</TableCell>
      <TableCell className="text-left">
        {item.description.length > 22 ? (
          <Dialog>
            <DialogTrigger asChild>
              <span
                className="cursor-pointer hover:text-blue-600"
                title="Click to view full description"
              >
                {item.description.slice(0, 22) + '...'}
              </span>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Description</DialogTitle>
              </DialogHeader>
              <div className="py-4">
                <p className="text-sm leading-relaxed text-gray-700 dark:text-gray-300">
                  {item.description}
                </p>
              </div>
            </DialogContent>
          </Dialog>
        ) : (
          item.description
        )}
      </TableCell>
      <TableCell className="text-left">{item?.venue}</TableCell>
      <TableCell className="text-left">{item?.type}</TableCell>
      <TableCell className="text-left">{item?.category}</TableCell>
      <TableCell className="text-left">{item?.basePrice}</TableCell>
      <TableCell className="text-left">{item?.discountPrice}</TableCell>
      {/* Status */}
      <TableCell className="text-left">
        <CustomBadge
          variant={
            item.status === 'active'
              ? 'success'
              : item.status === 'inactive'
                ? 'error'
                : 'info'
          }
        >
          {item.status}
        </CustomBadge>
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
