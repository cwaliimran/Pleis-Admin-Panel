'use client';

import { FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { cn } from '@/lib/utils';
import { Check } from 'lucide-react';
import { FC } from 'react';
import { useFormContext } from 'react-hook-form';

interface Option {
  value: string;
  label: string;
}

interface RHFCheckboxGroupProps {
  name: string;
  label?: string;
  helperText?: string;
  options: Option[];
  className?: string;
}

const RHFCheckboxGroup: FC<RHFCheckboxGroupProps> = ({ name, label, helperText, options, className }) => {
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
            <div className={cn('grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4', className)}>
              {options.map((option) => {
                const checked = selected.includes(option.value);
                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => toggle(option.value)}
                    className={cn(
                      'flex cursor-pointer items-center gap-2 rounded-md border px-3 py-2 text-left text-sm transition-colors',
                      checked ? 'border-primary bg-primary/5 text-primary' : 'border-input hover:bg-accent'
                    )}
                  >
                    <span
                      className={cn(
                        'flex h-4 w-4 shrink-0 items-center justify-center rounded-[4px] border',
                        checked ? 'border-primary bg-primary text-primary-foreground' : 'border-input'
                      )}
                    >
                      {checked && <Check className="h-3.5 w-3.5" />}
                    </span>
                    <span>{option.label}</span>
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

export default RHFCheckboxGroup;
