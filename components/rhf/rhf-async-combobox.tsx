'use client';

import { Button } from '@/components/ui/button';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { Check, ChevronsUpDown, Loader2, X } from 'lucide-react';
import { UIEvent, useEffect, useState } from 'react';
import { useFormContext } from 'react-hook-form';

const SCROLL_THRESHOLD_PX = 48;
const SEARCH_DEBOUNCE_MS = 300;

type QueryMeta = {
  currentPage?: number;
  totalPages?: number;
};

type QueryResult = {
  data?: { data: any[]; meta?: QueryMeta };
  isLoading: boolean;
  isFetching: boolean;
};

type RHFAsyncComboboxProps = {
  name: string;
  label?: string;
  placeholder?: string;
  searchPlaceholder?: string;
  disabled?: boolean;
  className?: string;
  /** Records fetched per page. */
  limit?: number;
  /** Label shown for the current value when it isn't in the loaded pages (e.g. edit mode). Single-select only. */
  selectedLabel?: string;
  /** Allow selecting more than one option — the RHF field value becomes `string[]` instead of `string`. */
  multiple?: boolean;
  /**
   * Multi-select only: `{value, label}` pairs for options already selected before this field
   * mounted (e.g. edit mode) so their chips show the right label even before/without being
   * fetched — mirrors `selectedLabel`'s purpose for the single-select case.
   */
  initialSelected?: { value: string; label: string }[];
  /**
   * Extra fixed filter params merged into every query call (e.g. `{ category: categoryId }`
   * for a subcategory field cascading off a category field). Changing this resets the loaded
   * pages back to page 1.
   */
  queryArgs?: Record<string, any>;
  /** Skip fetching entirely — e.g. a dependent field before its parent field has a value. */
  skip?: boolean;
  /**
   * Hides fetched options the caller can't offer (e.g. the record being deleted). Applied to the
   * rendered list only — paging and search still run against the full server result.
   */
  filterOption?: (item: any) => boolean;
  /**
   * Any RTK Query list hook following the project convention:
   * accepts { page (0-based, slice adds +1), limit, search, ...queryArgs } and an optional
   * `{ skip }` options object, returning { data: { data, meta } }.
   */
  useOptionsQuery: (
    args: { page: number; limit: number; search: string } & Record<string, any>,
    options?: { skip?: boolean }
  ) => QueryResult;
  getOptionValue: (item: any) => string;
  getOptionLabel: (item: any) => string;
  /**
   * Fires after a user picks an option — use it to clear dependent cascading fields, or to read the
   * picked record off `item` (the full option object) to prefill other fields from it.
   * Not called on programmatic resets.
   */
  onValueChange?: (value: string, item?: any) => void;
};

const RHFAsyncCombobox = ({
  name,
  label,
  placeholder = 'Select option',
  searchPlaceholder = 'Search...',
  disabled = false,
  className = '',
  limit = 50,
  selectedLabel,
  multiple = false,
  initialSelected,
  queryArgs,
  skip = false,
  filterOption,
  useOptionsQuery,
  getOptionValue,
  getOptionLabel,
  onValueChange,
}: RHFAsyncComboboxProps) => {
  const { control } = useFormContext();

  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [page, setPage] = useState(1);
  const [items, setItems] = useState<any[]>([]);

  // Multi-select only: accumulates every option we've ever fetched (seeded with whatever was
  // already selected pre-mount) so a chip's label never regresses to a raw id after a search or
  // page reset evicts it from `items` — same fix as the Discounts items picker needed.
  const [knownLabels, setKnownLabels] = useState<Map<string, string>>(
    () => new Map((initialSelected || []).map((option) => [option.value, option.label]))
  );

  const queryArgsKey = JSON.stringify(queryArgs || {});
  const initialSelectedKey = JSON.stringify(initialSelected || []);

  // `initialSelected` often arrives after mount (a modal rendered before its record has loaded, or
  // one kept mounted across opens), so the lazy useState seed above can miss it entirely. Merge
  // later arrivals in rather than letting those chips fall back to raw ids.
  useEffect(() => {
    if (!initialSelected?.length) return;
    setKnownLabels((prev) => {
      const next = new Map(prev);
      let changed = false;
      initialSelected.forEach((option) => {
        if (next.get(option.value) !== option.label) {
          next.set(option.value, option.label);
          changed = true;
        }
      });
      return changed ? next : prev;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialSelectedKey]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, SEARCH_DEBOUNCE_MS);
    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    setPage(1);
    setItems([]);
  }, [queryArgsKey]);

  const { data, isLoading, isFetching } = useOptionsQuery(
    { page: page - 1, limit, search: debouncedSearch, ...queryArgs },
    { skip }
  );

  const meta = data?.meta;
  const hasMore = (meta?.currentPage || 1) < (meta?.totalPages || 1);

  useEffect(() => {
    if (!data?.data) return;
    const fetchedPage = data.meta?.currentPage ?? 1;
    setItems((prev) => {
      if (fetchedPage <= 1) return data.data;
      const merged = [...prev];
      data.data.forEach((item) => {
        if (!merged.some((existing) => getOptionValue(existing) === getOptionValue(item))) {
          merged.push(item);
        }
      });
      return merged;
    });

    if (multiple) {
      setKnownLabels((prev) => {
        const next = new Map(prev);
        let changed = false;
        data.data.forEach((item) => {
          const value = getOptionValue(item);
          const label = getOptionLabel(item);
          if (next.get(value) !== label) {
            next.set(value, label);
            changed = true;
          }
        });
        return changed ? next : prev;
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  const handleScroll = (event: UIEvent<HTMLDivElement>) => {
    const el = event.currentTarget;
    const nearBottom = el.scrollHeight - el.scrollTop - el.clientHeight < SCROLL_THRESHOLD_PX;
    if (nearBottom && hasMore && !isFetching) {
      setPage((prev) => prev + 1);
    }
  };

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => {
        const visibleItems = filterOption ? items.filter(filterOption) : items;
        const selectedValues: string[] = multiple ? (Array.isArray(field.value) ? field.value : []) : [];
        const selectedItem = !multiple ? items.find((item) => getOptionValue(item) === field.value) : undefined;
        const triggerLabel = multiple
          ? selectedValues.length > 0
            ? `${selectedValues.length} selected`
            : undefined
          : selectedItem
            ? getOptionLabel(selectedItem)
            : field.value
              ? selectedLabel
              : undefined;

        const handleSelect = (value: string) => {
          if (multiple) {
            const next = selectedValues.includes(value) ? selectedValues.filter((v) => v !== value) : [...selectedValues, value];
            field.onChange(next);
          } else {
            field.onChange(value);
            setOpen(false);
          }
          onValueChange?.(
            value,
            items.find((item) => getOptionValue(item) === value)
          );
        };

        const removeValue = (value: string) => {
          field.onChange(selectedValues.filter((v) => v !== value));
        };

        return (
          <FormItem className={cn('w-full', className)}>
            {label && <FormLabel>{label}</FormLabel>}
            {/* modal keeps wheel/touch scrolling working when the popover is portaled outside a Dialog's scroll lock */}
            <Popover open={open} onOpenChange={setOpen} modal>
              <PopoverTrigger asChild>
                <FormControl>
                  <Button
                    type="button"
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    disabled={disabled}
                    className={cn('h-9 w-full justify-between font-normal', !triggerLabel && 'text-muted-foreground')}
                  >
                    <span className="truncate">{triggerLabel || placeholder}</span>
                    {isLoading || isFetching ? (
                      <Loader2 className="ml-2 h-4 w-4 shrink-0 animate-spin opacity-50" />
                    ) : (
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    )}
                  </Button>
                </FormControl>
              </PopoverTrigger>

              <PopoverContent className="w-(--radix-popover-trigger-width) p-0" align="start">
                <Command shouldFilter={false} className="dark:bg-secondary">
                  <CommandInput placeholder={searchPlaceholder} value={search} onValueChange={setSearch} />

                  <CommandList className="max-h-55 overflow-y-auto" onScroll={handleScroll}>
                    {!isLoading && !isFetching && visibleItems.length === 0 && <CommandEmpty>No results found.</CommandEmpty>}

                    <CommandGroup>
                      {visibleItems.map((item) => {
                        const value = getOptionValue(item);
                        const checked = multiple ? selectedValues.includes(value) : field.value === value;
                        return (
                          <CommandItem key={value} value={value} className="cursor-pointer" onSelect={() => handleSelect(value)}>
                            <Check className={cn('mr-2 h-4 w-4', checked ? 'opacity-100' : 'opacity-0')} />
                            {getOptionLabel(item)}
                          </CommandItem>
                        );
                      })}
                    </CommandGroup>

                    {(isLoading || isFetching) && (
                      <div className="text-muted-foreground flex items-center justify-center gap-2 py-2 text-sm">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Loading...
                      </div>
                    )}
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>

            {multiple && selectedValues.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-2">
                {selectedValues.map((value) => (
                  <span key={value} className="bg-accent flex items-center gap-1.5 rounded-full py-1 pr-1.5 pl-3 text-xs font-medium">
                    {knownLabels.get(value) || value}
                    <button
                      type="button"
                      onClick={() => removeValue(value)}
                      className="hover:bg-background cursor-pointer rounded-full p-0.5 transition hover:text-red-500"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}

            {/* Hidden input to support RHF blur + validation */}
            <input
              type="hidden"
              onBlur={field.onBlur}
              value={Array.isArray(field.value) ? field.value.join(',') : field.value || ''}
              name={field.name}
              ref={field.ref}
            />

            <FormMessage />
          </FormItem>
        );
      }}
    />
  );
};

export default RHFAsyncCombobox;
