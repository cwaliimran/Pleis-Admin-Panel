'use client';

import { FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { cn } from '@/lib/utils';
import { FC } from 'react';
import { useFormContext } from 'react-hook-form';

interface Option {
  value: string;
  label: string;
}

interface RHFChipToggleGroupProps {
  name: string;
  label?: string;
  helperText?: string;
  options: Option[];
  className?: string;
}

const RHFChipToggleGroup: FC<RHFChipToggleGroupProps> = ({ name, label, helperText, options, className }) => {
  const { control } = useFormContext();

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => {
        const selected: string[] = field.value || [];

        const toggle = (value: string) => {
          const next = selected.includes(value) ? selected.filter((v) => v !== value) : [...selected, value];
          field.onChange(next);
        };

        return (
          <FormItem>
            {label && (
              <FormLabel>
                {label}
                {helperText && <span className="text-muted-foreground ml-1 text-xs font-normal">{helperText}</span>}
              </FormLabel>
            )}
            <div className={cn('flex flex-wrap gap-2', className)}>
              {options.map((option) => {
                const checked = selected.includes(option.value);
                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => toggle(option.value)}
                    className={cn(
                      'cursor-pointer rounded-md border px-3 py-1.5 text-sm font-medium transition-colors',
                      checked ? 'bg-primary border-primary text-primary-foreground' : 'border-input hover:bg-accent'
                    )}
                  >
                    {option.label}
                  </button>
                );
              })}
            </div>
            <FormMessage />
          </FormItem>
        );
      }}
    />
  );
};

export default RHFChipToggleGroup;
