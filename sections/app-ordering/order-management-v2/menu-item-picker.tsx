'use client';

import { useGetMenuItemsV2Query } from '@/store/Reducer/order-management-v2-api';
import { Check, ImageIcon } from 'lucide-react';
import React, { useCallback, useMemo, useState } from 'react';
import { formatCurrency } from './constants';
import { mapMenuItemOptions } from './mappers';
import { PickerShell } from './picker-shell';
import type { MenuItemOption } from './types';

// The endpoint returns the whole catalogue in one response — no page or
// keyword params — so search and paging are both local, inside PickerShell.

interface MenuItemPickerProps {
  organizationId?: string;
  /** Menu item ids already on the order — flagged as such, still pickable. */
  selectedIds: string[];
  disabled?: boolean;
  /** The dialog's content element; falls back to `<body>` when absent. */
  portalContainer?: HTMLElement | null;
  onSelect: (item: MenuItemOption) => void;
}

export const MenuItemPicker: React.FC<MenuItemPickerProps> = ({ organizationId, selectedIds, disabled = false, portalContainer, onSelect }) => {
  const [hasOpened, setHasOpened] = useState(false);

  const { data, isFetching, isError, refetch } = useGetMenuItemsV2Query(
    { organization: organizationId },
    { skip: !organizationId || !hasOpened }
  );

  const options = useMemo(() => mapMenuItemOptions(data), [data]);

  const matches = useCallback(
    (item: MenuItemOption, keyword: string) => item.name.toLowerCase().includes(keyword) || Boolean(item.category?.toLowerCase().includes(keyword)),
    []
  );

  const isOptionDisabled = useCallback((item: MenuItemOption) => item.isAvailable === false, []);

  const renderOption = useCallback(
    (item: MenuItemOption) => {
      const isOnOrder = selectedIds.includes(item.id);
      const isUnavailable = item.isAvailable === false;

      return (
        <>
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
        </>
      );
    },
    [selectedIds]
  );

  return (
    <PickerShell
      triggerLabel="Add an item…"
      triggerAriaLabel="Add an item to this order"
      searchPlaceholder="Search the menu…"
      searchAriaLabel="Search menu items"
      options={options}
      getKey={(item) => item.id}
      matches={matches}
      renderOption={renderOption}
      isOptionDisabled={isOptionDisabled}
      isFetching={isFetching}
      isError={isError}
      errorLabel="The menu could not be loaded."
      emptyLabel="This organization has no menu items yet"
      getNoMatchLabel={(keyword) => `No menu items match “${keyword}”`}
      endLabel="End of menu"
      disabled={disabled}
      portalContainer={portalContainer}
      onOpenChange={(open) => open && setHasOpened(true)}
      onRetry={refetch}
      onSelect={onSelect}
    />
  );
};
