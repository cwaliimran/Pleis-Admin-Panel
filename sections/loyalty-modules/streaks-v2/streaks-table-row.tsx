'use client';

import { Avatar, AvatarImage } from '@/components/ui/avatar';
import { TableCell, TableRow } from '@/components/ui/table';
import { fDate } from '@/utils/format-time';
import { BarChart3 } from 'lucide-react';
import React from 'react';
import StreakBadgeLabel from './components/streak-badge-label';
import { STREAK_DATE_TIME_FORMAT } from './constants';
import { StreakMember } from './types';

interface StreaksTableRowProps {
  item: StreakMember;
  onViewDetail: (item: StreakMember) => void;
}

export const StreaksTableRow: React.FC<StreaksTableRowProps> = ({ item, onViewDetail }) => {
  return (
    <TableRow
      onClick={() => onViewDetail(item)}
      className="h-14 w-full cursor-pointer transition-colors hover:bg-[#f5f5f5] dark:hover:bg-[#272727]/50"
    >
      <TableCell>
        <Avatar className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-lg bg-gray-100 shadow-sm dark:bg-gray-800">
          {item.photo ? (
            <AvatarImage src={item.photo} alt={item.username} className="h-full w-full object-cover" />
          ) : (
            <span className="text-sm font-semibold text-gray-500 dark:text-gray-300">{item.username?.[0]?.toUpperCase() || ''}</span>
          )}
        </Avatar>
      </TableCell>

      <TableCell className="text-left font-medium text-gray-900 dark:text-gray-100">{item.username}</TableCell>

      <TableCell className="text-left text-gray-700 dark:text-gray-300">{item.name}</TableCell>

      <TableCell className="text-left text-gray-700 dark:text-gray-300">{item.streak.toLocaleString()}</TableCell>

      <TableCell className="text-left text-gray-700 dark:text-gray-300">{item.longestStreak.toLocaleString()}</TableCell>

      <TableCell className="text-left">
        <StreakBadgeLabel badge={item.highestBadge} />
      </TableCell>

      <TableCell className="text-left text-gray-700 dark:text-gray-300">{item.visits.toLocaleString()}</TableCell>

      <TableCell className="text-left whitespace-nowrap text-gray-700 dark:text-gray-300">
        {fDate(item.lastVisitAt, STREAK_DATE_TIME_FORMAT) || '—'}
      </TableCell>

      <TableCell className="text-left">
        <button
          type="button"
          title="View streak detail"
          aria-label={`View streak detail for ${item.username}`}
          onClick={(event) => {
            event.stopPropagation();
            onViewDetail(item);
          }}
          className="cursor-pointer rounded-md bg-gray-100 p-1.5 transition hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700"
        >
          <BarChart3 className="h-4 w-4 text-gray-700 dark:text-gray-200" />
        </button>
      </TableCell>
    </TableRow>
  );
};

export default StreaksTableRow;
