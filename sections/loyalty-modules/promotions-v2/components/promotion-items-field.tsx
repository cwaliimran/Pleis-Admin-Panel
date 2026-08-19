'use client';

import { FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { X } from 'lucide-react';
import React from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { MenuItemOption } from '../types';

interface PromotionItemsFieldProps {
  name: string;
  label: string;
  placeholder?: string;
  options: MenuItemOption[];
  disabled?: boolean;
}

export const PromotionItemsField: React.FC<PromotionItemsFieldProps> = ({
  name,
  label,
  placeholder = 'Choose item to add...',
  options,
  disabled = false,
}) => {
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
            <label className="text-sm font-medium">{label}</label>

            <Select value="" disabled={disabled || available.length === 0} onValueChange={(value) => field.onChange([...selectedIds, value])}>
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

            {fieldState.error && <FormMessage>{fieldState.error.message}</FormMessage>}
          </div>
        );
      }}
    />
  );
};

export default PromotionItemsField;
