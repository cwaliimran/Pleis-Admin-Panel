'use client';
import ConfirmDialog from '@/components/comfirm-dialog/confirm-dialog';
import { Button } from '@/components/ui/button';
import { useBoolean } from '@/hooks/useBoolean';
import {
  useAddTagMutation, useUpdateTagMutation
} from '@/store/Reducer/tags';
import { getErrorMessage } from '@/utils/api';
import { showError, showSuccess } from '@/utils/toast';
import { yupResolver } from '@hookform/resolvers/yup';
import { Plus } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import * as Yup from 'yup';
import TagsTypeModal from './items-category-modal';
import TagsTypeTable from './items-category-table';
import { formatDate } from '@/utils/format-time';
import {
  useDeleteItemsCategoryMutation,
  useGetItemsCategoryQuery,
} from '@/store/Reducer/items-category-api';

const defaultValues = {
  title: '',
  type: '',
  status: 'active',
};

const ItemsCategoryView = () => {
  const openModal = useBoolean();
  const editModal = useBoolean();
  const deleteModal = useBoolean();

  // Pagination and filter state
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState<string>('');
  const [date, setDate] = useState<Date | undefined>(undefined);

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [selectedVenueType, setSelectedVenueType] = useState<any>(null);

  const [addTag, { isLoading: addTagLoading }] = useAddTagMutation();
  const [updateTag, { isLoading: updateTagLoading }] = useUpdateTagMutation();
  const [deleteItemsCategory, { isLoading: deleteTagLoading }] =
    useDeleteItemsCategoryMutation();

  const {
    data: apiData,
    isLoading,
    refetch,
  } = useGetItemsCategoryQuery({
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
      // setVenueTypes(apiData.data);
      // setMeta(
      //   apiData.meta || {
      //     currentPage: page,
      //     totalPages: 1,
      //     totalRecords: 0,
      //     limit,
      //   }
      // );
      setVenueTypes([...apiData.data]); // make a new array copy
      setMeta({ ...apiData.meta });
    }
  }, [apiData, page, limit]);

  const schema = Yup.object().shape({
    title: Yup.string().required('Tag Name is required'),
    type: Yup.string().required('Tag Type is required'),
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
      reset({
        title: selectedVenueType.title || '',
        type: selectedVenueType.type || '',
        status: selectedVenueType.status || 'active',
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
      showError('Tag not found');
    }
  };

  const handleDelete = (id: string) => {
    setSelectedId(id);
    deleteModal.onTrue();
  };

  // CREATE/UPDATE TAGS
  const onSubmit = handleSubmit(async (formData) => {
    try {
      let response;
      if (editModal.value && selectedId) {
        // Update existing tag, include status
        response = await updateTag({
          id: selectedId,
          ...formData,
        }).unwrap();
      } else {
        response = await addTag({
          title: formData.title,
          type: formData.type,
        }).unwrap();
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
      if (response?.data) {
        if (editModal.value && selectedId) {
          // Edit: update the item in local state
          setVenueTypes((prev) =>
            prev.map((item) => (item._id === selectedId ? response.data : item))
          );
        } else {
          // Add: add new item to local state
          setVenueTypes((prev) => [response.data, ...prev]);
          setMeta((prev: any) => ({
            ...prev,
            totalRecords: prev.totalRecords + 1,
          }));
        }
      }

      if (response?.message) {
        showSuccess(
          response?.message ||
            (editModal.value
              ? 'Tags updated successfully'
              : 'Tags created successfully')
        );
      }

      CloseModal();
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      console.log('Failed to save tag:', errorMessage);
      showError(errorMessage);
    }
  });

  // DELETE API CALL
  const onDelete = async () => {
    try {
      const response = await deleteItemsCategory(selectedId).unwrap();

      if (!response) {
        showError('No response from server. Please try again later.');
        return;
      }

      if (response.error) {
        const errorMessage = getErrorMessage(response.error);
        showError(errorMessage);
        return;
      }

      if (response?.message) {
        showSuccess(response?.message || 'Tag deleted successfully');
      }

      setSelectedId(null);
      deleteModal.onFalse();
      refetch();
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      console.log('Failed to delete tag:', errorMessage);
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
          <Button
            className="bg-primary hover:bg-primary cursor-pointer rounded-4xl py-2 text-white"
            onClick={handleCreateNew}
          >
            <Plus />
            Create Item Category
          </Button>
        </div>
      </div>

      <TagsTypeTable
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

      <TagsTypeModal
        open={openModal.value}
        onClose={CloseModal}
        editMode={editModal.value}
        methods={methods}
        onSubmit={onSubmit}
        isLoading={addTagLoading || updateTagLoading}
        selectedVenueType={selectedVenueType}
      />

      <ConfirmDialog
        open={deleteModal.value}
        title="Delete Item Category"
        content="Are you sure you want to delete this item category?"
        onClose={() => {
          deleteModal.onFalse();
          setSelectedId(null);
        }}
        onConfirm={onDelete}
        isLoading={deleteTagLoading}
      />
    </div>
  );
};

export default ItemsCategoryView;
