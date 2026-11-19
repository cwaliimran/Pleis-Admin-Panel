'use client';

import { TableCell, TableRow } from '@/components/ui/table';
import { cn } from '@/lib/utils';
import { Ban, Check, Pencil, UserCheck, UserX, X } from 'lucide-react';
import React from 'react';
import { CONDITION_TYPE_LABELS, isOpenStatus, PAYMENT_CONFIG, RESERVATION_STATUS_CONFIG } from './constants';
import { Reservation, ReservationStatus } from './types';

interface ReservationListRowProps {
  item: Reservation;
  disabled?: boolean;
  onEdit: (item: Reservation) => void;
  onSetStatus: (item: Reservation, status: ReservationStatus) => void;
}

const toDisplayDate = (value?: string): string => {
  const match = value?.match(/^(\d{4})-(\d{2})-(\d{2})/);
  return match ? `${match[3]}/${match[2]}/${match[1]}` : value || '';
};

const ACTION_TONES = {
  ok: 'bg-green-100 hover:bg-green-200 text-green-700 dark:bg-green-900 dark:hover:bg-green-800 dark:text-green-300',
  check: 'bg-blue-100 hover:bg-blue-200 text-blue-700 dark:bg-blue-900 dark:hover:bg-blue-800 dark:text-blue-300',
  danger: 'bg-red-100 hover:bg-red-200 text-red-600 dark:bg-red-900 dark:hover:bg-red-800 dark:text-red-300',
  neutral: 'bg-gray-100 hover:bg-gray-200 text-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700 dark:text-gray-200',
} as const;

interface ActionButtonProps {
  title: string;
  ariaLabel: string;
  tone: keyof typeof ACTION_TONES;
  icon: React.ElementType;
  disabled?: boolean;
  onClick: () => void;
}

const ActionButton: React.FC<ActionButtonProps> = ({ title, ariaLabel, tone, icon: Icon, disabled, onClick }) => (
  <button
    type="button"
    title={title}
    aria-label={ariaLabel}
    disabled={disabled}
    onClick={onClick}
    className={cn('cursor-pointer rounded-md p-1.5 transition disabled:cursor-not-allowed disabled:opacity-40', ACTION_TONES[tone])}
  >
    <Icon className="h-4 w-4" />
  </button>
);

/** Short line under the status pill, as in prototype v3.2. */
const statusNote = (item: Reservation, isMinimumSpend: boolean): string => {
  switch (item.status) {
    case 'pendingPayment':
      return 'Waiting for the guest to pay';
    case 'noShow':
      return isMinimumSpend && item.payment === 'forfeited' ? 'Marked by staff · voucher forfeited' : 'Marked by staff';
    case 'checkedIn':
      return 'Guest arrived';
    case 'confirmed':
      return item.canMarkNoShow === false && item.noShowAvailableTime ? `No-show from ${item.noShowAvailableTime}` : '';
    default:
      return '';
  }
};

export const ReservationListRow: React.FC<ReservationListRowProps> = ({ item, disabled = false, onEdit, onSetStatus }) => {
  const statusConfig = RESERVATION_STATUS_CONFIG[item.status] ?? RESERVATION_STATUS_CONFIG.completed;
  const paymentConfig = PAYMENT_CONFIG[item.payment];
  const occasionOrEvent = [item.occasion, item.eventName].filter(Boolean).join(' · ');
  const isMinimumSpend = (item.amount ?? 0) > 0;
  const conditionLabel = isMinimumSpend ? `${CONDITION_TYPE_LABELS.minimumSpend} · €${item.amount}` : CONDITION_TYPE_LABELS.free;
  const displayDate = toDisplayDate(item.date);
  const note = statusNote(item, isMinimumSpend);
  const noShowLocked = item.canMarkNoShow === false;
  const noShowTitle = noShowLocked
    ? `No-show is available ${item.noShowGraceMinutes ?? 30} min after the reservation time${
        item.noShowAvailableTime ? ` (from ${item.noShowAvailableTime})` : ''
      }`
    : 'Mark as no-show';

  return (
    <TableRow className="h-14 w-full transition-colors hover:bg-[#f5f5f5] dark:hover:bg-[#272727]/50">
      <TableCell>
        <div className="font-bold text-gray-900 dark:text-gray-100">{item.guestName}</div>

        <div className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">
          {item.time && item.endTime ? (
            <span>
              {displayDate} · {item.time} - {item.endTime}
            </span>
          ) : item.date && item.time ? (
            <span>
              {displayDate} · {item.time}
            </span>
          ) : item.date ? (
            <span>{displayDate}</span>
          ) : (
            <span>—</span>
          )}
        </div>
      </TableCell>

      <TableCell className="text-gray-700 dark:text-gray-300">{item.venueName}</TableCell>

      <TableCell className="text-gray-700 dark:text-gray-300">
        <div>{item.reservationTypeName || '—'}</div>
        <div className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">{conditionLabel}</div>
      </TableCell>

      <TableCell className="text-gray-700 dark:text-gray-300">{item.seats}</TableCell>

      <TableCell className="text-gray-700 dark:text-gray-300">{occasionOrEvent || '—'}</TableCell>

      <TableCell>
        <span className={cn('inline-flex rounded-full px-2.5 py-1 text-xs font-semibold whitespace-nowrap', statusConfig.chipClass)}>
          {statusConfig.label}
        </span>
        {note && <div className="mt-1 text-xs text-gray-500 dark:text-gray-400">{note}</div>}
      </TableCell>

      <TableCell>
        <span className={cn('text-xs font-semibold', paymentConfig.textClass)}>{paymentConfig.label}</span>
      </TableCell>

      <TableCell className="pr-4">
        <div className="flex justify-end gap-2">
          {item.status === 'needsConfirmation' && (
            <>
              <ActionButton
                title="Confirm"
                ariaLabel={`Confirm reservation for ${item.guestName}`}
                tone="ok"
                icon={Check}
                disabled={disabled}
                onClick={() => onSetStatus(item, 'confirmed')}
              />
              <ActionButton
                title="Reject"
                ariaLabel={`Reject reservation for ${item.guestName}`}
                tone="danger"
                icon={X}
                disabled={disabled}
                onClick={() => onSetStatus(item, 'rejected')}
              />
            </>
          )}

          {item.status === 'pendingPayment' && (
            <ActionButton
              title="Cancel"
              ariaLabel={`Cancel reservation for ${item.guestName}`}
              tone="danger"
              icon={Ban}
              disabled={disabled}
              onClick={() => onSetStatus(item, 'cancelled')}
            />
          )}

          {item.status === 'confirmed' && (
            <>
              <ActionButton
                title="Check in"
                ariaLabel={`Check in ${item.guestName}`}
                tone="check"
                icon={UserCheck}
                disabled={disabled}
                onClick={() => onSetStatus(item, 'checkedIn')}
              />
              <ActionButton
                title={noShowTitle}
                ariaLabel={`Mark ${item.guestName} as no-show`}
                tone="danger"
                icon={UserX}
                disabled={disabled || noShowLocked}
                onClick={() => onSetStatus(item, 'noShow')}
              />
              <ActionButton
                title="Cancel"
                ariaLabel={`Cancel reservation for ${item.guestName}`}
                tone="danger"
                icon={Ban}
                disabled={disabled}
                onClick={() => onSetStatus(item, 'cancelled')}
              />
            </>
          )}

          {isOpenStatus(item.status) && (
            <ActionButton
              title="Edit · reschedule"
              ariaLabel={`Edit reservation for ${item.guestName}`}
              tone="neutral"
              icon={Pencil}
              disabled={disabled}
              onClick={() => onEdit(item)}
            />
          )}
        </div>
      </TableCell>
    </TableRow>
  );
};
