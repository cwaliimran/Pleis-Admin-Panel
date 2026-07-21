'use client';

import { FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { Check } from 'lucide-react';
import { FC, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { mockMenuItemsData, mockMenus } from '../menuItems/data';
import { mockSubcategories } from '../menuSubcategories/data';

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
}

export const ItemsPicker: FC<ItemsPickerProps> = ({ name }) => {
  const { control } = useFormContext();
  const [menuFilter, setMenuFilter] = useState('all');

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

        const visibleItems = menuFilter === 'all' ? mockMenuItemsData : mockMenuItemsData.filter((item) => item.menuIds.includes(menuFilter));

        return (
          <FormItem>
            <div className="flex flex-col gap-3">
              <div>
                <FormLabel>Menu</FormLabel>
                <Select value={menuFilter} onValueChange={setMenuFilter}>
                  <SelectTrigger className="mt-2 w-full">
                    <SelectValue placeholder="All menus" />
                  </SelectTrigger>
                  <SelectContent className="dark:bg-secondary">
                    <SelectItem value="all">All menus</SelectItem>
                    {mockMenus.map((menu) => (
                      <SelectItem key={menu._id} value={menu._id}>
                        {menu.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="overflow-hidden rounded-lg border">
                <div className="bg-muted/50 flex items-center justify-between px-3 py-2 text-xs font-medium">
                  <span>Select items</span>
                  <span className="text-primary font-semibold">{selected.length} selected</span>
                </div>

                <div className="max-h-64 overflow-y-auto">
                  {visibleItems.map((item) => {
                    const checked = selected.includes(item._id);
                    const subcategoryTitle = mockSubcategories.find((sub) => sub._id === item.subcategoryId)?.title;
                    return (
                      <button
                        key={item._id}
                        type="button"
                        onClick={() => toggle(item._id)}
                        className="hover:bg-accent flex w-full cursor-pointer items-center gap-3 border-t px-3 py-2 text-left"
                      >
                        <span
                          className={cn(
                            'flex h-4 w-4 shrink-0 items-center justify-center rounded-[4px] border',
                            checked ? 'border-primary bg-primary text-primary-foreground' : 'border-input'
                          )}
                        >
                          {checked && <Check className="h-3.5 w-3.5" />}
                        </span>
                        <div>
                          <p className="text-sm font-medium">{item.title}</p>
                          <p className="text-muted-foreground text-xs">
                            {subcategoryTitle} · €{item.price.toFixed(2)}
                          </p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
            <FormMessage />
          </FormItem>
        );
      }}
    />
  );
};
