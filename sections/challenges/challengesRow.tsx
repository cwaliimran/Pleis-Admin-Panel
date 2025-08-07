'use client';

import { TableCell, TableRow } from '@/components/ui/table';
import { Pencil, Trash2 } from 'lucide-react';
import { FC } from 'react';

interface PageProps {
  item: {
    id: string;
    name: string;
    reward: string;
    taskType: string;
    taskParameters: string;
    claimLimit: string;
    endTime: string;
    tierLimit: string;
  };
  handleDelete?: (id: string) => void;
  handleEdit?: (id: string) => void;
}

const ChallengesTableRow: FC<PageProps> = ({
  item,
  handleDelete,
  handleEdit,
}) => {
  return (
    <TableRow className="h-14 w-full transition-colors">
      <TableCell className="text-left">{item.name}</TableCell>
      <TableCell className="text-left">{item.reward}</TableCell>
      <TableCell className="text-left">{item.taskType}</TableCell>
      <TableCell className="text-left">{item.taskParameters}</TableCell>
      <TableCell className="text-left">{item.claimLimit}</TableCell>
      <TableCell className="text-left">{item.endTime}</TableCell>
      <TableCell className="text-left">{item.tierLimit}</TableCell>

      {/* Action menu */}
      <TableCell className="text-end">
        <div className="flex gap-2">
          <button
            type="button"
            title="Edit Highlight"
            onClick={(e) => {
              e.stopPropagation();
              handleEdit?.(item.id);
            }}
            className="cursor-pointer rounded-md bg-gray-100 p-1.5 transition hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700"
          >
            <Pencil className="h-4 w-4 text-gray-700 dark:text-gray-200" />
          </button>

          <button
            type="button"
            title="Delete Highlight"
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

export default ChallengesTableRow;
