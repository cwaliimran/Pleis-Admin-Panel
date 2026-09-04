'use client';

import ButtonLoading from '@/components/common/button-loading';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { TableCell, TableRow } from '@/components/ui/table';
import { cn } from '@/lib/utils';
import { ChevronDown, Loader2, NotebookPen, Package, PackageCheck, Pencil, User } from 'lucide-react';
import React, { useEffect, useMemo, useState } from 'react';
import type { BadgeConfig } from './constants';
import {
  BADGE_TONE_CLASS,
  canDeliverOrderItems,
  MARK_AS_PAID_ACTION,
  canMarkOrderAsPaid,
  getPrimaryAction,
  SECONDARY_ACTION_BY_STATUS,
  formatCurrency,
  formatOrderTime,
  getComboPriceModeLabel,
  getDeliveryTypeConfig,
  getLoyaltyTierConfig,
  getOrderComboCount,
  getOrderItemCount,
  getOrderStatusConfig,
  getOrderSummaryLines,
  getPaymentStatusConfig,
  getPaymentTimingConfig,
  getPaymentTypeLabel,
  getRoundDeliveryConfig,
  isOrderEditable,
} from './constants';
import { DestructiveActionType, Order, OrderActionType, OrderCombo } from './types';
import type { DeliverItemsPayload } from './use-order-management';

export const ORDER_TABLE_COLUMN_COUNT = 12;

interface OrderRowProps {
  order: Order;
  isExpanded: boolean;
  onToggle: () => void;
  onAdvance: (order: Order, action: OrderActionType) => void;
  onDestructive: (order: Order, action: DestructiveActionType) => void;
  onDeliver: (order: Order, payload: DeliverItemsPayload) => void;
  onUpdate: (order: Order) => void;
  isPending?: boolean;
  /** Which action is mid-flight, so only that button shows a spinner. */
  pendingAction?: OrderActionType | null;
  isDelivering?: boolean;
  /** Arrived over the socket while this view has been open. */
  isLive?: boolean;
}

const StatusBadge: React.FC<BadgeConfig & { className?: string }> = ({ label, icon: Icon, tone, className }) => (
  <span
    className={cn(
      'inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold whitespace-nowrap',
      BADGE_TONE_CLASS[tone],
      className
    )}
  >
    <Icon className="h-3.5 w-3.5 shrink-0" strokeWidth={2.5} />
    {label}
  </span>
);

const OrderStatusBadge: React.FC<{ status: Order['status']; className?: string }> = ({ status, className }) => (
  <StatusBadge {...getOrderStatusConfig(status)} className={className} />
);

const PaymentStatusBadge: React.FC<{ status: Order['paymentStatus']; className?: string }> = ({ status, className }) => (
  <StatusBadge {...getPaymentStatusConfig(status)} className={className} />
);

/** Rounds are grouped by per-item delivery state, so their badge is not an order status. */
const RoundStatusBadge: React.FC<{ isDelivered: boolean; className?: string }> = ({ isDelivered, className }) => (
  <StatusBadge {...getRoundDeliveryConfig(isDelivered)} className={className} />
);

const ComboLine: React.FC<{
  combo: OrderCombo;
  isSelectable: boolean;
  isSelected: boolean;
  isDelivering: boolean;
  onToggle: () => void;
}> = ({ combo, isSelectable, isSelected, isDelivering, onToggle }) => {
  const priceModeLabel = getComboPriceModeLabel(combo.priceMode);
  const originalTotal = combo.unitPrice * combo.quantity;
  const hasSaving = originalTotal > combo.lineTotal;

  return (
    <li
      onClick={isSelectable && !isDelivering ? onToggle : undefined}
      className={cn(
        'border-b border-gray-100 px-4 py-3 transition-colors last:border-0 dark:border-gray-800',
        isSelectable && 'cursor-pointer hover:bg-gray-50 dark:hover:bg-[#2a2a2a]',
        isSelected && 'bg-blue-50/60 dark:bg-blue-950/20'
      )}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex min-w-0 items-start gap-2.5">
          {isSelectable && (
            <Checkbox
              checked={isSelected}
              disabled={isDelivering}
              onCheckedChange={onToggle}
              onClick={(event) => event.stopPropagation()}
              aria-label={`Mark ${combo.name} delivered`}
              className="mt-0.5 cursor-pointer"
            />
          )}
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                {combo.quantity}× {combo.name}
              </span>
              {combo.isDelivered && <RoundStatusBadge isDelivered className="px-2 py-0.5 text-[11px]" />}
            </div>
            {priceModeLabel && <div className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">{priceModeLabel}</div>}
          </div>
        </div>

        <div className="shrink-0 text-right">
          <div className="text-sm font-semibold text-gray-900 dark:text-gray-100">{formatCurrency(combo.lineTotal)}</div>
          {hasSaving && <div className="text-xs text-gray-400 line-through dark:text-gray-500">{formatCurrency(originalTotal)}</div>}
        </div>
      </div>

      {combo.items.length > 0 && (
        <ul className={cn('mt-2 border-l border-dashed border-gray-200 pl-3 dark:border-gray-700', isSelectable ? 'ml-7' : 'ml-1')}>
          {combo.items.map((item) => (
            <li key={item.id} className="py-0.5 text-xs text-gray-600 dark:text-gray-400">
              {item.name}
            </li>
          ))}
        </ul>
      )}
    </li>
  );
};

const AVATAR_TONES = [
  'bg-blue-100 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300',
  'bg-green-100 text-green-700 dark:bg-green-950/60 dark:text-green-300',
  'bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300',
  'bg-purple-100 text-purple-700 dark:bg-purple-950/60 dark:text-purple-300',
  'bg-pink-100 text-pink-700 dark:bg-pink-950/60 dark:text-pink-300',
  'bg-teal-100 text-teal-700 dark:bg-teal-950/60 dark:text-teal-300',
];

const CustomerAvatar: React.FC<{ name: string; url?: string | null }> = ({ name, url }) => {
  const [failed, setFailed] = useState(false);
  const initial = name.trim().charAt(0).toUpperCase();

  return (
    <span
      className={cn(
        'flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-full text-xs font-bold',
        AVATAR_TONES[initial.charCodeAt(0) % AVATAR_TONES.length] ?? 'bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400'
      )}
    >
      {url && !failed ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={url} alt="" onError={() => setFailed(true)} className="h-full w-full object-cover" />
      ) : (
        initial || <User className="h-4 w-4" />
      )}
    </span>
  );
};

const DetailRow: React.FC<{ label: string; value: React.ReactNode }> = ({ label, value }) => (
  <div className="flex items-baseline justify-between gap-6 border-b border-dashed border-gray-200 py-2 dark:border-gray-800">
    <span className="shrink-0 text-sm text-gray-500 dark:text-gray-400">{label}</span>
    <span className="truncate text-right text-sm font-semibold text-gray-900 dark:text-gray-100">{value}</span>
  </div>
);

export const OrderRow: React.FC<OrderRowProps> = ({
  order,
  isExpanded,
  onToggle,
  onAdvance,
  onDestructive,
  onDeliver,
  onUpdate,
  isPending = false,
  pendingAction = null,
  isDelivering = false,
  isLive = false,
}) => {
  const deliveryConfig = getDeliveryTypeConfig(order.deliveryType);
  const timingConfig = getPaymentTimingConfig(order.paymentTiming);
  const tierConfig = order.customer.tier ? getLoyaltyTierConfig(order.customer.tier) : null;
  const primaryAction = getPrimaryAction(order);
  const secondaryAction = SECONDARY_ACTION_BY_STATUS[order.status];

  // A failed payment has to be settled before the order can be accepted.
  const isConfirmBlocked = primaryAction?.type === 'confirm' && order.paymentStatus === 'failed';
  const canMarkAsPaid = canMarkOrderAsPaid(order);

  // Gates the panel's per-item controls. The row's own "Delivered" button is
  // already gated by `getPrimaryAction`, which reads the same rule.
  const isDeliverable = canDeliverOrderItems(order);
  const showPrimaryAction = Boolean(primaryAction);

  // Money has already changed hands, so cancelling is off the table. Reject
  // is unaffected — it only ever appears before an order is accepted.
  const showSecondaryAction = Boolean(secondaryAction) && !(secondaryAction?.type === 'cancel' && order.paymentStatus === 'paid');

  const summaryLines = getOrderSummaryLines(order);

  const itemCount = getOrderItemCount(order);
  const roundCount = order.rounds.length;
  const comboCount = getOrderComboCount(order);
  const hasCombos = order.combos.length > 0;
  const isOrderEmpty = order.rounds.length === 0 && !hasCombos;

  // The API keys delivery on the menu item, not the order line, so two lines
  // of the same menu item tick together — exactly what the request does.
  const undeliveredMenuItemIds = useMemo(() => {
    const ids = order.rounds.filter((round) => !round.isDelivered).flatMap((round) => round.items.map((item) => item.menuItemId));
    return [...new Set(ids)];
  }, [order.rounds]);

  const [selectedMenuItemIds, setSelectedMenuItemIds] = useState<string[]>([]);

  // A delivered item leaves the list, so any stale selection has to go too.
  useEffect(() => {
    setSelectedMenuItemIds((current) => current.filter((id) => undeliveredMenuItemIds.includes(id)));
  }, [undeliveredMenuItemIds]);

  // Keyed on the order-combo line id — what `deliveredCombo` carries.
  const undeliveredComboIds = useMemo(() => order.combos.filter((combo) => !combo.isDelivered).map((combo) => combo.id), [order.combos]);

  const [selectedComboIds, setSelectedComboIds] = useState<string[]>([]);

  useEffect(() => {
    setSelectedComboIds((current) => current.filter((id) => undeliveredComboIds.includes(id)));
  }, [undeliveredComboIds]);

  const canDeliver = isDeliverable && undeliveredMenuItemIds.length > 0;
  const canDeliverCombos = isDeliverable && undeliveredComboIds.length > 0;
  const canDeliverAny = canDeliver || canDeliverCombos;

  const selectedCount = selectedMenuItemIds.length + selectedComboIds.length;

  const canUpdate = isOrderEditable(order);

  // "Delivered" goes through the delivery endpoint, so it reports progress
  // via `isDelivering` rather than `pendingAction`.
  const isActionRunning = (action: OrderActionType) => (action === 'delivered' ? isDelivering : isPending && pendingAction === action);

  const actionLabel = (action: OrderActionType, label: string) => (
    <>
      {isActionRunning(action) && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
      {label}
    </>
  );

  const isAllSelected = undeliveredMenuItemIds.length > 0 && selectedMenuItemIds.length === undeliveredMenuItemIds.length;
  const isAllCombosSelected = undeliveredComboIds.length > 0 && selectedComboIds.length === undeliveredComboIds.length;

  const handleToggleItem = (menuItemId: string) =>
    setSelectedMenuItemIds((current) => (current.includes(menuItemId) ? current.filter((id) => id !== menuItemId) : [...current, menuItemId]));

  const handleToggleAll = () => setSelectedMenuItemIds(isAllSelected ? [] : undeliveredMenuItemIds);

  const handleToggleCombo = (comboId: string) =>
    setSelectedComboIds((current) => (current.includes(comboId) ? current.filter((id) => id !== comboId) : [...current, comboId]));

  const handleToggleAllCombos = () => setSelectedComboIds(isAllCombosSelected ? [] : undeliveredComboIds);

  const selectionSummary = () => {
    if (selectedCount === 0) return canDeliver && canDeliverCombos ? 'Select items or combos to deliver' : 'Select what to deliver';

    const parts: string[] = [];
    if (selectedMenuItemIds.length > 0) parts.push(`${selectedMenuItemIds.length} of ${undeliveredMenuItemIds.length} items`);
    if (selectedComboIds.length > 0) parts.push(`${selectedComboIds.length} of ${undeliveredComboIds.length} combos`);

    return `${parts.join(' · ')} selected`;
  };

  return (
    <>
      <TableRow
        onClick={onToggle}
        className={cn(
          'cursor-pointer transition-colors hover:bg-[#f5f5f5] dark:hover:bg-[#272727]/50',
          isExpanded && 'bg-[#fafafa] dark:bg-[#272727]/30',
          // Kept until the list is filtered or paged away from.
          isLive && !isExpanded && 'bg-blue-50/70 dark:bg-blue-950/25'
        )}
      >
        <TableCell className="w-12 pl-4">
          <button
            type="button"
            aria-label={isExpanded ? `Collapse order ${order.orderNumber}` : `Expand order ${order.orderNumber}`}
            aria-expanded={isExpanded}
            // Bubbling to the row would fire a second toggle and undo this one.
            onClick={(event) => {
              event.stopPropagation();
              onToggle();
            }}
            className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-md border border-gray-200 text-gray-500 transition hover:bg-gray-100 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-800"
          >
            <ChevronDown className={cn('h-4 w-4 transition-transform duration-300 ease-in-out', isExpanded && 'rotate-180')} />
          </button>
        </TableCell>

        <TableCell>
          <div className="flex items-center gap-1.5">
            <span className="font-bold text-gray-900 dark:text-gray-100">#{order.orderNumber}</span>
            {isLive && (
              <span className="shrink-0 rounded bg-blue-600 px-1.5 py-0.5 text-[10px] font-bold tracking-wide text-white dark:bg-blue-500">NEW</span>
            )}
          </div>
          <div className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">{formatOrderTime(order.placedAt)}</div>
        </TableCell>

        <TableCell>
          <div className="flex items-center gap-2.5">
            <CustomerAvatar name={order.customer.name} url={order.customer.avatarUrl} />
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="truncate font-semibold text-gray-900 dark:text-gray-100">{order.customer.name}</span>
                {/* {tierConfig && (
                  <span className={cn('rounded px-1.5 py-0.5 text-[10px] font-bold tracking-wide', tierConfig.chipClass)}>{tierConfig.label}</span>
                )} */}
              </div>
              {order.customer.username && (
                <div className="truncate text-xs text-gray-500 lowercase dark:text-gray-400">@{order.customer.username}</div>
              )}
            </div>
          </div>
        </TableCell>

        {/* Decides which action buttons this row gets — see `getPrimaryAction`. */}
        <TableCell>
          <span className={cn('inline-flex rounded-md px-2.5 py-1 text-xs font-semibold', timingConfig.chipClass)}>{timingConfig.label}</span>
        </TableCell>

        <TableCell className="text-sm text-gray-600 dark:text-gray-400">{deliveryConfig.label}</TableCell>

        <TableCell>
          <span className={cn('inline-flex rounded-md px-2.5 py-1 text-xs font-semibold', deliveryConfig.chipClass)}>{order.deliveryLabel}</span>
        </TableCell>

        <TableCell>
          <span className="font-semibold text-gray-900 dark:text-gray-100">{itemCount}</span>
          {roundCount > 1 && <span className="ml-1.5 text-xs text-gray-500 dark:text-gray-400">· {roundCount} rounds</span>}
          {comboCount > 0 && (
            <span className="ml-1.5 text-xs text-gray-500 dark:text-gray-400">
              · {comboCount} {comboCount === 1 ? 'combo' : 'combos'}
            </span>
          )}
        </TableCell>

        <TableCell className="text-sm text-gray-600 dark:text-gray-400">{getPaymentTypeLabel(order.paymentType)}</TableCell>

        <TableCell>
          <OrderStatusBadge status={order.status} />
        </TableCell>

        <TableCell>
          <PaymentStatusBadge status={order.paymentStatus} />
        </TableCell>

        <TableCell className="font-bold text-gray-900 dark:text-gray-100">{formatCurrency(order.total)}</TableCell>

        {/* Buttons here act on the order, so they must not toggle the panel. */}
        <TableCell className="pr-4" onClick={(event) => event.stopPropagation()}>
          <div className="flex justify-end gap-2">
            {primaryAction && showPrimaryAction && (
              <Button
                type="button"
                size="sm"
                disabled={isPending || isDelivering || isConfirmBlocked}
                title={isConfirmBlocked ? 'Payment failed — this order cannot be confirmed' : undefined}
                onClick={() => onAdvance(order, primaryAction.type)}
                className="cursor-pointer font-semibold disabled:cursor-not-allowed"
              >
                {actionLabel(primaryAction.type, primaryAction.label)}
              </Button>
            )}

            {canMarkAsPaid && (
              <Button
                type="button"
                size="sm"
                variant="outline"
                disabled={isPending}
                onClick={() => onAdvance(order, MARK_AS_PAID_ACTION.type)}
                className="cursor-pointer font-semibold"
              >
                {actionLabel(MARK_AS_PAID_ACTION.type, MARK_AS_PAID_ACTION.label)}
              </Button>
            )}

            {secondaryAction && showSecondaryAction && (
              <Button
                type="button"
                size="sm"
                variant="outline"
                disabled={isPending}
                onClick={() => onDestructive(order, secondaryAction.type as DestructiveActionType)}
                className="cursor-pointer font-semibold"
              >
                {actionLabel(secondaryAction.type, secondaryAction.label)}
              </Button>
            )}

            {!showPrimaryAction && !canMarkAsPaid && !showSecondaryAction && (
              <Button type="button" size="sm" variant="outline" onClick={onToggle} className="cursor-pointer font-semibold">
                View detail
              </Button>
            )}
          </div>
        </TableCell>
      </TableRow>

      <TableRow className={cn('hover:bg-transparent', !isExpanded && 'border-0')}>
        <TableCell
          colSpan={ORDER_TABLE_COLUMN_COUNT}
          className={cn('p-0 transition-colors duration-300', isExpanded ? 'bg-[#f8f6f7] dark:bg-black' : 'bg-transparent')}
        >
          <div
            aria-hidden={!isExpanded}
            className={cn(
              'grid transition-[grid-template-rows,opacity] duration-300 ease-in-out motion-reduce:transition-none',
              isExpanded ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
            )}
          >
            <div className="overflow-hidden">
              <div className="grid gap-8 px-6 py-6 lg:grid-cols-2">
                <div>
                  <div className="mb-3 flex items-center justify-between gap-3">
                    <span className="text-xs font-bold tracking-wide text-gray-500 uppercase dark:text-gray-400">Items</span>

                    {canUpdate && (
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        disabled={isPending}
                        onClick={() => onUpdate(order)}
                        className="h-8 cursor-pointer gap-1.5 text-xs font-semibold"
                      >
                        <Pencil className="h-3.5 w-3.5" />
                        Update order
                      </Button>
                    )}

                    {canDeliverAny && (
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        disabled={isDelivering}
                        onClick={() => onDeliver(order, { all: true })}
                        className="h-8 cursor-pointer gap-1.5 text-xs font-semibold"
                      >
                        {isDelivering ? (
                          <ButtonLoading title="Delivering" />
                        ) : (
                          <>
                            <PackageCheck className="h-3.5 w-3.5" />
                            Deliver all
                          </>
                        )}
                      </Button>
                    )}
                  </div>

                  <div className="flex flex-col gap-3">
                    {isOrderEmpty && (
                      <div className="rounded-lg border border-dashed border-gray-200 px-4 py-6 text-center text-sm text-gray-500 dark:border-gray-800 dark:text-gray-400">
                        No items on this order
                      </div>
                    )}

                    {order.rounds.map((round) => (
                      <div
                        key={round.id}
                        className="overflow-hidden rounded-lg border border-gray-200 bg-white dark:border-gray-800 dark:bg-[#222121]"
                      >
                        <div className="flex items-center justify-between gap-3 border-b border-gray-200 bg-gray-50 px-4 py-2.5 dark:border-gray-800 dark:bg-[#1a1a1a]">
                          <div className="flex min-w-0 items-center gap-2.5">
                            {canDeliver && !round.isDelivered && (
                              <Checkbox
                                checked={isAllSelected}
                                disabled={isDelivering}
                                onCheckedChange={handleToggleAll}
                                aria-label="Select all undelivered items"
                                className="cursor-pointer"
                              />
                            )}
                            <span className="truncate text-xs font-bold tracking-wide text-gray-600 uppercase dark:text-gray-300">{round.label}</span>
                          </div>
                          <RoundStatusBadge isDelivered={round.isDelivered} className="px-2 py-0.5 text-[11px]" />
                        </div>

                        <ul>
                          {round.items.map((item) => {
                            const isSelectable = canDeliver && !round.isDelivered;
                            const isSelected = selectedMenuItemIds.includes(item.menuItemId);

                            return (
                              <li
                                key={item.id}
                                onClick={isSelectable && !isDelivering ? () => handleToggleItem(item.menuItemId) : undefined}
                                className={cn(
                                  'flex items-start justify-between gap-4 border-b border-gray-100 px-4 py-3 transition-colors last:border-0 dark:border-gray-800',
                                  isSelectable && 'cursor-pointer hover:bg-gray-50 dark:hover:bg-[#2a2a2a]',
                                  isSelected && 'bg-blue-50/60 dark:bg-blue-950/20'
                                )}
                              >
                                <div className="flex min-w-0 items-start gap-2.5">
                                  {isSelectable && (
                                    <Checkbox
                                      checked={isSelected}
                                      disabled={isDelivering}
                                      onCheckedChange={() => handleToggleItem(item.menuItemId)}
                                      onClick={(event) => event.stopPropagation()}
                                      aria-label={`Mark ${item.name} delivered`}
                                      className="mt-0.5 cursor-pointer"
                                    />
                                  )}
                                  <div className="min-w-0">
                                    <div className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                                      {item.quantity}× {item.name}
                                    </div>
                                    {item.note && (
                                      <div className="mt-1 flex items-center gap-1.5 text-xs font-medium text-orange-600 dark:text-orange-400">
                                        <NotebookPen className="h-3 w-3 shrink-0" />
                                        {item.note}
                                      </div>
                                    )}
                                  </div>
                                </div>
                                <span className="shrink-0 text-sm font-semibold text-gray-900 dark:text-gray-100">
                                  {formatCurrency(item.lineTotal)}
                                </span>
                              </li>
                            );
                          })}
                        </ul>
                      </div>
                    ))}

                    {hasCombos && (
                      <div className="overflow-hidden rounded-lg border border-gray-200 bg-white dark:border-gray-800 dark:bg-[#222121]">
                        <div className="flex items-center justify-between gap-3 border-b border-gray-200 bg-gray-50 px-4 py-2.5 dark:border-gray-800 dark:bg-[#1a1a1a]">
                          <div className="flex min-w-0 items-center gap-2.5">
                            {canDeliverCombos && (
                              <Checkbox
                                checked={isAllCombosSelected}
                                disabled={isDelivering}
                                onCheckedChange={handleToggleAllCombos}
                                aria-label="Select all undelivered combos"
                                className="cursor-pointer"
                              />
                            )}
                            <span className="truncate text-xs font-bold tracking-wide text-gray-600 uppercase dark:text-gray-300">Combos</span>
                          </div>
                          <span
                            className={cn(
                              'inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-[11px] font-semibold whitespace-nowrap',
                              BADGE_TONE_CLASS.indigo
                            )}
                          >
                            <Package className="h-3.5 w-3.5 shrink-0" strokeWidth={2.5} />
                            {comboCount} {comboCount === 1 ? 'combo' : 'combos'}
                          </span>
                        </div>

                        <ul>
                          {order.combos.map((combo) => (
                            <ComboLine
                              key={combo.id}
                              combo={combo}
                              isSelectable={canDeliverCombos && !combo.isDelivered}
                              isSelected={selectedComboIds.includes(combo.id)}
                              isDelivering={isDelivering}
                              onToggle={() => handleToggleCombo(combo.id)}
                            />
                          ))}
                        </ul>
                      </div>
                    )}

                    {canDeliverAny && (
                      <div className="flex items-center justify-between gap-3 rounded-lg border border-gray-200 bg-gray-50 px-4 py-2.5 dark:border-gray-800 dark:bg-[#1a1a1a]">
                        <span className="text-xs text-gray-500 dark:text-gray-400">{selectionSummary()}</span>

                        <Button
                          type="button"
                          size="sm"
                          disabled={selectedCount === 0 || isDelivering}
                          onClick={() => onDeliver(order, { menuItemIds: selectedMenuItemIds, comboIds: selectedComboIds })}
                          className="h-8 cursor-pointer text-xs font-semibold"
                        >
                          {isDelivering ? <ButtonLoading title="Delivering" /> : 'Deliver selected'}
                        </Button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Order summary */}
                <div>
                  <div className="mb-3 text-xs font-bold tracking-wide text-gray-500 uppercase dark:text-gray-400">Order</div>

                  <DetailRow label="Order ID" value={order.orderNumber} />
                  <DetailRow label="Placed" value={formatOrderTime(order.placedAt)} />
                  <DetailRow label="Delivery" value={order.deliveryLabel} />
                  <DetailRow label="Payment" value={getPaymentTypeLabel(order.paymentType)} />
                  <DetailRow
                    label="Customer"
                    value={order.customer.username ? `${order.customer.name} · @${order.customer.username}` : order.customer.name}
                  />
                  <DetailRow label="Email" value={order.customer.email || '-'} />
                  <DetailRow label="Loyalty tier" value={tierConfig?.label || '-'} />

                  {order.rejectionReason && <DetailRow label="Reason" value={order.rejectionNote || order.rejectionReason} />}

                  <div className="mt-5 space-y-2 border-t border-gray-200 pt-4 dark:border-gray-800">
                    <div className="flex items-baseline justify-between gap-6">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Subtotal</span>
                      <span className="text-sm text-gray-900 dark:text-gray-100">{formatCurrency(order.subtotal)}</span>
                    </div>

                    {summaryLines.map((line) => (
                      <div key={line.key} className="flex items-baseline justify-between gap-6">
                        <span className="text-sm text-gray-600 dark:text-gray-400">{line.label}</span>
                        <span className={cn('text-sm', line.isDeduction ? 'text-green-600 dark:text-green-400' : 'text-gray-900 dark:text-gray-100')}>
                          {line.isDeduction ? '−' : ''}
                          {formatCurrency(line.amount)}
                        </span>
                      </div>
                    ))}

                    <div className="pt-2">
                      <div className="text-base font-bold text-gray-900 dark:text-gray-100">Total</div>
                      <div className="text-xl font-bold text-gray-900 dark:text-gray-100">{formatCurrency(order.total)}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </TableCell>
      </TableRow>
    </>
  );
};
