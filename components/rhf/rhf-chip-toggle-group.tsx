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

interface RHFChipToggleGroupProps {
  name: string;
  label?: string;
  helperText?: string;
  options: Option[];
  className?: string;
  showSelectAll?: boolean;
  selectAllLabel?: string;
}

const RHFChipToggleGroup: FC<RHFChipToggleGroupProps> = ({
  name,
  label,
  helperText,
  options,
  className,
  showSelectAll = false,
  selectAllLabel = 'Select all',
}) => {
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

        const allSelected = options.length > 0 && options.every((option) => selected.includes(option.value));
        const toggleAll = () => field.onChange(allSelected ? [] : options.map((option) => option.value));

        const selectAllBadge = showSelectAll ? (
          <button
            type="button"
            role="checkbox"
            aria-checked={allSelected}
            onClick={toggleAll}
            className={cn(
              'flex cursor-pointer items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium transition-colors',
              allSelected ? 'border-primary bg-primary/10 text-primary' : 'border-input text-muted-foreground hover:bg-accent'
            )}
          >
            <span
              className={cn(
                'flex h-3.5 w-3.5 items-center justify-center rounded-[4px] border transition-colors',
                allSelected ? 'border-primary bg-primary text-primary-foreground' : 'border-input'
              )}
            >
              {allSelected && <Check className="h-2.5 w-2.5" strokeWidth={3} />}
            </span>
            {selectAllLabel}
          </button>
        ) : null;

        return (
          <FormItem>
            {(label || selectAllBadge) && (
              <div className="flex items-center justify-between gap-3">
                {label ? (
                  <FormLabel>
                    {label}
                    {helperText && <span className="text-muted-foreground ml-1 text-xs font-normal">{helperText}</span>}
                  </FormLabel>
                ) : (
                  <span />
                )}
                {selectAllBadge}
              </div>
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
