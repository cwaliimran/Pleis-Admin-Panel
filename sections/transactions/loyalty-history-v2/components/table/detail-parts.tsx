import { FC, ReactNode } from 'react';

export const SectionHeading: FC<{ title: string }> = ({ title }) => (
  <p className="text-muted-foreground mb-3 text-xs font-semibold tracking-wide uppercase">{title}</p>
);

export const InfoLine: FC<{ label: string; value?: ReactNode }> = ({ label, value }) => {
  if (value === undefined || value === null || value === '') return null;
  return (
    <div className="flex items-start justify-between gap-4 border-b border-gray-100 py-2 last:border-0 dark:border-gray-800">
      <span className="text-sm text-gray-500 dark:text-gray-400">{label}</span>
      <span className="text-right text-sm font-medium text-gray-900 dark:text-gray-100">{value}</span>
    </div>
  );
};
