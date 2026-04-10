import { Avatar, AvatarImage } from '@/components/ui/avatar';
import { TableCell, TableRow } from '@/components/ui/table';
import React, { FC } from 'react';

interface PageProps {
  item: any;
  onStaffClick?: () => void;
}

const ReservationTableRow: FC<PageProps> = ({ item, onStaffClick }) => {
  const getTicketChipClass = (ticket: string) => {
    const normalizedTicket = ticket.toLowerCase();

    if (normalizedTicket === 'vip') {
      return 'bg-purple-100 text-purple-700';
    }

    if (normalizedTicket === 'general') {
      return 'bg-blue-100 text-blue-700';
    }

    if (normalizedTicket === 'premium') {
      return 'bg-amber-100 text-amber-700';
    }

    return 'bg-gray-100 text-gray-700';
  };

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
      <TableCell className="text-start">
        {Array.isArray(item.tickets) && item.tickets.length > 0 ? (
          <div className="flex flex-wrap gap-1">
            {item.tickets.map((ticket: string) => (
              <span
                key={ticket}
                className={`rounded-full px-2 py-1 text-xs font-medium ${getTicketChipClass(ticket)}`}
              >
                {ticket}
              </span>
            ))}
          </div>
        ) : (
          '-'
        )}
      </TableCell>

      {/* Amount */}
      <TableCell className="text-start font-semibold">{item.amount}</TableCell>

      {/* Payment Status */}
      <TableCell className="text-start">
        <span
          className={`rounded-full px-2 py-1 text-xs font-medium ${
             item.paymentStatus?.toLowerCase() === 'paid'
              ? 'bg-green-100 text-green-700'
              : item.paymentStatus?.toLowerCase() === 'pending'
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
            item.confirmation?.toLowerCase() === 'confirmed' || item.confirmation?.toLowerCase() === 'completed'
              ? 'bg-blue-100 text-blue-700'
              : item.confirmation?.toLowerCase() === 'awaiting'
                ? 'bg-orange-100 text-orange-700'
                : 'bg-gray-100 text-gray-700'
          }`}
        >
          {item.confirmation}
        </span>
      </TableCell>

      <TableCell className="text-start font-semibold cursor-pointer" onClick={onStaffClick}>
        <div className="flex items-center gap-1">
          <span>{item.primaryStaffName || '-'}</span>
          {item.additionalStaffCount > 0 && (
            <span className="text-blue-600 font-semibold">+{item.additionalStaffCount}</span>
          )}
        </div>
      </TableCell>
    </TableRow>
  );
};

export default ReservationTableRow;
