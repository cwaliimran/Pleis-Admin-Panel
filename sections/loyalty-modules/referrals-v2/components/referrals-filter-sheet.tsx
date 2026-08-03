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
  user: string;
  onUserChange: (value: string) => void;
  referrer: string;
  onReferrerChange: (value: string) => void;
  status: ReferralStatus | '';
  onStatusChange: (value: ReferralStatus | '') => void;
  onReset: () => void;
}

export const ReferralsFilterSheet: React.FC<ReferralsFilterSheetProps> = ({
  user,
  onUserChange,
  referrer,
  onReferrerChange,
  status,
  onStatusChange,
  onReset,
}) => {
  const [localUser, setLocalUser] = useState(user);
  const [localReferrer, setLocalReferrer] = useState(referrer);

  // Keep the inputs in step when the parent resets the filters.
  useEffect(() => {
    setLocalUser(user);
  }, [user]);

  useEffect(() => {
    setLocalReferrer(referrer);
  }, [referrer]);

  const debouncedUser = useMemo(() => debounce((value: string) => onUserChange(value), 400), [onUserChange]);
  const debouncedReferrer = useMemo(() => debounce((value: string) => onReferrerChange(value), 400), [onReferrerChange]);

  useEffect(() => () => debouncedUser.cancel(), [debouncedUser]);
  useEffect(() => () => debouncedReferrer.cancel(), [debouncedReferrer]);

  const hasActiveFilters = Boolean(user || referrer || status);

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
              value={localUser}
              onChange={(event) => {
                setLocalUser(event.target.value);
                debouncedUser(event.target.value);
              }}
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
              value={localReferrer}
              onChange={(event) => {
                setLocalReferrer(event.target.value);
                debouncedReferrer(event.target.value);
              }}
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

export default ReferralsFilterSheet;
