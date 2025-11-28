'use client';

import React from 'react';

interface ToggleSwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
}

export const ToggleSwitch: React.FC<ToggleSwitchProps> = ({ checked, onChange, disabled = false }) => {
  return (
    <label className="relative inline-block h-8 w-14 flex-shrink-0">
      <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} disabled={disabled} className="h-0 w-0 opacity-0" />
      <span
        className={`absolute inset-0 cursor-pointer rounded-full transition-all duration-300 ${
          checked ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-600'
        } ${disabled ? 'cursor-not-allowed opacity-50' : ''}`}
      >
        <span
          className={`absolute bottom-[3px] left-[3px] h-[26px] w-[26px] rounded-full bg-white shadow-md transition-transform duration-300 ${
            checked ? 'translate-x-6' : 'translate-x-0'
          }`}
        />
      </span>
    </label>
  );
};
