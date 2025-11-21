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

export const useEventForm = ({ userType }: { userType: string }) => {
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
  const cachedVenueIdRef = useRef<string | null>(null);

  // FORCE REFETCH ON EVERY MOUNT - Fix for blank fields
  const {
    data: event = {},
    isSuccess: eventLoaded,
    isFetching: eventFetching,
    refetch: refetchEvent,
  } = useGeteventByIdQuery(id ?? skipToken, {
    refetchOnMountOrArgChange: true,
    refetchOnFocus: true,
    refetchOnReconnect: true,
  });

  // Trigger refetch when component mounts
  useEffect(() => {
    if (id && refetchEvent) {
      refetchEvent();
    }
  }, [id, refetchEvent]);

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

  // Use cached values OR current form values
  const effectiveOrganization = organization || cachedOrganizationIdRef.current;

  const { data: { data: venues = [] } = {}, isLoading: venuesLoading } = useGetVenuesQuery(
    effectiveOrganization ? { page: 0, limit: 1000, organization: effectiveOrganization } : skipToken,
    {
      skip: !effectiveOrganization,
      refetchOnMountOrArgChange: true,
    }
  );

  const prevOrganizationRef = useRef(organization);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [step]);

  useEffect(() => {
    if (prevOrganizationRef.current && prevOrganizationRef.current !== organization && isFormInitialized) {
      setValue('venue', '');
      cachedVenueIdRef.current = null;
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

  // const toggleRecurringDay = (day: string) => {
  //   const newDays = recurringDays.includes(day) ? recurringDays.filter((d) => d !== day) : [...recurringDays, day];
  //   setValue('recurringDays', newDays);
  // };

  const toggleRecurringDay = (day: string) => {
    const currentDays = watch('recurringDays') || [];
    const newDays = currentDays.includes(day) ? currentDays.filter((d: string) => d !== day) : [...currentDays, day];
    setValue('recurringDays', newDays, { shouldDirty: true }); // Add shouldDirty: true
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

        if (!freq || !interval || !endType || !daysOfWeek || daysOfWeek.length === 0) return false;

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
    if (step === 3) {
      const ticketing = watch('ticketing');
      if (!ticketing) return false;

      const hasRequiredFields = !!(ticketing.title && ticketing.price >= 0 && ticketing.taxPercentage >= 0);

      // Explicitly convert to boolean to avoid type issues
      const timingSlotsEnabled = Boolean(ticketing.timingSlots?.enabled);

      if (timingSlotsEnabled) {
        const hasTimeSlots = Array.isArray(ticketing.timingSlots?.dateTimeSlots) && ticketing.timingSlots.dateTimeSlots.length > 0;
        return hasRequiredFields && hasTimeSlots;
      }

      return hasRequiredFields && (Number(ticketing.quantity) || 0) > 0;
    }
    return false;
  };

  // const isStepValid = (step: number): boolean => {
  //   if (step === 1) {
  //     return [
  //       mediaUrl,
  //       mediaType,
  //       watch('name'),
  //       watch('description'),
  //       venue,
  //       categories && categories.length > 0,
  //       watch('tags').length > 0,
  //       watch('organization'),
  //     ].every(Boolean);
  //   }
  //   if (step === 2) {
  //     const hasBasicFields = [watch('fromDate'), watch('endDate'), watch('fromTime'), watch('endTime')].every(Boolean);

  //     if (recurring) {
  //       const freq = watch('recurringType');
  //       const interval = watch('recurringInterval');
  //       const daysOfWeek = watch('recurringDays');
  //       const endType = watch('recurringEnd');
  //       const endDate = watch('recurringEndDate');
  //       const occurrences = watch('recurringEndCount');

  //       if (!freq || !interval || !endType || !daysOfWeek || daysOfWeek.length === 0) return false;

  //       if (endType === 'never') {
  //         return hasBasicFields && !!freq && !!interval && !!endType;
  //       }
  //       if (endType === 'onDate') {
  //         return hasBasicFields && !!freq && !!interval && !!endType && !!endDate;
  //       }
  //       if (endType === 'afterOccurrences') {
  //         return hasBasicFields && !!freq && !!interval && !!endType && !!occurrences;
  //       }
  //       return false;
  //     }

  //     return hasBasicFields;
  //   }
  //   if (step === 3) {
  //     const ticketing = watch('ticketing');
  //     if (!ticketing) return false;

  //     const hasRequiredFields = ticketing.title && ticketing.price >= 0 && ticketing.taxPercentage >= 0;

  //     if (ticketing.timingSlots.enabled) {
  //       return hasRequiredFields && ticketing.timingSlots.dateTimeSlots.length > 0;
  //     }

  //     return hasRequiredFields && (ticketing.quantity || 0) > 0;
  //   }
  //   return false;
  // };

  const handleSkipTicketing = async () => {
    const data = methods.getValues();
    // Submit without ticketing
    const formDataWithoutTicketing = { ...data };
    delete formDataWithoutTicketing.ticketing;
    await onSubmit(formDataWithoutTicketing);
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

      // Helper function to convert datetime-local to backend format
      const formatDateTimeForAPI = (datetimeLocal: string): string => {
        if (!datetimeLocal) return '';
        const date = new Date(datetimeLocal);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const hours24 = date.getHours();
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const period = hours24 >= 12 ? 'PM' : 'AM';
        const hours12 = hours24 % 12 || 12;
        const paddedHours12 = String(hours12).padStart(2, '0');
        return `${year}-${month}-${day} ${paddedHours12}:${minutes} ${period}`;
      };

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

      // Add ticketing if present (Step 3)
      if (data.ticketing && data.ticketing.title) {
        const ticketingPayload: any = {
          title: data.ticketing.title,
          price: data.ticketing.price,
          taxPercentage: data.ticketing.taxPercentage,
          timingSlots: {
            enabled: data.ticketing.timingSlots.enabled,
            dateTimeSlots: data.ticketing.timingSlots.dateTimeSlots || [],
          },
          repeatable: {
            isRepeatable: data.ticketing.repeatable.isRepeatable,
            visits: data.ticketing.repeatable.visits || 1,
          },
          resaleProtection: data.ticketing.resaleProtection || 'none',
          fastTrackEntry: {
            enabled: data.ticketing.fastTrackEntry.enabled,
            quantity: data.ticketing.fastTrackEntry.quantity || 0,
            extraPrice: data.ticketing.fastTrackEntry.extraPrice || 0,
          },
          requiresReservation: {
            enabled: data.ticketing.requiresReservation.enabled,
            type: data.ticketing.requiresReservation.type || '',
          },
        };

        // Add quantity if timeslots not enabled
        if (!data.ticketing.timingSlots.enabled) {
          ticketingPayload.quantity = data.ticketing.quantity;
        }

        // Add transfer fee if present
        if (data.ticketing.transferFee !== null && data.ticketing.transferFee > 0) {
          ticketingPayload.transferFee = data.ticketing.transferFee;
        }

        // Add time sensitive pricing if enabled - CONVERT TO BACKEND FORMAT
        const timeSensitivePricing: any = {};
        if (data.ticketing.timeSensitivePricing.earlyBird.enabled && data.ticketing.timeSensitivePricing.earlyBird.endDate) {
          timeSensitivePricing.earlyBird = {
            endDate: formatDateTimeForAPI(data.ticketing.timeSensitivePricing.earlyBird.endDate),
            discountedPrice: data.ticketing.timeSensitivePricing.earlyBird.discountedPrice,
          };
        }
        if (data.ticketing.timeSensitivePricing.lastMinute.enabled && data.ticketing.timeSensitivePricing.lastMinute.startDate) {
          timeSensitivePricing.lastMinute = {
            startDate: formatDateTimeForAPI(data.ticketing.timeSensitivePricing.lastMinute.startDate),
            discountedPrice: data.ticketing.timeSensitivePricing.lastMinute.discountedPrice,
          };
        }
        if (Object.keys(timeSensitivePricing).length > 0) {
          ticketingPayload.timeSensitivePricing = timeSensitivePricing;
        }

        // Add publish settings - CONVERT SCHEDULED DATE TO BACKEND FORMAT
        if (data.ticketing.publishSettings.publishType === 'instant') {
          ticketingPayload.status = 'active';
        } else if (data.ticketing.publishSettings.publishType === 'scheduled') {
          ticketingPayload.status = 'scheduled';
          if (data.ticketing.publishSettings.scheduledDate) {
            ticketingPayload.scheduledPublishAt = formatDateTimeForAPI(data.ticketing.publishSettings.scheduledDate);
          }
        } else if (data.ticketing.publishSettings.publishType === 'manual') {
          ticketingPayload.status = 'inactive';
        }

        payload.ticketing = ticketingPayload;
      }

      let response = null;

      console.log('payload', payload);

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

  // const onSubmit = async (data: EventFormValues) => {
  //   let imageFileString = '';

  //   try {
  //     setLoading(true);
  //     if (file && file instanceof File) {
  //       imageFileString = await uploadFileToAzure(file);
  //     } else {
  //       imageFileString = data.mediaUrl || '';
  //     }

  //     const payload: any = {
  //       basicInfo: {
  //         media: {
  //           type: data.mediaType || 'image',
  //           name: imageFileString,
  //         },
  //         title: data.name,
  //         description: data.description,
  //         organization: data.organization,
  //         venue: data.venue,
  //         categories: data.categories,
  //         tags: data.tags,
  //       },
  //       schedule: {
  //         type: 'oneTime',
  //         startDateTime: data.fromDate ? `${fDate(data.fromDate, formatStr.paramCase.db)} ${convertTimeFormat(data.fromTime)}` : '',
  //         endDateTime: data.endDate ? `${fDate(data.endDate, formatStr.paramCase.db)} ${convertTimeFormat(data.endTime)}` : '',
  //       },
  //     };

  //     if (data.partnerOrganization) {
  //       payload.basicInfo.partnerOrganization = data.partnerOrganization;
  //     }

  //     if (data.recurring) {
  //       payload.schedule.recurringDetails = {
  //         isEnabled: true,
  //         frequency: data.recurringType,
  //         interval: data.recurringInterval,
  //         daysOfWeek: data.recurringDays.map((day: string) => day.substring(0, 3).toLowerCase()),
  //         endType: data.recurringEnd,
  //       };

  //       if (data.recurringEnd === 'onDate' && data.recurringEndDate) {
  //         payload.schedule.recurringDetails.endDate = fDate(data.recurringEndDate, formatStr.paramCase.db);
  //       } else if (data.recurringEnd === 'afterOccurrences' && data.recurringEndCount) {
  //         payload.schedule.recurringDetails.occurrences = data.recurringEndCount;
  //       }
  //     }

  //     // Add ticketing if present (Step 3)
  //     if (data.ticketing && data.ticketing.title) {
  //       const ticketingPayload: any = {
  //         title: data.ticketing.title,
  //         price: data.ticketing.price,
  //         taxPercentage: data.ticketing.taxPercentage,
  //         timingSlots: {
  //           enabled: data.ticketing.timingSlots.enabled,
  //           dateTimeSlots: data.ticketing.timingSlots.dateTimeSlots || [],
  //         },
  //         repeatable: {
  //           isRepeatable: data.ticketing.repeatable.isRepeatable,
  //           visits: data.ticketing.repeatable.visits || 1,
  //         },
  //         resaleProtection: data.ticketing.resaleProtection || 'none',
  //         fastTrackEntry: {
  //           enabled: data.ticketing.fastTrackEntry.enabled,
  //           quantity: data.ticketing.fastTrackEntry.quantity || 0,
  //           extraPrice: data.ticketing.fastTrackEntry.extraPrice || 0,
  //         },
  //         requiresReservation: {
  //           enabled: data.ticketing.requiresReservation.enabled,
  //           type: data.ticketing.requiresReservation.type || '',
  //         },
  //       };

  //       // Add quantity if timeslots not enabled
  //       if (!data.ticketing.timingSlots.enabled) {
  //         ticketingPayload.quantity = data.ticketing.quantity;
  //       }

  //       // Add transfer fee if present
  //       if (data.ticketing.transferFee !== null && data.ticketing.transferFee > 0) {
  //         ticketingPayload.transferFee = data.ticketing.transferFee;
  //       }

  //       // Add time sensitive pricing if enabled
  //       const timeSensitivePricing: any = {};
  //       if (data.ticketing.timeSensitivePricing.earlyBird.enabled && data.ticketing.timeSensitivePricing.earlyBird.endDate) {
  //         timeSensitivePricing.earlyBird = {
  //           endDate: data.ticketing.timeSensitivePricing.earlyBird.endDate,
  //           discountedPrice: data.ticketing.timeSensitivePricing.earlyBird.discountedPrice,
  //         };
  //       }
  //       if (data.ticketing.timeSensitivePricing.lastMinute.enabled && data.ticketing.timeSensitivePricing.lastMinute.startDate) {
  //         timeSensitivePricing.lastMinute = {
  //           startDate: data.ticketing.timeSensitivePricing.lastMinute.startDate,
  //           discountedPrice: data.ticketing.timeSensitivePricing.lastMinute.discountedPrice,
  //         };
  //       }
  //       if (Object.keys(timeSensitivePricing).length > 0) {
  //         ticketingPayload.timeSensitivePricing = timeSensitivePricing;
  //       }

  //       // Add publish settings
  //       if (data.ticketing.publishSettings.publishType === 'instant') {
  //         ticketingPayload.status = 'active';
  //       } else if (data.ticketing.publishSettings.publishType === 'scheduled') {
  //         ticketingPayload.status = 'scheduled';
  //         if (data.ticketing.publishSettings.scheduledDate) {
  //           ticketingPayload.scheduledPublishAt = data.ticketing.publishSettings.scheduledDate;
  //         }
  //       } else if (data.ticketing.publishSettings.publishType === 'manual') {
  //         ticketingPayload.status = 'inactive';
  //       }

  //       payload.ticketing = ticketingPayload;
  //     }

  //     let response = null;

  //     if (!id) {
  //       response = await addEvent(payload).unwrap();
  //     } else {
  //       response = await updateEvent({ id: id, ...payload }).unwrap();
  //     }

  //     if (!response) {
  //       showError('No response from server. Please try again later.');
  //       return;
  //     }

  //     if (response.error) {
  //       const errorMessage = getErrorMessage(response.error);
  //       showError(errorMessage);
  //       return;
  //     }

  //     if (response?.data) {
  //       showSuccess(response?.message || (id ? 'Event updated successfully' : 'Event created successfully'));
  //       router.push(`/${userType}/events`);
  //     }
  //   } catch (error) {
  //     if (imageFileString) {
  //       await deleteFileFromAzure(imageFileString);
  //     }
  //     const errorMessage = getErrorMessage(error);
  //     showError(errorMessage);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const setEditValues = useCallback(() => {
    if (!event || !event._id) return;

    const organizationId = event?.basicInfo?.organization?._id || '';
    const venueId = event?.basicInfo?.venue?._id || '';
    const partnerOrgId = event?.basicInfo?.partnerOrganization?._id || '';

    // Cache the IDs to maintain values
    if (organizationId) {
      cachedOrganizationIdRef.current = organizationId;
    }
    if (venueId) {
      cachedVenueIdRef.current = venueId;
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
      ticketing: defaultValues.ticketing,
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
      cachedVenueIdRef.current = null;
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
    handleSkipTicketing,
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
