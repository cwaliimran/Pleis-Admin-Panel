'use client';

import ButtonLoading from '@/components/common/button-loading';
import FormProvider, { RHFTextField } from '@/components/rhf';
import RHFUploadButton from '@/components/rhf/rhf-upload-button';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogOverlay,
  DialogTitle,
} from '@/components/ui/dialog';
import { useGetOrganizationQuery } from '@/store/Reducer/organization';

import { extractAddress } from '@/utils/format-google-address';
import { getErrorMessage } from '@/utils/api';
import { uploadFileToAzure } from '@/utils/fileUpload';
import { showError, showSuccess } from '@/utils/toast';
import { yupResolver } from '@hookform/resolvers/yup';
import { StandaloneSearchBox, useJsApiLoader } from '@react-google-maps/api';
import React, { useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import * as Yup from 'yup';
import { useAddVenueMutation } from '@/store/Reducer/venue';
import { useGetVenueTypesQuery } from '@/store/Reducer/venueType';
import RHFCustomDropdown from '../rhf/rhf-custom-dropdown';

interface VenueTypeModalProps {
  open: boolean;
  onClose: () => void;
}

const defaultValues = {
  title: '',
  venueType: '',
  organization: '',
  floorPlan: undefined,
  location: {
    fullAddress: '',
    state: '',
    city: '',
    postalCode: '',
    country: '',
    coordinates: [],
  },
};

const GOOGLE_MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
const googleMapsLibraries = ['places'] as any;

const VenueTypeModal = ({ open, onClose }: VenueTypeModalProps) => {
  // Form schema
  const schema = Yup.object().shape({
    title: Yup.string().required('Venue name is required'),
    venueType: Yup.string().required('Venue Type is required'),
    organization: Yup.string().required('Organization is required'),
    floorPlan: Yup.mixed().nullable(),
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

  // Form setup
  const methods = useForm({
    resolver: yupResolver(schema),
    defaultValues,
  });

  const { handleSubmit, reset, watch, setValue } = methods;

  // State for image uploading
  const [imageUploading, setImageUploading] = useState(false);

  // API hooks
  const [addVenue, { isLoading: addVenueLoading }] = useAddVenueMutation();

  const isLoading = addVenueLoading || imageUploading;

  // Google Maps setup
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: GOOGLE_MAPS_API_KEY as any,
    libraries: googleMapsLibraries,
  });

  const inputRef = useRef<google.maps.places.SearchBox | null>(null);

  // Fetch venue types and organizations
  const { data: apiData, isLoading: venueLoading } = useGetVenueTypesQuery({
    page: 0,
    search: '',
    limit: '100',
    status: '',
  });

  const { data: orgData, isLoading: orgLoading } = useGetOrganizationQuery({
    page: 0,
    search: '',
    limit: '10000',
    status: '',
  });

  // Map options for venue types and organizations
  const venueTypeOptions = (apiData?.data || []).map((v: any) => ({
    value: v._id.toString(),
    label: v.title,
  }));

  const organizationOptions = React.useMemo(
    () =>
      orgData?.data?.map((org: any) => ({
        value: org._id,
        label: org?.basicInfo?.name,
      })) || [],
    [orgData]
  );

  // Handle Google Maps place selection
  const handleOnPlacesChanged = async () => {
    const places = inputRef.current?.getPlaces();
    if (places && places.length > 0) {
      const address = await extractAddress(places[0]);

      const locationPayload = {
        fullAddress: address.address_line_1 || '',
        state: address.province || '',
        city: address.city || '',
        postalCode: address.postal_code || '',
        country: address.country || '',
        coordinates: [address.latitude, address.longitude],
      };

      setValue('location', locationPayload, { shouldValidate: true });
    }
  };

  // Form submission handler
  const onSubmit = handleSubmit(async (formData) => {
    try {
      let imageFileString = undefined;

      // Handle floor plan upload
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

      // Prepare payload
      const payload: any = {
        title: formData.title,
        venueType: formData.venueType,
        organization: formData.organization,
        location: formData.location,
      };

      if (imageFileString) {
        payload.floorPlan = imageFileString;
      }

      // Call API to create venue
      const response = await addVenue(payload).unwrap();

      // Handle response
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
        showSuccess(response?.message || 'Venue created successfully');
      }

      reset(defaultValues);
      onClose();
    } catch (error) {
      setImageUploading(false);
      const errorMessage = getErrorMessage(error);
      console.log('Failed to create venue:', errorMessage);
      showError(errorMessage);
    }
  });

  // Handle dialog close
  const handleClose = () => {
    if (!isLoading) {
      reset(defaultValues);
      onClose();
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogOverlay className="bg-opacity-30 fixed inset-0 flex w-full items-center justify-center md:w-lg">
        {/* <DialogContent className="mx-auto max-h-[90vh] min-h-[60vh] overflow-y-auto dark:bg-[#171717]"> */}
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
            <DialogTitle className="text-lg font-semibold">
              Create Venue
            </DialogTitle>
            <DialogDescription className="sr-only">
              Fill in the details below to create a new venue.
            </DialogDescription>
          </DialogHeader>

          <FormProvider methods={methods} onSubmit={onSubmit}>
            <div className="mt-4 flex flex-col space-y-4">
              <RHFTextField
                name="title"
                label="Venue Name"
                placeholder="Enter Venue Name"
                className={
                  methods.formState.errors.title ? 'border-red-400' : ''
                }
              />

              {/* <RHFSelectScrollable
                name="venueType"
                label="Venue Type"
                placeholder="Select a venue type"
                options={venueTypeOptions}
              />

              <RHFSelectScrollable
                name="organization"
                label="Organization"
                placeholder="Select Organization"
                options={organizationOptions}
              /> */}

              <RHFCustomDropdown
                name="venueType"
                label="Venue Type"
                placeholder="Select Venue Type"
                options={venueTypeOptions}
                isLoading={venueLoading}
                showNone={false}
              />

              <RHFCustomDropdown
                name="organization"
                label="Organization"
                placeholder="Select Organization"
                options={organizationOptions}
                isLoading={orgLoading}
                showNone={false}
              />

              <div className="flex max-w-[10rem] items-center justify-start">
                <RHFUploadButton name="floorPlan" label="Upload Floor Plan" />
              </div>

              <div className="input">
                <label htmlFor="address" className="text-sm">
                  Location
                </label>

                {isLoaded && (
                  <StandaloneSearchBox
                    onLoad={(searchBox) => {
                      inputRef.current = searchBox;
                    }}
                    onPlacesChanged={handleOnPlacesChanged}
                  >
                    <input
                      id="address"
                      type="text"
                      placeholder="Enter Location"
                      className="mt-2 h-[40px] w-full rounded-md border bg-white px-2 py-1 text-sm shadow-xs placeholder:font-medium placeholder:text-gray-500 dark:bg-[#212121] dark:placeholder:text-slate-400"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                        }
                      }}
                    />
                  </StandaloneSearchBox>
                )}
              </div>

              <div className="w-full">
                <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Map Preview
                </label>
                <div className="h-[200px] w-full overflow-hidden rounded-lg border border-gray-300 dark:border-gray-600">
                  {watch('location.coordinates')?.length === 2 ? (
                    <iframe
                      title="Venue Location Map"
                      src={`https://www.google.com/maps?q=${watch('location.coordinates')[0]},${watch('location.coordinates')[1]}&hl=es;z=14&output=embed`}
                      className="h-full w-full border-0"
                      referrerPolicy="no-referrer-when-downgrade"
                    ></iframe>
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-gray-400">
                      No location selected
                    </div>
                  )}
                </div>
              </div>

              <div className="flex justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleClose}
                  disabled={isLoading}
                  className="mr-2"
                >
                  Cancel
                </Button>

                {isLoading ? (
                  <Button
                    type="button"
                    disabled
                    className="cursor-pointer bg-blue-700 text-white hover:bg-blue-800"
                  >
                    <ButtonLoading title="Creating" />
                  </Button>
                ) : (
                  <Button
                    type="submit"
                    className="cursor-pointer bg-blue-700 text-white hover:bg-blue-800"
                    disabled={!methods.formState.isValid}
                  >
                    Add Venue
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

export default VenueTypeModal;
