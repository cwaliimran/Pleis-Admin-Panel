'use client';

import ButtonLoading from '@/components/common/button-loading';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { Minus, Plus, Trash2 } from 'lucide-react';
import React, { useEffect, useMemo, useState } from 'react';
import { ComboPicker } from './combo-picker';
import {
  DELIVERY_TYPE_CONFIG,
  MAX_ITEM_QUANTITY,
  MIN_ITEM_QUANTITY,
  formatCurrency,
  formatOrderTime,
  getComboPriceModeLabel,
  getDeliveryTypeConfig,
  getPaymentTypeLabel,
} from './constants';
import { MenuItemPicker } from './menu-item-picker';
import { ComboOption, DeliveryType, MenuItemOption, Order, OrderDraftCombo, OrderDraftItem, OrderUpdatePayload } from './types';

interface OrderUpdateModalProps {
  open: boolean;
  order: Order | null;
  organizationId?: string;
  isSubmitting: boolean;
  onClose: () => void;
  onConfirm: (payload: OrderUpdatePayload) => void;
}

/** Lines carry a total for the whole quantity, so divide the unit price back out. */
const toUnitPrice = (lineTotal: number, quantity: number) => (quantity > 0 ? lineTotal / quantity : lineTotal);

/** Two lines of the same menu item merge — the update is expressed per menu item. */
const toDraftItems = (order: Order): OrderDraftItem[] => {
  const byMenuItem = new Map<string, OrderDraftItem>();

  order.rounds.forEach((round) =>
    round.items.forEach((item) => {
      const existing = byMenuItem.get(item.menuItemId);

      if (existing) {
        existing.quantity += item.quantity;
        return;
      }

      byMenuItem.set(item.menuItemId, {
        menuItemId: item.menuItemId,
        name: item.name,
        quantity: item.quantity,
        unitPrice: toUnitPrice(item.lineTotal, item.quantity),
        isNew: false,
      });
    })
  );

  return [...byMenuItem.values()];
};

/** Same merge for combos — the payload carries one entry per combo. */
const toDraftCombos = (order: Order): OrderDraftCombo[] => {
  const byCombo = new Map<string, OrderDraftCombo>();

  order.combos.forEach((combo) => {
    const existing = byCombo.get(combo.comboId);

    if (existing) {
      existing.quantity += combo.quantity;
      return;
    }

    byCombo.set(combo.comboId, {
      comboId: combo.comboId,
      name: combo.name,
      quantity: combo.quantity,
      unitPrice: combo.unitFinalPrice,
      originalUnitPrice: combo.unitPrice,
      priceMode: combo.priceMode,
      menuItemIds: combo.items.map((item) => item.menuItemId),
      itemNames: combo.items.map((item) => item.name),
      isNew: false,
    });
  });

  return [...byCombo.values()];
};

const itemsSignature = (items: OrderDraftItem[]) =>
  items
    .map((item) => `${item.menuItemId}:${item.quantity}`)
    .sort()
    .join('|');

const combosSignature = (combos: OrderDraftCombo[]) =>
  combos
    .map((combo) => `${combo.comboId}:${combo.quantity}`)
    .sort()
    .join('|');

const clampQuantity = (value: number) => Math.min(MAX_ITEM_QUANTITY, Math.max(MIN_ITEM_QUANTITY, value));

const FieldLabel: React.FC<{ children: React.ReactNode; htmlFor?: string }> = ({ children, htmlFor }) => (
  <label htmlFor={htmlFor} className="mb-1.5 block text-sm font-semibold text-gray-900 dark:text-gray-100">
    {children}
  </label>
);

const ReadOnlyRow: React.FC<{ label: string; value: React.ReactNode }> = ({ label, value }) => (
  <div className="flex items-baseline justify-between gap-4 border-b border-dashed border-gray-200 py-2 last:border-0 dark:border-gray-800">
    <span className="shrink-0 text-xs text-gray-500 dark:text-gray-400">{label}</span>
    <span className="truncate text-right text-xs font-semibold text-gray-700 dark:text-gray-200">{value}</span>
  </div>
);

const NewBadge: React.FC = () => (
  <span className="shrink-0 rounded bg-blue-50 px-1.5 py-0.5 text-[10px] font-bold tracking-wide text-blue-600 dark:bg-blue-950/50 dark:text-blue-300">
    NEW
  </span>
);

const SectionHeading: React.FC<{ title: string; count: React.ReactNode }> = ({ title, count }) => (
  <div className="mb-3 flex items-center justify-between gap-3">
    <span className="text-xs font-bold tracking-wide text-gray-500 uppercase dark:text-gray-400">{title}</span>
    <span className="text-xs text-gray-500 dark:text-gray-400">{count}</span>
  </div>
);

const QuantityStepper: React.FC<{
  quantity: number;
  label: string;
  disabled?: boolean;
  onStep: (delta: number) => void;
  onChange: (quantity: number) => void;
}> = ({ quantity, label, disabled = false, onStep, onChange }) => (
  <div className="flex items-center rounded-md border border-gray-200 dark:border-gray-700">
    <button
      type="button"
      aria-label={`Decrease quantity of ${label}`}
      disabled={disabled || quantity <= MIN_ITEM_QUANTITY}
      onClick={() => onStep(-1)}
      className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-l-md text-gray-600 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40 dark:text-gray-300 dark:hover:bg-gray-800"
    >
      <Minus className="h-3.5 w-3.5" />
    </button>

    <input
      inputMode="numeric"
      value={quantity}
      disabled={disabled}
      aria-label={`Quantity of ${label}`}
      onChange={(event) => {
        const digits = event.target.value.replace(/\D/g, '');
        onChange(digits ? Number(digits) : MIN_ITEM_QUANTITY);
      }}
      className="h-8 w-10 border-x border-gray-200 bg-transparent text-center text-sm font-semibold text-gray-900 outline-none dark:border-gray-700 dark:text-gray-100"
    />

    <button
      type="button"
      aria-label={`Increase quantity of ${label}`}
      disabled={disabled || quantity >= MAX_ITEM_QUANTITY}
      onClick={() => onStep(1)}
      className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-r-md text-gray-600 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40 dark:text-gray-300 dark:hover:bg-gray-800"
    >
      <Plus className="h-3.5 w-3.5" />
    </button>
  </div>
);

const RemoveButton: React.FC<{ label: string; disabled?: boolean; onClick: () => void }> = ({ label, disabled = false, onClick }) => (
  <button
    type="button"
    aria-label={`Remove ${label}`}
    disabled={disabled}
    onClick={onClick}
    className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-md text-gray-400 transition hover:bg-red-50 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-40 dark:hover:bg-red-950/40 dark:hover:text-red-400"
  >
    <Trash2 className="h-4 w-4" />
  </button>
);

export const OrderUpdateModal: React.FC<OrderUpdateModalProps> = ({ open, order, organizationId, isSubmitting, onClose, onConfirm }) => {
  const [deliveryType, setDeliveryType] = useState<DeliveryType>('tableService');
  const [tableNumber, setTableNumber] = useState('');
  const [items, setItems] = useState<OrderDraftItem[]>([]);
  const [combos, setCombos] = useState<OrderDraftCombo[]>([]);

  // The pickers portal their panels here so the scrolling body cannot clip them.
  const [dialogElement, setDialogElement] = useState<HTMLDivElement | null>(null);

  // Seeded on open so a reopened modal never carries the previous edit, and so
  // a background refetch cannot rewrite what is being typed.
  useEffect(() => {
    if (!open || !order) return;

    setDeliveryType(order.deliveryType);
    setTableNumber(order.tableNumber);
    setItems(toDraftItems(order));
    setCombos(toDraftCombos(order));
  }, [open, order?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  const isTableService = deliveryType === 'tableService';

  const handleDeliveryTypeChange = (next: DeliveryType) => {
    setDeliveryType(next);
    if (next !== 'tableService') setTableNumber('');
  };

  const handleQuantityChange = (menuItemId: string, quantity: number) =>
    setItems((current) => current.map((item) => (item.menuItemId === menuItemId ? { ...item, quantity: clampQuantity(quantity) } : item)));

  const handleStep = (menuItemId: string, delta: number) =>
    setItems((current) => current.map((item) => (item.menuItemId === menuItemId ? { ...item, quantity: clampQuantity(item.quantity + delta) } : item)));

  const handleRemove = (menuItemId: string) => setItems((current) => current.filter((item) => item.menuItemId !== menuItemId));

  const handleAddItem = (option: MenuItemOption) =>
    setItems((current) => {
      // Tops up an existing line rather than adding a row the API cannot express.
      const existing = current.find((item) => item.menuItemId === option.id);

      if (existing) {
        return current.map((item) => (item.menuItemId === option.id ? { ...item, quantity: clampQuantity(item.quantity + 1) } : item));
      }

      return [...current, { menuItemId: option.id, name: option.name, quantity: 1, unitPrice: option.price, isNew: true }];
    });

  const handleComboQuantityChange = (comboId: string, quantity: number) =>
    setCombos((current) => current.map((combo) => (combo.comboId === comboId ? { ...combo, quantity: clampQuantity(quantity) } : combo)));

  const handleComboStep = (comboId: string, delta: number) =>
    setCombos((current) =>
      current.map((combo) => (combo.comboId === comboId ? { ...combo, quantity: clampQuantity(combo.quantity + delta) } : combo))
    );

  const handleRemoveCombo = (comboId: string) => setCombos((current) => current.filter((combo) => combo.comboId !== comboId));

  const handleAddCombo = (option: ComboOption) =>
    setCombos((current) => {
      const existing = current.find((combo) => combo.comboId === option.id);

      if (existing) {
        return current.map((combo) => (combo.comboId === option.id ? { ...combo, quantity: clampQuantity(combo.quantity + 1) } : combo));
      }

      return [
        ...current,
        {
          comboId: option.id,
          name: option.name,
          quantity: 1,
          unitPrice: option.price,
          originalUnitPrice: option.originalPrice,
          priceMode: option.priceMode,
          menuItemIds: option.items.map((item) => item.id),
          itemNames: option.items.map((item) => item.name),
          isNew: true,
        },
      ];
    });

  const selectedMenuItemIds = useMemo(() => items.map((item) => item.menuItemId), [items]);
  const selectedComboIds = useMemo(() => combos.map((combo) => combo.comboId), [combos]);

  // Items and combos only — tax and discounts are the backend's to recalculate,
  // so nothing here tries to predict the new total.
  const subtotal = useMemo(
    () =>
      items.reduce((total, item) => total + item.unitPrice * item.quantity, 0) +
      combos.reduce((total, combo) => total + combo.unitPrice * combo.quantity, 0),
    [items, combos]
  );

  const comboCount = useMemo(() => combos.reduce((total, combo) => total + combo.quantity, 0), [combos]);

  const isDirty = Boolean(
    order &&
      (deliveryType !== order.deliveryType ||
        tableNumber.trim() !== order.tableNumber ||
        itemsSignature(items) !== itemsSignature(toDraftItems(order)) ||
        combosSignature(combos) !== combosSignature(toDraftCombos(order)))
  );

  const isTableNumberMissing = isTableService && !tableNumber.trim();
  const isOrderEmpty = items.length === 0 && combos.length === 0;
  const canSave = isDirty && !isOrderEmpty && !isTableNumberMissing && !isSubmitting;

  const handleConfirm = () => {
    if (!canSave) return;

    onConfirm({
      deliveryType,
      tableNumber: isTableService ? tableNumber.trim() : '',
      items: items.map((item) => ({ menuItemId: item.menuItemId, quantity: item.quantity })),
      combos: combos.map((combo) => ({ comboId: combo.comboId, menuItemIds: combo.menuItemIds, quantity: combo.quantity })),
    });
  };

  return (
    <Dialog open={open} onOpenChange={(next) => !next && !isSubmitting && onClose()}>
      <DialogContent ref={setDialogElement} aria-describedby={undefined} className="w-full gap-0 p-0 sm:max-w-4xl dark:bg-[#222121]">
        <DialogHeader className="border-b border-gray-200 px-6 py-4 dark:border-gray-800">
          <DialogTitle className="text-lg font-bold">Update order #{order?.orderNumber}</DialogTitle>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            This order has not been confirmed or paid yet, so it can still be changed. Prices come from the menu and cannot be edited.
          </p>
        </DialogHeader>

        <div className="grid max-h-[65vh] overflow-y-auto lg:grid-cols-[minmax(0,320px)_minmax(0,1fr)]">
          {/* Order details */}
          <div className="border-b border-gray-200 px-6 py-5 lg:border-r lg:border-b-0 dark:border-gray-800">
            <div className="mb-4 text-xs font-bold tracking-wide text-gray-500 uppercase dark:text-gray-400">Order details</div>

            <div className="mb-4">
              <FieldLabel>Pickup type</FieldLabel>
              <Select value={deliveryType} onValueChange={(next) => handleDeliveryTypeChange(next as DeliveryType)} disabled={isSubmitting}>
                <SelectTrigger className="h-10 w-full cursor-pointer bg-white shadow-none dark:bg-[#1a1a1a]" aria-label="Pickup type">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {(Object.keys(DELIVERY_TYPE_CONFIG) as DeliveryType[]).map((type) => (
                    <SelectItem key={type} value={type} className="cursor-pointer">
                      {getDeliveryTypeConfig(type).label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {isTableService && (
              <div className="mb-4">
                <FieldLabel htmlFor="order-table-number">
                  Table number <span className="font-normal text-gray-500 dark:text-gray-400">· required</span>
                </FieldLabel>
                <Input
                  id="order-table-number"
                  value={tableNumber}
                  disabled={isSubmitting}
                  onChange={(event) => setTableNumber(event.target.value)}
                  placeholder="e.g. Table 5"
                  className="h-10 bg-white dark:bg-[#1a1a1a]"
                />
                {isTableNumberMissing && <p className="mt-1.5 text-xs font-medium text-red-500">Table service needs a table number.</p>}
              </div>
            )}

            <div className="mt-5 border-t border-gray-200 pt-4 dark:border-gray-800">
              <ReadOnlyRow label="Customer" value={order?.customer.name || '-'} />
              <ReadOnlyRow label="Placed" value={order ? formatOrderTime(order.placedAt) : '-'} />
              <ReadOnlyRow label="Order ID" value={order?.orderNumber || '-'} />
              <ReadOnlyRow label="Payment method" value={order ? getPaymentTypeLabel(order.paymentType) : '-'} />
            </div>
          </div>

          {/* Items and combos */}
          <div className="px-6 py-5">
            <SectionHeading title="Items" count={`${items.length} ${items.length === 1 ? 'line' : 'lines'}`} />

            <div className="mb-3">
              <MenuItemPicker
                organizationId={organizationId}
                selectedIds={selectedMenuItemIds}
                disabled={isSubmitting}
                portalContainer={dialogElement}
                onSelect={handleAddItem}
              />
            </div>

            {items.length > 0 && (
              <div className="overflow-hidden rounded-lg border border-gray-200 dark:border-gray-800">
                {items.map((item) => (
                  <div
                    key={item.menuItemId}
                    className="flex items-center justify-between gap-4 border-b border-gray-100 px-4 py-3 last:border-0 dark:border-gray-800"
                  >
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="truncate text-sm font-semibold text-gray-900 dark:text-gray-100">{item.name}</span>
                        {item.isNew && <NewBadge />}
                      </div>
                      <div className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">{formatCurrency(item.unitPrice)} each</div>
                    </div>

                    <div className="flex shrink-0 items-center gap-3">
                      <QuantityStepper
                        quantity={item.quantity}
                        label={item.name}
                        disabled={isSubmitting}
                        onStep={(delta) => handleStep(item.menuItemId, delta)}
                        onChange={(quantity) => handleQuantityChange(item.menuItemId, quantity)}
                      />

                      <span className="w-20 text-right text-sm font-semibold text-gray-900 dark:text-gray-100">
                        {formatCurrency(item.unitPrice * item.quantity)}
                      </span>

                      <RemoveButton label={item.name} disabled={isSubmitting} onClick={() => handleRemove(item.menuItemId)} />
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="mt-6">
              <SectionHeading title="Combos" count={comboCount > 0 ? `${comboCount} ${comboCount === 1 ? 'combo' : 'combos'}` : 'None'} />

              <div className="mb-3">
                <ComboPicker
                  organizationId={organizationId}
                  selectedIds={selectedComboIds}
                  disabled={isSubmitting}
                  portalContainer={dialogElement}
                  onSelect={handleAddCombo}
                />
              </div>

              {combos.length > 0 && (
                <div className="overflow-hidden rounded-lg border border-gray-200 dark:border-gray-800">
                  {combos.map((combo) => {
                    const priceModeLabel = getComboPriceModeLabel(combo.priceMode);
                    const originalTotal = combo.originalUnitPrice * combo.quantity;
                    const lineTotal = combo.unitPrice * combo.quantity;

                    return (
                      <div
                        key={combo.comboId}
                        className="flex items-center justify-between gap-4 border-b border-gray-100 px-4 py-3 last:border-0 dark:border-gray-800"
                      >
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5">
                            <span className="truncate text-sm font-semibold text-gray-900 dark:text-gray-100">{combo.name}</span>
                            {combo.isNew && <NewBadge />}
                          </div>
                          {combo.itemNames.length > 0 && (
                            <div className="mt-0.5 truncate text-xs text-gray-500 dark:text-gray-400">{combo.itemNames.join(' + ')}</div>
                          )}
                          <div className="mt-0.5 text-xs text-gray-400 dark:text-gray-500">
                            {formatCurrency(combo.unitPrice)} each{priceModeLabel && ` · ${priceModeLabel}`}
                          </div>
                        </div>

                        <div className="flex shrink-0 items-center gap-3">
                          <QuantityStepper
                            quantity={combo.quantity}
                            label={combo.name}
                            disabled={isSubmitting}
                            onStep={(delta) => handleComboStep(combo.comboId, delta)}
                            onChange={(quantity) => handleComboQuantityChange(combo.comboId, quantity)}
                          />

                          <span className="w-20 text-right text-sm font-semibold text-gray-900 dark:text-gray-100">
                            {formatCurrency(lineTotal)}
                            {originalTotal > lineTotal && (
                              <span className="block text-xs font-normal text-gray-400 line-through dark:text-gray-500">
                                {formatCurrency(originalTotal)}
                              </span>
                            )}
                          </span>

                          <RemoveButton label={combo.name} disabled={isSubmitting} onClick={() => handleRemoveCombo(combo.comboId)} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {isOrderEmpty && (
              <div className="mt-4 rounded-lg border border-dashed border-gray-200 px-4 py-8 text-center text-sm text-gray-500 dark:border-gray-800 dark:text-gray-400">
                An order needs at least one item or combo. Add one to continue.
              </div>
            )}

            <div className="mt-4 space-y-2 border-t border-gray-200 pt-4 dark:border-gray-800">
              <div className="flex items-baseline justify-between gap-6">
                <span className="text-base font-bold text-gray-900 dark:text-gray-100">New subtotal</span>
                <span className="text-xl font-bold text-gray-900 dark:text-gray-100">{formatCurrency(subtotal)}</span>
              </div>

              {Boolean(order?.tipAmount) && (
                <div className="flex items-baseline justify-between gap-6">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Napojnica (0% tax)</span>
                  <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">{formatCurrency(order?.tipAmount ?? 0)}</span>
                </div>
              )}

              <div className="flex items-baseline justify-between gap-6">
                <span className="text-sm text-gray-500 dark:text-gray-400">Current order total</span>
                <span className="text-sm text-gray-500 dark:text-gray-400">{formatCurrency(order?.total ?? 0)}</span>
              </div>

              <p className="text-xs leading-relaxed text-gray-400 dark:text-gray-500">
                The tip is the customer&apos;s and is not affected. Tax and discounts are recalculated by the server when the order is saved.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between gap-3 border-t border-gray-200 px-6 py-4 dark:border-gray-800">
          <span className="text-xs text-gray-500 dark:text-gray-400">The customer is notified of any change to their order.</span>

          <div className="flex shrink-0 gap-2">
            <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting} className="cursor-pointer font-semibold">
              Discard
            </Button>

            {isSubmitting ? (
              <Button type="button" disabled className="cursor-not-allowed">
                <ButtonLoading title="Saving" />
              </Button>
            ) : (
              <Button
                type="button"
                onClick={handleConfirm}
                disabled={!canSave}
                title={!isDirty ? 'Nothing has changed yet' : undefined}
                className={cn('cursor-pointer font-semibold', !canSave && 'cursor-not-allowed opacity-60')}
              >
                Save changes
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
