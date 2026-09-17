'use client';

import { TableCell, TableRow } from '@/components/ui/table';
import { Eye } from 'lucide-react';
import { FC } from 'react';
import { formatEuro } from '../../forms/format';
import { Ticket } from '../../types/types';
import { SettlementCell, StatusCell, TicketTypeCell } from './cell-parts';

interface TicketingHistoryTableRowProps {
  item: Ticket;
  onView: (item: Ticket) => void;
}

const TicketingHistoryTableRow: FC<TicketingHistoryTableRowProps> = ({ item, onView }) => (
  <TableRow className="h-14 w-full transition-colors hover:bg-[#f5f5f5] dark:hover:bg-[#272727]/50">
    <TableCell className="text-left">
      <p className="font-medium">{item.ticketId}</p>
      <p className="text-xs text-gray-500 dark:text-gray-400">{item.billkoItemCode || '—'}</p>
    </TableCell>

    <TableCell className="max-w-40 text-left whitespace-normal">
      <p className="font-medium">{item.eventName}</p>
      <p className="text-xs text-gray-500 dark:text-gray-400">{item.eventScheduleNote}</p>
    </TableCell>

    <TableCell className="text-left">
      <TicketTypeCell
        ticketTypeCategory={item.ticketTypeCategory}
        ticketTypeLabel={item.ticketTypeLabel}
        usageNote={item.usageNote}
        resaleProtection={item.resaleProtection}
        holderDataMissing={item.holderDataMissing}
      />
    </TableCell>

    <TableCell className="max-w-32 text-left whitespace-normal">
      <p className="capitalize">{item.action}</p>
      {item.actionNote && <p className="text-xs text-gray-500 dark:text-gray-400">{item.actionNote}</p>}
    </TableCell>

    <TableCell className="text-left">
      <StatusCell status={item.status} />
    </TableCell>

    <TableCell className="max-w-40 text-left whitespace-normal">
      <p className="font-medium">{item.owner.name}</p>
      <p className="text-xs text-gray-500 dark:text-gray-400">{item.ownerNote}</p>
    </TableCell>

    <TableCell className="text-left">
      {item.pricePaid === null ? (
        <span className="text-gray-400">— gift</span>
      ) : (
        <p className="font-medium">{formatEuro(item.pricePaid)}</p>
      )}
      {item.basePrice !== undefined && item.basePrice !== item.pricePaid && (
        <p className="text-xs text-gray-500 dark:text-gray-400">base {formatEuro(item.basePrice)}</p>
      )}
    </TableCell>

    <TableCell className="max-w-45 text-left whitespace-normal">
      <p className="font-medium">{item.scanCount}</p>
      {item.scanNote && <p className="text-xs text-gray-500 dark:text-gray-400">{item.scanNote}</p>}
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

export default TicketingHistoryTableRow;
