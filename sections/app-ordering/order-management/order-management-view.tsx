'use client';

import ConfirmDialog from '@/components/comfirm-dialog/confirm-dialog';
import FormProvider from '@/components/rhf';
import RHFCustomDropdown from '@/components/rhf/rhf-custom-dropdown';
import { useBoolean } from '@/hooks/useBoolean';
import { useCompanySelectionState } from '@/hooks/useCompanySelectionState';
import {
  useGetAppOrderingQuery,
  useGetAppOrderingStatusQuery,
  useUpdateAppOrderingMutation,
  useUpdateAppOrderingStatusMutation,
} from '@/store/Reducer/app-ordering-api';
import { useGetOrganizationsOnOrganizerSideQuery } from '@/store/Reducer/organization';
import { getErrorMessage } from '@/utils/api';
import { showError, showSuccess } from '@/utils/toast';
import { yupResolver } from '@hookform/resolvers/yup';
import React, { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import * as Yup from 'yup';
import { API_ACTIVE_SUB_TAB_MAP, API_ORDER_STATUS_MAP, mapDeliveryFilterToPickupType } from './constants';
import { DeliveryItemsModal } from './delivery-items-modal';
import { FilterPanel } from './filter-panel';
import { OrderCard } from './order-card';
import { OrderSkeletonGrid } from './order-card-skeleton';
import { OrderTabs } from './order-tabs';
import { SearchBar } from './search-bar';
import { ToggleSwitch } from './toggle-switch';
import { ActiveOrderSubTab, DeliveryFilterType, FilterOptions, ModalAction, Order, OrderTab } from './types';
import { transformApiOrdersToFrontend } from './utils';

const AUTO_REFRESH_INTERVAL = 30000; // 30 seconds
const ORGANIZER_ORG_STORAGE_KEY = 'order-management-organizer-organization';

type OrderManagementViewProps = {
  userType: 'super-admin' | 'organizer';
};

interface OrganizationFormValues {
  organizationId: string;
}

interface StoredOrganizerOrganization {
  value: string;
  label: string;
}

// ============================================================
// STORAGE HELPERS
// ============================================================

const OrganizerOrganizationStorage = {
  get: (): StoredOrganizerOrganization | null => {
    if (typeof window === 'undefined') return null;
    try {
      const stored = localStorage.getItem(ORGANIZER_ORG_STORAGE_KEY);
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  },

  set: (organization: StoredOrganizerOrganization | null): void => {
    if (typeof window === 'undefined') return;
    try {
      if (organization) {
        localStorage.setItem(ORGANIZER_ORG_STORAGE_KEY, JSON.stringify(organization));
      } else {
        localStorage.removeItem(ORGANIZER_ORG_STORAGE_KEY);
      }
    } catch {
      // Silently fail if localStorage is not available
    }
  },

  getId: (): string => {
    const stored = OrganizerOrganizationStorage.get();
    return stored?.value || '';
  },
};

// ============================================================
// VALIDATION SCHEMA
// ============================================================

const organizationSchema = Yup.object().shape({
  organizationId: Yup.string().required('Organization is required'),
});

// ============================================================
// COMPONENT
// ============================================================

export const OrderManagementView: React.FC<OrderManagementViewProps> = ({ userType }) => {
  // State
  const [activeTab, setActiveTab] = useState<OrderTab>('active');
  const [activeOrderSubTab, setActiveOrderSubTab] = useState<ActiveOrderSubTab>('new-order');
  const [deliveryFilter, setDeliveryFilter] = useState<DeliveryFilterType>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('');
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);

  // Ref for content container to scroll to top
  const contentRef = React.useRef<HTMLDivElement>(null);

  // Check if user is organizer
  const isOrganizer = userType === 'organizer';

  // Form for organization selection (organizer only)
  const organizationMethods = useForm<OrganizationFormValues>({
    resolver: yupResolver(organizationSchema),
    defaultValues: {
      organizationId: OrganizerOrganizationStorage.getId(),
    },
    mode: 'onChange',
  });

  const { watch: watchOrganization, setValue: setOrganizationValue } = organizationMethods;
  const selectedOrganizerOrganizationId = watchOrganization('organizationId');

  // Fetch organizer organizations (only for organizer users)
  const {
    data: organizerOrganizationsResponse,
    isLoading: isLoadingOrganizerOrganizations,
    isFetching: isFetchingOrganizerOrganizations,
  } = useGetOrganizationsOnOrganizerSideQuery(
    {},
    {
      skip: !isOrganizer,
    }
  );

  // Transform organizer organizations to dropdown options
  const organizerOrganizationOptions = useMemo(
    () =>
      organizerOrganizationsResponse?.data?.map((organization: any) => ({
        label: organization?.title || organization?.basicInfo?.name || 'Unknown Organization',
        value: organization?._id,
      })) || [],
    [organizerOrganizationsResponse]
  );

  // Auto-select organization when data loads (for organizer)
  // Priority: 1. Already selected, 2. Stored in localStorage, 3. First option
  useEffect(() => {
    if (!isOrganizer || organizerOrganizationOptions.length === 0) return;

    const currentSelection = selectedOrganizerOrganizationId;
    const storedOrgId = OrganizerOrganizationStorage.getId();

    // If already selected and valid, do nothing
    if (currentSelection && organizerOrganizationOptions.some((opt: { value: string }) => opt.value === currentSelection)) {
      return;
    }

    // Try to use stored value if valid
    if (storedOrgId && organizerOrganizationOptions.some((opt: { value: string }) => opt.value === storedOrgId)) {
      setOrganizationValue('organizationId', storedOrgId);
      return;
    }

    // Fallback to first option
    setOrganizationValue('organizationId', organizerOrganizationOptions[0].value);
  }, [isOrganizer, organizerOrganizationOptions, selectedOrganizerOrganizationId, setOrganizationValue]);

  // Save organization selection to localStorage when it changes
  useEffect(() => {
    if (!isOrganizer) return;

    if (!selectedOrganizerOrganizationId) {
      OrganizerOrganizationStorage.set(null);
      return;
    }

    const selectedOption = organizerOrganizationOptions.find(
      (opt: { value: string; label: string }) => opt.value === selectedOrganizerOrganizationId
    );

    if (selectedOption) {
      OrganizerOrganizationStorage.set({
        value: selectedOption.value,
        label: selectedOption.label,
      });
    }
  }, [isOrganizer, selectedOrganizerOrganizationId, organizerOrganizationOptions]);

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Pagination state
  const [page, setPage] = useState(1);
  const [limit] = useState(10);

  const { companyId, organizationId: adminOrganizationId } = useCompanySelectionState();

  // Determine which organizationId to use based on user type
  const organizationId = isOrganizer ? selectedOrganizerOrganizationId : adminOrganizationId;

  // Ordering status query
  const {
    data: orderingStatusData,
    isLoading: statusLoading,
    isFetching: statusFetching,
    error: statusError,
    refetch: refetchOrderingStatus,
  } = useGetAppOrderingStatusQuery({ organizationId: organizationId || '' }, { skip: !organizationId });

  const [updateAppOrderingStatus, { isLoading: updateStatusLoading }] = useUpdateAppOrderingStatusMutation();

  const [orderingEnabled, setOrderingEnabled] = useState<boolean>(false);

  useEffect(() => {
    if (orderingStatusData?.data?.isOrderingEnabled !== undefined) {
      setOrderingEnabled(orderingStatusData.data.isOrderingEnabled);
    }
  }, [orderingStatusData]);

  useEffect(() => {
    if (statusError) {
      const errorMessage = getErrorMessage(statusError);
      showError(errorMessage);
    }
  }, [statusError]);

  // Build query parameters for orders
  const ordersQueryParams = useMemo(() => {
    const params: any = {
      page: page - 1,
      limit,
      search: debouncedSearchQuery,
      status: API_ORDER_STATUS_MAP[activeTab],
    };

    // Add company organizer (only for admin)
    if (!isOrganizer && companyId) {
      params.companyOrganizer = companyId;
    }

    if (organizationId) {
      params.organization = organizationId;
    }

    // Add active order sub-tab filter
    if (activeTab === 'active') {
      params.activeorderStatus = API_ACTIVE_SUB_TAB_MAP[activeOrderSubTab];

      // Add delivery filter only for new-order sub-tab
      if (activeOrderSubTab === 'new-order') {
        const pickupType = mapDeliveryFilterToPickupType(deliveryFilter);
        if (pickupType) {
          params.pickupFilter = pickupType;
        }
      }
    }

    return params;
  }, [activeTab, activeOrderSubTab, deliveryFilter, debouncedSearchQuery, page, limit, companyId, organizationId, isOrganizer]);

  // Determine if we should fetch orders
  const shouldFetchOrders = isOrganizer ? !!organizationId : !!companyId;

  // Orders query with auto-refresh
  const {
    data: ordersData,
    isLoading: ordersLoading,
    isFetching: ordersFetching,
    error: ordersError,
    refetch: refetchOrders,
  } = useGetAppOrderingQuery(ordersQueryParams, {
    skip: !shouldFetchOrders,
    pollingInterval: AUTO_REFRESH_INTERVAL, // Auto-refresh every 30 seconds
  });

  const [updateAppOrdering, { isLoading: updateOrderLoading }] = useUpdateAppOrderingMutation();

  useEffect(() => {
    if (ordersError) {
      const errorMessage = getErrorMessage(ordersError);
      showError(errorMessage);
    }
  }, [ordersError]);

  // Transform API orders to frontend format
  const orders = useMemo(() => {
    if (!ordersData?.data) return [];
    return transformApiOrdersToFrontend(ordersData.data);
  }, [ordersData]);

  // Order counts from API
  const orderCounts = useMemo(
    () => ({
      active: ordersData?.meta?.constantData?.activeOrdersCount || 0,
      preorders: ordersData?.meta?.constantData?.preordersCount || 0,
      past: ordersData?.meta?.constantData?.pastOrdersCount || 0,
    }),
    [ordersData]
  );

  // Sub-tab counts for Active Orders from API
  const subTabCounts = useMemo(
    () => ({
      'new-order': ordersData?.meta?.constantData?.activeDetails?.new || 0,
      'in-progress': ordersData?.meta?.constantData?.activeDetails?.inProgress || 0,
      completed: ordersData?.meta?.constantData?.activeDetails?.completed || 0,
    }),
    [ordersData]
  );

  // Pagination metadata
  const meta = useMemo(() => ordersData?.meta || { currentPage: page, totalPages: 1, totalRecords: 0, limit }, [ordersData, page, limit]);

  // Filters state
  const [filters, setFilters] = useState<FilterOptions>({
    statuses: ['pending', 'confirmed', 'completed', 'cancelled', 'preorder'],
    deliveryTypes: ['table', 'togo', 'preorder', 'counter'],
    preorderOnly: false,
  });

  // Modal states
  const filterPanel = useBoolean();
  const confirmModal = useBoolean();
  const deliveryModal = useBoolean();
  const [modalAction, setModalAction] = useState<ModalAction | null>(null);
  const [selectedOrderForDelivery, setSelectedOrderForDelivery] = useState<Order | null>(null);
  const [isActionLoading, setIsActionLoading] = useState(false);

  // Filter orders (client-side filtering for search and filters)
  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      // Search filter (client-side for immediate feedback)
      if (searchQuery) {
        const searchLower = searchQuery.toLowerCase();
        const matchesSearch =
          order.userName.toLowerCase().includes(searchLower) ||
          order.location.toLowerCase().includes(searchLower) ||
          order.userEmail.toLowerCase().includes(searchLower) ||
          (order.orderNumber && order.orderNumber.toLowerCase().includes(searchLower));

        if (!matchesSearch) return false;
      }

      // Status filter from filter panel
      const matchesStatus = filters.statuses.includes(order.status);
      if (!matchesStatus) return false;

      // Delivery type filter from filter panel
      const matchesDeliveryType = filters.deliveryTypes.includes(order.deliveryType);
      if (!matchesDeliveryType) return false;

      // Preorder filter
      if (filters.preorderOnly && order.orderType !== 'preorder') return false;

      return true;
    });
  }, [orders, searchQuery, filters]);

  // Modal handlers
  const openConfirmModal = (action: ModalAction) => {
    setModalAction(action);
    confirmModal.onTrue();
  };

  const handleConfirmAction = async () => {
    if (!modalAction) return;

    setIsActionLoading(true);

    try {
      switch (modalAction.type) {
        case 'accept':
          if (modalAction.order) {
            await handleAcceptOrder(modalAction.order);
          }
          break;
        case 'deliver':
          if (modalAction.order) {
            await handleDeliverOrder(modalAction.order);
          }
          break;
        case 'deliver-all':
          if (modalAction.order) {
            await handleDeliverAllItems(modalAction.order);
          }
          break;
        case 'deliver-selected':
          if (modalAction.order && modalAction.selectedItemIds) {
            await handleDeliverSelectedItems(modalAction.order, modalAction.selectedItemIds);
          }
          break;
        case 'paid':
          if (modalAction.order) {
            await handleMarkAsPaid(modalAction.order);
          }
          break;
        case 'cancel':
          if (modalAction.order) {
            await handleCancelOrder(modalAction.order);
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

      // Close any expanded card
      setExpandedOrderId(null);

      // Refetch orders after action
      await refetchOrders();

      // Scroll to top of page smoothly
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      showError(errorMessage);
    } finally {
      setIsActionLoading(false);
    }
  };

  // Handle ordering status toggle
  const handleToggleOrderingStatus = async (newState: boolean) => {
    if (!organizationId) return;

    try {
      const response = await updateAppOrderingStatus({
        id: organizationId,
        isOrderingEnabled: String(newState),
      }).unwrap();

      if (response?.error) {
        showError(getErrorMessage(response.error));
        return;
      }

      setOrderingEnabled(newState);
      await refetchOrderingStatus();

      showSuccess(response?.message || `In-App Ordering ${newState ? 'enabled' : 'disabled'} successfully`);
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      showError(errorMessage);
      throw error;
    }
  };

  // Order action handlers
  const handleAcceptOrder = async (order: Order) => {
    try {
      const response = await updateAppOrdering({
        id: order.id,
        status: 'confirmed',
      }).unwrap();

      if (response?.error) {
        showError(getErrorMessage(response.error));
        return;
      }

      showSuccess(response?.message || 'Order accepted successfully');
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      showError(errorMessage);
      throw error;
    }
  };

  const handleDeliverOrder = async (order: Order) => {
    try {
      const response = await updateAppOrdering({
        id: order.id,
        status: 'completed',
      }).unwrap();

      if (response?.error) {
        showError(getErrorMessage(response.error));
        return;
      }

      showSuccess(response?.message || 'Order marked as delivered');
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      showError(errorMessage);
      throw error;
    }
  };

  // Handle marking all items as delivered
  const handleDeliverAllItems = async (order: Order) => {
    try {
      const response = await updateAppOrdering({
        id: order.id,
        deliveredall: true,
      }).unwrap();

      if (response?.error) {
        showError(getErrorMessage(response.error));
        return;
      }

      showSuccess(response?.message || 'All items marked as delivered');
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      showError(errorMessage);
      throw error;
    }
  };

  // Handle marking selected items as delivered
  const handleDeliverSelectedItems = async (order: Order, selectedItemIds: string[]) => {
    try {
      const menuItemIds = order.items
        .filter((item) => selectedItemIds.includes(item.id))
        .map((item) => item.menuItemId)
        .join(',');

      const response = await updateAppOrdering({
        id: order.id,
        deliveredMenuItem: menuItemIds,
      }).unwrap();

      if (response?.error) {
        showError(getErrorMessage(response.error));
        return;
      }

      showSuccess(response?.message || 'Selected items marked as delivered');
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      showError(errorMessage);
      throw error;
    }
  };

  // Open delivery items modal
  const handleOpenDeliveryModal = (order: Order) => {
    setSelectedOrderForDelivery(order);
    deliveryModal.onTrue();
  };

  // Handle confirm delivery of selected items from modal
  const handleConfirmDeliveryItems = async (selectedItemIds: string[]) => {
    if (!selectedOrderForDelivery) return;

    openConfirmModal({
      type: 'deliver-selected',
      order: selectedOrderForDelivery,
      selectedItemIds,
    });

    deliveryModal.onFalse();
    setSelectedOrderForDelivery(null);
  };

  const handleMarkAsPaid = async (order: Order) => {
    try {
      const response = await updateAppOrdering({
        id: order.id,
        paymentStatus: 'paid',
      }).unwrap();

      if (response?.error) {
        showError(getErrorMessage(response.error));
        return;
      }

      showSuccess(response?.message || 'Order marked as paid');
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      showError(errorMessage);
      throw error;
    }
  };

  const handleCancelOrder = async (order: Order) => {
    try {
      const response = await updateAppOrdering({
        id: order.id,
        status: 'cancelled',
      }).unwrap();

      if (response?.error) {
        showError(getErrorMessage(response.error));
        return;
      }

      showSuccess(response?.message || 'Order cancelled successfully');
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      showError(errorMessage);
      throw error;
    }
  };

  // Filter handlers
  const handleApplyFilters = () => {
    filterPanel.onFalse();
  };

  const handleClearFilters = () => {
    setFilters({
      statuses: ['pending', 'confirmed', 'completed', 'cancelled', 'preorder'],
      deliveryTypes: ['table', 'togo', 'preorder', 'counter'],
      preorderOnly: false,
    });
  };

  // Ordering toggle handler
  const handleOrderingToggle = (value: boolean) => {
    if (!organizationId) {
      showError('Please select an organization first');
      return;
    }

    openConfirmModal({
      type: 'toggle-ordering',
      newState: value,
    });
  };

  // Reset to page 1 and close expanded card when changing tabs or filters
  useEffect(() => {
    setPage(1);
    setExpandedOrderId(null);
  }, [activeTab, activeOrderSubTab, deliveryFilter, debouncedSearchQuery]);

  // Reset page when organization changes
  useEffect(() => {
    setPage(1);
    setExpandedOrderId(null);
  }, [organizationId]);

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
      case 'deliver-selected':
        return {
          title: 'Mark Selected Items as Delivered?',
          content: `Mark ${modalAction.selectedItemIds?.length || 0} selected item(s) as delivered?`,
          confirmVariant: 'success' as const,
          confirmText: 'Mark as Delivered',
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

  const isLoading = ordersLoading || ordersFetching;
  const isOrganizerOrgLoading = isLoadingOrganizerOrganizations || isFetchingOrganizerOrganizations;

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="dark:bg-secondary sticky top-0 z-30 rounded-2xl bg-white shadow-sm">
        <div className="px-5 py-4">
          {/* Title and Organization Dropdown */}
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Orders</h1>

              {/* Organization Dropdown for Organizer */}
              {isOrganizer && (
                <FormProvider methods={organizationMethods} onSubmit={() => {}}>
                  <div className="w-60">
                    <RHFCustomDropdown
                      name="organizationId"
                      placeholder="Select Organization"
                      options={organizerOrganizationOptions}
                      isLoading={isOrganizerOrgLoading}
                      showNone={false}
                    />
                  </div>
                </FormProvider>
              )}
            </div>
          </div>

          {/* Ordering Toggle */}
          <div className="mb-3">
            <ToggleSwitch
              value={orderingEnabled}
              onChange={handleOrderingToggle}
              label="In-App Ordering"
              isLoading={statusLoading || statusFetching || updateStatusLoading}
              isDisabled={!organizationId || statusLoading || statusFetching}
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
      <div ref={contentRef} className="mx-auto min-h-screen max-w-full py-5">
        {/* Show message if no organization selected (organizer only) */}
        {isOrganizer && !organizationId ? (
          <div className="py-16 text-center">
            <div className="mb-4 text-6xl opacity-30">🏢</div>
            <h3 className="mb-2 text-xl font-bold text-gray-900 dark:text-gray-100">Select an Organization</h3>
            <p className="text-sm text-gray-500 dark:text-gray-500">Please select an organization from the dropdown above to view orders</p>
          </div>
        ) : isLoading && filteredOrders.length === 0 ? (
          <OrderSkeletonGrid count={6} />
        ) : filteredOrders.length === 0 ? (
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

        {/* Pagination Controls */}
        {!isLoading && filteredOrders.length > 0 && (
          <div className="mt-6 flex items-center justify-center gap-4">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="rounded-lg bg-gray-200 px-4 py-2 font-semibold text-gray-700 transition-colors hover:bg-gray-300 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
            >
              Previous
            </button>
            <span className="text-sm text-gray-600 dark:text-gray-400">
              Page {meta.currentPage} of {meta.totalPages} ({meta.totalRecords} total)
            </span>
            <button
              onClick={() => setPage((p) => Math.min(meta.totalPages, p + 1))}
              disabled={page === meta.totalPages}
              className="rounded-lg bg-gray-200 px-4 py-2 font-semibold text-gray-700 transition-colors hover:bg-gray-300 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
            >
              Next
            </button>
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
        isLoading={isActionLoading || updateOrderLoading}
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