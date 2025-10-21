'use client';

import { yupResolver } from '@hookform/resolvers/yup';
import { useParams, useRouter } from 'next/navigation';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Resolver, useForm } from 'react-hook-form';
import { skipToken } from '@reduxjs/toolkit/query';
import {
  useAddeventMutation,
  useGeteventByIdQuery,
  useUpdateeventMutation,
} from '@/store/Reducer/events';
import { useGetOrganizationQuery } from '@/store/Reducer/organization';
import { useGetCategoriesQuery } from '@/store/Reducer/categories';
import { useGetTagsQuery } from '@/store/Reducer/tags';
import { useGetVenuesQuery } from '@/store/Reducer/venue';
import { uploadFileToAzure } from '@/utils/fileUpload';
import { deleteFileFromAzure } from '@/utils/deleteFile';
import { convertTimeFormat, fDate, formatStr } from '@/utils/format-time';
import { defaultValues } from './constants';
import { eventValidationSchema } from './validation';
import type { EventFormValues } from './types';

export const useEventForm = (userType: string) => {
  const [step, setStep] = useState(1);
  const [showPartnerOrganizer, setShowPartnerOrganizer] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [venueModal, setVenueModal] = useState<boolean>(false);
  const [loading, setLoading] = useState(false);
  const [isFormInitialized, setIsFormInitialized] = useState(false);
  const { id } = useParams();
  const router = useRouter();

  // Track if we've set the initial values to prevent re-initialization
  const hasInitializedRef = useRef(false);

  const { data: event = {}, isSuccess: eventLoaded } = useGeteventByIdQuery(
    id ?? skipToken
  );

  const { data: { data: organizations = [] } = {}, isLoading: orgLoading } =
    useGetOrganizationQuery({
      page: 0,
      limit: 10000,
    });

  const {
    data: { data: categoriesData = [] } = {},
    isLoading: categoriesLoading,
  } = useGetCategoriesQuery({
    page: 0,
    limit: 10000,
  });

  const { data: { data: tagsd = [] } = {}, isLoading: tagsLoading } =
    useGetTagsQuery({
      page: 0,
      limit: 10000,
    });

  const [addEvent, { isLoading: isAddingEvent }] = useAddeventMutation();
  const [updateEvent, { isLoading: isUpdatingEvent }] =
    useUpdateeventMutation();

  const methods = useForm<EventFormValues>({
    defaultValues,
    resolver: yupResolver(
      eventValidationSchema
    ) as unknown as Resolver<EventFormValues>,
  });

  const {
    watch,
    setValue,
    reset,
    formState: { errors },
  } = methods;

  console.log('errors', errors);

  const {
    mediaUrl,
    mediaType,
    venue,
    categories,
    partnerOrganizers,
    eventType,
    recurring,
    recurringDays,
    recurringEnd,
    organization,
  } = watch();

  const { data: { data: venues = [] } = {}, isLoading: venuesLoading } =
    useGetVenuesQuery(
      organization
        ? { page: 0, limit: 1000, organization: organization }
        : skipToken,
      {
        skip: !organization,
      }
    );

  const prevOrganizationRef = useRef(organization);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [step]);

  useEffect(() => {
    if (
      prevOrganizationRef.current &&
      prevOrganizationRef.current !== organization &&
      isFormInitialized
    ) {
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
    const newDays = recurringDays.includes(day)
      ? recurringDays.filter((d) => d !== day)
      : [...recurringDays, day];
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
      const hasBasicFields = [
        watch('fromDate'),
        watch('endDate'),
        watch('fromTime'),
        watch('endTime'),
        eventType,
      ].every(Boolean);

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
          return (
            hasBasicFields && !!freq && !!interval && !!endType && !!endDate
          );
        }
        if (endType === 'afterOccurrences') {
          return (
            hasBasicFields && !!freq && !!interval && !!endType && !!occurrences
          );
        }
        return false;
      }

      return hasBasicFields;
    }
    return false;
  };

  const onSubmit = async (data: any) => {
    let imageFileString = '';
    try {
      setLoading(true);
      if (file) {
        imageFileString = await uploadFileToAzure(file);
        console.log('Uploaded file URL:', imageFileString);
      } else {
        imageFileString = data.mediaUrl || '';
      }
      const payload = {
        basicInfo: {
          media: {
            type: data.mediaType,
            name: imageFileString,
          },
          title: data.name,
          description: data.description,
          organization: data.organization,
          partnerOrganizers: data.partnerOrganizers,
          venue: data.venue,
          categories: data.categories,
          tags: data.tags,
        },
        schedule: {
          type: data.eventType,
          startDateTime: data.fromDate
            ? `${fDate(data.fromDate, formatStr.paramCase.db)} ${convertTimeFormat(data.fromTime)}`
            : '',
          endDateTime: data.endDate
            ? `${fDate(data.endDate, formatStr.paramCase.db)} ${convertTimeFormat(data.endTime)}`
            : '',
          ...(data.recurring
            ? {
                recurringDetails: {
                  isEnabled: data.recurring,
                  frequency: data.recurringType,
                  interval: data.recurringInterval,
                  daysOfWeek: data.recurringDays.map((day: string) =>
                    day.substring(0, 3).toLowerCase()
                  ),
                  endType: data.recurringEnd,
                  endDate: data.recurringEndDate,
                  occurrences: data.recurringEndCount,
                },
              }
            : {}),
        },
      };

      console.log('Final Payload:', payload);

      let res = null;
      if (!id) {
        res = await addEvent(payload).unwrap();
      } else {
        res = await updateEvent({ id: id, ...payload }).unwrap();
      }

      if (res?.data) {
        router.push(`/${userType}/events/${res?.data?._id}`);
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
    if (!event || !event._id || hasInitializedRef.current) return;

    const organizationId = event?.basicInfo?.organization?._id || '';

    const fromDate_ = event?.schedule?.startDateTime
      ? new Date(event.schedule.startDateTime)
      : null;
    const fromTime_ = event?.schedule?.startDateTime
      ? convertTimeFormat(
          event.schedule.startDateTime.split(' ').slice(1).join(' '),
          true
        )
      : '';
    const endDate_ = event?.schedule?.endDateTime
      ? new Date(event.schedule.endDateTime)
      : null;
    const endTime_ = event?.schedule?.endDateTime
      ? convertTimeFormat(
          event.schedule.endDateTime.split(' ').slice(1).join(' '),
          true
        )
      : '';

    const formData = {
      image: event?.basicInfo?.mediaInfo?.url || null,
      mediaUrl: event?.basicInfo?.mediaInfo?.url || '',
      mediaType: event?.basicInfo?.mediaInfo?.type || 'image',

      name: event?.basicInfo?.title || '',
      description: event?.basicInfo?.description || '',

      organization: organizationId,
      venue: event?.basicInfo?.venue?._id || '',
      categories:
        event?.basicInfo?.categories?.map((cat: any) => cat._id) || [],
      tags: event?.basicInfo?.tags?.map((tag: any) => tag._id) || [],

      eventType: event?.schedule?.type || 'oneTime',

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

      partnerOrganizers: event?.basicInfo?.partnerOrganizers
        ? event.basicInfo.partnerOrganizers.map((org: any) => org._id)
        : [],
    };

    reset(formData);
    hasInitializedRef.current = true;
    setIsFormInitialized(true);
  }, [event, reset]);

  // Initialize form when event data is loaded
  useEffect(() => {
    if (id && eventLoaded && event?._id && !hasInitializedRef.current) {
      setEditValues();
    }
  }, [id, eventLoaded, event?._id, setEditValues]);

  // Reset initialization flag when navigating to a different event
  useEffect(() => {
    if (id && event?._id && id !== event._id) {
      hasInitializedRef.current = false;
      setIsFormInitialized(false);
    }
  }, [id, event?._id]);

  // Reset initialization when component unmounts
  useEffect(() => {
    return () => {
      hasInitializedRef.current = false;
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
    eventType,
    recurring,
    recurringDays,
    recurringEnd,
    organization,
  };
};
// 'use client';

// import { yupResolver } from '@hookform/resolvers/yup';
// import { useParams, useRouter } from 'next/navigation';
// import { useCallback, useEffect, useRef, useState } from 'react';
// import { Resolver, useForm } from 'react-hook-form';
// import { skipToken } from '@reduxjs/toolkit/query';
// import {
//   useAddeventMutation,
//   useGeteventByIdQuery,
//   useUpdateeventMutation,
// } from '@/store/Reducer/events';
// import { useGetOrganizationQuery } from '@/store/Reducer/organization';
// import { useGetCategoriesQuery } from '@/store/Reducer/categories';
// import { useGetTagsQuery } from '@/store/Reducer/tags';
// import { useGetVenuesQuery } from '@/store/Reducer/venue';
// import { uploadFileToAzure } from '@/utils/fileUpload';
// import { deleteFileFromAzure } from '@/utils/deleteFile';
// import { convertTimeFormat, fDate, formatStr } from '@/utils/format-time';
// import { defaultValues } from './constants';
// import { eventValidationSchema } from './validation';
// import type { EventFormValues } from './types';

// export const useEventForm = (userType: string) => {
//   const [step, setStep] = useState(1);
//   const [showPartnerOrganizer, setShowPartnerOrganizer] = useState(false);
//   const [file, setFile] = useState<File | null>(null);
//   const [venueModal, setVenueModal] = useState<boolean>(false);
//   const [loading, setLoading] = useState(false);
//   const { id } = useParams();
//   const router = useRouter();

//   const { data: event = {} } = useGeteventByIdQuery(id ?? skipToken);

//   const { data: { data: organizations = [] } = {}, isLoading: orgLoading } =
//     useGetOrganizationQuery({
//       page: 0,
//       limit: 10000,
//     });

//   const {
//     data: { data: categoriesData = [] } = {},
//     isLoading: categoriesLoading,
//   } = useGetCategoriesQuery({
//     page: 0,
//     limit: 10000,
//   });

//   const { data: { data: tagsd = [] } = {}, isLoading: tagsLoading } =
//     useGetTagsQuery({
//       page: 0,
//       limit: 10000,
//     });

//   const [addEvent, { isLoading: isAddingEvent }] = useAddeventMutation();
//   const [updateEvent, { isLoading: isUpdatingEvent }] =
//     useUpdateeventMutation();

//   const methods = useForm<EventFormValues>({
//     defaultValues,
//     resolver: yupResolver(
//       eventValidationSchema
//     ) as unknown as Resolver<EventFormValues>,
//   });

//   const {
//     watch,
//     setValue,
//     reset,
//     formState: { errors },
//   } = methods;

//   console.log('errors', errors);

//   const {
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
//   } = watch();

//   const { data: { data: venues = [] } = {}, isLoading: venuesLoading } =
//     useGetVenuesQuery(
//       organization
//         ? { page: 0, limit: 1000, organization: organization }
//         : { page: 0, limit: 1000 },
//       {
//         skip: !organization,
//       }
//     );

//   const prevOrganizationRef = useRef(organization);

//   useEffect(() => {
//     window.scrollTo({ top: 0, behavior: 'smooth' });
//   }, [step]);

//   useEffect(() => {
//     if (
//       prevOrganizationRef.current &&
//       prevOrganizationRef.current !== organization
//     ) {
//       setValue('venue', '');
//     }
//     prevOrganizationRef.current = organization;
//   }, [organization, setValue]);

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
//     const newDays = recurringDays.includes(day)
//       ? recurringDays.filter((d) => d !== day)
//       : [...recurringDays, day];
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
//       const hasBasicFields = [
//         watch('fromDate'),
//         watch('endDate'),
//         watch('fromTime'),
//         watch('endTime'),
//         eventType,
//       ].every(Boolean);

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
//           return (
//             hasBasicFields && !!freq && !!interval && !!endType && !!endDate
//           );
//         }
//         if (endType === 'afterOccurrences') {
//           return (
//             hasBasicFields && !!freq && !!interval && !!endType && !!occurrences
//           );
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
//       if (file) {
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
//           startDateTime: data.fromDate
//             ? `${fDate(data.fromDate, formatStr.paramCase.db)} ${convertTimeFormat(data.fromTime)}`
//             : '',
//           endDateTime: data.endDate
//             ? `${fDate(data.endDate, formatStr.paramCase.db)} ${convertTimeFormat(data.endTime)}`
//             : '',
//           ...(data.recurring
//             ? {
//                 recurringDetails: {
//                   isEnabled: data.recurring,
//                   frequency: data.recurringType,
//                   interval: data.recurringInterval,
//                   daysOfWeek: data.recurringDays.map((day: string) =>
//                     day.substring(0, 3).toLowerCase()
//                   ),
//                   endType: data.recurringEnd,
//                   endDate: data.recurringEndDate,
//                   occurrences: data.recurringEndCount,
//                 },
//               }
//             : {}),
//         },
//       };

//       console.log('Final Payload:', payload);

//       let res = null;
//       if (!id) {
//         res = await addEvent(payload).unwrap();
//       } else {
//         res = await updateEvent({ id: id, ...payload }).unwrap();
//       }

//       if (res?.data) {
//         router.push(`/${userType}/events/${res?.data?._id}`);
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
//     if (!event) return;

//     // CRITICAL: Set organization FIRST before other fields
//     const organizationId = event?.basicInfo?.organization?._id || '';
//     if (organizationId) {
//       setValue('organization', organizationId, { shouldValidate: true });
//     }

//     const fromDate_ = event?.schedule?.startDateTime
//       ? new Date(event.schedule.startDateTime)
//       : null;
//     const fromTime_ = event?.schedule?.startDateTime
//       ? convertTimeFormat(
//           event.schedule.startDateTime.split(' ').slice(1).join(' '),
//           true
//         )
//       : '';
//     const endDate_ = event?.schedule?.endDateTime
//       ? new Date(event.schedule.endDateTime)
//       : null;
//     const endTime_ = event?.schedule?.endDateTime
//       ? convertTimeFormat(
//           event.schedule.endDateTime.split(' ').slice(1).join(' '),
//           true
//         )
//       : '';

//     reset({
//       image: event?.basicInfo?.mediaInfo?.url || null,
//       mediaUrl: event?.basicInfo?.mediaInfo?.url || '',
//       mediaType: event?.basicInfo?.mediaInfo?.type || 'image',

//       name: event?.basicInfo?.title || '',
//       description: event?.basicInfo?.description || '',

//       venue: '', // Will be set after venues load
//       categories:
//         event?.basicInfo?.categories?.map((cat: any) => cat._id) || [],
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

//       organization: organizationId, // Set again in reset
//       partnerOrganizers: event?.basicInfo?.partnerOrganizers
//         ? event.basicInfo.partnerOrganizers.map((org: any) => org._id)
//         : [],
//     });
//   }, [event, reset, setValue]);

//   useEffect(() => {
//     if (event && event._id) {
//       setEditValues();
//     }
//   }, [event?._id]);

//   // Fix venue loading issue - wait for venues to load before setting venue value
//   useEffect(() => {
//     if (
//       event?._id &&
//       event?.basicInfo?.venue?._id &&
//       !venuesLoading &&
//       venues.length > 0
//     ) {
//       const venueExists = venues.some(
//         (v: any) => v._id === event.basicInfo.venue._id
//       );
//       if (venueExists && watch('venue') !== event.basicInfo.venue._id) {
//         setValue('venue', event.basicInfo.venue._id);
//       }
//     }
//   }, [event?._id, venues, venuesLoading, setValue]);

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

// // import { yupResolver } from '@hookform/resolvers/yup';
// // import { useParams, useRouter } from 'next/navigation';
// // import { useEffect, useRef, useState, useMemo, useCallback } from 'react';
// // import { Resolver, useForm } from 'react-hook-form';
// // import { skipToken } from '@reduxjs/toolkit/query';
// // import {
// //   useAddeventMutation,
// //   useGeteventByIdQuery,
// //   useUpdateeventMutation,
// // } from '@/store/Reducer/events';
// // import { useGetOrganizationQuery } from '@/store/Reducer/organization';
// // import { useGetCategoriesQuery } from '@/store/Reducer/categories';
// // import { useGetTagsQuery } from '@/store/Reducer/tags';
// // import { useGetVenuesQuery } from '@/store/Reducer/venue';
// // import { uploadFileToAzure } from '@/utils/fileUpload';
// // import { deleteFileFromAzure } from '@/utils/deleteFile';
// // import { convertTimeFormat, fDate, formatStr } from '@/utils/format-time';
// // import { defaultValues } from './constants';
// // import { eventValidationSchema } from './validation';
// // import type { EventFormValues } from './types';

// // export const useEventForm = (userType: string) => {
// //   const { id } = useParams();
// //   const router = useRouter();

// //   const [step, setStep] = useState(1);
// //   const [loading, setLoading] = useState(false);
// //   const [file, setFile] = useState<File | null>(null);
// //   const [venueModal, setVenueModal] = useState<boolean>(false);
// //   const [showPartnerOrganizer, setShowPartnerOrganizer] = useState(false);

// //   const { data: event = {}, isLoading: eventLoading } = useGeteventByIdQuery(
// //     id ?? skipToken
// //   );

// //   const { data: { data: organizations = [] } = {}, isLoading: orgLoading } =
// //     useGetOrganizationQuery({
// //       page: 0,
// //       limit: 10000,
// //     });

// //   const {
// //     data: { data: categoriesData = [] } = {},
// //     isLoading: categoriesLoading,
// //   } = useGetCategoriesQuery({
// //     page: 0,
// //     limit: 10000,
// //   });

// //   const { data: { data: tagsd = [] } = {}, isLoading: tagsLoading } =
// //     useGetTagsQuery({
// //       page: 0,
// //       limit: 10000,
// //     });

// //   const [addEvent, { isLoading: isAddingEvent }] = useAddeventMutation();
// //   const [updateEvent, { isLoading: isUpdatingEvent }] =
// //     useUpdateeventMutation();

// //   const methods = useForm<EventFormValues>({
// //     defaultValues,
// //     resolver: yupResolver(
// //       eventValidationSchema
// //     ) as unknown as Resolver<EventFormValues>,
// //     mode: 'onBlur',
// //     reValidateMode: 'onChange',
// //   });

// //   const {
// //     watch,
// //     setValue,
// //     reset,
// //     formState: { errors },
// //   } = methods;

// //   console.log('errors', errors);

// //   const {
// //     mediaUrl,
// //     mediaType,
// //     venue,
// //     categories,
// //     partnerOrganizers,
// //     eventType,
// //     recurring,
// //     recurringDays,
// //     recurringEnd,
// //     organization,
// //   } = watch();

// //   const { data: { data: venues = [] } = {}, isLoading: venuesLoading } =
// //     useGetVenuesQuery(
// //       organization
// //         ? { page: 0, limit: 1000, organization: organization }
// //         : { page: 0, limit: 1000 },
// //       {
// //         skip: !organization,
// //       }
// //     );

// //   const prevOrganizationRef = useRef(organization);

// //   // Scroll to top on step/version change
// //   useEffect(() => {
// //     window.scrollTo({ top: 0, behavior: 'smooth' });
// //   }, [step]);

// //   // Handle organization change - clear venue and remove from partner organizers
// //   useEffect(() => {
// //     if (!organization) return;

// //     // Clear venue when organization changes
// //     if (
// //       prevOrganizationRef.current &&
// //       prevOrganizationRef.current !== organization
// //     ) {
// //       setValue('venue', '');
// //     }

// //     // Remove partner organizer if it's the main organization
// //     if (partnerOrganizers?.includes(organization)) {
// //       setValue(
// //         'partnerOrganizers',
// //         partnerOrganizers.filter((po) => po !== organization)
// //       );
// //     }

// //     prevOrganizationRef.current = organization;
// //   }, [organization, partnerOrganizers, setValue]);

// //   // Memoized options for dropdowns
// //   const organizationOptions = useMemo(
// //     () =>
// //       organizations?.map((org: any) => ({
// //         value: org._id,
// //         label: org.basicInfo?.name,
// //       })) || [],
// //     [organizations]
// //   );

// //   const venueOptions = useMemo(
// //     () =>
// //       venues?.map((val: any) => ({
// //         value: val._id,
// //         label: val.title,
// //       })) || [],
// //     [venues]
// //   );

// //   const categoryOptions = useMemo(
// //     () =>
// //       categoriesData?.map((val: any) => ({
// //         value: val._id,
// //         label: val.title,
// //       })) || [],
// //     [categoriesData]
// //   );

// //   const tagOptions = useMemo(
// //     () =>
// //       tagsd?.map((val: any) => ({
// //         value: val._id,
// //         label: val.title,
// //       })) || [],
// //     [tagsd]
// //   );

// //   const partnerOrganizerOptions = useMemo(
// //     () =>
// //       organizations
// //         ?.filter(
// //           (org: any) =>
// //             org._id !== organization && !partnerOrganizers?.includes(org._id)
// //         )
// //         ?.map((org: any) => ({
// //           value: org._id,
// //           label: org.basicInfo?.name,
// //         })) || [],
// //     [organizations, organization, partnerOrganizers]
// //   );

// //   // Memoized callbacks
// //   const removePartnerOrganizer = useCallback(
// //     (val: string) => {
// //       setValue(
// //         'partnerOrganizers',
// //         partnerOrganizers.filter((v) => v !== val)
// //       );
// //     },
// //     [partnerOrganizers, setValue]
// //   );

// //   const toggleRecurringDay = useCallback(
// //     (day: string) => {
// //       const newDays = recurringDays.includes(day)
// //         ? recurringDays.filter((d) => d !== day)
// //         : [...recurringDays, day];
// //       setValue('recurringDays', newDays);
// //     },
// //     [recurringDays, setValue]
// //   );

// //   const isStepValid = useCallback(
// //     (step: number): boolean => {
// //       if (step === 1) {
// //         return [
// //           mediaUrl,
// //           mediaType,
// //           watch('name'),
// //           watch('description'),
// //           venue,
// //           categories && categories.length > 0,
// //           watch('tags').length > 0,
// //           watch('organization'),
// //         ].every(Boolean);
// //       }
// //       if (step === 2) {
// //         const fromTime = watch('fromTime');
// //         const endTime = watch('endTime');

// //         const hasBasicFields = [
// //           watch('fromDate'),
// //           watch('endDate'),
// //           fromTime,
// //           endTime,
// //           eventType,
// //         ].every(Boolean);

// //         if (recurring) {
// //           const freq = watch('recurringType');
// //           const interval = watch('recurringInterval');
// //           const daysOfWeek = watch('recurringDays');
// //           const endType = watch('recurringEnd');
// //           const endDate = watch('recurringEndDate');
// //           const occurrences = watch('recurringEndCount');

// //           if (!freq || !interval || !endType || !daysOfWeek) return false;

// //           if (endType === 'never') {
// //             return hasBasicFields && !!freq && !!interval && !!endType;
// //           }
// //           if (endType === 'onDate') {
// //             return (
// //               hasBasicFields && !!freq && !!interval && !!endType && !!endDate
// //             );
// //           }
// //           if (endType === 'afterOccurrences') {
// //             return (
// //               hasBasicFields &&
// //               !!freq &&
// //               !!interval &&
// //               !!endType &&
// //               !!occurrences
// //             );
// //           }
// //           return false;
// //         }

// //         return hasBasicFields;
// //       }
// //       return false;
// //     },
// //     [mediaUrl, mediaType, venue, categories, eventType, recurring, watch]
// //   );

// //   const onSubmit = useCallback(
// //     async (data: any) => {
// //       let imageFileString = '';
// //       try {
// //         setLoading(true);
// //         if (file) {
// //           imageFileString = await uploadFileToAzure(file);
// //           console.log('Uploaded file URL:', imageFileString);
// //         } else {
// //           imageFileString = data.mediaUrl || '';
// //         }
// //         const payload = {
// //           basicInfo: {
// //             media: {
// //               type: data.mediaType,
// //               name: imageFileString,
// //             },
// //             title: data.name,
// //             description: data.description,
// //             organization: data.organization,
// //             partnerOrganizers: data.partnerOrganizers,
// //             venue: data.venue,
// //             categories: data.categories,
// //             tags: data.tags,
// //           },
// //           schedule: {
// //             type: data.eventType,
// //             startDateTime: data.fromDate
// //               ? `${fDate(data.fromDate, formatStr.paramCase.db)} ${convertTimeFormat(data.fromTime)}`
// //               : '',
// //             endDateTime: data.endDate
// //               ? `${fDate(data.endDate, formatStr.paramCase.db)} ${convertTimeFormat(data.endTime)}`
// //               : '',
// //             ...(data.recurring
// //               ? {
// //                   recurringDetails: {
// //                     isEnabled: data.recurring,
// //                     frequency: data.recurringType,
// //                     interval: data.recurringInterval,
// //                     daysOfWeek: data.recurringDays.map((day: string) =>
// //                       day.substring(0, 3).toLowerCase()
// //                     ),
// //                     endType: data.recurringEnd,
// //                     endDate: data.recurringEndDate,
// //                     occurrences: data.recurringEndCount,
// //                   },
// //                 }
// //               : {}),
// //           },
// //         };

// //         console.log('Final Payload:', payload);

// //         let res = null;
// //         if (!id) {
// //           res = await addEvent(payload).unwrap();
// //         } else {
// //           res = await updateEvent({ id: id, ...payload }).unwrap();
// //         }

// //         if (res?.data) {
// //           router.push(`/${userType}/events/${res?.data?._id}`);
// //         }
// //       } catch (error) {
// //         if (imageFileString) {
// //           await deleteFileFromAzure(imageFileString);
// //         }
// //         console.log('Error adding event:', error);
// //       } finally {
// //         setLoading(false);
// //       }
// //     },
// //     [file, id, addEvent, updateEvent, router, userType]
// //   );

// //   const setEditValues = useCallback(() => {
// //     if (!event) return;

// //     const organizationId = event?.basicInfo?.organization?._id || '';
// //     if (organizationId) {
// //       setValue('organization', organizationId, { shouldValidate: true });
// //     }

// //     const fromDate_ = event?.schedule?.startDateTime
// //       ? new Date(event.schedule.startDateTime)
// //       : null;

// //     const fromTime_ = event?.schedule?.startDateTime
// //       ? convertTimeFormat(
// //           event.schedule.startDateTime.split(' ').slice(1).join(' '),
// //           true
// //         )
// //       : '';

// //     const endDate_ = event?.schedule?.endDateTime
// //       ? new Date(event.schedule.endDateTime)
// //       : null;

// //     const endTime_ = event?.schedule?.endDateTime
// //       ? convertTimeFormat(
// //           event.schedule.endDateTime.split(' ').slice(1).join(' '),
// //           true
// //         )
// //       : '';

// //     reset({
// //       image: event?.basicInfo?.mediaInfo?.url || null,
// //       mediaUrl: event?.basicInfo?.mediaInfo?.url || '',
// //       mediaType: event?.basicInfo?.mediaInfo?.type || 'image',

// //       name: event?.basicInfo?.title || '',
// //       description: event?.basicInfo?.description || '',

// //       venue: '',
// //       categories:
// //         event?.basicInfo?.categories?.map((cat: any) => cat._id) || [],
// //       tags: event?.basicInfo?.tags?.map((tag: any) => tag._id) || [],

// //       eventType: event?.schedule?.type || 'oneTime',

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

// //       // organization: event?.basicInfo?.organization?._id || '',
// //       organization: organizationId,
// //       partnerOrganizers: event?.basicInfo?.partnerOrganizers
// //         ? event.basicInfo.partnerOrganizers.map((org: any) => org._id)
// //         : [],
// //     });
// //   }, [event, reset, setValue]);

// //   // Load event data when editing
// //   // useEffect(() => {
// //   //   if (event && event._id && !eventLoading) {
// //   //     setEditValues();
// //   //   }
// //   // }, [event?._id, eventLoading, setEditValues]);

// //   useEffect(() => {
// //     if (id && event && event._id && !eventLoading) {
// //       setEditValues();
// //     }
// //   }, [id, event?._id, eventLoading, setEditValues]);

// //   // CRITICAL FIX: Wait for venues to load before setting venue value
// //   useEffect(() => {
// //     if (
// //       event?._id &&
// //       event?.basicInfo?.venue?._id &&
// //       !venuesLoading &&
// //       venues.length > 0 &&
// //       organization
// //     ) {
// //       const venueExists = venues.some(
// //         (v: any) => v._id === event.basicInfo.venue._id
// //       );
// //       if (venueExists && watch('venue') !== event.basicInfo.venue._id) {
// //         setValue('venue', event.basicInfo.venue._id, { shouldValidate: true });
// //       }
// //     }
// //   }, [
// //     event?._id,
// //     event?.basicInfo?.venue?._id,
// //     venues,
// //     venuesLoading,
// //     setValue,
// //     watch,
// //     organization,
// //   ]);

// //   return {
// //     step,
// //     setStep,
// //     // version,
// //     // setVersion,
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
// //     router,
// //     mediaUrl,
// //     mediaType,
// //     venue,
// //     categories,
// //     partnerOrganizers,
// //     eventType,
// //     recurring,
// //     recurringDays,
// //     recurringEnd,
// //     organization,
// //     // Export memoized options
// //     organizationOptions,
// //     venueOptions,
// //     categoryOptions,
// //     tagOptions,
// //     partnerOrganizerOptions,
// //   };
// // };

// // // import { yupResolver } from '@hookform/resolvers/yup';
// // // import { useParams, useRouter } from 'next/navigation';
// // // import { useEffect, useRef, useState, useMemo, useCallback } from 'react';
// // // import { Resolver, useForm } from 'react-hook-form';
// // // import { skipToken } from '@reduxjs/toolkit/query';
// // // import {
// // //   useAddeventMutation,
// // //   useGeteventByIdQuery,
// // //   useUpdateeventMutation,
// // // } from '@/store/Reducer/events';
// // // import { useGetOrganizationQuery } from '@/store/Reducer/organization';
// // // import { useGetCategoriesQuery } from '@/store/Reducer/categories';
// // // import { useGetTagsQuery } from '@/store/Reducer/tags';
// // // import { useGetVenuesQuery } from '@/store/Reducer/venue';
// // // import { uploadFileToAzure } from '@/utils/fileUpload';
// // // import { deleteFileFromAzure } from '@/utils/deleteFile';
// // // import { convertTimeFormat, fDate, formatStr } from '@/utils/format-time';
// // // import { defaultValues } from './constants';
// // // import { eventValidationSchema } from './validation';
// // // import type { EventFormValues } from './types';

// // // export const useEventForm = (userType: string) => {
// // //   const [step, setStep] = useState(1);
// // //   const [version, setVersion] = useState(1);
// // //   const [showPartnerOrganizer, setShowPartnerOrganizer] = useState(false);
// // //   const [file, setFile] = useState<File | null>(null);
// // //   const [venueModal, setVenueModal] = useState<boolean>(false);
// // //   const [loading, setLoading] = useState(false);
// // //   const { id } = useParams();
// // //   const router = useRouter();

// // //   const { data: event = {}, isLoading: eventLoading } = useGeteventByIdQuery(
// // //     id ?? skipToken
// // //   );

// // //   const { data: { data: organizations = [] } = {}, isLoading: orgLoading } =
// // //     useGetOrganizationQuery({
// // //       page: 0,
// // //       limit: 10000,
// // //     });

// // //   const {
// // //     data: { data: categoriesData = [] } = {},
// // //     isLoading: categoriesLoading,
// // //   } = useGetCategoriesQuery({
// // //     page: 0,
// // //     limit: 10000,
// // //   });

// // //   const { data: { data: tagsd = [] } = {}, isLoading: tagsLoading } =
// // //     useGetTagsQuery({
// // //       page: 0,
// // //       limit: 10000,
// // //     });

// // //   const [addEvent, { isLoading: isAddingEvent }] = useAddeventMutation();
// // //   const [updateEvent, { isLoading: isUpdatingEvent }] =
// // //     useUpdateeventMutation();

// // //   const methods = useForm<EventFormValues>({
// // //     defaultValues,
// // //     resolver: yupResolver(
// // //       eventValidationSchema
// // //     ) as unknown as Resolver<EventFormValues>,
// // //     mode: 'onBlur',
// // //     reValidateMode: 'onChange',
// // //   });

// // //   const {
// // //     watch,
// // //     setValue,
// // //     reset,
// // //     formState: { errors },
// // //   } = methods;

// // //   console.log('errors', errors);

// // //   const {
// // //     mediaUrl,
// // //     mediaType,
// // //     venue,
// // //     categories,
// // //     partnerOrganizers,
// // //     eventType,
// // //     recurring,
// // //     recurringDays,
// // //     recurringEnd,
// // //     organization,
// // //   } = watch();

// // //   const { data: { data: venues = [] } = {}, isLoading: venuesLoading } =
// // //     useGetVenuesQuery(
// // //       organization
// // //         ? { page: 0, limit: 1000, organization: organization }
// // //         : { page: 0, limit: 1000 },
// // //       {
// // //         skip: !organization,
// // //       }
// // //     );

// // //   const prevOrganizationRef = useRef(organization);

// // //   // Scroll to top on step/version change
// // //   useEffect(() => {
// // //     window.scrollTo({ top: 0, behavior: 'smooth' });
// // //   }, [step, version]);

// // //   // Handle organization change - clear venue and remove from partner organizers
// // //   useEffect(() => {
// // //     if (!organization) return;

// // //     // Clear venue when organization changes
// // //     if (
// // //       prevOrganizationRef.current &&
// // //       prevOrganizationRef.current !== organization
// // //     ) {
// // //       setValue('venue', '');
// // //     }

// // //     // Remove partner organizer if it's the main organization
// // //     if (partnerOrganizers?.includes(organization)) {
// // //       setValue(
// // //         'partnerOrganizers',
// // //         partnerOrganizers.filter((po) => po !== organization)
// // //       );
// // //     }

// // //     prevOrganizationRef.current = organization;
// // //   }, [organization, partnerOrganizers, setValue]);

// // //   // Memoized options for dropdowns
// // //   const organizationOptions = useMemo(
// // //     () =>
// // //       organizations?.map((org: any) => ({
// // //         value: org?._id,
// // //         label: org?.basicInfo?.name,
// // //       })) || [],
// // //     [organizations]
// // //   );

// // //   const venueOptions = useMemo(
// // //     () =>
// // //       venues?.map((val: any) => ({
// // //         value: val?._id,
// // //         label: val?.title,
// // //       })) || [],
// // //     [venues]
// // //   );

// // //   const categoryOptions = useMemo(
// // //     () =>
// // //       categoriesData?.map((val: any) => ({
// // //         value: val?._id,
// // //         label: val?.title,
// // //       })) || [],
// // //     [categoriesData]
// // //   );

// // //   const tagOptions = useMemo(
// // //     () =>
// // //       tagsd?.map((val: any) => ({
// // //         value: val?._id,
// // //         label: val?.title,
// // //       })) || [],
// // //     [tagsd]
// // //   );

// // //   const partnerOrganizerOptions = useMemo(
// // //     () =>
// // //       organizations
// // //         ?.filter(
// // //           (org: any) =>
// // //             org._id !== organization && !partnerOrganizers?.includes(org._id)
// // //         )
// // //         ?.map((org: any) => ({
// // //           value: org._id,
// // //           label: org.basicInfo?.name,
// // //         })) || [],
// // //     [organizations, organization, partnerOrganizers]
// // //   );

// // //   // Memoized callbacks
// // //   const removePartnerOrganizer = useCallback(
// // //     (val: string) => {
// // //       setValue(
// // //         'partnerOrganizers',
// // //         partnerOrganizers.filter((v) => v !== val)
// // //       );
// // //     },
// // //     [partnerOrganizers, setValue]
// // //   );

// // //   const toggleRecurringDay = useCallback(
// // //     (day: string) => {
// // //       const newDays = recurringDays.includes(day)
// // //         ? recurringDays.filter((d) => d !== day)
// // //         : [...recurringDays, day];
// // //       setValue('recurringDays', newDays);
// // //     },
// // //     [recurringDays, setValue]
// // //   );

// // //   const isStepValid = useCallback(
// // //     (step: number): boolean => {
// // //       if (step === 1) {
// // //         return [
// // //           mediaUrl,
// // //           mediaType,
// // //           watch('name'),
// // //           watch('description'),
// // //           venue,
// // //           categories && categories.length > 0,
// // //           watch('tags').length > 0,
// // //           watch('organization'),
// // //         ].every(Boolean);
// // //       }
// // //       if (step === 2) {
// // //         const hasBasicFields = [
// // //           watch('fromDate'),
// // //           watch('endDate'),
// // //           watch('fromTime'),
// // //           watch('endTime'),
// // //           eventType,
// // //         ].every(Boolean);

// // //         if (recurring) {
// // //           const freq = watch('recurringType');
// // //           const interval = watch('recurringInterval');
// // //           const daysOfWeek = watch('recurringDays');
// // //           const endType = watch('recurringEnd');
// // //           const endDate = watch('recurringEndDate');
// // //           const occurrences = watch('recurringEndCount');

// // //           if (!freq || !interval || !endType || !daysOfWeek) return false;

// // //           if (endType === 'never') {
// // //             return hasBasicFields && !!freq && !!interval && !!endType;
// // //           }
// // //           if (endType === 'onDate') {
// // //             return (
// // //               hasBasicFields && !!freq && !!interval && !!endType && !!endDate
// // //             );
// // //           }
// // //           if (endType === 'afterOccurrences') {
// // //             return (
// // //               hasBasicFields &&
// // //               !!freq &&
// // //               !!interval &&
// // //               !!endType &&
// // //               !!occurrences
// // //             );
// // //           }
// // //           return false;
// // //         }

// // //         return hasBasicFields;
// // //       }
// // //       return false;
// // //     },
// // //     [mediaUrl, mediaType, venue, categories, eventType, recurring, watch]
// // //   );

// // //   const onSubmit = useCallback(
// // //     async (data: any) => {
// // //       let imageFileString = '';
// // //       try {
// // //         setLoading(true);
// // //         if (file) {
// // //           imageFileString = await uploadFileToAzure(file);
// // //           console.log('Uploaded file URL:', imageFileString);
// // //         } else {
// // //           imageFileString = data.mediaUrl || '';
// // //         }
// // //         const payload = {
// // //           basicInfo: {
// // //             media: {
// // //               type: data.mediaType,
// // //               name: imageFileString,
// // //             },
// // //             title: data.name,
// // //             description: data.description,
// // //             organization: data.organization,
// // //             partnerOrganizers: data.partnerOrganizers,
// // //             venue: data.venue,
// // //             categories: data.categories,
// // //             tags: data.tags,
// // //           },
// // //           schedule: {
// // //             type: data.eventType,
// // //             startDateTime: data.fromDate
// // //               ? `${fDate(data.fromDate, formatStr.paramCase.db)} ${convertTimeFormat(data.fromTime)}`
// // //               : '',
// // //             endDateTime: data.endDate
// // //               ? `${fDate(data.endDate, formatStr.paramCase.db)} ${convertTimeFormat(data.endTime)}`
// // //               : '',
// // //             ...(data.recurring
// // //               ? {
// // //                   recurringDetails: {
// // //                     isEnabled: data.recurring,
// // //                     frequency: data.recurringType,
// // //                     interval: data.recurringInterval,
// // //                     daysOfWeek: data.recurringDays.map((day: string) =>
// // //                       day.substring(0, 3).toLowerCase()
// // //                     ),
// // //                     endType: data.recurringEnd,
// // //                     endDate: data.recurringEndDate,
// // //                     occurrences: data.recurringEndCount,
// // //                   },
// // //                 }
// // //               : {}),
// // //           },
// // //         };

// // //         console.log('Final Payload:', payload);

// // //         let res = null;
// // //         if (!id) {
// // //           res = await addEvent(payload).unwrap();
// // //         } else {
// // //           res = await updateEvent({ id: id, ...payload }).unwrap();
// // //         }

// // //         if (res?.data) {
// // //           router.push(`/${userType}/events/${res?.data?._id}`);
// // //         }
// // //       } catch (error) {
// // //         if (imageFileString) {
// // //           await deleteFileFromAzure(imageFileString);
// // //         }
// // //         console.log('Error adding event:', error);
// // //       } finally {
// // //         setLoading(false);
// // //       }
// // //     },
// // //     [file, id, addEvent, updateEvent, router, userType]
// // //   );

// // //   const setEditValues = useCallback(() => {
// // //     if (!event) return;
// // //     const fromDate_ = event?.schedule?.startDateTime
// // //       ? new Date(event.schedule.startDateTime)
// // //       : null;
// // //     const fromTime_ = event?.schedule?.startDateTime
// // //       ? convertTimeFormat(
// // //           event.schedule.startDateTime.split(' ').slice(1).join(' '),
// // //           true
// // //         )
// // //       : '';
// // //     const endDate_ = event?.schedule?.endDateTime
// // //       ? new Date(event.schedule.endDateTime)
// // //       : null;
// // //     const endTime_ = event?.schedule?.endDateTime
// // //       ? convertTimeFormat(
// // //           event.schedule.endDateTime.split(' ').slice(1).join(' '),
// // //           true
// // //         )
// // //       : '';

// // //     reset({
// // //       image: event?.basicInfo?.mediaInfo?.url || null,
// // //       mediaUrl: event?.basicInfo?.mediaInfo?.url || '',
// // //       mediaType: event?.basicInfo?.mediaInfo?.type || 'image',

// // //       name: event?.basicInfo?.title || '',
// // //       description: event?.basicInfo?.description || '',

// // //       venue: event?.basicInfo?.venue?._id || '',
// // //       categories:
// // //         event?.basicInfo?.categories?.map((cat: any) => cat._id) || [],
// // //       tags: event?.basicInfo?.tags?.map((tag: any) => tag._id) || [],

// // //       eventType: event?.schedule?.type || 'oneTime',

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

// // //       organization: event?.basicInfo?.organization?._id || '',
// // //       partnerOrganizers: event?.basicInfo?.partnerOrganizers
// // //         ? event.basicInfo.partnerOrganizers.map((org: any) => org._id)
// // //         : [],
// // //     });
// // //   }, [event, reset]);

// // //   // Load event data when editing
// // //   useEffect(() => {
// // //     if (event && event._id && !eventLoading) {
// // //       setEditValues();
// // //     }
// // //   }, [event?._id, eventLoading, setEditValues]);

// // //   // CRITICAL FIX: Wait for venues to load before setting venue value
// // //   useEffect(() => {
// // //     if (
// // //       event?._id &&
// // //       event?.basicInfo?.venue?._id &&
// // //       !venuesLoading &&
// // //       venues.length > 0
// // //     ) {
// // //       const venueExists = venues.some(
// // //         (v: any) => v._id === event.basicInfo.venue._id
// // //       );
// // //       if (venueExists && watch('venue') !== event.basicInfo.venue._id) {
// // //         setValue('venue', event.basicInfo.venue._id, { shouldValidate: true });
// // //       }
// // //     }
// // //   }, [
// // //     event?._id,
// // //     event?.basicInfo?.venue?._id,
// // //     venues,
// // //     venuesLoading,
// // //     setValue,
// // //     watch,
// // //   ]);

// // //   return {
// // //     step,
// // //     setStep,
// // //     version,
// // //     setVersion,
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
// // //     eventType,
// // //     recurring,
// // //     recurringDays,
// // //     recurringEnd,
// // //     organization,
// // //     // Export memoized options
// // //     organizationOptions,
// // //     venueOptions,
// // //     categoryOptions,
// // //     tagOptions,
// // //     partnerOrganizerOptions,
// // //   };
// // // };

// // // // 'use client';

// // // // import { yupResolver } from '@hookform/resolvers/yup';
// // // // import { useParams, useRouter } from 'next/navigation';
// // // // import { useEffect, useRef, useState } from 'react';
// // // // import { Resolver, useForm } from 'react-hook-form';
// // // // import { skipToken } from '@reduxjs/toolkit/query';
// // // // import {
// // // //   useAddeventMutation,
// // // //   useGeteventByIdQuery,
// // // //   useUpdateeventMutation,
// // // // } from '@/store/Reducer/events';
// // // // import { useGetOrganizationQuery } from '@/store/Reducer/organization';
// // // // import { useGetCategoriesQuery } from '@/store/Reducer/categories';
// // // // import { useGetTagsQuery } from '@/store/Reducer/tags';
// // // // import { useGetVenuesQuery } from '@/store/Reducer/venue';
// // // // import { uploadFileToAzure } from '@/utils/fileUpload';
// // // // import { deleteFileFromAzure } from '@/utils/deleteFile';
// // // // import { convertTimeFormat, fDate, formatStr } from '@/utils/format-time';
// // // // import { defaultValues } from './constants';
// // // // import { eventValidationSchema } from './validation';
// // // // import type { EventFormValues } from './types';

// // // // export const useEventForm = (userType: string) => {
// // // //   const [step, setStep] = useState(1);
// // // //   const [version, setVersion] = useState(1);
// // // //   const [showPartnerOrganizer, setShowPartnerOrganizer] = useState(false);
// // // //   const [file, setFile] = useState<File | null>(null);
// // // //   const [venueModal, setVenueModal] = useState<boolean>(false);
// // // //   const [loading, setLoading] = useState(false);
// // // //   const { id } = useParams();
// // // //   const router = useRouter();

// // // //   const { data: event = {} } = useGeteventByIdQuery(id ?? skipToken);

// // // //   const { data: { data: organizations = [] } = {}, isLoading: orgLoading } =
// // // //     useGetOrganizationQuery({
// // // //       page: 0,
// // // //       limit: 10000,
// // // //     });

// // // //   const {
// // // //     data: { data: categoriesData = [] } = {},
// // // //     isLoading: categoriesLoading,
// // // //   } = useGetCategoriesQuery({
// // // //     page: 0,
// // // //     limit: 10000,
// // // //   });

// // // //   const { data: { data: tagsd = [] } = {}, isLoading: tagsLoading } =
// // // //     useGetTagsQuery({
// // // //       page: 0,
// // // //       limit: 10000,
// // // //     });

// // // //   const [addEvent, { isLoading: isAddingEvent }] = useAddeventMutation();
// // // //   const [updateEvent, { isLoading: isUpdatingEvent }] =
// // // //     useUpdateeventMutation();

// // // //   const methods = useForm<EventFormValues>({
// // // //     defaultValues,
// // // //     resolver: yupResolver(
// // // //       eventValidationSchema
// // // //     ) as unknown as Resolver<EventFormValues>,
// // // //   });

// // // //   const {
// // // //     watch,
// // // //     setValue,
// // // //     reset,
// // // //     formState: { errors },
// // // //   } = methods;

// // // //   console.log('errors', errors);

// // // //   const {
// // // //     mediaUrl,
// // // //     mediaType,
// // // //     venue,
// // // //     categories,
// // // //     partnerOrganizers,
// // // //     eventType,
// // // //     recurring,
// // // //     recurringDays,
// // // //     recurringEnd,
// // // //     organization,
// // // //   } = watch();

// // // //   const { data: { data: venues = [] } = {}, isLoading: venuesLoading } =
// // // //     useGetVenuesQuery(
// // // //       organization
// // // //         ? { page: 0, limit: 1000, organization: organization }
// // // //         : { page: 0, limit: 1000 },
// // // //       {
// // // //         skip: !organization,
// // // //       }
// // // //     );

// // // //   const prevOrganizationRef = useRef(organization);

// // // //   useEffect(() => {
// // // //     window.scrollTo({ top: 0, behavior: 'smooth' });
// // // //   }, [step, version]);

// // // //   useEffect(() => {
// // // //     if (
// // // //       prevOrganizationRef.current &&
// // // //       prevOrganizationRef.current !== organization
// // // //     ) {
// // // //       setValue('venue', '');
// // // //     }
// // // //     prevOrganizationRef.current = organization;
// // // //   }, [organization, setValue]);

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
// // // //     const newDays = recurringDays.includes(day)
// // // //       ? recurringDays.filter((d) => d !== day)
// // // //       : [...recurringDays, day];
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
// // // //       const hasBasicFields = [
// // // //         watch('fromDate'),
// // // //         watch('endDate'),
// // // //         watch('fromTime'),
// // // //         watch('endTime'),
// // // //         eventType,
// // // //       ].every(Boolean);

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
// // // //           return (
// // // //             hasBasicFields && !!freq && !!interval && !!endType && !!endDate
// // // //           );
// // // //         }
// // // //         if (endType === 'afterOccurrences') {
// // // //           return (
// // // //             hasBasicFields && !!freq && !!interval && !!endType && !!occurrences
// // // //           );
// // // //         }
// // // //         return false;
// // // //       }

// // // //       return hasBasicFields;
// // // //     }
// // // //     return false;
// // // //   };

// // // //   const onSubmit = async (data: any) => {
// // // //     let imageFileString = '';
// // // //     try {
// // // //       setLoading(true);
// // // //       if (file) {
// // // //         imageFileString = await uploadFileToAzure(file);
// // // //         console.log('Uploaded file URL:', imageFileString);
// // // //       } else {
// // // //         imageFileString = data.mediaUrl || '';
// // // //       }
// // // //       const payload = {
// // // //         basicInfo: {
// // // //           media: {
// // // //             type: data.mediaType,
// // // //             name: imageFileString,
// // // //           },
// // // //           title: data.name,
// // // //           description: data.description,
// // // //           organization: data.organization,
// // // //           partnerOrganizers: data.partnerOrganizers,
// // // //           venue: data.venue,
// // // //           categories: data.categories,
// // // //           tags: data.tags,
// // // //         },
// // // //         schedule: {
// // // //           type: data.eventType,
// // // //           startDateTime: data.fromDate
// // // //             ? `${fDate(data.fromDate, formatStr.paramCase.db)} ${convertTimeFormat(data.fromTime)}`
// // // //             : '',
// // // //           endDateTime: data.endDate
// // // //             ? `${fDate(data.endDate, formatStr.paramCase.db)} ${convertTimeFormat(data.endTime)}`
// // // //             : '',
// // // //           ...(data.recurring
// // // //             ? {
// // // //                 recurringDetails: {
// // // //                   isEnabled: data.recurring,
// // // //                   frequency: data.recurringType,
// // // //                   interval: data.recurringInterval,
// // // //                   daysOfWeek: data.recurringDays.map((day: string) =>
// // // //                     day.substring(0, 3).toLowerCase()
// // // //                   ),
// // // //                   endType: data.recurringEnd,
// // // //                   endDate: data.recurringEndDate,
// // // //                   occurrences: data.recurringEndCount,
// // // //                 },
// // // //               }
// // // //             : {}),
// // // //         },
// // // //       };

// // // //       console.log('Final Payload:', payload);

// // // //       let res = null;
// // // //       if (!id) {
// // // //         res = await addEvent(payload).unwrap();
// // // //       } else {
// // // //         res = await updateEvent({ id: id, ...payload }).unwrap();
// // // //       }

// // // //       if (res?.data) {
// // // //         router.push(`/${userType}/events/${res?.data?._id}`);
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

// // // //   const setEditValues = () => {
// // // //     if (!event) return;
// // // //     const fromDate_ = event?.schedule?.startDateTime
// // // //       ? new Date(event.schedule.startDateTime)
// // // //       : null;
// // // //     const fromTime_ = event?.schedule?.startDateTime
// // // //       ? convertTimeFormat(
// // // //           event.schedule.startDateTime.split(' ').slice(1).join(' '),
// // // //           true
// // // //         )
// // // //       : '';
// // // //     const endDate_ = event?.schedule?.endDateTime
// // // //       ? new Date(event.schedule.endDateTime)
// // // //       : null;
// // // //     const endTime_ = event?.schedule?.endDateTime
// // // //       ? convertTimeFormat(
// // // //           event.schedule.endDateTime.split(' ').slice(1).join(' '),
// // // //           true
// // // //         )
// // // //       : '';

// // // //     reset({
// // // //       image: event?.basicInfo?.mediaInfo?.url || null,
// // // //       mediaUrl: event?.basicInfo?.mediaInfo?.url || '',
// // // //       mediaType: event?.basicInfo?.mediaInfo?.type || 'image',

// // // //       name: event?.basicInfo?.title || '',
// // // //       description: event?.basicInfo?.description || '',

// // // //       venue: event?.basicInfo?.venue?._id || '',
// // // //       categories:
// // // //         event?.basicInfo?.categories?.map((cat: any) => cat._id) || [],
// // // //       tags: event?.basicInfo?.tags?.map((tag: any) => tag._id) || [],

// // // //       eventType: event?.schedule?.type || 'oneTime',

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

// // // //       organization: event?.basicInfo?.organization?._id || '',
// // // //       partnerOrganizers: event?.basicInfo?.partnerOrganizers
// // // //         ? event.basicInfo.partnerOrganizers.map((org: any) => org._id)
// // // //         : [],
// // // //     });
// // // //   };

// // // //   useEffect(() => {
// // // //     if (event && event._id) {
// // // //       setEditValues();
// // // //     }
// // // //   }, [event?._id, reset]);

// // // //   return {
// // // //     step,
// // // //     setStep,
// // // //     version,
// // // //     setVersion,
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
// // // //     eventType,
// // // //     recurring,
// // // //     recurringDays,
// // // //     recurringEnd,
// // // //     organization,
// // // //   };
// // // // };
