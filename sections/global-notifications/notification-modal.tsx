'use client';

import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { Dialog, DialogContent, DialogHeader, DialogOverlay, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import FormProvider, { RHFSelectField, RHFTextField } from '@/components/rhf';
import RHFUploadAvatar from '@/components/rhf/rhf-upload-avatar';
import RHFCustomDropdown from '@/components/rhf/rhf-custom-dropdown';
import ButtonLoading from '@/components/common/button-loading';
import { useImageUpload } from '@/hooks/useImageUpload';
import { showError, showSuccess } from '@/utils/toast';
import { getErrorMessage } from '@/utils/api';
import { deleteFileFromAzure } from '@/utils/deleteFile';
import { Link2, Clock } from 'lucide-react';
import { NotificationFormValues, Notification, DestinationType } from './types';
import { DESTINATION_TYPE_OPTIONS, GENDER_OPTIONS, INTERESTS_OPTIONS, DEFAULT_LOCATION_RADIUS, DEFAULT_AGE_MIN, DEFAULT_AGE_MAX } from './constants';
import { MOCK_ORGANIZATIONS, MOCK_EVENTS } from './mock-data';
// import { useAddNotificationMutation, useUpdateNotificationMutation } from '@/store/Reducer/notifications-api';
// import { useGetOrganizationsQuery } from '@/store/Reducer/organizations-api';
// import { useGetEventsQuery } from '@/store/Reducer/events-api';

const schema = Yup.object().shape({
  title: Yup.string().required('Title is required').min(3, 'Title must be at least 3 characters'),
  message: Yup.string()
    .required('Message is required')
    .min(10, 'Message must be at least 10 characters')
    .max(200, 'Message must not exceed 200 characters'),
  image: Yup.mixed().nullable(),
  destinationType: Yup.string()
    .oneOf(['none', 'organization', 'event'] as const)
    .required('Destination type is required'),
  destinationId: Yup.string().when('destinationType', {
    is: (val: DestinationType) => val === 'organization' || val === 'event',
    then: (schema) => schema.required('Please select a destination'),
    otherwise: (schema) => schema,
  }),
  destinationName: Yup.string(),
  sendTime: Yup.string()
    .oneOf(['immediate', 'scheduled'] as const)
    .required('Send time is required'),
  scheduledDateTime: Yup.string().when('sendTime', {
    is: 'scheduled',
    then: (schema) => schema.required('Scheduled date and time is required'),
    otherwise: (schema) => schema,
  }),

  // Targeting fields
  locationEnabled: Yup.boolean(),
  locationName: Yup.string().when('locationEnabled', {
    is: true,
    then: (schema) => schema.required('Location is required'),
    otherwise: (schema) => schema,
  }),
  locationRadius: Yup.number()
    .transform((value, originalValue) => (originalValue === '' ? undefined : value))
    .when('locationEnabled', {
      is: true,
      then: (schema) => schema.required('Radius is required').min(1, 'Radius must be at least 1 km').max(200, 'Radius cannot exceed 200 km'),
      otherwise: (schema) => schema.min(1, 'Radius must be at least 1 km').max(200, 'Radius cannot exceed 200 km'),
    }),

  ageRangeEnabled: Yup.boolean(),
  ageMin: Yup.number()
    .transform((value, originalValue) => (originalValue === '' ? undefined : value))
    .when('ageRangeEnabled', {
      is: true,
      then: (schema) => schema.required('Minimum age is required').min(10, 'Minimum age must be at least 10').max(100, 'Invalid age'),
      otherwise: (schema) => schema.min(10, 'Minimum age must be at least 10').max(100, 'Invalid age'),
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
      otherwise: (schema) =>
        schema
          .min(13, 'Maximum age must be at least 13')
          .max(100, 'Invalid age')
          .test('age-range', 'Max age must be greater than min age', function (value) {
            const { ageMin } = this.parent;
            if (!value || !ageMin) return true;
            return value > ageMin;
          }),
    }),

  genderEnabled: Yup.boolean(),
  genderValue: Yup.string().oneOf(['all', 'male', 'female', 'other'] as const),

  interestsEnabled: Yup.boolean(),
  selectedInterests: Yup.array().of(Yup.string()),
});

const defaultValues: NotificationFormValues = {
  title: '',
  message: '',
  image: null,
  destinationType: 'none',
  destinationId: '',
  destinationName: '',
  sendTime: 'immediate',
  scheduledDateTime: '',
  locationEnabled: false,
  locationName: '',
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
  selectedData?: Notification | null;
}

export const NotificationModal: React.FC<NotificationModalProps> = ({ open, onClose, isEdit = false, selectedData }) => {
  const { uploadImage, uploading: imageUploading } = useImageUpload();
  const [deleting, setDeleting] = useState(false);

  // Uncomment when API is ready
  // const [addNotification, { isLoading: addLoading }] = useAddNotificationMutation();
  // const [updateNotification, { isLoading: updateLoading }] = useUpdateNotificationMutation();
  // const { data: organizationsData, isLoading: organizationsLoading } = useGetOrganizationsQuery({
  //   page: 0,
  //   search: '',
  //   limit: '10000',
  // });
  // const { data: eventsData, isLoading: eventsLoading } = useGetEventsQuery({
  //   page: 0,
  //   search: '',
  //   limit: '10000',
  // });

  const addLoading = false;
  const updateLoading = false;
  const organizationsLoading = false;
  const eventsLoading = false;

  const methods = useForm<NotificationFormValues>({
    resolver: yupResolver(schema) as any,
    defaultValues,
    mode: 'onChange',
  });

  const { reset, watch, setValue } = methods;

  const destinationType = watch('destinationType');
  const sendTime = watch('sendTime');
  const locationEnabled = watch('locationEnabled');
  const ageRangeEnabled = watch('ageRangeEnabled');
  const genderEnabled = watch('genderEnabled');
  const interestsEnabled = watch('interestsEnabled');
  const selectedInterests = watch('selectedInterests');

  // Map mock data to dropdown options
  const organizationOptions =
    MOCK_ORGANIZATIONS.map((org) => ({
      label: org.name,
      value: org._id,
    })) || [];

  const eventOptions =
    MOCK_EVENTS.map((event) => ({
      label: event.title,
      value: event._id,
    })) || [];

  // Populate form in edit mode
  useEffect(() => {
    if (isEdit && selectedData && open) {
      const mappedData: NotificationFormValues = {
        title: selectedData.title || '',
        message: selectedData.message || '',
        image: selectedData.image || null,
        destinationType: selectedData.destination?.type || 'none',
        destinationId: selectedData.destination?.id || '',
        destinationName: selectedData.destination?.name || '',
        sendTime: selectedData.status === 'scheduled' ? 'scheduled' : 'immediate',
        scheduledDateTime: selectedData.sendTime ? new Date(selectedData.sendTime).toISOString().slice(0, 16) : '',
        locationEnabled: !!selectedData.targeting?.location,
        locationName: selectedData.targeting?.location?.name || '',
        locationRadius: selectedData.targeting?.location?.radius || DEFAULT_LOCATION_RADIUS,
        ageRangeEnabled: !!selectedData.targeting?.ageRange,
        ageMin: selectedData.targeting?.ageRange?.min || DEFAULT_AGE_MIN,
        ageMax: selectedData.targeting?.ageRange?.max || DEFAULT_AGE_MAX,
        genderEnabled: !!selectedData.targeting?.gender && selectedData.targeting.gender !== 'all',
        genderValue: selectedData.targeting?.gender || 'all',
        interestsEnabled: !!selectedData.targeting?.interests && selectedData.targeting.interests.length > 0,
        selectedInterests: selectedData.targeting?.interests || [],
      };

      reset(mappedData);
    } else if (open && !isEdit) {
      reset(defaultValues);
    }
  }, [isEdit, selectedData, open, reset]);

  const handleSubmit = async (formData: NotificationFormValues) => {
    let uploadedFileKey: string | null = null;

    try {
      // Upload image if provided
      if (formData.image instanceof FileList && formData.image.length > 0) {
        const file = formData.image[0];
        uploadedFileKey = await uploadImage(file);
      }

      // Build payload
      const payload: any = {
        title: formData.title,
        message: formData.message,
        destination: {
          type: formData.destinationType,
          id: formData.destinationId || undefined,
          name: formData.destinationName || undefined,
        },
        sendTime: formData.sendTime === 'immediate' ? new Date().toISOString() : new Date(formData.scheduledDateTime).toISOString(),
        status: formData.sendTime === 'immediate' ? 'sent' : 'scheduled',
        targeting: {},
      };

      // Add image if uploaded
      if (uploadedFileKey) {
        payload.image = uploadedFileKey;
      } else if (isEdit && selectedData?.image) {
        payload.image = selectedData.image;
      }

      // Add targeting data
      if (formData.locationEnabled && formData.locationName) {
        payload.targeting.location = {
          name: formData.locationName,
          radius: formData.locationRadius,
        };
      }

      if (formData.ageRangeEnabled) {
        payload.targeting.ageRange = {
          min: formData.ageMin,
          max: formData.ageMax,
        };
      }

      if (formData.genderEnabled) {
        payload.targeting.gender = formData.genderValue;
      }

      if (formData.interestsEnabled && formData.selectedInterests.length > 0) {
        payload.targeting.interests = formData.selectedInterests;
      }

      // Add edit-specific fields
      if (isEdit && selectedData) {
        payload.id = selectedData._id;
      }

      // Uncomment when API is ready
      // const response = isEdit
      //   ? await updateNotification(payload).unwrap()
      //   : await addNotification(payload).unwrap();

      // if (!response) {
      //   showError('No response from server. Please try again later.');
      //   return;
      // }

      // if (response?.error) {
      //   showError(getErrorMessage(response.error));
      //   return;
      //}

      // showSuccess(
      //   response?.message || (isEdit ? 'Notification updated successfully' : 'Notification created successfully')
      // );

      // Mock success for now
      console.log('Notification payload:', payload);
      showSuccess(isEdit ? 'Notification updated successfully' : 'Notification created successfully');

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
    onClose();
  };

  const toggleInterest = (interest: string) => {
    const current = selectedInterests;
    const newSelected = current.includes(interest) ? current.filter((i) => i !== interest) : [...current, interest];
    setValue('selectedInterests', newSelected);
  };

  const isLoading = addLoading || updateLoading || imageUploading || deleting;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogOverlay className="bg-opacity-30 fixed inset-0">
        <DialogContent
          aria-describedby={undefined}
          className="dark:bg-secondary mx-auto flex max-h-[90vh] min-h-[45vh] w-full flex-col items-center overflow-y-auto md:max-w-[700px]!"
        >
          <DialogHeader>
            <DialogTitle>{isEdit ? 'Edit Notification' : 'Create Global Notification'}</DialogTitle>
          </DialogHeader>

          <div className="w-full">
            <FormProvider methods={methods} onSubmit={methods.handleSubmit(handleSubmit)}>
              <div className="mt-6 flex w-full flex-col gap-6">
                {/* Content Section */}
                <div className="space-y-4">
                  <RHFUploadAvatar name="image" label="Image (Optional)" />

                  <div className="grid grid-cols-1 gap-4 md:grid-cols-1">
                    <RHFTextField name="title" label="Title" placeholder="e.g., Weekend Sale - 30% Off!" />

                    <RHFTextField name="message" label="Message" placeholder="Enter your notification message..." multiline rows={3} />
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
                        {organizationsLoading ? (
                          <div className="space-y-2">
                            <Skeleton className="ml-1 h-3 w-20" />
                            <Skeleton className="h-10" />
                          </div>
                        ) : (
                          <RHFCustomDropdown
                            name="destinationId"
                            label="Select Organization"
                            placeholder="Choose organization"
                            options={organizationOptions}
                            isLoading={organizationsLoading}
                            showNone={false}
                          />
                        )}
                      </>
                    )}

                    {destinationType === 'event' && (
                      <>
                        {eventsLoading ? (
                          <div className="space-y-2">
                            <Skeleton className="ml-1 h-3 w-20" />
                            <Skeleton className="h-10" />
                          </div>
                        ) : (
                          <RHFCustomDropdown
                            name="destinationId"
                            label="Select Event"
                            placeholder="Choose event"
                            options={eventOptions}
                            isLoading={eventsLoading}
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
                    <h4 className="font-semibold text-gray-900 dark:text-gray-100">
                      User Targeting <span className="text-sm font-normal text-gray-500 dark:text-gray-400">(Optional)</span>
                    </h4>
                    <div className="rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
                      {[locationEnabled, ageRangeEnabled, genderEnabled, interestsEnabled].filter(Boolean).length} filters active
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-4 md:grid-cols-1">
                    {/* Location Filter */}
                    <div className="rounded-lg border-2 border-gray-200 bg-gray-50/50 p-4 transition-all dark:border-gray-700 dark:bg-gray-800/30">
                      <label className={`${locationEnabled ? 'mb-3' : ''} flex cursor-pointer items-center justify-between`}>
                        <div className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={locationEnabled}
                            onChange={(e) => setValue('locationEnabled', e.target.checked)}
                            className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700"
                          />
                          <span className="font-medium text-gray-900 dark:text-gray-100">Location</span>
                        </div>
                        {locationEnabled && (
                          <span className="rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-800 dark:bg-blue-900/50 dark:text-blue-300">
                            Active
                          </span>
                        )}
                      </label>
                      {locationEnabled && (
                        <div className="mt-2 space-y-2">
                          <RHFTextField name="locationName" placeholder="Enter city name" className="text-sm" />
                          <RHFTextField name="locationRadius" type="number" placeholder="Radius (km)" min="1" max="200" className="text-sm" />
                        </div>
                      )}
                    </div>

                    {/* Age Range Filter */}
                    <div className="rounded-lg border-2 border-gray-200 bg-gray-50/50 p-4 transition-all dark:border-gray-700 dark:bg-gray-800/30">
                      {/* <label className="mb-3 flex cursor-pointer items-center justify-between"> */}
                      <label className={`${ageRangeEnabled ? 'mb-3' : ''} flex cursor-pointer items-center justify-between`}>
                        <div className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={ageRangeEnabled}
                            onChange={(e) => setValue('ageRangeEnabled', e.target.checked)}
                            className="h-4 w-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500 dark:border-gray-600 dark:bg-gray-700"
                          />
                          <span className="font-medium text-gray-900 dark:text-gray-100">Age Range</span>
                        </div>
                        {ageRangeEnabled && (
                          <span className="rounded-full bg-purple-100 px-2 py-0.5 text-xs font-medium text-purple-800 dark:bg-purple-900/50 dark:text-purple-300">
                            Active
                          </span>
                        )}
                      </label>
                      {ageRangeEnabled && (
                        <div className="mt-2 grid grid-cols-2 gap-2">
                          <RHFTextField name="ageMin" type="number" placeholder="Min age" min="13" max="100" className="text-sm" />
                          <RHFTextField name="ageMax" type="number" placeholder="Max age" min="13" max="100" className="text-sm" />
                        </div>
                      )}
                    </div>

                    {/* Gender Filter */}
                    <div className="rounded-lg border-2 border-gray-200 bg-gray-50/50 p-4 transition-all dark:border-gray-700 dark:bg-gray-800/30">
                      {/* <label className="mb-3 flex cursor-pointer items-center justify-between"> */}
                      <label className={`${genderEnabled ? 'mb-3' : ''} flex cursor-pointer items-center justify-between`}>
                        <div className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={genderEnabled}
                            onChange={(e) => setValue('genderEnabled', e.target.checked)}
                            className="h-4 w-4 rounded border-gray-300 text-pink-600 focus:ring-pink-500 dark:border-gray-600 dark:bg-gray-700"
                          />
                          <span className="font-medium text-gray-900 dark:text-gray-100">Gender</span>
                        </div>
                        {genderEnabled && (
                          <span className="rounded-full bg-pink-100 px-2 py-0.5 text-xs font-medium text-pink-800 dark:bg-pink-900/50 dark:text-pink-300">
                            Active
                          </span>
                        )}
                      </label>
                      {genderEnabled && (
                        <div className="mt-2">
                          <RHFSelectField name="genderValue" placeholder="Select gender" options={GENDER_OPTIONS} />
                        </div>
                      )}
                    </div>

                    {/* Interests Filter */}
                    <div className="rounded-lg border-2 border-gray-200 bg-gray-50/50 p-4 transition-all dark:border-gray-700 dark:bg-gray-800/30">
                      {/* <label className="mb-3 flex cursor-pointer items-center justify-between"> */}
                      <label className={`${interestsEnabled ? 'mb-3' : ''} flex cursor-pointer items-center justify-between`}>
                        <div className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={interestsEnabled}
                            onChange={(e) => setValue('interestsEnabled', e.target.checked)}
                            className="h-4 w-4 rounded border-gray-300 text-green-600 focus:ring-green-500 dark:border-gray-600 dark:bg-gray-700"
                          />
                          <span className="font-medium text-gray-900 dark:text-gray-100">Interests</span>
                        </div>
                        {interestsEnabled && selectedInterests.length > 0 && (
                          <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-800 dark:bg-green-900/50 dark:text-green-300">
                            {selectedInterests.length} selected
                          </span>
                        )}
                      </label>
                      {interestsEnabled && (
                        <div className="mt-2 flex max-h-32 flex-wrap gap-1.5 overflow-y-auto">
                          {INTERESTS_OPTIONS.map((interest) => (
                            <button
                              key={interest}
                              type="button"
                              onClick={() => toggleInterest(interest)}
                              className={`rounded-full px-2.5 py-1 text-xs font-medium transition-colors ${
                                selectedInterests.includes(interest)
                                  ? 'bg-green-600 text-white dark:bg-green-500'
                                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
                              }`}
                            >
                              {interest}
                            </button>
                          ))}
                        </div>
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
                    <label className="flex cursor-pointer items-center gap-2">
                      <input
                        type="radio"
                        value="immediate"
                        checked={sendTime === 'immediate'}
                        onChange={(e) => setValue('sendTime', e.target.value as any)}
                        className="h-4 w-4 border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-gray-900 dark:text-gray-100">Send Immediately</span>
                    </label>
                    <label className="flex cursor-pointer items-center gap-2">
                      <input
                        type="radio"
                        value="scheduled"
                        checked={sendTime === 'scheduled'}
                        onChange={(e) => setValue('sendTime', e.target.value as any)}
                        className="h-4 w-4 border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-gray-900 dark:text-gray-100">Schedule</span>
                    </label>
                  </div>

                  {sendTime === 'scheduled' && <RHFTextField name="scheduledDateTime" type="datetime-local" label="Scheduled Date & Time" />}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-6 flex items-center justify-center gap-3 border-t border-gray-200 pt-6 dark:border-gray-700">
                <Button type="button" variant="outline" onClick={handleClose} className="px-6">
                  Cancel
                </Button>

                {isLoading ? (
                  <Button type="button" disabled className="bg-primary hover:bg-primary cursor-not-allowed px-6 text-white">
                    <ButtonLoading title={isEdit ? 'Updating' : sendTime === 'immediate' ? 'Sending' : 'Scheduling'} />
                  </Button>
                ) : (
                  <Button type="submit" className="bg-primary hover:bg-primary-dark cursor-pointer px-6 text-white">
                    {isEdit ? 'Update Notification' : sendTime === 'immediate' ? 'Send Now' : 'Schedule Notification'}
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
