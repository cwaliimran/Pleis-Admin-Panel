'use client';

import FormProvider from '@/components/rhf';
import RHFCustomDropdown from '@/components/rhf/rhf-custom-dropdown';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useCompanySelectionState } from '@/hooks/useCompanySelectionState';
import MenuItemModal from '@/sections/menu-management-modules/menuItems/menuItems-modal';
import { useUpdateMenuItemMutation } from '@/store/Reducer/menu-items-api';
import {
  useGetCategoriesForMenuQuery,
  useGetMenuItemByOrganizerQuery,
  useGetMenuManagementQuery,
  useGetSaleItemsQuery,
} from '@/store/Reducer/menu-management-api';
import { useGetOrganizationsOnOrganizerSideQuery } from '@/store/Reducer/organization';
import { getErrorMessage } from '@/utils/api';
import { showError, showSuccess } from '@/utils/toast';
import { yupResolver } from '@hookform/resolvers/yup';
import { ChevronLeft, ChevronRight, Package, Tag } from 'lucide-react';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import * as Yup from 'yup';
import { SORT_OPTIONS } from './constants';
import { MenuItemCard } from './menu-item-card';
import { MenuItemSkeletonGrid } from './menu-item-skeleton';
import { MenuTabs } from './menu-tabs';
import { AddSaleModal } from './modals/add-sale-modal';
import { BulkSaleModal } from './modals/bulk-sale-modal';
import { LimitedTimeItemModal } from './modals/limited-time-item-modal';
import PresetImportScreen from './preset-import';
import { SaleItemCard } from './sale-item-card';
import { SaleItemSkeletonGrid } from './sale-item-skeleton';
import { SearchBar } from './search-bar';
import { StatsCard } from './stats-card';
import { ApiMenuItem, MenuItem, MenuTab } from './types';
import { mapSortToApi, mapTabToFilter, separateSalesAndMenuItems, transformApiMenuItemsToFrontend, transformApiSaleItemsToFrontend } from './utils';

const AUTO_REFRESH_INTERVAL = 30000;
const ORGANIZER_ORG_STORAGE_KEY = 'menu-management-organizer-organization';

interface MenuManagementViewProps {
  userType: 'super-admin' | 'organizer';
}

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

export const MenuManagementView: React.FC<MenuManagementViewProps> = ({ userType }) => {
  // State
  const [activeTab, setActiveTab] = useState<MenuTab>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('');
  const [sortBy, setSortBy] = useState<string>('name');
  const [page, setPage] = useState(0);
  const [limit] = useState(18);

  const { companyId, organizationId: adminOrganizationId } = useCompanySelectionState();
  const contentRef = useRef<HTMLDivElement>(null);

  // Check if user is organizer
  const isOrganizer = userType === 'organizer';

  // ============================================================
  // ORGANIZER ORGANIZATION FORM (mirrors OrderManagementView)
  // ============================================================

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

  // Transform to dropdown options
  const organizerOrganizationOptions = useMemo(
    () =>
      organizerOrganizationsResponse?.data?.map((organization: any) => ({
        label: organization?.title || organization?.basicInfo?.name || 'Unknown Organization',
        value: organization?._id,
      })) || [],
    [organizerOrganizationsResponse]
  );

  // Auto-select: 1. current valid selection, 2. localStorage, 3. first option
  useEffect(() => {
    if (!isOrganizer || organizerOrganizationOptions.length === 0) return;

    const currentSelection = selectedOrganizerOrganizationId;
    const storedOrgId = OrganizerOrganizationStorage.getId();

    if (currentSelection && organizerOrganizationOptions.some((opt: { value: string }) => opt.value === currentSelection)) {
      return;
    }

    if (storedOrgId && organizerOrganizationOptions.some((opt: { value: string }) => opt.value === storedOrgId)) {
      setOrganizationValue('organizationId', storedOrgId);
      return;
    }

    setOrganizationValue('organizationId', organizerOrganizationOptions[0].value);
  }, [isOrganizer, organizerOrganizationOptions, selectedOrganizerOrganizationId, setOrganizationValue]);

  // Persist selection to localStorage
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

  // Resolve the effective organizationId based on user type
  const organizationId = isOrganizer ? selectedOrganizerOrganizationId : adminOrganizationId;

  const isOrganizerOrgLoading = isLoadingOrganizerOrganizations || isFetchingOrganizerOrganizations;

  // Reset page when organization changes
  useEffect(() => {
    setPage(0);
  }, [organizationId]);

  // ============================================================
  // REST OF EXISTING LOGIC (unchanged, just uses resolved organizationId)
  // ============================================================

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
      setPage(0);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Reset page when filters change
  useEffect(() => {
    setPage(0);
  }, [activeTab, categoryFilter, sortBy]);

  const isSaleTab = activeTab === 'sale';
  const apiFilter = mapTabToFilter(activeTab);
  const apiSortBy = mapSortToApi(sortBy);

  const {
    data: menuData,
    isLoading: menuLoading,
    isFetching: menuFetching,
    refetch: refetchMenu,
  } = useGetMenuManagementQuery(
    {
      search: debouncedSearchQuery,
      page,
      filter: apiFilter,
      sortBy: apiSortBy,
      categoryId: categoryFilter || undefined,
      limit,
      organizer: organizationId || '',
    },
    {
      skip: !organizationId || isSaleTab,
      pollingInterval: AUTO_REFRESH_INTERVAL,
    }
  );

  const {
    data: saleData,
    isLoading: saleLoading,
    isFetching: saleFetching,
  } = useGetSaleItemsQuery(
    {
      search: debouncedSearchQuery,
      page,
      limit,
      organizer: organizationId || '',
    },
    {
      skip: !organizationId || !isSaleTab,
      pollingInterval: AUTO_REFRESH_INTERVAL,
    }
  );

  const { previewSales, menuItems, rawMenuItems } = useMemo(() => {
    if (!menuData?.data) return { previewSales: [], menuItems: [], rawMenuItems: [] };
    const { sales, menuItems: items } = separateSalesAndMenuItems(menuData.data);
    return {
      previewSales: transformApiSaleItemsToFrontend(sales).slice(0, 3),
      menuItems: transformApiMenuItemsToFrontend(items),
      rawMenuItems: items as ApiMenuItem[],
    };
  }, [menuData]);

  const saleItems = useMemo(() => {
    if (!saleData?.data) return [];
    return transformApiSaleItemsToFrontend(saleData.data);
  }, [saleData]);

  const salePaginationMeta = useMemo(() => saleData?.meta || { currentPage: 1, totalPages: 1, totalRecords: 0, limit: 10 }, [saleData]);

  const menuStats = useMemo(
    () => ({
      totalItems: menuData?.meta?.totalMenuItems || 0,
      inStock: menuData?.meta?.inStock || 0,
      outOfStock: menuData?.meta?.outOfStock || 0,
      limitedTimeItems: menuData?.meta?.limitedTimeItems || 0,
      upsellItems: menuData?.meta?.upSellItems || 0,
      scheduledItems: menuData?.meta?.scheduledItems || 0,
    }),
    [menuData]
  );

  const paginationMeta = useMemo(() => menuData?.meta?.count || { currentPage: 1, totalPages: 1, totalRecords: 0, limit: 10 }, [menuData]);

  const tabCounts = useMemo(
    () => ({
      all: menuStats.totalItems,
      sale: menuData?.meta?.totalSalesItems || 0,
      limited: menuStats.limitedTimeItems,
      upsells: menuStats.upsellItems,
      'out-of-stock': menuStats.outOfStock,
      'schedule-sale': menuStats.scheduledItems,
    }),
    [menuStats, menuData?.meta?.totalSalesItems]
  );

  const {
    data: allMenuItemsData,
    isLoading: allMenuItemsLoading,
    refetch: refetchAllMenuItems,
  } = useGetMenuItemByOrganizerQuery(
    {
      page: 0,
      search: '',
      limit: '100',
      organizationId: organizationId,
    },
    {
      skip: !organizationId,
    }
  );

  const { data: categoryData, isLoading: categoryLoading } = useGetCategoriesForMenuQuery({
    page: 0,
    search: '',
    limit: '100',
  });

  const categoryOptions = useMemo(
    () =>
      categoryData?.data?.map((category: any) => ({
        label: category?.title,
        value: category?._id,
      })) || [],
    [categoryData]
  );

  const [updateMenuItem] = useUpdateMenuItemMutation();
  const [updatingItemId, setUpdatingItemId] = useState<string | null>(null);

  const [isAddEditModalOpen, setIsAddEditModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isLimitedTimeModalOpen, setIsLimitedTimeModalOpen] = useState(false);
  const [isBulkSaleModalOpen, setIsBulkSaleModalOpen] = useState(false);
  const [isAddSaleModalOpen, setIsAddSaleModalOpen] = useState(false);
  const [isPresetImportModalOpen, setIsPresetImportModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<ApiMenuItem | null>(null);

  const handleAddItem = () => {
    setEditingItem(null);
    setIsEditMode(false);
    setIsAddEditModalOpen(true);
  };

  const handleEditItem = (item: MenuItem) => {
    const rawItem = rawMenuItems.find((raw) => raw._id === item.id);
    if (rawItem) {
      setEditingItem(rawItem);
      setIsEditMode(true);
      setIsAddEditModalOpen(true);
    }
  };

  const handleToggleStock = async (item: MenuItem) => {
    try {
      setUpdatingItemId(item.id);
      const newStockStatus = !item.isInStock;

      const updatePayload: { id: string; isAvailableInStock: string; upSellItem?: string } = {
        id: item.id,
        isAvailableInStock: String(newStockStatus),
      };

      if (!newStockStatus) {
        updatePayload.upSellItem = 'false';
      }

      await updateMenuItem(updatePayload).unwrap();
      showSuccess(newStockStatus ? 'Item restocked and available for ordering' : 'Item marked as out of stock');
      refetchMenu();
    } catch (error) {
      showError(getErrorMessage(error));
    } finally {
      setUpdatingItemId(null);
    }
  };

  const handleToggleUpsell = async (item: MenuItem) => {
    try {
      setUpdatingItemId(item.id);
      const newUpsellStatus = !item.isUpsell;

      const response = await updateMenuItem({
        id: item.id,
        upSellItem: String(newUpsellStatus),
      }).unwrap();

      if (response?.error) {
        showError(getErrorMessage(response.error));
        return;
      }

      showSuccess(response?.message || 'Updated successfully');
      refetchMenu();
    } catch (error) {
      showError(getErrorMessage(error));
    } finally {
      setUpdatingItemId(null);
    }
  };

  const handlePresetImportComplete = () => {
    showSuccess('Preset items imported successfully!');
    refetchMenu();
  };

  const handlePreviousPage = () => {
    if (page > 0) {
      setPage(page - 1);
      contentRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleNextPage = () => {
    const currentPaginationMeta = isSaleTab ? salePaginationMeta : paginationMeta;
    if (page < currentPaginationMeta.totalPages - 1) {
      setPage(page + 1);
      contentRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handlePageClick = (pageNum: number) => {
    setPage(pageNum);
    contentRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const handleSeeAllSales = () => {
    setActiveTab('sale');
    setPage(0);
  };

  const isInitialLoading = isSaleTab ? saleLoading && saleItems.length === 0 : menuLoading && menuItems.length === 0;
  const isRefetching = isSaleTab ? saleFetching && saleItems.length === 0 : menuFetching && menuItems.length === 0;
  const currentPaginationMeta = isSaleTab ? salePaginationMeta : paginationMeta;

  return (
    <section>
      {/* Header */}
      <div className="sticky top-0 z-30 rounded-t-2xl bg-white shadow-sm dark:bg-[#222121]">
        <div className="mx-auto max-w-full px-6 py-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            {/* Title + Organizer Dropdown */}
            <div className="flex items-center gap-4">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Menu Management</h1>

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

            <div className="flex flex-wrap gap-3">
              <Button variant="outline" onClick={() => setIsAddSaleModalOpen(true)} className="h-11 gap-2 font-semibold">
                <Tag className="h-4 w-4" />
                Add Sale
              </Button>

              <Button variant="outline" onClick={() => setIsPresetImportModalOpen(true)} className="h-11 gap-2 font-semibold">
                <Package className="h-4 w-4" />
                Import Presets
              </Button>

              <Button variant="outline" onClick={() => setIsBulkSaleModalOpen(true)} className="h-11 gap-2 font-semibold">
                🏷️ Create Bulk Sale
              </Button>

              <Button
                onClick={() => setIsLimitedTimeModalOpen(true)}
                className="h-11 gap-2 bg-green-600 font-semibold hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600"
              >
                ⚡ Add Limited-Time Item
              </Button>

              <Button onClick={handleAddItem} className="h-11 gap-2 font-semibold">
                + Add Menu Item
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Container */}
      <div ref={contentRef} className="mx-auto max-w-full rounded-b-2xl px-6 py-8 dark:bg-[#1a1a1a]">
        {/* Guard: organizer must select org first */}
        {isOrganizer && !organizationId ? (
          <div className="py-16 text-center">
            <div className="mb-4 text-6xl opacity-30">🏢</div>
            <h3 className="mb-2 text-xl font-bold text-gray-900 dark:text-gray-100">Select an Organization</h3>
            <p className="text-sm text-gray-500 dark:text-gray-500">Please select an organization from the dropdown above to manage the menu</p>
          </div>
        ) : (
          <>
            {/* Info Banner */}
            <div className="mb-6 flex items-center gap-4 rounded-xl bg-linear-to-br from-[#2A7B9B] to-[#1300FF] p-5 text-white">
              <div className="text-3xl">💡</div>
              <div className="flex-1">
                <div className="mb-1 text-base font-bold">Real-Time Menu Control</div>
                <div className="text-sm opacity-90">
                  Changes take effect immediately in the user app. Mark items as out of stock to prevent orders when inventory runs out.
                </div>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="mb-8 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
              <StatsCard value={menuStats.totalItems} label="Total Menu Items" isLoading={isInitialLoading} />
              <StatsCard value={menuStats.inStock} label="In Stock" isLoading={isInitialLoading} />
              <StatsCard value={menuStats.outOfStock} label="Out of Stock" isLoading={isInitialLoading} />
              <StatsCard value={menuStats.limitedTimeItems} label="Limited-Time Items" isLoading={isInitialLoading} />
              <StatsCard value={menuStats.upsellItems} label="Upsell Items" isLoading={isInitialLoading} />
              <StatsCard value={menuStats.scheduledItems} label="Scheduled Items" isLoading={isInitialLoading} />
            </div>

            {/* Tabs */}
            <div className="mb-6">
              <MenuTabs activeTab={activeTab} onTabChange={setActiveTab} itemCounts={tabCounts} />
            </div>

            {/* Toolbar */}
            <div className="mb-6 flex flex-wrap gap-3">
              <SearchBar value={searchQuery} onChange={setSearchQuery} />

              {!isSaleTab && (
                <>
                  <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                    <SelectTrigger className="h-11 w-50 border-2">
                      <SelectValue placeholder="Select Category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categoryLoading ? (
                        <SelectItem value="_loading" disabled>
                          Loading...
                        </SelectItem>
                      ) : (
                        categoryOptions.map((option: any) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>

                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="h-11 w-50 border-2">
                      <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                      {SORT_OPTIONS.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </>
              )}
            </div>

            {/* Sales Preview (All tab only) */}
            {activeTab === 'all' && previewSales.length > 0 && (
              <div className="mb-8">
                <div className="mb-4 flex items-center justify-between">
                  <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100">🏷️ Sales ({tabCounts.sale})</h2>
                  <Button
                    variant="link"
                    onClick={handleSeeAllSales}
                    className="h-auto p-0 text-sm font-semibold text-blue-600 hover:text-blue-700 dark:text-blue-400"
                  >
                    See All →
                  </Button>
                </div>
                <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
                  {previewSales.map((sale) => (
                    <SaleItemCard key={sale.id} sale={sale} menuItems={allMenuItemsData?.data} menuItemLoading={allMenuItemsLoading} />
                  ))}
                </div>
                <div className="mt-8 border-t border-gray-200 dark:border-gray-700" />
              </div>
            )}

            {/* Sale Tab Content */}
            {isSaleTab ? (
              <>
                {isInitialLoading || isRefetching ? (
                  <SaleItemSkeletonGrid count={6} />
                ) : saleItems.length === 0 ? (
                  <div className="py-20 text-center">
                    <div className="mb-4 text-6xl opacity-30">🏷️</div>
                    <h3 className="mb-2 text-xl font-bold text-gray-900 dark:text-gray-100">No Sales Found</h3>
                    <p className="mb-6 text-sm text-gray-500 dark:text-gray-500">
                      {searchQuery ? 'Try adjusting your search' : 'Create your first sale to get started'}
                    </p>
                  </div>
                ) : (
                  <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
                    {saleItems.map((sale) => (
                      <SaleItemCard key={sale.id} sale={sale} menuItems={allMenuItemsData?.data} menuItemLoading={allMenuItemsLoading} />
                    ))}
                  </div>
                )}
              </>
            ) : (
              /* Menu Items Grid */
              <>
                {isInitialLoading || isRefetching ? (
                  <MenuItemSkeletonGrid count={6} />
                ) : menuItems.length === 0 ? (
                  <div className="py-20 text-center">
                    <div className="mb-4 text-6xl opacity-30">📦</div>
                    <h3 className="mb-2 text-xl font-bold text-gray-900 dark:text-gray-100">No Items Found</h3>
                    <p className="mb-6 text-sm text-gray-500 dark:text-gray-500">
                      {searchQuery || categoryFilter ? 'Try adjusting your search or filters' : 'Add your first menu item to get started'}
                    </p>
                  </div>
                ) : (
                  <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
                    {menuItems?.map((item) => (
                      <MenuItemCard
                        key={item?.id}
                        item={item}
                        onEdit={handleEditItem}
                        onToggleStock={handleToggleStock}
                        onToggleUpsell={handleToggleUpsell}
                        isUpdating={updatingItemId === item.id}
                      />
                    ))}
                  </div>
                )}
              </>
            )}

            {/* Pagination */}
            {currentPaginationMeta.totalPages > 1 && (
              <div className="mt-8 flex items-center justify-between border-t border-gray-200 pt-6 dark:border-gray-800">
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Showing {page * limit + 1} to {Math.min((page + 1) * limit, currentPaginationMeta.totalRecords)} of{' '}
                  {currentPaginationMeta.totalRecords} {isSaleTab ? 'sales' : 'items'}
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    onClick={handlePreviousPage}
                    disabled={page === 0}
                    className="h-10 gap-1 font-semibold disabled:opacity-50"
                  >
                    <ChevronLeft className="h-4 w-4" />
                    Previous
                  </Button>

                  <div className="flex gap-1">
                    {Array.from({ length: Math.min(5, currentPaginationMeta.totalPages) }, (_, i) => {
                      let pageNum: number;
                      if (currentPaginationMeta.totalPages <= 5) {
                        pageNum = i;
                      } else if (page < 3) {
                        pageNum = i;
                      } else if (page >= currentPaginationMeta.totalPages - 3) {
                        pageNum = currentPaginationMeta.totalPages - 5 + i;
                      } else {
                        pageNum = page - 2 + i;
                      }

                      return (
                        <Button
                          key={pageNum}
                          variant={page === pageNum ? 'default' : 'outline'}
                          onClick={() => handlePageClick(pageNum)}
                          className="h-10 w-10 p-0 font-semibold"
                        >
                          {pageNum + 1}
                        </Button>
                      );
                    })}
                  </div>

                  <Button
                    variant="outline"
                    onClick={handleNextPage}
                    disabled={page >= currentPaginationMeta.totalPages - 1}
                    className="h-10 gap-1 font-semibold disabled:opacity-50"
                  >
                    Next
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Modals */}
      {isAddSaleModalOpen && (
        <AddSaleModal
          isOpen={isAddSaleModalOpen}
          onClose={() => setIsAddSaleModalOpen(false)}
          menuItems={allMenuItemsData?.data}
          menuItemLoading={allMenuItemsLoading}
          companyId={companyId}
          userType={userType}
        />
      )}

      {isPresetImportModalOpen && (
        <PresetImportScreen
          open={isPresetImportModalOpen}
          onClose={() => setIsPresetImportModalOpen(false)}
          onImportComplete={handlePresetImportComplete}
        />
      )}

      {isBulkSaleModalOpen && (
        <BulkSaleModal
          isOpen={isBulkSaleModalOpen}
          onClose={() => setIsBulkSaleModalOpen(false)}
          menuItems={allMenuItemsData?.data}
          menuItemLoading={allMenuItemsLoading}
          companyId={companyId}
          userType={userType}
        />
      )}

      {isLimitedTimeModalOpen && (
        <LimitedTimeItemModal
          isOpen={isLimitedTimeModalOpen}
          onClose={() => setIsLimitedTimeModalOpen(false)}
          menuItems={allMenuItemsData?.data}
          menuItemLoading={allMenuItemsLoading}
          organizationId={organizationId}
        />
      )}

      {isAddEditModalOpen && (
        <MenuItemModal
          open={isAddEditModalOpen}
          onClose={() => {
            setIsAddEditModalOpen(false);
            setEditingItem(null);
            setIsEditMode(false);
          }}
          isEdit={isEditMode}
          selectedData={editingItem}
          menuManagementView={true}
          userType={userType}
          showDiscountPrice={false}
          onSuccess={() => {
            refetchMenu();
            refetchAllMenuItems();
          }}
        />
      )}
    </section>
  );
};
