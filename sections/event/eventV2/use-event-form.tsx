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
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
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
  const [showPartnerOrganizer, setShowPartnerOrganizer] = useState(false);

  // Recurring event scope handling
  const [parentEventId, setParentEventId] = useState<string | null>(null);
  const [updateSingleLoading, setUpdateSingleLoading] = useState(false);
  const [updateAllLoading, setUpdateAllLoading] = useState(false);

  // Store event's venue separately to always have it available
  const [eventVenue, setEventVenue] = useState<any>(null);
  const [savedVenueId, setSavedVenueId] = useState<string>('');

  const hasInitializedRef = useRef(false);
  const isInitializingRef = useRef(false);
  const venueSetRef = useRef(false);

  // Get event data
  const { data: event = {}, isSuccess: eventLoaded } = useGeteventByIdQuery(id ?? skipToken, {
    refetchOnMountOrArgChange: true,
  });

  // Get all organizations
  const { data: { data: organizations = [] } = {}, isLoading: orgLoading } = useGetOrganizationQuery({
    page: 0,
    limit: 100,
  });

  const { data: { data: categoriesData = [] } = {}, isLoading: categoriesLoading } = useGetCategoriesQuery({
    page: 0,
    limit: 100,
  });

  const { data: { data: tagsd = [] } = {}, isLoading: tagsLoading } = useGetTagsQuery({
    page: 0,
    limit: 100,
  });

  const [addEvent, { isLoading: isAddingEvent }] = useAddeventMutation();
  const [updateEvent, { isLoading: isUpdatingEvent }] = useUpdateeventMutation();

  const methods = useForm<EventFormValues>({
    defaultValues,
    resolver: yupResolver(eventValidationSchema) as unknown as Resolver<EventFormValues>,
  });

  const { watch, setValue, reset } = methods;

  const { mediaUrl, mediaType, venue, categories, recurring, recurringDays, recurringEnd, organization } = watch();

  // Get venues when organization changes
  const { data: { data: venuesData = [] } = {}, isLoading: venuesLoading } = useGetVenuesQuery(
    organization ? { page: 0, limit: 1000, organization } : skipToken,
    {
      skip: !organization,
    }
  );

  // Merge event venue with fetched venues
  const venues = useMemo(() => {
    if (!eventVenue) {
      return venuesData;
    }

    // Check if event venue already exists in fetched data
    const exists = venuesData.some((v: any) => v._id === eventVenue._id);

    if (exists) {
      return venuesData;
    }

    // Add event venue to the beginning of the list
    return [eventVenue, ...venuesData];
  }, [venuesData, eventVenue]);

  const prevOrganizationRef = useRef(organization);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [step]);

  // Clear venue when organization changes (but NOT during initialization)
  useEffect(() => {
    if (prevOrganizationRef.current && prevOrganizationRef.current !== organization && hasInitializedRef.current && !isInitializingRef.current) {
      setValue('venue', '', { shouldDirty: true });
      setEventVenue(null);
      setSavedVenueId('');
      venueSetRef.current = false;
    }
    prevOrganizationRef.current = organization;
  }, [organization, setValue]);

  // Set venue after venues are loaded in edit mode
  useEffect(() => {
    if (isEditMode && hasInitializedRef.current && !venueSetRef.current && savedVenueId && venues.length > 0 && !venuesLoading) {
      const venueExists = venues.some((v: any) => v._id === savedVenueId);

      if (venueExists) {
        setValue('venue', savedVenueId, { shouldValidate: true });
        venueSetRef.current = true;
      } else {
        console.warn('⚠️ Venue not found in options:', savedVenueId);
      }
    }
  }, [isEditMode, hasInitializedRef.current, savedVenueId, venues, venuesLoading, setValue]);

  // Remove partner organization if same as main
  useEffect(() => {
    const partnerOrganization = watch('partnerOrganization');
    if (organization && partnerOrganization === organization) {
      setValue('partnerOrganization', '');
    }
  }, [organization, setValue, watch]);

  const toggleRecurringDay = (day: string) => {
    const currentDays = watch('recurringDays') || [];
    const newDays = currentDays.includes(day) ? currentDays.filter((d: string) => d !== day) : [...currentDays, day];
    setValue('recurringDays', newDays, { shouldDirty: true });
  };

  const isStepValid = (step: number): boolean => {
    if (step === 1) {
      const allRequiredFieldsFilled = [
        mediaUrl,
        mediaType,
        watch('name'),
        watch('description'),
        venue,
        categories && categories.length > 0,
        watch('tags').length > 0,
        watch('organization'),
      ].every(Boolean);

      // Check if form is dirty (has changes)
      const isDirty = methods.formState.isDirty;

      // In edit mode, allow proceeding if either form is dirty or all fields are valid
      if (isEditMode) {
        return isDirty || allRequiredFieldsFilled;
      }

      // In create mode, require all fields to be filled
      return allRequiredFieldsFilled;
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

        if (endType === 'never') return hasBasicFields && !!freq && !!interval && !!endType;
        if (endType === 'onDate') return hasBasicFields && !!freq && !!interval && !!endType && !!endDate;
        if (endType === 'afterOccurrences') return hasBasicFields && !!freq && !!interval && !!endType && !!occurrences;
        return false;
      }

      // In edit mode for step 2, check if dirty or has basic fields
      if (isEditMode) {
        return methods.formState.isDirty || hasBasicFields;
      }

      return hasBasicFields;
    }
    if (step === 3) {
      const ticketing = watch('ticketing');
      if (!ticketing) return false;

      const hasRequiredFields = !!(ticketing.title && ticketing.price >= 0 && ticketing.taxPercentage >= 0);
      const timingSlotsEnabled = Boolean(ticketing.timingSlots?.enabled);

      if (timingSlotsEnabled) {
        const hasTimeSlots = Array.isArray(ticketing.timingSlots?.dateTimeSlots) && ticketing.timingSlots.dateTimeSlots.length > 0;
        return hasRequiredFields && hasTimeSlots;
      }

      return hasRequiredFields && (Number(ticketing.quantity) || 0) > 0;
    }
    return false;
  };

  const handleSkipTicketing = async () => {
    const data = methods.getValues();
    const formDataWithoutTicketing = { ...data };
    delete formDataWithoutTicketing.ticketing;
    await onSubmit(formDataWithoutTicketing);
  };

  // Helper function to properly create a DateTime from date and time string
  const createDateTime = (dateValue: Date | null, timeString: string): Date | null => {
    if (!dateValue || !timeString) return null;

    const date = new Date(dateValue);
    let hours = 0;
    let minutes = 0;

    // Handle 24-hour format "HH:MM"
    const time24Match = timeString.match(/^(\d{1,2}):(\d{2})$/);
    if (time24Match) {
      hours = parseInt(time24Match[1], 10);
      minutes = parseInt(time24Match[2], 10);
    } else {
      // Handle 12-hour format "HH:MM AM/PM" or "H:MM AM/PM"
      const time12Match = timeString.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
      if (time12Match) {
        hours = parseInt(time12Match[1], 10);
        minutes = parseInt(time12Match[2], 10);
        const period = time12Match[3].toUpperCase();
        if (period === 'PM' && hours !== 12) hours += 12;
        if (period === 'AM' && hours === 12) hours = 0;
      }
    }

    date.setHours(hours, minutes, 0, 0);
    return date;
  };

  const onSubmit = async (data: EventFormValues, scope?: any) => {
    let imageFileString = '';

    try {
      setLoading(true);

      // Set specific loading state based on scope
      if (scope === 'single') {
        setUpdateSingleLoading(true);
      } else if (scope === 'future') {
        setUpdateAllLoading(true);
      }

      // Helper to format datetime for API
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

      // Validate schedule dates before image uploading
      // Create proper Date objects from date and time components
      const startDateTime = createDateTime(data.fromDate, data.fromTime);
      const endDateTime = createDateTime(data.endDate, data.endTime);

      if (startDateTime && endDateTime) {
        const now = new Date();

        // Check if startDateTime is in the past (comparing full date + time)
        if (startDateTime.getTime() < now.getTime()) {
          showError('Start date and time cannot be in the past');
          setLoading(false);
          if (scope === 'single') setUpdateSingleLoading(false);
          if (scope === 'future') setUpdateAllLoading(false);
          return;
        }

        // Check if endDateTime is in the past (comparing full date + time)
        if (endDateTime.getTime() < now.getTime()) {
          showError('End date and time cannot be in the past');
          setLoading(false);
          if (scope === 'single') setUpdateSingleLoading(false);
          if (scope === 'future') setUpdateAllLoading(false);
          return;
        }

        // Check if startDateTime is before endDateTime
        if (startDateTime.getTime() >= endDateTime.getTime()) {
          showError('Start date and time must be before end date and time');
          setLoading(false);
          if (scope === 'single') setUpdateSingleLoading(false);
          if (scope === 'future') setUpdateAllLoading(false);
          return;
        }
      }

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
      } else {
        payload.schedule.recurringDetails = {
          isEnabled: false,
        };
      }

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

        if (!data.ticketing.timingSlots.enabled) {
          ticketingPayload.quantity = data.ticketing.quantity;
        }

        if (data.ticketing.transferFee !== null && data.ticketing.transferFee > 0) {
          ticketingPayload.transferFee = data.ticketing.transferFee;
        }

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

      if (!id) {
        response = await addEvent(payload).unwrap();
      } else {
        // Include scope in the update call if provided
        response = await updateEvent({
          id: id,
          ...(scope && { scope }), // Only add scope if it exists
          ...payload,
        }).unwrap();
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
        const successMessage = id
          ? scope === 'single'
            ? 'Event updated successfully'
            : scope === 'future'
              ? 'All future events updated successfully'
              : 'Event updated successfully'
          : 'Event created successfully';

        showSuccess(response?.message || successMessage);
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
      setUpdateSingleLoading(false);
      setUpdateAllLoading(false);
    }
  };

  // Handler for "Update This Event" button
  const handleUpdateSingle = async () => {
    const data = methods.getValues();
    await onSubmit(data, 'single');
  };

  // Handler for "Update For All" button
  const handleUpdateAll = async () => {
    const data = methods.getValues();
    await onSubmit(data, 'future');
  };

  const setEditValues = useCallback(() => {
    if (!event || !event._id || !organizations || organizations.length === 0) {
      console.log('⏳ Waiting for data...');
      return;
    }

    // Mark as initializing
    isInitializingRef.current = true;

    // Extract parentEvent ID from recurringMeta
    const parentEvent = event?.recurringMeta?.parentEvent || null;
    setParentEventId(parentEvent);

    // Extract venue information
    let venueId = '';
    let venueData = null;

    if (event.basicInfo?.venue) {
      if (typeof event.basicInfo.venue === 'string') {
        venueId = event.basicInfo.venue;
      } else if (event.basicInfo.venue._id) {
        venueId = event.basicInfo.venue._id;
        venueData = {
          _id: event.basicInfo.venue._id,
          title: event.basicInfo.venue.title || '',
          floorPlan: event.basicInfo.venue.floorPlan || '',
          location: event.basicInfo.venue.location || {},
        };
      }
    }

    // Store venue data and ID
    if (venueData) {
      setEventVenue(venueData);
    }
    if (venueId) {
      setSavedVenueId(venueId);
    }

    // Show partner organizer section if it exists
    if (event.basicInfo?.partnerOrganization) {
      setShowPartnerOrganizer(true);
    }

    // Get IDs
    const organizationId = event?.basicInfo?.organization?._id || '';
    const partnerOrgId =
      typeof event?.basicInfo?.partnerOrganization === 'string'
        ? event.basicInfo.partnerOrganization
        : event?.basicInfo?.partnerOrganization?._id || '';

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

    const formData: any = {
      image: event?.basicInfo?.media || null,
      mediaUrl: event?.basicInfo?.media || '',
      mediaType: 'image',
      name: event?.basicInfo?.title || '',
      description: event?.basicInfo?.description || '',
      organization: organizationId,
      venue: '', // Will be set later after venues load
      partnerOrganization: partnerOrgId,
      categories: event?.basicInfo?.categories?.map((cat: any) => cat._id) || [],
      tags: event?.basicInfo?.tags?.map((tag: any) => tag._id) || [],
      eventType: 'oneTime',
      fromDate: fromDate_,
      fromTime: fromTime_,
      endDate: endDate_,
      endTime: endTime_,
      recurring: event?.schedule?.recurringDetails?.isEnabled || false,
      recurringType: event?.schedule?.recurringDetails?.frequency || 'daily',
      recurringInterval: event?.schedule?.recurringDetails?.interval || 1,
      recurringDays: recurringDays_,
      recurringEnd: event?.schedule?.recurringDetails?.endType || 'never',
      recurringEndDate: event?.schedule?.recurringDetails?.endDate ? new Date(event.schedule.recurringDetails.endDate) : null,
      recurringEndCount: event?.schedule?.recurringDetails?.occurrences || 1,
      categoryInput: '',
      tagInput: '',
      organizerInput: '',
      partnerOrganizerInput: '',
      organizers: [],
      daysOfWeek: [],
      ticketing: defaultValues.ticketing,
    };

    reset(formData);
    hasInitializedRef.current = true;

    // Mark initialization complete
    setTimeout(() => {
      isInitializingRef.current = false;
    }, 150);
  }, [event, organizations, reset]);

  // Initialize form when data is ready
  useEffect(() => {
    if (id && eventLoaded && event?._id && organizations && organizations.length > 0 && !hasInitializedRef.current) {
      const timer = setTimeout(() => {
        setEditValues();
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [id, eventLoaded, event?._id, organizations, setEditValues]);

  // Reset when component unmounts or ID changes
  useEffect(() => {
    return () => {
      hasInitializedRef.current = false;
      isInitializingRef.current = false;
      venueSetRef.current = false;
      setShowPartnerOrganizer(false);
      setEventVenue(null);
      setSavedVenueId('');
      setParentEventId(null);
      setUpdateSingleLoading(false);
      setUpdateAllLoading(false);
    };
  }, [id]);

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
    toggleRecurringDay,
    isStepValid,
    onSubmit,
    handleSkipTicketing,
    handleUpdateSingle,
    handleUpdateAll,
    router,
    mediaUrl,
    mediaType,
    venue,
    categories,
    recurring,
    recurringDays,
    recurringEnd,
    organization,
    isEditMode,
    parentEventId,
    updateSingleLoading,
    updateAllLoading,
  };
};
