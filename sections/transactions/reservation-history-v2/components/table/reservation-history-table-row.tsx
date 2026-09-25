'use client';

import { TableCell, TableRow } from '@/components/ui/table';
import { Eye } from 'lucide-react';
import { FC } from 'react';
import { Reservation } from '../../types/types';
import { ConditionCell, StatusCell, VoucherCell } from './cell-parts';

interface ReservationHistoryTableRowProps {
  item: Reservation;
  onView: (item: Reservation) => void;
}

const ReservationHistoryTableRow: FC<ReservationHistoryTableRowProps> = ({ item, onView }) => (
  <TableRow className="h-14 w-full transition-colors hover:bg-[#f5f5f5] dark:hover:bg-[#272727]/50">
    <TableCell className="text-left">
      <p className="font-medium">{item.reservationId}</p>
      <p className="text-xs text-gray-500 dark:text-gray-400">
        {item.guestName} · {item.action}
      </p>
    </TableCell>

    <TableCell className="max-w-40 text-left whitespace-normal">
      <p className="font-medium">{item.organization}</p>
      <p className="text-xs text-gray-500 dark:text-gray-400">{item.slotNote}</p>
    </TableCell>

    <TableCell className="text-left">
      <p className="font-medium">{item.guests}</p>
      {item.table && <p className="text-xs text-gray-500 dark:text-gray-400">Table {item.table}</p>}
    </TableCell>

    <TableCell className="text-left">
      <ConditionCell condition={item.condition} />
    </TableCell>

    <TableCell className="max-w-52 text-left whitespace-normal">
      <VoucherCell voucher={item.voucher} />
    </TableCell>

    <TableCell className="max-w-45 text-left whitespace-normal">
      <StatusCell status={item.status} />
      {item.statusNote && <p className="text-xs text-gray-500 dark:text-gray-400">{item.statusNote}</p>}
    </TableCell>

    <TableCell className="max-w-45 text-left whitespace-normal">
      <p className="font-medium">{item.staffLabel}</p>
      {item.staffVia && <p className="text-xs text-gray-500 dark:text-gray-400">{item.staffVia}</p>}
      {item.guestCodesNote && <p className="text-xs text-gray-500 dark:text-gray-400">{item.guestCodesNote}</p>}
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

export default ReservationHistoryTableRow;
