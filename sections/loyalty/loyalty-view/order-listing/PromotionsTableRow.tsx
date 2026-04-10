import { TableCell, TableRow } from '@/components/ui/table';
import React, { FC } from 'react';

const getStatusClasses = (status: string) => {
  switch (status?.toLowerCase()) {
    case 'active':
      return 'bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-400';
    case 'inactive':
    case 'expired':
      return 'bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-400';
    default:
      return 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400';
  }
};

const formatPromotionType = (type: string) => {
  switch (type) {
    case 'globalHappyHourPromotion': return 'Happy Hour';
    case 'globalClaimPromotion': return 'Claim';
    default: return type || '-';
  }
};

const formatDate = (dateStr: string) => {
  if (!dateStr) return '-';
  return new Date(dateStr).toLocaleString('en-GB', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });
};

const PromotionsTableRow: FC<{ item: any }> = ({ item }) => {
  return (
    <TableRow className="h-14">
      <TableCell className="font-semibold">{item.title || '-'}</TableCell>
      <TableCell className="text-start">{formatPromotionType(item.promotionType)}</TableCell>
      <TableCell className="text-start">
        {item.pointsMultiplier ? `${item.pointsMultiplier}x Points` : '-'}
      </TableCell>
      <TableCell className="text-start">{formatDate(item.startDate)}</TableCell>
      <TableCell className="text-start">{formatDate(item.endDate)}</TableCell>
      <TableCell className="text-start">
        <span className={`rounded-full px-2 py-1 text-xs font-medium ${getStatusClasses(item.status)}`}>
          {item.status || '-'}
        </span>
      </TableCell>
    </TableRow>
  );
};

export default PromotionsTableRow;
