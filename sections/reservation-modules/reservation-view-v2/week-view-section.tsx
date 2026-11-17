'use client';

import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { format, parseISO } from 'date-fns';
import { ChevronDown } from 'lucide-react';
import React, { useState } from 'react';
import { SectionCard } from './section-card';
import { DaySummary } from './types';

interface WeekViewSectionProps {
  days: DaySummary[];
  selectedDate: string;
  onSelectDate: (date: string) => void;
  onPickWeek: (date: Date) => void;
  isLoading?: boolean;
  disabled?: boolean;
  /** False when the day filter is cleared (all dates): no day is highlighted. */
  isDaySelected?: boolean;
  /** Dates (`yyyy-MM-dd`) with at least one reservation in Need confirmation (prototype v3.2 action dot). */
  needDates?: Set<string>;
}

/** Prototype v3.2 action dot: at least one reservation is waiting in Need confirmation. */
const ActionDot: React.FC<{ className?: string; title?: string }> = ({ className, title = 'Needs confirmation' }) => (
  <span title={title} aria-label={title} className={cn('h-2.5 w-2.5 rounded-full bg-blue-600 ring-2 ring-white dark:ring-[#1a1a1a]', className)} />
);

export const WeekViewSection: React.FC<WeekViewSectionProps> = ({
  days,
  selectedDate,
  onSelectDate,
  onPickWeek,
  isLoading = false,
  disabled = false,
  isDaySelected = true,
  needDates,
}) => {
  const [pickerOpen, setPickerOpen] = useState(false);

  // Requests outside the shown week → dot on "Pick a date"; their days get a dot in the picker.
  const shownDates = new Set(days.map((day) => day.date));
  const outsideCount = needDates ? [...needDates].filter((date) => !shownDates.has(date)).length : 0;
  const needDays = needDates ? [...needDates].map((date) => parseISO(date)) : [];

  return (
    <SectionCard title="Week view" caption="Today + 7 days" disabled={disabled}>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-8">
        {days.map((day) => {
          const date = parseISO(day.date);
          const isSelected = isDaySelected && day.date === selectedDate;

          return (
            <button
              key={day.date}
              type="button"
              aria-pressed={isSelected}
              onClick={() => onSelectDate(day.date)}
              className={cn(
                'relative flex cursor-pointer flex-col items-center gap-0.5 rounded-xl border px-3 py-3 transition-colors',
                isSelected
                  ? 'border-blue-600 bg-blue-600 text-white shadow-sm'
                  : 'border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50 dark:border-gray-700 dark:bg-[#1a1a1a] dark:hover:border-gray-600'
              )}
            >
              {needDates?.has(day.date) && (
                <ActionDot className={cn('absolute top-2 right-2', isSelected && 'bg-white ring-blue-600 dark:ring-blue-600')} />
              )}
              <span className={cn('text-[11px] font-semibold tracking-wide uppercase', isSelected ? 'text-blue-100' : 'text-gray-400')}>
                {format(date, 'EEE')}
              </span>
              <span className={cn('text-lg font-bold', isSelected ? 'text-white' : 'text-gray-900 dark:text-gray-100')}>
                {format(date, 'dd/MM')}
              </span>
              <span className={cn('text-xs', isSelected ? 'text-blue-100' : 'text-gray-500 dark:text-gray-400')}>
                {isLoading ? '—' : `${day.reservationCount} res.`}
              </span>
            </button>
          );
        })}

        <Popover open={pickerOpen} onOpenChange={setPickerOpen}>
          <PopoverTrigger asChild>
            <button
              type="button"
              className="flex cursor-pointer items-center justify-center gap-1 rounded-xl border border-dashed border-gray-300 px-3 py-3 text-sm font-semibold text-blue-600 transition-colors hover:border-blue-500 hover:bg-blue-50/50 dark:border-gray-600 dark:text-blue-400 dark:hover:bg-blue-950/20"
            >
              Pick a date
              {outsideCount > 0 && (
                <ActionDot className="ring-0" title={`${outsideCount} outside this week need confirmation`} />
              )}
              <ChevronDown className="h-3.5 w-3.5" />
            </button>
          </PopoverTrigger>
          <PopoverContent align="end" className="w-auto p-0">
            <Calendar
              mode="single"
              weekStartsOn={1}
              selected={parseISO(selectedDate)}
              modifiers={{ needsConfirmation: needDays }}
              modifiersClassNames={{
                needsConfirmation:
                  "relative after:pointer-events-none after:absolute after:bottom-0.5 after:left-1/2 after:h-1.5 after:w-1.5 after:-translate-x-1/2 after:rounded-full after:bg-blue-600 after:content-['']",
              }}
              onSelect={(date) => {
                if (!date) return;
                onPickWeek(date);
                setPickerOpen(false);
              }}
            />
          </PopoverContent>
        </Popover>
      </div>
    </SectionCard>
  );
};
