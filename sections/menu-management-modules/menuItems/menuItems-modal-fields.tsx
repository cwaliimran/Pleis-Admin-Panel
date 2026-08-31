'use client';

import { Button } from '@/components/ui/button';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { Check, ChevronsUpDown, Loader2, X } from 'lucide-react';
import { FC, ReactNode, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { formatTagLabel, normalizeTagName } from './menuItems-utils';
import { SummaryOption } from './types';

interface ToggleRowProps {
  name: string;
  title: ReactNode;
  description: string;
  isChecked?: (value: any) => boolean;
  toValue?: (checked: boolean) => any;
}

export const ToggleRow: FC<ToggleRowProps> = ({ name, title, description, isChecked = (value) => !!value, toValue = (checked) => checked }) => {
  const { control } = useFormContext();

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => {
        const checked = isChecked(field.value);
        return (
          <FormItem className="flex flex-row items-center justify-between gap-4 py-2">
            <div>
              <p className="flex items-center gap-1 text-sm font-medium">{title}</p>
              <p className="text-muted-foreground text-xs">{description}</p>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={checked}
              onClick={() => field.onChange(toValue(!checked))}
              className={cn('relative h-6 w-11 shrink-0 cursor-pointer rounded-full transition-colors', checked ? 'bg-primary' : 'bg-input')}
            >
              <span
                className={cn('absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform', checked && 'translate-x-5')}
              />
            </button>
          </FormItem>
        );
      }}
    />
  );
};

interface SummaryMultiSelectProps {
  name: string;
  label: string;
  placeholder?: string;
  options: SummaryOption[];
  loading?: boolean;
  /** Option names that can't coexist with any other selection — picking one clears the rest, e.g. "All Day". */
  exclusiveOptionNames?: string[];
}

/** Multi-select dropdown + removable chips for a fully-fetched, bounded taxonomy list (diet tags, allergens). */
export const SummaryMultiSelect: FC<SummaryMultiSelectProps> = ({
  name,
  label,
  placeholder = 'Select...',
  options,
  loading,
  exclusiveOptionNames = [],
}) => {
  const { control } = useFormContext();
  const [open, setOpen] = useState(false);

  const exclusiveNames = exclusiveOptionNames.map(normalizeTagName);
  const isExclusive = (id: string) => {
    const option = options.find((item) => item._id === id);
    return !!option && exclusiveNames.includes(normalizeTagName(option.name));
  };

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => {
        // Drop ids the API left unpopulated — they'd render a chip with no key and no label.
        const selected: string[] = (field.value || []).filter(Boolean);

        const toggle = (id: string) => {
          if (selected.includes(id)) {
            field.onChange(selected.filter((v) => v !== id));
            return;
          }
          // An exclusive pick replaces everything; any other pick drops a previously selected exclusive one.
          field.onChange(isExclusive(id) ? [id] : [...selected.filter((v) => !isExclusive(v)), id]);
        };

        const remove = (id: string) => field.onChange(selected.filter((v) => v !== id));

        return (
          <FormItem>
            <FormLabel>{label}</FormLabel>

            {/* modal keeps wheel/touch scrolling working when the popover is portaled outside a Dialog's scroll lock */}
            <Popover open={open} onOpenChange={setOpen} modal>
              <PopoverTrigger asChild>
                <Button
                  type="button"
                  variant="outline"
                  role="combobox"
                  aria-expanded={open}
                  disabled={loading}
                  className={cn('mt-2 h-9 w-full justify-between font-normal', selected.length === 0 && 'text-muted-foreground')}
                >
                  <span className="truncate">
                    {loading ? 'Loading...' : selected.length > 0 ? `${selected.length} selected` : placeholder}
                  </span>
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>

              <PopoverContent className="w-(--radix-popover-trigger-width) p-0" align="start">
                <Command className="dark:bg-secondary">
                  <CommandInput placeholder="Search..." />
                  <CommandList className="max-h-64 overflow-y-auto">
                    {loading && (
                      <div className="text-muted-foreground flex items-center justify-center gap-2 py-4 text-sm">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Loading...
                      </div>
                    )}

                    {!loading && options.length === 0 && <CommandEmpty>No options available.</CommandEmpty>}

                    {!loading && (
                      <CommandGroup>
                        {options.map((option) => {
                          const checked = selected.includes(option._id);
                          const optionLabel = formatTagLabel(option.name);
                          return (
                            <CommandItem key={option._id} value={optionLabel} className="cursor-pointer" onSelect={() => toggle(option._id)}>
                              <Check className={cn('mr-2 h-4 w-4', checked ? 'opacity-100' : 'opacity-0')} />
                              {optionLabel}
                            </CommandItem>
                          );
                        })}
                      </CommandGroup>
                    )}
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>

            {selected.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-2">
                {selected.map((id) => (
                  <span key={id} className="bg-accent flex items-center gap-1.5 rounded-full py-1 pr-1.5 pl-3 text-xs font-medium">
                    {formatTagLabel(options.find((option) => option._id === id)?.name) || id}
                    <button
                      type="button"
                      onClick={() => remove(id)}
                      className="hover:bg-background cursor-pointer rounded-full p-0.5 transition hover:text-red-500"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}
            <FormMessage />
          </FormItem>
        );
      }}
    />
  );
};
