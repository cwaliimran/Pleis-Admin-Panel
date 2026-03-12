'use client';

import CustomBadge from '@/components/ui/custom-badge';
import { TableCell, TableRow } from '@/components/ui/table';
import { fDate } from '@/utils/format-time';
import { List, Pencil, Trash2 } from 'lucide-react';
import { FC } from 'react';
import { TableRowProps } from './types';

const GiveawaysTableRow: FC<TableRowProps> = ({ item, handleDelete, handleEdit, handleOpenWinners }) => {
  const getGiveawayStatusVariant = (status: string) => {
    switch (status) {
      case 'upcoming':
        return 'info';
      case 'live':
        return 'success';
      case 'ended':
        return 'error';
      case 'completed':
        return 'default';
      default:
        return 'info';
    }
  };

  return (
    <TableRow className="h-14 w-full transition-colors hover:bg-[#f5f5f5] dark:hover:bg-[#272727]/50">
      <TableCell className="text-left capitalize">{item?.title || '-'}</TableCell>

      <TableCell className="w-30 text-center capitalize">{item?.numberOfWinners}</TableCell>

      <TableCell className="w-40 text-center capitalize">{item?.ticketsPerWinner}</TableCell>

      <TableCell className="text-left capitalize">{item?.eventTitle}</TableCell>

      <TableCell className="text-left capitalize">{item?.ticketTitle}</TableCell>

      <TableCell className="text-left capitalize">{item?.totalParticipants}</TableCell>

      <TableCell className="text-left">{fDate(item?.startDateTime, 'DD/MM/YYYY HH:mm')}</TableCell>

      <TableCell className="text-left">{fDate(item?.endDateTime, 'DD/MM/YYYY HH:mm')}</TableCell>

      <TableCell className="text-left">
        <CustomBadge variant={item.status === 'active' ? 'success' : item.status === 'inactive' ? 'error' : 'info'}>{item.status}</CustomBadge>
      </TableCell>

      <TableCell className="text-left">
        <CustomBadge variant={getGiveawayStatusVariant(item?.giveawayStatus)}>{item?.giveawayStatus}</CustomBadge>
      </TableCell>

      <TableCell className="text-end">
        <div className="flex gap-2">
          <button
            title="View Details"
            type="button"
            // disabled={item.giveawayStatus === 'live' || item.giveawayStatus === 'upcoming'}
            onClick={(e) => {
              e.stopPropagation();
              handleOpenWinners?.(item?._id);
            }}
            className="cursor-pointer rounded-md bg-gray-100 p-1.5 transition hover:bg-gray-200 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-gray-800 dark:hover:bg-gray-700"
          >
            <List className="h-4 w-4 text-gray-700 dark:text-gray-200" />
          </button>

          <button
            title="Edit Promo Code"
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
            title="Delete Promo Code"
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
export default GiveawaysTableRow;
