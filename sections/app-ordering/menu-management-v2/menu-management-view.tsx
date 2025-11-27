'use client';

import ConfirmDialog from '@/components/comfirm-dialog/confirm-dialog';
import { Button } from '@/components/ui/button';
import { useBoolean } from '@/hooks/useBoolean';
import { Filter } from 'lucide-react';
import React, { useMemo, useState } from 'react';
import { FilterPanel } from './filter-panel';
import { MOCK_ACTIVE_ORDERS, MOCK_PAST_ORDERS, MOCK_PREORDERS } from './mock-data';
import { OrderCard } from './order-card';
import { OrderTabs } from './order-tabs';
import { SearchBar } from './search-bar';
import { FilterOptions, ModalAction, Order, OrderTab } from './types';

const ToggleSwitch: React.FC<{
  value: boolean;
  onChange: (value: boolean) => void;
  label: string;
}> = ({ value, onChange, label }) => (
  <div className="flex items-center justify-between rounded-lg bg-gray-100 p-3 dark:bg-[#222121]">
    <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">{label}</span>
    <button
      title="Toggle Switch"
      type="button"
      onClick={() => onChange(!value)}
      className={`relative h-6 w-12 cursor-pointer rounded-full transition-colors ${value ? 'bg-green-600' : 'bg-gray-300'}`}
    >
      <div className={`absolute top-1 left-1 h-4 w-4 rounded-full bg-white transition-transform ${value ? 'translate-x-6 transform' : ''}`} />
    </button>
  </div>
);

export const MenuManagementView: React.FC = () => {
  // State
  const [activeTab, setActiveTab] = useState<OrderTab>('active');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);
  const [orderingEnabled, setOrderingEnabled] = useState(true);

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
  const [modalAction, setModalAction] = useState<ModalAction | null>(null);
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

  // Filter and search orders
  const filteredOrders = useMemo(() => {
    return currentOrders.filter((order) => {
      // Search filter
      const searchLower = searchQuery.toLowerCase();
      const matchesSearch =
        !searchQuery ||
        order.userName.toLowerCase().includes(searchLower) ||
        order.location.toLowerCase().includes(searchLower) ||
        order.userEmail.toLowerCase().includes(searchLower) ||
        order.userHandle.toLowerCase().includes(searchLower);

      if (!matchesSearch) return false;

      // Status filter (only for active tab)
      if (activeTab === 'active') {
        const matchesStatus = filters.statuses.includes(order.status);
        if (!matchesStatus) return false;
      }

      // Delivery type filter
      const matchesDeliveryType = filters.deliveryTypes.includes(order.deliveryType);
      if (!matchesDeliveryType) return false;

      // Preorder filter
      if (filters.preorderOnly && !order.isPreorder) return false;

      // VIP filter
      if (filters.vipOnly && !order.isVIP) return false;

      return true;
    });
  }, [currentOrders, searchQuery, filters, activeTab]);

  // Order counts for tabs
  const orderCounts = useMemo(
    () => ({
      active: activeOrders.length,
      preorders: preorders.length,
      past: pastOrders.length,
    }),
    [activeOrders, preorders, pastOrders]
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

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

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
            setOrderingEnabled(modalAction.newState);
          }
          break;
      }

      confirmModal.onFalse();
      setModalAction(null);
    } finally {
      setIsActionLoading(false);
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
      <div className="dark:bg-secondary sticky top-0 z-30 rounded-t-2xl bg-white shadow-sm">
        <div className="px-5 py-4">
          <div className="mb-4 flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">🍽️ Menu Management</h1>
            <div className="flex items-center gap-3">
              <Button variant="outline" onClick={filterPanel.onTrue} className="h-11 gap-2 px-5! font-semibold">
                <Filter className="h-4 w-4" />
                Filter
              </Button>

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
            <ToggleSwitch value={orderingEnabled} onChange={handleOrderingToggle} label="In-App Ordering" />
          </div>

          {/* Search Bar */}
          <SearchBar value={searchQuery} onChange={setSearchQuery} />
        </div>

        {/* Tabs */}
        <OrderTabs activeTab={activeTab} onTabChange={setActiveTab} orderCounts={orderCounts} />
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
    </div>
  );
};
