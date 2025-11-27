'use client';

import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { showSuccess } from '@/utils/toast';
import React, { useMemo, useState } from 'react';
import { CATEGORY_OPTIONS, SORT_OPTIONS } from './constants';
import { MenuItemCard } from './menu-item-card';
import { MenuTabs } from './menu-tabs';
import { AddEditItemModal } from './modals/add-edit-item-modal';
import { BulkSaleModal } from './modals/bulk-sale-modal';
import { LimitedTimeItemModal } from './modals/limited-time-item-modal';
import { MOCK_MENU_ITEMS } from './mock-data';
import { SearchBar } from './search-bar';
import { StatsCard } from './stats-card';
import { BulkSaleFormData, LimitedTimeFormData, MenuCategory, MenuItem, MenuItemFormData, MenuStats, MenuTab } from './types';

export const MenuManagementViewV1: React.FC = () => {
  const [activeTab, setActiveTab] = useState<MenuTab>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<MenuCategory | 'all'>('all');
  const [sortBy, setSortBy] = useState<string>('name');

  const [menuItems, setMenuItems] = useState<MenuItem[]>(MOCK_MENU_ITEMS);

  // Modal states
  const [isAddEditModalOpen, setIsAddEditModalOpen] = useState(false);
  const [isLimitedTimeModalOpen, setIsLimitedTimeModalOpen] = useState(false);
  const [isBulkSaleModalOpen, setIsBulkSaleModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);

  // Filter items based on active tab
  const filteredItemsByTab = useMemo(() => {
    switch (activeTab) {
      case 'limited':
        return menuItems.filter((item) => item.isLimitedTime);
      case 'upsells':
        return menuItems.filter((item) => item.isUpsell);
      case 'out-of-stock':
        return menuItems.filter((item) => !item.isInStock);
      default:
        return menuItems;
    }
  }, [activeTab, menuItems]);

  // Apply search and category filters
  const filteredItems = useMemo(() => {
    return filteredItemsByTab.filter((item) => {
      // Search filter
      const searchLower = searchQuery.toLowerCase();
      const matchesSearch =
        !searchQuery ||
        item.name.toLowerCase().includes(searchLower) ||
        item.category.toLowerCase().includes(searchLower) ||
        (item.description && item.description.toLowerCase().includes(searchLower));

      if (!matchesSearch) return false;

      // Category filter
      if (categoryFilter !== 'all' && item.category !== categoryFilter) return false;

      return true;
    });
  }, [filteredItemsByTab, searchQuery, categoryFilter]);

  // Sort items
  const sortedItems = useMemo(() => {
    const sorted = [...filteredItems];

    switch (sortBy) {
      case 'name':
        sorted.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'price-low':
        sorted.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        sorted.sort((a, b) => b.price - a.price);
        break;
      case 'recent':
        break;
    }

    return sorted;
  }, [filteredItems, sortBy]);

  // Calculate tab counts
  const tabCounts = useMemo(
    () => ({
      all: menuItems.length,
      limited: menuItems.filter((item) => item.isLimitedTime).length,
      upsells: menuItems.filter((item) => item.isUpsell).length,
      'out-of-stock': menuItems.filter((item) => !item.isInStock).length,
    }),
    [menuItems]
  );

  const dynamicStats: MenuStats = useMemo(
    () => ({
      totalItems: menuItems.length,
      inStock: menuItems.filter((item) => item.isInStock).length,
      outOfStock: menuItems.filter((item) => !item.isInStock).length,
      limitedTimeItems: menuItems.filter((item) => item.isLimitedTime).length,
      upsellItems: menuItems.filter((item) => item.isUpsell).length,
    }),
    [menuItems]
  );

  // Handlers
  const handleAddItem = () => {
    setEditingItem(null);
    setIsAddEditModalOpen(true);
  };

  const handleEditItem = (item: MenuItem) => {
    setEditingItem(item);
    setIsAddEditModalOpen(true);
  };

  const handleToggleStock = (item: MenuItem) => {
    setMenuItems((prev) =>
      prev.map((i) =>
        i.id === item.id
          ? {
              ...i,
              isInStock: !i.isInStock,
            }
          : i
      )
    );

    showSuccess(item.isInStock ? 'Item marked as out of stock' : 'Item restocked and available for ordering');
  };

  const handleSubmitItem = (data: MenuItemFormData) => {
    if (editingItem) {
      // Update existing item
      setMenuItems((prev) =>
        prev.map((item) =>
          item.id === editingItem.id
            ? {
                ...item,
                ...data,
              }
            : item
        )
      );
      showSuccess('Menu item updated successfully!');
    } else {
      // Add new item
      const newItem: MenuItem = {
        id: Date.now().toString(),
        ...data,
        isInStock: true,
        isLimitedTime: false,
        isPreorder: false,
        soldCount: 0,
      };
      setMenuItems((prev) => [...prev, newItem]);
      showSuccess('Menu item saved successfully!');
    }
  };

  const handleSubmitLimitedTime = (data: LimitedTimeFormData) => {
    const newItem: MenuItem = {
      id: Date.now().toString(),
      name: data.name,
      category: data.category,
      price: data.price,
      description: data.description,
      imageUrl: data.imageUrl,
      isInStock: true,
      isUpsell: data.isUpsell,
      isLimitedTime: true,
      isPreorder: data.availabilityType === 'preorder-only' || data.availabilityType === 'preorder-unlock',
      soldCount: 0,
      availabilityType: data.availabilityType,
      limitedTimeEnd: new Date(`${data.endDate}T${data.endTime}`),
    };

    setMenuItems((prev) => [...prev, newItem]);
    showSuccess('Limited-time item created successfully!');
  };

  const handleSubmitBulkSale = (data: BulkSaleFormData) => {
    showSuccess('Bulk sale created successfully!');
    console.log('Bulk sale data:', data);
  };

  return (
    <section>
      {/* Header */}
      <div className="sticky top-0 z-30 rounded-t-2xl bg-white shadow-sm dark:bg-[#222121]">
        <div className="mx-auto max-w-full px-6 py-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">🍽️ Menu Management</h1>

            <div className="flex flex-wrap gap-3">
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
      <div className="mx-auto max-w-full rounded-b-2xl px-6 py-8 dark:bg-[#1a1a1a]">
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
        <div className="mb-8 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5">
          {/* Now using the dynamicStats calculated from menuItems */}
          <StatsCard value={dynamicStats.totalItems} label="Total Menu Items" />
          <StatsCard value={dynamicStats.inStock} label="In Stock" />
          <StatsCard value={dynamicStats.outOfStock} label="Out of Stock" />
          <StatsCard value={dynamicStats.limitedTimeItems} label="Limited-Time Items" />
          <StatsCard value={dynamicStats.upsellItems} label="Upsell Items" />
        </div>

        {/* Tabs */}
        <div className="mb-6">
          <MenuTabs activeTab={activeTab} onTabChange={setActiveTab} itemCounts={tabCounts} />
        </div>

        {/* Toolbar */}
        <div className="mb-6 flex flex-wrap gap-3">
          <SearchBar value={searchQuery} onChange={setSearchQuery} />

          <Select value={categoryFilter} onValueChange={(value: any) => setCategoryFilter(value)}>
            <SelectTrigger className="h-11 w-[180px] border-2">
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {CATEGORY_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
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
        {sortedItems.length === 0 ? (
          <div className="py-20 text-center">
            <div className="mb-4 text-6xl opacity-30">📦</div>
            <h3 className="mb-2 text-xl font-bold text-gray-900 dark:text-gray-100">No Items Found</h3>
            <p className="mb-6 text-sm text-gray-500 dark:text-gray-500">
              {searchQuery ? 'Try adjusting your search or filters' : 'Add your first menu item to get started'}
            </p>
            <Button onClick={handleAddItem} className="font-semibold">
              + Add Menu Item
            </Button>
          </div>
        ) : (
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {sortedItems.map((item) => (
              <MenuItemCard key={item.id} item={item} onEdit={handleEditItem} onToggleStock={handleToggleStock} />
            ))}
          </div>
        )}
      </div>

      {/* Modals */}
      <AddEditItemModal isOpen={isAddEditModalOpen} onClose={() => setIsAddEditModalOpen(false)} onSubmit={handleSubmitItem} item={editingItem} />

      <LimitedTimeItemModal isOpen={isLimitedTimeModalOpen} onClose={() => setIsLimitedTimeModalOpen(false)} onSubmit={handleSubmitLimitedTime} />

      <BulkSaleModal
        isOpen={isBulkSaleModalOpen}
        onClose={() => setIsBulkSaleModalOpen(false)}
        onSubmit={handleSubmitBulkSale}
        availableItems={menuItems.filter((item) => item.isInStock)}
      />
    </section>
  );
};
