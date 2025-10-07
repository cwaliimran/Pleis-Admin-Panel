'use client';

import * as React from 'react';

interface ToggleSwitchProps {
  value: boolean;
  onChange: (value: boolean) => void;
  label: string;
  disabled?: boolean;
}

export const ToggleSwitch: React.FC<ToggleSwitchProps> = ({
  value,
  onChange,
  label,
  disabled = false,
}) => {
  return (
    <div className="dark:bg-secondary flex items-center justify-between rounded-lg bg-gray-50 p-3">
      <span className="font-medium text-gray-700 dark:text-gray-300">
        {label}
      </span>
      <button
        title="Toggle Switch"
        type="button"
        onClick={() => onChange(!value)}
        disabled={disabled}
        className={`relative h-6 w-12 rounded-full transition-colors cursor-pointer ${
          value ? 'bg-blue-600' : 'bg-gray-300'
        } ${disabled ? 'cursor-not-allowed opacity-50' : ''}`}
      >
        <div
          className={`absolute top-1 left-1 h-4 w-4 rounded-full bg-white transition-transform ${
            value ? 'translate-x-6 transform' : ''
          }`}
        />
      </button>
    </div>
  );
};
