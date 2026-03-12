'use client';

import ButtonLoading from '@/components/common/button-loading';
import Time24hInput from '@/components/common/time-24h-input';
import FormProvider, { RHFSelectField, RHFTextField } from '@/components/rhf';
import { RHFCustomCombobox } from '@/components/rhf/rhf-custom-combobox';
import RHFCustomDropdown from '@/components/rhf/rhf-custom-dropdown';
import RHFUploadAvatar from '@/components/rhf/rhf-upload-avatar';
import { Button } from '@/components/ui/button';
import { Calendar as UICalendar } from '@/components/ui/calendar';
import { Dialog, DialogContent, DialogHeader, DialogOverlay, DialogTitle } from '@/components/ui/dialog';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Skeleton } from '@/components/ui/skeleton';
import { useImageUpload } from '@/hooks/useImageUpload';
import { cn } from '@/lib/utils';
import {
  useAddNotificationMutation,
  useGetAllEventsQuery,
  useGetAllInterestTagsQuery,
  useGetAllOrganizatonsQuery,
} from '@/store/Reducer/notifications-api';
import { getErrorMessage } from '@/utils/api';
import { deleteFileFromAzure } from '@/utils/deleteFile';
import { extractAddress } from '@/utils/format-google-address';
import { showError, showSuccess } from '@/utils/toast';
import { yupResolver } from '@hookform/resolvers/yup';
import { Autocomplete, useJsApiLoader } from '@react-google-maps/api';
import { format } from 'date-fns';
import { Calendar, CalendarIcon, Clock, Link2, MapPin, Users } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import * as Yup from 'yup';
import { DEFAULT_AGE_MAX, DEFAULT_AGE_MIN, DEFAULT_LOCATION_RADIUS, DESTINATION_TYPE_OPTIONS, GENDER_OPTIONS } from './constants';
import { NotificationFormValues, SendTiming } from './types';

const GOOGLE_MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
const googleMapsLibraries: 'places'[] = ['places'];

const toLocalDateTimeInput = (value: Date) => {
  const year = value.getFullYear();
  const month = String(value.getMonth() + 1).padStart(2, '0');
  const day = String(value.getDate()).padStart(2, '0');
  const hours = String(value.getHours()).padStart(2, '0');
  const minutes = String(value.getMinutes()).padStart(2, '0');
  return `${year}-${month}-${day}T${hours}:${minutes}`;
};

const getDatePart = (dateTime?: string | Date) => {
  if (!dateTime) return '';
  const normalized = dateTime instanceof Date ? toLocalDateTimeInput(dateTime) : dateTime;
  const [datePart] = normalized.split('T');
  return datePart || '';
};

const getTimePart = (dateTime?: string | Date) => {
  if (!dateTime) return '';
  const normalized = dateTime instanceof Date ? toLocalDateTimeInput(dateTime) : dateTime;
  const parts = normalized.split('T');
  const timePart = parts[1] || '';
  return timePart.slice(0, 5);
};

const updateSplitDateTime = (datePart: string, timePart: string) => {
  if (!datePart || !timePart) return '';
  return `${datePart}T${timePart}`;
};

const parseDatePartToDate = (datePart?: string) => {
  if (!datePart) return undefined;
  const [year, month, day] = datePart.split('-').map(Number);
  if (!year || !month || !day) return undefined;
  return new Date(year, month - 1, day);
};

const formatDateForValue = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const schema = Yup.object().shape({
  title: Yup.string().required('Title is required').min(3, 'Title must be at least 3 characters'),
  message: Yup.string()
    .required('Message is required')
    .min(10, 'Message must be at least 10 characters')
    .max(200, 'Message must not exceed 200 characters'),
  image: Yup.mixed().nullable(),
  destinationType: Yup.string()
    .oneOf(['home', 'organization', 'event'] as const)
    .required('Destination type is required'),
  organizationId: Yup.string().when('destinationType', {
    is: 'organization',
    then: (schema) => schema.required('Please select an organization'),
    otherwise: (schema) => schema.notRequired(),
  }),
  eventId: Yup.string().when('destinationType', {
    is: 'event',
    then: (schema) => schema.required('Please select an event'),
    otherwise: (schema) => schema.notRequired(),
  }),
  sendTiming: Yup.string()
    .oneOf(['immediately', 'schedule'] as const)
    .required('Send timing is required'),
  scheduledDateTime: Yup.string().when('sendTiming', {
    is: 'schedule',
    then: (schema) => schema.required('Scheduled date and time is required'),
    otherwise: (schema) => schema.notRequired(),
  }),

  // Location
  locationEnabled: Yup.boolean(),
  locationFullAddress: Yup.string().when('locationEnabled', {
    is: true,
    then: (schema) => schema.required('Location address is required'),
    otherwise: (schema) => schema.notRequired(),
  }),
  locationCity: Yup.string(),
  locationState: Yup.string(),
  locationCountry: Yup.string(),
  locationLat: Yup.number()
    .transform((value, originalValue) => (originalValue === '' ? undefined : value))
    .when('locationEnabled', {
      is: true,
      then: (schema) => schema.required('Latitude is required').min(-90, 'Invalid latitude').max(90, 'Invalid latitude'),
      otherwise: (schema) => schema.notRequired(),
    }),
  locationLong: Yup.number()
    .transform((value, originalValue) => (originalValue === '' ? undefined : value))
    .when('locationEnabled', {
      is: true,
      then: (schema) => schema.required('Longitude is required').min(-180, 'Invalid longitude').max(180, 'Invalid longitude'),
      otherwise: (schema) => schema.notRequired(),
    }),
  locationRadius: Yup.number()
    .transform((value, originalValue) => (originalValue === '' ? undefined : value))
    .when('locationEnabled', {
      is: true,
      then: (schema) => schema.required('Radius is required').min(1, 'Radius must be at least 1 km').max(200, 'Radius cannot exceed 200 km'),
      otherwise: (schema) => schema.min(1, 'Radius must be at least 1 km').max(200, 'Radius cannot exceed 200 km'),
    }),

  // Age Range
  ageRangeEnabled: Yup.boolean(),
  ageMin: Yup.number()
    .transform((value, originalValue) => (originalValue === '' ? undefined : value))
    .when('ageRangeEnabled', {
      is: true,
      then: (schema) => schema.required('Minimum age is required').min(13, 'Minimum age must be at least 13').max(100, 'Invalid age'),
      otherwise: (schema) => schema.notRequired(),
    }),
  ageMax: Yup.number()
    .transform((value, originalValue) => (originalValue === '' ? undefined : value))
    .when('ageRangeEnabled', {
      is: true,
      then: (schema) =>
        schema
          .required('Maximum age is required')
          .min(13, 'Maximum age must be at least 13')
          .max(100, 'Invalid age')
          .test('age-range', 'Max age must be greater than min age', function (value) {
            const { ageMin } = this.parent;
            if (!value || !ageMin) return true;
            return value > ageMin;
          }),
      otherwise: (schema) => schema.notRequired(),
    }),

  // Gender
  genderEnabled: Yup.boolean(),
  genderValue: Yup.string().oneOf(['all', 'male', 'female', 'other'] as const),

  // Interests
  interestsEnabled: Yup.boolean(),
  selectedInterests: Yup.array().of(Yup.string()),
});

const defaultValues: NotificationFormValues = {
  title: '',
  message: '',
  image: null,
  destinationType: 'home',
  organizationId: '',
  eventId: '',
  sendTiming: 'immediately',
  scheduledDateTime: '',
  locationEnabled: false,
  locationFullAddress: '',
  locationCity: '',
  locationState: '',
  locationCountry: '',
  locationLat: 0,
  locationLong: 0,
  locationRadius: DEFAULT_LOCATION_RADIUS,
  ageRangeEnabled: false,
  ageMin: DEFAULT_AGE_MIN,
  ageMax: DEFAULT_AGE_MAX,
  genderEnabled: false,
  genderValue: 'all',
  interestsEnabled: false,
  selectedInterests: [],
};

interface NotificationModalProps {
  open: boolean;
  onClose: () => void;
  isEdit?: boolean;
  selectedData?: any | null;
}

export const NotificationModal: React.FC<NotificationModalProps> = ({ open, onClose, isEdit = false, selectedData }) => {
  const { uploadImage, uploading: imageUploading } = useImageUpload();
  const [deleting, setDeleting] = useState(false);
  const [scheduledDatePart, setScheduledDatePart] = useState('');
  const [scheduledTimePart, setScheduledTimePart] = useState('');
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);

  const [addNotification, { isLoading: addLoading }] = useAddNotificationMutation();

  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: GOOGLE_MAPS_API_KEY as string,
    libraries: googleMapsLibraries,
  });

  const { data: organizationsData, isLoading: isLoadingOrganizations } = useGetAllOrganizatonsQuery({
    page: 0,
    search: '',
    limit: '100',
    status: '',
  });

  const { data: eventData, isLoading: isLoadingEvents } = useGetAllEventsQuery({
    page: 0,
    search: '',
    limit: '100',
    status: '',
  });

  const { data: interestTagsData, isLoading: isLoadingInterestTags } = useGetAllInterestTagsQuery({
    page: 0,
    search: '',
    limit: '100',
    status: '',
  });

  const methods = useForm<NotificationFormValues>({
    resolver: yupResolver(schema) as any,
    defaultValues,
    mode: 'onChange',
  });

  const {
    reset,
    watch,
    setValue,
    formState: { isDirty },
    control,
  } = methods;

  const destinationType = watch('destinationType');
  const sendTiming = watch('sendTiming');
  const locationEnabled = watch('locationEnabled');
  const ageRangeEnabled = watch('ageRangeEnabled');
  const genderEnabled = watch('genderEnabled');
  const interestsEnabled = watch('interestsEnabled');
  const selectedInterests = watch('selectedInterests');
  const locationCoordinates = [watch('locationLat'), watch('locationLong')];
  const scheduledDateTime = watch('scheduledDateTime');

  const updateScheduledDateTime = (datePart: string, timePart: string) => {
    setScheduledDatePart(datePart);
    setScheduledTimePart(timePart);
    setValue('scheduledDateTime', updateSplitDateTime(datePart, timePart), {
      shouldValidate: true,
      shouldDirty: true,
    });
  };

  // Map API data to dropdown options
  const organizationOptions =
    organizationsData?.map((org: any) => ({
      label: org?.title || 'No Name',
      value: org?._id,
    })) || [];

  const eventOptions =
    eventData?.map((event: any) => ({
      label: event?.title || 'No Title',
      value: event?._id,
    })) || [];

  const interestOptions =
    interestTagsData?.map((interest: any) => ({
      label: interest?.title || 'No Title',
      value: interest?._id,
    })) || [];

  // Google Places Autocomplete handlers
  const onLoad = (autocomplete: google.maps.places.Autocomplete) => {
    autocompleteRef.current = autocomplete;
  };

  const onPlaceChanged = async () => {
    const place = autocompleteRef.current?.getPlace();
    if (place) {
      const address = await extractAddress(place);
      setValue('locationFullAddress', address.address_line_1 || '', { shouldValidate: true });
      setValue('locationCity', address.city || '', { shouldValidate: true });
      setValue('locationState', address.province || '', { shouldValidate: true });
      setValue('locationCountry', address.country || '', { shouldValidate: true });
      setValue('locationLat', address.latitude || 0, { shouldValidate: true });
      setValue('locationLong', address.longitude || 0, { shouldValidate: true });
    }
  };

  // Populate form in edit mode
  useEffect(() => {
    if (isEdit && selectedData && open) {
      // Edit mode population logic here if needed
      reset(defaultValues);
      setScheduledDatePart(getDatePart(defaultValues.scheduledDateTime));
      setScheduledTimePart(getTimePart(defaultValues.scheduledDateTime));
    } else if (open && !isEdit) {
      reset(defaultValues);
      setScheduledDatePart(getDatePart(defaultValues.scheduledDateTime));
      setScheduledTimePart(getTimePart(defaultValues.scheduledDateTime));
    }
  }, [isEdit, selectedData, open, reset]);

  useEffect(() => {
    if (!open) return;
    setScheduledDatePart(getDatePart(scheduledDateTime));
    setScheduledTimePart(getTimePart(scheduledDateTime));
  }, [open, scheduledDateTime]);

  const transformToPayload = (formData: NotificationFormValues) => {
    const payload: any = {
      destinationType: formData.destinationType,
      title: formData.title,
      message: formData.message,
      sendTiming: formData.sendTiming,
    };

    // Add destination-specific fields
    if (formData.destinationType === 'organization' && formData.organizationId) {
      payload.organizationId = formData.organizationId;
    }

    if (formData.destinationType === 'event' && formData.eventId) {
      payload.eventId = formData.eventId;
    }
    // Add scheduled date time if needed
    if (formData.sendTiming === 'schedule' && formData.scheduledDateTime) {
      const date = new Date(formData.scheduledDateTime);
      // Format as "YYYY-MM-DD hh:mm AM/PM"
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      let hours = date.getHours();
      const minutes = String(date.getMinutes()).padStart(2, '0');
      const ampm = hours >= 12 ? 'PM' : 'AM';
      hours = hours % 12;
      hours = hours === 0 ? 12 : hours;
      const hourStr = String(hours).padStart(2, '0');
      payload.scheduledDateTime = `${year}-${month}-${day} ${hourStr}:${minutes} ${ampm}`;
    }

    // Add location if enabled
    if (formData.locationEnabled && formData.locationFullAddress) {
      payload.location = {
        city: formData.locationCity,
        lat: formData.locationLat,
        long: formData.locationLong,
        radius: formData.locationRadius,
      };
    }

    // Add age range if enabled
    if (formData.ageRangeEnabled && formData.ageMin && formData.ageMax) {
      payload.ageRange = [formData.ageMin, formData.ageMax];
    }

    // Add gender if enabled and not 'all'
    if (formData.genderEnabled && formData.genderValue && formData.genderValue !== 'all') {
      payload.gender = formData.genderValue;
    }

    // Add interests if enabled
    if (formData.interestsEnabled && formData.selectedInterests && formData.selectedInterests.length > 0) {
      payload.interests = formData.selectedInterests;
    }

    return payload;
  };

  const handleSubmit = async (formData: NotificationFormValues) => {
    let uploadedFileKey: string | null = null;

    // Check that image is uploaded
    if (!formData.image || (formData.image instanceof FileList && formData.image.length === 0)) {
      showError('Please upload a notification image.');
      return;
    }

    try {
      // Upload image if provided

      if (formData.image instanceof FileList && formData.image.length > 0) {
        const file = formData.image[0];
        uploadedFileKey = await uploadImage(file);
      }

      // Build payload
      const payload = transformToPayload(formData);

      if (!payload) return;

      // Add image if uploaded
      if (uploadedFileKey) {
        payload.image = uploadedFileKey;
      }

      const response = await addNotification(payload).unwrap();

      if (!response) {
        showError('No response from server. Please try again later.');
        return;
      }

      if (response?.error) {
        showError(getErrorMessage(response.error));
        return;
      }

      showSuccess(response?.message || 'Notification created successfully');

      reset(defaultValues);
      onClose();
    } catch (error) {
      // Clean up uploaded image on error
      if (uploadedFileKey) {
        setDeleting(true);
        try {
          await deleteFileFromAzure(uploadedFileKey);
        } catch (deleteError) {
          console.error('Failed to delete uploaded file:', deleteError);
        } finally {
          setDeleting(false);
        }
      }

      const errorMessage = getErrorMessage(error);
      showError(errorMessage);
    }
  };

  const handleClose = () => {
    reset(defaultValues);
    setScheduledDatePart('');
    setScheduledTimePart('');
    onClose();
  };

  const isLoading = addLoading || imageUploading || deleting;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogOverlay className="bg-opacity-30 fixed inset-0">
        <DialogContent
          aria-describedby={undefined}
          className="dark:bg-secondary mx-auto flex max-h-[90vh] min-h-[45vh] w-full flex-col items-center overflow-y-auto md:max-w-[700px]!"
          onInteractOutside={(event) => {
            const target = event.target as HTMLElement;
            if (target.closest('.pac-container')) {
              event.preventDefault();
            }
          }}
        >
          <DialogHeader>
            <DialogTitle>{isEdit ? 'Edit Notification' : 'Create Global Notification'}</DialogTitle>
          </DialogHeader>

          <div className="w-full">
            <FormProvider methods={methods} onSubmit={methods.handleSubmit(handleSubmit)}>
              <div className="mt-6 flex w-full flex-col gap-6">
                {/* Content Section */}
                <div className="space-y-4">
                  <RHFUploadAvatar name="image" label="Notification Image (Optional)" />

                  <div className="grid grid-cols-1 gap-4">
                    <RHFTextField name="title" label="Title" placeholder="e.g., Weekend Sale - 30% Off!" />

                    <RHFTextField
                      className="capitalize"
                      name="message"
                      label="Message"
                      placeholder="Enter your notification message..."
                      multiline
                      rows={3}
                    />
                  </div>

                  <div className="rounded-lg bg-amber-50 p-3 dark:bg-amber-900/20">
                    <p className="text-xs text-amber-800 dark:text-amber-300">💡 Keep your message concise and engaging. Maximum 200 characters.</p>
                  </div>
                </div>

                {/* Destination Section */}
                <div className="space-y-4 border-t border-gray-200 pt-6 dark:border-gray-700">
                  <h4 className="flex items-center gap-2 font-semibold text-gray-900 dark:text-gray-100">
                    <Link2 className="h-5 w-5" />
                    Destination
                  </h4>

                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <RHFSelectField
                      name="destinationType"
                      label="Destination Type"
                      placeholder="Select destination"
                      options={DESTINATION_TYPE_OPTIONS}
                    />

                    {destinationType === 'organization' && (
                      <>
                        {isLoadingOrganizations ? (
                          <div className="space-y-2">
                            <Skeleton className="ml-1 h-3 w-20" />
                            <Skeleton className="h-10" />
                          </div>
                        ) : (
                          <RHFCustomDropdown
                            name="organizationId"
                            label="Select Organization"
                            placeholder="Choose organization"
                            options={organizationOptions}
                            isLoading={isLoadingOrganizations}
                            showNone={false}
                          />
                        )}
                      </>
                    )}

                    {destinationType === 'event' && (
                      <>
                        {isLoadingEvents ? (
                          <div className="space-y-2">
                            <Skeleton className="ml-1 h-3 w-20" />
                            <Skeleton className="h-10" />
                          </div>
                        ) : (
                          <RHFCustomDropdown
                            name="eventId"
                            label="Select Event"
                            placeholder="Choose event"
                            options={eventOptions}
                            isLoading={isLoadingEvents}
                            showNone={false}
                          />
                        )}
                      </>
                    )}
                  </div>
                </div>

                {/* User Targeting Section */}
                <div className="space-y-4 border-t border-gray-200 pt-6 dark:border-gray-700">
                  <div className="mb-4 flex items-center justify-between">
                    <h4 className="flex items-center gap-2 font-semibold text-gray-900 dark:text-gray-100">
                      <Users className="h-5 w-5" />
                      User Targeting <span className="text-sm font-normal text-gray-500 dark:text-gray-400">(Optional)</span>
                    </h4>
                    <div className="rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
                      {[locationEnabled, ageRangeEnabled, genderEnabled, interestsEnabled].filter(Boolean).length} filters active
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-4">
                    {/* Location Filter */}
                    <div
                      className={`rounded-lg border-2 bg-gray-50/50 p-4 transition-all dark:bg-gray-800/30 ${
                        locationEnabled ? 'border-blue-300 dark:border-blue-700' : 'border-gray-200 dark:border-gray-700'
                      }`}
                    >
                      <label className={`${locationEnabled ? 'mb-3' : ''} flex cursor-pointer items-center justify-between`}>
                        <div className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={locationEnabled}
                            onChange={(e) => setValue('locationEnabled', e.target.checked)}
                            className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700"
                          />
                          <MapPin className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                          <span className="font-medium text-gray-900 dark:text-gray-100">Location</span>
                        </div>
                        {locationEnabled && (
                          <span className="rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-800 dark:bg-blue-900/50 dark:text-blue-300">
                            Active
                          </span>
                        )}
                      </label>
                      {locationEnabled && (
                        <div className="mt-3 space-y-3">
                          {/* Google Places Autocomplete */}
                          <div className="w-full">
                            <label htmlFor="location-input" className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                              Location Address
                            </label>
                            {isLoaded && (
                              <Controller
                                name="locationFullAddress"
                                control={control}
                                render={({ field }) => (
                                  <Autocomplete onLoad={onLoad} onPlaceChanged={onPlaceChanged}>
                                    <input
                                      id="location-input"
                                      type="text"
                                      placeholder="Enter Location"
                                      value={field.value || ''}
                                      className="h-10 w-full rounded-md border bg-white px-3 py-2 text-sm shadow-xs placeholder:font-medium placeholder:text-gray-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none dark:border-gray-700 dark:bg-[#212121] dark:placeholder:text-slate-400"
                                      onChange={(e) => field.onChange(e.target.value)}
                                      onKeyDown={(e) => e.key === 'Enter' && e.preventDefault()}
                                    />
                                  </Autocomplete>
                                )}
                              />
                            )}
                          </div>

                          {/* Radius */}
                          <RHFTextField name="locationRadius" label="Radius (km)" type="number" placeholder="50" min="1" max="200" />

                          {/* Map Preview */}
                          {locationCoordinates[0] !== 0 && locationCoordinates[1] !== 0 && (
                            <div className="w-full">
                              <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">Map Preview</label>
                              <div className="h-[200px] w-full overflow-hidden rounded-lg border border-gray-300 dark:border-gray-600">
                                <iframe
                                  title="Notification Location Map"
                                  src={`https://www.google.com/maps?q=${locationCoordinates[0]},${locationCoordinates[1]}&hl=es;z=14&output=embed`}
                                  className="h-full w-full border-0"
                                  referrerPolicy="no-referrer-when-downgrade"
                                ></iframe>
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Age Range Filter */}
                    <div
                      className={`rounded-lg border-2 bg-gray-50/50 p-4 transition-all dark:bg-gray-800/30 ${
                        ageRangeEnabled ? 'border-purple-300 dark:border-purple-700' : 'border-gray-200 dark:border-gray-700'
                      }`}
                    >
                      <label className={`${ageRangeEnabled ? 'mb-3' : ''} flex cursor-pointer items-center justify-between`}>
                        <div className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={ageRangeEnabled}
                            onChange={(e) => setValue('ageRangeEnabled', e.target.checked)}
                            className="h-4 w-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500 dark:border-gray-600 dark:bg-gray-700"
                          />
                          <Calendar className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                          <span className="font-medium text-gray-900 dark:text-gray-100">Age Range</span>
                        </div>
                        {ageRangeEnabled && (
                          <span className="rounded-full bg-purple-100 px-2 py-0.5 text-xs font-medium text-purple-800 dark:bg-purple-900/50 dark:text-purple-300">
                            Active
                          </span>
                        )}
                      </label>
                      {ageRangeEnabled && (
                        <div className="mt-3 grid grid-cols-2 gap-2">
                          <RHFTextField name="ageMin" label="Min Age" type="number" placeholder="18" min="13" max="100" />
                          <RHFTextField name="ageMax" label="Max Age" type="number" placeholder="65" min="13" max="100" />
                        </div>
                      )}
                    </div>

                    {/* Gender Filter */}
                    <div
                      className={`rounded-lg border-2 bg-gray-50/50 p-4 transition-all dark:bg-gray-800/30 ${
                        genderEnabled ? 'border-pink-300 dark:border-pink-700' : 'border-gray-200 dark:border-gray-700'
                      }`}
                    >
                      <label className={`${genderEnabled ? 'mb-3' : ''} flex cursor-pointer items-center justify-between`}>
                        <div className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={genderEnabled}
                            onChange={(e) => setValue('genderEnabled', e.target.checked)}
                            className="h-4 w-4 rounded border-gray-300 text-pink-600 focus:ring-pink-500 dark:border-gray-600 dark:bg-gray-700"
                          />
                          <Users className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                          <span className="font-medium text-gray-900 dark:text-gray-100">Gender</span>
                        </div>
                        {genderEnabled && (
                          <span className="rounded-full bg-pink-100 px-2 py-0.5 text-xs font-medium text-pink-800 dark:bg-pink-900/50 dark:text-pink-300">
                            Active
                          </span>
                        )}
                      </label>
                      {genderEnabled && (
                        <div className="mt-3">
                          <RHFSelectField name="genderValue" placeholder="Select gender" options={GENDER_OPTIONS} />
                        </div>
                      )}
                    </div>

                    {/* Interests Filter */}
                    <div
                      className={`rounded-lg border-2 bg-gray-50/50 p-4 transition-all dark:bg-gray-800/30 ${
                        interestsEnabled ? 'border-green-300 dark:border-green-700' : 'border-gray-200 dark:border-gray-700'
                      }`}
                    >
                      <label className={`${interestsEnabled ? 'mb-3' : ''} flex cursor-pointer items-center justify-between`}>
                        <div className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={interestsEnabled}
                            onChange={(e) => setValue('interestsEnabled', e.target.checked)}
                            className="h-4 w-4 rounded border-gray-300 text-green-600 focus:ring-green-500 dark:border-gray-600 dark:bg-gray-700"
                          />
                          <span className="text-xl">🎯</span>
                          <span className="font-medium text-gray-900 dark:text-gray-100">Interests</span>
                        </div>
                        {interestsEnabled && selectedInterests && selectedInterests.length > 0 && (
                          <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-800 dark:bg-green-900/50 dark:text-green-300">
                            {selectedInterests.length} selected
                          </span>
                        )}
                      </label>
                      {interestsEnabled && (
                        <>
                          {isLoadingInterestTags ? (
                            <div className="mt-3 space-y-2">
                              <Skeleton className="h-10 w-full" />
                            </div>
                          ) : (
                            <div className="mt-3">
                              <RHFCustomCombobox
                                name="selectedInterests"
                                label=""
                                placeholder="Select Interests"
                                className="w-full"
                                multiple={true}
                                allowCustom={false}
                                options={interestOptions}
                              />
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* Timing Section */}
                <div className="space-y-4 border-t border-gray-200 pt-6 dark:border-gray-700">
                  <h4 className="flex items-center gap-2 font-semibold text-gray-900 dark:text-gray-100">
                    <Clock className="h-5 w-5" />
                    Send Timing
                  </h4>

                  <div className="flex gap-4">
                    <label className="flex cursor-pointer items-center gap-2 rounded-lg border-2 border-gray-200 bg-white px-4 py-3 transition-all hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700">
                      <input
                        type="radio"
                        value="immediately"
                        checked={sendTiming === 'immediately'}
                        onChange={(e) => setValue('sendTiming', e.target.value as SendTiming)}
                        className="h-4 w-4 border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="font-medium text-gray-900 dark:text-gray-100">Send Immediately</span>
                    </label>
                    <label className="flex cursor-pointer items-center gap-2 rounded-lg border-2 border-gray-200 bg-white px-4 py-3 transition-all hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700">
                      <input
                        type="radio"
                        value="schedule"
                        checked={sendTiming === 'schedule'}
                        onChange={(e) => setValue('sendTiming', e.target.value as SendTiming)}
                        className="h-4 w-4 border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="font-medium text-gray-900 dark:text-gray-100">Schedule</span>
                    </label>
                  </div>

                  {sendTiming === 'schedule' && (
                    <Controller
                      name="scheduledDateTime"
                      control={control}
                      render={({ fieldState }) => {
                        const selectedDate = parseDatePartToDate(scheduledDatePart);

                        return (
                          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            <div>
                              <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Scheduled Date</label>
                              <Popover>
                                <PopoverTrigger asChild>
                                  <Button
                                    variant="outline"
                                    className={cn('w-full justify-start text-left font-normal', !selectedDate && 'text-muted-foreground')}
                                  >
                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                    {selectedDate ? format(selectedDate, 'PPP') : <span>Pick a date</span>}
                                  </Button>
                                </PopoverTrigger>
                                <PopoverContent className="dark:bg-secondary w-auto p-0" align="start">
                                  <UICalendar
                                    mode="single"
                                    selected={selectedDate}
                                    onSelect={(date) => updateScheduledDateTime(date ? formatDateForValue(date) : '', scheduledTimePart)}
                                  />
                                </PopoverContent>
                              </Popover>
                            </div>
                            <div>
                              <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Scheduled Time</label>
                              <Time24hInput
                                title="Scheduled time"
                                value={scheduledTimePart}
                                onChange={(value) => updateScheduledDateTime(scheduledDatePart, value)}
                                placeholder="HH:mm"
                                className="w-full"
                              />
                            </div>
                            {fieldState.error && <p className="text-xs text-red-500 md:col-span-2">{fieldState.error.message}</p>}
                          </div>
                        );
                      }}
                    />
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-6 flex items-center justify-center gap-3 border-t border-gray-200 pt-6 dark:border-gray-700">
                <Button type="button" variant="outline" onClick={handleClose} className="px-6" disabled={isLoading}>
                  Cancel
                </Button>

                {isLoading ? (
                  <Button type="button" disabled className="bg-primary hover:bg-primary cursor-not-allowed px-6 text-white">
                    <ButtonLoading title={isEdit ? 'Updating' : sendTiming === 'immediately' ? 'Sending' : 'Scheduling'} />
                  </Button>
                ) : (
                  <Button
                    type="submit"
                    className="bg-primary hover:bg-primary-dark cursor-pointer px-6 text-white"
                    disabled={isEdit ? !isDirty : false}
                  >
                    {isEdit ? 'Update Notification' : sendTiming === 'immediately' ? 'Send Now' : 'Schedule Notification'}
                  </Button>
                )}
              </div>
            </FormProvider>
          </div>
        </DialogContent>
      </DialogOverlay>
    </Dialog>
  );
};
