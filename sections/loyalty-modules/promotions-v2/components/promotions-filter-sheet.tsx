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
import { PROMOTION_TYPE_OPTIONS } from '../constants';
import { PromotionType } from '../types';

const ALL = 'all';

interface DateFieldProps {
  id: string;
  label: string;
  value?: Date;
  onChange: (value: Date | undefined) => void;
}

const DateField: React.FC<DateFieldProps> = ({ id, label, value, onChange }) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className="text-sm font-medium">
        {label}
      </label>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button id={id} variant="outline" className="h-10 w-full cursor-pointer justify-between font-normal">
            {value ? fDate(value, formatStr.split.date) : 'dd/mm/yyyy'}
            <ChevronDownIcon className="h-4 w-4" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="dark:bg-secondary w-auto overflow-hidden p-0" align="start">
          <Calendar
            mode="single"
            selected={value}
            captionLayout="dropdown"
            onSelect={(date) => {
              onChange(date);
              setOpen(false);
            }}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
};

interface PromotionsFilterSheetProps {
  search: string;
  onSearchChange: (value: string) => void;
  type: PromotionType | '';
  onTypeChange: (value: PromotionType | '') => void;
  startDateFrom?: Date;
  onStartDateFromChange: (value: Date | undefined) => void;
  endDateTo?: Date;
  onEndDateToChange: (value: Date | undefined) => void;
  onReset: () => void;
}

export const PromotionsFilterSheet: React.FC<PromotionsFilterSheetProps> = ({
  search,
  onSearchChange,
  type,
  onTypeChange,
  startDateFrom,
  onStartDateFromChange,
  endDateTo,
  onEndDateToChange,
  onReset,
}) => {
  const [localSearch, setLocalSearch] = useState(search);

  useEffect(() => {
    setLocalSearch(search);
  }, [search]);

  const debouncedSearch = useMemo(() => debounce((value: string) => onSearchChange(value), 400), [onSearchChange]);

  useEffect(() => () => debouncedSearch.cancel(), [debouncedSearch]);

  const hasActiveFilters = Boolean(search || type || startDateFrom || endDateTo);

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
            <label htmlFor="promotions-search" className="text-sm font-medium">
              Search by name
            </label>
            <Input
              id="promotions-search"
              placeholder="Search promotions..."
              value={localSearch}
              onChange={(event) => {
                setLocalSearch(event.target.value);
                debouncedSearch(event.target.value);
              }}
              className="h-10 w-full"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="promotions-type" className="text-sm font-medium">
              Promotion Type
            </label>
            <Select value={type || ALL} onValueChange={(value) => onTypeChange(value === ALL ? '' : (value as PromotionType))}>
              <SelectTrigger id="promotions-type" className="w-full cursor-pointer">
                <SelectValue placeholder="All promotion types" />
              </SelectTrigger>
              <SelectContent className="dark:bg-secondary">
                <SelectItem value={ALL} className="cursor-pointer">
                  All promotion types
                </SelectItem>
                {PROMOTION_TYPE_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value} className="cursor-pointer">
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <DateField id="promotions-start-from" label="Start date (from)" value={startDateFrom} onChange={onStartDateFromChange} />

          <DateField id="promotions-end-to" label="End date (to)" value={endDateTo} onChange={onEndDateToChange} />

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

export default PromotionsFilterSheet;
