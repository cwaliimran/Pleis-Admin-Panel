'use client';

import { useCompanySelection } from '@/app/common/header/company-selection-storage';
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
import { useCallback, useEffect, useMemo, useState } from 'react';
import DuplicateMenuModal from './duplicate-menu-modal';
import MenuItemModal from './menulist-modal';
import MenuItemTable from './menulist-table';

type MenuListViewProps = {
  userType: 'super-admin' | 'organizer';
};

const MenuListView = ({ userType }: MenuListViewProps) => {
  const openModal = useBoolean();
  const duplicateModal = useBoolean();
  const editModal = useBoolean();
  const deleteModal = useBoolean();

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
  const [selectedRecord, setSelectedRecord] = useState<any>(null);

  const { organizerOrganizationIds } = useCompanySelection();

  const [deleteMenuList, { isLoading: deleteLoading }] = useDeleteMenuListMutation();

  const { companyId: selectedCompany } = useCompanySelectionState();

  const {
    data: apiData,
    isLoading,
    isFetching,
  } = useGetMenuListQuery({
    page: page - 1,
    search,
    limit,
    status: status === 'all' ? '' : status,
    date: date ? formatDate(date) : undefined,
    companyOrganizer: selectedCompany || undefined,
    organizations: userType === 'organizer' ? organizerOrganizationIds : undefined,
    sortBy: sortBy || undefined,
    sortOrder: sortOrder || undefined,
  });

  // Fetch organization list
  const {
    data: organizationResponse,
    isLoading: organizationLoading,
    isFetching: organizationFetching,
  } = useGetOrganizationByCompanyQuery(
    {
      companyOrganizer: selectedCompany || undefined,
    },
    {
      skip: !selectedCompany,
    }
  );

  // Fetch organizer organizations
  const { data: organizerOrganizationsResponse } = useGetOrganizationsOnOrganizerSideQuery(
    {},
    {
      skip: userType !== 'organizer',
    }
  );

  // Admin
  const organizationOptions = useMemo(
    () =>
      organizationResponse?.data?.map((organization: any) => ({
        label: organization?.basicInfo?.name || 'Unknown Organization',
        value: organization?._id,
      })) || [],
    [organizationResponse]
  );

  // Organizer
  const organizerOrganizationOptions = useMemo(
    () =>
      organizerOrganizationsResponse?.data?.map((organization: any) => ({
        label: organization?.title || 'Unknown Organization',
        value: organization?._id,
      })) || [],
    [organizerOrganizationsResponse]
  );

  const [localData, setLocalData] = useState<any[]>([]);

  const [meta, setMeta] = useState<any>({
    currentPage: page,
    totalPages: 1,
    totalRecords: 0,
    limit,
  });

  useEffect(() => {
    if (apiData?.data) {
      setLocalData(apiData.data);
      setMeta(
        apiData.meta || {
          currentPage: page,
          totalPages: 1,
          totalRecords: 0,
          limit,
        }
      );
    }
  }, [apiData, page, limit]);

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

  // ------------ EDIT FUNCTION FOR API VERSION ------------
  const handleEdit = (id: string) => {
    const selectedData = localData?.find((item: any) => item?._id === id);

    if (selectedData) {
      setSelectedId(id);
      setSelectedRecord(selectedData);
      editModal.onTrue();
      openModal.onTrue();
    } else {
      showError('Reward not found');
    }
  };

  const handleDelete = useCallback(
    (id: string) => {
      if (!id) {
        showError('No menu item selected');
        return;
      }

      setSelectedId(id);
      deleteModal.onTrue();
    },
    [deleteModal]
  );

  // DELETE CALL
  const onDelete = async () => {
    try {
      const response = await deleteMenuList(selectedId).unwrap();

      if (response?.error) {
        const errorMessage = getErrorMessage(response.error);
        showError(errorMessage);
        return;
      }

      showSuccess(response?.message || 'Deleted successfully');

      setSelectedId(null);
      deleteModal.onFalse();
    } catch (error) {
      showError(getErrorMessage(error));
    }
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
        data={localData}
        meta={meta}
        loading={isLoading || isFetching}
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
          selectedCompany={selectedCompany}
          selectedData={selectedRecord}
          userType={userType}
        />
      )}

      {duplicateModal.value && (
        <DuplicateMenuModal
          open={duplicateModal.value}
          onClose={duplicateModal.onFalse}
          selectedId={selectedId}
          // data={organizerOrganizationOptions}
          data={userType === 'organizer' ? organizerOrganizationOptions : organizationOptions}
          isLoading={organizationLoading || organizationFetching}
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
        isLoading={deleteLoading}
      />
    </div>
  );
};

export default MenuListView;
