'use client';

import ConfirmDialog from '@/components/comfirm-dialog/confirm-dialog';
import { useBoolean } from '@/hooks/useBoolean';
import { useCompanySelectionState } from '@/hooks/useCompanySelectionState';
import { useGetAppOrderingStatusQuery, useUpdateAppOrderingStatusMutation } from '@/store/Reducer/app-ordering-api';
import { getErrorMessage } from '@/utils/api';
import { showError, showSuccess } from '@/utils/toast';
import React, { useMemo, useState } from 'react';
import { DeliveryItemsModal } from './delivery-items-modal';
import { FilterPanel } from './filter-panel';
import { MOCK_ACTIVE_ORDERS, MOCK_PAST_ORDERS, MOCK_PREORDERS } from './mock-data';
import { OrderCard } from './order-card';
import { OrderTabs } from './order-tabs';
import { SearchBar } from './search-bar';
import { ToggleSwitch } from './toggle-switch';
import { ActiveOrderSubTab, DeliveryFilterType, FilterOptions, ModalAction, Order, OrderTab } from './types';

export const OrderManagementView: React.FC = () => {
  // State
  const [activeTab, setActiveTab] = useState<OrderTab>('active');
  const [activeOrderSubTab, setActiveOrderSubTab] = useState<ActiveOrderSubTab>('new-order');
  const [deliveryFilter, setDeliveryFilter] = useState<DeliveryFilterType>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);

  const { companyId } = useCompanySelectionState();

  const {
    data: orderingStatusData,
    isLoading: statusLoading,
    isFetching: statusFetching,
    error: statusError,
    refetch: refetchOrderingStatus,
  } = useGetAppOrderingStatusQuery({ companyOrganizer: companyId || '' }, { skip: !companyId });

  const [updateAppOrderingStatus, { isLoading: updateStatusLoading }] = useUpdateAppOrderingStatusMutation();

  const [orderingEnabled, setOrderingEnabled] = useState<boolean>(false);

  React.useEffect(() => {
    if (orderingStatusData?.data?.isOrderingEnabled !== undefined) {
      setOrderingEnabled(orderingStatusData.data.isOrderingEnabled);
    }
  }, [orderingStatusData]);

  React.useEffect(() => {
    if (statusError) {
      const errorMessage = getErrorMessage(statusError);
      showError(errorMessage);
    }
  }, [statusError]);

  // Orders state (in production, this would come from API/state management)
  const [activeOrders, setActiveOrders] = useState<Order[]>(MOCK_ACTIVE_ORDERS);
  const [preorders, setPreorders] = useState<Order[]>(MOCK_PREORDERS);
  const [pastOrders, setPastOrders] = useState<Order[]>(MOCK_PAST_ORDERS);

  // Filters state
  const [filters, setFilters] = useState<FilterOptions>({
    statuses: ['sent', 'preparing', 'delivered', 'waiting-payment'],
    deliveryTypes: ['table', 'pickup', 'togo'],
    preorderOnly: false,
    vipOnly: false,
  });

  // Modal states
  const filterPanel = useBoolean();
  const confirmModal = useBoolean();
  const deliveryModal = useBoolean();
  const [modalAction, setModalAction] = useState<ModalAction | null>(null);
  const [selectedOrderForDelivery, setSelectedOrderForDelivery] = useState<Order | null>(null);
  const [isActionLoading, setIsActionLoading] = useState(false);

  // Get current orders based on active tab
  const currentOrders = useMemo(() => {
    switch (activeTab) {
      case 'active':
        return activeOrders;
      case 'preorders':
        return preorders;
      case 'past':
        return pastOrders;
      default:
        return [];
    }
  }, [activeTab, activeOrders, preorders, pastOrders]);

  // Filter orders by active order sub-tab
  const filteredBySubTab = useMemo(() => {
    if (activeTab !== 'active') return currentOrders;

    return currentOrders.filter((order) => {
      switch (activeOrderSubTab) {
        case 'new-order':
          return order.status === 'sent' || order.status === 'pending';
        case 'in-progress':
          return order.status === 'preparing';
        case 'completed':
          return order.status === 'delivered' || order.status === 'waiting-payment';
        default:
          return true;
      }
    });
  }, [activeTab, activeOrderSubTab, currentOrders]);

  // Filter by delivery type (only for new-order sub-tab)
  const filteredByDelivery = useMemo(() => {
    if (activeTab !== 'active' || activeOrderSubTab !== 'new-order') return filteredBySubTab;

    return filteredBySubTab.filter((order) => {
      switch (deliveryFilter) {
        case 'all':
          return true;
        case 'table':
          return order.deliveryType === 'table';
        case 'togo':
          return order.deliveryType === 'togo' || order.deliveryType === 'pickup';
        case 'preorders':
          return order.isPreorder;
        default:
          return true;
      }
    });
  }, [activeTab, activeOrderSubTab, deliveryFilter, filteredBySubTab]);

  // Filter and search orders
  const filteredOrders = useMemo(() => {
    return filteredByDelivery.filter((order) => {
      // Search filter
      const searchLower = searchQuery.toLowerCase();
      const matchesSearch =
        !searchQuery ||
        order.userName.toLowerCase().includes(searchLower) ||
        order.location.toLowerCase().includes(searchLower) ||
        order.userEmail.toLowerCase().includes(searchLower) ||
        order.userHandle.toLowerCase().includes(searchLower);

      if (!matchesSearch) return false;

      // Delivery type filter (from filter panel)
      const matchesDeliveryType = filters.deliveryTypes.includes(order.deliveryType);
      if (!matchesDeliveryType) return false;

      // Preorder filter
      if (filters.preorderOnly && !order.isPreorder) return false;

      // VIP filter
      if (filters.vipOnly && !order.isVIP) return false;

      return true;
    });
  }, [filteredByDelivery, searchQuery, filters]);

  // Order counts for tabs
  const orderCounts = useMemo(
    () => ({
      active: activeOrders.length,
      preorders: preorders.length,
      past: pastOrders.length,
    }),
    [activeOrders, preorders, pastOrders]
  );

  // Sub-tab counts for Active Orders
  const subTabCounts = useMemo(
    () => ({
      'new-order': activeOrders.filter((o) => o.status === 'sent' || o.status === 'pending').length,
      'in-progress': activeOrders.filter((o) => o.status === 'preparing').length,
      completed: activeOrders.filter((o) => o.status === 'delivered' || o.status === 'waiting-payment').length,
    }),
    [activeOrders]
  );

  // Modal handlers
  const openConfirmModal = (action: ModalAction) => {
    setModalAction(action);
    confirmModal.onTrue();
    setPreorders((prev) => [...prev]);
  };

  const handleConfirmAction = async () => {
    if (!modalAction) return;

    setIsActionLoading(true);

    try {
      switch (modalAction.type) {
        case 'accept':
          if (modalAction.order) {
            handleAcceptOrder(modalAction.order);
          }
          break;
        case 'deliver':
          if (modalAction.order) {
            handleDeliverOrder(modalAction.order);
          }
          break;
        case 'deliver-all':
          if (modalAction.order) {
            handleDeliverAllItems(modalAction.order);
          }
          break;
        case 'deliver-selected':
          if (modalAction.order && modalAction.selectedItemIds) {
            handleDeliverSelectedItems(modalAction.order, modalAction.selectedItemIds);
          }
          break;
        case 'paid':
          if (modalAction.order) {
            handleMarkAsPaid(modalAction.order);
          }
          break;
        case 'cancel':
          if (modalAction.order) {
            handleCancelOrder(modalAction.order);
          }
          break;
        case 'toggle-ordering':
          if (modalAction.newState !== undefined) {
            await handleToggleOrderingStatus(modalAction.newState);
          }
          break;
      }

      confirmModal.onFalse();
      setModalAction(null);
    } finally {
      setIsActionLoading(false);
    }
  };

  // Handle ordering status toggle
  const handleToggleOrderingStatus = async (newState: boolean) => {
    if (!companyId) return;

    try {
      // Call API to update ordering status
      const response = await updateAppOrderingStatus({
        id: companyId,
        isOrderingEnabled: String(newState),
      }).unwrap();

      if (response?.error) {
        showError(getErrorMessage(response.error));
        return;
      }

      // Update local state
      setOrderingEnabled(newState);

      // Refetch to confirm
      await refetchOrderingStatus();

      showSuccess(response?.message || `In-App Ordering ${newState ? 'enabled' : 'disabled'} successfully`);
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      showError(errorMessage);
    }
  };

  // Order action handlers
  const handleAcceptOrder = (order: Order) => {
    setActiveOrders((prev) => prev.map((o) => (o.id === order.id ? { ...o, status: 'preparing' } : o)));
  };

  const handleDeliverOrder = (order: Order) => {
    setActiveOrders((prev) =>
      prev.map((o) => (o.id === order.id ? { ...o, status: order.paymentType === 'pay-later' ? 'waiting-payment' : 'delivered' } : o))
    );
  };

  // Handle marking all items as delivered
  const handleDeliverAllItems = (order: Order) => {
    setActiveOrders((prev) =>
      prev.map((o) =>
        o.id === order.id
          ? {
              ...o,
              items: o.items.map((item) => ({ ...item, isDelivered: true })),
            }
          : o
      )
    );
  };

  // Handle marking selected items as delivered
  const handleDeliverSelectedItems = (order: Order, selectedItemIds: string[]) => {
    setActiveOrders((prev) =>
      prev.map((o) =>
        o.id === order.id
          ? {
              ...o,
              items: o.items.map((item) => (selectedItemIds.includes(item.id) ? { ...item, isDelivered: true } : item)),
            }
          : o
      )
    );
  };

  // Open delivery items modal
  const handleOpenDeliveryModal = (order: Order) => {
    setSelectedOrderForDelivery(order);
    deliveryModal.onTrue();
  };

  // Handle confirm delivery of selected items from modal
  const handleConfirmDeliveryItems = async (selectedItemIds: string[]) => {
    if (!selectedOrderForDelivery) return;

    setIsActionLoading(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    try {
      handleDeliverSelectedItems(selectedOrderForDelivery, selectedItemIds);
      deliveryModal.onFalse();
      setSelectedOrderForDelivery(null);
    } finally {
      setIsActionLoading(false);
    }
  };

  const handleMarkAsPaid = (order: Order) => {
    const updatedOrder = {
      ...order,
      status: 'paid' as const,
      completedAt: new Date().toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
      }),
    };

    setActiveOrders((prev) => prev.filter((o) => o.id !== order.id));
    setPastOrders((prev) => [updatedOrder, ...prev]);
  };

  const handleCancelOrder = (order: Order) => {
    const updatedOrder = {
      ...order,
      status: 'canceled' as const,
      completedAt: new Date().toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
      }),
    };

    setActiveOrders((prev) => prev.filter((o) => o.id !== order.id));
    setPastOrders((prev) => [updatedOrder, ...prev]);
  };

  // Filter handlers
  const handleApplyFilters = () => {
    filterPanel.onFalse();
  };

  const handleClearFilters = () => {
    setFilters({
      statuses: ['sent', 'preparing', 'delivered', 'waiting-payment'],
      deliveryTypes: ['table', 'pickup', 'togo'],
      preorderOnly: false,
      vipOnly: false,
    });
  };

  // Menu editor handler
  // const handleOpenMenuEditor = () => {
  //   console.log('Open menu editor');
  // };

  // Ordering toggle handler
  const handleOrderingToggle = (value: boolean) => {
    // Check if companyId is available
    if (!companyId) {
      showError('Please select a company first before toggling ordering status');
      return;
    }

    openConfirmModal({
      type: 'toggle-ordering',
      newState: value,
    });
  };

  // Modal content based on action type
  const getModalContent = () => {
    if (!modalAction) {
      return {
        title: '',
        content: '',
        confirmVariant: 'default' as const,
        confirmText: 'Confirm',
      };
    }

    switch (modalAction.type) {
      case 'accept':
        return {
          title: 'Accept Order?',
          content: `Accept order from ${modalAction.order?.userName} and start preparing?`,
          confirmVariant: 'default' as const,
          confirmText: 'Accept',
        };
      case 'deliver':
        return {
          title: 'Mark as Delivered?',
          content: `Confirm delivery to ${modalAction.order?.userName} at ${modalAction.order?.location}?`,
          confirmVariant: 'success' as const,
          confirmText: 'Delivered',
        };
      case 'deliver-all':
        return {
          title: 'Mark All Items as Delivered?',
          content: `Mark all items in the order from ${modalAction.order?.userName} as delivered?`,
          confirmVariant: 'success' as const,
          confirmText: 'Mark All Delivered',
        };
      case 'paid':
        return {
          title: 'Confirm Payment?',
          content: `Mark order from ${modalAction.order?.userName} as paid?`,
          confirmVariant: 'success' as const,
          confirmText: 'Confirm',
        };
      case 'cancel':
        return {
          title: 'Cancel Order?',
          content: `Are you sure you want to cancel the order from ${modalAction.order?.userName}? This action cannot be undone.`,
          confirmVariant: 'destructive' as const,
          confirmText: 'Cancel Order',
        };
      case 'toggle-ordering':
        return {
          title: modalAction.newState ? 'Open In-App Ordering?' : 'Close In-App Ordering?',
          content: modalAction.newState
            ? 'Customers will be able to place new orders through the app.'
            : 'Customers will not be able to place new orders. Existing orders will not be affected.',
          confirmVariant: modalAction.newState ? 'success' : 'destructive',
          confirmText: modalAction.newState ? 'Open' : 'Close',
        };

      default:
        return {
          title: '',
          content: '',
          confirmVariant: 'default' as const,
          confirmText: 'Confirm',
        };
    }
  };

  const modalContent = getModalContent();

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="dark:bg-secondary sticky top-0 z-30 rounded-2xl bg-white shadow-sm">
        <div className="px-5 py-4">
          <div className="mb-4 flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Orders</h1>
            <div className="flex items-center gap-3">
              {/* <Button variant="outline" onClick={filterPanel.onTrue} className="h-11 gap-2 px-5! font-semibold">
                <Filter className="h-4 w-4" />
                Filter
              </Button> */}

              {/* <Button
                onClick={handleOpenMenuEditor}
                className="bg-primary dark:bg-primary dark:hover:bg-primary/80 h-11 gap-2 px-6 font-semibold hover:bg-blue-700"
              >
                📝 Menu
              </Button> */}
            </div>
          </div>

          {/* Ordering Toggle */}
          <div className="mb-3">
            <ToggleSwitch
              value={orderingEnabled}
              onChange={handleOrderingToggle}
              label="In-App Ordering"
              isLoading={statusLoading || statusFetching || updateStatusLoading}
              isDisabled={!companyId || statusLoading || statusFetching}
            />
          </div>

          {/* Search Bar */}
          <SearchBar value={searchQuery} onChange={setSearchQuery} />
        </div>

        {/* Tabs */}
        <OrderTabs
          activeTab={activeTab}
          onTabChange={setActiveTab}
          orderCounts={orderCounts}
          activeOrderSubTab={activeOrderSubTab}
          onSubTabChange={setActiveOrderSubTab}
          subTabCounts={subTabCounts}
          deliveryFilter={deliveryFilter}
          onDeliveryFilterChange={setDeliveryFilter}
        />
      </div>

      {/* Content */}
      <div className="mx-auto min-h-screen max-w-full py-5">
        {filteredOrders.length === 0 ? (
          <div className="py-16 text-center">
            <div className="mb-4 text-6xl opacity-30">📦</div>
            <h3 className="mb-2 text-xl font-bold text-gray-900 dark:text-gray-100">No Orders Found</h3>
            <p className="text-sm text-gray-500 dark:text-gray-500">
              {searchQuery ? 'Try adjusting your search or filters' : 'Orders will appear here when customers place them'}
            </p>
          </div>
        ) : (
          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
            {filteredOrders.map((order) => (
              <OrderCard
                key={order.id}
                order={order}
                isExpanded={expandedOrderId === order.id}
                onToggle={() => setExpandedOrderId(expandedOrderId === order.id ? null : order.id)}
                onAccept={(order) => openConfirmModal({ type: 'accept', order })}
                onDeliver={(order) => openConfirmModal({ type: 'deliver', order })}
                onDeliverAll={(order) => openConfirmModal({ type: 'deliver-all', order })}
                onDeliverSelected={(order) => handleOpenDeliveryModal(order)}
                onMarkPaid={(order) => openConfirmModal({ type: 'paid', order })}
                onCancel={(order) => openConfirmModal({ type: 'cancel', order })}
              />
            ))}
          </div>
        )}
      </div>

      {/* Filter Panel */}
      <FilterPanel
        isOpen={filterPanel.value}
        onClose={filterPanel.onFalse}
        filters={filters}
        onFiltersChange={setFilters}
        onApply={handleApplyFilters}
        onClear={handleClearFilters}
      />

      {/* Confirm Dialog */}
      <ConfirmDialog
        open={confirmModal.value}
        title={modalContent.title}
        content={modalContent.content}
        onClose={() => {
          confirmModal.onFalse();
          setModalAction(null);
        }}
        onConfirm={handleConfirmAction}
        isLoading={isActionLoading}
        // buttonClass="bg-blue-400 hover:bg-blue-400/80"
      />

      {/* Delivery Items Modal */}
      <DeliveryItemsModal
        open={deliveryModal.value}
        isLoading={isActionLoading}
        items={selectedOrderForDelivery?.items || []}
        onClose={() => {
          deliveryModal.onFalse();
          setSelectedOrderForDelivery(null);
        }}
        onConfirm={handleConfirmDeliveryItems}
      />
    </div>
  );
};
