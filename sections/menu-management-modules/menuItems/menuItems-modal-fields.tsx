'use client';

import { FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { Check, CircleDot, X } from 'lucide-react';
import { FC, ReactNode } from 'react';
import { useFormContext } from 'react-hook-form';
import { MenuItemRecord } from './types';

const QUANTITY_TYPE_OPTIONS = [
  { value: 'single', title: 'Single item', description: 'One standalone product — drink, dish, or snack' },
  { value: 'combo', title: 'Combo', description: 'Bundle of 2+ single items at a combined price' },
];

export const QuantityTypeCards = () => {
  const { control } = useFormContext();

  return (
    <FormField
      control={control}
      name="quantityType"
      render={({ field }) => (
        <FormItem>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {QUANTITY_TYPE_OPTIONS.map((option) => {
              const selected = field.value === option.value;
              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => field.onChange(option.value)}
                  className={cn(
                    'relative cursor-pointer rounded-lg border p-3 text-left transition-colors',
                    selected ? 'border-primary bg-primary/10 dark:bg-primary/15' : 'border-input hover:bg-accent'
                  )}
                >
                  {selected && (
                    <span className="bg-primary text-primary-foreground absolute top-2 right-2 flex h-4 w-4 items-center justify-center rounded-full">
                      <Check className="h-2.5 w-2.5" />
                    </span>
                  )}
                  <div className={cn('flex items-center gap-1.5 text-sm font-semibold', selected && 'text-primary')}>
                    {option.value === 'combo' && <CircleDot className="h-4 w-4" />}
                    {option.title}
                  </div>
                  <p className="text-muted-foreground mt-1 text-xs">{option.description}</p>
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

interface ComboItemsPickerProps {
  name: string;
  allItems: MenuItemRecord[];
  excludeId?: string;
}

export const ComboItemsPicker: FC<ComboItemsPickerProps> = ({ name, allItems, excludeId }) => {
  const { control } = useFormContext();

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => {
        const selectedIds: string[] = field.value || [];
        const selectedItems = selectedIds.map((id) => allItems.find((item) => item._id === id)).filter(Boolean) as MenuItemRecord[];
        const availableItems = allItems.filter(
          (item) => item._id !== excludeId && item.quantityType === 'single' && !selectedIds.includes(item._id)
        );
        const sumOfParts = selectedItems.reduce((sum, item) => sum + item.price, 0);

        const addItem = (id: string) => field.onChange([...selectedIds, id]);
        const removeItem = (id: string) => field.onChange(selectedIds.filter((v) => v !== id));

        return (
          <FormItem>
            <FormLabel>Combo items</FormLabel>
            <div className="overflow-hidden rounded-lg border">
              <div className="bg-muted/50 flex items-center justify-between px-3 py-2 text-xs font-medium">
                <span className="text-destructive">Minimum 2 required</span>
                <span>{selectedItems.length} items added</span>
              </div>

              {selectedItems.map((item) => (
                <div key={item._id} className="flex items-center justify-between border-t px-3 py-2">
                  <span className="text-sm font-medium">{item.title}</span>
                  <div className="flex items-center gap-3">
                    <span className="text-sm">€{item.price.toFixed(2)}</span>
                    <button
                      type="button"
                      title="Remove from combo"
                      onClick={() => removeItem(item._id)}
                      className="cursor-pointer rounded-md border p-1 hover:bg-accent"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              ))}

              {availableItems.length > 0 && (
                <div className="border-t p-2">
                  <Select onValueChange={addItem} value="">
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="+ Add item to combo..." />
                    </SelectTrigger>
                    <SelectContent className="dark:bg-secondary">
                      {availableItems.map((item) => (
                        <SelectItem key={item._id} value={item._id}>
                          {item.title} — €{item.price.toFixed(2)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              <div className="bg-muted/50 flex items-center justify-between border-t px-3 py-2 text-sm font-semibold">
                <span>Sum of parts</span>
                <span>€{sumOfParts.toFixed(2)}</span>
              </div>
            </div>
            <FormMessage />
          </FormItem>
        );
      }}
    />
  );
};

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
