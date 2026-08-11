'use client';

import { cn } from '@/lib/utils';
import { CalendarX } from 'lucide-react';
import React from 'react';
import { CAPACITY_CONFIG, CAPACITY_LEGEND, SLOT_WINDOW_LABEL, getCapacityLevel } from './constants';
import { SectionCard } from './section-card';
import { SlotSummary } from './types';

interface TimeSlotsSectionProps {
  slots: SlotSummary[];
  selectedSlot: string | null;
  onSelectSlot: (slot: string | null) => void;
  isLoading?: boolean;
  isEmpty?: boolean;
  emptyMessage?: string;
}

export const TimeSlotsSection: React.FC<TimeSlotsSectionProps> = ({
  slots,
  selectedSlot,
  onSelectSlot,
  isLoading = false,
  isEmpty = false,
  emptyMessage = 'No reservations on this date',
}) => {
  const renderBody = () => {
    if (isLoading) {
      return (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-6 xl:grid-cols-12">
          {slots.map((slot) => (
            <div
              key={slot.time}
              className="h-[62px] animate-pulse rounded-xl border border-gray-200 bg-gray-100 dark:border-gray-700 dark:bg-[#1a1a1a]"
            />
          ))}
        </div>
      );
    }

    if (isEmpty) {
      return (
        <div className="flex flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-gray-200 py-14 dark:border-gray-700">
          <CalendarX className="h-8 w-8 text-gray-300 dark:text-gray-600" />
          <p className="text-sm font-semibold text-gray-600 dark:text-gray-300">{emptyMessage}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400">Pick another day from the week view above.</p>
        </div>
      );
    }

    return (
      <>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-6 xl:grid-cols-12">
          {slots.map((slot) => {
            const level = getCapacityLevel(slot.bookedSeats, slot.capacity);
            const isSelected = selectedSlot === slot.time;

            return (
              <button
                key={slot.time}
                type="button"
                aria-pressed={isSelected}
                onClick={() => onSelectSlot(isSelected ? null : slot.time)}
                className={cn(
                  'flex cursor-pointer flex-col items-center gap-0.5 rounded-xl border px-2 py-3 transition-colors',
                  CAPACITY_CONFIG[level].chipClass,
                  isSelected && 'ring-2 ring-blue-600 ring-offset-1 dark:ring-offset-[#222121]'
                )}
              >
                <span className="text-sm font-bold">{slot.time}</span>
                <span className="text-xs font-medium">
                  {slot.bookedSeats > 0 ? (slot.capacity > 0 ? `${slot.bookedSeats} / ${slot.capacity}` : `${slot.bookedSeats}`) : 'No res.'}
                </span>
              </button>
            );
          })}
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2">
          {CAPACITY_LEGEND.map((level) => (
            <span key={level} className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400">
              <span className={cn('h-2 w-2 rounded-full', CAPACITY_CONFIG[level].dotClass)} />
              {CAPACITY_CONFIG[level].label}
            </span>
          ))}
        </div>
      </>
    );
  };

  return (
    <SectionCard title="Time slots" caption={SLOT_WINDOW_LABEL}>
      {renderBody()}
    </SectionCard>
  );
};
