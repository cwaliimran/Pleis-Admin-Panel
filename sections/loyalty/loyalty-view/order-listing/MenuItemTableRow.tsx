// components/tables/MenuItemTableRow.tsx
import { TableCell, TableRow } from '@/components/ui/table';
import { Ellipsis } from 'lucide-react';
import React, { FC } from 'react';

interface MenuItem {
  item: string;
  category: string;
  salesCount: number;
  totalRevenue: string;
  refunds: number;
  status: string;
}

const MenuItemTableRow: FC<{ item: MenuItem }> = ({ item }) => {
  const getStatusClasses = (status: string) => {
    switch (status) {
      case 'Available':
        return 'bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-400';
      case 'Low Stock':
        return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/50 dark:text-yellow-400';
      case 'Unavailable':
        return 'bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-400';
      default:
        return 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400';
    }
  };

  return (
    <TableRow className="h-14">
      {/* Menu Item */}
      <TableCell className="font-semibold">{item.item}</TableCell>

      {/* Category */}
      <TableCell className="text-start">{item.category}</TableCell>

      {/* Sales Count */}
      <TableCell className="text-start">{item.salesCount}</TableCell>

      {/* Total Revenue */}
      <TableCell className="text-start font-semibold">{item.totalRevenue}</TableCell>

      {/* Refunds */}
      <TableCell className="text-start">{item.refunds}</TableCell>

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

export default MenuItemTableRow;
