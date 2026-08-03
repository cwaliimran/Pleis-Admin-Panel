'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { debounce } from 'lodash';
import { ListFilter } from 'lucide-react';
import React, { useEffect, useMemo, useState } from 'react';
import { CHALLENGE_REWARD_TYPE_OPTIONS, CHALLENGE_STATUS_OPTIONS, CHALLENGE_TASK_TYPE_OPTIONS } from '../constants';
import { ChallengeRewardType, ChallengeStatus, ChallengeTaskType } from '../types';

/** Radix `Select` cannot hold an empty string, so "everything" needs a token. */
const ALL = 'all';

interface ChallengesFilterSheetProps {
  search: string;
  onSearchChange: (value: string) => void;
  taskType: ChallengeTaskType | '';
  onTaskTypeChange: (value: ChallengeTaskType | '') => void;
  rewardType: ChallengeRewardType | '';
  onRewardTypeChange: (value: ChallengeRewardType | '') => void;
  status: ChallengeStatus | '';
  onStatusChange: (value: ChallengeStatus | '') => void;
  onReset: () => void;
}

export const ChallengesFilterSheet: React.FC<ChallengesFilterSheetProps> = ({
  search,
  onSearchChange,
  taskType,
  onTaskTypeChange,
  rewardType,
  onRewardTypeChange,
  status,
  onStatusChange,
  onReset,
}) => {
  const [localSearch, setLocalSearch] = useState(search);

  // Keep the input in step when the parent resets the filters.
  useEffect(() => {
    setLocalSearch(search);
  }, [search]);

  const debouncedSearch = useMemo(() => debounce((value: string) => onSearchChange(value), 400), [onSearchChange]);

  useEffect(() => () => debouncedSearch.cancel(), [debouncedSearch]);

  const hasActiveFilters = Boolean(search || taskType || rewardType || status);

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
            <label htmlFor="challenges-search" className="text-sm font-medium">
              Search by name
            </label>
            <Input
              id="challenges-search"
              placeholder="Search challenges..."
              value={localSearch}
              onChange={(event) => {
                setLocalSearch(event.target.value);
                debouncedSearch(event.target.value);
              }}
              className="h-10 w-full"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="challenges-task-type" className="text-sm font-medium">
              Task Type
            </label>
            <Select value={taskType || ALL} onValueChange={(value) => onTaskTypeChange(value === ALL ? '' : (value as ChallengeTaskType))}>
              <SelectTrigger id="challenges-task-type" className="w-full cursor-pointer">
                <SelectValue placeholder="All task types" />
              </SelectTrigger>
              <SelectContent className="dark:bg-secondary">
                <SelectItem value={ALL} className="cursor-pointer">
                  All task types
                </SelectItem>
                {CHALLENGE_TASK_TYPE_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value} className="cursor-pointer">
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="challenges-reward-type" className="text-sm font-medium">
              Reward Type
            </label>
            <Select value={rewardType || ALL} onValueChange={(value) => onRewardTypeChange(value === ALL ? '' : (value as ChallengeRewardType))}>
              <SelectTrigger id="challenges-reward-type" className="w-full cursor-pointer">
                <SelectValue placeholder="All reward types" />
              </SelectTrigger>
              <SelectContent className="dark:bg-secondary">
                <SelectItem value={ALL} className="cursor-pointer">
                  All reward types
                </SelectItem>
                {CHALLENGE_REWARD_TYPE_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value} className="cursor-pointer">
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="challenges-status" className="text-sm font-medium">
              Status
            </label>
            <Select value={status || ALL} onValueChange={(value) => onStatusChange(value === ALL ? '' : (value as ChallengeStatus))}>
              <SelectTrigger id="challenges-status" className="w-full cursor-pointer">
                <SelectValue placeholder="All statuses" />
              </SelectTrigger>
              <SelectContent className="dark:bg-secondary">
                <SelectItem value={ALL} className="cursor-pointer">
                  All statuses
                </SelectItem>
                {CHALLENGE_STATUS_OPTIONS.map((option) => (
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

export default ChallengesFilterSheet;
