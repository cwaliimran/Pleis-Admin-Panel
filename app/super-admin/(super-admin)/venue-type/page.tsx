'use client';
import Header from '@/app/common/header';
import ConfirmDialog from '@/components/comfirm-dialog/confirm-dialog';
import { Button } from '@/components/ui/button';
import { useBoolean } from '@/hooks/useBoolean';
import { VenueTypeTable } from '@/sections/venueType';
import VenueTypeModal from '@/sections/venueType/VenueTypeModal';
import {
  useAddVenueTypeMutation,
  useDeleteVenueTypeMutation,
  useGetVenueTypesQuery,
  useUpdateVenueTypeMutation,
} from '@/store/Reducer/venueType';
import { getErrorMessage } from '@/utils/api';
import { showError, showSuccess } from '@/utils/toast';
import { yupResolver } from '@hookform/resolvers/yup';
import { Plus } from 'lucide-react';
import { useForm } from 'react-hook-form';
import * as Yup from 'yup';
import { useState, useEffect } from 'react';

const defaultValues = {
  icon: null,
  title: '',
};

const Page = () => {
  const openModal = useBoolean();
  const editModal = useBoolean();
  const deleteModal = useBoolean();

  // Pagination state
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState('');

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [selectedVenueType, setSelectedVenueType] = useState<any>(null);

  const [addVenueType, { isLoading: addVenueTypeLoading }] = useAddVenueTypeMutation();
  const [updateVenueType, { isLoading: updateVenueTypeLoading }] = useUpdateVenueTypeMutation();
  const [deleteVenueType, { isLoading: deleteVenueTypeLoading }] = useDeleteVenueTypeMutation();

  const {
    data: apiData,
    isLoading,
  } = useGetVenueTypesQuery({
    pageno: page - 1,
    search,
    limit,
    status: 'active',
  });

  const data = apiData?.data || [];
  const meta = apiData?.meta || {
    currentPage: page,
    totalPages: 1,
    totalRecords: 0,
    limit,
  };

  const schema = Yup.object().shape({
    icon: Yup.mixed().nullable(),
    title: Yup.string().required('Venue Type is required'),
  });

  const methods = useForm({
    resolver: yupResolver(schema),
    defaultValues: defaultValues,
  });

  const { handleSubmit, reset } = methods;

  // Effect to populate form when editing
  useEffect(() => {
    if (editModal.value && selectedVenueType) {
      reset({
        icon: selectedVenueType.icon || null,
        title: selectedVenueType.title || '',
      });
    } else if (!editModal.value) {
      reset(defaultValues);
    }
  }, [editModal.value, selectedVenueType, reset]);

  const CloseModal = () => {
    methods.reset(defaultValues);
    setSelectedVenueType(null);
    setSelectedId(null);
    openModal.onFalse();
    editModal.onFalse();
  };

  const handleEdit = (id: string) => {
    const venueTypeToEdit = data?.find((item: any) => item._id === id);
    
    if (venueTypeToEdit) {
      setSelectedVenueType(venueTypeToEdit);
      setSelectedId(id);
      editModal.onTrue();
      openModal.onTrue();
    } else {
      showError('Venue type not found');
    }
  };

  const handleDelete = (id: string) => {
    console.log('Deleting venue type with id:', id);
    setSelectedId(id);
    deleteModal.onTrue();
  };

  // CREATE/UPDATE VENUE TYPE
  const onSubmit = handleSubmit(async (data) => {
    try {
      let response;
      
      if (editModal.value && selectedId) {
        // Update existing venue type
        response = await updateVenueType({
          id: selectedId,
          ...data
        }).unwrap();
      } else {
        // Create new venue type
        response = await addVenueType(data).unwrap();
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

      // Handle success
      if (response?.message) {
        showSuccess(
          response?.message || 
          (editModal.value ? 'Venue type updated successfully' : 'Venue type created successfully')
        );
      }

      CloseModal();
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      console.log('Failed to save venue type:', errorMessage);
      showError(errorMessage);
    }
  });

  // DELETE VENUE TYPE
  const onDelete = async () => {
    try {
      const response = await deleteVenueType(selectedId).unwrap();

      if (!response) {
        showError('No response from server. Please try again later.');
        return;
      }

      if (response.error) {
        const errorMessage = getErrorMessage(response.error);
        showError(errorMessage);
        return;
      }

      // Handle success
      if (response?.message) {
        showSuccess(response?.message || 'Venue type deleted successfully');
      }

      setSelectedId(null);
      deleteModal.onFalse();
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      console.log('Failed to delete venue type:', errorMessage);
      showError(errorMessage);
    }
  };

  const handleCreateNew = () => {
    setSelectedVenueType(null);
    setSelectedId(null);
    editModal.onFalse();
    openModal.onTrue();
  };

  return (
    <div>
      <Header
        links={[
          { name: 'Dashboard', href: '/super-admin' },
          { name: 'Venues Type', href: '' },
        ]}
      />
      <div>
        <div className="mt-3 flex w-full items-center justify-end md:mt-0">
          <Button
            className="bg-primary hover:bg-primary cursor-pointer rounded-4xl py-2 text-white"
            onClick={handleCreateNew}
          >
            <Plus className="" />
            Create Venue Type
          </Button>
        </div>
      </div>

      <VenueTypeTable
        data={data}
        meta={meta}
        loading={isLoading}
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
      />

      <VenueTypeModal
        open={openModal.value}
        onClose={CloseModal}
        editMode={editModal.value}
        methods={methods}
        onSubmit={onSubmit}
        isLoading={addVenueTypeLoading || updateVenueTypeLoading}
        selectedVenueType={selectedVenueType}
      />

      <ConfirmDialog
        open={deleteModal.value}
        title="Delete Venue Type"
        content="Are you sure you want to delete this venue type? This action cannot be undone."
        onClose={() => {
          deleteModal.onFalse();
          setSelectedId(null);
        }}
        onConfirm={onDelete}
        isLoading={deleteVenueTypeLoading}
      />
    </div>
  );
};

export default Page;