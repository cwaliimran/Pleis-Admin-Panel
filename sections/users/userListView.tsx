'use client';

import ConfirmDialog from '@/components/comfirm-dialog/confirm-dialog';
import { Button } from '@/components/ui/button';
import { useBoolean } from '@/hooks/useBoolean';
import {
  useAddUserMutation,
  useAddUserSuperAdminAndGuestMutation,
  useGetUserListQuery,
  useUpdateUserForUserListMutation,
} from '@/store/Reducer/user-list';
import { getErrorMessage } from '@/utils/api';
import { deleteFileFromAzure } from '@/utils/deleteFile';
import { uploadFileToAzure } from '@/utils/fileUpload';
import { formatDate } from '@/utils/format-time';
import { showError, showSuccess } from '@/utils/toast';
import { Plus } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import UserListTypeTable from './user-list-view/user-list-type-table';
import EditUserModal from './user-modal/custom-edit-user-modal';
import CustomUserModal from './user-modal/custom-user-modal';

interface UserListViewProps {
  usertype: string;
  memberPage?: boolean;
}

const UserListView = ({ usertype, memberPage = false }: UserListViewProps) => {
  const createModal = useBoolean();
  const editModal = useBoolean();
  const deleteModal = useBoolean();

  // Pagination and filter state
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState<string>('');
  const [role, setRole] = useState<string>('');
  const [date, setDate] = useState<Date | undefined>(undefined);

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [imageUploading, setimageUploading] = useState<boolean>(false);

  const [addUser, { isLoading: addUserLoading }] = useAddUserMutation();

  const [addUserSuperAdminAndGuest, { isLoading: addUserSuperAdminAndGuestLoading }] = useAddUserSuperAdminAndGuestMutation();
  const [updateUser, { isLoading: updateUserLoading }] = useUpdateUserForUserListMutation();

  const { data: apiData, isLoading, isFetching } = useGetUserListQuery({
    page: page - 1,
    search,
    limit,
    userType: role === 'all' ? undefined : role,
    status: status === 'all' ? undefined : status,
    date: date ? formatDate(date) : undefined,
  });

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

  const onCreateSubmit = async (formData: any) => {
    let uploadedFileKey: string | null = null;
    try {
      setimageUploading(true);
      let profileIconUrl: any = formData.profileIcon;

      if (formData.profileIcon instanceof File) {
        uploadedFileKey = await uploadFileToAzure(formData.profileIcon);
        if (!uploadedFileKey) return;
        profileIconUrl = uploadedFileKey;
      }

      const payload: any = {
        ...formData,
        profileIcon: profileIconUrl || '',
      };

      let response;
      if (payload.userType === 'admin' || payload.userType === 'guest') {
        response = await addUserSuperAdminAndGuest(payload).unwrap();
      } else {
        response = await addUser(payload).unwrap();
      }

      if (!response) {
        throw new Error('No response from server. Please try again later.');
      }

      if (response.error) {
        throw new Error(getErrorMessage(response.error));
      }

      if (response?.data) {
        setVenueTypes((prev) => [response.data, ...prev].slice(0, limit));
        setMeta((prev: any) => ({
          ...prev,
          totalRecords: prev.totalRecords + 1,
        }));
      }

      if (response?.message) {
        showSuccess(response?.message || 'Created successfully');
      }
      setimageUploading(false);
      CloseCreateModal();
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      console.log('Failed to create user:', errorMessage);
      showError(errorMessage);

      setimageUploading(false);
      if (uploadedFileKey) {
        await deleteFileFromAzure(uploadedFileKey);
      }
    } finally {
      setimageUploading(false);
    }
  };

  const handleDelete = useCallback(
    (id: string) => {
      if (!id) {
        showError('No user selected');
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
      const payload = {
        status: 'deleted',
      };

      const response = await updateUser({ id: selectedId, ...payload }).unwrap();

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

  const CloseCreateModal = () => {
    createModal.onFalse();
  };

  const handleEdit = (id: string) => {
    const userToEdit = venueTypes.find((item: any) => item?.basicInfo?._id === id);
    if (userToEdit) {
      setSelectedId(id);
      editModal.onTrue();
    } else {
      showError('User not found');
    }
  };

  return (
    <div>
      {!memberPage && (
        <div>
          <div className="flex w-full items-center justify-end">
            <Button className="cursor-pointer rounded-4xl bg-blue-700 py-2 text-white hover:bg-blue-800" onClick={createModal.onTrue}>
              <Plus />
              Create User
            </Button>
          </div>
        </div>
      )}

      <UserListTypeTable
        data={venueTypes}
        meta={meta}
        loading={isLoading || isFetching}
        handleEdit={handleEdit}
        handleDelete={handleDelete}
        onPageChange={setPage}
        userType={usertype}
        memberPage={memberPage}
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
        role={role}
        onRoleChange={(val) => {
          setRole(val);
          setPage(1);
        }}
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
          setRole('');
        }}
      />

      {createModal.value && (
        <CustomUserModal
          open={createModal.value}
          isEdit={false}
          onClose={CloseCreateModal}
          userType={usertype}
          onSubmit={onCreateSubmit}
          isLoading={addUserLoading || addUserSuperAdminAndGuestLoading || imageUploading}
          initialData={null}
        />
      )}

      {editModal.value && (
        <EditUserModal
          open={editModal.value}
          onClose={() => editModal.onFalse()}
          selectedId={selectedId}
          userData={venueTypes.find((item: any) => item?.basicInfo?._id === selectedId)}
          onUpdateSuccess={(updatedUser) => {
            setVenueTypes((prev) => prev.map((item) => (item.basicInfo?._id === selectedId ? { ...item, ...updatedUser } : item)));
            showSuccess('User updated successfully');
            editModal.onFalse();
          }}
          isLoading={false}
          userType={usertype}
        />
      )}

      <ConfirmDialog
        open={deleteModal.value}
        title="Delete User"
        content="Are you sure you want to delete this user?"
        onClose={() => {
          deleteModal.onFalse();
          setSelectedId(null);
        }}
        onConfirm={onDelete}
        isLoading={updateUserLoading}
      />
    </div>
  );
};

export default UserListView;
