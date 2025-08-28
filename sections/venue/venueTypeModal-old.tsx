'use client';

import FormProvider, { RHFTextField } from '@/components/rhf';
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
import { useState } from 'react';
import { Controller } from 'react-hook-form';
import { LoadScript } from '@react-google-maps/api';
import dynamic from 'next/dynamic';
const PlacesAutocomplete = dynamic(
  () => import('@/components/google/PlacesAutocomplete'),
  { ssr: false }
);

interface CreateVenueModalProps {
  open: boolean;
  onClose: () => void;
  editMode: boolean;
  isLoading: boolean;
  methods: any;
  onSubmit: (data: any) => void;
  selectedVenueType?: any;
}

const GOOGLE_MAPS_API_KEY = process.env.NEXT_PUBLIC_SAMPLE_GOOGLE_MAPS_API_KEY;
const googleMapsLibraries = ['places'] as any;

const VenueTypeModalOld = ({
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

  const [address, setAddress] = useState<string>('');

  const { control, setValue, formState } = methods || {};
  const errors = formState?.errors || {};

  const { data: apiData } = useGetVenueTypesQuery({
    page: 0,
    search: '',
    limit: '100',
    status: '',
  });

  const venueTypeOptions = (apiData?.data || []).map((v: any) => ({
    value: v._id,
    label: v.title,
  }));

  const organizationOptions = [
    { label: 'Organization A', value: 'org-a' },
    { label: 'Organization B', value: 'org-b' },
    { label: 'Organization C', value: 'org-c' },
  ];

  // inline definition removed; using reusable component via dynamic import below

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

              {/* FLOOR IMAGE UPLOAD */}
              <div className="flex max-w-[10rem] items-center justify-start">
                <RHFUploadButton
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
                />
              </div>

              <div>
                <LoadScript
                  googleMapsApiKey={GOOGLE_MAPS_API_KEY as string}
                  libraries={googleMapsLibraries}
                >
                  {/* <Controller
                    name="location"
                    control={control}
                    defaultValue={''}
                    render={({ field }) => (
                      <Autocomplete
                        onLoad={(autocomplete) =>
                          (autocompleteRef.current = autocomplete)
                        }
                        onPlaceChanged={() => {
                          const place = autocompleteRef.current?.getPlace();
                          if (place) {
                            const formatted =
                              place.formatted_address || place.name || '';
                            setAddress(formatted);
                            console.log('Google Place result:', place);
                            // update the visible input DOM value (helps when input is controlled)
                            if (inputRef.current)
                              inputRef.current.value = formatted;
                            // update react-hook-form field so input shows selected value
                            if (field && field.onChange)
                              field.onChange(formatted);
                            if (setValue)
                              setValue('location', formatted, {
                                shouldValidate: true,
                              });
                          }
                        }}
                      >
                        <input
                          {...field}
                          ref={inputRef}
                          value={field.value ?? ''}
                          placeholder="Enter location"
                          className={`w-full rounded border px-3 py-2 text-sm focus:ring-1 focus:ring-blue-500 focus:outline-none ${
                            errors.location
                              ? 'border-red-400'
                              : 'border-gray-300'
                          }`}
                        />
                      </Autocomplete>
                    )}
                  /> */}

                  <Controller
                    name="location"
                    control={control}
                    defaultValue=""
                    render={({ field }) => (
                      <PlacesAutocomplete
                        value={field.value}
                        onChange={(v: string) => field.onChange(v)}
                        onBlur={() => field.onBlur()}
                        placeholder="Enter location"
                        className={`w-full rounded border px-3 py-2 text-sm focus:ring-1 focus:ring-blue-500 focus:outline-none ${
                          errors.location ? 'border-red-400' : 'border-gray-300'
                        }`}
                        setValue={setValue}
                        name="location"
                        onPlaceSelected={(place: any) => {
                          const formatted =
                            place?.formatted_address || place?.name || '';
                          setAddress(formatted);
                          console.log('Google Place result:', place);
                        }}
                        error={errors.location}
                      />
                    )}
                  />

                  {/* Quick map preview address text for visual confirmation */}
                  {address ? (
                    <div className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                      Selected: {address}
                    </div>
                  ) : null}
                </LoadScript>
              </div>

              {/* <RHFTextField
                name="location"
                label="Location"
                placeholder="Enter Location"
              /> */}

              {/* <div className="w-full">
                <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Map Preview
                </label>
                <div className="h-[200px] w-full overflow-hidden rounded-lg border border-gray-300 dark:border-gray-600">
                  <iframe
                    title="Venue Location Map"
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d463.9634089519931!2d14.611164251664785!3d45.23098434778954!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x476363d3cb88c945%3A0x7b1900b8b651a903!2sObala!5e1!3m2!1sen!2s!4v1752833828572!5m2!1sen!2s"
                    className="h-full w-full border-0"
                    referrerPolicy="no-referrer-when-downgrade"
                  ></iframe>
                </div>
              </div> */}

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
                <Button
                  type="submit"
                  className="cursor-pointer bg-blue-700 text-white hover:bg-blue-800"
                  disabled={isLoading}
                >
                  {editMode ? 'Update Venue' : 'Add Venue'}
                </Button>
              </div>
            </div>
          </FormProvider>
        </DialogContent>
      </DialogOverlay>
    </Dialog>
  );
};

export default VenueTypeModalOld;
