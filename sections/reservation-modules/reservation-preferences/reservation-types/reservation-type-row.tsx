'use client';

import CustomBadge from '@/components/ui/custom-badge';
import { TableCell, TableRow } from '@/components/ui/table';
import { Loader2, Pencil, Trash2 } from 'lucide-react';
import React from 'react';
import { CONDITION_TYPE_CONFIG, RESERVATION_TYPE_STATUS_CONFIG } from './constants';
import { ReservationType } from './types';

interface ReservationTypeRowProps {
  item: ReservationType;
  disabled?: boolean;
  isPending?: boolean;
  onEdit: (item: ReservationType) => void;
  onDelete: (item: ReservationType) => void;
}

export const ReservationTypeRow: React.FC<ReservationTypeRowProps> = ({ item, disabled = false, isPending = false, onEdit, onDelete }) => {
  const isActive = item.status === 'active';

  return (
    <TableRow className="h-14 w-full transition-colors hover:bg-[#f5f5f5] dark:hover:bg-[#272727]/50">
      <TableCell>
        <div className="font-bold text-gray-900 dark:text-gray-100">{item.name}</div>
        {item.description && <div className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">{item.description}</div>}
      </TableCell>

      <TableCell className="text-gray-700 dark:text-gray-300">{item.quantity}</TableCell>

      <TableCell className="text-gray-700 dark:text-gray-300">{item.maxCapacity}</TableCell>

      <TableCell>
        <CustomBadge variant="info" className="pointer-events-none">
          {CONDITION_TYPE_CONFIG[item.conditionType].label}
        </CustomBadge>
      </TableCell>

      <TableCell>
        <CustomBadge variant={item.asksForOccasion ? 'success' : 'error'} className="pointer-events-none">
          {item.asksForOccasion ? 'On' : 'Off'}
        </CustomBadge>
      </TableCell>

      <TableCell>
        <CustomBadge variant={isActive ? 'success' : 'error'} className="pointer-events-none">
          {RESERVATION_TYPE_STATUS_CONFIG[item.status].label}
        </CustomBadge>
      </TableCell>

      <TableCell className="pr-4">
        <div className="flex justify-center gap-2">
          <button
            type="button"
            title="Edit reservation type"
            aria-label={`Edit ${item.name}`}
            disabled={disabled}
            onClick={() => onEdit(item)}
            className="cursor-pointer rounded-md bg-gray-100 p-1.5 transition hover:bg-gray-200 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-gray-800 dark:hover:bg-gray-700"
          >
            <Pencil className="h-4 w-4 text-gray-700 dark:text-gray-200" />
          </button>

          <button
            type="button"
            title="Delete reservation type"
            aria-label={`Delete ${item.name}`}
            disabled={disabled}
            onClick={() => onDelete(item)}
            className="cursor-pointer rounded-md bg-red-100 p-1.5 transition hover:bg-red-200 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-red-900 dark:hover:bg-red-800"
          >
            {isPending ? (
              <Loader2 className="h-4 w-4 animate-spin text-red-600 dark:text-red-300" />
            ) : (
              <Trash2 className="h-4 w-4 text-red-600 dark:text-red-300" />
            )}
          </button>
        </div>
      </TableCell>
    </TableRow>
  );
};
