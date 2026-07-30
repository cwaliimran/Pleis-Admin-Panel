'use client';

import { cn } from '@/lib/utils';
import React from 'react';
import { CAPACITY_CONFIG, CAPACITY_LEGEND, SLOT_WINDOW_LABEL, getCapacityLevel } from './constants';
import { SectionCard } from './section-card';
import { SlotSummary } from './types';

interface TimeSlotsSectionProps {
  slots: SlotSummary[];
  /** `null` means no slot filter is applied. */
  selectedSlot: string | null;
  onSelectSlot: (slot: string | null) => void;
}

export const TimeSlotsSection: React.FC<TimeSlotsSectionProps> = ({ slots, selectedSlot, onSelectSlot }) => {
  return (
    <SectionCard title="Time slots" caption={SLOT_WINDOW_LABEL}>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-6 xl:grid-cols-12">
        {slots.map((slot) => {
          const level = getCapacityLevel(slot.bookedSeats, slot.capacity);
          const isSelected = selectedSlot === slot.time;

          return (
            <button
              key={slot.time}
              type="button"
              aria-pressed={isSelected}
              // Clicking the active slot clears the filter rather than doing nothing.
              onClick={() => onSelectSlot(isSelected ? null : slot.time)}
              className={cn(
                'flex cursor-pointer flex-col items-center gap-0.5 rounded-xl border px-2 py-3 transition-colors',
                CAPACITY_CONFIG[level].chipClass,
                isSelected && 'ring-2 ring-blue-600 ring-offset-1 dark:ring-offset-[#222121]'
              )}
            >
              <span className="text-sm font-bold">{slot.time}</span>
              <span className="text-xs font-medium">{slot.bookedSeats > 0 ? `${slot.bookedSeats} / ${slot.capacity}` : 'No res.'}</span>
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
    </SectionCard>
  );
};
