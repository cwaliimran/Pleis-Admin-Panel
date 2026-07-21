'use client';

import ConfirmDialog from '@/components/comfirm-dialog/confirm-dialog';
import { Button } from '@/components/ui/button';
import { useBoolean } from '@/hooks/useBoolean';
import { formatDate } from '@/utils/format-time';
import { showSuccess } from '@/utils/toast';
import { Plus } from 'lucide-react';
import { useMemo, useState } from 'react';
import { mockMenuListData, mockOrganizations } from './data';
import DuplicateMenuModal from './duplicate-menu-modal';
import MenuItemModal from './menulist-modal';
import MenuItemTable from './menulist-table';
import { MenuItemFormValues, MenuListItem } from './types';

type MenuListViewProps = {
  userType: 'super-admin' | 'organizer';
};

let nextMenuId = mockMenuListData.length + 1;

const getOrganizationName = (id: string) => mockOrganizations.find((org) => org._id === id)?.name || '';

// eslint-disable-next-line @typescript-eslint/no-unused-vars -- userType kept for the route contract; will scope mock data once the v2 API lands
const MenuListView = ({ userType }: MenuListViewProps) => {
  const openModal = useBoolean();
  const duplicateModal = useBoolean();
  const editModal = useBoolean();
  const deleteModal = useBoolean();

  // TODO(v2-api): replace this local state with useGetMenuListQuery once the backend endpoint is ready.
  const [menus, setMenus] = useState<MenuListItem[]>(mockMenuListData);

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState<string>('');
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [sortBy, setSortBy] = useState<string>('');
  const [sortOrder, setSortOrder] = useState<string>('');

  const handleSortChange = (newSortBy: string, newSortOrder: string) => {
    setSortBy(newSortBy);
    setSortOrder(newSortOrder);
    setPage(1);
  };

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [selectedRecord, setSelectedRecord] = useState<MenuListItem | null>(null);

  const organizations = mockOrganizations;

  const filteredSortedMenus = useMemo(() => {
    let result = [...menus];

    if (search.trim()) {
      const term = search.trim().toLowerCase();
      result = result.filter(
        (menu) =>
          menu.title.toLowerCase().includes(term) ||
          menu.description?.toLowerCase().includes(term) ||
          menu.organizations.some((orgId) => getOrganizationName(orgId).toLowerCase().includes(term))
      );
    }

    if (status && status !== 'all') {
      result = result.filter((menu) => menu.status === status);
    }

    if (date) {
      const target = formatDate(date);
      result = result.filter((menu) => menu.createdAt === target);
    }

    if (sortBy && sortOrder) {
      const direction = sortOrder === 'asc' ? 1 : -1;
      result.sort((a, b) => {
        let aVal: string;
        let bVal: string;

        switch (sortBy) {
          case 'menuName':
            aVal = a.title;
            bVal = b.title;
            break;
          case 'description':
            aVal = a.description || '';
            bVal = b.description || '';
            break;
          case 'organizationName':
            aVal = getOrganizationName(a.organizations[0]);
            bVal = getOrganizationName(b.organizations[0]);
            break;
          case 'validFrom':
            aVal = a.validFrom;
            bVal = b.validFrom;
            break;
          case 'createdAt':
            aVal = a.createdAt;
            bVal = b.createdAt;
            break;
          default:
            aVal = '';
            bVal = '';
        }

        return aVal.localeCompare(bVal) * direction;
      });
    }

    return result;
  }, [menus, search, status, date, sortBy, sortOrder]);

  const totalRecords = filteredSortedMenus.length;
  const totalPages = Math.max(1, Math.ceil(totalRecords / limit));
  const paginatedMenus = filteredSortedMenus.slice((page - 1) * limit, page * limit);

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

  const handleDuplicate = (id: string) => {
    setSelectedId(id);
    duplicateModal.onTrue();
  };

  const handleEdit = (id: string) => {
    const selectedData = menus.find((item) => item._id === id) || null;
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
    setMenus((prev) => prev.filter((menu) => menu._id !== selectedId));
    showSuccess('Menu deleted successfully');
    setSelectedId(null);
    deleteModal.onFalse();
  };

  const onMenuSubmit = (values: MenuItemFormValues) => {
    if (editModal.value && selectedId) {
      setMenus((prev) =>
        prev.map((menu) =>
          menu._id === selectedId
            ? {
                ...menu,
                title: values.title || menu.title,
                description: values.description,
                organizations: values.organizations || [],
                validFrom: values.validFrom ? formatDate(values.validFrom)! : menu.validFrom,
                status: values.status || menu.status,
              }
            : menu
        )
      );
      showSuccess('Menu updated successfully');
    } else {
      const newMenu: MenuListItem = {
        _id: `menu-${nextMenuId++}`,
        title: values.title || '',
        description: values.description,
        organizations: values.organizations || [],
        validFrom: values.validFrom ? formatDate(values.validFrom)! : formatDate(new Date())!,
        status: values.status || 'draft',
        createdAt: formatDate(new Date())!,
      };
      setMenus((prev) => [newMenu, ...prev]);
      showSuccess('Menu created successfully');
    }
  };

  const onDuplicateSubmit = (organizationId: string) => {
    const source = menus.find((menu) => menu._id === selectedId);
    if (!source) return;

    const newMenu: MenuListItem = {
      ...source,
      _id: `menu-${nextMenuId++}`,
      title: `${source.title} (Copy)`,
      organizations: [organizationId],
      status: 'draft',
      createdAt: formatDate(new Date())!,
    };
    setMenus((prev) => [newMenu, ...prev]);
    showSuccess('Menu duplicated successfully');
  };

  return (
    <div>
      <div>
        <div className="mt-3 flex w-full items-center justify-end gap-x-3 md:mt-0">
          <Button className="bg-primary hover:bg-primary cursor-pointer rounded-4xl py-2 text-white" onClick={handleCreateNew}>
            <Plus />
            Create Menu
          </Button>
        </div>
      </div>

      <MenuItemTable
        data={paginatedMenus}
        meta={meta}
        organizations={organizations}
        handleDelete={handleDelete}
        handleEdit={handleEdit}
        handleDuplicate={handleDuplicate}
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
        sortBy={sortBy}
        sortOrder={sortOrder}
        onSortChange={handleSortChange}
        onResetFilters={() => {
          setStatus('');
          setDate(undefined);
          setSearch('');
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
          organizations={organizations}
          onSubmit={onMenuSubmit}
        />
      )}

      {duplicateModal.value && (
        <DuplicateMenuModal
          open={duplicateModal.value}
          onClose={duplicateModal.onFalse}
          selectedId={selectedId}
          organizations={organizations}
          onSubmit={onDuplicateSubmit}
        />
      )}

      <ConfirmDialog
        open={deleteModal.value}
        title="Delete Menu"
        content="Are you sure you want to delete this menu?"
        onClose={() => {
          deleteModal.onFalse();
          setSelectedId(null);
        }}
        onConfirm={onDelete}
      />
    </div>
  );
};

export default MenuListView;
