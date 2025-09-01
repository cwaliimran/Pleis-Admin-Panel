'use client';

// import ConfirmDialog from '@/components/comfirm-dialog/confirm-dialog';
import { Button } from '@/components/ui/button';
import { useBoolean } from '@/hooks/useBoolean';
// import { UserTable } from '@/sections/users';
import { Plus } from 'lucide-react';
// import UserModal from './UserModal';
import { formatDate } from '@/utils/format-time';
import {
  useAddUserMutation,
  useAddUserSuperAdminAndGuestMutation,
  useGetUserListQuery,
} from '@/store/Reducer/user-list';
import { useEffect, useState } from 'react';
import UserListTypeTable from './user-list-view/user-list-type-table';
import CustomUserModal from './user-list-view/user-create-modal/roleConfigs';
import { showError, showSuccess } from '@/utils/toast';
import { getErrorMessage } from '@/utils/api';

const UserListView = ({ usertype }: { usertype: any }) => {
  const openModal = useBoolean();
  const editModal = useBoolean();
  const deleteModal = useBoolean();

  // Pagination and filter state
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState<string>('');
  const [date, setDate] = useState<Date | undefined>(undefined);

  // const [selectedId, setSelectedId] = useState<string | null>(null);
  // const [selectedVenueType, setSelectedVenueType] = useState<any>(null);
  const [imageUploading, setImageUploading] = useState(false);

  const [addUser, { isLoading: addUserLoading }] = useAddUserMutation();
  const [
    addUserSuperAdminAndGuest,
    { isLoading: addUserSuperAdminAndGuestLoading },
  ] = useAddUserSuperAdminAndGuestMutation();

  const { data: apiData, isLoading } = useGetUserListQuery({
    page: page - 1,
    search,
    limit,
    status: status === 'all' ? undefined : status,
    date: date ? formatDate(date) : undefined,
  });

  // Local state for venue types and meta
  const [venueTypes, setVenueTypes] = useState<any[]>([]);
  const [meta, setMeta] = useState<any>({
    currentPage: page,
    totalPages: 1,
    totalRecords: 0,
    limit,
  });

  useEffect(() => {
    if (apiData?.data) {
      setVenueTypes(apiData.data);
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

  // CREATE/UPDATE USER
  const onSubmit = async (formData: any) => {
    try {
      console.log('formData', formData);
      // Call API
      let response;
      if (formData?.userType === 'admin' || formData?.userType === 'guest') {
        response = await addUserSuperAdminAndGuest(formData).unwrap();
      } else {
        response = await addUser(formData).unwrap();
      }

      if (!response) {
        showError('No response from server. Please try again later.');
        return;
      }

      if (response.error) {
        const errorMessage = getErrorMessage(response.error);
        showError(errorMessage);
        return;
      }

      // Success
      if (response?.data) {
        setVenueTypes((prev) => [response.data, ...prev].slice(0, limit));
        setMeta((prev: any) => ({
          ...prev,
          totalRecords: prev.totalRecords + 1,
        }));
      }

      if (response?.message) {
        showSuccess(response?.message || `Created successfully`);
      }

      CloseModal();
    } catch (error) {
      setImageUploading(false);
      const errorMessage = getErrorMessage(error);
      console.log('Failed to save user:', errorMessage);
      showError(errorMessage);
    }
  };

  const CloseModal = () => {
    openModal.onFalse();
    editModal.onFalse();
  };

  const handleEdit = (id: string) => {
    console.log('id', id);
    openModal.onTrue();
    editModal.onTrue();
  };

  const handleDelete = (id: string) => {
    console.log('id', id);
    deleteModal.onTrue();
  };

  // const onDelete = () => {
  //   deleteModal.onFalse();
  // };

  return (
    <div>
      <div>
        <div className="flex w-full items-center justify-end">
          <Button
            className="cursor-pointer rounded-4xl bg-blue-700 py-2 text-white hover:bg-blue-800"
            onClick={openModal.onTrue}
          >
            <Plus />
            Create User
          </Button>
        </div>
      </div>

      <UserListTypeTable
        data={venueTypes}
        meta={meta}
        loading={isLoading}
        handleDelete={handleDelete}
        handleEdit={handleEdit}
        onPageChange={setPage}
        userType={usertype}
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
        onResetFilters={() => {
          setStatus('');
          setDate(undefined);
          setSearch('');
          setPage(1);
        }}
      />

      {/* <UserTable
        handleDelete={handleDelete}
        handleEdit={handleEdit}
        pendingUser={false}
        userType={usertype}
      /> */}

      <CustomUserModal
        open={openModal.value}
        isEdit={editModal.value}
        onClose={CloseModal}
        userType={usertype}
        onSubmit={onSubmit}
        isLoading={
          addUserLoading || imageUploading || addUserSuperAdminAndGuestLoading
        }
      />

      {/* <UserModal
        open={openModal.value}
        isEdit={editModal.value}
        onClose={CloseModal}
        onSubmit={onSubmit}
        userType={usertype}
      /> */}

      {/* <ConfirmDialog
        open={deleteModal.value}
        title="Delete User"
        content="Are you sure you want to delete this?"
        onClose={deleteModal.onFalse}
        onConfirm={onDelete}
      /> */}
    </div>
  );
};

export default UserListView;
