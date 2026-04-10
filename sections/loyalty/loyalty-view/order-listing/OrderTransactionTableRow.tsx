import { Avatar, AvatarImage } from '@/components/ui/avatar';
import { TableCell, TableRow } from '@/components/ui/table';
import React, { FC } from 'react';

interface TransactionItem {
  user: string;
  avatar: string;
  orderTime: string;
  paymentStatus: string;
  paymentMethod: string;
  totalAmount: string;
  orderStatus: string;
  paidAt: string;
}

const getStatusClasses = (status: string) => {
  switch (status?.toLowerCase()) {
    case 'paid':
    case 'completed':
      return 'bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-400';
    case 'pending':
    case 'processing':
    case 'pendingpayment':
      return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/50 dark:text-yellow-400';
    case 'refunded':
    case 'canceled':
    case 'cancelled':
      return 'bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-400';
    default:
      return 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400';
  }
};

const OrderTransactionTableRow: FC<{ item: TransactionItem }> = ({ item }) => {
  return (
    <TableRow className="h-14">
      {/* Customer */}
      <TableCell>
        <div className="flex items-center gap-3">
          <Avatar>
            <AvatarImage src={item.avatar || undefined} className="cursor-pointer" />
          </Avatar>
          <span>{item.user}</span>
        </div>
      </TableCell>

      {/* Time */}
      <TableCell className="text-start">{item.orderTime}</TableCell>


      {/* Payment Status */}
      <TableCell className="text-start">
        <span className={`rounded-full px-2 py-1 text-xs font-medium ${getStatusClasses(item.paymentStatus)}`}>
          {item.paymentStatus}
        </span>
      </TableCell>

      {/* Payment Method */}
      <TableCell className="text-start">{item.paymentMethod}</TableCell>

      {/* Total Amount */}
      <TableCell className="text-start font-semibold">{item.totalAmount}</TableCell>

      {/* Order Status */}
      <TableCell className="text-start">
        <span className={`rounded-full px-2 py-1 text-xs font-medium ${getStatusClasses(item.orderStatus)}`}>
          {item.orderStatus}
        </span>
      </TableCell>

      {/* Paid At */}
      <TableCell className="text-start text-sm text-gray-400">{item.paidAt}</TableCell>

    </TableRow>
  );
};

export default OrderTransactionTableRow;