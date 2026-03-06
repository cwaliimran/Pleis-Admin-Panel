'use client';

import { TruncatedTransactionModal } from '@/components/common/transaction-id-modal';
import CustomBadge from '@/components/ui/custom-badge';
import { TableCell, TableRow } from '@/components/ui/table';
import { FC } from 'react';
import { TableRowProps } from './types';
import { fDate } from '@/utils/format-time';

const ReservationTransactionTableRow: FC<TableRowProps> = ({ item }) => {
  const getLabel = (type: string) => {
    switch (type) {
      case 'earn':
        return 'Earn';
      case 'redeem':
        return 'Redeem';
      case 'adjustment':
        return 'Adjustment';
      case 'ticketingbookings':
        return 'Ticketing Bookings';
      case 'userreservations':
        return 'User Reservations';
      case 'menuorders':
        return 'Menu Orders';
      case 'tickettransfer':
        return 'Ticket Transfer';
      default:
        return '-';
    }
  };

  return (
    <>
      <TableRow className="h-14 w-full transition-colors hover:bg-[#f5f5f5] dark:hover:bg-[#272727]/50">
        <TableCell className="text-left capitalize">
          {item?.user?.firstName || ''} {item?.user?.lastName || ''}
        </TableCell>

        <TableCell className="text-left capitalize">{item?.organization?.name || 'N/A'}</TableCell>

        <TableCell className="text-left">
          <TruncatedTransactionModal text={item?.transactionId || 'N/A'} maxLength={22} title="Transaction ID" />
        </TableCell>

        <TableCell className="text-left">
          <TruncatedTransactionModal text={item?.orderNumber || 'N/A'} maxLength={22} title="Order No" />
        </TableCell>

        <TableCell className="text-left capitalize">{getLabel(item?.orderType)}</TableCell>

        <TableCell className="text-left">{item?.amount ? Number(item.amount).toFixed(1) : 'N/A'}</TableCell>

        <TableCell className="text-center capitalize">
          <CustomBadge
            variant={
              item?.paymentStatus === 'paid'
                ? 'success'
                : item?.paymentStatus === 'pending'
                  ? 'warning'
                  : item?.paymentStatus === 'failed' || item?.paymentStatus === 'refunded'
                    ? 'error'
                    : 'default'
            }
          >
            {item?.paymentStatus || 'N/A'}
          </CustomBadge>
        </TableCell>

        <TableCell className="text-left">{fDate(item?.createdAt, 'DD/MM/YYYY HH:mm')}</TableCell>
      </TableRow>
    </>
  );
};
export default ReservationTransactionTableRow;
