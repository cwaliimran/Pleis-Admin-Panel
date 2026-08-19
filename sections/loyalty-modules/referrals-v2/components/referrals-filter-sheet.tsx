'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { debounce } from 'lodash';
import { ListFilter } from 'lucide-react';
import React, { useEffect, useMemo, useState } from 'react';
import { REFERRAL_STATUS_OPTIONS } from '../constants';
import { ReferralStatus } from '../types';

/** Radix `Select` cannot hold an empty string, so "everything" needs a token. */
const ALL = 'all';

interface ReferralsFilterSheetProps {
  /**
   * The endpoint takes a single `keyword`, so the User and Referrer inputs are
   * two views of this one value — typing in either updates both.
   */
  keyword: string;
  onKeywordChange: (value: string) => void;
  status: ReferralStatus | '';
  onStatusChange: (value: ReferralStatus | '') => void;
  onReset: () => void;
}

export const ReferralsFilterSheet: React.FC<ReferralsFilterSheetProps> = ({ keyword, onKeywordChange, status, onStatusChange, onReset }) => {
  const [localKeyword, setLocalKeyword] = useState(keyword);

  // Keep the inputs in step when the parent resets the filters.
  useEffect(() => {
    setLocalKeyword(keyword);
  }, [keyword]);

  const debouncedKeyword = useMemo(() => debounce((value: string) => onKeywordChange(value), 400), [onKeywordChange]);

  useEffect(() => () => debouncedKeyword.cancel(), [debouncedKeyword]);

  const handleKeywordInput = (value: string) => {
    setLocalKeyword(value);
    debouncedKeyword(value);
  };

  const handleReset = () => {
    // Without this a keystroke from just before the click still lands, and the
    // cleared filter re-applies itself 400ms later.
    debouncedKeyword.cancel();
    onReset();
  };

  const hasActiveFilters = Boolean(keyword || status);

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
            <label htmlFor="referrals-user" className="text-sm font-medium">
              User
            </label>
            <Input
              id="referrals-user"
              placeholder="Filter by user..."
              value={localKeyword}
              onChange={(event) => handleKeywordInput(event.target.value)}
              className="h-10 w-full"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="referrals-referrer" className="text-sm font-medium">
              Referrer
            </label>
            <Input
              id="referrals-referrer"
              placeholder="Filter by referrer..."
              value={localKeyword}
              onChange={(event) => handleKeywordInput(event.target.value)}
              className="h-10 w-full"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="referrals-status" className="text-sm font-medium">
              Status
            </label>
            <Select value={status || ALL} onValueChange={(value) => onStatusChange(value === ALL ? '' : (value as ReferralStatus))}>
              <SelectTrigger id="referrals-status" className="w-full cursor-pointer">
                <SelectValue placeholder="All statuses" />
              </SelectTrigger>
              <SelectContent className="dark:bg-secondary">
                <SelectItem value={ALL} className="cursor-pointer">
                  All statuses
                </SelectItem>
                {REFERRAL_STATUS_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value} className="cursor-pointer">
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {hasActiveFilters && (
            <button
              type="button"
              onClick={handleReset}
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

export default ReferralsFilterSheet;
