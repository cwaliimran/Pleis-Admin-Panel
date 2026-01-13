import React from 'react';

interface ToggleSwitchProps {
  value: boolean;
  onChange: (value: boolean) => void;
  label: string;
  isLoading?: boolean;
  isDisabled?: boolean;
}

export const ToggleSwitch: React.FC<ToggleSwitchProps> = ({ value, onChange, label, isLoading = false, isDisabled = false }) => (
  <div className="flex items-center justify-between rounded-lg bg-gray-100 p-3 dark:bg-[#222121]">
    <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">{label}</span>
    <div className="flex items-center gap-3">
      {isLoading && (
        <div className="flex items-center justify-center">
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-blue-600 dark:border-gray-600 dark:border-t-blue-400" />
        </div>
      )}
      <button
        title="Toggle Switch"
        type="button"
        onClick={() => !isDisabled && !isLoading && onChange(!value)}
        disabled={isDisabled || isLoading}
        className={`relative h-6 w-12 cursor-pointer rounded-full transition-colors ${
          isDisabled || isLoading ? 'cursor-not-allowed opacity-50' : ''
        } ${value ? 'bg-green-600' : 'bg-gray-300'}`}
      >
        <div className={`absolute top-1 left-1 h-4 w-4 rounded-full bg-white transition-transform ${value ? 'translate-x-6 transform' : ''}`} />
      </button>
    </div>
  </div>
);
