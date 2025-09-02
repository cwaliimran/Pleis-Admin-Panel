'use client';
import ConfirmDialog from '@/components/comfirm-dialog/confirm-dialog';
import { Button } from '@/components/ui/button';
import { useBoolean } from '@/hooks/useBoolean';
import { getErrorMessage } from '@/utils/api';
// import { uploadFileToAzure } from '@/utils/fileUpload';
import {
  useAddVenueMutation,
  useDeleteVenueMutation,
  useGetVenuesQuery,
  useUpdateVenueMutation,
} from '@/store/Reducer/venue';
import { uploadFileToAzure } from '@/utils/fileUpload';
import { showError, showSuccess } from '@/utils/toast';
import { yupResolver } from '@hookform/resolvers/yup';
import { Plus } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import * as Yup from 'yup';
import VenueTypeTable from './venueTypeTable';
import VenueTypeModal from './venueTypeModal';
import { formatDate } from '@/utils/format-time';

const defaultValues = {
  title: '',
  venueType: '',
  organization: '',
  floorPlan: undefined,
  status: 'active',
  location: {
    fullAddress: '',
    state: '',
    city: '',
    postalCode: '',
    country: '',
    coordinates: [],
  },
};

const VenueView = () => {
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

  const [addVenue, { isLoading: addVenueLoading }] = useAddVenueMutation();
  const [updateVenue, { isLoading: updateVenueLoading }] =
    useUpdateVenueMutation();
  const [deleteVenue, { isLoading: deleteVenueLoading }] =
    useDeleteVenueMutation();

  const { data: apiData, isLoading } = useGetVenuesQuery({
    page: page - 1,
    search,
    limit,
    status: status === 'all' ? undefined : status,
    date: date ? formatDate(date) : undefined,
  });

  // console.log('apiData', apiData?.data);

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
    title: Yup.string().required('Venue name is required'),
    venueType: Yup.string().required('Venue Type is required'),
    organization: Yup.string().required('Organization is required'),
    status: Yup.string().oneOf(['active', 'inactive']),
    floorPlan: Yup.mixed().nullable(),
    // location: Yup.string().required('Location is required'),
    location: Yup.object().shape({
      fullAddress: Yup.string().required('Full address is required'),
      city: Yup.string().required('City is required'),
      state: Yup.string().required('State/Province is required'),
      country: Yup.string().required('Country is required'),
      postalCode: Yup.string().nullable(),
      coordinates: Yup.array()
        .of(Yup.number())
        .length(2, 'Coordinates must be [lat, lng]')
        .required(),
    }),
  });

  const methods = useForm({
    resolver: yupResolver(schema),
    defaultValues: defaultValues,
  });

  const { handleSubmit, reset } = methods;

  // useEffect(() => {
  //   if (editModal.value && selectedVenueType) {
  //     reset({
  //       title: selectedVenueType.title || '',
  //       venueType: selectedVenueType.venueType?._id || '',
  //       organization: selectedVenueType.organization || '',
  //       location: selectedVenueType.location || '',
  //       floorPlan: undefined,
  //     });
  //   } else if (!editModal.value) {
  //     reset(defaultValues);
  //   }
  // }, [editModal.value, selectedVenueType, reset]);

  useEffect(() => {
    if (editModal.value && selectedVenueType) {
      console.log('Selected Venue Type', selectedVenueType);

      reset({
        title: selectedVenueType.title || '',
        venueType:
          typeof selectedVenueType.venueType === 'string'
            ? selectedVenueType.venueType
            : selectedVenueType.venueType?._id?.toString() || '',

        // organization: selectedVenueType.organization || '',
        organization:
          typeof selectedVenueType.organization === 'string'
            ? selectedVenueType.organization
            : selectedVenueType.organization?._id?.toString() || '',

        location: {
          fullAddress: selectedVenueType.location?.fullAddress || '',
          state: selectedVenueType.location?.state || '',
          city: selectedVenueType.location?.city || '',
          postalCode: selectedVenueType.location?.postalCode || '',
          country: selectedVenueType.location?.country || '',
          coordinates: selectedVenueType.location?.coordinates || [],
        },
        floorPlan:
          selectedVenueType.floorPlanInfo?.url ||
          selectedVenueType.imageInfo?.url ||
          undefined,
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
      showError('Venue not found');
    }
  };

  const handleDelete = (id: string) => {
    setSelectedId(id);
    deleteModal.onTrue();
  };

  // CREATE/UPDATE VENUE
  const onSubmit = handleSubmit(async (formData) => {
    try {
      let imageFileString = undefined;

      if (
        formData.floorPlan &&
        (formData.floorPlan instanceof FileList ||
          Array.isArray(formData.floorPlan))
      ) {
        const file = formData.floorPlan[0];
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
        venueType: formData.venueType,
        organization: formData.organization,
        location: formData.location,
      };

      if (imageFileString) {
        payload.floorPlan = imageFileString;
      } else if (editModal.value && typeof formData.floorPlan === 'string') {
        payload.floorPlan = formData.floorPlan;
      }
      if (editModal.value && selectedId) {
        payload.status = formData.status;
        payload.id = selectedId;
      }

      let response;
      if (editModal.value && selectedId) {
        response = await updateVenue(payload).unwrap();
      } else {
        response = await addVenue(payload).unwrap();
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
            ? 'Venue updated successfully'
            : 'Venue created successfully')
        );
      }

      CloseModal();
    } catch (error) {
      setImageUploading(false);
      const errorMessage = getErrorMessage(error);
      console.log('Failed to save venue:', errorMessage);
      showError(errorMessage);
    }
  });

  const onSetAsPinned = async (item: any) => {
    try {
      const payload = {
        id: item?._id,
        isPrimary: true,
        venueType: item?.venueType,
      };

      const response = await updateVenue(payload).unwrap();

      if (!response) {
        showError('No response from server. Please try again later.');
        return;
      }

      if (response.error) {
        const errorMessage = getErrorMessage(response.error);
        showError(errorMessage);
        return;
      }

      // if (editModal.value && _id) {
      //   // Edit: update the item in local state
      //   setVenueTypes((prev) =>
      //     prev.map((item) => (item._id === selectedId ? response.data : item))
      //   );
      // }

      if (response?.message) {
        showSuccess(response?.message || 'Venue updated successfully');
      }

      setSelectedId(null);
      CloseModal();
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      console.log('Failed to delete category:', errorMessage);
      showError(errorMessage);
    }
  };

  // DELETE VENUE
  const onDelete = async () => {
    try {
      const response = await deleteVenue(selectedId).unwrap();

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
        showSuccess(response?.message || 'Venue deleted successfully');
      }

      setSelectedId(null);
      deleteModal.onFalse();
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      console.log('Failed to delete venue:', errorMessage);
      showError(errorMessage);
    }
  };

  const handleCreateNew = () => {
    setSelectedVenueType(null);
    setSelectedId(null);
    editModal.onFalse();

    methods.reset(defaultValues);
    methods.setValue('floorPlan', null);

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
            Create Venue
          </Button>
        </div>
      </div>

      <VenueTypeTable
        data={venueTypes}
        meta={meta}
        loading={isLoading}
        handleDelete={handleDelete}
        handlePinned={onSetAsPinned}
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

      <VenueTypeModal
        open={openModal.value}
        onClose={CloseModal}
        editMode={editModal.value}
        methods={methods}
        onSubmit={onSubmit}
        isLoading={addVenueLoading || updateVenueLoading || imageUploading}
        selectedVenueType={selectedVenueType}
      />

      <ConfirmDialog
        open={deleteModal.value}
        title="Delete Venue"
        content="Are you sure you want to delete this venue?"
        onClose={() => {
          deleteModal.onFalse();
          setSelectedId(null);
        }}
        onConfirm={onDelete}
        isLoading={deleteVenueLoading}
      />
    </div>
  );
};

export default VenueView;
