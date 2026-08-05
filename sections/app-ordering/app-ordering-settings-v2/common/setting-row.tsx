'use client';

import { cn } from '@/lib/utils';
import React from 'react';

interface SettingRowProps {
  title: string;
  /** ReactNode so copy can carry inline emphasis. */
  description?: React.ReactNode;
  /** The control on the right — usually a ToggleSwitch. */
  control?: React.ReactNode;
  /** Expanded content shown underneath, e.g. the tip preset editor. */
  children?: React.ReactNode;
  divider?: boolean;
  className?: string;
}

export const SettingRow: React.FC<SettingRowProps> = ({ title, description, control, children, divider = false, className }) => {
  return (
    <div className={cn('px-7 py-6', divider && 'border-b border-gray-200 dark:border-gray-800', className)}>
      <div className="flex items-start justify-between gap-5">
        <div className="flex-1">
          <h3 className="mb-1.5 text-base font-bold text-gray-900 dark:text-gray-100">{title}</h3>
          {description && <p className="max-w-2xl text-sm leading-relaxed text-gray-600 dark:text-gray-400">{description}</p>}
        </div>
        {control}
      </div>
      {children}
    </div>
  );
};
