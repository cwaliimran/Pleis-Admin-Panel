'use client';

import { useCompanySelection } from '@/app/common/header/company-selection-storage';
import ConfirmDialog from '@/components/comfirm-dialog/confirm-dialog';
import { Button } from '@/components/ui/button';
import { useBoolean } from '@/hooks/useBoolean';
import { useCompanySelectionState } from '@/hooks/useCompanySelectionState';
import { useGetMenuItemSubcategoriesQuery } from '@/store/Reducer/menu-item-subcategories-api';
import { useDeleteMenuItemMutation, useGetMenuItemsQuery } from '@/store/Reducer/menu-items-api';
import { useGetMenuListQuery } from '@/store/Reducer/menu-list-api';
import { useGetServingsQuery } from '@/store/Reducer/serving-api';
import { getErrorMessage } from '@/utils/api';
import { formatDate } from '@/utils/format-time';
import { showError, showSuccess } from '@/utils/toast';
import { Plus } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import MenuItemModal from './menuItems-modal-v2';
import MenuItemTable from './menuItems-table';
import { formatServingLabel } from './menuItems-utils';
import { MenuItemLookups, MenuItemRecord } from './types';

const LOOKUP_FETCH_LIMIT = 1000;

const toLookupMap = (items: { _id: string; name?: string; title?: string; type?: string }[] = []) =>
  new Map(items.map((item) => [item._id, item.name || item.title || item.type || '']));

const toServingLookupMap = (items: { _id: string; type?: string; code?: string; unit?: string; level2?: string }[] = []) =>
  new Map(items.map((item) => [item._id, formatServingLabel(item)]));

const MenuItemView = ({ userType }: { userType: 'organizer' | 'super-admin' }) => {
  const openModal = useBoolean();
  const editModal = useBoolean();
  const deleteModal = useBoolean();

  const { companyId } = useCompanySelectionState();
  const scopedCompanyId = userType === 'super-admin' ? companyId : undefined;
  const companySkip = userType === 'super-admin' && !companyId;

  const { organizerOrganizationIds } = useCompanySelection();
  const scopedOrganizations = userType === 'organizer' && organizerOrganizationIds.length > 0 ? organizerOrganizationIds : undefined;

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState<string>('');
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [menuId, setMenuId] = useState<string>('');
  const [subCategoryId, setSubCategoryId] = useState<string>('');
  const [sortBy, setSortBy] = useState<string>('');
  const [sortOrder, setSortOrder] = useState<string>('');

  const handleSortChange = (newSortBy: string, newSortOrder: string) => {
    setSortBy(newSortBy);
    setSortOrder(newSortOrder);
    setPage(1);
  };

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [selectedRecord, setSelectedRecord] = useState<MenuItemRecord | null>(null);

  const headerOrganizationsKey = organizerOrganizationIds.join(',');
  useEffect(() => {
    if (userType !== 'organizer') return;
    setPage(1);
  }, [headerOrganizationsKey, userType]);

  const { data, isLoading, isFetching } = useGetMenuItemsQuery(
    {
      page: page - 1,
      limit,
      search,
      status: !status || status === 'all' ? undefined : status,
      date: date ? formatDate(date) : undefined,
      menu: !menuId || menuId === 'all' ? undefined : menuId,
      subCategory: !subCategoryId || subCategoryId === 'all' ? undefined : subCategoryId,
      organizations: scopedOrganizations,
      companyOrganizer: scopedCompanyId,
      sortBy,
      sortOrder,
    },
    { skip: companySkip }
  );

  const [deleteMenuItem, { isLoading: deleteLoading }] = useDeleteMenuItemMutation();

  const menuItems: MenuItemRecord[] = data?.data || [];
  const meta = data?.meta || { currentPage: page, totalPages: 1, totalRecords: 0, limit };

  const { data: menusData } = useGetMenuListQuery(
    { page: 0, limit: LOOKUP_FETCH_LIMIT, search: '', status: '', companyOrganizer: scopedCompanyId },
    { skip: companySkip }
  );
  const { data: servingsData } = useGetServingsQuery({ page: 0, limit: LOOKUP_FETCH_LIMIT, search: '', summary: true });

  // Unfiltered by status on purpose: an item pointing at a since-deactivated subcategory still has
  // to render its name in the table.
  const { data: subCategoriesData } = useGetMenuItemSubcategoriesQuery(
    { page: 0, limit: LOOKUP_FETCH_LIMIT, search: '', companyOrganizer: scopedCompanyId },
    { skip: companySkip }
  );

  const menus = menusData?.data || [];
  const subCategories = subCategoriesData?.data || [];

  const lookups: MenuItemLookups = useMemo(
    () => ({
      subCategories: toLookupMap(subCategoriesData?.data),
      menus: toLookupMap(menusData?.data),
      servingSizes: toServingLookupMap(servingsData?.data),
    }),
    [subCategoriesData, menusData, servingsData]
  );

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

  const onDelete = async () => {
    try {
      await deleteMenuItem(selectedId).unwrap();
      showSuccess('Menu item deleted successfully');
      setSelectedId(null);
      deleteModal.onFalse();
    } catch (error) {
      showError(getErrorMessage(error));
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
        data={menuItems}
        meta={meta}
        lookups={lookups}
        menus={menus}
        subCategories={subCategories}
        loading={isLoading || isFetching}
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
        subCategoryId={subCategoryId}
        onSubCategoryChange={(val) => {
          setSubCategoryId(val);
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
          setSubCategoryId('');
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
          companyId={scopedCompanyId}
          userType={userType}
          lookups={lookups}
        />
      )}

      <ConfirmDialog
        open={deleteModal.value}
        title="Delete Menu Item"
        content="Are you sure you want to delete this menu item?"
        isLoading={deleteLoading}
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
