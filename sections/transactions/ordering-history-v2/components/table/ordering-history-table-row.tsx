'use client';

import { TableCell, TableRow } from '@/components/ui/table';
import { Eye } from 'lucide-react';
import { FC } from 'react';
import { formatEuro } from '../../forms/format';
import { Order } from '../../types/types';
import { OrderStatusCell, SettlementCell } from './cell-parts';

interface OrderingHistoryTableRowProps {
  item: Order;
  onView: (item: Order) => void;
}

const OrderingHistoryTableRow: FC<OrderingHistoryTableRowProps> = ({ item, onView }) => (
  <TableRow className="h-14 w-full transition-colors hover:bg-[#f5f5f5] dark:hover:bg-[#272727]/50">
    <TableCell className="text-left">
      <p className="font-medium">{item.orderReference}</p>
      <p className="text-xs text-gray-500 dark:text-gray-400">tx {item.transactionRef}</p>
    </TableCell>

    <TableCell className="max-w-40 text-left whitespace-normal">
      <p className="font-medium">{item.organization}</p>
      <p className="text-xs text-gray-500 dark:text-gray-400">
        {item.locationLabel} · {item.deliveryMethod}
      </p>
    </TableCell>

    <TableCell className="max-w-40 text-left whitespace-normal">{item.roundLabel}</TableCell>

    <TableCell className="max-w-40 text-left whitespace-normal">
      <p className="font-medium">{item.itemCount}</p>
      {item.itemsNote && <p className="text-xs text-gray-500 dark:text-gray-400">{item.itemsNote}</p>}
    </TableCell>

    <TableCell className="text-left">{item.paymentType}</TableCell>

    <TableCell className="text-left">
      <p className="font-medium">{formatEuro(item.total)}</p>
      {item.totalNote && <p className="text-xs text-gray-500 dark:text-gray-400">{item.totalNote}</p>}
    </TableCell>

    <TableCell className="text-left">
      <OrderStatusCell status={item.status} cancelReason={item.cancelReason} customerNotified={item.customerNotified} />
    </TableCell>

    <TableCell className="max-w-35 text-left whitespace-normal">
      {item.handledBy ? (
        <>
          <p className="font-medium">{item.handledBy}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400">{item.handledVia}</p>
        </>
      ) : (
        <span className="text-gray-400">—</span>
      )}
    </TableCell>

    <TableCell className="text-left">
      <SettlementCell status={item.settlementStatus} />
    </TableCell>

    <TableCell className="text-left">{item.createdAt}</TableCell>

    <TableCell>
      <div className="flex items-center justify-center">
        <button
          title="View details"
          type="button"
          onClick={() => onView(item)}
          className="cursor-pointer rounded-md bg-gray-100 p-1.5 transition hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700"
        >
          <Eye className="h-4 w-4 text-gray-700 dark:text-gray-200" />
        </button>
      </div>
    </TableCell>
  </TableRow>
);

export default OrderingHistoryTableRow;
