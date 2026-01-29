'use client';

import ButtonLoading from '@/components/common/button-loading';
import FormProvider, { RHFSelectField, RHFTextField } from '@/components/rhf';
import { RHFCustomCombobox } from '@/components/rhf/rhf-custom-combobox';
import RHFCustomDropdown from '@/components/rhf/rhf-custom-dropdown';
import RHFUploadButton from '@/components/rhf/rhf-upload-button';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogOverlay, DialogTitle } from '@/components/ui/dialog';
import FieldSkeleton from '@/components/ui/field-skeleton';
import { useGetOrganizationQuery } from '@/store/Reducer/organization';
import { useAddVenueMutation, useUpdateVenueMutation } from '@/store/Reducer/venue';
import { useGetVenueTypesQuery } from '@/store/Reducer/venueType';
import { getErrorMessage } from '@/utils/api';
import { uploadFileToAzure } from '@/utils/fileUpload';
import { extractAddress } from '@/utils/format-google-address';
import { showError, showSuccess } from '@/utils/toast';
import { yupResolver } from '@hookform/resolvers/yup';
import { Autocomplete, useJsApiLoader } from '@react-google-maps/api';
import React, { useEffect, useRef } from 'react';
import { Controller, useForm } from 'react-hook-form';
import * as Yup from 'yup';

interface VenueTypeModalProps {
  open: boolean;
  onClose: () => void;
  isEditMode?: boolean;
  selectedVenueData?: any;
  selectedId?: string | null;
  orgId?: string | null;
}

const GOOGLE_MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
const googleMapsLibraries: 'places'[] = ['places'];

const defaultValues = {
  title: '',
  venueType: [] as string[],
  organization: '',
  floorPlan: undefined,
  status: 'active',
  location: {
    fullAddress: '',
    state: '',
    city: '',
    postalCode: '',
    country: '',
    coordinates: [] as number[],
  },
};

const VenueTypeModalV2 = ({ open, onClose, isEditMode = false, selectedVenueData, selectedId, orgId }: VenueTypeModalProps) => {
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);
  const [imageUploading, setImageUploading] = React.useState(false);

  const [addVenue, { isLoading: addVenueLoading }] = useAddVenueMutation();
  const [updateVenue, { isLoading: updateVenueLoading }] = useUpdateVenueMutation();

  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: GOOGLE_MAPS_API_KEY as string,
    libraries: googleMapsLibraries,
  });

  const schema = Yup.object().shape({
    title: Yup.string().required('Venue name is required'),
    venueType: Yup.array().of(Yup.string()).min(1, 'At least one venue type is required').required('Venue Type is required'),
    // organization: Yup.string().required('Organization is required'),
    organization: Yup.string().optional(),
    status: Yup.string().oneOf(['active', 'inactive']),
    floorPlan: Yup.mixed().nullable(),
    location: Yup.object().shape({
      fullAddress: Yup.string().required('Full address is required'),
      city: Yup.string(),
      state: Yup.string().required('State/Province is required'),
      country: Yup.string().required('Country is required'),
      postalCode: Yup.string().nullable(),
      coordinates: Yup.array().of(Yup.number()).length(2, 'Coordinates must be [lat, lng]').required(),
    }),
  });

  const methods = useForm({
    resolver: yupResolver(schema),
    defaultValues: defaultValues,
    mode: 'onChange',
  });

  const { handleSubmit, reset, setValue, watch } = methods;

  // Reset form when modal opens/closes or edit data changes
  useEffect(() => {
    if (open && isEditMode && selectedVenueData) {
      console.log('Selected Venue Data', selectedVenueData);

      // Extract venue type IDs as array
      let venueTypeIds: string[] = [];
      if (Array.isArray(selectedVenueData.venueType)) {
        venueTypeIds = selectedVenueData.venueType.map((vt: any) => (typeof vt === 'string' ? vt : vt?._id?.toString() || ''));
      } else if (typeof selectedVenueData.venueType === 'string') {
        venueTypeIds = [selectedVenueData.venueType];
      } else if (selectedVenueData.venueType?._id) {
        venueTypeIds = [selectedVenueData.venueType._id.toString()];
      }

      reset({
        title: selectedVenueData.title || '',
        venueType: venueTypeIds,
        organization:
          typeof selectedVenueData.organization === 'string' ? selectedVenueData.organization : selectedVenueData.organization?._id?.toString() || '',
        location: {
          fullAddress: selectedVenueData.location?.fullAddress || '',
          state: selectedVenueData.location?.state || '',
          city: selectedVenueData.location?.city || '',
          postalCode: selectedVenueData.location?.postalCode || '',
          country: selectedVenueData.location?.country || '',
          coordinates: selectedVenueData.location?.coordinates || [],
        },
        floorPlan: selectedVenueData.floorPlanInfo?.url || selectedVenueData.imageInfo?.url || undefined,
        status: selectedVenueData.status || 'active',
      });
    } else if (open && !isEditMode) {
      // If orgId is provided, pre-select it in create mode
      reset({
        ...defaultValues,
        organization: orgId || '',
      });
    }
  }, [open, isEditMode, selectedVenueData, reset, orgId]);

  const handleClose = () => {
    if (!addVenueLoading && !updateVenueLoading && !imageUploading) {
      reset(defaultValues);
      onClose();
    }
  };

  const onLoad = (autocomplete: google.maps.places.Autocomplete) => {
    autocompleteRef.current = autocomplete;
  };

  const onPlaceChanged = async () => {
    const place = autocompleteRef.current?.getPlace();
    if (place) {
      const address = await extractAddress(place);
      const locationPayload = {
        fullAddress: address.address_line_1 || '',
        city: address.city || '',
        state: address.province || '',
        postalCode: address.postal_code || '',
        country: address.country || '',
        coordinates: [address.longitude || 0, address.latitude || 0],
      };
      console.log('Setting location payload:', locationPayload);
      setValue('location', locationPayload, { shouldValidate: true });
    }
  };

  const { data: apiData, isLoading: venueLoading } = useGetVenueTypesQuery({
    page: 0,
    search: '',
    limit: '100',
    status: '',
  });

  const { data: orgData, isLoading: orgLoading } = useGetOrganizationQuery({
    page: 0,
    search: '',
    limit: '100',
    status: '',
  });

  const venueTypeOptions = React.useMemo(
    () =>
      (apiData?.data || []).map((v: any) => ({
        value: v._id.toString(),
        label: v.title,
      })),
    [apiData]
  );

  const organizationOptions = React.useMemo(
    () =>
      orgData?.data?.map((org: any) => ({
        value: org._id,
        label: org?.basicInfo?.name,
      })) || [],
    [orgData]
  );

  // CREATE/UPDATE VENUE
  const onSubmit = handleSubmit(async (formData) => {
    try {
      let imageFileString = undefined;

      if (formData.floorPlan && (formData.floorPlan instanceof FileList || Array.isArray(formData.floorPlan))) {
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
        // organization: formData.organization,
        location: formData.location,
      };

      // Use orgId if provided, otherwise use formData.organization
      if (orgId) {
        payload.organization = orgId;
      } else if (formData.organization) {
        payload.organization = formData.organization;
      }

      if (imageFileString) {
        payload.floorPlan = imageFileString;
      } else if (isEditMode && typeof formData.floorPlan === 'string') {
        payload.floorPlan = formData.floorPlan;
      }

      // If editing and organization changed, set isPrimary true
      if (isEditMode && selectedId) {
        payload.status = formData.status;
        payload.id = selectedId;
        if (
          selectedVenueData &&
          ((typeof selectedVenueData.organization === 'string' && selectedVenueData.organization !== formData.organization) ||
            (typeof selectedVenueData.organization === 'object' && selectedVenueData.organization?._id?.toString() !== formData.organization))
        ) {
          payload.isPrimary = true;
        }
      }

      let response;
      if (isEditMode && selectedId) {
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

      if (response?.message) {
        showSuccess(response?.message || (isEditMode ? 'Venue updated successfully' : 'Venue created successfully'));
      }

      handleClose();
    } catch (error) {
      setImageUploading(false);
      const errorMessage = getErrorMessage(error);
      console.log('Failed to save venue:', errorMessage);
      showError(errorMessage);
    }
  });

  const isLoading = addVenueLoading || updateVenueLoading || imageUploading;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogOverlay className="bg-opacity-30 fixed inset-0 flex w-full items-center justify-center md:w-lg">
        <DialogContent
          aria-describedby={undefined}
          className="mx-auto max-h-[90vh] min-h-[60vh] overflow-y-auto dark:bg-[#171717]"
          onInteractOutside={(event) => {
            const target = event.target as HTMLElement;
            if (target.closest('.pac-container')) {
              event.preventDefault();
            }
          }}
        >
          <DialogHeader className="flex flex-row items-center justify-between">
            <DialogTitle className="text-lg font-semibold">{isEditMode ? 'Edit Venue' : 'Create Venue'}</DialogTitle>
            <DialogDescription className="sr-only">
              {!isEditMode ? 'Fill in the details below to create a new venue.' : 'Update the venue information below.'}
            </DialogDescription>
          </DialogHeader>

          <FormProvider methods={methods} onSubmit={onSubmit}>
            <div className="mt-4 flex flex-col space-y-4">
              <RHFTextField
                name="title"
                label="Venue Name"
                placeholder="Enter Venue Name"
                className={methods.formState.errors.title ? 'border-red-400' : ''}
              />

              {venueLoading ? (
                <FieldSkeleton />
              ) : (
                <RHFCustomCombobox
                  name="venueType"
                  label="Venue Type"
                  placeholder="Select Venue Type"
                  className="w-full flex-1"
                  multiple={true}
                  allowCustom={false}
                  options={venueTypeOptions}
                />
              )}

              {orgLoading ? (
                <FieldSkeleton />
              ) : (
                <RHFCustomDropdown
                  name="organization"
                  label="Organization"
                  placeholder="Select Organization"
                  options={organizationOptions}
                  isLoading={orgLoading}
                  showNone={false}
                  disabled={!!orgId}
                />
              )}

              {isEditMode && (
                <RHFSelectField
                  name="status"
                  placeholder="Select Status"
                  label="Status"
                  className="w-full flex-1"
                  options={[
                    { label: 'Active', value: 'active' },
                    { label: 'Inactive', value: 'inactive' },
                  ]}
                  disabled={isLoading}
                />
              )}

              {/* FLOOR IMAGE UPLOAD */}
              <div className="flex max-w-40 items-center justify-start">
                <RHFUploadButton
                  name="floorPlan"
                  label="Upload Floor Plan"
                  initialImage={isEditMode && selectedVenueData?.floorPlan ? selectedVenueData.floorPlan : null}
                  // initialImage={
                  //   isEditMode
                  //     ? selectedVenueData?.floorPlanInfo?.url &&
                  //       selectedVenueData.floorPlanInfo.url !== noImageUrl &&
                  //       selectedVenueData.floorPlanInfo.url !== noImageUrlDev
                  //       ? selectedVenueData.floorPlanInfo.url
                  //       : null
                  //     : null
                  // }
                />
              </div>

              <div className="w-full">
                <label htmlFor="location-input" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Location
                </label>
                {isLoaded && (
                  <Controller
                    name="location"
                    control={methods.control}
                    render={({ field }) => (
                      <Autocomplete onLoad={onLoad} onPlaceChanged={onPlaceChanged}>
                        <input
                          id="location-input"
                          type="text"
                          placeholder="Enter Location"
                          defaultValue={field.value?.fullAddress || ''}
                          className="mt-2 h-10 w-full rounded-md border bg-white px-2 py-1 text-sm shadow-xs placeholder:font-medium placeholder:text-gray-500 dark:bg-[#212121] dark:placeholder:text-slate-400"
                          onChange={(e) =>
                            field.onChange({
                              ...field.value,
                              fullAddress: e.target.value,
                            })
                          }
                          onKeyDown={(e) => e.key === 'Enter' && e.preventDefault()}
                        />
                      </Autocomplete>
                    )}
                  />
                )}
              </div>

              <div className="w-full">
                <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">Map Preview</label>
                <div className="h-[200px] w-full overflow-hidden rounded-lg border border-gray-300 dark:border-gray-600">
                  {watch('location.coordinates')?.length === 2 ? (
                    <iframe
                      title="Venue Location Map"
                      src={`https://www.google.com/maps?q=${watch('location.coordinates')[1]},${watch('location.coordinates')[0]}&hl=es;z=14&output=embed`}
                      className="h-full w-full border-0"
                      referrerPolicy="no-referrer-when-downgrade"
                    ></iframe>
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-gray-400">No location selected</div>
                  )}
                </div>
              </div>

              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={handleClose} disabled={isLoading} className="mr-2">
                  Cancel
                </Button>

                {isLoading ? (
                  <Button type="button" disabled className="cursor-pointer bg-blue-700 text-white hover:bg-blue-800">
                    <ButtonLoading title={isEditMode ? 'Updating' : 'Creating'} />
                  </Button>
                ) : (
                  <Button type="submit" className="cursor-pointer bg-blue-700 text-white hover:bg-blue-800" disabled={isLoading}>
                    {isEditMode ? 'Update Venue' : 'Add Venue'}
                  </Button>
                )}
              </div>
            </div>
          </FormProvider>
        </DialogContent>
      </DialogOverlay>
    </Dialog>
  );
};

export default VenueTypeModalV2;
