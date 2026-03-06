'use client';

import { TruncatedTextWithModal } from '@/components/common/long-text-modal';
import { Avatar, AvatarImage } from '@/components/ui/avatar';
import { TableCell, TableRow } from '@/components/ui/table';
import { noImageUrl, noImageUrlDev } from '@/constant/constant';
import { Pencil, Trash2 } from 'lucide-react';
import { FC } from 'react';
import { TableRowProps } from './types';

const RewardsTableRow: FC<TableRowProps> = ({ item, handleDelete, handleEdit }) => {
  const formatCreationMethod = (method: string) => {
    switch (method) {
      case 'buyMenuItemReward':
        return 'From Menu Items';
      case 'customReward':
        return 'Custom Reward';
      case 'ticketReward':
        return 'Ticket Reward';
      case 'globalCustomReward':
        return 'Global Custom Reward';
      case 'globalTicketReward':
        return 'Global Ticket Reward';
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
        <Avatar className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-xl bg-gray-100 shadow-sm dark:bg-gray-800">
          {item?.image && item.image !== noImageUrl && item.image !== noImageUrlDev ? (
            <AvatarImage src={item?.image} alt="Menu Item" className="h-full w-full cursor-pointer object-cover" />
          ) : (
            <span className="text-lg font-semibold text-gray-500 dark:text-gray-300">{item?.title?.[0]?.toUpperCase() || ''}</span>
          )}
        </Avatar>
      </TableCell>

      <TableCell className="text-left capitalize">{item?.title || '-'}</TableCell>

      <TableCell className="text-left capitalize">
        <TruncatedTextWithModal text={item?.description} title="Description" />
      </TableCell>

      <TableCell className="text-left capitalize">{item?.sortingType}</TableCell>

      <TableCell className="text-left">
        <span className="inline-block rounded-full bg-blue-100 px-2 py-1 text-xs font-medium text-blue-800 dark:bg-blue-900 dark:text-blue-200">
          {formatCreationMethod(item?.rewardType)}
        </span>
      </TableCell>

      <TableCell className="text-left">{item?.minPointsRequiredToClaim}</TableCell>

      <TableCell className="text-left">{formatValue(item?.claimLimit)}</TableCell>

      <TableCell className="text-left capitalize">{item.tierLimit?.title || '-'}</TableCell>

      <TableCell className="text-left">{item?.percentOff}%</TableCell>

      <TableCell className="text-left">{item?.isPromotionOnly ? 'Yes' : 'No'}</TableCell>

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
