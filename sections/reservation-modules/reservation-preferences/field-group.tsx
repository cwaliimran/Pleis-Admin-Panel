'use client';

import { cn } from '@/lib/utils';
import React from 'react';

interface FieldGroupProps {
  legend: string;
  children: React.ReactNode;
  className?: string;
}

/** Bordered group with an inset legend — used to bundle related modal fields. */
export const FieldGroup: React.FC<FieldGroupProps> = ({ legend, children, className }) => {
  return (
    <fieldset className={cn('rounded-xl border border-gray-200 px-4 pt-3 pb-4 dark:border-gray-700', className)}>
      <legend className="px-1.5 text-xs font-semibold tracking-wide text-gray-500 dark:text-gray-400">{legend}</legend>
      <div className="flex flex-col gap-4">{children}</div>
    </fieldset>
  );
};
