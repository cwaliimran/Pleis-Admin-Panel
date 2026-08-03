'use client';

import { Avatar, AvatarImage } from '@/components/ui/avatar';
import CustomBadge from '@/components/ui/custom-badge';
import { TableCell, TableRow } from '@/components/ui/table';
import { getStatusVariant } from '@/utils/short-utils';
import { BarChart3, Pencil, Trash2 } from 'lucide-react';
import React from 'react';
import { BROWSING_METRIC_CLASS, CHALLENGE_REWARD_TYPE_LABELS, CHALLENGE_STATUS_LABELS, CHALLENGE_TASK_TYPE_LABELS } from './constants';
import { Challenge } from './types';
import { formatAvgProgress } from './utils';

interface ChallengesTableRowProps {
  item: Challenge;
  disabled?: boolean;
  onViewAnalytics: (item: Challenge) => void;
  onEdit: (item: Challenge) => void;
  onDelete: (item: Challenge) => void;
}

export const ChallengesTableRow: React.FC<ChallengesTableRowProps> = ({ item, disabled = false, onViewAnalytics, onEdit, onDelete }) => {
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

      {/* Names run long; the full text stays reachable through the tooltip. */}
      <TableCell className="text-left font-medium text-gray-900 dark:text-gray-100">
        <span title={item.name} className="block max-w-[190px] truncate">
          {item.name}
        </span>
      </TableCell>

      <TableCell className="text-left text-gray-700 dark:text-gray-300">{CHALLENGE_TASK_TYPE_LABELS[item.taskType]}</TableCell>

      <TableCell className="text-left text-gray-700 dark:text-gray-300">{CHALLENGE_REWARD_TYPE_LABELS[item.rewardType]}</TableCell>

      <TableCell className="text-left">
        <CustomBadge variant={getStatusVariant(item.status)}>{CHALLENGE_STATUS_LABELS[item.status]}</CustomBadge>
      </TableCell>

      <TableCell className={`text-left ${BROWSING_METRIC_CLASS}`}>{item.views.toLocaleString()}</TableCell>

      <TableCell className={`text-left ${BROWSING_METRIC_CLASS}`}>{item.favorites.toLocaleString()}</TableCell>

      <TableCell className="text-left text-gray-700 dark:text-gray-300">{item.participants.toLocaleString()}</TableCell>

      <TableCell className="text-left text-gray-700 dark:text-gray-300">{item.completions.toLocaleString()}</TableCell>

      <TableCell className="text-left text-gray-700 dark:text-gray-300">{formatAvgProgress(item)}</TableCell>

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
            title="Edit challenge"
            aria-label={`Edit ${item.name}`}
            disabled={disabled}
            onClick={() => onEdit(item)}
            className="cursor-pointer rounded-md bg-gray-100 p-1.5 transition hover:bg-gray-200 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-gray-800 dark:hover:bg-gray-700"
          >
            <Pencil className="h-4 w-4 text-gray-700 dark:text-gray-200" />
          </button>

          <button
            type="button"
            title="Delete challenge"
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

export default ChallengesTableRow;
