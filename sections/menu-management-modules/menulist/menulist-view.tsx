'use client';

import ConfirmDialog from '@/components/comfirm-dialog/confirm-dialog';
import { Button } from '@/components/ui/button';
import { useBoolean } from '@/hooks/useBoolean';
import { useCompanySelectionState } from '@/hooks/useCompanySelectionState';
import { useDeleteMenuListMutation, useGetMenuListQuery } from '@/store/Reducer/menu-list-api';
import { useGetOrganizationByCompanyQuery, useGetOrganizationsOnOrganizerSideQuery } from '@/store/Reducer/organization';
import { getErrorMessage } from '@/utils/api';
import { formatDate } from '@/utils/format-time';
import { showError, showSuccess } from '@/utils/toast';
import { Plus } from 'lucide-react';
import { useMemo, useState } from 'react';
import DuplicateMenuModal from './duplicate-menu-modal';
import MenuItemModal from './menulist-modal';
import MenuItemTable from './menulist-table';
import { MenuListItem, MenuOrganization } from './types';

type MenuListViewProps = {
  userType: 'super-admin' | 'organizer';
};

const MenuListView = ({ userType }: MenuListViewProps) => {
  const openModal = useBoolean();
  const duplicateModal = useBoolean();
  const editModal = useBoolean();
  const deleteModal = useBoolean();

  const { companyId } = useCompanySelectionState();
  // Organizer requests are scoped to the logged-in organizer's own company server-side;
  // only super-admin needs the header's selected company sent explicitly.
  const scopedCompanyId = userType === 'super-admin' ? companyId : undefined;
  const companySkip = userType === 'super-admin' && !companyId;

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState<string>('');
  const [organization, setOrganization] = useState<string>('');
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

  const { data, isLoading, isFetching } = useGetMenuListQuery(
    {
      page: page - 1,
      limit,
      search,
      status: !status || status === 'all' ? undefined : status,
      organizations: !organization || organization === 'all' ? undefined : organization,
      date: date ? formatDate(date) : undefined,
      companyOrganizer: scopedCompanyId,
      sortBy,
      sortOrder,
    },
    { skip: companySkip }
  );

  // Organizations belonging to the selected company (super-admin) or the organizer's own
  // organizations — used both to populate the create/edit/duplicate dropdowns and to resolve
  // the organization name shown in the table.
  const { data: adminOrganizationsData, isFetching: adminOrgFetching } = useGetOrganizationByCompanyQuery(
    { companyOrganizer: companyId },
    { skip: userType !== 'super-admin' || !companyId }
  );
  const { data: organizerOrganizationsData, isFetching: organizerOrgFetching } = useGetOrganizationsOnOrganizerSideQuery(
    {},
    { skip: userType !== 'organizer' }
  );

  const organizationsFetching = userType === 'super-admin' ? adminOrgFetching : organizerOrgFetching;

  const organizations: MenuOrganization[] = useMemo(() => {
    const raw = (userType === 'super-admin' ? adminOrganizationsData?.data : organizerOrganizationsData?.data) || [];
    return raw.map((org: any) => ({
      _id: org._id,
      name: org?.basicInfo?.name || org?.title || org?.name || 'Unknown Organization',
    }));
  }, [userType, adminOrganizationsData, organizerOrganizationsData]);

  const [deleteMenuList, { isLoading: deleteLoading }] = useDeleteMenuListMutation();

  const menus: MenuListItem[] = data?.data || [];
  const meta = data?.meta || { currentPage: page, totalPages: 1, totalRecords: 0, limit };

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

  const onDelete = async () => {
    try {
      await deleteMenuList(selectedId).unwrap();
      showSuccess('Menu deleted successfully');
      setSelectedId(null);
      deleteModal.onFalse();
    } catch (error) {
      showError(getErrorMessage(error));
    }
  };

  if (companySkip) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="text-center">
          <div className="mb-4 text-6xl opacity-30">🏢</div>
          <h3 className="mb-2 text-xl font-bold text-gray-900 dark:text-gray-100">No Company Selected</h3>
          <p className="text-sm text-gray-500 dark:text-gray-500">Please select a company from the dropdown above to manage its menus</p>
        </div>
      </div>
    );
  }

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
        data={menus}
        meta={meta}
        loading={isLoading || isFetching}
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
        organization={organization}
        onOrganizationChange={(val) => {
          setOrganization(val);
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
          setOrganization('');
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
          organizationsLoading={organizationsFetching}
          companyId={scopedCompanyId}
          userType={userType}
        />
      )}

      {duplicateModal.value && (
        <DuplicateMenuModal
          open={duplicateModal.value}
          onClose={duplicateModal.onFalse}
          selectedId={selectedId}
          organizations={organizations}
          organizationsLoading={organizationsFetching}
          companyId={scopedCompanyId}
          userType={userType}
        />
      )}

      <ConfirmDialog
        open={deleteModal.value}
        title="Delete Menu"
        content="Are you sure you want to delete this menu?"
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

export default MenuListView;
