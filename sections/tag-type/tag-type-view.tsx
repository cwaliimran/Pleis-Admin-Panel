'use client';

import ConfirmDialog from '@/components/comfirm-dialog/confirm-dialog';
import { Button } from '@/components/ui/button';
import { useBoolean } from '@/hooks/useBoolean';
import { useAddTagTypeMutation, useDeleteTagTypeMutation, useGetTagTypeQuery, useUpdateTagTypeMutation } from '@/store/Reducer/tag-type-api';
import { getErrorMessage } from '@/utils/api';
import { formatDate } from '@/utils/format-time';
import { showError, showSuccess } from '@/utils/toast';
import { yupResolver } from '@hookform/resolvers/yup';
import { Plus } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import * as Yup from 'yup';
import TagTypeModal from './tag-type-modal';
import TagTypeTable from './tag-type-table';

const defaultValues = {
  title: '',
  status: '',
};

const TagTypeView = () => {
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

  const [addTagType, { isLoading: addTagTypeLoading }] = useAddTagTypeMutation();
  const [updateTagType, { isLoading: updateTagTypeLoading }] = useUpdateTagTypeMutation();

  const [deleteTagType, { isLoading: deleteTagTypeLoading }] = useDeleteTagTypeMutation();

  const { data: apiData, isLoading } = useGetTagTypeQuery({
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
    title: Yup.string().required('Tag Type Name is required'),
    status: Yup.string(),
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
        status: selectedVenueType.status || 'active',
      });
    } else if (!editModal.value) {
      reset(defaultValues);
    }
  }, [editModal.value, selectedVenueType, reset]);

  const CloseModal = () => {
    openModal.onFalse();
    editModal.onFalse();

    setSelectedVenueType(null);
    setSelectedId(null);
    methods.reset(defaultValues);
  };

  const handleEdit = (id: string) => {
    const venueTypeToEdit = venueTypes?.find((item: any) => item._id === id);
    if (venueTypeToEdit) {
      setSelectedVenueType(venueTypeToEdit);
      setSelectedId(id);
      editModal.onTrue();
      openModal.onTrue();
    } else {
      showError('Tag Type not found');
    }
  };

  const handleDelete = (id: string) => {
    setSelectedId(id);
    deleteModal.onTrue();
  };

  // CREATE/UPDATE SUPPLIER
  const onSubmit = handleSubmit(async (formData) => {
    try {
      let response;
      if (editModal.value && selectedId) {
        response = await updateTagType({
          id: selectedId,
          ...formData,
        }).unwrap();
      } else {
        response = await addTagType({ title: formData.title }).unwrap();
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

      if (response?.data) {
        if (editModal.value && selectedId) {
          // Edit: update the item in local state
          setVenueTypes((prev) => prev.map((item) => (item._id === selectedId ? response.data : item)));
        } else {
          // Add: keep only first 10 on the current page
          setVenueTypes((prev) => {
            const updated = [response.data, ...prev];
            return updated.slice(0, limit);
          });

          setMeta((prev: any) => {
            const newTotalRecords = prev.totalRecords + 1;
            return {
              ...prev,
              totalRecords: newTotalRecords,
              totalPages: Math.ceil(newTotalRecords / limit),
            };
          });
        }
      }

      if (response?.message) {
        showSuccess(response?.message || (editModal.value ? 'Tag Type updated successfully' : 'Tag Type created successfully'));
      }

      CloseModal();
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      console.log('Failed to save supplier:', errorMessage);
      showError(errorMessage);
    }
  });

  // DELETE TAG TYPE
  const onDelete = async () => {
    try {
      const response = await deleteTagType(selectedId).unwrap();

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
        showSuccess(response?.message || 'Tag Type deleted successfully');
      }

      setSelectedId(null);
      deleteModal.onFalse();
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      console.log('Failed to delete tag type:', errorMessage);
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
            Create Tag Type
          </Button>
        </div>
      </div>

      <TagTypeTable
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

      <TagTypeModal
        open={openModal.value}
        onClose={CloseModal}
        editMode={editModal.value}
        methods={methods}
        onSubmit={onSubmit}
        isLoading={addTagTypeLoading || updateTagTypeLoading}
        selectedVenueType={selectedVenueType}
      />

      <ConfirmDialog
        open={deleteModal.value}
        title="Delete Tag Type"
        content="Are you sure you want to delete this tag type?"
        onClose={() => {
          deleteModal.onFalse();
          setSelectedId(null);
        }}
        onConfirm={onDelete}
        isLoading={deleteTagTypeLoading}
      />
    </div>
  );
};

export default TagTypeView;
