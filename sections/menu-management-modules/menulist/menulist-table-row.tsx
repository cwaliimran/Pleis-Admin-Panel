'use client';

import CustomBadge from '@/components/ui/custom-badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { TableCell, TableRow } from '@/components/ui/table';
import { fDate, formatStr } from '@/utils/format-time';
import { CopyCheck, Pencil, Trash2 } from 'lucide-react';
import { FC } from 'react';
import { getOrgLabel } from './menulist-utils';
import { MenuStatus, TableRowProps } from './types';

const STATUS_BADGE_VARIANT: Record<MenuStatus, 'success' | 'error' | 'warning'> = {
  active: 'success',
  inactive: 'error',
  draft: 'warning',
};

const MenuItemTableRow: FC<TableRowProps> = ({ item, organizations, handleDelete, handleDuplicate, handleEdit }) => {
  const organizationLookup = new Map(organizations.map((org) => [org._id, org.name]));
  const organizationName = getOrgLabel(item.organization, organizationLookup);

  return (
    <TableRow className="h-14 w-full transition-colors hover:bg-[#f5f5f5] dark:hover:bg-[#272727]/50">
      <TableCell className="text-left">{item?.title || '-'}</TableCell>

      <TableCell className="text-left capitalize">
        {item.description && item.description.length > 20 ? (
          <Dialog>
            <DialogTrigger asChild>
              <span className="cursor-pointer capitalize hover:text-blue-600" title="Click to view full description">
                {item?.description.slice(0, 20) + '...'}
              </span>
            </DialogTrigger>
            <DialogContent aria-describedby={undefined} className="dark:bg-secondary max-w-md">
              <DialogHeader>
                <DialogTitle>Description</DialogTitle>
              </DialogHeader>
              <div className="py-4">
                <p className="text-sm leading-relaxed text-gray-700 capitalize dark:text-gray-300">{item?.description || '-'}</p>
              </div>
            </DialogContent>
          </Dialog>
        ) : (
          item.description || '-'
        )}
      </TableCell>

      <TableCell className="text-left capitalize">{organizationName}</TableCell>

      <TableCell className="text-left">{fDate(item?.startDate, formatStr.split.date)}</TableCell>

      <TableCell className="text-left">{fDate(item?.createdAt, formatStr.split.date)}</TableCell>

      <TableCell className="text-left">
        <CustomBadge variant={STATUS_BADGE_VARIANT[item.status]}>{item.status}</CustomBadge>
      </TableCell>

      <TableCell className="text-end">
        <div className="flex justify-center gap-2">
          <button
            title="Duplicate Menu"
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handleDuplicate?.(item?._id);
            }}
            className="cursor-pointer rounded-md bg-gray-100 p-1.5 transition hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700"
          >
            <CopyCheck className="h-4 w-4 text-gray-700 dark:text-gray-200" />
          </button>

          <button
            title="Edit Menu"
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
            title="Delete Menu"
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
