'use client';

import { FC } from 'react';
import { useFormContext } from 'react-hook-form';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from '@/components/ui/popover';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { Check, ChevronsUpDown, X } from 'lucide-react';

interface Option {
  label: string;
  value: string;
}

interface RHFMultiSelectFieldProps {
  name: string;
  label?: string;
  placeholder?: string;
  options: Option[];
  className?: string;
  disabled?: boolean;
}

const RHFMultiSelectField: FC<RHFMultiSelectFieldProps> = ({
  name,
  label,
  placeholder = 'Select options',
  options,
  className,
  disabled,
}) => {
  const { control, watch, setValue } = useFormContext();

  const selectedValues: string[] = watch(name) || [];
  const selectedOptions = options.filter((o) =>
    selectedValues.includes(o.value)
  );

  return (
    <div className="flex flex-col gap-2">
      <FormField
        control={control}
        name={name}
        render={({ field }) => {
          const toggle = (val: string) => {
            const next = selectedValues.includes(val)
              ? selectedValues.filter((v) => v !== val)
              : [...selectedValues, val];
            field.onChange(next);
          };

          //   const clearOne = (val: string) => {
          //     field.onChange(selectedValues.filter(v => v !== val))
          //   }

          const clearAll = () => field.onChange([]);

          return (
            <FormItem>
              {label && <FormLabel>{label}</FormLabel>}

              {/* Dropdown */}
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      type="button"
                      variant="outline"
                      role="combobox"
                      aria-expanded="false"
                      className={cn(
                        className ||
                          'border-muted bg-background text-muted-foreground placeholder:text-muted-foreground focus:ring-primary min-h-[40px] w-full rounded-md border focus:ring-2 focus:outline-none',
                        disabled && 'cursor-not-allowed opacity-60'
                      )}
                      disabled={disabled}
                    >
                      <span className="text-muted-foreground flex-1 text-left">
                        {selectedOptions.length > 0
                          ? `${selectedOptions.length} selected`
                          : placeholder}
                      </span>
                      <ChevronsUpDown className="h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>

                <PopoverContent className="dark:bg-secondary z-[9999] max-h-[300px] w-[var(--radix-popover-trigger-width)] p-0">
                  <Command className="dark:bg-secondary">
                    <CommandInput placeholder="Search..." />
                    <CommandList>
                      <CommandEmpty>No options found.</CommandEmpty>
                      <CommandGroup className="dark:bg-secondary w-full">
                        {options.map((opt) => {
                          const checked = selectedValues.includes(opt.value);
                          return (
                            <CommandItem
                              key={opt.value}
                              value={opt.value}
                              onSelect={() => {
                                // e.preventDefault()
                                toggle(opt.value);
                              }}
                              className="cursor-pointer"
                            >
                              <div className="mr-2">
                                <Checkbox checked={checked} />
                              </div>
                              <span className="flex-1">{opt.label}</span>
                              {checked && <Check className="h-4 w-4" />}
                            </CommandItem>
                          );
                        })}
                      </CommandGroup>
                    </CommandList>

                    {selectedValues.length > 0 && (
                      <div className="border-t p-1 dark:bg-secondary">
                        <Button
                          type="button"
                          variant="ghost"
                          className="w-full"
                          onClick={clearAll}
                        >
                          Clear all
                        </Button>
                      </div>
                    )}
                  </Command>
                </PopoverContent>
              </Popover>

              {/* preserve blur event for RHF */}
              <input type="hidden" onBlur={field.onBlur} />
              <FormMessage />
            </FormItem>
          );
        }}
      />

      {/* Selected tags */}
      {selectedOptions.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-2">
          {selectedOptions.map((opt) => (
            <Badge
              key={opt.value}
              className="bg-secondary flex items-center gap-1 text-xs text-white dark:bg-white dark:text-black"
            >
              {opt.label}
              <button
                type="button"
                title="Remove Tag"
                onClick={() =>
                  setValue(
                    name,
                    selectedValues.filter((v) => v !== opt.value)
                  )
                }
                className="ml-1 rounded-full p-0.5 hover:bg-gray-200"
              >
                <X className="h-3 w-3 cursor-pointer" />
              </button>
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
};

export default RHFMultiSelectField;
