'use client';
import ConfirmDialog from '@/components/comfirm-dialog/confirm-dialog';
import { Button } from '@/components/ui/button';
import { useBoolean } from '@/hooks/useBoolean';
import {
  useAddHighlightsMutation,
  useDeleteHighlightsMutation,
  useGetHighlightsQuery,
  useUpdateHighlightsMutation,
} from '@/store/Reducer/highlights';
import { getErrorMessage } from '@/utils/api';
import { uploadFileToAzure } from '@/utils/fileUpload';
import { formatDate } from '@/utils/format-time';
import { showError, showSuccess } from '@/utils/toast';
import { yupResolver } from '@hookform/resolvers/yup';
import { Plus } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import * as Yup from 'yup';
import HighlightTypeModal from './highlight-type-modal';
import HighlightTypeTable from './highlight-type-table';

type HighlightFormValues = {
  video: any;
  title: string;
  event: string;
  status: string;
  organization: string;
};

const defaultValues = {
  video: null,
  title: '',
  event: '',
  status: '',
  organization: '',
};

const HighlightsView = () => {
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

  const [addHighlights, { isLoading: addHighlightsLoading }] =
    useAddHighlightsMutation();
  const [updateHighlights, { isLoading: updateHighlightsLoading }] =
    useUpdateHighlightsMutation();
  const [deleteHighlights, { isLoading: deleteHighlightsLoading }] =
    useDeleteHighlightsMutation();

  const {
    data: apiData,
    isLoading,
    refetch,
  } = useGetHighlightsQuery({
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

  const schema = Yup.object({
    video: Yup.mixed().nullable().required('Video is required'),
    title: Yup.string().required('Title is required'),
    event: Yup.string().required('Event is required'),
    status: Yup.string().required('Status is required'),
    organization: Yup.string().required('Organization is required'),
  });

  const methods = useForm<HighlightFormValues>({
    resolver: yupResolver(schema),
    defaultValues,
  });

  const {
    handleSubmit,
    reset,
    formState: { errors },
  } = methods;
  
  console.log('errors', errors);

  useEffect(() => {
    if (editModal.value && selectedVenueType) {
      reset({
        title: selectedVenueType.title || '',
        event: selectedVenueType.event || '',
        status: selectedVenueType.status || '',
        organization: selectedVenueType.organization || '',
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
      showError('Highlight type not found');
    }
  };

  const handleDelete = (id: string) => {
    setSelectedId(id);
    deleteModal.onTrue();
  };

  // CREATE/UPDATE HIGHLIGHT
  const onSubmit = handleSubmit(async (formData) => {
    console.log('formData', formData);
    try {
      let videoFileString = undefined;
      // If video is present and is a FileList or array
      if (
        formData.video &&
        (formData.video instanceof FileList || Array.isArray(formData.video))
      ) {
        const file = formData.video[0];
        if (file) {
          setImageUploading(true);
          try {
            videoFileString = await uploadFileToAzure(file);
          } finally {
            setImageUploading(false);
          }
        }
      }

      const payload: any = {
        title: formData.title,
        event: formData.event,
        status: formData.status,
        organization: formData.organization,
      };

      if (videoFileString) {
        // payload.video = videoFileString;
        payload.media = {
          type: 'video',
          name: videoFileString,
        };
      } else if (editModal.value && typeof formData.video === 'string') {
        // payload.video = formData.video;

        payload.media = {
          type: 'video',
          name: videoFileString,
        };
      }
      if (editModal.value && selectedId) {
        payload.status = formData.status;
        payload.id = selectedId;
      }
      let response;
      if (editModal.value && selectedId) {
        response = await updateHighlights(payload).unwrap();
      } else {
        response = await addHighlights(payload).unwrap();
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
              ? 'Highlight updated successfully'
              : 'Highlight created successfully')
        );
      }
      CloseModal();
      refetch();
    } catch (error) {
      setImageUploading(false);
      const errorMessage = getErrorMessage(error);
      console.log('Failed to save highlight:', errorMessage);
      showError(errorMessage);
    }
  });

  // DELETE CATEGORY
  const onDelete = async () => {
    try {
      const response = await deleteHighlights(selectedId).unwrap();

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
        showSuccess(response?.message || 'Highlight deleted successfully');
      }

      setSelectedId(null);
      deleteModal.onFalse();
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      console.log('Failed to delete highlight:', errorMessage);
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
            Create Highlight
          </Button>
        </div>
      </div>

      <HighlightTypeTable
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

      <HighlightTypeModal
        open={openModal.value}
        onClose={CloseModal}
        editMode={editModal.value}
        methods={methods}
        onSubmit={onSubmit}
        isLoading={
          addHighlightsLoading || updateHighlightsLoading || imageUploading
        }
        selectedVenueType={selectedVenueType}
      />

      <ConfirmDialog
        open={deleteModal.value}
        title="Delete Highlight"
        content="Are you sure you want to delete this highlight?"
        onClose={() => {
          deleteModal.onFalse();
          setSelectedId(null);
        }}
        onConfirm={onDelete}
        isLoading={deleteHighlightsLoading}
      />
    </div>
  );
};

export default HighlightsView;
