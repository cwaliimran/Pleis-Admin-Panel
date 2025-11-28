// components/tables/PromotionListTableRow.tsx
import { TableCell, TableRow } from '@/components/ui/table';
import { Ellipsis } from 'lucide-react';
import React, { FC } from 'react';

interface PromotionItem {
  promotionName: string;
  type: string;
  discount: string;
  items: string;
  startDate: string;
  endDate: string;
  status: string;
}

const PromotionListTableRow: FC<{ item: PromotionItem }> = ({ item }) => {
  const getStatusClasses = (status: string) => {
    switch (status) {
      case 'Active':
        return 'bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-400';
      case 'Expired':
        return 'bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-400';
      default:
        return 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400';
    }
  };

  return (
    <TableRow className="h-14">
      {/* Promotion Name */}
      <TableCell className="font-semibold">{item.promotionName}</TableCell>

      {/* Type */}
      <TableCell className="text-start">{item.type}</TableCell>

      {/* Discount */}
      <TableCell className="text-primary text-start font-bold">{item.discount}</TableCell>

      {/* Items */}
      <TableCell className="text-start text-sm">{item.items}</TableCell>

      {/* Start Date */}
      <TableCell className="text-start">{item.startDate}</TableCell>

      {/* End Date */}
      <TableCell className="text-start">{item.endDate}</TableCell>

      {/* Status */}
      <TableCell className="text-start">
        <span className={`rounded-full px-2 py-1 text-xs font-medium ${getStatusClasses(item.status)}`}>{item.status}</span>
      </TableCell>

      {/* Actions */}
      <TableCell className="text-end">
        <Ellipsis className="cursor-pointer text-gray-500 hover:text-gray-700" onClick={(e) => e.stopPropagation()} />
      </TableCell>
    </TableRow>
  );
};

export default PromotionListTableRow;
