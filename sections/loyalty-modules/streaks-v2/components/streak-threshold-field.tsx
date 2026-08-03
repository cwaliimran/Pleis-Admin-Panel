'use client';

import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import React from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { STREAK_BADGE_DOT_CLASS, STREAK_BADGE_LABELS } from '../constants';
import { StreakBadge } from '../types';

interface StreakThresholdFieldProps {
  name: string;
  badge: StreakBadge;
  disabled?: boolean;
}

/** A bordered row: tier dot + name on the left, the visit count on the right. */
export const StreakThresholdField: React.FC<StreakThresholdFieldProps> = ({ name, badge, disabled = false }) => {
  const { control } = useFormContext();

  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <div className="rounded-lg border border-gray-200 px-4 py-3 dark:border-gray-700/60">
          <div className="flex items-center justify-between gap-4">
            <span className="inline-flex items-center gap-2 text-sm font-medium text-gray-900 dark:text-gray-100">
              <span className={cn('h-2 w-2 shrink-0 rounded-full', STREAK_BADGE_DOT_CLASS[badge])} />
              {STREAK_BADGE_LABELS[badge]}
            </span>

            <div className="flex items-center gap-2">
              <Input
                {...field}
                type="number"
                min="1"
                disabled={disabled}
                aria-label={`${STREAK_BADGE_LABELS[badge]} threshold in visits`}
                className="h-9 w-24"
              />
              <span className="text-sm text-gray-500 dark:text-gray-400">visits</span>
            </div>
          </div>

          {fieldState.error && <p className="mt-2 text-right text-xs text-red-600 dark:text-red-400">{fieldState.error.message}</p>}
        </div>
      )}
    />
  );
};

export default StreakThresholdField;
