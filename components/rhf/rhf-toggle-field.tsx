'use client';

import ToggleSwitch from '@/components/ui/toggle-switch';
import React, { ReactNode } from 'react';
import { Controller, useFormContext } from 'react-hook-form';

interface RHFToggleFieldProps {
  name: string;
  title: string;
  description: string;
  /** Rendered beside the title, e.g. a live Active/Inactive badge. */
  badge?: ReactNode;
  disabled?: boolean;
}

/** A bordered row pairing an explanation with a switch, bound to a boolean field. */
const RHFToggleField: React.FC<RHFToggleFieldProps> = ({ name, title, description, badge, disabled = false }) => {
  const { control } = useFormContext();

  return (
    <Controller
      control={control}
      name={name}
      render={({ field }) => (
        <div className="flex items-start justify-between gap-4 rounded-lg border border-gray-200 px-4 py-3 dark:border-gray-700/60">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">{title}</p>
              {badge}
            </div>
            <p className="mt-1 text-xs leading-relaxed text-gray-500 dark:text-gray-400">{description}</p>
          </div>

          <ToggleSwitch checked={Boolean(field.value)} onChange={field.onChange} disabled={disabled} ariaLabel={title} />
        </div>
      )}
    />
  );
};

export default RHFToggleField;
