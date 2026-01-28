'use client';

import CustomBadge from '@/components/ui/custom-badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { TableCell, TableRow } from '@/components/ui/table';
import { fDate, formatStr } from '@/utils/format-time';
// import { Eye } from 'lucide-react';
import { FC } from 'react';
import { TableRowProps } from './types';
import { getBadgeLabel, getBadgeVariant, getDomainType } from '../helpers';

const TransactionHistoryTableRow: FC<TableRowProps> = ({ item }) => {
  // const getLabel = (type: string) => {
  //   switch (type) {
  //     case 'eventTicketPurchase':
  //       return 'Event Ticket Purchase';
  //     case 'reservations':
  //       return 'Reservations';
  //     default:
  //       return '-';
  //   }
  // };

  return (
    <>
      <TableRow className="h-14 w-full transition-colors hover:bg-[#f5f5f5] dark:hover:bg-[#272727]/50">
        <TableCell className="text-left capitalize">{item?.organization?.basicInfo?.name || '-'}</TableCell>

        <TableCell className="text-left capitalize">
          {item?.user?.firstName || ''} {item?.user?.lastName || ''}
        </TableCell>

        <TableCell className="text-left capitalize">{item?.publicId || 'N/A'}</TableCell>

        <TableCell className="text-left capitalize">{getDomainType(item?.domainType)}</TableCell>

        <TableCell className="text-left capitalize">{item?.points?.total || 'N/A'}</TableCell>

        <TableCell className="text-left capitalize">{item?.points?.percentage || 'N/A'} %</TableCell>

        <TableCell className="text-left capitalize">
          {(() => {
            const titles = item?.ticketingBookings?.map((t: any) => t?.ticket?.snapshot?.title)?.filter(Boolean) as string[] | undefined;

            const titlesString = titles?.length ? titles.join(', ') : 'N/A';

            const shouldTruncate = titlesString.length > 22;
            const displayText = shouldTruncate ? titlesString.slice(0, 22) + '...' : titlesString;

            return shouldTruncate ? (
              <Dialog>
                <DialogTrigger asChild>
                  <span className="cursor-pointer hover:text-blue-600" title="Click to view full titles">
                    {displayText}
                  </span>
                </DialogTrigger>

                <DialogContent className="dark:bg-secondary max-w-md">
                  <DialogHeader>
                    <DialogTitle>Reference</DialogTitle>
                  </DialogHeader>

                  <div className="py-4">
                    <p className="text-sm leading-relaxed text-gray-700 dark:text-gray-300">{titlesString}</p>
                  </div>
                </DialogContent>
              </Dialog>
            ) : (
              displayText
            );
          })()}
        </TableCell>

        <TableCell className="text-left">{item?.closingBalance ? `€${item.closingBalance}` : 'N/A'}</TableCell>
        <TableCell className="text-left">{fDate(item?.createdAt, formatStr.split.dateTime)}</TableCell>

        <TableCell className="text-center">
          <CustomBadge variant={getBadgeVariant(item?.type)}>{getBadgeLabel(item?.type)}</CustomBadge>
        </TableCell>

        {/* <TableCell>
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
        </TableCell> */}
      </TableRow>
    </>
  );
};
export default TransactionHistoryTableRow;
