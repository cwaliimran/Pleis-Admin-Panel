'use client';

import CustomBadge from '@/components/ui/custom-badge';
import { TableCell, TableRow } from '@/components/ui/table';
import { fDate, formatStr } from '@/utils/format-time';
import React from 'react';
import { REFERRAL_STATUS_LABELS, REFERRAL_STATUS_VARIANT } from './constants';
import { Referral } from './types';

interface ReferralsTableRowProps {
  item: Referral;
}

export const ReferralsTableRow: React.FC<ReferralsTableRowProps> = ({ item }) => {
  return (
    <TableRow className="h-14 w-full transition-colors hover:bg-[#f5f5f5] dark:hover:bg-[#272727]/50">
      <TableCell className="text-left font-medium text-gray-900 dark:text-gray-100">{item.user}</TableCell>

      <TableCell className="text-left text-gray-700 dark:text-gray-300">{item.referrer}</TableCell>

      <TableCell className="text-left text-gray-700 dark:text-gray-300">{item.refLimit.toLocaleString()}</TableCell>

      <TableCell className="text-left text-gray-700 dark:text-gray-300">{item.refCount.toLocaleString()}</TableCell>

      <TableCell className="text-left text-gray-700 dark:text-gray-300">{item.userPoints.toLocaleString()}</TableCell>

      <TableCell className="text-left text-gray-700 dark:text-gray-300">{item.referrerPoints.toLocaleString()}</TableCell>

      <TableCell className="text-left whitespace-nowrap text-gray-700 dark:text-gray-300">{fDate(item.createdAt, formatStr.split.date)}</TableCell>

      <TableCell className="text-left whitespace-nowrap text-gray-700 dark:text-gray-300">{fDate(item.expiryDate, formatStr.split.date)}</TableCell>

      <TableCell className="text-left">
        <CustomBadge variant={REFERRAL_STATUS_VARIANT[item.status]}>{REFERRAL_STATUS_LABELS[item.status]}</CustomBadge>
      </TableCell>
    </TableRow>
  );
};

export default ReferralsTableRow;
