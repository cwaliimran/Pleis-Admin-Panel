'use client';

import { Button } from '@/components/ui/button';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { noImageUrl, noImageUrlDev, noImageUrlDevCap } from '@/constant/constant';
import { cn } from '@/lib/utils';
import { ChevronsUpDown, Loader2, Plus, TriangleAlert, X } from 'lucide-react';
import { FC, ReactNode, useState } from 'react';
import { DAY_OPTIONS } from '../menuItems/constants';
import { describeDaypartOverlap, describeDaysOverlap, formatDaypartLabel } from './combos-utils';
import { ComboComponent, DerivedAvailability } from './types';

const PLACEHOLDER_IMAGE_URLS: string[] = [noImageUrl, noImageUrlDev, noImageUrlDevCap];

const hasRealImage = (image?: string) => !!image && !PLACEHOLDER_IMAGE_URLS.includes(image);

/** Section heading with the optional "· qualifier" affix used across the menu-management modals. */
export const SectionHeading: FC<{ title: string; affix?: ReactNode; affixClassName?: string }> = ({ title, affix, affixClassName }) => (
  <h4 className="text-muted-foreground flex flex-wrap items-center gap-x-1.5 border-b pb-2 text-xs font-semibold tracking-wide uppercase">
    <span>{title}</span>
    {affix ? <span className={cn(affixClassName)}>· {affix}</span> : null}
  </h4>
);

export const InfoCallout: FC<{ children: ReactNode }> = ({ children }) => (
  <div className="rounded-md border-l-4 border-blue-500 bg-blue-50 px-3 py-2.5 text-xs leading-relaxed text-blue-900 dark:bg-blue-950/40 dark:text-blue-200">
    {children}
  </div>
);

/** Read-only card wrapper used by each derived-availability block. */
const DerivedCard: FC<{ title: string; affix?: string; children: ReactNode; caption?: string }> = ({ title, affix, children, caption }) => (
  <div className="bg-muted/30 rounded-lg border p-3">
    <p className="mb-2 text-sm font-medium">
      {title}
      {affix ? <span className="text-muted-foreground ml-1 text-xs font-normal">· {affix}</span> : null}
    </p>
    {children}
    {caption ? <p className="text-muted-foreground mt-2 text-xs leading-relaxed">{caption}</p> : null}
  </div>
);

interface ComponentsCardProps {
  components: ComboComponent[];
  options: ComboComponent[];
  loading?: boolean;
  sumOfParts: number;
  onAdd: (id: string) => void;
  onRemove: (id: string) => void;
}

/** The combo's component list: one row per menu item, an inline picker, and a running sum of parts. */
export const ComponentsCard: FC<ComponentsCardProps> = ({ components, options, loading, sumOfParts, onAdd, onRemove }) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="overflow-hidden rounded-lg border">
      <div className="bg-muted/50 text-muted-foreground flex items-center justify-between border-b px-3 py-2 text-xs font-medium">
        <span>Menu items in this combo</span>
        <span>
          {components.length} {components.length === 1 ? 'item' : 'items'}
        </span>
      </div>

      {components.map((component) => (
        <div key={component._id} className="flex items-center gap-3 border-b px-3 py-2.5">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-md bg-gray-100 dark:bg-gray-800">
            {hasRealImage(component.image) ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={component.image} alt={component.title} className="h-full w-full object-cover" />
            ) : (
              <span className="text-sm font-semibold text-gray-500 dark:text-gray-300">{component.title?.[0]?.toUpperCase() || '?'}</span>
            )}
          </div>

          <span className="flex-1 truncate text-sm font-medium">{component.title}</span>

          <span className="text-muted-foreground shrink-0 text-xs whitespace-nowrap">1× · €{(component.basePrice || 0).toFixed(2)}</span>

          <button
            type="button"
            title="Remove from combo"
            onClick={() => onRemove(component._id)}
            className="hover:bg-accent shrink-0 cursor-pointer rounded-md border p-1 transition hover:text-red-500"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      ))}

      <div className="border-b p-2">
        <Popover open={open} onOpenChange={setOpen} modal>
          <PopoverTrigger asChild>
            <Button
              type="button"
              variant="outline"
              role="combobox"
              aria-expanded={open}
              disabled={loading}
              className="text-muted-foreground h-9 w-full justify-between font-normal"
            >
              <span className="flex items-center gap-1.5 truncate">
                <Plus className="h-3.5 w-3.5" />
                Add menu item to combo...
              </span>
              {loading ? (
                <Loader2 className="ml-2 h-4 w-4 shrink-0 animate-spin opacity-50" />
              ) : (
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              )}
            </Button>
          </PopoverTrigger>

          <PopoverContent className="w-(--radix-popover-trigger-width) p-0" align="start">
            <Command className="dark:bg-secondary">
              <CommandInput placeholder="Search menu items..." />
              <CommandList className="max-h-56 overflow-y-auto">
                <CommandEmpty>No menu items available.</CommandEmpty>
                <CommandGroup>
                  {options.map((option) => (
                    <CommandItem
                      key={option._id}
                      value={option.title}
                      className="cursor-pointer"
                      onSelect={() => {
                        onAdd(option._id);
                        setOpen(false);
                      }}
                    >
                      <span className="flex-1 truncate">{option.title}</span>
                      <span className="text-muted-foreground ml-2 text-xs">€{(option.basePrice || 0).toFixed(2)}</span>
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      </div>

      <div className="bg-muted/50 flex items-center justify-between px-3 py-2 text-sm">
        <span className="text-muted-foreground">Sum of parts</span>
        <span className="font-semibold">€{sumOfParts.toFixed(2)}</span>
      </div>
    </div>
  );
};

/** Days / daypart / allergens the combo inherits from its components — display only, never edited here. */
export const AvailabilityCards: FC<{ components: ComboComponent[]; availability: DerivedAvailability }> = ({ components, availability }) => {
  const hasComponents = components.length > 0;

  return (
    <div className="flex flex-col gap-3">
      <DerivedCard title="Available days" caption={hasComponents ? describeDaysOverlap(components, availability.days) : undefined}>
        <div className="flex flex-wrap gap-2">
          {DAY_OPTIONS.map((day) => {
            const active = availability.days.includes(day.value);
            return (
              <span
                key={day.value}
                className={cn(
                  'rounded-md border px-3 py-1.5 text-sm font-medium',
                  active ? 'bg-primary border-primary text-primary-foreground' : 'border-input text-muted-foreground'
                )}
              >
                {day.label}
              </span>
            );
          })}
        </div>
      </DerivedCard>

      <DerivedCard
        title="Daypart"
        caption={hasComponents ? describeDaypartOverlap(components, availability.dayparts, availability.isAllDay) : undefined}
      >
        <div className="flex flex-wrap gap-2">
          {availability.isAllDay ? (
            <span className="rounded-md bg-blue-100 px-2.5 py-1 text-xs font-medium text-blue-700 dark:bg-blue-950/60 dark:text-blue-300">
              All day
            </span>
          ) : availability.dayparts.length > 0 ? (
            availability.dayparts.map((daypart) => (
              <span
                key={daypart._id}
                className="rounded-md bg-blue-100 px-2.5 py-1 text-xs font-medium text-blue-700 capitalize dark:bg-blue-950/60 dark:text-blue-300"
              >
                {formatDaypartLabel(daypart)}
              </span>
            ))
          ) : (
            <span className="text-muted-foreground text-xs">No overlapping daypart</span>
          )}
        </div>
      </DerivedCard>

      <DerivedCard
        title="Allergens"
        affix="union of all components"
        caption="Every allergen present in any component is shown on the combo (EU 1169/2011)."
      >
        <div className="flex flex-wrap gap-2">
          {availability.allergens.length > 0 ? (
            availability.allergens.map((allergen) => (
              <span
                key={allergen._id}
                className="rounded-md bg-amber-100 px-2.5 py-1 text-xs font-medium text-amber-800 dark:bg-amber-950/60 dark:text-amber-300"
              >
                {allergen.name}
              </span>
            ))
          ) : (
            <span className="text-muted-foreground text-xs">None declared on the components</span>
          )}
        </div>
      </DerivedCard>

      {availability.isUnorderable && hasComponents ? (
        <div className="flex items-start gap-2 rounded-md border-l-4 border-red-500 bg-red-50 px-3 py-2.5 text-xs leading-relaxed text-red-900 dark:bg-red-950/40 dark:text-red-200">
          <TriangleAlert className="mt-0.5 h-3.5 w-3.5 shrink-0" />
          <span>
            These components share no common day or daypart, so this combo can never be ordered. It will be flagged{' '}
            <span className="font-semibold">Unorderable</span> until the overlap is fixed.
          </span>
        </div>
      ) : null}
    </div>
  );
};
