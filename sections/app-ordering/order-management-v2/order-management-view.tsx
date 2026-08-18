'use client';

import ConfirmDialog from '@/components/comfirm-dialog/confirm-dialog';
import PaginationControls from '@/components/table/pagination-controls';
import TableHeadCustom from '@/components/table/table-head-custom';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table } from '@/components/ui/table';
import TableBodyWrapper from '@/components/ui/table-body-wrapper';
import { useBoolean } from '@/hooks/useBoolean';
import { useDebounce } from '@/hooks/useDebounce';
import { useOrganizerOrganization } from '@/hooks/useOrganizerOrganization';
import { cn } from '@/lib/utils';
import { getErrorMessage } from '@/utils/api';
import { showError, showSuccess } from '@/utils/toast';
import { RefreshCw, Search, X } from 'lucide-react';
import React, { useEffect, useMemo, useState } from 'react';
import {
  ACTION_SUCCESS_MESSAGE,
  DATE_RANGE_OPTIONS,
  DEFAULT_ORDER_FILTERS,
  DEFAULT_PAGE_LIMIT,
  DELIVERY_FILTER_OPTIONS,
  ORDER_TAB_CONFIG,
  PAYMENT_FILTER_OPTIONS,
  STATUS_FILTER_OPTIONS,
} from './constants';
import { OrderActionModal } from './order-action-modal';
import { ORDER_TABLE_COLUMN_COUNT, OrderRow } from './order-row';
import { OrderUpdateModal } from './order-update-modal';
import {
  DateRangeFilter,
  DeliveryType,
  DestructiveActionPayload,
  DestructiveActionType,
  Order,
  OrderActionType,
  OrderFilters,
  OrderStatus,
  OrderTab,
  OrderUpdatePayload,
  PaymentType,
  UserType,
} from './types';
import type { DeliverItemsPayload } from './use-order-management';
import { useOrderManagement } from './use-order-management';

const TABLE_HEAD = [
  { id: 'expand', label: '', align: 'left' },
  { id: 'order', label: 'Order', align: 'left' },
  { id: 'customer', label: 'Customer', align: 'left' },
  { id: 'delivery', label: 'Delivery', align: 'left' },
  { id: 'items', label: 'Items', align: 'left' },
  { id: 'payment', label: 'Method', align: 'left' },
  { id: 'status', label: 'Status', align: 'left' },
  { id: 'paymentStatus', label: 'Payment', align: 'left' },
  { id: 'total', label: 'Total', align: 'left' },
  { id: 'actions', label: '', align: 'right' },
];

const SELECT_TRIGGER_CLASS = 'h-11 w-full cursor-pointer bg-white shadow-none md:w-auto md:min-w-[168px] dark:bg-[#222121]';

const SELECT_ITEM_CLASS = 'cursor-pointer';

interface OrderManagementViewProps {
  userType: UserType;
}

export const OrderManagementViewV2: React.FC<OrderManagementViewProps> = ({ userType }) => {
  // Single source of truth for the organization id — super-admin resolves it from
  // the company selector in the header, organizer from the dropdown this renders.
  const { organizationId, OrganizationDropdown } = useOrganizerOrganization({
    userType,
    storageKey: 'order-management-v2-organization',
  });

  const [activeTab, setActiveTab] = useState<OrderTab>('active');
  const [searchQuery, setSearchQuery] = useState<string>(DEFAULT_ORDER_FILTERS.search);
  const [status, setStatus] = useState<OrderStatus | 'all'>(DEFAULT_ORDER_FILTERS.status);
  const [deliveryType, setDeliveryType] = useState<DeliveryType | 'all'>(DEFAULT_ORDER_FILTERS.deliveryType);
  const [paymentType, setPaymentType] = useState<PaymentType | 'all'>(DEFAULT_ORDER_FILTERS.paymentType);
  // Starts as `all` so the first load sends no `range` param at all.
  const [dateRange, setDateRange] = useState<DateRangeFilter | 'all'>(DEFAULT_ORDER_FILTERS.dateRange);
  const [page, setPage] = useState(1);
  const [limit] = useState(DEFAULT_PAGE_LIMIT);
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);

  const [destructiveAction, setDestructiveAction] = useState<{ action: DestructiveActionType; order: Order } | null>(null);
  const [pendingOrderingState, setPendingOrderingState] = useState<boolean | null>(null);
  const [deliverAllOrder, setDeliverAllOrder] = useState<Order | null>(null);
  const [markAsPaidOrder, setMarkAsPaidOrder] = useState<Order | null>(null);
  const [updatingOrder, setUpdatingOrder] = useState<Order | null>(null);

  const actionModal = useBoolean();
  const orderingConfirm = useBoolean();
  const deliverAllConfirm = useBoolean();
  const markAsPaidConfirm = useBoolean();
  const updateModal = useBoolean();

  const debouncedSearch = useDebounce(searchQuery, 500);

  // Memoised because the data hook re-fetches whenever this object changes.
  const filters: OrderFilters = useMemo(
    () => ({ tab: activeTab, search: debouncedSearch, status, deliveryType, paymentType, dateRange }),
    [activeTab, debouncedSearch, status, deliveryType, paymentType, dateRange]
  );

  const {
    orders,
    counts,
    pagination,
    orderingStatus,
    isFetching,
    isListLoading,
    isTogglingOrdering,
    updatingOrderId,
    pendingOrderId,
    pendingAction,
    deliveringOrderId,
    deliverItems,
    refetchOrders,
    toggleOrdering,
    runOrderAction,
    updateOrderDetails,
  } = useOrderManagement({
    organizationId,
    filters,
    page,
    limit,
  });

  // Drives the "Clear filters" control — the tab is navigation, not a filter.
  const hasActiveFilters =
    searchQuery !== DEFAULT_ORDER_FILTERS.search ||
    status !== DEFAULT_ORDER_FILTERS.status ||
    deliveryType !== DEFAULT_ORDER_FILTERS.deliveryType ||
    paymentType !== DEFAULT_ORDER_FILTERS.paymentType ||
    dateRange !== DEFAULT_ORDER_FILTERS.dateRange;

  const handleClearFilters = () => {
    setSearchQuery(DEFAULT_ORDER_FILTERS.search);
    setStatus(DEFAULT_ORDER_FILTERS.status);
    setDeliveryType(DEFAULT_ORDER_FILTERS.deliveryType);
    setPaymentType(DEFAULT_ORDER_FILTERS.paymentType);
    setDateRange(DEFAULT_ORDER_FILTERS.dateRange);
  };

  // A narrowed result set rarely has the page the user was on, and an
  // expanded row that filters away would stay "open" invisibly.
  useEffect(() => {
    setPage(1);
    setExpandedOrderId(null);
  }, [filters, organizationId]);

  // Empty until the status endpoint returns a venue/organization name — every
  // sentence that uses it degrades to not naming one.
  const venueName = orderingStatus?.venueName || '';
  const venueSuffix = venueName ? ` at ${venueName}` : '';

  const handleAdvance = async (order: Order, action: OrderActionType) => {
    // "Delivered" settles every outstanding item at once, so it asks first.
    if (action === 'delivered') {
      setDeliverAllOrder(order);
      deliverAllConfirm.onTrue();
      return;
    }

    // Settling payment is irreversible, so it asks too.
    if (action === 'markAsPaid') {
      setMarkAsPaidOrder(order);
      markAsPaidConfirm.onTrue();
      return;
    }

    try {
      const message = await runOrderAction(order, action);
      showSuccess(message || ACTION_SUCCESS_MESSAGE[action]);
    } catch (error) {
      showError(getErrorMessage(error));
    }
  };

  const handleDeliver = async (order: Order, payload: DeliverItemsPayload) => {
    // Same guard for the panel's "Deliver all"; a selection needs no warning.
    if (payload.all) {
      setDeliverAllOrder(order);
      deliverAllConfirm.onTrue();
      return;
    }

    try {
      const message = await deliverItems(order, payload);
      showSuccess(message || 'Selected items marked as delivered');
    } catch (error) {
      showError(getErrorMessage(error));
    }
  };

  const handleConfirmDeliverAll = async () => {
    if (!deliverAllOrder) return;

    try {
      const message = await deliverItems(deliverAllOrder, { all: true });
      showSuccess(message || ACTION_SUCCESS_MESSAGE.delivered);
      deliverAllConfirm.onFalse();
      setDeliverAllOrder(null);
    } catch (error) {
      showError(getErrorMessage(error));
    }
  };

  const handleConfirmMarkAsPaid = async () => {
    if (!markAsPaidOrder) return;

    try {
      const message = await runOrderAction(markAsPaidOrder, 'markAsPaid');
      showSuccess(message || ACTION_SUCCESS_MESSAGE.markAsPaid);
      markAsPaidConfirm.onFalse();
      setMarkAsPaidOrder(null);
    } catch (error) {
      showError(getErrorMessage(error));
    }
  };

  const handleOpenUpdate = (order: Order) => {
    setUpdatingOrder(order);
    updateModal.onTrue();
  };

  const handleConfirmUpdate = async (payload: OrderUpdatePayload) => {
    if (!updatingOrder) return;

    try {
      const message = await updateOrderDetails(updatingOrder, payload);
      showSuccess(message || 'Order updated');
      updateModal.onFalse();
      setUpdatingOrder(null);
    } catch (error) {
      showError(getErrorMessage(error));
    }
  };

  const handleOpenDestructive = (order: Order, action: DestructiveActionType) => {
    setDestructiveAction({ action, order });
    actionModal.onTrue();
  };

  const handleConfirmDestructive = async (payload: DestructiveActionPayload) => {
    if (!destructiveAction) return;

    try {
      const message = await runOrderAction(destructiveAction.order, destructiveAction.action, payload);
      showSuccess(message || ACTION_SUCCESS_MESSAGE[destructiveAction.action]);
      actionModal.onFalse();
      setDestructiveAction(null);
    } catch (error) {
      showError(getErrorMessage(error));
    }
  };

  const handleConfirmOrderingToggle = async () => {
    if (pendingOrderingState === null) return;

    try {
      const message = await toggleOrdering(pendingOrderingState);
      showSuccess(message || `In-app ordering ${pendingOrderingState ? 'opened' : 'closed'}`);
      orderingConfirm.onFalse();
      setPendingOrderingState(null);
    } catch (error) {
      showError(getErrorMessage(error));
    }
  };

  const isOpen = Boolean(orderingStatus?.isOpen);

  return (
    <div className="flex flex-col gap-5 pb-10">
      {/* Header + ordering switch */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <div className="flex items-center gap-1">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Order Management</h1>
            <button
              type="button"
              title="Refresh orders"
              aria-label="Refresh orders"
              disabled={!organizationId || isFetching}
              onClick={refetchOrders}
              className="flex h-8 w-8 cursor-pointer items-center justify-center text-gray-500 transition disabled:cursor-not-allowed disabled:opacity-50 dark:text-gray-400"
            >
              <RefreshCw className={cn('h-4 w-4', isFetching && 'animate-spin')} />
            </button>
          </div>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Live in-app orders
            {venueName && (
              <>
                {' '}
                for <span className="font-semibold text-gray-700 dark:text-gray-200">{venueName}</span>
              </>
            )}
          </p>
        </div>

        <div className="flex flex-col items-stretch gap-3 lg:flex-row lg:items-start">
          {OrganizationDropdown}

          {orderingStatus && (
            <div className="dark:bg-secondary rounded-xl border bg-white px-5 py-4 shadow-md lg:max-w-2xl">
              <div className="flex items-start justify-between gap-6">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className={cn('h-2 w-2 shrink-0 rounded-full', isOpen ? 'bg-green-500' : 'bg-gray-400')} />
                    <span className="font-bold text-gray-900 dark:text-gray-100">In-app ordering is {isOpen ? 'open' : 'closed'}</span>
                  </div>

                  {/* The status endpoint returns only `isOrderingEnabled` — it has no
                      `openedBy`, `openedAt` or venue name. Restore this once the
                      backend sends them, along with `formatOpenedAt` in the imports.

                  {isOpen ? (
                    <p className="mt-1.5 text-xs leading-relaxed text-gray-500 dark:text-gray-400">
                      Opened by <span className="font-semibold text-gray-700 dark:text-gray-200">{orderingStatus.openedBy}</span> ·{' '}
                      {formatOpenedAt(orderingStatus.openedAt)} · applies to{' '}
                      <span className="font-semibold text-gray-700 dark:text-gray-200">{venueName}</span> only
                    </p>
                  ) : (
                    <p className="mt-1.5 text-xs leading-relaxed text-gray-500 dark:text-gray-400">
                      Customers cannot place new orders at <span className="font-semibold text-gray-700 dark:text-gray-200">{venueName}</span> right
                      now.
                    </p>
                  )}
                  */}

                  {!isOpen && (
                    <p className="mt-1.5 text-xs leading-relaxed text-gray-500 dark:text-gray-400">Customers cannot place new orders right now.</p>
                  )}

                  <p className="mt-1 text-xs leading-relaxed text-gray-400 dark:text-gray-400">
                    Manual control - it does not follow venue opening hours. Someone has to close it.
                  </p>
                </div>

                <button
                  type="button"
                  role="switch"
                  aria-checked={isOpen}
                  aria-label="In-app ordering"
                  disabled={isTogglingOrdering || !organizationId}
                  onClick={() => {
                    setPendingOrderingState(!isOpen);
                    orderingConfirm.onTrue();
                  }}
                  className={cn(
                    'relative inline-flex h-7 w-12 shrink-0 cursor-pointer items-center rounded-full transition-colors',
                    'focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:outline-none',
                    isOpen ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-600',
                    (isTogglingOrdering || !organizationId) && 'cursor-not-allowed opacity-50'
                  )}
                >
                  <span
                    className={cn(
                      'pointer-events-none absolute left-[3px] h-[22px] w-[22px] rounded-full bg-white shadow-md transition-transform',
                      isOpen ? 'translate-x-5' : 'translate-x-0'
                    )}
                  />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {!organizationId ? (
        <Card className="dark:bg-secondary px-2 py-24 text-center shadow-md md:px-8">
          <div className="mb-4 text-6xl opacity-30">🏢</div>
          <h3 className="mb-2 text-xl font-bold text-gray-900 dark:text-gray-100">
            {userType === 'organizer' ? 'Select an Organization' : 'No Company Selected'}
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {userType === 'organizer' ? 'Choose an organization from the dropdown above to view orders' : 'Please select a company to view orders'}
          </p>
        </Card>
      ) : (
        <Card className="dark:bg-secondary gap-5 px-2 shadow-md md:px-8">
          {/* Tabs */}
          <div className="flex gap-6 border-b border-gray-200 dark:border-gray-800">
            {ORDER_TAB_CONFIG.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  'flex cursor-pointer items-center gap-2 border-b-[3px] px-1 pb-3 text-sm font-semibold transition-colors',
                  activeTab === tab.id
                    ? 'border-blue-600 text-blue-600 dark:border-blue-400 dark:text-blue-400'
                    : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
                )}
              >
                {tab.label}
                <span
                  className={cn(
                    'inline-flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-[11px] font-bold tabular-nums',
                    activeTab === tab.id ? 'bg-blue-600 text-white dark:bg-blue-500' : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400'
                  )}
                >
                  {counts[tab.id]}
                </span>
              </button>
            ))}
          </div>

          {/* Filters */}
          <div className="flex flex-col gap-3 md:flex-row md:items-center">
            <div className="relative flex-1">
              <Search className="absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <Input
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder="Search by order ID, customer name, username or email..."
                aria-label="Search orders"
                className="h-11 w-full bg-white pl-10 dark:bg-[#222121]"
              />
            </div>

            <Select value={status} onValueChange={(next) => setStatus(next as OrderStatus | 'all')}>
              <SelectTrigger className={SELECT_TRIGGER_CLASS} aria-label="Filter by status">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {STATUS_FILTER_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value} className={SELECT_ITEM_CLASS}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={deliveryType} onValueChange={(next) => setDeliveryType(next as DeliveryType | 'all')}>
              <SelectTrigger className={SELECT_TRIGGER_CLASS} aria-label="Filter by delivery type">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {DELIVERY_FILTER_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value} className={SELECT_ITEM_CLASS}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={paymentType} onValueChange={(next) => setPaymentType(next as PaymentType | 'all')}>
              <SelectTrigger className={SELECT_TRIGGER_CLASS} aria-label="Filter by payment type">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {PAYMENT_FILTER_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value} className={SELECT_ITEM_CLASS}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={dateRange} onValueChange={(next) => setDateRange(next as DateRangeFilter | 'all')}>
              <SelectTrigger className={cn(SELECT_TRIGGER_CLASS, 'md:min-w-[132px]')} aria-label="Filter by date">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {DATE_RANGE_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value} className={SELECT_ITEM_CLASS}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Only worth showing once there is something to clear. */}
            {hasActiveFilters && (
              <button
                type="button"
                title="Clear all filters"
                aria-label="Clear all filters"
                onClick={handleClearFilters}
                className="flex h-9 shrink-0 cursor-pointer items-center justify-center gap-1.5 rounded-md border border-gray-200 px-3 text-sm font-semibold text-gray-600 transition hover:bg-gray-100 dark:border-[#4A4949] dark:text-gray-300 dark:hover:bg-gray-800"
              >
                <X className="h-4 w-4" />
                Clear
              </button>
            )}
          </div>

          {/* Orders table */}
          <div className="min-h-[45vh] overflow-x-auto rounded-lg border">
            <Table className="w-full rounded-md border">
              <TableHeadCustom headLabel={TABLE_HEAD} />

              <TableBodyWrapper loading={isListLoading} colSpan={ORDER_TABLE_COLUMN_COUNT} dataLength={orders.length} emptyMessage="No orders found">
                {orders.map((order) => (
                  <OrderRow
                    key={order.id}
                    order={order}
                    isExpanded={expandedOrderId === order.id}
                    isPending={pendingOrderId === order.id}
                    pendingAction={pendingAction}
                    isDelivering={deliveringOrderId === order.id}
                    onToggle={() => setExpandedOrderId(expandedOrderId === order.id ? null : order.id)}
                    onAdvance={handleAdvance}
                    onDestructive={handleOpenDestructive}
                    onDeliver={handleDeliver}
                    onUpdate={handleOpenUpdate}
                  />
                ))}
              </TableBodyWrapper>
            </Table>
          </div>

          {pagination.totalRecords > 0 && (
            <PaginationControls
              currentPage={page}
              totalPages={pagination.totalPages}
              totalRecords={pagination.totalRecords}
              limit={pagination.limit}
              onPageChange={setPage}
            />
          )}
        </Card>
      )}

      <OrderActionModal
        open={actionModal.value}
        action={destructiveAction?.action || 'reject'}
        order={destructiveAction?.order || null}
        isSubmitting={Boolean(destructiveAction && pendingOrderId === destructiveAction.order.id)}
        onClose={() => {
          actionModal.onFalse();
          setDestructiveAction(null);
        }}
        onConfirm={handleConfirmDestructive}
      />

      <OrderUpdateModal
        open={updateModal.value}
        order={updatingOrder}
        organizationId={organizationId}
        isSubmitting={Boolean(updatingOrder && updatingOrderId === updatingOrder.id)}
        onClose={() => {
          updateModal.onFalse();
          setUpdatingOrder(null);
        }}
        onConfirm={handleConfirmUpdate}
      />

      <ConfirmDialog
        open={markAsPaidConfirm.value}
        title="Mark order as paid?"
        content={`Confirm that payment for order #${markAsPaidOrder?.orderNumber ?? ''} has been received. This cannot be undone.`}
        isLoading={Boolean(markAsPaidOrder && pendingOrderId === markAsPaidOrder.id)}
        buttonClass="bg-green-600 hover:bg-green-600/80"
        onClose={() => {
          markAsPaidConfirm.onFalse();
          setMarkAsPaidOrder(null);
        }}
        onConfirm={handleConfirmMarkAsPaid}
      />

      <ConfirmDialog
        open={deliverAllConfirm.value}
        title="Mark all items delivered?"
        content={`Are you sure every item on order #${deliverAllOrder?.orderNumber ?? ''} has been delivered? This marks the whole order as delivered and cannot be undone.`}
        isLoading={Boolean(deliverAllOrder && deliveringOrderId === deliverAllOrder.id)}
        buttonClass="bg-green-600 hover:bg-green-600/80"
        onClose={() => {
          deliverAllConfirm.onFalse();
          setDeliverAllOrder(null);
        }}
        onConfirm={handleConfirmDeliverAll}
      />

      <ConfirmDialog
        open={orderingConfirm.value}
        title={pendingOrderingState ? 'Open in-app ordering?' : 'Close in-app ordering?'}
        content={
          pendingOrderingState
            ? `Customers will be able to place new orders${venueSuffix}.`
            : `Customers will not be able to place new orders${venueSuffix}. Orders already placed are not affected.`
        }
        isLoading={isTogglingOrdering}
        buttonClass={pendingOrderingState ? 'bg-green-600 hover:bg-green-600/80' : undefined}
        onClose={() => {
          orderingConfirm.onFalse();
          setPendingOrderingState(null);
        }}
        onConfirm={handleConfirmOrderingToggle}
      />
    </div>
  );
};
