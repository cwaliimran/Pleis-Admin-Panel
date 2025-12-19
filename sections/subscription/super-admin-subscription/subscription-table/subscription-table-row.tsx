'use client';

import CustomBadge from '@/components/ui/custom-badge';
import { TableCell, TableRow } from '@/components/ui/table';
import { fDate, formatStr } from '@/utils/format-time';
import { getStatusVariant } from '@/utils/short-utils';
import { Pencil } from 'lucide-react';
import { FC } from 'react';
import { TableRowProps } from './types';

const SubscriptionTableRow: FC<TableRowProps> = ({ item, handleEdit }) => {
  const isFreeSubscription = item?.subscription?.subscriptionTypes?.includes('free');

  return (
    <TableRow className="h-16 w-full transition-colors hover:bg-[#f5f5f5] dark:hover:bg-[#272727]/50">
      <TableCell>
        <span className="font-medium text-gray-900 dark:text-gray-100">
          {item?.firstName} {item?.lastName}
        </span>
      </TableCell>

      <TableCell className="text-left">
        {isFreeSubscription ? (
          <span className="text-sm text-gray-500 dark:text-gray-400">-</span>
        ) : (
          <div className="flex flex-wrap gap-1">
            {item?.subscription?.subscriptionTypes?.map((module: any) => (
              <span
                key={module}
                className="rounded bg-blue-100 px-2 py-1 text-xs font-medium text-blue-700 capitalize dark:bg-blue-900/30 dark:text-blue-400"
              >
                {module}
              </span>
            ))}
          </div>
        )}
      </TableCell>

      <TableCell className="text-sm text-gray-900 dark:text-gray-100">
        {isFreeSubscription ? '1' : item?.subscription?.numberOfOrganizations || 'N/A'}
      </TableCell>

      <TableCell className="text-sm text-gray-900 dark:text-gray-100">
        <CustomBadge variant={isFreeSubscription ? 'info' : 'success'}>{isFreeSubscription ? 'Free' : 'Paid'}</CustomBadge>
      </TableCell>

      <TableCell>
        {isFreeSubscription ? (
          <span className="text-sm text-gray-500 dark:text-gray-400">-</span>
        ) : (
          <span
            className={`rounded px-2 py-1 text-xs font-medium capitalize ${
              item?.subscription?.pricingPlan === 'yearly'
                ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300'
            }`}
          >
            {item?.subscription?.pricingPlan || 'N/A'}
          </span>
        )}
      </TableCell>

      <TableCell className="text-sm text-gray-600 dark:text-gray-400">
        {isFreeSubscription ? (
          <span className="text-sm text-gray-500 dark:text-gray-400">-</span>
        ) : (
          <>
            <div>{fDate(item?.subscription?.startDate, formatStr.paramCase.date)}</div>
            <div className="text-xs text-gray-500 dark:text-gray-500">to {fDate(item?.subscription?.endDate, formatStr.paramCase.date)}</div>
          </>
        )}
      </TableCell>

      <TableCell>
        {isFreeSubscription ? (
          <span className="text-sm text-gray-500 dark:text-gray-400">-</span>
        ) : (
          <>
            <div className="font-medium text-gray-900 dark:text-gray-100">€{item?.subscription?.monthlyPrice}</div>
            <div className="text-xs text-gray-500 dark:text-gray-500">/month</div>
          </>
        )}
      </TableCell>

      <TableCell className="text-left">
        <CustomBadge variant={getStatusVariant(item?.subscription?.status)}>{item?.subscription?.status}</CustomBadge>
      </TableCell>

      <TableCell className="text-center">
        <button
          title="Edit User Sub"
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            handleEdit?.(item);
          }}
          className="cursor-pointer rounded-md bg-gray-100 p-1.5 transition hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700"
        >
          <Pencil className="h-4 w-4 text-gray-700 dark:text-gray-200" />
        </button>

        {/* <button
            title="Delete User Sub"
            type="button"
            disabled={item?.subscription?.status === 'cancelled'}
            onClick={(e) => {
              e.stopPropagation();
              handleDelete?.(item?.userId);
            }}
            className={`cursor-pointer rounded-md bg-red-100 p-1.5 transition hover:bg-red-200 dark:bg-red-900 dark:hover:bg-red-800 ${
              item?.subscription?.status === 'cancelled' ? 'cursor-not-allowed opacity-50' : ''
            }`}
          >
            <Trash2 className="h-4 w-4 text-red-600 dark:text-red-300" />
          </button> */}
      </TableCell>
    </TableRow>
  );
};

export default SubscriptionTableRow;
