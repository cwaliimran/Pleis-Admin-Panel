'use client';

import { TableCell, TableRow } from '@/components/ui/table';
import { Pencil, Trash2 } from 'lucide-react';
import { FC } from 'react';

interface PageProps {
  item: {
    id: string;
    purchases: string;
    rewardRedemptions: string;
    challengeCompletions: string;
    points: string;
    streakRewards: string;
    manualPointGifts: string;
    pointExpirations: string;
    referrals: string;
    transactionType: string;
  };
  handleDelete?: (id: string) => void;
  handleEdit?: (id: string) => void;
}

const TransactionsTableRow: FC<PageProps> = ({
  item,
  handleDelete,
  handleEdit,
}) => {
  // Determine if points are positive or negative for styling
  const isPositive = item.points.startsWith('+');
  const isNegative = item.points.startsWith('-');

  // Status styling
  const getStatusStyle = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'expired':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  return (
    <TableRow className="h-14 w-full transition-colors">
      <TableCell className="text-left">{item.purchases}</TableCell>
      <TableCell className="text-left">{item.rewardRedemptions}</TableCell>
      <TableCell className="text-left">{item.challengeCompletions}</TableCell>
      <TableCell className="text-left">
        <span
          className={`font-semibold ${
            isPositive
              ? 'text-green-600 dark:text-green-400'
              : isNegative
                ? 'text-red-600 dark:text-red-400'
                : 'text-gray-600 dark:text-gray-400'
          }`}
        >
          {item.points}
        </span>
      </TableCell>
      <TableCell className="text-left">{item.streakRewards}</TableCell>
      <TableCell className="text-left">{item.manualPointGifts}</TableCell>
      <TableCell className="text-left"><span className="text-red-600">{item.pointExpirations}</span></TableCell>
      <TableCell className="text-left">{item.referrals}</TableCell>

      {/* Action menu */}
      <TableCell className="text-end">
        <div className="flex gap-2">
          <button
            type="button"
            title="Edit Transaction"
            // onClick={(e) => {
            //   e.stopPropagation();
            //   handleEdit?.(item.id);
            // }}
            className="cursor-pointer rounded-md bg-gray-100 p-1.5 transition hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700"
          >
            <Pencil className="h-4 w-4 text-gray-700 dark:text-gray-200" />
          </button>

          <button
            type="button"
            title="Delete Transaction"
            onClick={(e) => {
              e.stopPropagation();
              handleDelete?.(item.id);
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

export default TransactionsTableRow;
