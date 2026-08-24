'use client';

import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import * as PopoverPrimitive from '@radix-ui/react-popover';
import { ChevronDown, Loader2, Plus, Search } from 'lucide-react';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { MENU_ITEM_PAGE_SIZE } from './constants';

const SCROLL_THRESHOLD_PX = 72;

export interface PickerShellProps<T> {
  triggerLabel: string;
  triggerAriaLabel: string;
  searchPlaceholder: string;
  searchAriaLabel: string;
  options: T[];
  getKey: (option: T) => string;
  matches: (option: T, keyword: string) => boolean;
  renderOption: (option: T) => React.ReactNode;
  isOptionDisabled?: (option: T) => boolean;
  isFetching: boolean;
  isError: boolean;
  errorLabel: string;
  emptyLabel: string;
  getNoMatchLabel: (keyword: string) => string;
  endLabel: string;
  disabled?: boolean;
  portalContainer?: HTMLElement | null;
  onOpenChange?: (open: boolean) => void;
  onRetry: () => void;
  onSelect: (option: T) => void;
}

export function PickerShell<T>({
  triggerLabel,
  triggerAriaLabel,
  searchPlaceholder,
  searchAriaLabel,
  options,
  getKey,
  matches,
  renderOption,
  isOptionDisabled,
  isFetching,
  isError,
  errorLabel,
  emptyLabel,
  getNoMatchLabel,
  endLabel,
  disabled = false,
  portalContainer,
  onOpenChange,
  onRetry,
  onSelect,
}: PickerShellProps<T>) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [visibleCount, setVisibleCount] = useState(MENU_ITEM_PAGE_SIZE);

  const listRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  const filteredOptions = useMemo(() => {
    const keyword = search.trim().toLowerCase();
    if (!keyword) return options;

    return options.filter((option) => matches(option, keyword));
  }, [options, search, matches]);

  const visibleOptions = filteredOptions.slice(0, visibleCount);
  const hasMore = visibleCount < filteredOptions.length;

  useEffect(() => {
    setVisibleCount(MENU_ITEM_PAGE_SIZE);
    listRef.current?.scrollTo({ top: 0 });
  }, [search]);

  const handleOpenChange = (next: boolean) => {
    setOpen(next);
    onOpenChange?.(next);
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

  const handleSelect = (option: T) => {
    if (isOptionDisabled?.(option)) return;
    onSelect(option);
  };

  const isEmpty = !isFetching && !isError && filteredOptions.length === 0;

  return (
    <PopoverPrimitive.Root open={open} onOpenChange={handleOpenChange}>
      <PopoverPrimitive.Trigger asChild>
        <button
          type="button"
          disabled={disabled}
          aria-label={triggerAriaLabel}
          className={cn(
            'flex h-10 w-full cursor-pointer items-center gap-2 rounded-md border border-gray-200 bg-white px-3 text-sm font-medium text-gray-500 transition',
            'hover:border-gray-300 hover:text-gray-700 dark:border-gray-700 dark:bg-[#1a1a1a] dark:text-gray-400 dark:hover:border-gray-600 dark:hover:text-gray-200',
            disabled && 'cursor-not-allowed opacity-50'
          )}
        >
          <Plus className="h-4 w-4 shrink-0" />
          <span className="flex-1 text-left">{triggerLabel}</span>
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
              placeholder={searchPlaceholder}
              aria-label={searchAriaLabel}
              className="h-9 pl-8 dark:bg-[#222121]"
            />
          </div>

          <div ref={listRef} onScroll={handleScroll} className="min-h-0 flex-1 overflow-y-auto overscroll-contain">
            {isFetching && (
              <div className="flex items-center justify-center gap-2 py-8 text-sm text-gray-500 dark:text-gray-400">
                <Loader2 className="h-4 w-4 animate-spin" />
                Loading menu…
              </div>
            )}

            {isError && !isFetching && (
              <div className="px-4 py-8 text-center text-sm">
                <p className="text-gray-500 dark:text-gray-400">{errorLabel}</p>
                <button type="button" onClick={onRetry} className="mt-1.5 cursor-pointer font-semibold text-blue-600 dark:text-blue-400">
                  Try again
                </button>
              </div>
            )}

            {isEmpty && (
              <div className="px-4 py-8 text-center text-sm text-gray-500 dark:text-gray-400">
                {search.trim() ? getNoMatchLabel(search.trim()) : emptyLabel}
              </div>
            )}

            {!isFetching &&
              !isError &&
              visibleOptions.map((option) => {
                const isDisabled = Boolean(isOptionDisabled?.(option));

                return (
                  <button
                    key={getKey(option)}
                    type="button"
                    disabled={isDisabled}
                    onClick={() => handleSelect(option)}
                    className={cn(
                      'flex w-full items-center gap-3 px-3 py-2.5 text-left transition-colors',
                      'border-b border-gray-100 last:border-0 dark:border-gray-800',
                      isDisabled ? 'cursor-not-allowed opacity-45' : 'cursor-pointer hover:bg-gray-50 dark:hover:bg-[#272727]'
                    )}
                  >
                    {renderOption(option)}
                  </button>
                );
              })}

            {hasMore && !isFetching && (
              <div className="py-2.5 text-center text-xs text-gray-400 dark:text-gray-500">
                Scroll for more · {visibleOptions.length} of {filteredOptions.length}
              </div>
            )}

            {!hasMore && !isFetching && filteredOptions.length > 0 && (
              <div className="py-2.5 text-center text-xs text-gray-400 dark:text-gray-500">{endLabel}</div>
            )}
          </div>
        </PopoverPrimitive.Content>
      </PopoverPrimitive.Portal>
    </PopoverPrimitive.Root>
  );
}
