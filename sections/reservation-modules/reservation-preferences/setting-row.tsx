'use client';

import { cn } from '@/lib/utils';
import React from 'react';

interface SettingRowProps {
  title: React.ReactNode;
  /** ReactNode so copy can carry inline emphasis. */
  description?: React.ReactNode;
  /** The control on the right — usually a ToggleSwitch. */
  control?: React.ReactNode;
  /** Rendered underneath the title/description, e.g. a Select or Input. */
  children?: React.ReactNode;
  htmlFor?: string;
  divider?: boolean;
  className?: string;
}

export const SettingRow: React.FC<SettingRowProps> = ({ title, description, control, children, htmlFor, divider = false, className }) => {
  const Label = htmlFor ? 'label' : 'div';

  return (
    <div className={cn('py-4 first:pt-0 last:pb-0', divider && 'border-b border-gray-200 dark:border-gray-800', className)}>
      <div className="flex items-start justify-between gap-5">
        <div className="min-w-0 flex-1">
          <Label htmlFor={htmlFor} className={cn('block text-sm font-bold text-gray-900 dark:text-gray-100', htmlFor && 'cursor-pointer')}>
            {title}
          </Label>
          {description && <p className="mt-1 text-sm leading-relaxed text-gray-500 dark:text-gray-400">{description}</p>}
        </div>
        {control}
      </div>

      {children && <div className="mt-3">{children}</div>}
    </div>
  );
};
