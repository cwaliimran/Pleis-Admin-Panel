'use client';

import ButtonLoading from '@/components/common/button-loading';
import FormProvider, { RHFSelectField, RHFTextField } from '@/components/rhf';
import RHFTextfieldWithSelect from '@/components/rhf/rhf-text-field-with-select';
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
import { useGetVenueTypesQuery } from '@/store/Reducer/venueType';
import { extractAddress } from '@/utils/format-google-address';
import { StandaloneSearchBox, useJsApiLoader } from '@react-google-maps/api';
import { useRef } from 'react';

interface CreateVenueModalProps {
  open: boolean;
  onClose: () => void;
  editMode: boolean;
  isLoading: boolean;
  methods: any;
  onSubmit: (data: any) => void;
  selectedVenueType?: any;
}

// PLEIS CLIENT
// const GOOGLE_MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

// PLEIS CLIENT
const GOOGLE_MAPS_API_KEY = process.env.NEXT_PUBLIC_SAMPLE_GOOGLE_MAPS_API_KEY;
const googleMapsLibraries = ['places'] as any;

const VenueTypeModal = ({
  open,
  onClose,
  editMode,
  methods,
  onSubmit,
  isLoading,
  selectedVenueType,
}: CreateVenueModalProps) => {
  const handleClose = () => {
    if (!isLoading) {
      onClose();
    }
  };

  const inputref = useRef<google.maps.places.SearchBox | null>(null);

  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: GOOGLE_MAPS_API_KEY as any,
    libraries: googleMapsLibraries,
  });

  const handleOnPlacesChanged = async () => {
    const places = inputref.current?.getPlaces();
    if (places && places.length > 0) {
      const address = await extractAddress(places[0]);

      // Build location object
      const locationPayload = {
        fullAddress: address.address_line_1 || '',
        state: address.province || '',
        city: address.city || '',
        postalCode: address.postal_code || '',
        country: address.country || '',
        coordinates: [address.latitude, address.longitude],
      };

      console.log('Extracted address payload:', locationPayload);

      methods.setValue('location', locationPayload, { shouldValidate: true });
    }
  };

  const { data: apiData } = useGetVenueTypesQuery({
    page: 0,
    search: '',
    limit: '100',
    status: '',
  });

  const venueTypeOptions = (apiData?.data || []).map((v: any) => ({
    value: v._id.toString(),
    label: v.title,
  }));

  const organizationOptions = [
    { label: 'Organization A', value: 'org-a' },
    { label: 'Organization B', value: 'org-b' },
    { label: 'Organization C', value: 'org-c' },
  ];

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogOverlay className="bg-opacity-30 fixed inset-0 flex w-full items-center justify-center md:w-lg">
        <DialogContent className="mx-auto max-h-[90vh] min-h-[60vh] overflow-y-auto dark:bg-[#171717]">
          <DialogHeader className="flex flex-row items-center justify-between">
            <DialogTitle className="text-lg font-semibold">
              {editMode ? 'Edit Venue' : 'Create Venue'}
            </DialogTitle>
            <DialogDescription className="sr-only">
              {!editMode
                ? 'Fill in the details below to create a new venue.'
                : 'Update the venue information below.'}
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

              <RHFTextfieldWithSelect
                name="venueType"
                label="Venue Type"
                placeholder="Select Venue Type"
                options={venueTypeOptions}
              />

              <RHFTextfieldWithSelect
                name="organization"
                label="Organization"
                placeholder="Select Organization"
                options={organizationOptions}
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
                {/* <RHFUploadButton
                  name="floorPlan"
                  label="Upload"
                  initialImage={(() => {
                    if (!editMode) return null;
                    const img =
                      methods.getValues('floorPlan') &&
                      typeof methods.getValues('floorPlan') === 'string'
                        ? methods.getValues('floorPlan')
                        : selectedVenueType?.imageInfo?.url;
                    if (
                      !img ||
                      img ===
                        'https://pleisstorage.blob.core.windows.net/pleisappcontainer/noimage.png'
                    ) {
                      return null;
                    }
                    return img;
                  })()}
                /> */}

                <RHFUploadButton
                  name="floorPlan"
                  label="Upload"
                  initialImage={
                    editMode
                      ? selectedVenueType?.floorPlanInfo?.url &&
                        selectedVenueType.floorPlanInfo.url !==
                          'https://pleisstorage.blob.core.windows.net/pleisappcontainer/noimage.png'
                        ? selectedVenueType.floorPlanInfo.url
                        : null
                      : null
                  }
                />
              </div>

              <div className="input">
                <label htmlFor="address" className="text-sm">
                  Location
                </label>

                {isLoaded && (
                  <StandaloneSearchBox
                    onLoad={(searchBox) => {
                      inputref.current = searchBox;
                    }}
                    onPlacesChanged={handleOnPlacesChanged}
                  >
                    <input
                      id="address"
                      type="text"
                      placeholder="Enter Location"
                      defaultValue={
                        editMode
                          ? selectedVenueType?.location?.fullAddress || ''
                          : methods.getValues('location.fullAddress')
                      }
                      className="mt-2 h-[40px] w-full rounded-md border bg-white px-2 py-1 text-sm shadow-xs placeholder:font-medium placeholder:text-gray-500 dark:bg-[#212121] dark:placeholder:text-slate-400"
                    />
                  </StandaloneSearchBox>
                )}
              </div>

              <div className="w-full">
                <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Map Preview
                </label>
                <div className="h-[200px] w-full overflow-hidden rounded-lg border border-gray-300 dark:border-gray-600">
                  {methods.watch('location.coordinates')?.length === 2 ? (
                    <iframe
                      title="Venue Location Map"
                      src={`https://www.google.com/maps?q=${methods.watch('location.coordinates')[0]},${methods.watch('location.coordinates')[1]}&hl=es;z=14&output=embed`}
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
                    <ButtonLoading title={editMode ? 'Updating' : 'Creating'} />
                  </Button>
                ) : (
                  <Button
                    type="submit"
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
