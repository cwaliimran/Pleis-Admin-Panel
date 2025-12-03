'use client';

import CustomBadge from '@/components/ui/custom-badge';
import { TableCell, TableRow } from '@/components/ui/table';
import { fDate, formatStr } from '@/utils/format-time';
import { getStatusVariant } from '@/utils/short-utils';
import { Pencil, Trash2 } from 'lucide-react';
import { FC } from 'react';
import { MODULE_NAMES } from '../constants';
import { TableRowProps } from './types';

const SubscriptionTableRow: FC<TableRowProps> = ({ item, handleDelete, handleEdit }) => {
  return (
    <TableRow className="h-16 w-full transition-colors hover:bg-[#f5f5f5] dark:hover:bg-[#272727]/50">
      {/* Organizer */}
      <TableCell>
        <span className="font-medium text-gray-900 dark:text-gray-100">{item?.organizer || '-'}</span>
      </TableCell>

      {/* Modules */}
      <TableCell className="text-left">
        <div className="flex flex-wrap gap-1">
          {item?.modules?.map((module: any) => (
            <span key={module} className="rounded bg-blue-100 px-2 py-1 text-xs font-medium text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
              {MODULE_NAMES[module as keyof typeof MODULE_NAMES]}
            </span>
          ))}
        </div>
      </TableCell>

      {/* Organizations */}
      <TableCell className="text-sm text-gray-900 dark:text-gray-100">{item?.organizations ?? '-'}</TableCell>

      {/* Billing */}
      <TableCell>
        <span
          className={`rounded px-2 py-1 text-xs font-medium ${
            item?.billing === 'yearly'
              ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
              : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300'
          }`}
        >
          {item?.billing === 'yearly' ? 'Yearly' : 'Monthly'}
        </span>
      </TableCell>

      {/* Period */}
      <TableCell className="text-sm text-gray-600 dark:text-gray-400">
        <div>{fDate(item?.startDate, formatStr.paramCase.date)}</div>
        <div className="text-xs text-gray-500 dark:text-gray-500">to {fDate(item?.endDate, formatStr.paramCase.date)}</div>
      </TableCell>

      {/* Price */}
      <TableCell>
        <div className="font-medium text-gray-900 dark:text-gray-100">€{item?.monthlyPrice}</div>
        <div className="text-xs text-gray-500 dark:text-gray-500">/month</div>
      </TableCell>

      <TableCell className="text-left">
        <CustomBadge variant={getStatusVariant(item?.status)}>{item?.status}</CustomBadge>
      </TableCell>

      <TableCell className="text-end">
        <div className="flex gap-2">
          <button
            title="View Venue"
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handleEdit?.(item?.id);
            }}
            className="cursor-pointer rounded-md bg-gray-100 p-1.5 transition hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700"
          >
            <Pencil className="h-4 w-4 text-gray-700 dark:text-gray-200" />
          </button>

          <button
            title="View Venue"
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handleDelete?.(item?.id);
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

export default SubscriptionTableRow;
