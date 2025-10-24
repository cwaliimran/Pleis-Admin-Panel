'use client';

import { Avatar, AvatarImage } from '@/components/ui/avatar';
import { TableCell, TableRow } from '@/components/ui/table';
import { FC } from 'react';
import { TableRowProps } from './types';

const ReservationTransactionTableRow: FC<TableRowProps> = ({ item }) => {
  return (
    <TableRow className="h-14">
      <TableCell>
        <div className="flex items-center gap-3">
          <Avatar>
            <AvatarImage src={item.avatar} className="cursor-pointer" />
          </Avatar>
          <span>{item.user}</span>
        </div>
      </TableCell>

      <TableCell className="text-start">{item.reservationType}</TableCell>
      <TableCell className="text-start">{item.timeslot}</TableCell>
      <TableCell className="text-start">{item.tickets}</TableCell>
      <TableCell className="text-start">{item.amount}</TableCell>

      <TableCell className="text-start">
        <span
          className={`rounded-full px-2 py-1 text-xs font-medium ${
            item.paymentStatus === 'Paid'
              ? 'bg-green-100 text-green-700'
              : item.paymentStatus === 'Pending'
                ? 'bg-yellow-100 text-yellow-700'
                : 'bg-gray-100 text-gray-700'
          }`}
        >
          {item.paymentStatus}
        </span>
      </TableCell>

      <TableCell className="text-start">
        <span
          className={`rounded-full px-2 py-1 text-xs font-medium ${
            item.confirmation === 'Confirmed' ||
            item.confirmation === 'Completed'
              ? 'bg-blue-100 text-blue-700'
              : item.confirmation === 'Awaiting'
                ? 'bg-orange-100 text-orange-700'
                : 'bg-gray-100 text-gray-700'
          }`}
        >
          {item.confirmation}
        </span>
      </TableCell>

      {/* Actions */}
      {/* <TableCell className="text-end">
        <Ellipsis
          className="cursor-pointer text-gray-500 hover:text-gray-700"
          onClick={(e) => e.stopPropagation()}
        />
      </TableCell> */}
    </TableRow>
  );
};

export default ReservationTransactionTableRow;
