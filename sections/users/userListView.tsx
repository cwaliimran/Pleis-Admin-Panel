'use client';

import { Button } from '@/components/ui/button';
import { useBoolean } from '@/hooks/useBoolean';
import { Plus } from 'lucide-react';
import { formatDate } from '@/utils/format-time';
import {
  useAddUserMutation,
  useAddUserSuperAdminAndGuestMutation,
  useGetUserListQuery,
} from '@/store/Reducer/user-list';
import { useEffect, useState } from 'react';
import UserListTypeTable from './user-list-view/user-list-type-table';
import { showError, showSuccess } from '@/utils/toast';
import { getErrorMessage } from '@/utils/api';
import CustomUserModal from './user-modal/custom-user-modal';
import { uploadFileToAzure } from '@/utils/fileUpload';
import { deleteFileFromAzure } from '@/utils/deleteFile';

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

  const [imageUploading, setImageUploading] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null); // Track selected user ID for edit

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

  // Handle image upload
  const handleImageUpload = async (file: File) => {
    setImageUploading(true);
    try {
      const url = await uploadFileToAzure(file);
      return url;
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      showError(errorMessage);
      return null;
    } finally {
      setImageUploading(false);
    }
  };

  const onSubmit = async (formData: any) => {
    console.log('formData', formData);

    let uploadedFileKey: string | null = null;
    try {
      let profileIconUrl: any = formData.profileIcon;

      // Upload new image if provided
      if (formData.profileIcon instanceof File) {
        uploadedFileKey = await uploadFileToAzure(formData.profileIcon);
        if (!uploadedFileKey) return; 
        profileIconUrl = uploadedFileKey;
      }

      const payload: any = {
        ...formData,
        profileIcon:
          profileIconUrl ||
          (editModal.value && typeof formData.profileIcon === 'string'
            ? formData.profileIcon
            : ''),
      };

      if (editModal.value && selectedId) {
        payload.id = selectedId;
      }

      console.log('Submitted payload:', payload);

      // Call API
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

      // --- SUCCESS HANDLING ---
      if (response?.data) {
        if (editModal.value && selectedId) {
          setVenueTypes((prev) =>
            prev.map((item) =>
              item._id === selectedId ? { ...item, ...response.data } : item
            )
          );
        } else {
          setVenueTypes((prev) => [response.data, ...prev].slice(0, limit));
          setMeta((prev: any) => ({
            ...prev,
            totalRecords: prev.totalRecords + 1,
          }));
        }
      }

      if (response?.message) {
        showSuccess(
          response?.message ||
          (editModal.value ? 'Updated successfully' : 'Created successfully')
        );
      }

      CloseModal();
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      console.log('Failed to save user:', errorMessage);
      showError(errorMessage);

      // ⚠️ rollback uploaded image if API failed
      if (uploadedFileKey) {
        console.log('Rolling back uploaded image:', uploadedFileKey);
        await deleteFileFromAzure(uploadedFileKey);
      }
    }
  };

  // const onSubmit = async (formData: any) => {
  //   console.log('formData', formData);

  //   try {
  //     let profileIconUrl: any = formData.profileIcon;

  //     // Check and upload image if a new file is provided
  //     if (formData.profileIcon instanceof File) {
  //       profileIconUrl = await handleImageUpload(formData.profileIcon);
  //       if (!profileIconUrl) return; // Stop if upload failed
  //     }

  //     const payload: any = {
  //       ...formData,
  //       profileIcon: profileIconUrl || (editModal.value && typeof formData.profileIcon === 'string' ? formData.profileIcon : ''),
  //     };

  //     // Include id for edit mode
  //     if (editModal.value && selectedId) {
  //       payload.id = selectedId;
  //     }

  //     console.log('Submitted payload:', payload);

  //     // Call API
  //     let response;
  //     if (payload.userType === 'admin' || payload.userType === 'guest') {
  //       response = editModal.value && selectedId
  //         ? await addUserSuperAdminAndGuest(payload).unwrap() // Assuming update uses the same mutation
  //         : await addUserSuperAdminAndGuest(payload).unwrap();
  //     } else {
  //       response = editModal.value && selectedId
  //         ? await addUser(payload).unwrap() // Assuming update uses the same mutation
  //         : await addUser(payload).unwrap();
  //     }

  //     if (!response) {
  //       showError('No response from server. Please try again later.');
  //       return;
  //     }

  //     if (response.error) {
  //       const errorMessage = getErrorMessage(response.error);
  //       showError(errorMessage);
  //       return;
  //     }

  //     // Success
  //     if (response?.data) {
  //       if (editModal.value && selectedId) {
  //         // Update existing user in local state
  //         setVenueTypes((prev) =>
  //           prev.map((item) =>
  //             item._id === selectedId ? { ...item, ...response.data } : item
  //           )
  //         );
  //       } else {
  //         // Add new user to local state
  //         setVenueTypes((prev) => [response.data, ...prev].slice(0, limit));
  //         setMeta((prev: any) => ({
  //           ...prev,
  //           totalRecords: prev.totalRecords + 1,
  //         }));
  //       }
  //     }

  //     if (response?.message) {
  //       showSuccess(response?.message || (editModal.value ? 'Updated successfully' : 'Created successfully'));
  //     }

  //     CloseModal();
  //   } catch (error) {
  //     const errorMessage = getErrorMessage(error);
  //     console.log('Failed to save user:', errorMessage);
  //     showError(errorMessage);
  //   }
  // };

  const CloseModal = () => {
    openModal.onFalse();
    editModal.onFalse();
    setSelectedId(null); // Reset selected ID
  };

  const handleEdit = (id: string) => {
    const userToEdit = venueTypes.find((item: any) => item?.basicInfo?._id === id);
    if (userToEdit) {
      setSelectedId(id);
      openModal.onTrue();
      editModal.onTrue();
    } else {
      showError('User not found');
    }
  };

  const handleDelete = (id: string) => {
    console.log('id', id);
    deleteModal.onTrue();
  };

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

      <CustomUserModal
        open={openModal.value}
        isEdit={editModal.value}
        onClose={CloseModal}
        userType={usertype}
        onSubmit={onSubmit}
        isLoading={addUserLoading || imageUploading || addUserSuperAdminAndGuestLoading}
        initialData={editModal.value && selectedId ? venueTypes.find((item: any) => item._id === selectedId) : undefined}
      />
    </div>
  );
};

export default UserListView;