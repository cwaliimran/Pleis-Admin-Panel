'use client';

import { TableCell, TableRow } from '@/components/ui/table';
import { Eye } from 'lucide-react';
import { FC } from 'react';
import { LoyaltyEntry } from '../../types/types';
import { EntryTypeCell, PointsCell, RewardCell, ScopeCell } from './cell-parts';

interface LoyaltyHistoryTableRowProps {
  item: LoyaltyEntry;
  onView: (item: LoyaltyEntry) => void;
}

const LoyaltyHistoryTableRow: FC<LoyaltyHistoryTableRowProps> = ({ item, onView }) => (
  <TableRow className="h-14 w-full transition-colors hover:bg-[#f5f5f5] dark:hover:bg-[#272727]/50">
    <TableCell className="text-left">
      <ScopeCell scope={item.scope} clubName={item.clubName} />
    </TableCell>

    <TableCell className="max-w-40 text-left whitespace-normal">
      <p className="font-medium">{item.userName}</p>
      <p className="text-xs text-gray-500 dark:text-gray-400">{item.userClubTier}</p>
    </TableCell>

    <TableCell className="max-w-40 text-left whitespace-normal">
      <p className="font-mono text-xs">{item.transactionId || '—'}</p>
    </TableCell>

    <TableCell className="max-w-45 text-left whitespace-normal">
      <EntryTypeCell entryType={item.entryType} />
    </TableCell>

    <TableCell className="max-w-48 text-left whitespace-normal">
      <p className="font-medium">{item.sourceType}</p>
      <p className="text-xs text-gray-500 dark:text-gray-400">{item.sourceNote}</p>
    </TableCell>

    <TableCell className="text-left">
      <PointsCell points={item.points} note={item.pointsNote} />
    </TableCell>

    <TableCell className="text-left">
      <p className="font-medium">{item.balanceAfter}</p>
      {item.balanceNote && <p className="text-xs text-gray-500 dark:text-gray-400">{item.balanceNote}</p>}
    </TableCell>

    <TableCell className="max-w-48 text-left whitespace-normal">
      <RewardCell reward={item.reward} />
    </TableCell>

    <TableCell className="text-left">
      {item.timestamp}
      {item.expiresNote && <p className="text-xs text-gray-500 dark:text-gray-400">{item.expiresNote}</p>}
    </TableCell>

    <TableCell>
      <div className="flex items-center justify-center">
        <button
          title="View details"
          type="button"
          onClick={() => onView(item)}
          className="cursor-pointer rounded-md bg-gray-100 p-1.5 transition hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700"
        >
          <Eye className="h-4 w-4 text-gray-700 dark:text-gray-200" />
        </button>
      </div>
    </TableCell>
  </TableRow>
);

export default LoyaltyHistoryTableRow;
