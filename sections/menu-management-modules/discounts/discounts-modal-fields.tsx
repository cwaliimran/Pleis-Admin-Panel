'use client';

import { Button } from '@/components/ui/button';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { useGetMenuItemByMenuIdQuery } from '@/store/Reducer/menu-items-api';
import { useGetMenuListQuery } from '@/store/Reducer/menu-list-api';
import { Check, ChevronsUpDown, Loader2, X } from 'lucide-react';
import { FC, useEffect, useMemo, useState } from 'react';
import { useFormContext, useWatch } from 'react-hook-form';
import { DiscountMenuItemRef, DiscountMenuRef } from './types';

const EMPTY_ITEM_REFS: DiscountMenuItemRef[] = [];

const DISCOUNT_TYPE_OPTIONS = [
  { value: 'percentage', label: '% Percentage' },
  { value: 'fixed', label: '€ Fixed amount' },
];

export const DiscountTypeCards = () => {
  const { control } = useFormContext();

  return (
    <FormField
      control={control}
      name="type"
      render={({ field }) => (
        <FormItem>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {DISCOUNT_TYPE_OPTIONS.map((option) => {
              const selected = field.value === option.value;
              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => field.onChange(option.value)}
                  className={cn(
                    'cursor-pointer rounded-lg border p-3 text-center font-semibold transition-colors',
                    selected ? 'border-amber-500 bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400' : 'border-input hover:bg-accent'
                  )}
                >
                  {option.label}
                </button>
              );
            })}
          </div>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

interface ItemsPickerProps {
  name: string;
  companyId?: string | null;
  userType: 'organizer' | 'super-admin';
  /** Items already selected before the modal opened (edit mode) — kept visible/checkable even if their menu isn't currently browsed. */
  initialItemRefs?: DiscountMenuItemRef[];
  /** Reports the summed base price of the selected items, and whether a price is known for every one of them. */
  onTotalChange?: (total: number, allPricesKnown: boolean) => void;
}

export const ItemsPicker: FC<ItemsPickerProps> = ({ name, companyId, userType, initialItemRefs = EMPTY_ITEM_REFS, onTotalChange }) => {
  const { control } = useFormContext();
  const [menuId, setMenuId] = useState(() => initialItemRefs.find((item) => item.menu?._id)?.menu?._id || '');
  const [open, setOpen] = useState(false);

  const { data: menuData, isLoading: menuLoading } = useGetMenuListQuery(
    {
      page: 0,
      limit: 100,
      search: '',
      status: '',
      companyOrganizer: userType === 'super-admin' ? companyId || undefined : undefined,
    },
    { skip: userType === 'super-admin' && !companyId }
  );
  const menus: DiscountMenuRef[] = useMemo(() => menuData?.data || [], [menuData]);

  const menuOptions = useMemo(() => {
    const byId = new Map<string, DiscountMenuRef>();
    menus.forEach((menu) => byId.set(menu._id, menu));
    initialItemRefs.forEach((item) => {
      if (item.menu?._id && !byId.has(item.menu._id)) byId.set(item.menu._id, item.menu);
    });
    return Array.from(byId.values());
  }, [menus, initialItemRefs]);

  const { data: menuItemsData, isFetching: itemsLoading } = useGetMenuItemByMenuIdQuery({ menuId }, { skip: !menuId });
  const browsableItems: DiscountMenuItemRef[] = menuItemsData?.data || [];

  // Title lookup for chips — accumulates every item we've ever fetched across menu switches
  // (seeded with whatever was already selected in edit mode) so a chip never regresses to a
  // raw ID just because the user has since browsed a different menu.
  const [knownItems, setKnownItems] = useState<Map<string, DiscountMenuItemRef>>(() => {
    const map = new Map<string, DiscountMenuItemRef>();
    initialItemRefs.forEach((item) => map.set(item._id, item));
    return map;
  });

  useEffect(() => {
    if (browsableItems.length === 0) return;
    setKnownItems((prev) => {
      const next = new Map(prev);
      let changed = false;
      browsableItems.forEach((item) => {
        const existing = next.get(item._id);
        if (existing?.title !== item.title || existing?.basePrice !== item.basePrice) {
          next.set(item._id, item);
          changed = true;
        }
      });
      return changed ? next : prev;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [browsableItems]);

  const watchedIds = useWatch({ control, name });
  const selectedIds: string[] = useMemo(() => watchedIds || [], [watchedIds]);

  const totals = useMemo(() => {
    let total = 0;
    let allPricesKnown = true;
    selectedIds.forEach((id) => {
      const price = knownItems.get(id)?.basePrice;
      if (typeof price === 'number' && !isNaN(price)) total += price;
      else allPricesKnown = false;
    });
    return { total, allPricesKnown: allPricesKnown && selectedIds.length > 0 };
  }, [selectedIds, knownItems]);

  useEffect(() => {
    onTotalChange?.(totals.total, totals.allPricesKnown);
  }, [totals, onTotalChange]);

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => {
        const selected: string[] = field.value || [];

        const toggle = (id: string) => {
          const next = selected.includes(id) ? selected.filter((v) => v !== id) : [...selected, id];
          field.onChange(next);
        };

        const remove = (id: string) => field.onChange(selected.filter((v) => v !== id));

        return (
          <FormItem>
            <div className="flex flex-col gap-3">
              <div>
                <FormLabel>Menu</FormLabel>
                <Select
                  value={menuId}
                  onValueChange={(nextMenuId) => {
                    if (nextMenuId === menuId) return;
                    setMenuId(nextMenuId);
                    field.onChange([]);
                  }}
                  disabled={menuLoading}
                >
                  <SelectTrigger className="mt-2 w-full">
                    <SelectValue placeholder={menuLoading ? 'Loading menus...' : 'Select a menu to browse its items'} />
                  </SelectTrigger>
                  <SelectContent className="dark:bg-secondary">
                    {menuOptions.map((menu) => (
                      <SelectItem key={menu._id} value={menu._id}>
                        {menu.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-muted-foreground mt-1.5 text-xs">Changing the menu clears the selected items.</p>
              </div>

              <div>
                <FormLabel>Menu Items</FormLabel>

                {/* modal keeps wheel/touch scrolling working when the popover is portaled outside a Dialog's scroll lock */}
                <Popover open={open} onOpenChange={setOpen} modal>
                  <PopoverTrigger asChild>
                    <Button
                      type="button"
                      variant="outline"
                      role="combobox"
                      aria-expanded={open}
                      disabled={!menuId}
                      className={cn('mt-2 h-9 w-full justify-between font-normal', selected.length === 0 && 'text-muted-foreground')}
                    >
                      <span className="truncate">
                        {!menuId ? 'Select a menu first' : selected.length > 0 ? `${selected.length} item(s) selected` : 'Select items...'}
                      </span>
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>

                  <PopoverContent className="w-(--radix-popover-trigger-width) p-0" align="start">
                    <Command className="dark:bg-secondary">
                      <CommandInput placeholder="Search items..." />

                      <CommandList className="max-h-64 overflow-y-auto">
                        {itemsLoading && (
                          <div className="text-muted-foreground flex items-center justify-center gap-2 py-4 text-sm">
                            <Loader2 className="h-4 w-4 animate-spin" />
                            Loading items...
                          </div>
                        )}

                        {!itemsLoading && browsableItems.length === 0 && <CommandEmpty>This menu has no items.</CommandEmpty>}

                        {!itemsLoading && (
                          <CommandGroup>
                            {browsableItems.map((item) => {
                              const checked = selected.includes(item._id);
                              return (
                                <CommandItem key={item._id} value={item.title} className="cursor-pointer" onSelect={() => toggle(item._id)}>
                                  <Check className={cn('mr-2 h-4 w-4', checked ? 'opacity-100' : 'opacity-0')} />
                                  {item.title}
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
                      <span
                        key={id}
                        className="bg-accent flex items-center gap-1.5 rounded-full py-1 pr-1.5 pl-3 text-xs font-medium"
                      >
                        {knownItems.get(id)?.title || id}
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

                {selected.length > 0 && (
                  <p className="text-muted-foreground mt-2 text-xs">
                    Items total: <span className="text-foreground font-medium tabular-nums">€{totals.total.toFixed(2)}</span>
                    {!totals.allPricesKnown ? ' · some item prices unavailable' : ''}
                  </p>
                )}
              </div>
            </div>
            <FormMessage />
          </FormItem>
        );
      }}
    />
  );
};
