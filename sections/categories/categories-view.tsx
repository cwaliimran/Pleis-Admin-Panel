'use client';
import ConfirmDialog from '@/components/comfirm-dialog/confirm-dialog';
import { Button } from '@/components/ui/button';
import { useBoolean } from '@/hooks/useBoolean';
import {
  useAddCategoryMutation,
  useDeleteCategoryMutation,
  useGetCategoriesQuery,
  useUpdateCategoryMutation,
} from '@/store/Reducer/categories';
import { getErrorMessage } from '@/utils/api';
import { uploadFileToAzure } from '@/utils/fileUpload';
import { showError, showSuccess } from '@/utils/toast';
import { yupResolver } from '@hookform/resolvers/yup';
import { Plus } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import * as Yup from 'yup';
import CategoriesTypeModal from './categoriesTypeModal';
import CategoriesTypeTable from './categoriesTypeTable';
import { formatDate } from '@/utils/format-time';
import { deleteFileFromAzure } from '@/utils/deleteFile';

const defaultValues = {
  image: null,
  title: '',
  status: 'active',
};

const CategoriesView = () => {
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
  const [imageUploading, setImageUploading] = useState(false);

  const [addCategory, { isLoading: addCategoryLoading }] =
    useAddCategoryMutation();
  const [updateCategory, { isLoading: updateCategoryLoading }] =
    useUpdateCategoryMutation();
  const [deleteCategory, { isLoading: deleteCategoryLoading }] =
    useDeleteCategoryMutation();

  const { data: apiData, isLoading } = useGetCategoriesQuery({
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

  const schema = Yup.object().shape({
    image: Yup.mixed().nullable(),
    title: Yup.string().required('Category Name is required'),
    status: Yup.string().oneOf(['active', 'inactive']),
  });

  const methods = useForm({
    resolver: yupResolver(schema),
    defaultValues: defaultValues,
  });

  const { handleSubmit, reset } = methods;

  useEffect(() => {
    if (editModal.value && selectedVenueType) {
      reset({
        title: selectedVenueType.title || '',
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
      showError('Category type not found');
    }
  };

  const handleDelete = (id: string) => {
    setSelectedId(id);
    deleteModal.onTrue();
  };

  // CREATE/UPDATE VENUE TYPE
  // const onSubmit = handleSubmit(async (formData) => {
  //   console.log('formData', formData);

  //   try {
  //     let imageFileString = undefined;

  //     if (
  //       formData.image &&
  //       (formData.image instanceof FileList || Array.isArray(formData.image))
  //     ) {
  //       const file = formData.image[0];
  //       if (file) {
  //         setImageUploading(true);
  //         try {
  //           imageFileString = await uploadFileToAzure(file);
  //         } finally {
  //           setImageUploading(false);
  //         }
  //       }
  //     }

  //     const payload: any = {
  //       title: formData.title,
  //     };

  //     console.log('payload', payload);

  //     if (imageFileString) {
  //       payload.image = imageFileString;
  //     } else if (editModal.value && typeof formData.image === 'string') {
  //       payload.image = formData.image;
  //     }

  //     if (editModal.value && selectedId) {
  //       payload.status = formData.status;
  //       payload.id = selectedId;
  //     }

  //     let response;
  //     if (editModal.value && selectedId) {
  //       response = await updateCategory(payload).unwrap();
  //     } else {
  //       response = await addCategory(payload).unwrap();
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

  //     // Handle success and update local state
  //     if (response?.data) {
  //       if (editModal.value && selectedId) {
  //         // Edit: update the item in local state
  //         setVenueTypes((prev) =>
  //           prev.map((item) => (item._id === selectedId ? response.data : item))
  //         );
  //       } else {
  //         // Add: add new item to local state but keep only first `limit`
  //         setVenueTypes((prev) => {
  //           const updated = [response.data, ...prev];
  //           return updated.slice(0, limit);
  //         });

  //         setMeta((prev: any) => ({
  //           ...prev,
  //           totalRecords: prev.totalRecords + 1,
  //         }));
  //       }
  //     }

  //     if (response?.message) {
  //       showSuccess(
  //         response?.message ||
  //         (editModal.value
  //           ? 'Category updated successfully'
  //           : 'Category created successfully')
  //       );
  //     }

  //     CloseModal();
  //   } catch (error) {
  //     setImageUploading(false);
  //     const errorMessage = getErrorMessage(error);
  //     console.log('Failed to save category:', errorMessage);
  //     showError(errorMessage);
  //   }
  // });

  // CREATE/UPDATE VENUE TYPE
  const onSubmit = handleSubmit(async (formData) => {
    console.log('formData', formData);

    let uploadedFileKey: string | null = null;
    try {
      let imageFileString = undefined;

      if (
        formData.image &&
        (formData.image instanceof FileList || Array.isArray(formData.image))
      ) {
        const file = formData.image[0];
        if (file) {
          setImageUploading(true);
          try {
            uploadedFileKey = await uploadFileToAzure(file);
            imageFileString = uploadedFileKey;
          } finally {
            setImageUploading(false);
          }
        }
      }

      const payload: any = {
        title: formData.title,
      };

      console.log('payload', payload);

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
        response = await updateCategory(payload).unwrap();
      } else {
        response = await addCategory(payload).unwrap();
      }

      if (!response) {
        throw new Error('No response from server. Please try again later.');
      }

      if (response.error) {
        throw new Error(getErrorMessage(response.error));
      }

      // Handle success and update local state
      if (response?.data) {
        if (editModal.value && selectedId) {
          // Edit: update the item in local state
          setVenueTypes((prev) =>
            prev.map((item) => (item._id === selectedId ? response.data : item))
          );
        } else {
          // Add: add new item to local state but keep only first `limit`
          setVenueTypes((prev) => {
            const updated = [response.data, ...prev];
            return updated.slice(0, limit);
          });

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
            ? 'Category updated successfully'
            : 'Category created successfully')
        );
      }

      CloseModal();
    } catch (error) {
      setImageUploading(false);
      const errorMessage = getErrorMessage(error);
      console.log('Failed to save category:', errorMessage);
      showError(errorMessage);

      // ⚠️ rollback uploaded image if API failed
      if (uploadedFileKey) {
        console.log('Rolling back uploaded image:', uploadedFileKey);
        await deleteFileFromAzure(uploadedFileKey);
      }
    }
  });


  // DELETE CATEGORY
  const onDelete = async () => {
    try {
      const response = await deleteCategory(selectedId).unwrap();

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
        showSuccess(response?.message || 'Category deleted successfully');
      }

      setSelectedId(null);
      deleteModal.onFalse();
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
          <Button
            className="bg-primary hover:bg-primary cursor-pointer rounded-4xl py-2 text-white"
            onClick={handleCreateNew}
          >
            <Plus className="" />
            Create Category
          </Button>
        </div>
      </div>

      <CategoriesTypeTable
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

      <CategoriesTypeModal
        open={openModal.value}
        onClose={CloseModal}
        editMode={editModal.value}
        methods={methods}
        onSubmit={onSubmit}
        isLoading={
          addCategoryLoading || updateCategoryLoading || imageUploading
        }
        selectedVenueType={selectedVenueType}
      />

      <ConfirmDialog
        open={deleteModal.value}
        title="Delete Category"
        content="Are you sure you want to delete this category?"
        onClose={() => {
          deleteModal.onFalse();
          setSelectedId(null);
        }}
        onConfirm={onDelete}
        isLoading={deleteCategoryLoading}
      />
    </div>
  );
};

export default CategoriesView;
