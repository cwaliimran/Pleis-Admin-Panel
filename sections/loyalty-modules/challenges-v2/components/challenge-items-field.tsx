'use client';

import { FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { X } from 'lucide-react';
import React from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { MenuItemOption } from '../types';

interface ChallengeItemsFieldProps {
  name: string;
  label: string;
  placeholder: string;
  options: MenuItemOption[];
  helperText?: string;
  disabled?: boolean;
}

/**
 * An adder rather than a multi-select: pick an item and it becomes a chip.
 * Used for both the qualifying items and the reward items.
 */
export const ChallengeItemsField: React.FC<ChallengeItemsFieldProps> = ({ name, label, placeholder, options, helperText, disabled = false }) => {
  const { control } = useFormContext();

  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => {
        const selectedIds: string[] = field.value || [];
        // Already-picked items drop out so they cannot be added twice.
        const available = options.filter((option) => !selectedIds.includes(option.id));
        const selected = selectedIds
          .map((id) => options.find((option) => option.id === id))
          .filter((option): option is MenuItemOption => Boolean(option));

        return (
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium">{label}</label>

            <Select
              // Reset to the placeholder after each pick so the trigger can add again.
              value=""
              disabled={disabled || available.length === 0}
              onValueChange={(value) => field.onChange([...selectedIds, value])}
            >
              <SelectTrigger className="h-10 w-full cursor-pointer">
                <SelectValue placeholder={available.length === 0 ? 'All items added' : placeholder} />
              </SelectTrigger>
              <SelectContent className="dark:bg-secondary">
                {available.map((option) => (
                  <SelectItem key={option.id} value={option.id} className="cursor-pointer">
                    {option.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {selected.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {selected.map((option) => (
                  <span
                    key={option.id}
                    className="inline-flex items-center gap-1.5 rounded-full bg-blue-100 px-2.5 py-1 text-xs font-medium text-blue-800 dark:bg-blue-900/40 dark:text-blue-200"
                  >
                    {option.name}
                    <button
                      type="button"
                      title={`Remove ${option.name}`}
                      aria-label={`Remove ${option.name}`}
                      disabled={disabled}
                      onClick={() => field.onChange(selectedIds.filter((id) => id !== option.id))}
                      className="cursor-pointer rounded-full transition hover:text-blue-950 disabled:cursor-not-allowed dark:hover:text-white"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}

            {helperText && <p className="text-xs text-gray-500 dark:text-gray-400">{helperText}</p>}

            {fieldState.error && <FormMessage>{fieldState.error.message}</FormMessage>}
          </div>
        );
      }}
    />
  );
};

export default ChallengeItemsField;
