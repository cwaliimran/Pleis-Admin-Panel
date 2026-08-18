'use client';

import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { useGetMenuItemsV2Query } from '@/store/Reducer/order-management-v2-api';
import * as PopoverPrimitive from '@radix-ui/react-popover';
import { Check, ChevronDown, ImageIcon, Loader2, Plus, Search } from 'lucide-react';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { MENU_ITEM_PAGE_SIZE, formatCurrency } from './constants';
import { mapMenuItemOptions } from './mappers';
import type { MenuItemOption } from './types';

// Uses the Radix primitives rather than the shared `PopoverContent`, which
// portals to `<body>` — outside the Dialog's `react-remove-scroll` container,
// where the list cannot be scrolled at all. Portalling into the dialog
// element instead also escapes the scrolling body that would clip the panel.
//
// The endpoint returns the whole menu in one response — no page or keyword
// params — so search and paging are both local.

interface MenuItemPickerProps {
  organizationId?: string;
  /** Menu item ids already on the order — flagged as such, still pickable. */
  selectedIds: string[];
  disabled?: boolean;
  /** The dialog's content element; falls back to `<body>` when absent. */
  portalContainer?: HTMLElement | null;
  onSelect: (item: MenuItemOption) => void;
}

/** How close to the bottom, in px, before the next slice is revealed. */
const SCROLL_THRESHOLD_PX = 72;

export const MenuItemPicker: React.FC<MenuItemPickerProps> = ({
  organizationId,
  selectedIds,
  disabled = false,
  portalContainer,
  onSelect,
}) => {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [visibleCount, setVisibleCount] = useState(MENU_ITEM_PAGE_SIZE);

  const listRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  // Held until first opened — a big response to pull for an order nobody is editing.
  const { data, isFetching, isError, refetch } = useGetMenuItemsV2Query({ organization: organizationId }, { skip: !organizationId || !open });

  const allOptions = useMemo(() => mapMenuItemOptions(data), [data]);

  const filteredOptions = useMemo(() => {
    const keyword = search.trim().toLowerCase();
    if (!keyword) return allOptions;

    return allOptions.filter((item) => item.name.toLowerCase().includes(keyword) || item.category?.toLowerCase().includes(keyword));
  }, [allOptions, search]);

  const visibleOptions = filteredOptions.slice(0, visibleCount);
  const hasMore = visibleCount < filteredOptions.length;

  // A new keyword is a new list, so the reveal starts over at the top.
  useEffect(() => {
    setVisibleCount(MENU_ITEM_PAGE_SIZE);
    listRef.current?.scrollTo({ top: 0 });
  }, [search]);

  const handleOpenChange = (next: boolean) => {
    setOpen(next);
    if (!next) {
      setSearch('');
      setVisibleCount(MENU_ITEM_PAGE_SIZE);
    }
  };

  const handleScroll = (event: React.UIEvent<HTMLDivElement>) => {
    if (!hasMore) return;

    const { scrollTop, scrollHeight, clientHeight } = event.currentTarget;
    if (scrollHeight - scrollTop - clientHeight <= SCROLL_THRESHOLD_PX) {
      setVisibleCount((current) => current + MENU_ITEM_PAGE_SIZE);
    }
  };

  // Stays open — adding several items in a row is the common case.
  const handleSelect = (item: MenuItemOption) => {
    if (item.isAvailable === false) return;
    onSelect(item);
  };

  const isEmpty = !isFetching && !isError && filteredOptions.length === 0;

  return (
    <PopoverPrimitive.Root open={open} onOpenChange={handleOpenChange}>
      <PopoverPrimitive.Trigger asChild>
        <button
          type="button"
          disabled={disabled}
          aria-label="Add an item to this order"
          className={cn(
            'flex h-10 w-full cursor-pointer items-center gap-2 rounded-md border border-gray-200 bg-white px-3 text-sm font-medium text-gray-500 transition',
            'hover:border-gray-300 hover:text-gray-700 dark:border-gray-700 dark:bg-[#1a1a1a] dark:text-gray-400 dark:hover:border-gray-600 dark:hover:text-gray-200',
            disabled && 'cursor-not-allowed opacity-50'
          )}
        >
          <Plus className="h-4 w-4 shrink-0" />
          <span className="flex-1 text-left">Add an item…</span>
          <ChevronDown className={cn('h-4 w-4 shrink-0 transition-transform', open && 'rotate-180')} />
        </button>
      </PopoverPrimitive.Trigger>

      <PopoverPrimitive.Portal container={portalContainer ?? undefined}>
        <PopoverPrimitive.Content
          align="start"
          sideOffset={6}
          collisionPadding={16}
          onOpenAutoFocus={(event) => {
            event.preventDefault();
            searchRef.current?.focus();
          }}
          className={cn(
            'z-50 flex flex-col overflow-hidden rounded-md border border-gray-200 bg-white shadow-xl dark:border-gray-700 dark:bg-[#1a1a1a]',
            'data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=open]:fade-in-0 data-[state=closed]:fade-out-0'
          )}
          style={{
            // Never grows past the space Radix reports as available, so the
            // panel shrinks or flips instead of being cut off.
            width: 'var(--radix-popover-trigger-width)',
            maxHeight: 'min(22rem, var(--radix-popover-content-available-height))',
          }}
        >
          <div className="relative shrink-0 border-b border-gray-200 p-2 dark:border-gray-800">
            <Search className="absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input
              ref={searchRef}
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search the menu…"
              aria-label="Search menu items"
              className="h-9 pl-8 dark:bg-[#222121]"
            />
          </div>

          {/* `min-h-0` so this can actually shrink inside the flex column. */}
          <div ref={listRef} onScroll={handleScroll} className="min-h-0 flex-1 overflow-y-auto overscroll-contain">

            {isFetching && (
              <div className="flex items-center justify-center gap-2 py-8 text-sm text-gray-500 dark:text-gray-400">
                <Loader2 className="h-4 w-4 animate-spin" />
                Loading menu…
              </div>
            )}

            {isError && !isFetching && (
              <div className="px-4 py-8 text-center text-sm">
                <p className="text-gray-500 dark:text-gray-400">The menu could not be loaded.</p>
                <button type="button" onClick={() => refetch()} className="mt-1.5 cursor-pointer font-semibold text-blue-600 dark:text-blue-400">
                  Try again
                </button>
              </div>
            )}

            {isEmpty && (
              <div className="py-8 text-center text-sm text-gray-500 dark:text-gray-400">
                {search.trim() ? `No menu items match “${search.trim()}”` : 'This organization has no menu items yet'}
              </div>
            )}

            {!isFetching &&
              !isError &&
              visibleOptions.map((item) => {
                const isOnOrder = selectedIds.includes(item.id);
                const isUnavailable = item.isAvailable === false;

                return (
                  <button
                    key={item.id}
                    type="button"
                    disabled={isUnavailable}
                    onClick={() => handleSelect(item)}
                    className={cn(
                      'flex w-full items-center gap-3 px-3 py-2.5 text-left transition-colors',
                      'border-b border-gray-100 last:border-0 dark:border-gray-800',
                      isUnavailable ? 'cursor-not-allowed opacity-45' : 'cursor-pointer hover:bg-gray-50 dark:hover:bg-[#272727]'
                    )}
                  >
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-md bg-gray-100 text-gray-400 dark:bg-gray-800">
                      {item.imageUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={item.imageUrl} alt="" className="h-full w-full object-cover" />
                      ) : (
                        <ImageIcon className="h-4 w-4" />
                      )}
                    </span>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5">
                        <span className="truncate text-sm font-semibold text-gray-900 dark:text-gray-100">{item.name}</span>
                        {isOnOrder && <Check className="h-3.5 w-3.5 shrink-0 text-green-600 dark:text-green-400" strokeWidth={3} />}
                      </div>
                      <div className="mt-0.5 truncate text-xs text-gray-500 dark:text-gray-400">
                        {item.category}
                        {isUnavailable && ' · Out of stock'}
                        {isOnOrder && !isUnavailable && ' · Already on order'}
                      </div>
                    </div>

                    <span className="shrink-0 text-sm font-semibold text-gray-900 dark:text-gray-100">{formatCurrency(item.price)}</span>
                  </button>
                );
              })}

            {hasMore && !isFetching && (
              <div className="py-2.5 text-center text-xs text-gray-400 dark:text-gray-500">
                Scroll for more · {visibleOptions.length} of {filteredOptions.length}
              </div>
            )}

            {!hasMore && !isFetching && filteredOptions.length > 0 && (
              <div className="py-2.5 text-center text-xs text-gray-400 dark:text-gray-500">End of menu</div>
            )}
          </div>
        </PopoverPrimitive.Content>
      </PopoverPrimitive.Portal>
    </PopoverPrimitive.Root>
  );
};
