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
import { FC, useEffect, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { DiscountMenuItemRef } from './types';

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
}

export const ItemsPicker: FC<ItemsPickerProps> = ({ name, companyId, userType, initialItemRefs = [] }) => {
  const { control } = useFormContext();
  const [menuId, setMenuId] = useState('');
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
  const menus = menuData?.data || [];

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
        if (next.get(item._id)?.title !== item.title) {
          next.set(item._id, item);
          changed = true;
        }
      });
      return changed ? next : prev;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [browsableItems]);

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
                <Select value={menuId} onValueChange={setMenuId} disabled={menuLoading}>
                  <SelectTrigger className="mt-2 w-full">
                    <SelectValue placeholder={menuLoading ? 'Loading menus...' : 'Select a menu to browse its items'} />
                  </SelectTrigger>
                  <SelectContent className="dark:bg-secondary">
                    {menus.map((menu: { _id: string; title: string }) => (
                      <SelectItem key={menu._id} value={menu._id}>
                        {menu.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
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
              </div>
            </div>
            <FormMessage />
          </FormItem>
        );
      }}
    />
  );
};
