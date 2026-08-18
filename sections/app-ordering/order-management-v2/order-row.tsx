'use client';

import ButtonLoading from '@/components/common/button-loading';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { TableCell, TableRow } from '@/components/ui/table';
import { cn } from '@/lib/utils';
import { ChevronDown, Loader2, NotebookPen, PackageCheck, Pencil, User } from 'lucide-react';
import React, { useEffect, useMemo, useState } from 'react';
import type { BadgeConfig } from './constants';
import {
  BADGE_TONE_CLASS,
  DELIVERABLE_STATUSES,
  MARK_AS_PAID_ACTION,
  MARK_AS_PAID_STATUSES,
  PRIMARY_ACTION_BY_STATUS,
  SECONDARY_ACTION_BY_STATUS,
  formatCurrency,
  formatOrderTime,
  getDeliveryTypeConfig,
  getLoyaltyTierConfig,
  getOrderItemCount,
  getOrderStatusConfig,
  getPaymentStatusConfig,
  getPaymentTypeLabel,
  getRoundDeliveryConfig,
  isOrderEditable,
} from './constants';
import { DestructiveActionType, Order, OrderActionType } from './types';
import type { DeliverItemsPayload } from './use-order-management';

export const ORDER_TABLE_COLUMN_COUNT = 10;

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
}) => {
  const deliveryConfig = getDeliveryTypeConfig(order.deliveryType);
  const tierConfig = order.customer.tier ? getLoyaltyTierConfig(order.customer.tier) : null;
  const primaryAction = PRIMARY_ACTION_BY_STATUS[order.status];
  const secondaryAction = SECONDARY_ACTION_BY_STATUS[order.status];

  // A failed payment has to be settled before the order can be accepted.
  const isConfirmBlocked = primaryAction?.type === 'confirm' && order.paymentStatus === 'failed';
  const canMarkAsPaid = order.paymentStatus !== 'paid' && MARK_AS_PAID_STATUSES.includes(order.status);

  // Money has already changed hands, so cancelling is off the table. Reject
  // is unaffected — it only ever appears before an order is accepted.
  const showSecondaryAction = Boolean(secondaryAction) && !(secondaryAction?.type === 'cancel' && order.paymentStatus === 'paid');

  const itemCount = getOrderItemCount(order);
  const roundCount = order.rounds.length;

  // ---- Item delivery ----
  //
  // The API keys delivery on the menu item, not the order line, so selection
  // is keyed the same way. Two lines of the same menu item therefore tick
  // together — which is exactly what the request would do to them.
  const undeliveredMenuItemIds = useMemo(() => {
    const ids = order.rounds.filter((round) => !round.isDelivered).flatMap((round) => round.items.map((item) => item.menuItemId));
    return [...new Set(ids)];
  }, [order.rounds]);

  const [selectedMenuItemIds, setSelectedMenuItemIds] = useState<string[]>([]);

  // A delivered item leaves the list, so any stale selection has to go too.
  useEffect(() => {
    setSelectedMenuItemIds((current) => current.filter((id) => undeliveredMenuItemIds.includes(id)));
  }, [undeliveredMenuItemIds]);

  const canDeliver = DELIVERABLE_STATUSES.includes(order.status) && undeliveredMenuItemIds.length > 0;

  const canUpdate = isOrderEditable(order);

  // "Delivered" is settled through the delivery endpoint, so it reports its
  // progress via `isDelivering` rather than `pendingAction`.
  const isActionRunning = (action: OrderActionType) =>
    action === 'delivered' ? isDelivering : isPending && pendingAction === action;

  const actionLabel = (action: OrderActionType, label: string) => (
    <>
      {isActionRunning(action) && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
      {label}
    </>
  );

  const isAllSelected = undeliveredMenuItemIds.length > 0 && selectedMenuItemIds.length === undeliveredMenuItemIds.length;

  const handleToggleItem = (menuItemId: string) =>
    setSelectedMenuItemIds((current) => (current.includes(menuItemId) ? current.filter((id) => id !== menuItemId) : [...current, menuItemId]));

  const handleToggleAll = () => setSelectedMenuItemIds(isAllSelected ? [] : undeliveredMenuItemIds);

  return (
    <>
      <TableRow
        onClick={onToggle}
        className={cn(
          'cursor-pointer transition-colors hover:bg-[#f5f5f5] dark:hover:bg-[#272727]/50',
          isExpanded && 'bg-[#fafafa] dark:bg-[#272727]/30'
        )}
      >
        <TableCell className="w-12 pl-4">
          <button
            type="button"
            aria-label={isExpanded ? `Collapse order ${order.orderNumber}` : `Expand order ${order.orderNumber}`}
            aria-expanded={isExpanded}
            // Toggles on its own and stops there — letting it bubble to the
            // row would fire a second toggle and undo this one.
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
          <div className="font-bold text-gray-900 dark:text-gray-100">#{order.orderNumber}</div>
          <div className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">{formatOrderTime(order.placedAt)}</div>
        </TableCell>

        <TableCell>
          <div className="flex items-center gap-2.5">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-full bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400">
              {order.customer.avatarUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={order.customer.avatarUrl} alt="" className="h-full w-full object-cover" />
              ) : (
                <User className="h-4 w-4" />
              )}
            </span>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="truncate font-semibold text-gray-900 dark:text-gray-100">{order.customer.name}</span>
                {/* {tierConfig && (
                  <span className={cn('rounded px-1.5 py-0.5 text-[10px] font-bold tracking-wide', tierConfig.chipClass)}>{tierConfig.label}</span>
                )} */}
              </div>
              {order.customer.username && <div className="truncate text-xs text-gray-500 dark:text-gray-400">@{order.customer.username}</div>}
            </div>
          </div>
        </TableCell>

        <TableCell>
          <span className={cn('inline-flex rounded-md px-2.5 py-1 text-xs font-semibold', deliveryConfig.chipClass)}>{order.deliveryLabel}</span>
        </TableCell>

        <TableCell>
          <span className="font-semibold text-gray-900 dark:text-gray-100">{itemCount}</span>
          {roundCount > 1 && <span className="ml-1.5 text-xs text-gray-500 dark:text-gray-400">· {roundCount} rounds</span>}
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
            {primaryAction && (
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

            {!primaryAction && !canMarkAsPaid && !showSecondaryAction && (
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

                    {canDeliver && (
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
                    {order.rounds.length === 0 && (
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

                        {canDeliver && !round.isDelivered && (
                          <div className="flex items-center justify-between gap-3 border-t border-gray-200 bg-gray-50 px-4 py-2.5 dark:border-gray-800 dark:bg-[#1a1a1a]">
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                              {selectedMenuItemIds.length > 0
                                ? `${selectedMenuItemIds.length} of ${undeliveredMenuItemIds.length} selected`
                                : 'Select items to deliver'}
                            </span>

                            <Button
                              type="button"
                              size="sm"
                              disabled={selectedMenuItemIds.length === 0 || isDelivering}
                              onClick={() => onDeliver(order, { menuItemIds: selectedMenuItemIds })}
                              className="h-8 cursor-pointer text-xs font-semibold"
                            >
                              {isDelivering ? <ButtonLoading title="Delivering" /> : 'Deliver selected'}
                            </Button>
                          </div>
                        )}
                      </div>
                    ))}
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
                    <div className="flex items-baseline justify-between gap-6">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Napojnica (0% tax)</span>
                      <span className="text-sm text-gray-900 dark:text-gray-100">{formatCurrency(order.tipAmount)}</span>
                    </div>
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
