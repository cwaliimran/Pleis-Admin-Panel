'use client';

import ConfirmDialog from '@/components/comfirm-dialog/confirm-dialog';
import { Button } from '@/components/ui/button';
import { useBoolean } from '@/hooks/useBoolean';
import { VenueTypeTable } from '@/sections/venueType';
import VenueTypeModal from '@/sections/venueType/VenueTypeModal';
import { useAddVenueTypeMutation, useDeleteVenueTypeMutation, useGetVenueTypesQuery, useUpdateVenueTypeMutation } from '@/store/Reducer/venueType';
import { getErrorMessage } from '@/utils/api';
import { uploadFileToAzure } from '@/utils/fileUpload';
import { formatDate } from '@/utils/format-time';
import { showError, showSuccess } from '@/utils/toast';
import { yupResolver } from '@hookform/resolvers/yup';
import { Plus } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import * as Yup from 'yup';

const defaultValues = {
  image: null,
  // icon: null,
  title: '',
  categories: [],
  status: 'active',
};

const VenueTypeView = () => {
  const openModal = useBoolean();
  const editModal = useBoolean();
  const deleteModal = useBoolean();

  // Pagination and filter state
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState<string>('');
  const [category, setCategory] = useState<string>('');
  const [date, setDate] = useState<Date | undefined>(undefined);

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [selectedVenueType, setSelectedVenueType] = useState<any>(null);
  const [imageUploading, setImageUploading] = useState(false);

  const [addVenueType, { isLoading: addVenueTypeLoading }] = useAddVenueTypeMutation();
  const [updateVenueType, { isLoading: updateVenueTypeLoading }] = useUpdateVenueTypeMutation();
  const [deleteVenueType, { isLoading: deleteVenueTypeLoading }] = useDeleteVenueTypeMutation();

  const { currentData: apiData, isFetching: isLoading } = useGetVenueTypesQuery({
    page: page - 1,
    search,
    limit,
    status,
    category,
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

  // Sync local state with API data on initial load or when API data changes
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
  }, [apiData]);

  const schema = Yup.object().shape({
    image: Yup.mixed().nullable(),
    title: Yup.string().required('Venue Type is required'),
    categories: Yup.array().of(Yup.string()).min(1, 'Please select at least 1 category').max(2, 'You can select up to 2 categories only'),
    status: Yup.string().oneOf(['active', 'inactive']),
  });

  const methods = useForm({
    resolver: yupResolver(schema),
    defaultValues: defaultValues,
  });

  const { handleSubmit, reset } = methods;

  // Effect to populate form when editing
  useEffect(() => {
    if (editModal.value && selectedVenueType) {
      const normalizedCategories = Array.isArray(selectedVenueType?.categories)
        ? selectedVenueType.categories
            .map((category: any) => (typeof category === 'string' ? category : category?._id || category?.id))
            .filter(Boolean)
        : selectedVenueType?.category
          ? [
              typeof selectedVenueType.category === 'string'
                ? selectedVenueType.category
                : selectedVenueType.category?._id || selectedVenueType.category?.id,
            ].filter(Boolean)
          : [];

      reset({
        title: selectedVenueType.title || '',
        categories: normalizedCategories,
        status: selectedVenueType.status || '',
        image: selectedVenueType.image || null,
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
    const venueTypeToEdit = venueTypes?.find((item: any) => item._id === id);
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
    setSelectedId(id);
    deleteModal.onTrue();
  };

  // CREATE/UPDATE VENUE TYPE
  const onSubmit = handleSubmit(async (formData) => {
    try {
      let imageFileString = undefined;
      // If image is present and is a FileList or array
      if (formData.image && (formData.image instanceof FileList || Array.isArray(formData.image))) {
        const file = formData.image[0];
        if (file) {
          setImageUploading(true);
          try {
            imageFileString = await uploadFileToAzure(file);
          } finally {
            setImageUploading(false);
          }
        }
      }

      const payload: any = {
        title: formData.title,
        categories: formData.categories,
      };
      if (imageFileString) {
        payload.image = imageFileString;
      } else if (editModal.value && typeof formData.image === 'string') {
        payload.image = formData.image;
      }
      if (editModal.value && selectedId) {
        payload.status = formData.status;
        payload.id = selectedId;
      }

      let response;
      if (editModal.value && selectedId) {
        response = await updateVenueType(payload).unwrap();
      } else {
        response = await addVenueType(payload).unwrap();
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

      // Handle success and update local state
      // if (response?.data) {
      //   if (editModal.value && selectedId) {
      //     // Edit: update the item in local state
      //     setVenueTypes((prev) =>
      //       prev.map((item) => (item._id === selectedId ? response.data : item))
      //     );
      //   } else {
      //     // Add: add new item to local state
      //     setVenueTypes((prev) => [response.data, ...prev]);
      //     setMeta((prev: any) => ({
      //       ...prev,
      //       totalRecords: prev.totalRecords + 1,
      //     }));
      //   }
      // }

      // Handle success and update local state
      if (response?.data) {
        if (editModal.value && selectedId) {
          // Edit: update the item in local state
          setVenueTypes((prev) => prev.map((item) => (item._id === selectedId ? response.data : item)));
        } else {
          // Add: add new item to local state, keep max 10
          setVenueTypes((prev) => {
            const updated = [response.data, ...prev];
            return updated.slice(0, 10); // maintain max 10
          });

          setMeta((prev: any) => ({
            ...prev,
            totalRecords: prev.totalRecords + 1,
          }));
        }
      }

      if (response?.message) {
        showSuccess(response?.message || (editModal.value ? 'Venue type updated successfully' : 'Venue type created successfully'));
      }

      CloseModal();
    } catch (error) {
      setImageUploading(false);
      const errorMessage = getErrorMessage(error);
      showError(errorMessage);
    }
  });

  // DELETE VENUE TYPE
  const onDelete = async () => {
    try {
      const response = await deleteVenueType(selectedId).unwrap();

      if (response.error) {
        const errorMessage = getErrorMessage(response.error);
        showError(errorMessage);
        return;
      }

      showSuccess(response?.message || 'Venue type deleted successfully');

      setSelectedId(null);
      deleteModal.onFalse();
    } catch (error) {
      const errorMessage = getErrorMessage(error);
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
      <div>
        <div className="mt-3 flex w-full items-center justify-end md:mt-0">
          <Button className="bg-primary hover:bg-primary cursor-pointer rounded-4xl py-2 text-white" onClick={handleCreateNew}>
            <Plus className="" />
            Create Venue Type
          </Button>
        </div>
      </div>

      <VenueTypeTable
        data={venueTypes}
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
        status={status}
        category={category}
        onStatusChange={(val) => {
          setStatus(val);
          setPage(1);
        }}
        onCategoryChange={(val) => {
          setCategory(val);
          setPage(1);
        }}
        date={date}
        onDateChange={(val) => {
          setDate(val);
          setPage(1);
        }}
        onResetFilters={() => {
          setStatus('');
          setCategory('');
          setDate(undefined);
          setSearch('');
          setPage(1);
        }}
      />

      <VenueTypeModal
        open={openModal.value}
        onClose={CloseModal}
        editMode={editModal.value}
        methods={methods}
        onSubmit={onSubmit}
        isLoading={addVenueTypeLoading || updateVenueTypeLoading || imageUploading}
        selectedVenueType={selectedVenueType}
      />

      <ConfirmDialog
        open={deleteModal.value}
        title="Delete Venue Type"
        content="Are you sure you want to delete this venue type?"
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

export default VenueTypeView;
