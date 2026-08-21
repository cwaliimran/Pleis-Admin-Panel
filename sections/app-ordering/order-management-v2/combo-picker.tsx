'use client';

import { useGetMenuItemsV2Query } from '@/store/Reducer/order-management-v2-api';
import { Check, Layers } from 'lucide-react';
import React, { useCallback, useMemo, useState } from 'react';
import { formatCurrency, getComboPriceModeLabel } from './constants';
import { mapComboOptions } from './mappers';
import { PickerShell } from './picker-shell';
import type { ComboOption } from './types';

// Combos ride along on the same catalogue response as the menu items, so
// this shares a cache entry with MenuItemPicker rather than fetching again.

interface ComboPickerProps {
  organizationId?: string;
  /** Combo ids already on the order — flagged as such, still pickable. */
  selectedIds: string[];
  disabled?: boolean;
  portalContainer?: HTMLElement | null;
  onSelect: (combo: ComboOption) => void;
}

export const ComboPicker: React.FC<ComboPickerProps> = ({ organizationId, selectedIds, disabled = false, portalContainer, onSelect }) => {
  const [hasOpened, setHasOpened] = useState(false);

  const { data, isFetching, isError, refetch } = useGetMenuItemsV2Query(
    { organization: organizationId },
    { skip: !organizationId || !hasOpened }
  );

  const options = useMemo(() => mapComboOptions(data), [data]);

  const matches = useCallback(
    (combo: ComboOption, keyword: string) =>
      combo.name.toLowerCase().includes(keyword) ||
      combo.description.toLowerCase().includes(keyword) ||
      combo.items.some((item) => item.name.toLowerCase().includes(keyword)),
    []
  );

  const isOptionDisabled = useCallback((combo: ComboOption) => !combo.isAvailable, []);

  const renderOption = useCallback(
    (combo: ComboOption) => {
      const isOnOrder = selectedIds.includes(combo.id);
      const hasSaving = combo.originalPrice > combo.price;
      const priceModeLabel = getComboPriceModeLabel(combo.priceMode);
      const itemSummary = combo.items.map((item) => item.name).join(' + ');

      return (
        <>
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-indigo-50 text-indigo-500 dark:bg-indigo-950/50 dark:text-indigo-300">
            <Layers className="h-4 w-4" />
          </span>

          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5">
              <span className="truncate text-sm font-semibold text-gray-900 dark:text-gray-100">{combo.name}</span>
              {isOnOrder && <Check className="h-3.5 w-3.5 shrink-0 text-green-600 dark:text-green-400" strokeWidth={3} />}
            </div>
            <div className="mt-0.5 truncate text-xs text-gray-500 dark:text-gray-400">
              {itemSummary || priceModeLabel}
              {!combo.isAvailable && ' · Unavailable'}
              {isOnOrder && combo.isAvailable && ' · Already on order'}
            </div>
          </div>

          <div className="shrink-0 text-right">
            <div className="text-sm font-semibold text-gray-900 dark:text-gray-100">{formatCurrency(combo.price)}</div>
            {hasSaving && <div className="text-xs text-gray-400 line-through dark:text-gray-500">{formatCurrency(combo.originalPrice)}</div>}
          </div>
        </>
      );
    },
    [selectedIds]
  );

  return (
    <PickerShell
      triggerLabel="Add a combo…"
      triggerAriaLabel="Add a combo to this order"
      searchPlaceholder="Search combos…"
      searchAriaLabel="Search combos"
      options={options}
      getKey={(combo) => combo.id}
      matches={matches}
      renderOption={renderOption}
      isOptionDisabled={isOptionDisabled}
      isFetching={isFetching}
      isError={isError}
      errorLabel="The combos could not be loaded."
      emptyLabel="This organization has no combos yet"
      getNoMatchLabel={(keyword) => `No combos match “${keyword}”`}
      endLabel="End of combos"
      disabled={disabled}
      portalContainer={portalContainer}
      onOpenChange={(open) => open && setHasOpened(true)}
      onRetry={refetch}
      onSelect={onSelect}
    />
  );
};
