'use client';

import { FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { X } from 'lucide-react';
import React from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { MenuItemOption } from './types';

interface RewardMenuItemsFieldProps {
  name: string;
  options: MenuItemOption[];
  disabled?: boolean;
}

/**
 * An adder rather than a multi-select: pick an item and it becomes a chip.
 * Already-selected items drop out of the list so they cannot be added twice.
 */
export const RewardMenuItemsField: React.FC<RewardMenuItemsFieldProps> = ({ name, options, disabled = false }) => {
  const { control } = useFormContext();

  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => {
        const selectedIds: string[] = field.value || [];
        const available = options.filter((option) => !selectedIds.includes(option.id));
        const selected = selectedIds
          .map((id) => options.find((option) => option.id === id))
          .filter((option): option is MenuItemOption => Boolean(option));

        return (
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium">Add Menu Items</label>

            <Select
              // Reset to the placeholder after each pick so the same trigger can add again.
              value=""
              disabled={disabled || available.length === 0}
              onValueChange={(value) => field.onChange([...selectedIds, value])}
            >
              <SelectTrigger className="h-10 w-full cursor-pointer">
                <SelectValue placeholder={available.length === 0 ? 'All items added' : 'Choose item to add...'} />
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

            <p className="text-xs text-gray-500 dark:text-gray-400">Users will pick one of these items when claiming the reward.</p>

            {fieldState.error && <FormMessage>{fieldState.error.message}</FormMessage>}
          </div>
        );
      }}
    />
  );
};

export default RewardMenuItemsField;
