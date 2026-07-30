'use client';

import { Button } from '@/components/ui/button';
import { TableCell, TableRow } from '@/components/ui/table';
import { cn } from '@/lib/utils';
import { ChevronDown, ChevronUp, NotebookPen, User } from 'lucide-react';
import React from 'react';
import {
  DELIVERY_TYPE_CONFIG,
  LOYALTY_TIER_CONFIG,
  ORDER_STATUS_CONFIG,
  PAYMENT_TYPE_CONFIG,
  PRIMARY_ACTION_BY_STATUS,
  SECONDARY_ACTION_BY_STATUS,
  formatCurrency,
  formatOrderTime,
  getOrderItemCount,
} from './constants';
import { DestructiveActionType, Order, OrderActionType } from './types';

export const ORDER_TABLE_COLUMN_COUNT = 9;

interface OrderRowProps {
  order: Order;
  isExpanded: boolean;
  onToggle: () => void;
  onAdvance: (order: Order, action: OrderActionType) => void;
  onDestructive: (order: Order, action: DestructiveActionType) => void;
  isPending?: boolean;
}

const StatusChip: React.FC<{ status: Order['status']; className?: string }> = ({ status, className }) => {
  const config = ORDER_STATUS_CONFIG[status];

  return (
    <span className={cn('inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold', config.chipClass, className)}>
      <span className={cn('h-1.5 w-1.5 rounded-full', config.dotClass)} />
      {config.label}
    </span>
  );
};

const DetailRow: React.FC<{ label: string; value: React.ReactNode }> = ({ label, value }) => (
  <div className="flex items-baseline justify-between gap-6 border-b border-dashed border-gray-200 py-2 dark:border-gray-800">
    <span className="shrink-0 text-sm text-gray-500 dark:text-gray-400">{label}</span>
    <span className="truncate text-right text-sm font-semibold text-gray-900 dark:text-gray-100">{value}</span>
  </div>
);

export const OrderRow: React.FC<OrderRowProps> = ({ order, isExpanded, onToggle, onAdvance, onDestructive, isPending = false }) => {
  const deliveryConfig = DELIVERY_TYPE_CONFIG[order.deliveryType];
  const tierConfig = LOYALTY_TIER_CONFIG[order.customer.tier];
  const primaryAction = PRIMARY_ACTION_BY_STATUS[order.status];
  const secondaryAction = SECONDARY_ACTION_BY_STATUS[order.status];

  const itemCount = getOrderItemCount(order);
  const roundCount = order.rounds.length;

  return (
    <>
      <TableRow className={cn('transition-colors hover:bg-[#f5f5f5] dark:hover:bg-[#272727]/50', isExpanded && 'bg-[#fafafa] dark:bg-[#272727]/30')}>
        <TableCell className="w-12 pl-4">
          <button
            type="button"
            aria-label={isExpanded ? `Collapse order ${order.orderNumber}` : `Expand order ${order.orderNumber}`}
            aria-expanded={isExpanded}
            onClick={onToggle}
            className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-md border border-gray-200 text-gray-500 transition hover:bg-gray-100 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-800"
          >
            {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </button>
        </TableCell>

        <TableCell>
          <div className="font-bold text-gray-900 dark:text-gray-100">#{order.orderNumber}</div>
          <div className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">{formatOrderTime(order.placedAt)}</div>
        </TableCell>

        <TableCell>
          <div className="flex items-center gap-2.5">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400">
              <User className="h-4 w-4" />
            </span>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="truncate font-semibold text-gray-900 dark:text-gray-100">{order.customer.name}</span>
                <span className={cn('rounded px-1.5 py-0.5 text-[10px] font-bold tracking-wide', tierConfig.chipClass)}>{tierConfig.label}</span>
              </div>
              <div className="truncate text-xs text-gray-500 dark:text-gray-400">@{order.customer.username}</div>
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

        <TableCell className="text-sm text-gray-600 dark:text-gray-400">{PAYMENT_TYPE_CONFIG[order.paymentType].label}</TableCell>

        <TableCell>
          <StatusChip status={order.status} />
        </TableCell>

        <TableCell className="font-bold text-gray-900 dark:text-gray-100">{formatCurrency(order.total)}</TableCell>

        <TableCell className="pr-4">
          <div className="flex justify-end gap-2">
            {primaryAction ? (
              <>
                <Button
                  type="button"
                  size="sm"
                  disabled={isPending}
                  onClick={() => onAdvance(order, primaryAction.type)}
                  className="cursor-pointer font-semibold"
                >
                  {primaryAction.label}
                </Button>
                {secondaryAction && (
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    disabled={isPending}
                    onClick={() => onDestructive(order, secondaryAction.type as DestructiveActionType)}
                    className="cursor-pointer font-semibold"
                  >
                    {secondaryAction.label}
                  </Button>
                )}
              </>
            ) : (
              <Button type="button" size="sm" variant="outline" onClick={onToggle} className="cursor-pointer font-semibold">
                View detail
              </Button>
            )}
          </div>
        </TableCell>
      </TableRow>

      {isExpanded && (
        <TableRow className="hover:bg-transparent">
          {/* Inset panel — deliberately the page background so it reads as recessed inside the card. */}
          <TableCell colSpan={ORDER_TABLE_COLUMN_COUNT} className="bg-[#f8f6f7] p-0 dark:bg-black">
            <div className="grid gap-8 px-6 py-6 lg:grid-cols-2">
              {/* Items, grouped by round */}
              <div>
                <div className="mb-3 text-xs font-bold tracking-wide text-gray-500 uppercase dark:text-gray-400">Items</div>

                <div className="flex flex-col gap-3">
                  {order.rounds.map((round) => (
                    <div key={round.id} className="overflow-hidden rounded-lg border border-gray-200 bg-white dark:border-gray-800 dark:bg-[#222121]">
                      <div className="flex items-center justify-between gap-3 border-b border-gray-200 bg-gray-50 px-4 py-2.5 dark:border-gray-800 dark:bg-[#1a1a1a]">
                        <span className="text-xs font-bold tracking-wide text-gray-600 uppercase dark:text-gray-300">{round.label}</span>
                        <StatusChip status={round.status} className="text-[10px] tracking-wide uppercase" />
                      </div>

                      <ul>
                        {round.items.map((item) => (
                          <li
                            key={item.id}
                            className="flex items-start justify-between gap-4 border-b border-gray-100 px-4 py-3 last:border-0 dark:border-gray-800"
                          >
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
                            <span className="shrink-0 text-sm font-semibold text-gray-900 dark:text-gray-100">{formatCurrency(item.lineTotal)}</span>
                          </li>
                        ))}
                      </ul>
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
                <DetailRow label="Payment" value={PAYMENT_TYPE_CONFIG[order.paymentType].label} />
                <DetailRow label="Customer" value={`${order.customer.name} · @${order.customer.username}`} />
                <DetailRow label="Email" value={order.customer.email} />
                <DetailRow label="Loyalty tier" value={LOYALTY_TIER_CONFIG[order.customer.tier].label} />

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
          </TableCell>
        </TableRow>
      )}
    </>
  );
};
