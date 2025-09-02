import * as React from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Controller, useFormContext } from 'react-hook-form';
import { FormLabel } from '@/components/ui/form';
import { FC } from 'react';

interface PageProps {
  label?: string;
  name: string;
  options: { value: string; label: string; disabled?: boolean }[];
  placeholder?: string;
}

const RHFSelectScrollable: FC<PageProps> = ({
  name,
  label,
  options,
  placeholder = 'Select',
}) => {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      rules={{ required: `${label} is required` }}
      render={({ field, fieldState }) => (
        <div className="space-y-2">
          {label && (
            <FormLabel className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              {label}
            </FormLabel>
          )}
          <Select
            onValueChange={field.onChange}
            value={field.value || ''}
            disabled={field.disabled}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder={placeholder} />
            </SelectTrigger>
            <SelectContent className="dark:bg-secondary border border-[#565656] max-h-72 overflow-y-auto">
              {options.map((opt) => (
                <SelectItem
                  key={opt.value}
                  value={opt.value}
                  disabled={opt.disabled}
                >
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {fieldState.error && (
            <p className="text-sm text-red-400">{fieldState.error.message}</p>
          )}
        </div>
      )}
    />
  );
};

export default RHFSelectScrollable;
