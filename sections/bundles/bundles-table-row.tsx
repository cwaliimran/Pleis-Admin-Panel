'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { TableCell, TableRow } from '@/components/ui/table';
import { Pencil, Trash2 } from 'lucide-react';
import { FC } from 'react';
import { TableRowProps } from './types';
import CustomBadge from '@/components/ui/custom-badge';
import { getStatusVariant } from '@/utils/short-utils';
import { fDate, formatStr } from '@/utils/format-time';

const ChallengesTableRow: FC<TableRowProps> = ({ item, handleDelete, handleEdit }) => {
  return (
    <TableRow className="h-14 w-full transition-colors hover:bg-[#f5f5f5] dark:hover:bg-[#272727]/50">
      <TableCell className="text-left">{item?.name || '-'}</TableCell>

      <TableCell className="text-left">
        {item?.description?.length > 22 ? (
          <Dialog>
            <DialogTrigger asChild>
              <span className="cursor-pointer hover:text-blue-600" title="Click to view full description">
                {item?.description?.slice(0, 22) + '...'}
              </span>
            </DialogTrigger>
            <DialogContent aria-describedby={undefined} className="dark:bg-secondary max-w-md">
              <DialogHeader>
                <DialogTitle>Description</DialogTitle>
              </DialogHeader>
              <div className="py-4">
                <p className="text-sm leading-relaxed text-gray-700 dark:text-gray-300">{item.description}</p>
              </div>
            </DialogContent>
          </Dialog>
        ) : (
          item?.description
        )}
      </TableCell>

      <TableCell className="text-left">
        <div className="space-y-1 text-sm capitalize">
          {/* Ticketings */}
          {Array.isArray(item?.bundleDetails?.ticketings) && item.bundleDetails.ticketings.length > 0 && (
            <div>
              🎫 {item.bundleDetails.ticketings.length} ticket
              {item.bundleDetails.ticketings.length > 1 ? 's' : ''}
            </div>
          )}

          {/* Reservations */}
          {Array.isArray(item?.bundleDetails?.reservations) && item.bundleDetails.reservations.length > 0 && (
            <div>
              🪑 {item.bundleDetails.reservations.length} reservation
              {item.bundleDetails.reservations.length > 1 ? 's' : ''}
            </div>
          )}

          {/* Preorders */}
          {Array.isArray(item?.bundleDetails?.preOrderItems) && item.bundleDetails.preOrderItems.length > 0 && (
            <div>
              🍽️ {item.bundleDetails.preOrderItems.length} preorder
              {item.bundleDetails.preOrderItems.length > 1 ? 's' : ''}
            </div>
          )}
        </div>
      </TableCell>

      <TableCell className="text-left">€{item?.originalPrice || '-'}</TableCell>

      <TableCell className="text-left">€{item?.discountedPrice || '-'}</TableCell>

      <TableCell className="text-left">{item?.discountPercentage || '-'}%</TableCell>

      <TableCell className="text-left">{fDate(item?.createdAt, formatStr.paramCase.date)}</TableCell>

      <TableCell className="text-left">
        <CustomBadge variant={getStatusVariant(item?.status)}>{item?.status}</CustomBadge>
      </TableCell>

      <TableCell className="text-end">
        <div className="flex gap-2">
          <button
            title="Edit Challenge"
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
            title="View Challenge"
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
export default ChallengesTableRow;
