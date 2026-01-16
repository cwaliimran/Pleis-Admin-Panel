'use client';

import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useCompanySelectionState } from '@/hooks/useCompanySelectionState';
import MenuItemModal from '@/sections/menu-management-modules/menuItems/menuItems-modal';
import { useGetCategoriesForMenuQuery, useGetMenuItemByOrganizerQuery, useGetMenuManagementQuery } from '@/store/Reducer/menu-management-api';
import { useUpdateMenuItemMutation } from '@/store/Reducer/menu-items-api';
import { getErrorMessage } from '@/utils/api';
import { showError, showSuccess } from '@/utils/toast';
import { ChevronLeft, ChevronRight, Package, Tag } from 'lucide-react';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { SORT_OPTIONS } from './constants';
import { MenuItemCard } from './menu-item-card';
import { MenuItemSkeletonGrid } from './menu-item-skeleton';
import { MenuTabs } from './menu-tabs';
import { AddSaleModal } from './modals/add-sale-modal';
import { BulkSaleModal } from './modals/bulk-sale-modal';
import { LimitedTimeItemModal } from './modals/limited-time-item-modal';
import PresetImportScreen from './preset-import';
import { SearchBar } from './search-bar';
import { StatsCard } from './stats-card';
import { MenuItem, MenuTab } from './types';
import { mapSortToApi, mapTabToFilter, transformApiMenuItemsToFrontend } from './utils';

const AUTO_REFRESH_INTERVAL = 30000; // 30 seconds

export const MenuManagementView: React.FC = () => {
  // State
  const [activeTab, setActiveTab] = useState<MenuTab>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('');
  const [sortBy, setSortBy] = useState<string>('name');
  const [page, setPage] = useState(0);
  const [limit] = useState(10);

  const { companyId, organizationId } = useCompanySelectionState();
  const contentRef = useRef<HTMLDivElement>(null);

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
      setPage(0); // Reset to first page on search
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Reset page when filters change
  useEffect(() => {
    setPage(0);
  }, [activeTab, categoryFilter, sortBy]);

  // Get API filter from active tab
  const apiFilter = mapTabToFilter(activeTab);
  const apiSortBy = mapSortToApi(sortBy);

  // Menu items query with auto-refresh
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
      skip: !organizationId,
      pollingInterval: AUTO_REFRESH_INTERVAL,
    }
  );

  // Transform API data to frontend format
  const menuItems = useMemo(() => {
    if (!menuData?.data) return [];
    return transformApiMenuItemsToFrontend(menuData.data);
  }, [menuData]);

  // Menu stats
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

  // Pagination metadata
  const paginationMeta = useMemo(
    () =>
      menuData?.meta?.count || {
        currentPage: 1,
        totalPages: 1,
        totalRecords: 0,
        limit: 10,
      },
    [menuData]
  );

  // Tab counts
  const tabCounts = useMemo(
    () => ({
      all: menuStats.totalItems,
      limited: menuStats.limitedTimeItems,
      upsells: menuStats.upsellItems,
      'out-of-stock': menuStats.outOfStock,
      'schedule-sale': menuStats.scheduledItems,
    }),
    [menuStats]
  );

  // Get menu items for modals (all items, not filtered)
  const { data: allMenuItemsData, isLoading: allMenuItemsLoading } = useGetMenuItemByOrganizerQuery({
    page: 0,
    search: '',
    limit: '100',
    organizationId: organizationId,
  });

  // Get categories
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

  // Update menu item mutation
  const [updateMenuItem] = useUpdateMenuItemMutation();

  // Track which item is being updated
  const [updatingItemId, setUpdatingItemId] = useState<string | null>(null);

  // Modal states
  const [isAddEditModalOpen, setIsAddEditModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isLimitedTimeModalOpen, setIsLimitedTimeModalOpen] = useState(false);
  const [isBulkSaleModalOpen, setIsBulkSaleModalOpen] = useState(false);
  const [isAddSaleModalOpen, setIsAddSaleModalOpen] = useState(false);
  const [isPresetImportModalOpen, setIsPresetImportModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);

  // Handlers
  const handleAddItem = () => {
    setEditingItem(null);
    setIsEditMode(false);
    setIsAddEditModalOpen(true);
  };

  const handleEditItem = (item: MenuItem) => {
    setEditingItem(item);
    setIsEditMode(true);
    setIsAddEditModalOpen(true);
  };

  const handleToggleStock = async (item: MenuItem) => {
    try {
      setUpdatingItemId(item.id);
      const newStockStatus = !item.isInStock;

      await updateMenuItem({
        id: item.id,
        isAvailableInStock: String(newStockStatus),
      }).unwrap();

      showSuccess(newStockStatus ? 'Item restocked and available for ordering' : 'Item marked as out of stock');
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

  // Pagination handlers
  const handlePreviousPage = () => {
    if (page > 0) {
      setPage(page - 1);
      contentRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleNextPage = () => {
    if (page < paginationMeta.totalPages - 1) {
      setPage(page + 1);
      contentRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handlePageClick = (pageNum: number) => {
    setPage(pageNum);
    contentRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  // Show loading only on initial load, not during refetch
  const isInitialLoading = menuLoading && menuItems.length === 0;
  const isRefetching = menuFetching && menuItems.length === 0;

  return (
    <section>
      {/* Header */}
      <div className="sticky top-0 z-30 rounded-t-2xl bg-white shadow-sm dark:bg-[#222121]">
        <div className="mx-auto max-w-full px-6 py-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Menu Management</h1>

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

          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="h-11 w-[200px] border-2">
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
            <SelectTrigger className="h-11 w-[200px] border-2">
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
        </div>

        {/* Menu Items Grid */}
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
          <>
            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {menuItems.map((item) => (
                <MenuItemCard
                  key={item.id}
                  item={item}
                  onEdit={handleEditItem}
                  onToggleStock={handleToggleStock}
                  isUpdating={updatingItemId === item.id}
                />
              ))}
            </div>

            {/* Pagination */}
            {paginationMeta.totalPages > 1 && (
              <div className="mt-8 flex items-center justify-between border-t border-gray-200 pt-6 dark:border-gray-800">
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Showing {page * limit + 1} to {Math.min((page + 1) * limit, paginationMeta.totalRecords)} of {paginationMeta.totalRecords} items
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
                    {Array.from({ length: Math.min(5, paginationMeta.totalPages) }, (_, i) => {
                      let pageNum: number;
                      if (paginationMeta.totalPages <= 5) {
                        pageNum = i;
                      } else if (page < 3) {
                        pageNum = i;
                      } else if (page >= paginationMeta.totalPages - 3) {
                        pageNum = paginationMeta.totalPages - 5 + i;
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
                    disabled={page >= paginationMeta.totalPages - 1}
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
        />
      )}
    </section>
  );
};

// 'use client';

// import { Button } from '@/components/ui/button';
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
// import { useCompanySelectionState } from '@/hooks/useCompanySelectionState';
// import MenuItemModal from '@/sections/menu-management-modules/menuItems/menuItems-modal';
// import { useGetCategoriesForMenuQuery, useGetMenuItemByOrganizerQuery, useGetMenuManagementQuery } from '@/store/Reducer/menu-management-api';
// import { useUpdateMenuItemMutation } from '@/store/Reducer/menu-items-api';
// import { showError, showSuccess } from '@/utils/toast';
// import { ChevronLeft, ChevronRight, Package, Tag } from 'lucide-react';
// import React, { useEffect, useMemo, useRef, useState } from 'react';
// import { SORT_OPTIONS } from './constants';
// import { MenuItemCard } from './menu-item-card';
// import { MenuItemSkeletonGrid } from './menu-item-skeleton';
// import { MenuTabs } from './menu-tabs';
// import { AddSaleModal } from './modals/add-sale-modal';
// import { BulkSaleModal } from './modals/bulk-sale-modal';
// import { LimitedTimeItemModal } from './modals/limited-time-item-modal';
// import PresetImportScreen from './preset-import';
// import { SearchBar } from './search-bar';
// import { StatsCard } from './stats-card';
// import { MenuItem, MenuTab } from './types';
// import { mapSortToApi, mapTabToFilter, transformApiMenuItemsToFrontend } from './utils';
// import { getErrorMessage } from '@/utils/api';

// const AUTO_REFRESH_INTERVAL = 30000; // 30 seconds

// export const MenuManagementView: React.FC = () => {
//   // State
//   const [activeTab, setActiveTab] = useState<MenuTab>('all');
//   const [searchQuery, setSearchQuery] = useState('');
//   const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('');
//   const [categoryFilter, setCategoryFilter] = useState<string>('');
//   const [sortBy, setSortBy] = useState<string>('name');
//   const [page, setPage] = useState(0);
//   const [limit] = useState(10);

//   const { companyId, organizationId } = useCompanySelectionState();
//   const contentRef = useRef<HTMLDivElement>(null);

//   // Debounce search query
//   useEffect(() => {
//     const timer = setTimeout(() => {
//       setDebouncedSearchQuery(searchQuery);
//       setPage(0); // Reset to first page on search
//     }, 500);

//     return () => clearTimeout(timer);
//   }, [searchQuery]);

//   // Reset page when filters change
//   useEffect(() => {
//     setPage(0);
//   }, [activeTab, categoryFilter, sortBy]);

//   // Get API filter from active tab
//   const apiFilter = mapTabToFilter(activeTab);
//   const apiSortBy = mapSortToApi(sortBy);

//   // Menu items query with auto-refresh
//   const {
//     data: menuData,
//     isLoading: menuLoading,
//     isFetching: menuFetching,
//     refetch: refetchMenu,
//   } = useGetMenuManagementQuery(
//     {
//       search: debouncedSearchQuery,
//       page,
//       filter: apiFilter,
//       sortBy: apiSortBy,
//       categoryId: categoryFilter || undefined,
//       limit,
//       organizer: organizationId || '',
//     },
//     {
//       skip: !organizationId,
//       pollingInterval: AUTO_REFRESH_INTERVAL,
//     }
//   );

//   // Transform API data to frontend format
//   const menuItems = useMemo(() => {
//     if (!menuData?.data) return [];
//     return transformApiMenuItemsToFrontend(menuData.data);
//   }, [menuData]);

//   // Menu stats
//   const menuStats = useMemo(
//     () => ({
//       totalItems: menuData?.meta?.totalMenuItems || 0,
//       inStock: menuData?.meta?.inStock || 0,
//       outOfStock: menuData?.meta?.outOfStock || 0,
//       limitedTimeItems: menuData?.meta?.limitedTimeItems || 0,
//       upsellItems: menuData?.meta?.upSellItems || 0,
//       scheduledItems: menuData?.meta?.scheduledItems || 0,
//     }),
//     [menuData]
//   );

//   // Pagination metadata
//   const paginationMeta = useMemo(
//     () =>
//       menuData?.meta?.count || {
//         currentPage: 1,
//         totalPages: 1,
//         totalRecords: 0,
//         limit: 10,
//       },
//     [menuData]
//   );

//   // Tab counts
//   const tabCounts = useMemo(
//     () => ({
//       all: menuStats.totalItems,
//       limited: menuStats.limitedTimeItems,
//       upsells: menuStats.upsellItems,
//       'out-of-stock': menuStats.outOfStock,
//       'schedule-sale': menuStats.scheduledItems,
//     }),
//     [menuStats]
//   );

//   // Get menu items for modals (all items, not filtered)
//   const { data: allMenuItemsData, isLoading: allMenuItemsLoading } = useGetMenuItemByOrganizerQuery({
//     page: 0,
//     search: '',
//     limit: '100',
//     organizationId: organizationId,
//   });

//   // Get categories
//   const { data: categoryData, isLoading: categoryLoading } = useGetCategoriesForMenuQuery({
//     page: 0,
//     search: '',
//     limit: '100',
//   });

//   const categoryOptions = useMemo(
//     () =>
//       categoryData?.data?.map((category: any) => ({
//         label: category?.title,
//         value: category?._id,
//       })) || [],
//     [categoryData]
//   );

//   // Update menu item mutation
//   const [updateMenuItem, { isLoading: isUpdatingStock }] = useUpdateMenuItemMutation();

//   // Track which item is being updated
//   const [updatingItemId, setUpdatingItemId] = useState<string | null>(null);

//   // Modal states
//   const [isAddEditModalOpen, setIsAddEditModalOpen] = useState(false);
//   const [isLimitedTimeModalOpen, setIsLimitedTimeModalOpen] = useState(false);
//   const [isBulkSaleModalOpen, setIsBulkSaleModalOpen] = useState(false);
//   const [isAddSaleModalOpen, setIsAddSaleModalOpen] = useState(false);
//   const [isPresetImportModalOpen, setIsPresetImportModalOpen] = useState(false);
//   const [editingItem, setEditingItem] = useState<MenuItem | null>(null);

//   // Handlers
//   const handleAddItem = () => {
//     setEditingItem(null);
//     setIsAddEditModalOpen(true);
//   };

//   const handleEditItem = (item: MenuItem) => {
//     setEditingItem(item);
//     setIsAddEditModalOpen(true);
//   };

//   const handleToggleStock = async (item: MenuItem) => {
//     try {
//       setUpdatingItemId(item.id);
//       const newStockStatus = !item.isInStock;

//       await updateMenuItem({
//         id: item.id,
//         isAvailableInStock: String(newStockStatus),
//       }).unwrap();

//       showSuccess(newStockStatus ? 'Item restocked and available for ordering' : 'Item marked as out of stock');
//       refetchMenu();
//     } catch (error) {
//       showError(getErrorMessage(error));
//     } finally {
//       setUpdatingItemId(null);
//     }
//   };

//   const handlePresetImportComplete = () => {
//     showSuccess('Preset items imported successfully!');
//     refetchMenu();
//   };

//   // Pagination handlers
//   const handlePreviousPage = () => {
//     if (page > 0) {
//       setPage(page - 1);
//       contentRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
//     }
//   };

//   const handleNextPage = () => {
//     if (page < paginationMeta.totalPages - 1) {
//       setPage(page + 1);
//       contentRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
//     }
//   };

//   const handlePageClick = (pageNum: number) => {
//     setPage(pageNum);
//     contentRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
//   };

//   // Show loading only on initial load, not during refetch
//   const isInitialLoading = menuLoading && menuItems.length === 0;
//   const isRefetching = menuFetching && menuItems.length === 0;

//   return (
//     <section>
//       {/* Header */}
//       <div className="sticky top-0 z-30 rounded-t-2xl bg-white shadow-sm dark:bg-[#222121]">
//         <div className="mx-auto max-w-full px-6 py-6">
//           <div className="flex flex-wrap items-center justify-between gap-4">
//             <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Menu Management</h1>

//             <div className="flex flex-wrap gap-3">
//               <Button variant="outline" onClick={() => setIsAddSaleModalOpen(true)} className="h-11 gap-2 font-semibold">
//                 <Tag className="h-4 w-4" />
//                 Add Sale
//               </Button>

//               <Button variant="outline" onClick={() => setIsPresetImportModalOpen(true)} className="h-11 gap-2 font-semibold">
//                 <Package className="h-4 w-4" />
//                 Import Presets
//               </Button>

//               <Button variant="outline" onClick={() => setIsBulkSaleModalOpen(true)} className="h-11 gap-2 font-semibold">
//                 🏷️ Create Bulk Sale
//               </Button>

//               <Button
//                 onClick={() => setIsLimitedTimeModalOpen(true)}
//                 className="h-11 gap-2 bg-green-600 font-semibold hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600"
//               >
//                 ⚡ Add Limited-Time Item
//               </Button>

//               <Button onClick={handleAddItem} className="h-11 gap-2 font-semibold">
//                 + Add Menu Item
//               </Button>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Main Container */}
//       <div ref={contentRef} className="mx-auto max-w-full rounded-b-2xl px-6 py-8 dark:bg-[#1a1a1a]">
//         {/* Info Banner */}
//         <div className="mb-6 flex items-center gap-4 rounded-xl bg-linear-to-br from-[#2A7B9B] to-[#1300FF] p-5 text-white">
//           <div className="text-3xl">💡</div>
//           <div className="flex-1">
//             <div className="mb-1 text-base font-bold">Real-Time Menu Control</div>
//             <div className="text-sm opacity-90">
//               Changes take effect immediately in the user app. Mark items as out of stock to prevent orders when inventory runs out.
//             </div>
//           </div>
//         </div>

//         {/* Stats Grid */}
//         <div className="mb-8 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
//           <StatsCard value={menuStats.totalItems} label="Total Menu Items" isLoading={isInitialLoading} />
//           <StatsCard value={menuStats.inStock} label="In Stock" isLoading={isInitialLoading} />
//           <StatsCard value={menuStats.outOfStock} label="Out of Stock" isLoading={isInitialLoading} />
//           <StatsCard value={menuStats.limitedTimeItems} label="Limited-Time Items" isLoading={isInitialLoading} />
//           <StatsCard value={menuStats.upsellItems} label="Upsell Items" isLoading={isInitialLoading} />
//           <StatsCard value={menuStats.scheduledItems} label="Scheduled Items" isLoading={isInitialLoading} />
//         </div>

//         {/* Tabs */}
//         <div className="mb-6">
//           <MenuTabs activeTab={activeTab} onTabChange={setActiveTab} itemCounts={tabCounts} />
//         </div>

//         {/* Toolbar */}
//         <div className="mb-6 flex flex-wrap gap-3">
//           <SearchBar value={searchQuery} onChange={setSearchQuery} />

//           <Select value={categoryFilter} onValueChange={setCategoryFilter}>
//             <SelectTrigger className="h-11 w-[200px] border-2">
//               <SelectValue placeholder="Select Category" />
//             </SelectTrigger>
//             <SelectContent>
//               {categoryLoading ? (
//                 <SelectItem value="_loading" disabled>
//                   Loading...
//                 </SelectItem>
//               ) : (
//                 categoryOptions.map((option: any) => (
//                   <SelectItem key={option.value} value={option.value}>
//                     {option.label}
//                   </SelectItem>
//                 ))
//               )}
//             </SelectContent>
//           </Select>

//           <Select value={sortBy} onValueChange={setSortBy}>
//             <SelectTrigger className="h-11 w-[200px] border-2">
//               <SelectValue placeholder="Sort by" />
//             </SelectTrigger>
//             <SelectContent>
//               {SORT_OPTIONS.map((option) => (
//                 <SelectItem key={option.value} value={option.value}>
//                   {option.label}
//                 </SelectItem>
//               ))}
//             </SelectContent>
//           </Select>
//         </div>

//         {/* Menu Items Grid */}
//         {isInitialLoading || isRefetching ? (
//           <MenuItemSkeletonGrid count={6} />
//         ) : menuItems.length === 0 ? (
//           <div className="py-20 text-center">
//             <div className="mb-4 text-6xl opacity-30">📦</div>
//             <h3 className="mb-2 text-xl font-bold text-gray-900 dark:text-gray-100">No Items Found</h3>
//             <p className="mb-6 text-sm text-gray-500 dark:text-gray-500">
//               {searchQuery || categoryFilter ? 'Try adjusting your search or filters' : 'Add your first menu item to get started'}
//             </p>
//           </div>
//         ) : (
//           <>
//             <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
//               {menuItems.map((item) => (
//                 <MenuItemCard
//                   key={item.id}
//                   item={item}
//                   onEdit={handleEditItem}
//                   onToggleStock={handleToggleStock}
//                   isUpdating={updatingItemId === item.id}
//                 />
//               ))}
//             </div>

//             {/* Pagination */}
//             {paginationMeta.totalPages > 1 && (
//               <div className="mt-8 flex items-center justify-between border-t border-gray-200 pt-6 dark:border-gray-800">
//                 <div className="text-sm text-gray-600 dark:text-gray-400">
//                   Showing {page * limit + 1} to {Math.min((page + 1) * limit, paginationMeta.totalRecords)} of {paginationMeta.totalRecords} items
//                 </div>

//                 <div className="flex items-center gap-2">
//                   <Button
//                     variant="outline"
//                     onClick={handlePreviousPage}
//                     disabled={page === 0}
//                     className="h-10 gap-1 font-semibold disabled:opacity-50"
//                   >
//                     <ChevronLeft className="h-4 w-4" />
//                     Previous
//                   </Button>

//                   <div className="flex gap-1">
//                     {Array.from({ length: Math.min(5, paginationMeta.totalPages) }, (_, i) => {
//                       let pageNum: number;
//                       if (paginationMeta.totalPages <= 5) {
//                         pageNum = i;
//                       } else if (page < 3) {
//                         pageNum = i;
//                       } else if (page >= paginationMeta.totalPages - 3) {
//                         pageNum = paginationMeta.totalPages - 5 + i;
//                       } else {
//                         pageNum = page - 2 + i;
//                       }

//                       return (
//                         <Button
//                           key={pageNum}
//                           variant={page === pageNum ? 'default' : 'outline'}
//                           onClick={() => handlePageClick(pageNum)}
//                           className="h-10 w-10 p-0 font-semibold"
//                         >
//                           {pageNum + 1}
//                         </Button>
//                       );
//                     })}
//                   </div>

//                   <Button
//                     variant="outline"
//                     onClick={handleNextPage}
//                     disabled={page >= paginationMeta.totalPages - 1}
//                     className="h-10 gap-1 font-semibold disabled:opacity-50"
//                   >
//                     Next
//                     <ChevronRight className="h-4 w-4" />
//                   </Button>
//                 </div>
//               </div>
//             )}
//           </>
//         )}
//       </div>

//       {/* Modals */}
//       {isAddSaleModalOpen && (
//         <AddSaleModal
//           isOpen={isAddSaleModalOpen}
//           onClose={() => setIsAddSaleModalOpen(false)}
//           menuItems={allMenuItemsData?.data}
//           menuItemLoading={allMenuItemsLoading}
//           companyId={companyId}
//         />
//       )}

//       {isPresetImportModalOpen && (
//         <PresetImportScreen
//           open={isPresetImportModalOpen}
//           onClose={() => setIsPresetImportModalOpen(false)}
//           onImportComplete={handlePresetImportComplete}
//         />
//       )}

//       {isBulkSaleModalOpen && (
//         <BulkSaleModal
//           isOpen={isBulkSaleModalOpen}
//           onClose={() => setIsBulkSaleModalOpen(false)}
//           menuItems={allMenuItemsData?.data}
//           menuItemLoading={allMenuItemsLoading}
//           companyId={companyId}
//         />
//       )}

//       {isLimitedTimeModalOpen && (
//         <LimitedTimeItemModal
//           isOpen={isLimitedTimeModalOpen}
//           onClose={() => setIsLimitedTimeModalOpen(false)}
//           menuItems={allMenuItemsData?.data}
//           menuItemLoading={allMenuItemsLoading}
//           organizationId={organizationId}
//         />
//       )}

//       {isAddEditModalOpen && (
//         <MenuItemModal open={isAddEditModalOpen} onClose={() => setIsAddEditModalOpen(false)} menuManagementView={true} selectedData={editingItem} />
//       )}
//     </section>
//   );
// };
