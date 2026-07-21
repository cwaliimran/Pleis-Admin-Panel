'use client';

import ConfirmDialog from '@/components/comfirm-dialog/confirm-dialog';
import { Button } from '@/components/ui/button';
import { useBoolean } from '@/hooks/useBoolean';
import { formatDate } from '@/utils/format-time';
import { showSuccess } from '@/utils/toast';
import { Plus } from 'lucide-react';
import { useMemo, useState } from 'react';
import { mockBrands, mockCategories, mockMenuItemsData, mockMenus, mockPresetTypes, mockSubcategories } from './data';
import MenuItemModal from './menuItems-modal-v2';
import MenuItemTable from './menuItems-table';
import { MenuItemFormValues, MenuItemRecord } from './types';

let nextMenuItemId = mockMenuItemsData.length + 1;

const getMenuName = (id: string) => mockMenus.find((menu) => menu._id === id)?.title || '';
const getSubcategoryName = (id?: string) => mockSubcategories.find((subcategory) => subcategory._id === id)?.title || '';
const getPresetTypeName = (id: string) => mockPresetTypes.find((preset) => preset._id === id)?.label || '';

// eslint-disable-next-line @typescript-eslint/no-unused-vars -- userType kept for the route contract; will scope mock data once the v2 API lands
const MenuItemView = ({ userType }: { userType: 'organizer' | 'super-admin' }) => {
  const openModal = useBoolean();
  const editModal = useBoolean();
  const deleteModal = useBoolean();

  // TODO(v2-api): replace this local state with useGetMenuItemsQuery once the backend endpoint is ready.
  const [menuItems, setMenuItems] = useState<MenuItemRecord[]>(mockMenuItemsData);

  const menus = mockMenus;
  const categories = mockCategories;
  const subcategories = mockSubcategories;
  const presetTypes = mockPresetTypes;
  const brands = mockBrands;

  // Pagination and filter state
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState<string>('');
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [menuId, setMenuId] = useState<string>('');
  const [categoryId, setCategoryId] = useState<string>('');
  const [subcategoryId, setSubcategoryId] = useState<string>('');
  const [sortBy, setSortBy] = useState<string>('');
  const [sortOrder, setSortOrder] = useState<string>('');

  const handleSortChange = (newSortBy: string, newSortOrder: string) => {
    setSortBy(newSortBy);
    setSortOrder(newSortOrder);
    setPage(1);
  };

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [selectedRecord, setSelectedRecord] = useState<MenuItemRecord | null>(null);

  const filteredSortedMenuItems = useMemo(() => {
    let result = [...menuItems];

    if (search.trim()) {
      const term = search.trim().toLowerCase();
      result = result.filter((item) => item.title.toLowerCase().includes(term));
    }

    if (status && status !== 'all') {
      result = result.filter((item) => item.status === status);
    }

    if (date) {
      const target = formatDate(date);
      result = result.filter((item) => item.createdAt === target);
    }

    if (menuId && menuId !== 'all') {
      result = result.filter((item) => item.menuIds.includes(menuId));
    }

    if (categoryId && categoryId !== 'all') {
      result = result.filter((item) => subcategories.find((sub) => sub._id === item.subcategoryId)?.categoryId === categoryId);
    }

    if (subcategoryId && subcategoryId !== 'all') {
      result = result.filter((item) => item.subcategoryId === subcategoryId);
    }

    if (sortBy && sortOrder) {
      const direction = sortOrder === 'asc' ? 1 : -1;
      result.sort((a, b) => {
        if (sortBy === 'price') {
          return (a.price - b.price) * direction;
        }

        let aVal: string;
        let bVal: string;

        switch (sortBy) {
          case 'menuItemName':
            aVal = a.title;
            bVal = b.title;
            break;
          case 'menuName':
            aVal = getMenuName(a.menuIds[0]);
            bVal = getMenuName(b.menuIds[0]);
            break;
          case 'subcategory':
            aVal = getSubcategoryName(a.subcategoryId);
            bVal = getSubcategoryName(b.subcategoryId);
            break;
          case 'type':
            aVal = getPresetTypeName(a.presetTypeId);
            bVal = getPresetTypeName(b.presetTypeId);
            break;
          case 'serving':
            aVal = a.serving || '';
            bVal = b.serving || '';
            break;
          default:
            aVal = '';
            bVal = '';
        }

        return aVal.localeCompare(bVal) * direction;
      });
    }

    return result;
  }, [menuItems, search, status, date, menuId, categoryId, subcategoryId, sortBy, sortOrder, subcategories]);

  const totalRecords = filteredSortedMenuItems.length;
  const totalPages = Math.max(1, Math.ceil(totalRecords / limit));
  const paginatedMenuItems = filteredSortedMenuItems.slice((page - 1) * limit, page * limit);

  const meta = {
    currentPage: page,
    totalPages,
    totalRecords,
    limit,
  };

  const handleCreateNew = () => {
    setSelectedRecord(null);
    setSelectedId(null);
    editModal.onFalse();
    openModal.onTrue();
  };

  const handleEdit = (id: string) => {
    const selectedData = menuItems.find((item) => item._id === id) || null;
    setSelectedId(id);
    setSelectedRecord(selectedData);
    editModal.onTrue();
    openModal.onTrue();
  };

  const handleDelete = (id: string) => {
    setSelectedId(id);
    deleteModal.onTrue();
  };

  const onDelete = () => {
    setMenuItems((prev) => prev.filter((item) => item._id !== selectedId));
    showSuccess('Menu item deleted successfully');
    setSelectedId(null);
    deleteModal.onFalse();
  };

  const onMenuItemSubmit = (values: MenuItemFormValues) => {
    const record: Omit<MenuItemRecord, '_id' | 'createdAt'> = {
      title: values.title,
      amount: values.amount || undefined,
      image: typeof values.image === 'string' ? values.image : undefined,
      presetTypeId: values.presetTypeId,
      brandId: values.brandId,
      subcategoryId: values.subcategoryId,
      menuIds: values.menuIds,
      description: values.description || undefined,
      quantityType: values.quantityType,
      comboItemIds: values.quantityType === 'combo' ? values.comboItemIds : undefined,
      serving: values.serving,
      price: Number(values.price),
      taxPercent: Number(values.taxPercent),
      availableDays: values.availableDays,
      daypart: values.daypart,
      dietTags: values.dietTags,
      allergens: values.allergens,
      cuisine: values.cuisine || undefined,
      isRecommended: values.isRecommended,
      isUpsell: values.isUpsell,
      isToGo: values.isToGo,
      requiresConfirmation: values.requiresConfirmation,
      status: values.status,
    };

    if (editModal.value && selectedId) {
      setMenuItems((prev) => prev.map((item) => (item._id === selectedId ? { ...item, ...record } : item)));
      showSuccess('Menu item updated successfully');
    } else {
      setMenuItems((prev) => [{ ...record, _id: `item-${nextMenuItemId++}`, createdAt: formatDate(new Date())! }, ...prev]);
      showSuccess('Menu item created successfully');
    }
  };

  return (
    <div>
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-2xl font-semibold">Menu Items</h2>
          <p className="text-muted-foreground text-sm">All items across all menus for this venue.</p>
        </div>

        <Button className="bg-primary hover:bg-primary cursor-pointer rounded-4xl py-2 text-white" onClick={handleCreateNew}>
          <Plus />
          Create Menu Item
        </Button>
      </div>

      <MenuItemTable
        data={paginatedMenuItems}
        meta={meta}
        menus={menus}
        categories={categories}
        subcategories={subcategories}
        presetTypes={presetTypes}
        allItems={menuItems}
        handleDelete={handleDelete}
        handleEdit={handleEdit}
        onPageChange={setPage}
        onLimitChange={(l) => {
          setLimit(l);
          setPage(1);
        }}
        onSearch={(val) => {
          setSearch(val);
          setPage(1);
        }}
        search={search}
        limit={limit}
        page={page}
        status={status}
        onStatusChange={(val) => {
          setStatus(val);
          setPage(1);
        }}
        date={date}
        onDateChange={(val) => {
          setDate(val);
          setPage(1);
        }}
        menuId={menuId}
        onMenuChange={(val) => {
          setMenuId(val);
          setPage(1);
        }}
        categoryId={categoryId}
        onCategoryChange={(val) => {
          setCategoryId(val);
          setSubcategoryId('');
          setPage(1);
        }}
        subcategoryId={subcategoryId}
        onSubcategoryChange={(val) => {
          setSubcategoryId(val);
          setPage(1);
        }}
        sortBy={sortBy}
        sortOrder={sortOrder}
        onSortChange={handleSortChange}
        onResetFilters={() => {
          setStatus('');
          setDate(undefined);
          setSearch('');
          setMenuId('');
          setCategoryId('');
          setSubcategoryId('');
          setSortBy('');
          setSortOrder('');
          setPage(1);
        }}
      />

      {openModal.value && (
        <MenuItemModal
          open={openModal.value}
          onClose={openModal.onFalse}
          isEdit={editModal.value}
          selectedData={selectedRecord}
          menus={menus}
          subcategories={subcategories}
          presetTypes={presetTypes}
          brands={brands}
          allItems={menuItems}
          onSubmit={onMenuItemSubmit}
        />
      )}

      <ConfirmDialog
        open={deleteModal.value}
        title="Delete Menu Item"
        content="Are you sure you want to delete this menu item?"
        onClose={() => {
          deleteModal.onFalse();
          setSelectedId(null);
        }}
        onConfirm={onDelete}
      />
    </div>
  );
};

export default MenuItemView;
