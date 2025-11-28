// components/tables/OrderTransactionTableRow.tsx
import { Avatar, AvatarImage } from '@/components/ui/avatar';
import { TableCell, TableRow } from '@/components/ui/table';
import { Ellipsis } from 'lucide-react';
import React, { FC } from 'react';

interface TransactionItem {
  user: string;
  avatar: string;
  orderTime: string;
  paymentStatus: string;
  totalAmount: string;
  orderStatus: string;
  staff: string;
}

const OrderTransactionTableRow: FC<{ item: TransactionItem }> = ({ item }) => {
  const getStatusClasses = (status: string) => {
    switch (status) {
      case 'Paid':
      case 'Completed':
        return 'bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-400';
      case 'Pending':
      case 'Processing':
        return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/50 dark:text-yellow-400';
      case 'Refunded':
      case 'Canceled':
        return 'bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-400';
      default:
        return 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400';
    }
  };

  return (
    <TableRow className="h-14">
      {/* Customer Info */}
      <TableCell>
        <div className="flex items-center gap-3">
          <Avatar>
            <AvatarImage src={item.avatar} className="cursor-pointer" />
          </Avatar>
          <span>{item.user}</span>
        </div>
      </TableCell>

      {/* Order Time */}
      <TableCell className="text-start">{item.orderTime}</TableCell>

      {/* Payment Status */}
      <TableCell className="text-start">
        <span className={`rounded-full px-2 py-1 text-xs font-medium ${getStatusClasses(item.paymentStatus)}`}>{item.paymentStatus}</span>
      </TableCell>

      {/* Total Amount */}
      <TableCell className="text-start font-semibold">{item.totalAmount}</TableCell>

      {/* Order Status */}
      <TableCell className="text-start">
        <span className={`rounded-full px-2 py-1 text-xs font-medium ${getStatusClasses(item.orderStatus)}`}>{item.orderStatus}</span>
      </TableCell>

      {/* Staff */}
      <TableCell className="text-start font-semibold">{item.staff}</TableCell>

      {/* Actions */}
      <TableCell className="text-end">
        <Ellipsis className="cursor-pointer text-gray-500 hover:text-gray-700" onClick={(e) => e.stopPropagation()} />
      </TableCell>
    </TableRow>
  );
};

export default OrderTransactionTableRow;
