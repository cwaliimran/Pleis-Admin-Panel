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
import { showError } from '@/utils/toast';
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

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [venueModal, setVenueModal] = useState<boolean>(false);
  const [isFormInitialized, setIsFormInitialized] = useState(false);
  const [showPartnerOrganizer, setShowPartnerOrganizer] = useState(false);

  // Track if we've set the initial values to prevent re-initialization
  const hasInitializedRef = useRef(false);
  const prevEventIdRef = useRef<string | null>(null);

  const { data: event = {}, isSuccess: eventLoaded } = useGeteventByIdQuery(id ?? skipToken);
  console.log('event', event);

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
    // formState: { errors },
  } = methods;

  // console.log('errors', errors);

  const { mediaUrl, mediaType, venue, categories, partnerOrganizers, recurring, recurringDays, recurringEnd, organization } = watch();

  const { data: { data: venues = [] } = {}, isLoading: venuesLoading } = useGetVenuesQuery(
    organization ? { page: 0, limit: 1000, organization: organization } : skipToken,
    {
      skip: !organization,
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
        console.log('Uploaded file URL:', imageFileString);
      } else {
        imageFileString = data.mediaUrl || '';
      }

      // Build payload matching Postman example
      const payload: any = {
        basicInfo: {
          media: {
            type: data.mediaType,
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

      // Add partnerOrganization if it exists
      if (data.partnerOrganization) {
        payload.basicInfo.partnerOrganization = data.partnerOrganization;
      }

      // Add recurring details if enabled
      if (data.recurring) {
        payload.schedule.recurringDetails = {
          isEnabled: true,
          frequency: data.recurringType,
          interval: data.recurringInterval,
          daysOfWeek: data.recurringDays.map((day: string) => day.substring(0, 3).toLowerCase()),
          endType: data.recurringEnd,
        };

        // Add endDate or occurrences based on endType
        if (data.recurringEnd === 'onDate' && data.recurringEndDate) {
          payload.schedule.recurringDetails.endDate = data.recurringEndDate;
        } else if (data.recurringEnd === 'afterOccurrences' && data.recurringEndCount) {
          payload.schedule.recurringDetails.occurrences = data.recurringEndCount;
        }
      }

      console.log('Final Payload:', payload);

      let response = null;

      if (!id) {
        response = await addEvent(payload).unwrap();
      } else {
        response = await updateEvent({ id: id, ...payload }).unwrap();
      }

      console.log('response', response);

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
        router.push(`/${userType}/events`);
      }
    } catch (error) {
      if (imageFileString) {
        await deleteFileFromAzure(imageFileString);
      }
      console.log('Error adding event:', error);
    } finally {
      setLoading(false);
    }
  };

  const setEditValues = useCallback(() => {
    if (!event || !event._id) return;

    const organizationId = event?.basicInfo?.organization?._id || '';
    const venueId = event?.basicInfo?.venue?._id || '';
    const partnerOrgId = event?.basicInfo?.partnerOrganization?._id || '';

    const fromDate_ = event?.schedule?.startDateTime ? new Date(event.schedule.startDateTime) : null;
    const fromTime_ = event?.schedule?.startDateTime ? convertTimeFormat(event.schedule.startDateTime.split(' ').slice(1).join(' '), true) : '';
    const endDate_ = event?.schedule?.endDateTime ? new Date(event.schedule.endDateTime) : null;
    const endTime_ = event?.schedule?.endDateTime ? convertTimeFormat(event.schedule.endDateTime.split(' ').slice(1).join(' '), true) : '';

    const formData: EventFormValues = {
      image: event?.basicInfo?.media || null,
      mediaUrl: event?.basicInfo?.media || '',
      mediaType: event?.basicInfo?.media || 'image',

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
      recurringDays: event?.schedule?.recurringDetails?.daysOfWeek || [],
      recurringEnd: event?.schedule?.recurringDetails?.endType || 'never',
      recurringEndDate: event?.schedule?.recurringDetails?.endDate || null,
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
    hasInitializedRef.current = true;
    setIsFormInitialized(true);
  }, [event, reset]);

  // Reset initialization when the event ID changes
  useEffect(() => {
    const currentEventId = event?._id;

    if (id && currentEventId && prevEventIdRef.current !== currentEventId) {
      hasInitializedRef.current = false;
      setIsFormInitialized(false);
      prevEventIdRef.current = currentEventId;
    }
  }, [id, event?._id]);

  // Initialize form when event data is loaded
  useEffect(() => {
    if (id && eventLoaded && event?._id && !hasInitializedRef.current) {
      setEditValues();
    }
  }, [id, eventLoaded, event?._id, setEditValues]);

  // Reset when component unmounts or navigating away
  useEffect(() => {
    return () => {
      hasInitializedRef.current = false;
      prevEventIdRef.current = null;
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
// import { showError } from '@/utils/toast';
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

//   const [step, setStep] = useState(1);
//   const [loading, setLoading] = useState(false);
//   const [file, setFile] = useState<File | null>(null);
//   const [venueModal, setVenueModal] = useState<boolean>(false);
//   const [isFormInitialized, setIsFormInitialized] = useState(false);
//   const [showPartnerOrganizer, setShowPartnerOrganizer] = useState(false);

//   // Track if we've set the initial values to prevent re-initialization
//   const hasInitializedRef = useRef(false);

//   const { data: event = {}, isSuccess: eventLoaded } = useGeteventByIdQuery(id ?? skipToken);
//   console.log('event', event);

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
//     // formState: { errors },
//   } = methods;

//   // console.log('errors', errors);

//   const { mediaUrl, mediaType, venue, categories, partnerOrganizers, eventType, recurring, recurringDays, recurringEnd, organization } = watch();

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
//       const hasBasicFields = [watch('fromDate'), watch('endDate'), watch('fromTime'), watch('endTime'), eventType].every(Boolean);

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

//   const onSubmit = async (data: any) => {
//     let imageFileString = '';

//     try {
//       setLoading(true);
//       // if (file && (file instanceof FileList || Array.isArray(file))) {
//       if (file && file instanceof File) {
//         imageFileString = await uploadFileToAzure(file);
//         console.log('Uploaded file URL:', imageFileString);
//       } else {
//         imageFileString = data.mediaUrl || '';
//       }

//       const payload = {
//         basicInfo: {
//           media: {
//             type: data.mediaType,
//             name: imageFileString,
//           },
//           title: data.name,
//           description: data.description,
//           organization: data.organization,
//           partnerOrganizers: data.partnerOrganizers,
//           venue: data.venue,
//           categories: data.categories,
//           tags: data.tags,
//         },
//         schedule: {
//           type: data.eventType,
//           startDateTime: data.fromDate ? `${fDate(data.fromDate, formatStr.paramCase.db)} ${convertTimeFormat(data.fromTime)}` : '',
//           endDateTime: data.endDate ? `${fDate(data.endDate, formatStr.paramCase.db)} ${convertTimeFormat(data.endTime)}` : '',
//           ...(data.recurring
//             ? {
//                 recurringDetails: {
//                   isEnabled: data.recurring,
//                   frequency: data.recurringType,
//                   interval: data.recurringInterval,
//                   daysOfWeek: data.recurringDays.map((day: string) => day.substring(0, 3).toLowerCase()),
//                   endType: data.recurringEnd,
//                   endDate: data.recurringEndDate,
//                   occurrences: data.recurringEndCount,
//                 },
//               }
//             : {}),
//         },
//       };

//       console.log('Final Payload:', payload);

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
//         router.push(`/${userType}/events`);
//       }
//     } catch (error) {
//       if (imageFileString) {
//         await deleteFileFromAzure(imageFileString);
//       }
//       console.log('Error adding event:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const setEditValues = useCallback(() => {
//     if (!event || !event._id || hasInitializedRef.current) return;

//     const organizationId = event?.basicInfo?.organization?._id || '';

//     const fromDate_ = event?.schedule?.startDateTime ? new Date(event.schedule.startDateTime) : null;
//     const fromTime_ = event?.schedule?.startDateTime ? convertTimeFormat(event.schedule.startDateTime.split(' ').slice(1).join(' '), true) : '';
//     const endDate_ = event?.schedule?.endDateTime ? new Date(event.schedule.endDateTime) : null;
//     const endTime_ = event?.schedule?.endDateTime ? convertTimeFormat(event.schedule.endDateTime.split(' ').slice(1).join(' '), true) : '';

//     const formData = {
//       image: event?.basicInfo?.media || null,
//       mediaUrl: event?.basicInfo?.media || '',
//       mediaType: event?.basicInfo?.media?.endsWith('.mp4') ? 'video' : 'image',

//       name: event?.basicInfo?.title || '',
//       description: event?.basicInfo?.description || '',

//       organization: organizationId,
//       venue: event?.basicInfo?.venue?._id || '',
//       categories: event?.basicInfo?.categories?.map((cat: any) => cat._id) || [],
//       tags: event?.basicInfo?.tags?.map((tag: any) => tag._id) || [],

//       eventType: event?.schedule?.type || 'oneTime',

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
//     };

//     reset(formData);
//     hasInitializedRef.current = true;
//     setIsFormInitialized(true);
//   }, [event, reset]);

//   // Initialize form when event data is loaded
//   useEffect(() => {
//     if (id && eventLoaded && event?._id && !hasInitializedRef.current) {
//       setEditValues();
//     }
//   }, [id, eventLoaded, event?._id, setEditValues]);

//   // Reset initialization flag when navigating to a different event
//   useEffect(() => {
//     if (id && event?._id && id !== event._id) {
//       hasInitializedRef.current = false;
//       setIsFormInitialized(false);
//     }
//   }, [id, event?._id]);

//   // Reset initialization when component unmounts
//   useEffect(() => {
//     return () => {
//       hasInitializedRef.current = false;
//     };
//   }, []);

//   return {
//     step,
//     setStep,
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
//     router,
//     mediaUrl,
//     mediaType,
//     venue,
//     categories,
//     partnerOrganizers,
//     eventType,
//     recurring,
//     recurringDays,
//     recurringEnd,
//     organization,
//   };
// };
