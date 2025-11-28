'use client';

import React from 'react';

interface RadioOptionProps {
  value: string;
  label: string;
  description: string;
  selected: boolean;
  onSelect: () => void;
}

export const RadioOption: React.FC<RadioOptionProps> = ({ value, label, description, selected, onSelect }) => {
  return (
    <label
      className={`flex cursor-pointer items-start gap-3 rounded-lg border-2 p-4 transition-all ${
        selected
          ? 'border-blue-500 bg-blue-50 dark:border-blue-600 dark:bg-blue-950/30'
          : 'border-gray-200 bg-white hover:border-blue-500 dark:border-gray-700 dark:bg-[#222121] dark:hover:border-blue-600'
      }`}
      onClick={onSelect}
    >
      <input
        type="radio"
        name="paymentTiming"
        value={value}
        checked={selected}
        onChange={onSelect}
        className="mt-0.5 h-5 w-5 flex-shrink-0 cursor-pointer"
      />
      <div className="flex-1">
        <div className="mb-1 text-[15px] font-semibold text-gray-900 dark:text-gray-100">{label}</div>
        <div className="text-[13px] leading-relaxed text-gray-600 dark:text-gray-400">{description}</div>
      </div>
    </label>
  );
};
