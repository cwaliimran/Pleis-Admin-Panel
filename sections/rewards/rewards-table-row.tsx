'use client';

import { Avatar, AvatarImage } from '@/components/ui/avatar';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { TableCell, TableRow } from '@/components/ui/table';
import { Pencil, Trash2 } from 'lucide-react';
import { FC } from 'react';
import { TableRowProps } from './types';

const RewardsTableRow: FC<TableRowProps> = ({
  item,
  handleDelete,
  handleEdit,
}) => {
  const formatCreationMethod = (method: string) => {
    switch (method) {
      case 'buyMenuItemReward':
        return 'From Menu Items';
      case 'customReward':
        return 'Custom Reward';
      case 'ticketReward':
        return 'Ticket Reward';
      default:
        return method;
    }
  };

  const formatValue = (value: string | number) => {
    return value === '' || value === 0 ? '-' : value;
  };

  return (
    <TableRow className="h-14 w-full transition-colors hover:bg-[#f5f5f5] dark:hover:bg-[#272727]/50">
      <TableCell>
        <Avatar className="flex h-12 w-12 items-center justify-center overflow-hidden !rounded-xl bg-gray-100 shadow-sm dark:bg-gray-800">
          {item?.mediaInfo?.url && item?.mediaInfo?.name !== 'noimage.png' ? (
            <AvatarImage
              src={item?.mediaInfo?.url}
              alt="Menu Item"
              className="h-full w-full cursor-pointer object-cover"
            />
          ) : (
            <span className="text-lg font-semibold text-gray-500 dark:text-gray-300">
              {item?.title?.[0]?.toUpperCase() || ''}
            </span>
          )}
        </Avatar>
      </TableCell>

      <TableCell className="text-left">{item?.title || '-'}</TableCell>

      <TableCell className="text-left capitalize">
        {item?.description && item?.description?.length > 22 ? (
          <Dialog>
            <DialogTrigger asChild>
              <span
                className="cursor-pointer hover:text-blue-600"
                title="Click to view full description"
              >
                {item?.description?.slice(0, 22) + '...'}
              </span>
            </DialogTrigger>
            <DialogContent
              aria-describedby={undefined}
              className="dark:bg-secondary max-w-md"
            >
              <DialogHeader>
                <DialogTitle>Description</DialogTitle>
              </DialogHeader>
              <div className="py-4">
                <p className="text-sm leading-relaxed text-gray-700 dark:text-gray-300">
                  {item?.description}
                </p>
              </div>
            </DialogContent>
          </Dialog>
        ) : (
          item?.description || '-'
        )}
      </TableCell>

      <TableCell className="text-left capitalize">
        {item?.sortingType}
      </TableCell>

      <TableCell className="text-left">
        <span className="inline-block rounded-full bg-blue-100 px-2 py-1 text-xs font-medium text-blue-800 dark:bg-blue-900 dark:text-blue-200">
          {formatCreationMethod(item?.rewardType)}
        </span>
      </TableCell>

      <TableCell className="text-left">
        {item?.minPointsRequiredToClaim}
      </TableCell>

      <TableCell className="text-left">
        {formatValue(item?.claimLimit)}
      </TableCell>

      <TableCell className="text-left capitalize">
        {formatValue(item.tierLimit)}
      </TableCell>

      <TableCell className="text-left">{item?.percentOff}%</TableCell>

      {/* Action menu */}
      <TableCell className="text-end">
        <div className="flex gap-2">
          <button
            type="button"
            title="Edit Reward"
            onClick={(e) => {
              e.stopPropagation();
              handleEdit?.(item?._id);
            }}
            className="cursor-pointer rounded-md bg-gray-100 p-1.5 transition hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700"
          >
            <Pencil className="h-4 w-4 text-gray-700 dark:text-gray-200" />
          </button>

          <button
            type="button"
            title="Delete Reward"
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
export default RewardsTableRow;
