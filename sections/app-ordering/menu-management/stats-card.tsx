import React from 'react';

interface StatsCardProps {
  value: number;
  label: string;
}

export const StatsCard: React.FC<StatsCardProps> = ({ value, label }) => {
  return (
    <div className="rounded-xl bg-white p-5 shadow-sm dark:bg-[#222121]">
      <div className="mb-1 text-3xl font-bold text-gray-900 dark:text-gray-100">{value}</div>
      <div className="text-sm font-semibold text-gray-500 dark:text-gray-500">{label}</div>
    </div>
  );
};
