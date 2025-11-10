'use client';

import ButtonLoading from '@/components/common/button-loading';
import FormProvider, { RHFSelectField, RHFTextField } from '@/components/rhf';
import RHFCustomDropdown from '@/components/rhf/rhf-custom-dropdown';
import RHFUploadButton from '@/components/rhf/rhf-upload-button';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogOverlay, DialogTitle } from '@/components/ui/dialog';
import { noImageUrl, noImageUrlDev } from '@/constant/constant';
import { useGetOrganizationQuery } from '@/store/Reducer/organization';
import { useGetVenueTypesQuery } from '@/store/Reducer/venueType';
import { extractAddress } from '@/utils/format-google-address';
import { yupResolver } from '@hookform/resolvers/yup';
import { Autocomplete, useJsApiLoader } from '@react-google-maps/api';
import React, { useRef } from 'react';
import { Controller, useForm } from 'react-hook-form';
import * as Yup from 'yup';

interface CreateVenueModalProps {
  open: boolean;
  onClose: () => void;
  editMode?: boolean;
  isLoading?: boolean;
  methods: any;
  onSubmit: (data: any) => void;
  selectedVenueType?: any;
  buttonType?: 'button' | 'submit';
}

const GOOGLE_MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
const googleMapsLibraries: 'places'[] = ['places'];

const VenueTypeModal = ({
  open,
  onClose,
  editMode,
  methods: defaultMethods,
  onSubmit,
  isLoading,
  selectedVenueType,
  buttonType = 'submit',
}: CreateVenueModalProps) => {
  const handleClose = () => {
    if (!isLoading) {
      onClose();
    }
  };

  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);

  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: GOOGLE_MAPS_API_KEY as string,
    libraries: googleMapsLibraries,
  });

  const schema = Yup.object().shape({
    title: Yup.string().required('Venue name is required'),
    venueType: Yup.string().required('Venue Type is required'),
    organization: Yup.string().required('Organization is required'),
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

  const internalMethods = useForm({
    resolver: yupResolver(schema),
    defaultValues: defaultValues,
  });
  const methods = defaultMethods || internalMethods;

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
        // coordinates: [address.latitude || 0, address.longitude || 0],
        coordinates: [address.longitude || 0, address.latitude || 0],
      };
      console.log('Setting location payload:', locationPayload);
      methods.setValue('location', locationPayload, { shouldValidate: true });
    }
  };

  const { data: apiData, isLoading: venueLoading } = useGetVenueTypesQuery({
    page: 0,
    search: '',
    limit: '10000',
    status: '',
  });

  const { data: orgData, isLoading: orgLoading } = useGetOrganizationQuery({
    page: 0,
    search: '',
    limit: '10000',
    status: '',
  });

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
            <DialogTitle className="text-lg font-semibold">{editMode ? 'Edit Venue' : 'Create Venue'}</DialogTitle>
            <DialogDescription className="sr-only">
              {!editMode ? 'Fill in the details below to create a new venue.' : 'Update the venue information below.'}
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

              <RHFCustomDropdown
                name="venueType"
                label="Venue Type"
                placeholder="Select Venue Type"
                options={venueTypeOptions}
                isLoading={venueLoading}
              />

              <RHFCustomDropdown
                name="organization"
                label="Organization"
                placeholder="Select Organization"
                options={organizationOptions}
                isLoading={orgLoading}
              />

              {editMode && (
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
              <div className="flex max-w-[10rem] items-center justify-start">
                <RHFUploadButton
                  name="floorPlan"
                  label="Upload Floor Plan"
                  initialImage={
                    editMode
                      ? selectedVenueType?.floorPlanInfo?.url &&
                        selectedVenueType.floorPlanInfo.url !== noImageUrl &&
                        selectedVenueType.floorPlanInfo.url !== noImageUrlDev
                        ? selectedVenueType.floorPlanInfo.url
                        : null
                      : null
                  }
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
                          className="mt-2 h-[40px] w-full rounded-md border bg-white px-2 py-1 text-sm shadow-xs placeholder:font-medium placeholder:text-gray-500 dark:bg-[#212121] dark:placeholder:text-slate-400"
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
                  {methods.watch('location.coordinates')?.length === 2 ? (
                    <iframe
                      title="Venue Location Map"
                      src={`https://www.google.com/maps?q=${methods.watch('location.coordinates')[0]},${methods.watch('location.coordinates')[1]}&hl=es;z=14&output=embed`}
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
                    <ButtonLoading title={editMode ? 'Updating' : 'Creating'} />
                  </Button>
                ) : (
                  <Button
                    type={buttonType}
                    onClick={buttonType === 'button' ? methods.handleSubmit(onSubmit) : undefined}
                    className="cursor-pointer bg-blue-700 text-white hover:bg-blue-800"
                    disabled={isLoading || !methods.formState.isValid}
                  >
                    {editMode ? 'Update Venue' : 'Add Venue'}
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
