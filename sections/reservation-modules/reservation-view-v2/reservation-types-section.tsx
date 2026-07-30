'use client';

import { cn } from '@/lib/utils';
import React from 'react';
import { SectionCard } from './section-card';
import { TypeOccupancy } from './types';

interface ReservationTypesSectionProps {
  types: TypeOccupancy[];
  /** `null` means no type filter is applied. */
  selectedTypeId: string | null;
  onSelectType: (typeId: string | null) => void;
}

export const ReservationTypesSection: React.FC<ReservationTypesSectionProps> = ({ types, selectedTypeId, onSelectType }) => {
  return (
    <SectionCard title="Reservation types" caption="Occupancy for selected day / slot">
      {/* Fixed-width boxes rather than a stretching grid — they should not grow
          to fill the card when there are only two or three types. */}
      <div className="flex flex-wrap gap-3">
        {types.map((type) => {
          const isSelected = selectedTypeId === type.typeId;
          const ratio = type.totalSeats > 0 ? Math.min(1, type.bookedSeats / type.totalSeats) : 0;

          return (
            <button
              key={type.typeId}
              type="button"
              aria-pressed={isSelected}
              onClick={() => onSelectType(isSelected ? null : type.typeId)}
              className={cn(
                'flex w-full cursor-pointer flex-col gap-2 rounded-xl border px-4 py-3 text-left transition-colors sm:w-44',
                isSelected
                  ? 'border-blue-600 ring-1 ring-blue-600'
                  : 'border-gray-200 hover:border-gray-300 dark:border-gray-700 dark:hover:border-gray-600'
              )}
            >
              <span className="text-sm font-bold text-gray-900 dark:text-gray-100">{type.name}</span>
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {type.bookedSeats} / {type.totalSeats} seats
              </span>

              <span className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
                <span className="block h-full rounded-full bg-blue-600 transition-[width]" style={{ width: `${ratio * 100}%` }} />
              </span>
            </button>
          );
        })}
      </div>
    </SectionCard>
  );
};
