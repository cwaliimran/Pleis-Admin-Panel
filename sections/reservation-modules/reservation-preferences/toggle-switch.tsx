'use client';

import { cn } from '@/lib/utils';
import React from 'react';

interface ToggleSwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
  /** Required — the switch has no visible label of its own. */
  ariaLabel: string;
  size?: 'md' | 'sm';
}

const SIZES = {
  md: { track: 'h-7 w-12', knob: 'h-[22px] w-[22px]', on: 'translate-x-5' },
  sm: { track: 'h-6 w-11', knob: 'h-[18px] w-[18px]', on: 'translate-x-5' },
} as const;

export const ToggleSwitch: React.FC<ToggleSwitchProps> = ({ checked, onChange, disabled = false, ariaLabel, size = 'md' }) => {
  const dimensions = SIZES[size];

  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={ariaLabel}
      disabled={disabled}
      onClick={() => onChange(!checked)}
      className={cn(
        'relative inline-flex shrink-0 cursor-pointer items-center rounded-full transition-colors duration-300',
        'focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:outline-none dark:focus-visible:ring-offset-[#222121]',
        dimensions.track,
        checked ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-600',
        disabled && 'cursor-not-allowed opacity-50'
      )}
    >
      <span
        className={cn(
          'pointer-events-none absolute left-[3px] rounded-full bg-white shadow-md transition-transform duration-300',
          dimensions.knob,
          checked ? dimensions.on : 'translate-x-0'
        )}
      />
    </button>
  );
};
