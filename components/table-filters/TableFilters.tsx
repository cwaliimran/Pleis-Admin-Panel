'use client';
import React, { useEffect, useMemo, useState } from 'react';
import { debounce } from 'lodash';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { ChevronDownIcon } from 'lucide-react';
import { fDate, formatStr } from '@/utils/format-time';

export interface FilterOption {
  value: string;
  label: string;
}

export interface SelectFilter {
  id: string;
  label: string;
  placeholder: string;
  options: FilterOption[];
  value?: string;
  onChange: (value: string) => void;
}

export interface DateFilter {
  id: string;
  label?: string;
  placeholder: string;
  value?: Date;
  onChange: (date: Date | undefined) => void;
}

export interface DateRangeFilter {
  startDate: {
    id: string;
    label?: string;
    placeholder: string;
    value?: Date;
    onChange: (date: Date | undefined) => void;
  };
  endDate: {
    id: string;
    label?: string;
    placeholder: string;
    value?: Date;
    onChange: (date: Date | undefined) => void;
  };
}

export interface SearchFilter {
  placeholder: string;
  value?: string;
  onChange: (value: string) => void;
}

export interface ResetFilter {
  onReset: () => void;
  showResetButton?: boolean;
}

export interface TableFiltersProps {
  dateFilter?: DateFilter;
  dateRangeFilter?: DateRangeFilter;
  selectFilters?: SelectFilter[];
  searchFilter?: SearchFilter;
  resetFilter?: ResetFilter;
  className?: string;
  filtersAlignment?: 'left' | 'right' | 'center';
}

const TableFilters: React.FC<TableFiltersProps> = ({
  dateFilter,
  dateRangeFilter,
  selectFilters = [],
  searchFilter,
  resetFilter,
  className = '',
  filtersAlignment = 'right',
}) => {
  const [datePickerOpen, setDatePickerOpen] = useState(false);
  const [startDatePickerOpen, setStartDatePickerOpen] = useState(false);
  const [endDatePickerOpen, setEndDatePickerOpen] = useState(false);

  const [localSearch, setLocalSearch] = useState(searchFilter?.value ?? '');

  // keep local input in sync if parent resets/changes the value externally
  useEffect(() => {
    setLocalSearch(searchFilter?.value ?? '');
  }, [searchFilter?.value]);

  // stable reference to parent's onChange (avoid depending on whole object)
  const onSearchChange = searchFilter?.onChange;

  // debounced notifier (only side-effect is delayed)
  const debouncedNotify = useMemo(
    () =>
      debounce((q: string) => {
        onSearchChange?.(q);
      }, 400),
    [onSearchChange]
  );

  // cancel pending debounce on unmount
  useEffect(() => {
    return () => debouncedNotify.cancel();
  }, [debouncedNotify]);

  const hasActiveFilters = () => {
    const hasDateFilter = dateFilter?.value;
    const hasStartDate = dateRangeFilter?.startDate?.value;
    const hasEndDate = dateRangeFilter?.endDate?.value;
    const hasSelectFilters = selectFilters.some(
      (filter) => filter.value && filter.value !== ''
    );
    const hasSearchFilter = searchFilter?.value && searchFilter.value !== '';
    return (
      hasDateFilter ||
      hasStartDate ||
      hasEndDate ||
      hasSelectFilters ||
      hasSearchFilter
    );
  };

  const getJustifyClass = () => {
    switch (filtersAlignment) {
      case 'left':
        return 'justify-start';
      case 'center':
        return 'justify-center';
      case 'right':
      default:
        return 'justify-end';
    }
  };

  return (
    <div className={`w-full ${className}`}>
      {/* Filters Row */}
      {(dateFilter ||
        dateRangeFilter ||
        selectFilters.length > 0 ||
        (resetFilter?.showResetButton !== false && hasActiveFilters())) && (
        <div
          className={`mb-3 flex ${getJustifyClass()} flex-wrap items-center gap-3`}
        >
          {/* Date Filter */}
          {dateFilter && (
            <div className="flex w-full flex-col gap-3">
              {dateFilter.label && (
                <label
                  htmlFor={dateFilter.id}
                  className="px-1 text-sm font-medium"
                >
                  {dateFilter.label}
                </label>
              )}
              <Popover open={datePickerOpen} onOpenChange={setDatePickerOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    id={dateFilter.id}
                    className="w-full justify-between font-normal"
                  >
                    {dateFilter.value
                      ? fDate(dateFilter.value, formatStr.paramCase.date)
                      : dateFilter.placeholder}

                    <ChevronDownIcon className="h-4 w-4" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent
                  className="dark:bg-secondary w-auto overflow-hidden p-0"
                  align="start"
                >
                  <Calendar
                    mode="single"
                    selected={dateFilter.value}
                    captionLayout="dropdown"
                    onSelect={(date) => {
                      dateFilter.onChange(date);
                      setDatePickerOpen(false);
                    }}
                  />
                </PopoverContent>
              </Popover>
            </div>
          )}

          {/* Date Range Filter */}
          {dateRangeFilter && (
            <div className="flex justify-between w-full gap-2">
              {/* Start Date */}
              <div className="flex flex-col gap-3 w-full">
                {/* {dateRangeFilter.startDate.label && (
                  <label
                    htmlFor={dateRangeFilter.startDate.id}
                    className="px-1 text-sm font-medium"
                  >
                    {dateRangeFilter.startDate.label}
                  </label>
                )} */}
                <Popover
                  open={startDatePickerOpen}
                  onOpenChange={setStartDatePickerOpen}
                >
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      id={dateRangeFilter.startDate.id}
                      className="w-44 justify-between font-normal"
                    >
                      {dateRangeFilter.startDate.value
                        ? fDate(
                            dateRangeFilter.startDate.value,
                            formatStr.paramCase.date
                          )
                        : dateRangeFilter.startDate.placeholder}

                      <ChevronDownIcon className="h-4 w-4" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent
                    className="w-auto overflow-hidden p-0"
                    align="start"
                  >
                    <Calendar
                      mode="single"
                      selected={dateRangeFilter.startDate.value}
                      captionLayout="dropdown"
                      onSelect={(date) => {
                        dateRangeFilter.startDate.onChange(date);
                        setStartDatePickerOpen(false);
                      }}
                    />
                  </PopoverContent>
                </Popover>
              </div>

              {/* End Date */}
              <div className="flex flex-col gap-3 w-full">
                {/* {dateRangeFilter.endDate.label && (
                  <label
                    htmlFor={dateRangeFilter.endDate.id}
                    className="px-1 text-sm font-medium"
                  >
                    {dateRangeFilter.endDate.label}
                  </label>
                )} */}
                <Popover
                  open={endDatePickerOpen}
                  onOpenChange={setEndDatePickerOpen}
                >
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      id={dateRangeFilter.endDate.id}
                      className="w-44 justify-between font-normal"
                    >
                      {dateRangeFilter.endDate.value
                        ? fDate(
                            dateRangeFilter.endDate.value,
                            formatStr.paramCase.date
                          )
                        : dateRangeFilter.endDate.placeholder}

                      <ChevronDownIcon className="h-4 w-4" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent
                    className="w-auto overflow-hidden p-0"
                    align="start"
                  >
                    <Calendar
                      mode="single"
                      selected={dateRangeFilter.endDate.value}
                      captionLayout="dropdown"
                      onSelect={(date) => {
                        dateRangeFilter.endDate.onChange(date);
                        setEndDatePickerOpen(false);
                      }}
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          )}

          {/* Select Filters */}
          {selectFilters.map((filter) => (
            <Select
              key={filter.id}
              value={filter.value}
              onValueChange={filter.onChange}
            >
              <SelectTrigger className="w-[180px] cursor-pointer">
                <SelectValue placeholder={filter.placeholder} />
              </SelectTrigger>
              <SelectContent className="dark:bg-secondary">
                <SelectGroup>
                  <SelectLabel>{filter.label}</SelectLabel>
                  {filter.options.map((option) => (
                    <SelectItem
                      key={option.value}
                      value={option.value}
                      className="cursor-pointer"
                    >
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          ))}
        </div>
      )}

      {searchFilter && (
        <div className="search">
          <Input
            placeholder={searchFilter.placeholder}
            value={localSearch}
            onChange={(e) => {
              const q = e.target.value;
              setLocalSearch(q);
              debouncedNotify(q);
            }}
            className="h-10 w-full"
          />
        </div>
      )}

      <div className="mt-2">
        {/* Reset Button */}
        {resetFilter &&
          resetFilter.showResetButton !== false &&
          hasActiveFilters() && (
            <button
              className="bg-muted text-foreground border-border hover:bg-muted/80 w-full cursor-pointer rounded-md border py-2 font-semibold transition"
              type="button"
              onClick={resetFilter.onReset}
            >
              Reset
            </button>
          )}
      </div>
    </div>
  );
};

export default TableFilters;
