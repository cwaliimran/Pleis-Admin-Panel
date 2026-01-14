import React from 'react';

interface StatsCardProps {
  value?: number | null;
  label: string;
  isLoading?: boolean;
}

export const StatsCard: React.FC<StatsCardProps> = ({ value, label, isLoading = false }) => {
  return (
    <div className="rounded-xl bg-white p-5 shadow-sm dark:bg-[#222121]">
      <div className="mb-1 text-3xl font-bold text-gray-900 dark:text-gray-100">
        {isLoading || value === undefined || value === null ? (
          <div className="mb-1 h-7 w-7 animate-spin rounded-full border-2 border-gray-300 border-t-gray-900 dark:border-gray-600 dark:border-t-gray-100"></div>
        ) : (
          value
        )}
      </div>
      <div className="text-sm font-semibold text-gray-500 dark:text-gray-500">{label}</div>
    </div>
  );
};
