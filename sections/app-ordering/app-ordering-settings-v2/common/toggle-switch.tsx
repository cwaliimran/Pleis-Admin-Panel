'use client';

import { cn } from '@/lib/utils';
import React from 'react';

interface ToggleSwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
  /** Required — the switch has no visible label of its own. */
  ariaLabel: string;
}

export const ToggleSwitch: React.FC<ToggleSwitchProps> = ({ checked, onChange, disabled = false, ariaLabel }) => {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={ariaLabel}
      disabled={disabled}
      onClick={() => onChange(!checked)}
      className={cn(
        'relative inline-flex h-8 w-14 shrink-0 cursor-pointer items-center rounded-full transition-colors duration-300',
        'focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:outline-none dark:focus-visible:ring-offset-[#222121]',
        checked ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-600',
        disabled && 'cursor-not-allowed opacity-50'
      )}
    >
      <span
        className={cn(
          'pointer-events-none absolute left-[3px] h-[26px] w-[26px] rounded-full bg-white shadow-md transition-transform duration-300',
          checked ? 'translate-x-6' : 'translate-x-0'
        )}
      />
    </button>
  );
};
