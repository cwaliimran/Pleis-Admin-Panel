'use client';

import { useGetCategoriesQuery } from '@/store/Reducer/categories';
import { useAddeventMutation, useGeteventByIdQuery, useUpdateeventMutation } from '@/store/Reducer/events';
import { useGetOrganizationQuery } from '@/store/Reducer/organization';
import { useGetTagsQuery } from '@/store/Reducer/tags';
import { useGetVenuesQuery } from '@/store/Reducer/venue';
import { getErrorMessage } from '@/utils/api';
import { deleteFileFromAzure } from '@/utils/deleteFile';
import { uploadFileToAzure } from '@/utils/fileUpload';
import { convertTimeFormat, fDate, formatStr } from '@/utils/format-time';
import { showError, showSuccess } from '@/utils/toast';
import { yupResolver } from '@hookform/resolvers/yup';
import { skipToken } from '@reduxjs/toolkit/query';
import { useParams, useRouter } from 'next/navigation';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Resolver, useForm } from 'react-hook-form';
import { defaultValues } from './constants';
import type { EventFormValues } from './types';
import { eventValidationSchema } from './validation';

export const useEventForm = (userType: string) => {
  const { id } = useParams();
  const router = useRouter();
  const isEditMode = Boolean(id);

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [venueModal, setVenueModal] = useState<boolean>(false);
  const [isFormInitialized, setIsFormInitialized] = useState(false);
  const [showPartnerOrganizer, setShowPartnerOrganizer] = useState(false);

  const hasInitializedRef = useRef(false);
  const prevEventIdRef = useRef<string | null>(null);
  const cachedOrganizationIdRef = useRef<string | null>(null);

  // CRITICAL FIX: Force refetch on mount to prevent blank fields
  const {
    data: event = {},
    isSuccess: eventLoaded,
    isFetching: eventFetching,
  } = useGeteventByIdQuery(id ?? skipToken, {
    refetchOnMountOrArgChange: true,
    refetchOnFocus: true,
  });

  const { data: { data: organizations = [] } = {}, isLoading: orgLoading } = useGetOrganizationQuery({
    page: 0,
    limit: 10000,
  });

  const { data: { data: categoriesData = [] } = {}, isLoading: categoriesLoading } = useGetCategoriesQuery({
    page: 0,
    limit: 10000,
  });

  const { data: { data: tagsd = [] } = {}, isLoading: tagsLoading } = useGetTagsQuery({
    page: 0,
    limit: 10000,
  });

  const [addEvent, { isLoading: isAddingEvent }] = useAddeventMutation();
  const [updateEvent, { isLoading: isUpdatingEvent }] = useUpdateeventMutation();

  const methods = useForm<EventFormValues>({
    defaultValues,
    resolver: yupResolver(eventValidationSchema) as unknown as Resolver<EventFormValues>,
  });

  const {
    watch,
    setValue,
    reset,
    formState: { errors },
  } = methods;

  console.log('errors', errors);

  const { mediaUrl, mediaType, venue, categories, partnerOrganizers, recurring, recurringDays, recurringEnd, organization } = watch();

  const effectiveOrganization = organization || cachedOrganizationIdRef.current;

  const { data: { data: venues = [] } = {}, isLoading: venuesLoading } = useGetVenuesQuery(
    effectiveOrganization ? { page: 0, limit: 1000, organization: effectiveOrganization } : skipToken,
    {
      skip: !effectiveOrganization,
    }
  );

  const prevOrganizationRef = useRef(organization);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [step]);

  useEffect(() => {
    if (prevOrganizationRef.current && prevOrganizationRef.current !== organization && isFormInitialized) {
      setValue('venue', '');
    }
    prevOrganizationRef.current = organization;
  }, [organization, setValue, isFormInitialized]);

  useEffect(() => {
    if (organization && partnerOrganizers?.includes(organization)) {
      setValue(
        'partnerOrganizers',
        partnerOrganizers?.filter((po) => po !== organization)
      );
    }
  }, [organization, partnerOrganizers, setValue]);

  const removePartnerOrganizer = (val: string) => {
    setValue(
      'partnerOrganizers',
      partnerOrganizers.filter((v) => v !== val)
    );
  };

  const toggleRecurringDay = (day: string) => {
    const newDays = recurringDays.includes(day) ? recurringDays.filter((d) => d !== day) : [...recurringDays, day];
    setValue('recurringDays', newDays);
  };

  const isStepValid = (step: number): boolean => {
    if (step === 1) {
      return [
        mediaUrl,
        mediaType,
        watch('name'),
        watch('description'),
        venue,
        categories && categories.length > 0,
        watch('tags').length > 0,
        watch('organization'),
      ].every(Boolean);
    }
    if (step === 2) {
      const hasBasicFields = [watch('fromDate'), watch('endDate'), watch('fromTime'), watch('endTime')].every(Boolean);

      if (recurring) {
        const freq = watch('recurringType');
        const interval = watch('recurringInterval');
        const daysOfWeek = watch('recurringDays');
        const endType = watch('recurringEnd');
        const endDate = watch('recurringEndDate');
        const occurrences = watch('recurringEndCount');

        if (!freq || !interval || !endType || !daysOfWeek) return false;

        if (endType === 'never') {
          return hasBasicFields && !!freq && !!interval && !!endType;
        }
        if (endType === 'onDate') {
          return hasBasicFields && !!freq && !!interval && !!endType && !!endDate;
        }
        if (endType === 'afterOccurrences') {
          return hasBasicFields && !!freq && !!interval && !!endType && !!occurrences;
        }
        return false;
      }

      return hasBasicFields;
    }
    return false;
  };

  const onSubmit = async (data: EventFormValues) => {
    let imageFileString = '';

    try {
      setLoading(true);
      if (file && file instanceof File) {
        imageFileString = await uploadFileToAzure(file);
      } else {
        imageFileString = data.mediaUrl || '';
      }

      const payload: any = {
        basicInfo: {
          media: {
            type: data.mediaType || 'image',
            name: imageFileString,
          },
          title: data.name,
          description: data.description,
          organization: data.organization,
          venue: data.venue,
          categories: data.categories,
          tags: data.tags,
        },
        schedule: {
          type: 'oneTime',
          startDateTime: data.fromDate ? `${fDate(data.fromDate, formatStr.paramCase.db)} ${convertTimeFormat(data.fromTime)}` : '',
          endDateTime: data.endDate ? `${fDate(data.endDate, formatStr.paramCase.db)} ${convertTimeFormat(data.endTime)}` : '',
        },
      };

      if (data.partnerOrganization) {
        payload.basicInfo.partnerOrganization = data.partnerOrganization;
      }

      if (data.recurring) {
        payload.schedule.recurringDetails = {
          isEnabled: true,
          frequency: data.recurringType,
          interval: data.recurringInterval,
          daysOfWeek: data.recurringDays.map((day: string) => day.substring(0, 3).toLowerCase()),
          endType: data.recurringEnd,
        };

        if (data.recurringEnd === 'onDate' && data.recurringEndDate) {
          payload.schedule.recurringDetails.endDate = fDate(data.recurringEndDate, formatStr.paramCase.db);
        } else if (data.recurringEnd === 'afterOccurrences' && data.recurringEndCount) {
          payload.schedule.recurringDetails.occurrences = data.recurringEndCount;
        }
      }

      let response = null;

      if (!id) {
        response = await addEvent(payload).unwrap();
      } else {
        response = await updateEvent({ id: id, ...payload }).unwrap();
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
        showSuccess(response?.message || (id ? 'Event updated successfully' : 'Event created successfully'));
        router.push(`/${userType}/events`);
      }
    } catch (error) {
      if (imageFileString) {
        await deleteFileFromAzure(imageFileString);
      }
      const errorMessage = getErrorMessage(error);
      showError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const setEditValues = useCallback(() => {
    if (!event || !event._id) return;

    const organizationId = event?.basicInfo?.organization?._id || '';
    const venueId = event?.basicInfo?.venue?._id || '';
    const partnerOrgId = event?.basicInfo?.partnerOrganization?._id || '';

    if (organizationId) {
      cachedOrganizationIdRef.current = organizationId;
    }

    const fromDate_ = event?.schedule?.startDateTime ? new Date(event.schedule.startDateTime) : null;
    const fromTime_ = event?.schedule?.startDateTime ? convertTimeFormat(event.schedule.startDateTime.split(' ').slice(1).join(' '), true) : '';
    const endDate_ = event?.schedule?.endDateTime ? new Date(event.schedule.endDateTime) : null;
    const endTime_ = event?.schedule?.endDateTime ? convertTimeFormat(event.schedule.endDateTime.split(' ').slice(1).join(' '), true) : '';

    const dayMapping: { [key: string]: string } = {
      mon: 'Monday',
      tue: 'Tuesday',
      wed: 'Wednesday',
      thu: 'Thursday',
      fri: 'Friday',
      sat: 'Saturday',
      sun: 'Sunday',
    };

    const recurringDays_ = event?.schedule?.recurringDetails?.daysOfWeek?.map((day: string) => dayMapping[day] || day) || [];

    const formData: EventFormValues = {
      image: event?.basicInfo?.media || null,
      mediaUrl: event?.basicInfo?.media || '',
      mediaType: 'image',
      name: event?.basicInfo?.title || '',
      description: event?.basicInfo?.description || '',
      organization: organizationId,
      venue: venueId,
      partnerOrganization: partnerOrgId,
      categories: event?.basicInfo?.categories?.map((cat: any) => cat._id) || [],
      tags: event?.basicInfo?.tags?.map((tag: any) => tag._id) || [],
      eventType: 'oneTime',
      fromDate: fromDate_,
      fromTime: fromTime_,
      endDate: endDate_,
      endTime: endTime_,
      recurring: event?.schedule?.recurringDetails?.isEnabled || false,
      recurringType: event?.schedule?.recurringDetails?.frequency || 'weekly',
      recurringInterval: event?.schedule?.recurringDetails?.interval || 1,
      recurringDays: recurringDays_,
      recurringEnd: event?.schedule?.recurringDetails?.endType || 'never',
      recurringEndDate: event?.schedule?.recurringDetails?.endDate ? new Date(event.schedule.recurringDetails.endDate) : null,
      recurringEndCount: event?.schedule?.recurringDetails?.occurrences || 1,
      categoryInput: '',
      tagInput: '',
      organizerInput: '',
      partnerOrganizerInput: '',
      partnerOrganizers: event?.basicInfo?.partnerOrganizers ? event.basicInfo.partnerOrganizers.map((org: any) => org._id) : [],
      organizers: [],
      daysOfWeek: [],
    };

    reset(formData);

    setTimeout(() => {
      hasInitializedRef.current = true;
      setIsFormInitialized(true);
    }, 100);
  }, [event, reset]);

  useEffect(() => {
    const currentEventId = event?._id;
    if (id && currentEventId && prevEventIdRef.current !== currentEventId) {
      hasInitializedRef.current = false;
      setIsFormInitialized(false);
      prevEventIdRef.current = currentEventId;
    }
  }, [id, event?._id]);

  useEffect(() => {
    if (id && eventLoaded && event?._id && !hasInitializedRef.current) {
      setEditValues();
    }
  }, [id, eventLoaded, event?._id, setEditValues]);

  useEffect(() => {
    if (id && event?._id && !hasInitializedRef.current && !eventFetching) {
      setEditValues();
    }
  }, [id, event?._id, eventFetching, setEditValues]);

  useEffect(() => {
    return () => {
      hasInitializedRef.current = false;
      prevEventIdRef.current = null;
      cachedOrganizationIdRef.current = null;
      setIsFormInitialized(false);
    };
  }, []);

  return {
    step,
    setStep,
    showPartnerOrganizer,
    setShowPartnerOrganizer,
    file,
    setFile,
    venueModal,
    setVenueModal,
    loading,
    methods,
    watch,
    setValue,
    organizations,
    orgLoading,
    venues,
    venuesLoading,
    categoriesData,
    categoriesLoading,
    tagsd,
    tagsLoading,
    addEvent,
    isAddingEvent,
    updateEvent,
    isUpdatingEvent,
    removePartnerOrganizer,
    toggleRecurringDay,
    isStepValid,
    onSubmit,
    router,
    mediaUrl,
    mediaType,
    venue,
    categories,
    partnerOrganizers,
    recurring,
    recurringDays,
    recurringEnd,
    organization,
    isEditMode,
  };
};

// 'use client';

// import { useGetCategoriesQuery } from '@/store/Reducer/categories';
// import { useAddeventMutation, useGeteventByIdQuery, useUpdateeventMutation } from '@/store/Reducer/events';
// import { useGetOrganizationQuery } from '@/store/Reducer/organization';
// import { useGetTagsQuery } from '@/store/Reducer/tags';
// import { useGetVenuesQuery } from '@/store/Reducer/venue';
// import { getErrorMessage } from '@/utils/api';
// import { deleteFileFromAzure } from '@/utils/deleteFile';
// import { uploadFileToAzure } from '@/utils/fileUpload';
// import { convertTimeFormat, fDate, formatStr } from '@/utils/format-time';
// import { showError, showSuccess } from '@/utils/toast';
// import { yupResolver } from '@hookform/resolvers/yup';
// import { skipToken } from '@reduxjs/toolkit/query';
// import { useParams, useRouter } from 'next/navigation';
// import { useCallback, useEffect, useRef, useState } from 'react';
// import { Resolver, useForm } from 'react-hook-form';
// import { defaultValues } from './constants';
// import type { EventFormValues } from './types';
// import { eventValidationSchema } from './validation';

// export const useEventForm = (userType: string) => {
//   const { id } = useParams();
//   const router = useRouter();
//   const isEditMode = !!id;

//   const [step, setStep] = useState(1);
//   const [loading, setLoading] = useState(false);
//   const [file, setFile] = useState<File | null>(null);
//   const [venueModal, setVenueModal] = useState<boolean>(false);
//   const [isFormInitialized, setIsFormInitialized] = useState(false);
//   const [showPartnerOrganizer, setShowPartnerOrganizer] = useState(false);

//   // Track if we've set the initial values to prevent re-initialization
//   const hasInitializedRef = useRef(false);
//   const prevEventIdRef = useRef<string | null>(null);

//   // CRITICAL FIX: Force refetch every time by using refetch and not relying on cache
//   const {
//     data: event = {},
//     isSuccess: eventLoaded,
//     refetch: refetchEvent,
//     isFetching: isEventFetching
//   } = useGeteventByIdQuery(id ?? skipToken, {
//     // Force refetch on mount and when id changes
//     refetchOnMountOrArgChange: true,
//     // Don't use cached data
//     skip: !id,
//   });

//   console.log('event data:', event);
//   console.log('isEventFetching:', isEventFetching);
//   console.log('eventLoaded:', eventLoaded);

//   const { data: { data: organizations = [] } = {}, isLoading: orgLoading } = useGetOrganizationQuery({
//     page: 0,
//     limit: 10000,
//   });

//   const { data: { data: categoriesData = [] } = {}, isLoading: categoriesLoading } = useGetCategoriesQuery({
//     page: 0,
//     limit: 10000,
//   });

//   const { data: { data: tagsd = [] } = {}, isLoading: tagsLoading } = useGetTagsQuery({
//     page: 0,
//     limit: 10000,
//   });

//   const [addEvent, { isLoading: isAddingEvent }] = useAddeventMutation();
//   const [updateEvent, { isLoading: isUpdatingEvent }] = useUpdateeventMutation();

//   const methods = useForm<EventFormValues>({
//     defaultValues,
//     resolver: yupResolver(eventValidationSchema) as unknown as Resolver<EventFormValues>,
//   });

//   const {
//     watch,
//     setValue,
//     reset,
//     formState: { errors },
//   } = methods;

//   console.log('errors', errors);

//   const { mediaUrl, mediaType, venue, categories, partnerOrganizers, recurring, recurringDays, recurringEnd, organization } = watch();

//   const { data: { data: venues = [] } = {}, isLoading: venuesLoading } = useGetVenuesQuery(
//     organization ? { page: 0, limit: 1000, organization: organization } : skipToken,
//     {
//       skip: !organization,
//     }
//   );

//   const prevOrganizationRef = useRef(organization);

//   useEffect(() => {
//     window.scrollTo({ top: 0, behavior: 'smooth' });
//   }, [step]);

//   // CRITICAL FIX: Refetch event data when component mounts in edit mode
//   useEffect(() => {
//     if (id && !hasInitializedRef.current) {
//       console.log('Refetching event data for id:', id);
//       refetchEvent();
//     }
//   }, [id, refetchEvent]);

//   // Clear venue when organization changes (only after form is initialized and not during initial load)
//   useEffect(() => {
//     if (prevOrganizationRef.current && prevOrganizationRef.current !== organization && isFormInitialized) {
//       setValue('venue', '');
//     }
//     prevOrganizationRef.current = organization;
//   }, [organization, setValue, isFormInitialized]);

//   useEffect(() => {
//     if (organization && partnerOrganizers?.includes(organization)) {
//       setValue(
//         'partnerOrganizers',
//         partnerOrganizers?.filter((po) => po !== organization)
//       );
//     }
//   }, [organization, partnerOrganizers, setValue]);

//   const removePartnerOrganizer = (val: string) => {
//     setValue(
//       'partnerOrganizers',
//       partnerOrganizers.filter((v) => v !== val)
//     );
//   };

//   const toggleRecurringDay = (day: string) => {
//     const newDays = recurringDays.includes(day) ? recurringDays.filter((d) => d !== day) : [...recurringDays, day];
//     setValue('recurringDays', newDays);
//   };

//   const isStepValid = (step: number): boolean => {
//     if (step === 1) {
//       return [
//         mediaUrl,
//         mediaType,
//         watch('name'),
//         watch('description'),
//         venue,
//         categories && categories.length > 0,
//         watch('tags').length > 0,
//         watch('organization'),
//       ].every(Boolean);
//     }
//     if (step === 2) {
//       const hasBasicFields = [watch('fromDate'), watch('endDate'), watch('fromTime'), watch('endTime')].every(Boolean);

//       if (recurring) {
//         const freq = watch('recurringType');
//         const interval = watch('recurringInterval');
//         const daysOfWeek = watch('recurringDays');
//         const endType = watch('recurringEnd');
//         const endDate = watch('recurringEndDate');
//         const occurrences = watch('recurringEndCount');

//         if (!freq || !interval || !endType || !daysOfWeek) return false;

//         if (endType === 'never') {
//           return hasBasicFields && !!freq && !!interval && !!endType;
//         }
//         if (endType === 'onDate') {
//           return hasBasicFields && !!freq && !!interval && !!endType && !!endDate;
//         }
//         if (endType === 'afterOccurrences') {
//           return hasBasicFields && !!freq && !!interval && !!endType && !!occurrences;
//         }
//         return false;
//       }

//       return hasBasicFields;
//     }
//     return false;
//   };

//   // FIXED: Proper onSubmit signature for react-hook-form
//   const onSubmit = async (data: EventFormValues) => {
//     let imageFileString = '';

//     try {
//       setLoading(true);
//       if (file && file instanceof File) {
//         imageFileString = await uploadFileToAzure(file);
//         console.log('Uploaded file URL:', imageFileString);
//       } else {
//         imageFileString = data.mediaUrl || '';
//       }

//       // Build payload matching Postman example
//       const payload: any = {
//         basicInfo: {
//           media: {
//             type: data.mediaType || 'image',
//             name: imageFileString,
//           },
//           title: data.name,
//           description: data.description,
//           organization: data.organization,
//           venue: data.venue,
//           categories: data.categories,
//           tags: data.tags,
//         },
//         schedule: {
//           type: 'oneTime',
//           startDateTime: data.fromDate ? `${fDate(data.fromDate, formatStr.paramCase.db)} ${convertTimeFormat(data.fromTime)}` : '',
//           endDateTime: data.endDate ? `${fDate(data.endDate, formatStr.paramCase.db)} ${convertTimeFormat(data.endTime)}` : '',
//         },
//       };

//       // Add partnerOrganization if it exists
//       if (data.partnerOrganization) {
//         payload.basicInfo.partnerOrganization = data.partnerOrganization;
//       }

//       // Add recurring details if enabled
//       if (data.recurring) {
//         payload.schedule.recurringDetails = {
//           isEnabled: true,
//           frequency: data.recurringType,
//           interval: data.recurringInterval,
//           daysOfWeek: data.recurringDays.map((day: string) => day.substring(0, 3).toLowerCase()),
//           endType: data.recurringEnd,
//         };

//         // Add endDate or occurrences based on endType
//         if (data.recurringEnd === 'onDate' && data.recurringEndDate) {
//           payload.schedule.recurringDetails.endDate = fDate(data.recurringEndDate, formatStr.paramCase.db);
//         } else if (data.recurringEnd === 'afterOccurrences' && data.recurringEndCount) {
//           payload.schedule.recurringDetails.occurrences = data.recurringEndCount;
//         }
//       }

//       // EDIT MODE: Never include ticketing in edit mode
//       // CREATE MODE: Include ticketing only if it's step 3 and not skipped
//       if (!isEditMode && data.ticketing && step === 3) {
//         const ticketing: any = {
//           title: data.ticketing.title,
//           price: Number(data.ticketing.price),
//           taxPercentage: Number(data.ticketing.taxPercentage),
//         };

//         // Add quantity if timeslots not enabled
//         if (!data.ticketing.timingSlots?.enabled) {
//           ticketing.quantity = Number(data.ticketing.quantity);
//         }

//         // Timing Slots
//         if (data.ticketing.timingSlots?.enabled && data.ticketing.timingSlots.dateTimeSlots) {
//           ticketing.timingSlots = {
//             enabled: true,
//             dateTimeSlots: data.ticketing.timingSlots.dateTimeSlots,
//           };
//         }

//         // Repeatable
//         if (data.ticketing.repeatable?.isRepeatable) {
//           ticketing.repeatable = {
//             isRepeatable: true,
//             visits: Number(data.ticketing.repeatable.visits) || 1,
//           };
//         }

//         // Resale Protection
//         if (data.ticketing.resaleProtection && data.ticketing.resaleProtection !== 'none') {
//           ticketing.resaleProtection = data.ticketing.resaleProtection;
//         }

//         // Transfer Fee
//         if (data.ticketing.transferFee !== null && data.ticketing.transferFee !== undefined) {
//           ticketing.transferFee = Number(data.ticketing.transferFee);
//         }

//         // Time Sensitive Pricing
//         const earlyBird = data.ticketing.timeSensitivePricing?.earlyBird;
//         const lastMinute = data.ticketing.timeSensitivePricing?.lastMinute;

//         if ((earlyBird?.enabled && earlyBird.endDate && earlyBird.discountedPrice) ||
//             (lastMinute?.enabled && lastMinute.startDate && lastMinute.discountedPrice)) {
//           ticketing.timeSensitivePricing = {};

//           if (earlyBird?.enabled && earlyBird.endDate && earlyBird.discountedPrice) {
//             const earlyBirdDate = new Date(earlyBird.endDate);
//             const formattedEarlyBirdDate = `${fDate(earlyBirdDate, formatStr.paramCase.db)} ${convertTimeFormat(
//               earlyBirdDate.toTimeString().substring(0, 5)
//             )}`;

//             ticketing.timeSensitivePricing.earlyBird = {
//               endDate: formattedEarlyBirdDate,
//               discountedPrice: Number(earlyBird.discountedPrice),
//             };
//           }

//           if (lastMinute?.enabled && lastMinute.startDate && lastMinute.discountedPrice) {
//             const lastMinuteDate = new Date(lastMinute.startDate);
//             const formattedLastMinuteDate = `${fDate(lastMinuteDate, formatStr.paramCase.db)} ${convertTimeFormat(
//               lastMinuteDate.toTimeString().substring(0, 5)
//             )}`;

//             ticketing.timeSensitivePricing.lastMinute = {
//               startDate: formattedLastMinuteDate,
//               discountedPrice: Number(lastMinute.discountedPrice),
//             };
//           }
//         }

//         // Fast Track Entry
//         if (data.ticketing.fastTrackEntry?.enabled) {
//           ticketing.fastTrackEntry = {
//             enabled: true,
//             quantity: Number(data.ticketing.fastTrackEntry.quantity) || 0,
//             extraPrice: Number(data.ticketing.fastTrackEntry.extraPrice) || 0,
//           };
//         }

//         // Requires Reservation
//         if (data.ticketing.requiresReservation?.enabled) {
//           ticketing.requiresReservation = {
//             enabled: true,
//             type: data.ticketing.requiresReservation.type || 'any',
//           };
//         }

//         // Publish Settings
//         const publishType = data.ticketing.publishSettings?.publishType || 'instant';

//         if (publishType === 'instant') {
//           ticketing.status = 'active';
//         } else if (publishType === 'manual') {
//           ticketing.status = 'inactive';
//         } else if (publishType === 'scheduled' && data.ticketing.publishSettings?.scheduledDate) {
//           ticketing.status = 'scheduled';
//           const scheduledDate = new Date(data.ticketing.publishSettings.scheduledDate);
//           ticketing.scheduledPublishAt = `${fDate(scheduledDate, formatStr.paramCase.db)} ${convertTimeFormat(
//             scheduledDate.toTimeString().substring(0, 5)
//           )}`;
//         }

//         payload.ticketing = ticketing;
//       }

//       console.log('Final Payload:', JSON.stringify(payload, null, 2));

//       let response = null;

//       if (!id) {
//         response = await addEvent(payload).unwrap();
//       } else {
//         response = await updateEvent({ id: id, ...payload }).unwrap();
//       }

//       console.log('response', response);

//       if (!response) {
//         showError('No response from server. Please try again later.');
//         return;
//       }

//       if (response.error) {
//         const errorMessage = getErrorMessage(response.error);
//         showError(errorMessage);
//         return;
//       }

//       if (response?.data) {
//         showSuccess(response?.message || (id ? 'Event updated successfully' : 'Event created successfully'));
//         router.push(`/${userType}/events`);
//       }
//     } catch (error) {
//       if (imageFileString) {
//         await deleteFileFromAzure(imageFileString);
//       }
//       console.log('Error adding event:', error);
//       const errorMessage = getErrorMessage(error);
//       showError(errorMessage);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Separate handler for skip functionality in create mode
//   const handleSkipTicketing = async () => {
//     const data = methods.getValues();
//     await onSubmit(data);
//   };

//   const setEditValues = useCallback(() => {
//     if (!event || !event._id) return;

//     console.log('Setting edit values for event:', event._id);

//     const organizationId = event?.basicInfo?.organization?._id || '';
//     const venueId = event?.basicInfo?.venue?._id || '';
//     const partnerOrgId = event?.basicInfo?.partnerOrganization?._id || '';

//     const fromDate_ = event?.schedule?.startDateTime ? new Date(event.schedule.startDateTime) : null;
//     const fromTime_ = event?.schedule?.startDateTime ? convertTimeFormat(event.schedule.startDateTime.split(' ').slice(1).join(' '), true) : '';
//     const endDate_ = event?.schedule?.endDateTime ? new Date(event.schedule.endDateTime) : null;
//     const endTime_ = event?.schedule?.endDateTime ? convertTimeFormat(event.schedule.endDateTime.split(' ').slice(1).join(' '), true) : '';

//     const formData: EventFormValues = {
//       image: event?.basicInfo?.media || null,
//       mediaUrl: event?.basicInfo?.media || '',
//       mediaType: event?.basicInfo?.media ? 'image' : 'image',

//       name: event?.basicInfo?.title || '',
//       description: event?.basicInfo?.description || '',

//       organization: organizationId,
//       venue: venueId,
//       partnerOrganization: partnerOrgId,
//       categories: event?.basicInfo?.categories?.map((cat: any) => cat._id) || [],
//       tags: event?.basicInfo?.tags?.map((tag: any) => tag._id) || [],

//       eventType: 'oneTime',

//       fromDate: fromDate_,
//       fromTime: fromTime_,
//       endDate: endDate_,
//       endTime: endTime_,

//       recurring: event?.schedule?.recurringDetails?.isEnabled || false,
//       recurringType: event?.schedule?.recurringDetails?.frequency || 'weekly',
//       recurringInterval: event?.schedule?.recurringDetails?.interval || 1,
//       recurringDays: event?.schedule?.recurringDetails?.daysOfWeek || [],
//       recurringEnd: event?.schedule?.recurringDetails?.endType || 'never',
//       recurringEndDate: event?.schedule?.recurringDetails?.endDate || null,
//       recurringEndCount: event?.schedule?.recurringDetails?.occurrences || 1,

//       categoryInput: '',
//       tagInput: '',
//       organizerInput: '',
//       partnerOrganizerInput: '',

//       partnerOrganizers: event?.basicInfo?.partnerOrganizers ? event.basicInfo.partnerOrganizers.map((org: any) => org._id) : [],

//       organizers: [],
//       daysOfWeek: [],
//     };

//     console.log('Form data to reset:', formData);

//     // Use setTimeout to ensure the organization value is set before the venue query runs
//     reset(formData);

//     // Mark as initialized AFTER reset
//     setTimeout(() => {
//       hasInitializedRef.current = true;
//       setIsFormInitialized(true);
//       console.log('Form initialized successfully');
//     }, 100);
//   }, [event, reset]);

//   // Reset initialization when the event ID changes or component unmounts
//   useEffect(() => {
//     const currentEventId = event?._id;

//     // If navigating to a different event, reset initialization
//     if (id && currentEventId && prevEventIdRef.current !== currentEventId) {
//       console.log('Event ID changed, resetting initialization');
//       hasInitializedRef.current = false;
//       setIsFormInitialized(false);
//       prevEventIdRef.current = currentEventId;
//     }
//   }, [id, event?._id]);

//   // Initialize form when event data is loaded
//   useEffect(() => {
//     if (id && eventLoaded && event?._id && !hasInitializedRef.current) {
//       console.log('Event loaded, initializing form');
//       setEditValues();
//     }
//   }, [id, eventLoaded, event?._id, setEditValues]);

//   // Reset when component unmounts or navigating away
//   useEffect(() => {
//     return () => {
//       console.log('Component unmounting, resetting refs');
//       hasInitializedRef.current = false;
//       prevEventIdRef.current = null;
//       setIsFormInitialized(false);
//     };
//   }, []);

//   return {
//     step,
//     setStep,
//     isEditMode,
//     showPartnerOrganizer,
//     setShowPartnerOrganizer,
//     file,
//     setFile,
//     venueModal,
//     setVenueModal,
//     loading,
//     methods,
//     watch,
//     setValue,
//     organizations,
//     orgLoading,
//     venues,
//     venuesLoading,
//     categoriesData,
//     categoriesLoading,
//     tagsd,
//     tagsLoading,
//     addEvent,
//     isAddingEvent,
//     updateEvent,
//     isUpdatingEvent,
//     removePartnerOrganizer,
//     toggleRecurringDay,
//     isStepValid,
//     onSubmit,
//     handleSkipTicketing,
//     router,
//     mediaUrl,
//     mediaType,
//     venue,
//     categories,
//     partnerOrganizers,
//     recurring,
//     recurringDays,
//     recurringEnd,
//     organization,
//   };
// };

// // 'use client';

// // import { useGetCategoriesQuery } from '@/store/Reducer/categories';
// // import { useAddeventMutation, useGeteventByIdQuery, useUpdateeventMutation } from '@/store/Reducer/events';
// // import { useGetOrganizationQuery } from '@/store/Reducer/organization';
// // import { useGetTagsQuery } from '@/store/Reducer/tags';
// // import { useGetVenuesQuery } from '@/store/Reducer/venue';
// // import { getErrorMessage } from '@/utils/api';
// // import { deleteFileFromAzure } from '@/utils/deleteFile';
// // import { uploadFileToAzure } from '@/utils/fileUpload';
// // import { convertTimeFormat, fDate, formatStr } from '@/utils/format-time';
// // import { showError, showSuccess } from '@/utils/toast';
// // import { yupResolver } from '@hookform/resolvers/yup';
// // import { skipToken } from '@reduxjs/toolkit/query';
// // import { useParams, useRouter } from 'next/navigation';
// // import { useCallback, useEffect, useRef, useState } from 'react';
// // import { Resolver, useForm } from 'react-hook-form';
// // import { defaultValues } from './constants';
// // import type { EventFormValues } from './types';
// // import { eventValidationSchema } from './validation';

// // export const useEventForm = (userType: string) => {
// //   const { id } = useParams();
// //   const router = useRouter();
// //   const isEditMode = !!id;

// //   const [step, setStep] = useState(1);
// //   const [loading, setLoading] = useState(false);
// //   const [file, setFile] = useState<File | null>(null);
// //   const [venueModal, setVenueModal] = useState<boolean>(false);
// //   const [isFormInitialized, setIsFormInitialized] = useState(false);
// //   const [showPartnerOrganizer, setShowPartnerOrganizer] = useState(false);

// //   // Track if we've set the initial values to prevent re-initialization
// //   const hasInitializedRef = useRef(false);
// //   const prevEventIdRef = useRef<string | null>(null);

// //   // CRITICAL FIX: Force refetch every time by using refetch and not relying on cache
// //   const {
// //     data: event = {},
// //     isSuccess: eventLoaded,
// //     refetch: refetchEvent,
// //     isFetching: isEventFetching,
// //   } = useGeteventByIdQuery(id ?? skipToken, {
// //     // Force refetch on mount and when id changes
// //     refetchOnMountOrArgChange: true,
// //     // Don't use cached data
// //     skip: !id,
// //   });

// //   console.log('event data:', event);
// //   console.log('isEventFetching:', isEventFetching);
// //   console.log('eventLoaded:', eventLoaded);

// //   const { data: { data: organizations = [] } = {}, isLoading: orgLoading } = useGetOrganizationQuery({
// //     page: 0,
// //     limit: 10000,
// //   });

// //   const { data: { data: categoriesData = [] } = {}, isLoading: categoriesLoading } = useGetCategoriesQuery({
// //     page: 0,
// //     limit: 10000,
// //   });

// //   const { data: { data: tagsd = [] } = {}, isLoading: tagsLoading } = useGetTagsQuery({
// //     page: 0,
// //     limit: 10000,
// //   });

// //   const [addEvent, { isLoading: isAddingEvent }] = useAddeventMutation();
// //   const [updateEvent, { isLoading: isUpdatingEvent }] = useUpdateeventMutation();

// //   const methods = useForm<EventFormValues>({
// //     defaultValues,
// //     resolver: yupResolver(eventValidationSchema) as unknown as Resolver<EventFormValues>,
// //   });

// //   const {
// //     watch,
// //     setValue,
// //     reset,
// //     formState: { errors },
// //   } = methods;

// //   console.log('errors', errors);

// //   const { mediaUrl, mediaType, venue, categories, partnerOrganizers, recurring, recurringDays, recurringEnd, organization } = watch();

// //   const { data: { data: venues = [] } = {}, isLoading: venuesLoading } = useGetVenuesQuery(
// //     organization ? { page: 0, limit: 1000, organization: organization } : skipToken,
// //     {
// //       skip: !organization,
// //     }
// //   );

// //   const prevOrganizationRef = useRef(organization);

// //   useEffect(() => {
// //     window.scrollTo({ top: 0, behavior: 'smooth' });
// //   }, [step]);

// //   // CRITICAL FIX: Refetch event data when component mounts in edit mode
// //   useEffect(() => {
// //     if (id && !hasInitializedRef.current) {
// //       console.log('Refetching event data for id:', id);
// //       refetchEvent();
// //     }
// //   }, [id, refetchEvent]);

// //   // Clear venue when organization changes (only after form is initialized and not during initial load)
// //   useEffect(() => {
// //     if (prevOrganizationRef.current && prevOrganizationRef.current !== organization && isFormInitialized) {
// //       setValue('venue', '');
// //     }
// //     prevOrganizationRef.current = organization;
// //   }, [organization, setValue, isFormInitialized]);

// //   useEffect(() => {
// //     if (organization && partnerOrganizers?.includes(organization)) {
// //       setValue(
// //         'partnerOrganizers',
// //         partnerOrganizers?.filter((po) => po !== organization)
// //       );
// //     }
// //   }, [organization, partnerOrganizers, setValue]);

// //   const removePartnerOrganizer = (val: string) => {
// //     setValue(
// //       'partnerOrganizers',
// //       partnerOrganizers.filter((v) => v !== val)
// //     );
// //   };

// //   const toggleRecurringDay = (day: string) => {
// //     const newDays = recurringDays.includes(day) ? recurringDays.filter((d) => d !== day) : [...recurringDays, day];
// //     setValue('recurringDays', newDays);
// //   };

// //   const isStepValid = (step: number): boolean => {
// //     if (step === 1) {
// //       return [
// //         mediaUrl,
// //         mediaType,
// //         watch('name'),
// //         watch('description'),
// //         venue,
// //         categories && categories.length > 0,
// //         watch('tags').length > 0,
// //         watch('organization'),
// //       ].every(Boolean);
// //     }
// //     if (step === 2) {
// //       const hasBasicFields = [watch('fromDate'), watch('endDate'), watch('fromTime'), watch('endTime')].every(Boolean);

// //       if (recurring) {
// //         const freq = watch('recurringType');
// //         const interval = watch('recurringInterval');
// //         const daysOfWeek = watch('recurringDays');
// //         const endType = watch('recurringEnd');
// //         const endDate = watch('recurringEndDate');
// //         const occurrences = watch('recurringEndCount');

// //         if (!freq || !interval || !endType || !daysOfWeek) return false;

// //         if (endType === 'never') {
// //           return hasBasicFields && !!freq && !!interval && !!endType;
// //         }
// //         if (endType === 'onDate') {
// //           return hasBasicFields && !!freq && !!interval && !!endType && !!endDate;
// //         }
// //         if (endType === 'afterOccurrences') {
// //           return hasBasicFields && !!freq && !!interval && !!endType && !!occurrences;
// //         }
// //         return false;
// //       }

// //       return hasBasicFields;
// //     }
// //     return false;
// //   };

// //   // FIXED: Proper onSubmit signature for react-hook-form
// //   const onSubmit = async (data: EventFormValues) => {
// //     let imageFileString = '';

// //     try {
// //       setLoading(true);
// //       if (file && file instanceof File) {
// //         imageFileString = await uploadFileToAzure(file);
// //         console.log('Uploaded file URL:', imageFileString);
// //       } else {
// //         imageFileString = data.mediaUrl || '';
// //       }

// //       // Build payload matching Postman example
// //       const payload: any = {
// //         basicInfo: {
// //           media: {
// //             type: data.mediaType || 'image',
// //             name: imageFileString,
// //           },
// //           title: data.name,
// //           description: data.description,
// //           organization: data.organization,
// //           venue: data.venue,
// //           categories: data.categories,
// //           tags: data.tags,
// //         },
// //         schedule: {
// //           type: 'oneTime',
// //           startDateTime: data.fromDate ? `${fDate(data.fromDate, formatStr.paramCase.db)} ${convertTimeFormat(data.fromTime)}` : '',
// //           endDateTime: data.endDate ? `${fDate(data.endDate, formatStr.paramCase.db)} ${convertTimeFormat(data.endTime)}` : '',
// //         },
// //       };

// //       // Add partnerOrganization if it exists
// //       if (data.partnerOrganization) {
// //         payload.basicInfo.partnerOrganization = data.partnerOrganization;
// //       }

// //       // Add recurring details if enabled
// //       if (data.recurring) {
// //         payload.schedule.recurringDetails = {
// //           isEnabled: true,
// //           frequency: data.recurringType,
// //           interval: data.recurringInterval,
// //           daysOfWeek: data.recurringDays.map((day: string) => day.substring(0, 3).toLowerCase()),
// //           endType: data.recurringEnd,
// //         };

// //         // Add endDate or occurrences based on endType
// //         if (data.recurringEnd === 'onDate' && data.recurringEndDate) {
// //           payload.schedule.recurringDetails.endDate = fDate(data.recurringEndDate, formatStr.paramCase.db);
// //         } else if (data.recurringEnd === 'afterOccurrences' && data.recurringEndCount) {
// //           payload.schedule.recurringDetails.occurrences = data.recurringEndCount;
// //         }
// //       }

// //       // EDIT MODE: Never include ticketing in edit mode
// //       // CREATE MODE: Include ticketing only if it's step 3 and not skipped
// //       if (!isEditMode && data.ticketing && step === 3) {
// //         const ticketing: any = {
// //           title: data.ticketing.title,
// //           price: Number(data.ticketing.price),
// //           taxPercentage: Number(data.ticketing.taxPercentage),
// //         };

// //         // Add quantity if timeslots not enabled
// //         if (!data.ticketing.timingSlots?.enabled) {
// //           ticketing.quantity = Number(data.ticketing.quantity);
// //         }

// //         // Timing Slots
// //         if (data.ticketing.timingSlots?.enabled && data.ticketing.timingSlots.dateTimeSlots) {
// //           ticketing.timingSlots = {
// //             enabled: true,
// //             dateTimeSlots: data.ticketing.timingSlots.dateTimeSlots,
// //           };
// //         }

// //         // Repeatable
// //         if (data.ticketing.repeatable?.isRepeatable) {
// //           ticketing.repeatable = {
// //             isRepeatable: true,
// //             visits: Number(data.ticketing.repeatable.visits) || 1,
// //           };
// //         }

// //         // Resale Protection
// //         if (data.ticketing.resaleProtection && data.ticketing.resaleProtection !== 'none') {
// //           ticketing.resaleProtection = data.ticketing.resaleProtection;
// //         }

// //         // Transfer Fee
// //         if (data.ticketing.transferFee !== null && data.ticketing.transferFee !== undefined) {
// //           ticketing.transferFee = Number(data.ticketing.transferFee);
// //         }

// //         // Time Sensitive Pricing
// //         const earlyBird = data.ticketing.timeSensitivePricing?.earlyBird;
// //         const lastMinute = data.ticketing.timeSensitivePricing?.lastMinute;

// //         if (
// //           (earlyBird?.enabled && earlyBird.endDate && earlyBird.discountedPrice) ||
// //           (lastMinute?.enabled && lastMinute.startDate && lastMinute.discountedPrice)
// //         ) {
// //           ticketing.timeSensitivePricing = {};

// //           if (earlyBird?.enabled && earlyBird.endDate && earlyBird.discountedPrice) {
// //             const earlyBirdDate = new Date(earlyBird.endDate);
// //             const formattedEarlyBirdDate = `${fDate(earlyBirdDate, formatStr.paramCase.db)} ${convertTimeFormat(
// //               earlyBirdDate.toTimeString().substring(0, 5)
// //             )}`;

// //             ticketing.timeSensitivePricing.earlyBird = {
// //               endDate: formattedEarlyBirdDate,
// //               discountedPrice: Number(earlyBird.discountedPrice),
// //             };
// //           }

// //           if (lastMinute?.enabled && lastMinute.startDate && lastMinute.discountedPrice) {
// //             const lastMinuteDate = new Date(lastMinute.startDate);
// //             const formattedLastMinuteDate = `${fDate(lastMinuteDate, formatStr.paramCase.db)} ${convertTimeFormat(
// //               lastMinuteDate.toTimeString().substring(0, 5)
// //             )}`;

// //             ticketing.timeSensitivePricing.lastMinute = {
// //               startDate: formattedLastMinuteDate,
// //               discountedPrice: Number(lastMinute.discountedPrice),
// //             };
// //           }
// //         }

// //         // Fast Track Entry
// //         if (data.ticketing.fastTrackEntry?.enabled) {
// //           ticketing.fastTrackEntry = {
// //             enabled: true,
// //             quantity: Number(data.ticketing.fastTrackEntry.quantity) || 0,
// //             extraPrice: Number(data.ticketing.fastTrackEntry.extraPrice) || 0,
// //           };
// //         }

// //         // Requires Reservation
// //         if (data.ticketing.requiresReservation?.enabled) {
// //           ticketing.requiresReservation = {
// //             enabled: true,
// //             type: data.ticketing.requiresReservation.type || 'any',
// //           };
// //         }

// //         // Publish Settings
// //         const publishType = data.ticketing.publishSettings?.publishType || 'instant';

// //         if (publishType === 'instant') {
// //           ticketing.status = 'active';
// //         } else if (publishType === 'manual') {
// //           ticketing.status = 'inactive';
// //         } else if (publishType === 'scheduled' && data.ticketing.publishSettings?.scheduledDate) {
// //           ticketing.status = 'scheduled';
// //           const scheduledDate = new Date(data.ticketing.publishSettings.scheduledDate);
// //           ticketing.scheduledPublishAt = `${fDate(scheduledDate, formatStr.paramCase.db)} ${convertTimeFormat(
// //             scheduledDate.toTimeString().substring(0, 5)
// //           )}`;
// //         }

// //         payload.ticketing = ticketing;
// //       }

// //       console.log('Final Payload:', JSON.stringify(payload, null, 2));

// //       let response = null;

// //       if (!id) {
// //         response = await addEvent(payload).unwrap();
// //       } else {
// //         response = await updateEvent({ id: id, ...payload }).unwrap();
// //       }

// //       console.log('response', response);

// //       if (!response) {
// //         showError('No response from server. Please try again later.');
// //         return;
// //       }

// //       if (response.error) {
// //         const errorMessage = getErrorMessage(response.error);
// //         showError(errorMessage);
// //         return;
// //       }

// //       if (response?.data) {
// //         showSuccess(response?.message || (id ? 'Event updated successfully' : 'Event created successfully'));
// //         router.push(`/${userType}/events`);
// //       }
// //     } catch (error) {
// //       if (imageFileString) {
// //         await deleteFileFromAzure(imageFileString);
// //       }
// //       console.log('Error adding event:', error);
// //       const errorMessage = getErrorMessage(error);
// //       showError(errorMessage);
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   // Separate handler for skip functionality in create mode
// //   const handleSkipTicketing = async () => {
// //     const data = methods.getValues();
// //     await onSubmit(data);
// //   };

// //   const setEditValues = useCallback(() => {
// //     if (!event || !event._id) return;

// //     console.log('Setting edit values for event:', event._id);

// //     const organizationId = event?.basicInfo?.organization?._id || '';
// //     const venueId = event?.basicInfo?.venue?._id || '';
// //     const partnerOrgId = event?.basicInfo?.partnerOrganization?._id || '';

// //     const fromDate_ = event?.schedule?.startDateTime ? new Date(event.schedule.startDateTime) : null;
// //     const fromTime_ = event?.schedule?.startDateTime ? convertTimeFormat(event.schedule.startDateTime.split(' ').slice(1).join(' '), true) : '';
// //     const endDate_ = event?.schedule?.endDateTime ? new Date(event.schedule.endDateTime) : null;
// //     const endTime_ = event?.schedule?.endDateTime ? convertTimeFormat(event.schedule.endDateTime.split(' ').slice(1).join(' '), true) : '';

// //     const formData: EventFormValues = {
// //       image: event?.basicInfo?.media || null,
// //       mediaUrl: event?.basicInfo?.media || '',
// //       mediaType: event?.basicInfo?.media ? 'image' : 'image',

// //       name: event?.basicInfo?.title || '',
// //       description: event?.basicInfo?.description || '',

// //       organization: organizationId,
// //       venue: venueId,
// //       partnerOrganization: partnerOrgId,
// //       categories: event?.basicInfo?.categories?.map((cat: any) => cat._id) || [],
// //       tags: event?.basicInfo?.tags?.map((tag: any) => tag._id) || [],

// //       eventType: 'oneTime',

// //       fromDate: fromDate_,
// //       fromTime: fromTime_,
// //       endDate: endDate_,
// //       endTime: endTime_,

// //       recurring: event?.schedule?.recurringDetails?.isEnabled || false,
// //       recurringType: event?.schedule?.recurringDetails?.frequency || 'weekly',
// //       recurringInterval: event?.schedule?.recurringDetails?.interval || 1,
// //       recurringDays: event?.schedule?.recurringDetails?.daysOfWeek || [],
// //       recurringEnd: event?.schedule?.recurringDetails?.endType || 'never',
// //       recurringEndDate: event?.schedule?.recurringDetails?.endDate || null,
// //       recurringEndCount: event?.schedule?.recurringDetails?.occurrences || 1,

// //       categoryInput: '',
// //       tagInput: '',
// //       organizerInput: '',
// //       partnerOrganizerInput: '',

// //       partnerOrganizers: event?.basicInfo?.partnerOrganizers ? event.basicInfo.partnerOrganizers.map((org: any) => org._id) : [],

// //       organizers: [],
// //       daysOfWeek: [],
// //     };

// //     console.log('Form data to reset:', formData);

// //     // Use setTimeout to ensure the organization value is set before the venue query runs
// //     reset(formData);

// //     // Mark as initialized AFTER reset
// //     setTimeout(() => {
// //       hasInitializedRef.current = true;
// //       setIsFormInitialized(true);
// //       console.log('Form initialized successfully');
// //     }, 100);
// //   }, [event, reset]);

// //   // Reset initialization when the event ID changes or component unmounts
// //   useEffect(() => {
// //     const currentEventId = event?._id;

// //     // If navigating to a different event, reset initialization
// //     if (id && currentEventId && prevEventIdRef.current !== currentEventId) {
// //       console.log('Event ID changed, resetting initialization');
// //       hasInitializedRef.current = false;
// //       setIsFormInitialized(false);
// //       prevEventIdRef.current = currentEventId;
// //     }
// //   }, [id, event?._id]);

// //   // Initialize form when event data is loaded
// //   useEffect(() => {
// //     if (id && eventLoaded && event?._id && !hasInitializedRef.current) {
// //       console.log('Event loaded, initializing form');
// //       setEditValues();
// //     }
// //   }, [id, eventLoaded, event?._id, setEditValues]);

// //   // Reset when component unmounts or navigating away
// //   useEffect(() => {
// //     return () => {
// //       console.log('Component unmounting, resetting refs');
// //       hasInitializedRef.current = false;
// //       prevEventIdRef.current = null;
// //       setIsFormInitialized(false);
// //     };
// //   }, []);

// //   return {
// //     step,
// //     setStep,
// //     isEditMode,
// //     showPartnerOrganizer,
// //     setShowPartnerOrganizer,
// //     file,
// //     setFile,
// //     venueModal,
// //     setVenueModal,
// //     loading,
// //     methods,
// //     watch,
// //     setValue,
// //     organizations,
// //     orgLoading,
// //     venues,
// //     venuesLoading,
// //     categoriesData,
// //     categoriesLoading,
// //     tagsd,
// //     tagsLoading,
// //     addEvent,
// //     isAddingEvent,
// //     updateEvent,
// //     isUpdatingEvent,
// //     removePartnerOrganizer,
// //     toggleRecurringDay,
// //     isStepValid,
// //     onSubmit,
// //     handleSkipTicketing,
// //     router,
// //     mediaUrl,
// //     mediaType,
// //     venue,
// //     categories,
// //     partnerOrganizers,
// //     recurring,
// //     recurringDays,
// //     recurringEnd,
// //     organization,
// //   };
// // };

// // // 'use client';

// // // import { useGetCategoriesQuery } from '@/store/Reducer/categories';
// // // import { useAddeventMutation, useGeteventByIdQuery, useUpdateeventMutation } from '@/store/Reducer/events';
// // // import { useGetOrganizationQuery } from '@/store/Reducer/organization';
// // // import { useGetTagsQuery } from '@/store/Reducer/tags';
// // // import { useGetVenuesQuery } from '@/store/Reducer/venue';
// // // import { getErrorMessage } from '@/utils/api';
// // // import { deleteFileFromAzure } from '@/utils/deleteFile';
// // // import { uploadFileToAzure } from '@/utils/fileUpload';
// // // import { convertTimeFormat, fDate, formatStr } from '@/utils/format-time';
// // // import { showError, showSuccess } from '@/utils/toast';
// // // import { yupResolver } from '@hookform/resolvers/yup';
// // // import { skipToken } from '@reduxjs/toolkit/query';
// // // import { useParams, useRouter } from 'next/navigation';
// // // import { useCallback, useEffect, useRef, useState } from 'react';
// // // import { Resolver, useForm } from 'react-hook-form';
// // // import { defaultValues } from './constants';
// // // import { transformTicketingPayload } from './event-ticketing-helpers';
// // // import type { EventFormValues } from './types';
// // // import { eventValidationSchema } from './validation';

// // // export const useEventForm = (userType: string) => {
// // //   const { id } = useParams();
// // //   const router = useRouter();

// // //   const [step, setStep] = useState(1);
// // //   const [loading, setLoading] = useState(false);
// // //   const [file, setFile] = useState<File | null>(null);
// // //   const [venueModal, setVenueModal] = useState<boolean>(false);
// // //   const [isFormInitialized, setIsFormInitialized] = useState(false);
// // //   const [showPartnerOrganizer, setShowPartnerOrganizer] = useState(false);
// // //   const [timeSlotConfig, setTimeSlotConfig] = useState<any>(null);
// // //   const [showTimeSlotModal, setShowTimeSlotModal] = useState(false);

// // //   // Track if we've set the initial values to prevent re-initialization
// // //   const hasInitializedRef = useRef(false);
// // //   const prevEventIdRef = useRef<string | null>(null);

// // //   const { data: event = {}, isSuccess: eventLoaded } = useGeteventByIdQuery(id ?? skipToken);
// // //   console.log('event', event);

// // //   const { data: { data: organizations = [] } = {}, isLoading: orgLoading } = useGetOrganizationQuery({
// // //     page: 0,
// // //     limit: 10000,
// // //   });

// // //   const { data: { data: categoriesData = [] } = {}, isLoading: categoriesLoading } = useGetCategoriesQuery({
// // //     page: 0,
// // //     limit: 10000,
// // //   });

// // //   const { data: { data: tagsd = [] } = {}, isLoading: tagsLoading } = useGetTagsQuery({
// // //     page: 0,
// // //     limit: 10000,
// // //   });

// // //   const [addEvent, { isLoading: isAddingEvent }] = useAddeventMutation();
// // //   const [updateEvent, { isLoading: isUpdatingEvent }] = useUpdateeventMutation();

// // //   const methods = useForm<EventFormValues>({
// // //     defaultValues,
// // //     resolver: yupResolver(eventValidationSchema) as unknown as Resolver<EventFormValues>,
// // //   });

// // //   const {
// // //     watch,
// // //     setValue,
// // //     reset,
// // //     formState: { errors },
// // //   } = methods;

// // //   console.log('errors', errors);

// // //   const { mediaUrl, mediaType, venue, categories, partnerOrganizers, recurring, recurringDays, recurringEnd, organization } = watch();

// // //   const { data: { data: venues = [] } = {}, isLoading: venuesLoading } = useGetVenuesQuery(
// // //     organization ? { page: 0, limit: 1000, organization: organization } : skipToken,
// // //     {
// // //       skip: !organization,
// // //     }
// // //   );

// // //   const prevOrganizationRef = useRef(organization);

// // //   useEffect(() => {
// // //     window.scrollTo({ top: 0, behavior: 'smooth' });
// // //   }, [step]);

// // //   // Only clear venue if organization changes AND form is already initialized
// // //   // This prevents clearing venue on initial load
// // //   useEffect(() => {
// // //     if (prevOrganizationRef.current && prevOrganizationRef.current !== organization && isFormInitialized && hasInitializedRef.current) {
// // //       setValue('venue', '');
// // //     }
// // //     prevOrganizationRef.current = organization;
// // //   }, [organization, setValue, isFormInitialized]);

// // //   useEffect(() => {
// // //     if (organization && partnerOrganizers?.includes(organization)) {
// // //       setValue(
// // //         'partnerOrganizers',
// // //         partnerOrganizers?.filter((po) => po !== organization)
// // //       );
// // //     }
// // //   }, [organization, partnerOrganizers, setValue]);

// // //   const removePartnerOrganizer = (val: string) => {
// // //     setValue(
// // //       'partnerOrganizers',
// // //       partnerOrganizers.filter((v) => v !== val)
// // //     );
// // //   };

// // //   const toggleRecurringDay = (day: string) => {
// // //     const newDays = recurringDays.includes(day) ? recurringDays.filter((d) => d !== day) : [...recurringDays, day];
// // //     setValue('recurringDays', newDays);
// // //   };

// // //   const handleTimeSlotSave = (config: any) => {
// // //     setTimeSlotConfig(config);
// // //     setValue('features.timeSlotConfig', config, { shouldDirty: true });
// // //   };

// // //   const isStepValid = (step: number): boolean => {
// // //     if (step === 1) {
// // //       return [
// // //         mediaUrl,
// // //         mediaType,
// // //         watch('name'),
// // //         watch('description'),
// // //         venue,
// // //         categories && categories.length > 0,
// // //         watch('tags').length > 0,
// // //         watch('organization'),
// // //       ].every(Boolean);
// // //     }
// // //     if (step === 2) {
// // //       const hasBasicFields = [watch('fromDate'), watch('endDate'), watch('fromTime'), watch('endTime')].every(Boolean);

// // //       if (recurring) {
// // //         const freq = watch('recurringType');
// // //         const interval = watch('recurringInterval');
// // //         const daysOfWeek = watch('recurringDays');
// // //         const endType = watch('recurringEnd');
// // //         const endDate = watch('recurringEndDate');
// // //         const occurrences = watch('recurringEndCount');

// // //         if (!freq || !interval || !endType || !daysOfWeek) return false;

// // //         if (endType === 'never') {
// // //           return hasBasicFields && !!freq && !!interval && !!endType;
// // //         }
// // //         if (endType === 'onDate') {
// // //           return hasBasicFields && !!freq && !!interval && !!endType && !!endDate;
// // //         }
// // //         if (endType === 'afterOccurrences') {
// // //           return hasBasicFields && !!freq && !!interval && !!endType && !!occurrences;
// // //         }
// // //         return false;
// // //       }

// // //       return hasBasicFields;
// // //     }
// // //     return false;
// // //   };

// // //   const onSubmit = async (data: EventFormValues, skipTicketing: boolean = false) => {
// // //     let imageFileString = '';

// // //     try {
// // //       setLoading(true);
// // //       if (file && file instanceof File) {
// // //         imageFileString = await uploadFileToAzure(file);
// // //         console.log('Uploaded file URL:', imageFileString);
// // //       } else {
// // //         imageFileString = data.mediaUrl || '';
// // //       }

// // //       // Build payload matching Postman example
// // //       const payload: any = {
// // //         basicInfo: {
// // //           media: {
// // //             type: data.mediaType || 'image',
// // //             name: imageFileString,
// // //           },
// // //           title: data.name,
// // //           description: data.description,
// // //           organization: data.organization,
// // //           venue: data.venue,
// // //           categories: data.categories,
// // //           tags: data.tags,
// // //         },
// // //         schedule: {
// // //           type: 'oneTime',
// // //           startDateTime: data.fromDate ? `${fDate(data.fromDate, formatStr.paramCase.db)} ${convertTimeFormat(data.fromTime)}` : '',
// // //           endDateTime: data.endDate ? `${fDate(data.endDate, formatStr.paramCase.db)} ${convertTimeFormat(data.endTime)}` : '',
// // //         },
// // //       };

// // //       // Add partnerOrganization if it exists
// // //       if (data.partnerOrganization) {
// // //         payload.basicInfo.partnerOrganization = data.partnerOrganization;
// // //       }

// // //       // Add recurring details if enabled
// // //       if (data.recurring) {
// // //         payload.schedule.recurringDetails = {
// // //           isEnabled: true,
// // //           frequency: data.recurringType,
// // //           interval: data.recurringInterval,
// // //           daysOfWeek: data.recurringDays.map((day: string) => day.substring(0, 3).toLowerCase()),
// // //           endType: data.recurringEnd,
// // //         };

// // //         // Add endDate or occurrences based on endType
// // //         if (data.recurringEnd === 'onDate' && data.recurringEndDate) {
// // //           payload.schedule.recurringDetails.endDate = fDate(data.recurringEndDate, formatStr.paramCase.db);
// // //         } else if (data.recurringEnd === 'afterOccurrences' && data.recurringEndCount) {
// // //           payload.schedule.recurringDetails.occurrences = data.recurringEndCount;
// // //         }
// // //       }

// // //       // Add ticketing payload if not skipping
// // //       if (!skipTicketing && data.type && data.price && data.tax) {
// // //         const ticketingData = {
// // //           type: data.type,
// // //           quantity: data.quantity || 0,
// // //           price: data.price,
// // //           tax: data.tax,
// // //           publishSettings: data.publishSettings || {
// // //             publishType: 'instant' as const,
// // //             scheduledDate: '',
// // //           },
// // //           features: data.features || {
// // //             timeslot: false,
// // //             timeSlotConfig: null,
// // //             repeatable: false,
// // //             repeatableVisits: '',
// // //             resale: 'none' as const,
// // //             earlyBirdEnabled: false,
// // //             earlyBirdDate: '',
// // //             earlyBirdPrice: '',
// // //             lastMinuteEnabled: false,
// // //             lastMinuteDate: '',
// // //             lastMinutePrice: '',
// // //             fasttrack: false,
// // //             fasttrackQuantity: '',
// // //             fasttrackPrice: '',
// // //             reservation: false,
// // //             reservationType: '',
// // //             transfer: false,
// // //             transferFee: '',
// // //           },
// // //         };

// // //         // We need event ID, so if creating, we'll need to handle this differently
// // //         // For now, we'll add ticketing to payload
// // //         const ticketingPayload = transformTicketingPayload(ticketingData as any, '');

// // //         // Remove event field since it's not needed in create/update event payload
// // //         delete ticketingPayload.event;

// // //         payload.ticketing = ticketingPayload;
// // //       }

// // //       console.log('Final Payload:', payload);

// // //       let response = null;

// // //       if (!id) {
// // //         response = await addEvent(payload).unwrap();
// // //       } else {
// // //         response = await updateEvent({ id: id, ...payload }).unwrap();
// // //       }

// // //       console.log('response', response);

// // //       if (!response) {
// // //         showError('No response from server. Please try again later.');
// // //         return;
// // //       }

// // //       if (response.error) {
// // //         const errorMessage = getErrorMessage(response.error);
// // //         showError(errorMessage);
// // //         return;
// // //       }

// // //       if (response?.data) {
// // //         showSuccess(response?.message || (id ? 'Event updated successfully' : 'Event created successfully'));
// // //         router.push(`/${userType}/events`);
// // //       }
// // //     } catch (error) {
// // //       if (imageFileString) {
// // //         await deleteFileFromAzure(imageFileString);
// // //       }
// // //       console.log('Error adding event:', error);
// // //       const errorMessage = getErrorMessage(error);
// // //       showError(errorMessage);
// // //     } finally {
// // //       setLoading(false);
// // //     }
// // //   };

// // //   const setEditValues = useCallback(() => {
// // //     if (!event || !event._id) return;

// // //     const organizationId = event?.basicInfo?.organization?._id || '';
// // //     const venueId = event?.basicInfo?.venue?._id || '';
// // //     const partnerOrgId = event?.basicInfo?.partnerOrganization?._id || '';

// // //     const fromDate_ = event?.schedule?.startDateTime ? new Date(event.schedule.startDateTime) : null;
// // //     const fromTime_ = event?.schedule?.startDateTime ? convertTimeFormat(event.schedule.startDateTime.split(' ').slice(1).join(' '), true) : '';
// // //     const endDate_ = event?.schedule?.endDateTime ? new Date(event.schedule.endDateTime) : null;
// // //     const endTime_ = event?.schedule?.endDateTime ? convertTimeFormat(event.schedule.endDateTime.split(' ').slice(1).join(' '), true) : '';

// // //     const formData: EventFormValues = {
// // //       image: event?.basicInfo?.media || null,
// // //       mediaUrl: event?.basicInfo?.media || '',
// // //       mediaType: event?.basicInfo?.media || 'image',

// // //       name: event?.basicInfo?.title || '',
// // //       description: event?.basicInfo?.description || '',

// // //       organization: organizationId,
// // //       venue: venueId,
// // //       partnerOrganization: partnerOrgId,
// // //       categories: event?.basicInfo?.categories?.map((cat: any) => cat._id) || [],
// // //       tags: event?.basicInfo?.tags?.map((tag: any) => tag._id) || [],

// // //       eventType: 'oneTime',

// // //       fromDate: fromDate_,
// // //       fromTime: fromTime_,
// // //       endDate: endDate_,
// // //       endTime: endTime_,

// // //       recurring: event?.schedule?.recurringDetails?.isEnabled || false,
// // //       recurringType: event?.schedule?.recurringDetails?.frequency || 'weekly',
// // //       recurringInterval: event?.schedule?.recurringDetails?.interval || 1,
// // //       recurringDays: event?.schedule?.recurringDetails?.daysOfWeek || [],
// // //       recurringEnd: event?.schedule?.recurringDetails?.endType || 'never',
// // //       recurringEndDate: event?.schedule?.recurringDetails?.endDate || null,
// // //       recurringEndCount: event?.schedule?.recurringDetails?.occurrences || 1,

// // //       categoryInput: '',
// // //       tagInput: '',
// // //       organizerInput: '',
// // //       partnerOrganizerInput: '',

// // //       partnerOrganizers: event?.basicInfo?.partnerOrganizers ? event.basicInfo.partnerOrganizers.map((org: any) => org._id) : [],

// // //       organizers: [],
// // //       daysOfWeek: [],

// // //       // Initialize ticketing fields with defaults
// // //       type: '',
// // //       quantity: 0,
// // //       price: 0,
// // //       tax: '',
// // //       publishSettings: {
// // //         publishType: 'instant' as const,
// // //         scheduledDate: '',
// // //       },
// // //       features: {
// // //         timeslot: false,
// // //         timeSlotConfig: null,
// // //         repeatable: false,
// // //         repeatableVisits: '',
// // //         resale: 'none' as const,
// // //         earlyBirdEnabled: false,
// // //         earlyBirdDate: '',
// // //         earlyBirdPrice: '',
// // //         lastMinuteEnabled: false,
// // //         lastMinuteDate: '',
// // //         lastMinutePrice: '',
// // //         fasttrack: false,
// // //         fasttrackQuantity: '',
// // //         fasttrackPrice: '',
// // //         reservation: false,
// // //         reservationType: '',
// // //         transfer: false,
// // //         transferFee: '',
// // //       },
// // //     };

// // //     // Important: Reset form first, then set initialized flags
// // //     reset(formData);

// // //     // Set flags AFTER reset to prevent clearing venue
// // //     setIsFormInitialized(true);
// // //     hasInitializedRef.current = true;

// // //     // Update refs to current values
// // //     prevOrganizationRef.current = organizationId;
// // //   }, [event, reset]);

// // //   // Reset initialization when the event ID changes
// // //   useEffect(() => {
// // //     const currentEventId = event?._id;

// // //     if (id && currentEventId && prevEventIdRef.current !== currentEventId) {
// // //       hasInitializedRef.current = false;
// // //       setIsFormInitialized(false);
// // //       prevEventIdRef.current = currentEventId;
// // //     }
// // //   }, [id, event?._id]);

// // //   // Initialize form when event data is loaded
// // //   useEffect(() => {
// // //     if (id && eventLoaded && event?._id && !hasInitializedRef.current) {
// // //       setEditValues();
// // //     }
// // //   }, [id, eventLoaded, event?._id, setEditValues]);

// // //   // Reset when component unmounts or navigating away
// // //   useEffect(() => {
// // //     return () => {
// // //       hasInitializedRef.current = false;
// // //       prevEventIdRef.current = null;
// // //       setIsFormInitialized(false);
// // //     };
// // //   }, []);

// // //   return {
// // //     step,
// // //     setStep,
// // //     showPartnerOrganizer,
// // //     setShowPartnerOrganizer,
// // //     file,
// // //     setFile,
// // //     venueModal,
// // //     setVenueModal,
// // //     loading,
// // //     methods,
// // //     watch,
// // //     setValue,
// // //     organizations,
// // //     orgLoading,
// // //     venues,
// // //     venuesLoading,
// // //     categoriesData,
// // //     categoriesLoading,
// // //     tagsd,
// // //     tagsLoading,
// // //     addEvent,
// // //     isAddingEvent,
// // //     updateEvent,
// // //     isUpdatingEvent,
// // //     removePartnerOrganizer,
// // //     toggleRecurringDay,
// // //     isStepValid,
// // //     onSubmit,
// // //     router,
// // //     mediaUrl,
// // //     mediaType,
// // //     venue,
// // //     categories,
// // //     partnerOrganizers,
// // //     recurring,
// // //     recurringDays,
// // //     recurringEnd,
// // //     organization,
// // //     event,
// // //     timeSlotConfig,
// // //     setTimeSlotConfig,
// // //     showTimeSlotModal,
// // //     setShowTimeSlotModal,
// // //     handleTimeSlotSave,
// // //   };
// // // };

// // // // 'use client';

// // // // import { useGetCategoriesQuery } from '@/store/Reducer/categories';
// // // // import { useAddeventMutation, useGeteventByIdQuery, useUpdateeventMutation } from '@/store/Reducer/events';
// // // // import { useGetOrganizationQuery } from '@/store/Reducer/organization';
// // // // import { useGetTagsQuery } from '@/store/Reducer/tags';
// // // // import { useGetVenuesQuery } from '@/store/Reducer/venue';
// // // // import { getErrorMessage } from '@/utils/api';
// // // // import { deleteFileFromAzure } from '@/utils/deleteFile';
// // // // import { uploadFileToAzure } from '@/utils/fileUpload';
// // // // import { convertTimeFormat, fDate, formatStr } from '@/utils/format-time';
// // // // import { showError } from '@/utils/toast';
// // // // import { yupResolver } from '@hookform/resolvers/yup';
// // // // import { skipToken } from '@reduxjs/toolkit/query';
// // // // import { useParams, useRouter } from 'next/navigation';
// // // // import { useCallback, useEffect, useRef, useState } from 'react';
// // // // import { Resolver, useForm } from 'react-hook-form';
// // // // import { defaultValues } from './constants';
// // // // import type { EventFormValues } from './types';
// // // // import { eventValidationSchema } from './validation';

// // // // export const useEventForm = (userType: string) => {
// // // //   const { id } = useParams();
// // // //   const router = useRouter();

// // // //   const [step, setStep] = useState(1);
// // // //   const [loading, setLoading] = useState(false);
// // // //   const [file, setFile] = useState<File | null>(null);
// // // //   const [venueModal, setVenueModal] = useState<boolean>(false);
// // // //   const [isFormInitialized, setIsFormInitialized] = useState(false);
// // // //   const [showPartnerOrganizer, setShowPartnerOrganizer] = useState(false);

// // // //   // Track if we've set the initial values to prevent re-initialization
// // // //   const hasInitializedRef = useRef(false);
// // // //   const prevEventIdRef = useRef<string | null>(null);

// // // //   const { data: event = {}, isSuccess: eventLoaded } = useGeteventByIdQuery(id ?? skipToken);
// // // //   console.log('event', event);

// // // //   const { data: { data: organizations = [] } = {}, isLoading: orgLoading } = useGetOrganizationQuery({
// // // //     page: 0,
// // // //     limit: 10000,
// // // //   });

// // // //   const { data: { data: categoriesData = [] } = {}, isLoading: categoriesLoading } = useGetCategoriesQuery({
// // // //     page: 0,
// // // //     limit: 10000,
// // // //   });

// // // //   const { data: { data: tagsd = [] } = {}, isLoading: tagsLoading } = useGetTagsQuery({
// // // //     page: 0,
// // // //     limit: 10000,
// // // //   });

// // // //   const [addEvent, { isLoading: isAddingEvent }] = useAddeventMutation();
// // // //   const [updateEvent, { isLoading: isUpdatingEvent }] = useUpdateeventMutation();

// // // //   const methods = useForm<EventFormValues>({
// // // //     defaultValues,
// // // //     resolver: yupResolver(eventValidationSchema) as unknown as Resolver<EventFormValues>,
// // // //   });

// // // //   const {
// // // //     watch,
// // // //     setValue,
// // // //     reset,
// // // //     formState: { errors },
// // // //   } = methods;

// // // //   console.log('errors', errors);

// // // //   const { mediaUrl, mediaType, venue, categories, partnerOrganizers, recurring, recurringDays, recurringEnd, organization } = watch();

// // // //   const { data: { data: venues = [] } = {}, isLoading: venuesLoading } = useGetVenuesQuery(
// // // //     organization ? { page: 0, limit: 1000, organization: organization } : skipToken,
// // // //     {
// // // //       skip: !organization,
// // // //     }
// // // //   );

// // // //   const prevOrganizationRef = useRef(organization);

// // // //   useEffect(() => {
// // // //     window.scrollTo({ top: 0, behavior: 'smooth' });
// // // //   }, [step]);

// // // //   useEffect(() => {
// // // //     if (prevOrganizationRef.current && prevOrganizationRef.current !== organization && isFormInitialized) {
// // // //       setValue('venue', '');
// // // //     }
// // // //     prevOrganizationRef.current = organization;
// // // //   }, [organization, setValue, isFormInitialized]);

// // // //   useEffect(() => {
// // // //     if (organization && partnerOrganizers?.includes(organization)) {
// // // //       setValue(
// // // //         'partnerOrganizers',
// // // //         partnerOrganizers?.filter((po) => po !== organization)
// // // //       );
// // // //     }
// // // //   }, [organization, partnerOrganizers, setValue]);

// // // //   const removePartnerOrganizer = (val: string) => {
// // // //     setValue(
// // // //       'partnerOrganizers',
// // // //       partnerOrganizers.filter((v) => v !== val)
// // // //     );
// // // //   };

// // // //   const toggleRecurringDay = (day: string) => {
// // // //     const newDays = recurringDays.includes(day) ? recurringDays.filter((d) => d !== day) : [...recurringDays, day];
// // // //     setValue('recurringDays', newDays);
// // // //   };

// // // //   const isStepValid = (step: number): boolean => {
// // // //     if (step === 1) {
// // // //       return [
// // // //         mediaUrl,
// // // //         mediaType,
// // // //         watch('name'),
// // // //         watch('description'),
// // // //         venue,
// // // //         categories && categories.length > 0,
// // // //         watch('tags').length > 0,
// // // //         watch('organization'),
// // // //       ].every(Boolean);
// // // //     }
// // // //     if (step === 2) {
// // // //       const hasBasicFields = [watch('fromDate'), watch('endDate'), watch('fromTime'), watch('endTime')].every(Boolean);

// // // //       if (recurring) {
// // // //         const freq = watch('recurringType');
// // // //         const interval = watch('recurringInterval');
// // // //         const daysOfWeek = watch('recurringDays');
// // // //         const endType = watch('recurringEnd');
// // // //         const endDate = watch('recurringEndDate');
// // // //         const occurrences = watch('recurringEndCount');

// // // //         if (!freq || !interval || !endType || !daysOfWeek) return false;

// // // //         if (endType === 'never') {
// // // //           return hasBasicFields && !!freq && !!interval && !!endType;
// // // //         }
// // // //         if (endType === 'onDate') {
// // // //           return hasBasicFields && !!freq && !!interval && !!endType && !!endDate;
// // // //         }
// // // //         if (endType === 'afterOccurrences') {
// // // //           return hasBasicFields && !!freq && !!interval && !!endType && !!occurrences;
// // // //         }
// // // //         return false;
// // // //       }

// // // //       return hasBasicFields;
// // // //     }
// // // //     return false;
// // // //   };

// // // //   const onSubmit = async (data: EventFormValues) => {
// // // //     let imageFileString = '';

// // // //     try {
// // // //       setLoading(true);
// // // //       if (file && file instanceof File) {
// // // //         imageFileString = await uploadFileToAzure(file);
// // // //         console.log('Uploaded file URL:', imageFileString);
// // // //       } else {
// // // //         imageFileString = data.mediaUrl || '';
// // // //       }

// // // //       // Build payload matching Postman example
// // // //       const payload: any = {
// // // //         basicInfo: {
// // // //           media: {
// // // //             type: 'image',
// // // //             name: imageFileString,
// // // //           },
// // // //           title: data.name,
// // // //           description: data.description,
// // // //           organization: data.organization,
// // // //           venue: data.venue,
// // // //           categories: data.categories,
// // // //           tags: data.tags,
// // // //         },
// // // //         schedule: {
// // // //           type: 'oneTime',
// // // //           startDateTime: data.fromDate ? `${fDate(data.fromDate, formatStr.paramCase.db)} ${convertTimeFormat(data.fromTime)}` : '',
// // // //           endDateTime: data.endDate ? `${fDate(data.endDate, formatStr.paramCase.db)} ${convertTimeFormat(data.endTime)}` : '',
// // // //         },
// // // //       };

// // // //       // Add partnerOrganization if it exists
// // // //       if (data.partnerOrganization) {
// // // //         payload.basicInfo.partnerOrganization = data.partnerOrganization;
// // // //       }

// // // //       // Add recurring details if enabled
// // // //       if (data.recurring) {
// // // //         payload.schedule.recurringDetails = {
// // // //           isEnabled: true,
// // // //           frequency: data.recurringType,
// // // //           interval: data.recurringInterval,
// // // //           daysOfWeek: data.recurringDays.map((day: string) => day.substring(0, 3).toLowerCase()),
// // // //           endType: data.recurringEnd,
// // // //           // endType: fDate(data.endDate, formatStr.paramCase.db),
// // // //         };

// // // //         // Add endDate or occurrences based on endType
// // // //         if (data.recurringEnd === 'onDate' && data.recurringEndDate) {
// // // //           // payload.schedule.recurringDetails.endDate = data.recurringEndDate;
// // // //           payload.schedule.recurringDetails.endDate = fDate(data.recurringEndDate, formatStr.paramCase.db);
// // // //         } else if (data.recurringEnd === 'afterOccurrences' && data.recurringEndCount) {
// // // //           payload.schedule.recurringDetails.occurrences = data.recurringEndCount;
// // // //         }
// // // //       }

// // // //       console.log('Final Payload:', payload);

// // // //       let response = null;

// // // //       if (!id) {
// // // //         response = await addEvent(payload).unwrap();
// // // //       } else {
// // // //         response = await updateEvent({ id: id, ...payload }).unwrap();
// // // //       }

// // // //       console.log('response', response);

// // // //       if (!response) {
// // // //         showError('No response from server. Please try again later.');
// // // //         return;
// // // //       }

// // // //       if (response.error) {
// // // //         const errorMessage = getErrorMessage(response.error);
// // // //         showError(errorMessage);
// // // //         return;
// // // //       }

// // // //       if (response?.data) {
// // // //         router.push(`/${userType}/events`);
// // // //       }
// // // //     } catch (error) {
// // // //       if (imageFileString) {
// // // //         await deleteFileFromAzure(imageFileString);
// // // //       }
// // // //       console.log('Error adding event:', error);
// // // //     } finally {
// // // //       setLoading(false);
// // // //     }
// // // //   };

// // // //   const setEditValues = useCallback(() => {
// // // //     if (!event || !event._id) return;

// // // //     const organizationId = event?.basicInfo?.organization?._id || '';
// // // //     const venueId = event?.basicInfo?.venue?._id || '';
// // // //     const partnerOrgId = event?.basicInfo?.partnerOrganization?._id || '';

// // // //     const fromDate_ = event?.schedule?.startDateTime ? new Date(event.schedule.startDateTime) : null;
// // // //     const fromTime_ = event?.schedule?.startDateTime ? convertTimeFormat(event.schedule.startDateTime.split(' ').slice(1).join(' '), true) : '';
// // // //     const endDate_ = event?.schedule?.endDateTime ? new Date(event.schedule.endDateTime) : null;
// // // //     const endTime_ = event?.schedule?.endDateTime ? convertTimeFormat(event.schedule.endDateTime.split(' ').slice(1).join(' '), true) : '';

// // // //     const formData: EventFormValues = {
// // // //       image: event?.basicInfo?.media || null,
// // // //       mediaUrl: event?.basicInfo?.media || '',
// // // //       mediaType: event?.basicInfo?.media || 'image',

// // // //       name: event?.basicInfo?.title || '',
// // // //       description: event?.basicInfo?.description || '',

// // // //       organization: organizationId,
// // // //       venue: venueId,
// // // //       partnerOrganization: partnerOrgId,
// // // //       categories: event?.basicInfo?.categories?.map((cat: any) => cat._id) || [],
// // // //       tags: event?.basicInfo?.tags?.map((tag: any) => tag._id) || [],

// // // //       eventType: 'oneTime',

// // // //       fromDate: fromDate_,
// // // //       fromTime: fromTime_,
// // // //       endDate: endDate_,
// // // //       endTime: endTime_,

// // // //       recurring: event?.schedule?.recurringDetails?.isEnabled || false,
// // // //       recurringType: event?.schedule?.recurringDetails?.frequency || 'weekly',
// // // //       recurringInterval: event?.schedule?.recurringDetails?.interval || 1,
// // // //       recurringDays: event?.schedule?.recurringDetails?.daysOfWeek || [],
// // // //       recurringEnd: event?.schedule?.recurringDetails?.endType || 'never',
// // // //       recurringEndDate: event?.schedule?.recurringDetails?.endDate || null,
// // // //       recurringEndCount: event?.schedule?.recurringDetails?.occurrences || 1,

// // // //       categoryInput: '',
// // // //       tagInput: '',
// // // //       organizerInput: '',
// // // //       partnerOrganizerInput: '',

// // // //       partnerOrganizers: event?.basicInfo?.partnerOrganizers ? event.basicInfo.partnerOrganizers.map((org: any) => org._id) : [],

// // // //       organizers: [],
// // // //       daysOfWeek: [],
// // // //     };

// // // //     reset(formData);
// // // //     hasInitializedRef.current = true;
// // // //     setIsFormInitialized(true);
// // // //   }, [event, reset]);

// // // //   // Reset initialization when the event ID changes
// // // //   useEffect(() => {
// // // //     const currentEventId = event?._id;

// // // //     if (id && currentEventId && prevEventIdRef.current !== currentEventId) {
// // // //       hasInitializedRef.current = false;
// // // //       setIsFormInitialized(false);
// // // //       prevEventIdRef.current = currentEventId;
// // // //     }
// // // //   }, [id, event?._id]);

// // // //   // Initialize form when event data is loaded
// // // //   useEffect(() => {
// // // //     if (id && eventLoaded && event?._id && !hasInitializedRef.current) {
// // // //       setEditValues();
// // // //     }
// // // //   }, [id, eventLoaded, event?._id, setEditValues]);

// // // //   // Reset when component unmounts or navigating away
// // // //   useEffect(() => {
// // // //     return () => {
// // // //       hasInitializedRef.current = false;
// // // //       prevEventIdRef.current = null;
// // // //     };
// // // //   }, []);

// // // //   return {
// // // //     step,
// // // //     setStep,
// // // //     showPartnerOrganizer,
// // // //     setShowPartnerOrganizer,
// // // //     file,
// // // //     setFile,
// // // //     venueModal,
// // // //     setVenueModal,
// // // //     loading,
// // // //     methods,
// // // //     watch,
// // // //     setValue,
// // // //     organizations,
// // // //     orgLoading,
// // // //     venues,
// // // //     venuesLoading,
// // // //     categoriesData,
// // // //     categoriesLoading,
// // // //     tagsd,
// // // //     tagsLoading,
// // // //     addEvent,
// // // //     isAddingEvent,
// // // //     updateEvent,
// // // //     isUpdatingEvent,
// // // //     removePartnerOrganizer,
// // // //     toggleRecurringDay,
// // // //     isStepValid,
// // // //     onSubmit,
// // // //     router,
// // // //     mediaUrl,
// // // //     mediaType,
// // // //     venue,
// // // //     categories,
// // // //     partnerOrganizers,
// // // //     recurring,
// // // //     recurringDays,
// // // //     recurringEnd,
// // // //     organization,
// // // //   };
// // // // };
