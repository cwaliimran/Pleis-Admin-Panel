'use client';

import { TableCell, TableRow } from '@/components/ui/table';
import { FC } from 'react';
import { TableRowProps } from './types';
import { Avatar, AvatarImage } from '@/components/ui/avatar';

const ReservationTransactionTableRow: FC<TableRowProps> = ({ item }) => {
  return (
    <TableRow className="h-14">
      {/* User Info */}
      <TableCell>
        <div className="flex items-center gap-3">
          <Avatar>
            <AvatarImage src={item.avatar} className="cursor-pointer" />
          </Avatar>
          <span>{item.user}</span>
        </div>
      </TableCell>

      {/* Reservation Type */}
      <TableCell className="text-start">{item.reservationType}</TableCell>

      {/* Timeslot */}
      <TableCell className="text-start">{item.timeslot}</TableCell>

      {/* Tickets */}
      <TableCell className="text-start">{item.tickets}</TableCell>

      {/* Amount */}
      <TableCell className="text-start font-semibold">{item.amount}</TableCell>

      {/* Payment Status */}
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

      {/* Confirmation */}
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
