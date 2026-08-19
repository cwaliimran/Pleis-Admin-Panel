'use client';

import { TableCell, TableRow } from '@/components/ui/table';
import { cn } from '@/lib/utils';
import { Check, Pencil, X } from 'lucide-react';
import React from 'react';
import { RESERVATION_STATUS_CONFIG } from './constants';
import { Reservation, ReservationStatus } from './types';

interface ReservationListRowProps {
  item: Reservation;
  disabled?: boolean;
  onEdit: (item: Reservation) => void;
  onSetStatus: (item: Reservation, status: ReservationStatus) => void;
}

export const ReservationListRow: React.FC<ReservationListRowProps> = ({ item, disabled = false, onEdit, onSetStatus }) => {
  const statusConfig = RESERVATION_STATUS_CONFIG[item.status];
  const occasionOrEvent = [item.occasion, item.eventName].filter(Boolean).join(' · ');
  const confirmStatus: ReservationStatus = (item.amount ?? 0) > 0 ? 'pendingPayment' : 'confirmed';

  return (
    <TableRow className="h-14 w-full transition-colors hover:bg-[#f5f5f5] dark:hover:bg-[#272727]/50">
      <TableCell>
        <div className="font-bold text-gray-900 dark:text-gray-100">{item.guestName}</div>
        <div className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">
          {item.pleisId || item.sourceLabel || '—'} · {item.time}
        </div>
      </TableCell>

      <TableCell className="text-gray-700 dark:text-gray-300">{item.venueName}</TableCell>

      <TableCell className="text-gray-700 dark:text-gray-300">{item.reservationTypeName || '—'}</TableCell>

      <TableCell className="text-gray-700 dark:text-gray-300">{item.seats}</TableCell>

      <TableCell className="text-gray-700 dark:text-gray-300">{occasionOrEvent || '—'}</TableCell>

      <TableCell>
        <span className={cn('inline-flex rounded-full px-2.5 py-1 text-xs font-semibold', statusConfig.chipClass)}>{statusConfig.label}</span>
      </TableCell>

      <TableCell className="pr-4">
        <div className="flex justify-end gap-2">
          {item.status === 'needsConfirmation' && (
            <>
              <button
                type="button"
                title="Confirm reservation"
                aria-label={`Confirm reservation for ${item.guestName}`}
                disabled={disabled}
                onClick={() => onSetStatus(item, confirmStatus)}
                className="cursor-pointer rounded-md bg-green-100 p-1.5 transition hover:bg-green-200 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-green-900 dark:hover:bg-green-800"
              >
                <Check className="h-4 w-4 text-green-700 dark:text-green-300" />
              </button>

              <button
                type="button"
                title="Reject reservation"
                aria-label={`Reject reservation for ${item.guestName}`}
                disabled={disabled}
                onClick={() => onSetStatus(item, 'rejected')}
                className="cursor-pointer rounded-md bg-red-100 p-1.5 transition hover:bg-red-200 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-red-900 dark:hover:bg-red-800"
              >
                <X className="h-4 w-4 text-red-600 dark:text-red-300" />
              </button>
            </>
          )}

          <button
            type="button"
            title="Edit reservation"
            aria-label={`Edit reservation for ${item.guestName}`}
            disabled={disabled}
            onClick={() => onEdit(item)}
            className="cursor-pointer rounded-md bg-gray-100 p-1.5 transition hover:bg-gray-200 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-gray-800 dark:hover:bg-gray-700"
          >
            <Pencil className="h-4 w-4 text-gray-700 dark:text-gray-200" />
          </button>
        </div>
      </TableCell>
    </TableRow>
  );
};
