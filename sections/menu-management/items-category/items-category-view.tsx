'use client';

import ConfirmDialog from '@/components/comfirm-dialog/confirm-dialog';
import { Button } from '@/components/ui/button';
import { useBoolean } from '@/hooks/useBoolean';
import {
  useAddItemsCategoryMutation,
  useDeleteItemsCategoryMutation,
  useGetItemsCategoryQuery,
  useUpdateItemsCategoryMutation,
} from '@/store/Reducer/items-category-api';
import { getErrorMessage } from '@/utils/api';
import { formatDate } from '@/utils/format-time';
import { showError, showSuccess } from '@/utils/toast';
import { yupResolver } from '@hookform/resolvers/yup';
import { Plus } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import * as Yup from 'yup';
import TagsTypeModal from './items-category-modal';
import TagsTypeTable from './items-category-table';
import { useImageUpload } from '@/hooks/useImageUpload';
import { noImageUrl, noImageUrlDev } from '@/constant/constant';

const defaultValues = {
  title: '',
  photo: null,
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

  const { uploadImage, uploading: imageUploading } = useImageUpload();

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [selectedVenueType, setSelectedVenueType] = useState<any>(null);

  const [addItemsCategory, { isLoading: addItemsCategoryLoading }] = useAddItemsCategoryMutation();
  const [updateItemsCategory, { isLoading: updateItemsCategoryLoading }] = useUpdateItemsCategoryMutation();

  const [deleteItemsCategory, { isLoading: deleteItemsCategoryLoading }] = useDeleteItemsCategoryMutation();

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
      setVenueTypes([...apiData.data]);
      setMeta({ ...apiData.meta });
    }
  }, [apiData, page, limit]);

  const schema = Yup.object().shape({
    title: Yup.string().required('Tag Name is required'),
    photo: Yup.mixed().nullable(),
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
      let photoValue = selectedVenueType.image;
      if (!photoValue || photoValue === '' || photoValue === noImageUrl || photoValue === noImageUrlDev) {
        photoValue = null;
      }
      reset({
        title: selectedVenueType.title || '',
        photo: photoValue,
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
      showError('Item Category not found');
    }
  };

  const handleDelete = (id: string) => {
    setSelectedId(id);
    deleteModal.onTrue();
  };

  // CREATE/UPDATE API CALL
  const onSubmit = handleSubmit(async (formData: any) => {
    let uploadedFileKey: string | null = null;

    try {
      if (formData.photo instanceof FileList && formData.photo.length > 0) {
        uploadedFileKey = await uploadImage(formData.photo[0]);
      }

      if (uploadedFileKey) formData.image = uploadedFileKey;

      let response;
      if (editModal.value && selectedId) {
        response = await updateItemsCategory({
          id: selectedId,
          ...formData,
        }).unwrap();
      } else {
        response = await addItemsCategory({
          title: formData.title,
          image: formData.image,
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

      if (response?.message) {
        showSuccess(response?.message || (editModal.value ? 'Item category updated successfully' : 'Item category created successfully'));
      }

      CloseModal();
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      console.log('Failed to save item category:', errorMessage);
      showError(errorMessage);
    }
  });

  // DELETE API CALL
  const onDelete = async () => {
    try {
      const response = await deleteItemsCategory(selectedId).unwrap();

      if (response.error) {
        const errorMessage = getErrorMessage(response.error);
        showError(errorMessage);
        return;
      }

      showSuccess(response?.message || 'Category deleted successfully');

      setSelectedId(null);
      deleteModal.onFalse();
      refetch();
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      console.log('Failed to delete category:', errorMessage);
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
        isLoading={addItemsCategoryLoading || updateItemsCategoryLoading || imageUploading}
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
        isLoading={deleteItemsCategoryLoading}
      />
    </div>
  );
};

export default ItemsCategoryView;
