'use client';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { fDate, formatStr } from '@/utils/format-time';
import { ChevronDownIcon, Search, X } from 'lucide-react';
import { FC, useState } from 'react';
import { FILTER_ACTIVE_SOFT, FILTER_ACTIVE_SOLID } from '../../config/theme';
import { DATE_BASIS_OPTIONS, PERIOD_OPTIONS, PresetId, PRESET_OPTIONS } from './filters';

interface LoyaltyHistoryFiltersProps {
  dateBasis: string;
  onDateBasisChange: (value: string) => void;
  period: string;
  onPeriodChange: (value: string) => void;
  customStartDate?: Date;
  customEndDate?: Date;
  onCustomDateChange: (start: Date | undefined, end: Date | undefined) => void;
  search: string;
  onSearchChange: (value: string) => void;
  activePreset: PresetId | null;
  onPresetChange: (preset: PresetId | null) => void;
}

const LoyaltyHistoryFilters: FC<LoyaltyHistoryFiltersProps> = ({
  dateBasis,
  onDateBasisChange,
  period,
  onPeriodChange,
  customStartDate,
  customEndDate,
  onCustomDateChange,
  search,
  onSearchChange,
  activePreset,
  onPresetChange,
}) => {
  const activePresetLabel = PRESET_OPTIONS.find((preset) => preset.id === activePreset)?.label;
  const [startDateOpen, setStartDateOpen] = useState(false);
  const [endDateOpen, setEndDateOpen] = useState(false);

  return (
    <div className="border-b border-gray-200 py-4 dark:border-gray-700">
      <div className="flex flex-wrap items-end gap-4">
        <div className="w-40 space-y-1.5">
          <Label className="text-muted-foreground text-xs font-semibold tracking-wide uppercase">Date basis</Label>
          <Select value={dateBasis} onValueChange={onDateBasisChange}>
            <SelectTrigger className="w-full cursor-pointer">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {DATE_BASIS_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value} className="cursor-pointer">
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="w-40 space-y-1.5">
          <Label className="text-muted-foreground text-xs font-semibold tracking-wide uppercase">Period</Label>
          <Select value={period} onValueChange={onPeriodChange}>
            <SelectTrigger className="w-full cursor-pointer">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {PERIOD_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value} className="cursor-pointer">
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {period === 'custom_range' && (
          <>
            <div className="w-40 space-y-1.5">
              <Label className="text-muted-foreground text-xs font-semibold tracking-wide uppercase">Start date</Label>
              <Popover open={startDateOpen} onOpenChange={setStartDateOpen}>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-between font-normal">
                    {customStartDate ? fDate(customStartDate, formatStr.split.date) : 'Select date'}
                    <ChevronDownIcon className="h-4 w-4" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto overflow-hidden p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={customStartDate}
                    captionLayout="dropdown"
                    disabled={customEndDate ? { after: customEndDate } : undefined}
                    onSelect={(date) => {
                      onCustomDateChange(date, customEndDate);
                      setStartDateOpen(false);
                    }}
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="w-40 space-y-1.5">
              <Label className="text-muted-foreground text-xs font-semibold tracking-wide uppercase">End date</Label>
              <Popover open={endDateOpen} onOpenChange={setEndDateOpen}>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-between font-normal">
                    {customEndDate ? fDate(customEndDate, formatStr.split.date) : 'Select date'}
                    <ChevronDownIcon className="h-4 w-4" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto overflow-hidden p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={customEndDate}
                    captionLayout="dropdown"
                    disabled={customStartDate ? { before: customStartDate } : undefined}
                    onSelect={(date) => {
                      onCustomDateChange(customStartDate, date);
                      setEndDateOpen(false);
                    }}
                  />
                </PopoverContent>
              </Popover>
            </div>
          </>
        )}

        <div className="min-w-56 flex-1 space-y-1.5">
          <Label className="text-muted-foreground text-xs font-semibold tracking-wide uppercase">Search</Label>
          <div className="relative">
            <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input value={search} onChange={(e) => onSearchChange(e.target.value)} placeholder="User, description, reward, transaction ID..." className="pl-9" />
          </div>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <span className="text-muted-foreground mr-1 text-xs font-semibold tracking-wide uppercase">Presets</span>
        {PRESET_OPTIONS.map((preset) => (
          <button
            key={preset.id}
            type="button"
            onClick={() => onPresetChange(activePreset === preset.id ? null : preset.id)}
            className={`cursor-pointer rounded-full border px-3 py-1.5 text-xs font-medium transition ${
              activePreset === preset.id
                ? FILTER_ACTIVE_SOLID
                : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:bg-transparent dark:text-gray-200 dark:hover:bg-gray-800'
            }`}
          >
            {preset.label}
          </button>
        ))}
      </div>

      {activePresetLabel && (
        <div className="mt-3 flex items-center gap-3">
          <span className={`flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium ${FILTER_ACTIVE_SOFT}`}>
            Preset: {activePresetLabel}
            <button type="button" onClick={() => onPresetChange(null)} className="cursor-pointer">
              <X className="h-3 w-3" />
            </button>
          </span>
          <button type="button" onClick={() => onPresetChange(null)} className="text-muted-foreground cursor-pointer text-xs underline">
            Clear all
          </button>
        </div>
      )}
    </div>
  );
};

export default LoyaltyHistoryFilters;
