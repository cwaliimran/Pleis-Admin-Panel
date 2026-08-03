'use client';

import { Avatar, AvatarImage } from '@/components/ui/avatar';
import CustomBadge from '@/components/ui/custom-badge';
import { TableCell, TableRow } from '@/components/ui/table';
import { cn } from '@/lib/utils';
import { getStatusVariant } from '@/utils/short-utils';
import { BarChart3, Pencil, Trash2 } from 'lucide-react';
import React from 'react';
import { BROWSING_METRIC_CLASS, REWARD_STATUS_LABELS } from './constants';
import { Reward } from './types';
import { formatMetric, getBrowsingMetric, getConversion } from './utils';

interface RewardsTableRowProps {
  item: Reward;
  disabled?: boolean;
  onViewAnalytics: (item: Reward) => void;
  onEdit: (item: Reward) => void;
  onDelete: (item: Reward) => void;
}

export const RewardsTableRow: React.FC<RewardsTableRowProps> = ({ item, disabled = false, onViewAnalytics, onEdit, onDelete }) => {
  const views = getBrowsingMetric(item, item.views);
  const favorites = getBrowsingMetric(item, item.favorites);
  const conversion = getConversion(item);

  return (
    <TableRow className="h-14 w-full transition-colors hover:bg-[#f5f5f5] dark:hover:bg-[#272727]/50">
      <TableCell>
        <Avatar className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-lg bg-gray-100 shadow-sm dark:bg-gray-800">
          {item.image ? (
            <AvatarImage src={item.image} alt={item.name} className="h-full w-full object-cover" />
          ) : (
            <span className="text-sm font-semibold text-gray-500 dark:text-gray-300">{item.name?.[0]?.toUpperCase() || ''}</span>
          )}
        </Avatar>
      </TableCell>

      <TableCell className="text-left font-medium text-gray-900 dark:text-gray-100">{item.name}</TableCell>

      <TableCell className="text-left text-gray-700 capitalize dark:text-gray-300">{item.type || '—'}</TableCell>

      <TableCell className="text-left">
        <CustomBadge variant={getStatusVariant(item.status)}>{REWARD_STATUS_LABELS[item.status]}</CustomBadge>
      </TableCell>

      <TableCell className={cn('text-left', views === null ? 'text-gray-400 dark:text-gray-500' : BROWSING_METRIC_CLASS)}>
        {formatMetric(views)}
      </TableCell>

      <TableCell className={cn('text-left', favorites === null ? 'text-gray-400 dark:text-gray-500' : BROWSING_METRIC_CLASS)}>
        {formatMetric(favorites)}
      </TableCell>

      <TableCell className="text-left text-gray-700 dark:text-gray-300">{item.claims.toLocaleString()}</TableCell>

      <TableCell className="text-left text-gray-700 dark:text-gray-300">{item.redeemed.toLocaleString()}</TableCell>

      <TableCell className={cn('text-left', conversion === null ? 'text-gray-400 dark:text-gray-500' : BROWSING_METRIC_CLASS)}>
        {formatMetric(conversion, '%')}
      </TableCell>

      <TableCell className="text-left">
        <div className="flex gap-2">
          <button
            type="button"
            title="View analytics"
            aria-label={`View analytics for ${item.name}`}
            disabled={disabled}
            onClick={() => onViewAnalytics(item)}
            className="cursor-pointer rounded-md bg-gray-100 p-1.5 transition hover:bg-gray-200 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-gray-800 dark:hover:bg-gray-700"
          >
            <BarChart3 className="h-4 w-4 text-gray-700 dark:text-gray-200" />
          </button>

          <button
            type="button"
            title="Edit reward"
            aria-label={`Edit ${item.name}`}
            disabled={disabled}
            onClick={() => onEdit(item)}
            className="cursor-pointer rounded-md bg-gray-100 p-1.5 transition hover:bg-gray-200 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-gray-800 dark:hover:bg-gray-700"
          >
            <Pencil className="h-4 w-4 text-gray-700 dark:text-gray-200" />
          </button>

          <button
            type="button"
            title="Delete reward"
            aria-label={`Delete ${item.name}`}
            disabled={disabled}
            onClick={() => onDelete(item)}
            className="cursor-pointer rounded-md bg-red-100 p-1.5 transition hover:bg-red-200 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-red-900 dark:hover:bg-red-800"
          >
            <Trash2 className="h-4 w-4 text-red-600 dark:text-red-300" />
          </button>
        </div>
      </TableCell>
    </TableRow>
  );
};

export default RewardsTableRow;
