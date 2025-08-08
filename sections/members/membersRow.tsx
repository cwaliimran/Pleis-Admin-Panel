'use client';

import { TableCell, TableRow } from '@/components/ui/table';
import { Eye } from 'lucide-react';
import { FC } from 'react';

interface Member {
  id: string;
  photo: string;
  username: string;
  currentTier: string;
  status: string;
  currentPointBalance: number;
  membershipStartDate: string;
  highestTierAchieved: string;
  referralCount: number;
  streak: number;
  totalPointsEarned: number;
  totalPointsRedeemed: number;
  averagePointsPerMonth: number;
  totalTrackedSpending: number;
  totalTransactions: number;
}

interface PageProps {
  item: Member;
  handleDelete?: (id: string) => void;
  handleEdit?: (id: string) => void;
}

const MembersTableRow: FC<PageProps> = ({ item, handleDelete, handleEdit }) => {
  return (
    <TableRow className="h-14 w-full transition-colors">
      <TableCell className="text-left">{item?.username}</TableCell>
      <TableCell className="text-left">{item?.currentTier}</TableCell>
      <TableCell className="text-left">{item?.status}</TableCell>
      <TableCell className="text-left">{item?.currentPointBalance}</TableCell>
      <TableCell className="text-left">{item?.membershipStartDate}</TableCell>
      <TableCell className="text-left">{item?.highestTierAchieved}</TableCell>
      <TableCell className="text-left">{item?.referralCount}</TableCell>
      <TableCell className="text-left">{item?.streak}</TableCell>
      <TableCell className="text-left">{item?.totalPointsEarned}</TableCell>
      <TableCell className="text-left">{item?.totalPointsRedeemed}</TableCell>
      <TableCell className="text-left">{item?.averagePointsPerMonth}</TableCell>
      <TableCell className="text-left">{item?.totalTrackedSpending}</TableCell>
      <TableCell className="text-left">{item?.totalTransactions}</TableCell>

      {/* Action menu */}
      <TableCell className="text-end">
        <div className="flex gap-2">
          <button
            type="button"
            title="Edit Member"
            onClick={(e) => {
              e.stopPropagation();
              handleEdit?.(item.id);
            }}
            className="cursor-pointer rounded-md bg-gray-100 p-1.5 transition hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700"
          >
            <Eye className="h-4 w-4 text-gray-700 dark:text-gray-200" />
          </button>
          {/* <button
            type="button"
            title="Delete Member"
            onClick={(e) => {
              e.stopPropagation();
              handleDelete?.(item.id);
            }}
            className="cursor-pointer rounded-md bg-red-100 p-1.5 transition hover:bg-red-200 dark:bg-red-900 dark:hover:bg-red-800"
          >
            <Trash2 className="h-4 w-4 text-red-600 dark:text-red-300" />
          </button> */}
        </div>
      </TableCell>
    </TableRow>
  );
};

export default MembersTableRow;
