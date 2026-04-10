// components/tables/MenuItemTableRow.tsx

import { TableCell, TableRow } from '@/components/ui/table';
import React, { FC } from 'react';

const getStatusClasses = (status: string) => {
  switch (status?.toLowerCase()) {
    case 'available':
      return 'bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-400';
    case 'low stock':
      return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/50 dark:text-yellow-400';
    case 'unavailable':
      return 'bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-400';
    default:
      return 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400';
  }
};

const MenuItemTableRow: FC<{ item: any }> = ({ item }) => {
  return (
    <TableRow className="h-14">
      <TableCell className="font-semibold">{item.itemName || '-'}</TableCell>
      <TableCell className="text-start">{item.categoryName || '-'}</TableCell>
      <TableCell className="text-start">{item.salesCount ?? '-'}</TableCell>
      <TableCell className="text-start font-semibold">
        {item.totalPrice !== undefined ? `€${item.totalPrice}` : '-'}
      </TableCell>
      <TableCell className="text-start">
        <span className={`rounded-full px-2 py-1 text-xs font-medium ${getStatusClasses(item.availabilityStatus)}`}>
          {item.availabilityStatus || '-'}
        </span>
      </TableCell>
    </TableRow>
  );
};

export default MenuItemTableRow;
