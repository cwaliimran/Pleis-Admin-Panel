'use client';

import { TruncatedTransactionModal } from '@/components/common/transaction-id-modal';
import CustomBadge from '@/components/ui/custom-badge';
import { TableCell, TableRow } from '@/components/ui/table';
import { fDate } from '@/utils/format-time';
import { FC } from 'react';
import { TableRowProps } from './types';
import { Eye } from 'lucide-react';

const TransactionHistoryTableRow: FC<TableRowProps> = ({ handleEdit, item }) => {
  const getLabel = (type: string) => {
    switch (type) {
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
          <div>
            <p>
              {item?.user?.firstName || ''} {item?.user?.lastName || ''}
            </p>
            <p className="text-[12px] text-gray-700 dark:text-gray-400 lowercase">{item?.user?.email || 'N/A'}</p>
          </div>
        </TableCell>

        <TableCell className="text-left capitalize">{item?.organization?.name || '-'}</TableCell>

        <TableCell className="text-left capitalize">
          <TruncatedTransactionModal text={item?.transactionId || 'N/A'} maxLength={22} title="Transaction ID" />
        </TableCell>

        <TableCell className="text-left">
          <TruncatedTransactionModal text={item?.orderNumber || 'N/A'} maxLength={22} title="Order No" />
        </TableCell>

        <TableCell className="text-left capitalize">{getLabel(item?.orderType)}</TableCell>

        <TableCell className="text-center capitalize">{item?.commission ? `${item.commission} %` : 'N/A'}</TableCell>

        <TableCell className="text-left">{item?.amount ? Number(item.amount).toFixed(1) : 'N/A'}</TableCell>

        <TableCell className="text-left capitalize">{item?.paymentMethod || 'N/A'}</TableCell>

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

        <TableCell className="px-8">
          <div className="flex justify-center gap-2">
            <button
              title="View"
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleEdit?.(item);
              }}
              className="cursor-pointer rounded-md bg-gray-100 p-1.5 transition hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700"
            >
              <Eye className="h-4 w-4 text-gray-700 dark:text-gray-200" />
            </button>
          </div>
        </TableCell>
      </TableRow>
    </>
  );
};
export default TransactionHistoryTableRow;
