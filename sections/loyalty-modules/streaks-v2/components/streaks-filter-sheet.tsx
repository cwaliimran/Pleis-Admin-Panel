'use client';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { fDate, formatStr } from '@/utils/format-time';
import { debounce } from 'lodash';
import { ChevronDownIcon, ListFilter } from 'lucide-react';
import React, { useEffect, useMemo, useState } from 'react';
import { STREAK_BADGE_OPTIONS } from '../constants';
import { StreakBadge } from '../types';

/** Radix `Select` cannot hold an empty string, so "everything" needs a token. */
const ALL = 'all';

interface StreaksFilterSheetProps {
  search: string;
  onSearchChange: (value: string) => void;
  badge: StreakBadge | '';
  onBadgeChange: (value: StreakBadge | '') => void;
  lastVisitFrom?: Date;
  onLastVisitFromChange: (value: Date | undefined) => void;
  onReset: () => void;
}

export const StreaksFilterSheet: React.FC<StreaksFilterSheetProps> = ({
  search,
  onSearchChange,
  badge,
  onBadgeChange,
  lastVisitFrom,
  onLastVisitFromChange,
  onReset,
}) => {
  const [localSearch, setLocalSearch] = useState(search);
  const [datePickerOpen, setDatePickerOpen] = useState(false);

  // Keep the input in step when the parent resets the filters.
  useEffect(() => {
    setLocalSearch(search);
  }, [search]);

  const debouncedSearch = useMemo(() => debounce((value: string) => onSearchChange(value), 400), [onSearchChange]);

  useEffect(() => () => debouncedSearch.cancel(), [debouncedSearch]);

  const hasActiveFilters = Boolean(search || badge || lastVisitFrom);

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button type="button" variant="outline" className="h-9 cursor-pointer gap-2 rounded-full px-4">
          <ListFilter className="h-4 w-4" />
          Filter
          {hasActiveFilters && <span className="bg-primary h-1.5 w-1.5 rounded-full" />}
        </Button>
      </SheetTrigger>

      <SheetContent aria-describedby={undefined} side="right" className="dark:bg-secondary p-0">
        <SheetHeader className="mb-2 border-b pb-4">
          <SheetTitle>Filters</SheetTitle>
        </SheetHeader>

        <div className="flex flex-col gap-5 px-4 py-2">
          <div className="flex flex-col gap-2">
            <label htmlFor="streaks-search" className="text-sm font-medium">
              Search by name
            </label>
            <Input
              id="streaks-search"
              placeholder="Search by username or name..."
              value={localSearch}
              onChange={(event) => {
                setLocalSearch(event.target.value);
                debouncedSearch(event.target.value);
              }}
              className="h-10 w-full"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="streaks-badge" className="text-sm font-medium">
              Badge
            </label>
            <Select value={badge || ALL} onValueChange={(value) => onBadgeChange(value === ALL ? '' : (value as StreakBadge))}>
              <SelectTrigger id="streaks-badge" className="w-full cursor-pointer">
                <SelectValue placeholder="All badges" />
              </SelectTrigger>
              <SelectContent className="dark:bg-secondary">
                <SelectItem value={ALL} className="cursor-pointer">
                  All badges
                </SelectItem>
                {STREAK_BADGE_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value} className="cursor-pointer">
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="streaks-last-visit" className="text-sm font-medium">
              Last visit (from)
            </label>
            <Popover open={datePickerOpen} onOpenChange={setDatePickerOpen}>
              <PopoverTrigger asChild>
                <Button id="streaks-last-visit" variant="outline" className="h-10 w-full cursor-pointer justify-between font-normal">
                  {lastVisitFrom ? fDate(lastVisitFrom, formatStr.split.date) : 'dd/mm/yyyy'}
                  <ChevronDownIcon className="h-4 w-4" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="dark:bg-secondary w-auto overflow-hidden p-0" align="start">
                <Calendar
                  mode="single"
                  selected={lastVisitFrom}
                  captionLayout="dropdown"
                  onSelect={(date) => {
                    onLastVisitFromChange(date);
                    setDatePickerOpen(false);
                  }}
                />
              </PopoverContent>
            </Popover>
          </div>

          {hasActiveFilters && (
            <button
              type="button"
              onClick={onReset}
              className="bg-muted text-foreground border-border hover:bg-muted/80 w-full cursor-pointer rounded-md border py-2 font-semibold transition"
            >
              Reset
            </button>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default StreaksFilterSheet;
