'use client';

import Time24hInput from '@/components/common/time-24h-input';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { cn } from '@/lib/utils';
import { FC } from 'react';
import { useFormContext } from 'react-hook-form';

interface RHFTimeFieldProps {
  name: string;
  label?: string;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

/**
 * 24-hour time field bound to react-hook-form.
 *
 * Delegates to the shared `Time24hInput` — the same control the discounts and
 * daypart modals use. It parses and normalises to `HH:mm` itself rather than
 * leaving the format to the browser's locale, so every viewer sees 24-hour.
 */
const RHFTimeField: FC<RHFTimeFieldProps> = ({ name, label, placeholder = 'HH:mm', className, disabled = false }) => {
  const { control } = useFormContext();

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className={cn('w-full', className)}>
          {label && <FormLabel>{label}</FormLabel>}
          <FormControl>
            <Time24hInput
              value={field.value || ''}
              onChange={field.onChange}
              title={label}
              placeholder={placeholder}
              disabled={disabled}
              className="h-10"
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default RHFTimeField;
