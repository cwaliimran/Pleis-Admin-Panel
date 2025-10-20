'use client';

import FormProvider, { RHFSelectField, RHFTextField } from '@/components/rhf';
import RHFDate from '@/components/rhf/rhf-date';
import RHFMultiSelectField from '@/components/rhf/RHFMultiSelectField';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { useGetCategoriesQuery } from '@/store/Reducer/categories';
import {
  useAddeventMutation,
  useGeteventByIdQuery,
  useUpdateeventMutation,
} from '@/store/Reducer/events';
import { useGetOrganizationQuery } from '@/store/Reducer/organization';
import { useGetTagsQuery } from '@/store/Reducer/tags';
import { useGetVenuesQuery } from '@/store/Reducer/venue';
import { uploadFileToAzure } from '@/utils/fileUpload';
import { convertTimeFormat, fDate, formatStr } from '@/utils/format-time';
import { yupResolver } from '@hookform/resolvers/yup';
import { CalendarIcon, ChevronDown, Clock, Plus, X } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { Controller, Resolver, useForm } from 'react-hook-form';
// import { useSelector } from 'react-redux';
import * as Yup from 'yup';
// import type { RootState } from '@/store/store';
import ButtonLoading from '@/components/common/button-loading';
import VenueTypeModal from '@/components/common/create-venue-modal';
import RHFCustomDropdown from '@/components/rhf/rhf-custom-dropdown';
import { Skeleton } from '@/components/ui/skeleton';
import { deleteFileFromAzure } from '@/utils/deleteFile';
import { skipToken } from '@reduxjs/toolkit/query';
import Image from 'next/image';

interface EventFormValues {
  image: File | null;
  mediaUrl: string;
  mediaType: string;
  name: string;
  venue: string;
  categories: string[];
  tags: string[];
  organizers: string[];
  partnerOrganizers: string[];
  fromDate: Date | null;
  fromTime: string;
  endDate: Date | null;
  endTime: string;
  description: string;
  eventType: 'oneTime' | 'slots';
  recurring: boolean;
  recurringType: string;
  recurringInterval: number;
  recurringDays: string[];
  recurringEnd: 'never' | 'onDate' | 'afterOccurrences';
  recurringEndDate: Date | null;
  recurringEndCount: number;
  categoryInput?: string;
  tagInput?: string;
  organizerInput?: string;
  partnerOrganizerInput?: string;
  organization: string;
  startDateTime?: Date;
  endDateTime?: Date;
  daysOfWeek?: string[];
  endOnDate?: string;
}

const weekDays = [
  { label: 'MON', value: 'monday' },
  { label: 'TUE', value: 'tuesday' },
  { label: 'WED', value: 'wednesday' },
  { label: 'THU', value: 'thursday' },
  { label: 'FRI', value: 'friday' },
  { label: 'SAT', value: 'saturday' },
  { label: 'SUN', value: 'sunday' },
];

const CreateEventView = (props: any) => {
  const { title = 'Create' } = props;
  // const {id} = useParams();
  const [step, setStep] = useState(1);
  const [version, setVersion] = useState(1);
  const [showPartnerOrganizer, setShowPartnerOrganizer] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [venueModal, setVenueModal] = useState<boolean>(false);
  const { id } = useParams();

  const { data: event = {} } = useGeteventByIdQuery(id ?? skipToken);

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
  // const [addVenue] = useAddVenueMutation();
  const [addEvent, { isLoading: isAddingEvent }] = useAddeventMutation();
  const [updateEvent, { isLoading: isUpdatingEvent }] =
    useUpdateeventMutation();

  const defaultValues: EventFormValues = {
    image: null,
    mediaUrl: '',
    mediaType: 'image',
    name: '',
    venue: '',
    categories: [],
    tags: [],
    organizers: [],
    partnerOrganizers: [],
    fromDate: null,
    fromTime: '',
    endDate: null,
    endTime: '',
    description: '',
    eventType: 'oneTime',
    recurring: false,
    recurringType: 'weekly',
    recurringInterval: 1,
    recurringDays: [],
    recurringEnd: 'never',
    recurringEndDate: null,
    recurringEndCount: 1,
    categoryInput: '',
    tagInput: '',
    organizerInput: '',
    partnerOrganizerInput: '',
    organization: '',
    daysOfWeek: [],
  };
  const router = useRouter();
  // const { user } = useSelector((state: RootState) => state.userSlice);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [step, version]);

  const schema = Yup.object().shape({
    mediaUrl: Yup.string().required('Event media is required'),
    mediaType: Yup.string(),
    name: Yup.string().required('Name is required'),
    description: Yup.string(),
    venue: Yup.string(),
    categories: Yup.array().of(Yup.string()),
    tags: Yup.array().of(Yup.string()),
    organization: Yup.string().required('Organization is required'),
    partnerOrganizers: Yup.array().of(Yup.string()),
    fromDate: Yup.date().nullable(), // 👈 fix
    fromTime: Yup.string().required('Start time is required'),
    endDate: Yup.date().nullable(), // 👈 fix
    endTime: Yup.string().required('End time is required'),
    eventType: Yup.string().oneOf(['oneTime', 'slots']),
    recurring: Yup.boolean(),
    recurringType: Yup.string().oneOf(['weekly', 'monthly', 'daily']),
    recurringInterval: Yup.mixed().test(
      'is-valid',
      'Recurring interval must be at least 1',
      (value) => {
        if (value === '' || value === null || value === undefined) return true;
        return typeof value === 'number' && value >= 1;
      }
    ),
    recurringDays: Yup.array().of(Yup.string()),
    recurringEnd: Yup.string().oneOf(['never', 'onDate', 'afterOccurrences']),
    recurringEndDate: Yup.date().nullable(), // 👈 already correct
    recurringEndCount: Yup.number().min(1),
    daysOfWeek: Yup.array().of(Yup.string()),
    endOnDate: Yup.string(),
  });

  const methods = useForm<EventFormValues>({
    defaultValues,
    resolver: yupResolver(schema) as unknown as Resolver<EventFormValues>,
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
    // partnerOrganizerInput = '',
    organization,
  } = watch();

  // Conditional venue API call based on organization selection
  const { data: { data: venues = [] } = {}, isLoading: venuesLoading } =
    useGetVenuesQuery(
      organization
        ? { page: 0, limit: 1000, organization: organization }
        : { page: 0, limit: 1000 },
      {
        skip: !organization,
      }
    );

  // Clear venue when organization changes
  const prevOrganizationRef = useRef(organization);
  useEffect(() => {
    if (
      prevOrganizationRef.current &&
      prevOrganizationRef.current !== organization
    ) {
      // Clear venue field when organization changes to a different organization
      setValue('venue', '');
    }
    prevOrganizationRef.current = organization;
  }, [organization, setValue]);

  // Remove partner organizer if it becomes the main organization
  useEffect(() => {
    if (organization && partnerOrganizers?.includes(organization)) {
      setValue(
        'partnerOrganizers',
        partnerOrganizers?.filter((po) => po !== organization)
      );
    }
  }, [organization, partnerOrganizers, setValue]);

  // const addPartnerOrganizer = () => {
  //   if (
  //     partnerOrganizerInput &&
  //     !partnerOrganizers?.includes(partnerOrganizerInput)
  //   ) {
  //     setValue('partnerOrganizers', [
  //       ...partnerOrganizers,
  //       partnerOrganizerInput,
  //     ]);
  //     setValue('partnerOrganizerInput', '');
  //   }
  // };

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

  const isStepValid = (step: number) => {
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
      // Validate required fields for step 2
      const hasBasicFields = [
        watch('fromDate'),
        watch('endDate'),
        watch('fromTime'),
        watch('endTime'),
        eventType,
      ].every(Boolean);

      // Recurring event validation
      if (recurring) {
        const freq = watch('recurringType');
        const interval = watch('recurringInterval');
        const daysOfWeek = watch('recurringDays');
        const endType = watch('recurringEnd');
        const endDate = watch('recurringEndDate');
        const occurrences = watch('recurringEndCount');

        if (!freq || !interval || !endType || !daysOfWeek) return false;

        if (endType === 'never') {
          return hasBasicFields && freq && interval && endType;
        }
        if (endType === 'onDate') {
          return hasBasicFields && freq && interval && endType && !!endDate;
        }
        if (endType === 'afterOccurrences') {
          return hasBasicFields && freq && interval && endType && !!occurrences;
        }
        return false;
      }

      // Non-recurring event
      return hasBasicFields;
    }
  };

  // const addNewVenue = async (values: any) => {
  //   let imageFileString = '';
  //   try {
  //     setLoading(true);
  //     if (
  //       values.floorPlan &&
  //       (values.floorPlan instanceof FileList ||
  //         Array.isArray(values.floorPlan))
  //     ) {
  //       const file = values.floorPlan[0];
  //       if (file) {
  //         imageFileString = await uploadFileToAzure(file);
  //       }
  //       const res: any = await addVenue({
  //         ...values,
  //         floorPlan: imageFileString,
  //       }).unwrap();
  //       if (res?.data) {
  //         refetchVenues();
  //         setVenueModal(false);
  //         setValue('venue', res?.data?._id);
  //       }
  //     }
  //   } catch (err) {
  //     await deleteFileFromAzure(imageFileString);
  //     console.log('Error adding venue:', err);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

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
          type: data.eventType, // "oneTime"
          startDateTime: data.fromDate
            ? `${fDate(data.fromDate, formatStr.paramCase.db)} ${convertTimeFormat(data.fromTime)}`
            : '', // "2025-09-03 16:35"
          endDateTime: data.endDate
            ? `${fDate(data.endDate, formatStr.paramCase.db)} ${convertTimeFormat(data.endTime)}`
            : '', // "2025-09-03 16:37"
          ...(data.recurring
            ? {
                recurringDetails: {
                  isEnabled: data.recurring, // true
                  frequency: data.recurringType, // "weekly"
                  interval: data.recurringInterval, // 1
                  daysOfWeek: data.recurringDays.map((day: string) =>
                    day.substring(0, 3).toLowerCase()
                  ), // ["mon", "tue", "wed"]
                  endType: data.recurringEnd, // "never"
                  endDate: data.recurringEndDate, // null
                  occurrences: data.recurringEndCount, // 1
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
        router.push(`/${props.userType}/events/${res?.data?._id}`);
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

  const setEditValues = () => {
    if (!event) return;
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

    reset({
      image: event?.basicInfo?.mediaInfo?.url || null, // from basicInfo.mediaInfo
      mediaUrl: event?.basicInfo?.mediaInfo?.url || '',
      mediaType: event?.basicInfo?.mediaInfo?.type || 'image',

      name: event?.basicInfo?.title || '',
      description: event?.basicInfo?.description || '',

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

      organization: event?.basicInfo?.organization?._id || '',
      partnerOrganizers: event?.basicInfo?.partnerOrganizers
        ? event.basicInfo.partnerOrganizers.map((org: any) => org._id)
        : [],
    });
  };

  useEffect(() => {
    if (event && event._id) {
      setEditValues();
    }
  }, [event?._id, reset]);

  return (
    <div>
      <div className="flex min-h-screen w-full flex-col items-center bg-[#f8f6f7] py-4 dark:bg-black">
        <div className="mb-2 flex w-full justify-end"></div>

        <div className="w-full md:mx-auto md:max-w-5xl">
          <Card className="dark:bg-secondary shadow-sm">
            <CardContent className="dark:bg-secondary p-2 md:p-8">
              {/* Header */}
              <div className="mb-8">
                <h1 className="text-foreground mb-6 text-2xl font-bold">
                  {title} Event
                </h1>
                {/* Step text above progress bar */}
                <div className="mb-6 w-full">
                  <div className="mb-2 text-sm font-semibold text-gray-700 dark:text-gray-200">
                    {step === 1
                      ? 'Step 1: Basic Info'
                      : step === 2
                        ? 'Step 2: Schedule Date and Time'
                        : ' Step 3: Add Ticketing'}
                  </div>
                  {/* <div className="relative w-full h-2 bg-gray-200 dark:bg-zinc-800 rounded-full overflow-hidden">
                    <div
                      className="bg-blue-700 h-2 rounded-full transition-all duration-300"
                      style={{
                        width: `${step === 1 ? 33 : step === 2 ? 66 : 100}%`,
                      }}
                    />
                  </div> */}
                  <div className="relative h-2 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-zinc-800">
                    <div
                      className={`h-2 rounded-full bg-blue-700 transition-all duration-300 ${
                        step === 1
                          ? 'w-[33%]'
                          : step === 2
                            ? 'w-[66%]'
                            : 'w-full'
                      }`}
                    />
                  </div>
                </div>
              </div>

              <FormProvider
                methods={methods}
                onSubmit={methods.handleSubmit(onSubmit)}
              >
                {step === 1 && (
                  <div className="space-y-8">
                    {/* Image upload and basic info */}
                    <div className="flex flex-col gap-4 md:gap-8 lg:flex-row">
                      {/* Left: Image upload */}
                      <div className="w-full lg:basis-[40%]">
                        <Controller
                          name="image"
                          control={methods.control}
                          render={({ field }) => (
                            <div className="space-y-2">
                              <label className="relative flex h-80 w-full cursor-pointer flex-col items-center justify-center overflow-hidden rounded-lg border-2 border-gray-300 bg-[#F8F6F7] transition-colors hover:border-gray-400 dark:border-zinc-700 dark:bg-[#171717] dark:hover:border-zinc-500">
                                {mediaUrl ? (
                                  mediaType === 'video' ? (
                                    <video
                                      src={mediaUrl}
                                      controls
                                      className="h-full w-full object-cover"
                                    />
                                  ) : (
                                    <Image
                                      src={mediaUrl}
                                      alt="Preview"
                                      priority
                                      className="h-full w-full object-cover"
                                      height={300}
                                      width={300}
                                    />
                                  )
                                ) : (
                                  <div className="flex flex-row text-gray-400">
                                    <span className="mr-2 text-3xl"> + </span>
                                    <div className="flex flex-col">
                                      <span className="text-[22.9px] font-semibold">
                                        Add photo
                                      </span>
                                      <span className="align-middle text-[22.9px] font-semibold">
                                        or video
                                      </span>
                                    </div>
                                  </div>
                                )}
                                <input
                                  type="file"
                                  accept="image/*,video/*"
                                  className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
                                  onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    if (file) {
                                      setFile(file);
                                      const reader = new FileReader();
                                      reader.onloadend = () => {
                                        const result = reader.result as string;
                                        setValue('mediaUrl', result);
                                        setValue(
                                          'mediaType',
                                          file.type.startsWith('video/')
                                            ? 'video'
                                            : 'image'
                                        );
                                      };
                                      reader.readAsDataURL(file);
                                      field.onChange(file);
                                    }
                                  }}
                                />
                              </label>
                            </div>
                          )}
                        />
                      </div>

                      {/* Right: Event name and description */}
                      <div className="w-full space-y-2 lg:basis-[60%]">
                        <div className="relative">
                          <RHFTextField
                            name="name"
                            placeholder="Enter Event Name"
                            className="rounded-4xl border border-gray-200 bg-[#F8F6F7] px-4 text-lg font-medium focus:border-blue-600 dark:border-zinc-600 dark:hover:border-zinc-500"
                          />

                          {/* <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              className="absolute top-0.5 right-1 cursor-pointer rounded-2xl text-gray-400"
                              onClick={() => methods.setValue('name', '')}
                            >
                              <X className="h-4 w-4" />
                            </Button> */}
                        </div>
                        {/* <RHFTextField
                            name="description"
                            placeholder="Type Event Description"
                            multiline
                            rows={8}
                            className="resize-none border-gray-200 bg-[#F8F6F7] focus:border-blue-600 sm:min-h-[120px] lg:min-h-[275px]"
                          /> */}

                        <RHFTextField
                          name="description"
                          placeholder="Type Event Description"
                          multiline
                          rows={8}
                          className="max-w-xl resize-none border-gray-200 bg-[#F8F6F7] break-words whitespace-pre-wrap focus:border-blue-600 sm:min-h-[120px] lg:min-h-[275px] dark:border-zinc-600 dark:hover:border-zinc-500"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-sm font-medium tracking-wide text-gray-700 uppercase dark:text-gray-300">
                        Organization
                      </label>

                      {orgLoading ? (
                        <div className="mt-2 w-full gap-2 md:flex md:w-[50%]">
                          <Skeleton className="h-[35px] flex-1 cursor-not-allowed rounded-4xl border-gray-200 px-5" />
                        </div>
                      ) : (
                        <div className="mt-2 w-full gap-2 md:flex md:w-[70%]">
                          {/* <RHFSelectField
                            name="organization"
                            placeholder="Choose Organization"
                            options={organizations?.map((org: any) => ({
                              value: org._id,
                              label: org.basicInfo?.name,
                            }))}
                            className="mt-2 h-[40px] flex-1 cursor-pointer rounded-4xl border-gray-200 px-5 focus:border-blue-600 sm:min-w-[120px] lg:min-w-[440px]"
                          /> */}

                          <RHFCustomDropdown
                            name="organization"
                            placeholder="Choose Organization"
                            className="sm:max-w-[120px] lg:max-w-[440px]"
                            triggerClassName="h-[42px] rounded-4xl border-gray-200 cursor-pointer dark:border-gray-700 px-5"
                            contentClassName="rounded-xl shadow-md"
                            options={organizations?.map((org: any) => ({
                              value: org?._id,
                              label: org?.basicInfo?.name,
                            }))}
                            isLoading={orgLoading}
                            showNone={false}
                          />
                        </div>
                      )}
                    </div>

                    <div>
                      <label className="text-sm font-medium tracking-wide text-gray-700 uppercase dark:text-gray-300">
                        VENUE
                      </label>

                      {venuesLoading ? (
                        <div className="mt-2 w-full gap-2 md:flex md:w-[50%]">
                          <Skeleton className="h-[35px] flex-1 cursor-not-allowed rounded-4xl border-gray-200 px-5" />
                        </div>
                      ) : (
                        <div className="w-full items-center gap-2 md:flex md:w-[70%]">
                          {/* <RHFSelectField
                            name="venue"
                            placeholder={
                              !organization
                                ? 'Select organization first'
                                : 'Suggested Venue'
                            }
                            disabled={!organization || venues?.length === 0}
                            options={venues?.map((val: any) => ({
                              value: val?._id,
                              label: val?.title,
                            }))}
                            className={`mt-2 h-[40px] flex-1 rounded-4xl border-gray-200 px-5 focus:border-blue-600 sm:min-w-[120px] lg:min-w-[440px] ${!organization ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}
                          /> */}

                          <RHFCustomDropdown
                            name="venue"
                            placeholder={
                              !organization
                                ? 'Select organization first'
                                : 'Suggested Venue'
                            }
                            className="sm:max-w-[120px] lg:max-w-[440px]"
                            triggerClassName="h-[42px] rounded-4xl border-gray-200 cursor-pointer dark:border-gray-700 px-5"
                            contentClassName="rounded-xl shadow-md"
                            disabled={!organization || venues?.length === 0}
                            options={venues?.map((val: any) => ({
                              value: val?._id,
                              label: val?.title,
                            }))}
                            isLoading={venuesLoading}
                            showNone={false}
                          />

                          <Button
                            className={`bg-primary hover:bg-primary mt-2 rounded-4xl py-2 text-white ${!organization ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}
                            disabled={!organization}
                            onClick={() => setVenueModal(true)}
                          >
                            Add Venue
                          </Button>
                        </div>
                      )}

                      <div className="mt-8">
                        <label className="text-sm font-medium tracking-wide text-gray-700 uppercase dark:text-gray-300">
                          Category
                        </label>

                        {categoriesLoading ? (
                          <div className="mt-2 w-full gap-2 md:flex md:w-[50%]">
                            <Skeleton className="h-[35px] flex-1 cursor-not-allowed rounded-4xl border-gray-200 px-5" />
                          </div>
                        ) : (
                          <div className="mt-2 w-full gap-2 md:flex md:w-[70%]">
                            {/* <RHFSelectField
                              name="category"
                              placeholder="Choose Category"
                              options={categories?.map((val: any) => ({
                                value: val._id,
                                label: val.title,
                              }))}
                              className="mt-2 h-[40px] flex-1 cursor-pointer rounded-4xl border-gray-200 px-5 text-[14px] focus:border-blue-600 sm:min-w-[120px] lg:min-w-[440px]"
                            /> */}

                            <RHFMultiSelectField
                              name="categories"
                              placeholder="Choose Category"
                              options={categoriesData?.map((val: any) => ({
                                value: val._id,
                                label: val.title,
                              }))}
                              className="h-[40px] cursor-pointer rounded-4xl border-gray-200 px-5 text-left text-[14px] focus:border-blue-600 sm:min-w-[120px] lg:min-w-[440px]"
                            />

                            {/* <RHFCustomCombobox
                              name="categories"
                              placeholder="Select categories"
                              className="w-full flex-1"
                              multiple={true}
                              allowCustom={false}
                              options={categoriesData?.map((val: any) => ({
                                value: val._id,
                                label: val.title,
                              }))}
                            /> */}
                          </div>
                        )}

                        {/* {category.length > 0 && (
                          <div className="mt-2 flex flex-wrap gap-2 rounded-2xl">
                            {category.map((c: string) => (
                              <Badge
                                key={c}
                                className="bg-secondary flex items-center gap-1 text-sm text-white dark:bg-white dark:text-black"
                              >
                                {categoryOptions.find((opt) => opt.value === c)
                                  ?.label || c}
                                <button
                                  title="Remove Category"
                                  type="button"
                                  onClick={() => removeCategory(c)}
                                  className="ml-1 rounded-full p-0.5 hover:bg-gray-200"
                                >
                                  <X className="h-3 w-3 cursor-pointer" />
                                </button>
                              </Badge>
                            ))}
                          </div>
                        )} */}
                      </div>
                    </div>

                    {/* Tags */}
                    <div>
                      <label className="text-sm font-medium tracking-wide text-gray-700 uppercase dark:text-gray-300">
                        TAGS
                      </label>

                      {tagsLoading ? (
                        <div className="mt-2 w-full gap-2 md:flex md:w-[50%]">
                          <Skeleton className="h-[35px] flex-1 cursor-not-allowed rounded-4xl border-gray-200 px-5" />
                        </div>
                      ) : (
                        <div className="mt-2 w-full items-center gap-2 md:flex md:w-[70%]">
                          <RHFMultiSelectField
                            name="tags"
                            placeholder="Choose Tag"
                            options={tagsd?.map((val: any) => ({
                              value: val._id,
                              label: val.title,
                            }))}
                            className="h-[40px] cursor-pointer rounded-4xl border-gray-200 px-5 text-left text-[14px] focus:border-blue-600 sm:min-w-[120px] lg:min-w-[440px]"
                          />
                        </div>
                      )}

                      {/* {tags?.length > 0 && (
                        <div className="mt-2 flex flex-wrap gap-2">
                          {tags?.map((t: string) => (
                            <Badge
                              key={t}
                              className="bg-secondary flex items-center gap-1 text-sm text-white dark:bg-white dark:text-black"
                            >
                              {tags?.find((opt:any) => opt._id === t)
                                ?.title}
                              <button
                                type="button"
                                title="Remove Tag"
                                onClick={() => setValue('tags', tags.filter((v) => v !== t))}
                                className="ml-1 rounded-full p-0.5 hover:bg-gray-200"
                              >
                                <X className="h-3 w-3 cursor-pointer" />
                              </button>
                            </Badge>
                          ))}
                        </div>
                      )} */}
                    </div>

                    {/* Organizer */}

                    {/* Partner Organizer */}
                    <div className="mt-4">
                      <button
                        type="button"
                        className="flex cursor-pointer items-center gap-1 rounded-2xl text-sm font-medium text-blue-600 hover:text-blue-700"
                        onClick={() => setShowPartnerOrganizer((v) => !v)}
                      >
                        <Plus className="h-4 w-4" />
                        Add Partner Organizer
                      </button>

                      {/* Partner organizer input (visible only when toggled) */}
                      {showPartnerOrganizer && (
                        <div className="mt-2 flex w-[70%] gap-2">
                          {/* <input
                            type="text"
                            placeholder="Search for partner organizer"
                            value={partnerOrganizerInput}
                            onChange={(e) =>
                              setValue('partnerOrganizerInput', e.target.value)
                            }
                            className="h-[40px] w-full max-w-md cursor-pointer rounded-4xl border border-gray-200 px-5 py-[8px] text-[14px]"
                          /> */}

                          <RHFCustomDropdown
                            name="partnerOrganizerInput"
                            placeholder="Search for partner organizer"
                            className="sm:max-w-[120px] lg:max-w-[440px]"
                            triggerClassName="h-[42px] rounded-4xl border-gray-200 cursor-pointer dark:border-gray-700 px-5"
                            contentClassName="rounded-xl shadow-md"
                            disabled={!organization}
                            options={organizations
                              ?.filter(
                                (org: any) =>
                                  org._id !== organization &&
                                  !partnerOrganizers?.includes(org._id)
                              )
                              ?.map((org: any) => ({
                                value: org?._id,
                                label: org?.basicInfo?.name,
                              }))}
                            isLoading={orgLoading}
                            showNone={false}
                          />

                          {/* <Button
                            type="button"
                            onClick={addPartnerOrganizer}
                            // disabled={!partnerOrganizerInput || partnerOrganizers?.includes(partnerOrganizerInput)}
                            className={`bg-primary hover:bg-primary rounded-4xl py-2 text-white md:mt-0 ${(!partnerOrganizerInput || partnerOrganizers?.includes(partnerOrganizerInput)) ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}
                          >
                            Add
                          </Button> */}
                        </div>
                      )}
                      {partnerOrganizers?.length > 0 && (
                        <div className="mt-2 flex flex-wrap gap-2">
                          {partnerOrganizers?.map((po: string) => (
                            <Badge
                              key={po}
                              className="bg-secondary flex items-center gap-1 text-sm text-white dark:bg-white dark:text-black"
                            >
                              {organizations?.find((org: any) => org._id === po)
                                ?.basicInfo?.name || po}
                              <button
                                title="Remove Organizer"
                                type="button"
                                onClick={() => removePartnerOrganizer(po)}
                                className="ml-1 rounded-full p-0.5 hover:bg-gray-200"
                              >
                                <X className="h-3 w-3 cursor-pointer" />
                              </button>
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                    {/* </div> */}

                    {/* Navigation buttons */}
                    <div className="mt-22 flex flex-wrap items-center justify-end gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => router.back()}
                        className="cursor-pointer rounded-4xl py-2 md:mt-2 md:min-w-[90px]"
                      >
                        Cancel
                      </Button>

                      <Button
                        type="button"
                        disabled={!isStepValid(1)}
                        onClick={() => setStep(2)}
                        className="bg-primary hover:bg-primary cursor-pointer rounded-4xl py-2 text-white md:mt-2 md:min-w-[90px]"
                      >
                        Next
                      </Button>
                    </div>
                  </div>
                )}

                {step === 2 && (
                  <div className="space-y-8">
                    {/* Event type selection */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium">Choose event type</h3>
                      <div className="flex flex-wrap gap-4">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => setValue('eventType', 'oneTime')}
                          className={`border-2 ${
                            eventType === 'oneTime'
                              ? 'border-blue-700 text-blue-700'
                              : 'border-gray-300 dark:border-zinc-700'
                          } cursor-pointer rounded-2xl bg-transparent px-6 py-2 font-semibold`}
                        >
                          One time
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => setValue('eventType', 'slots')}
                          className={`border-2 ${
                            eventType === 'slots'
                              ? 'border-blue-700 text-blue-700'
                              : 'border-gray-300 dark:border-zinc-700'
                          } cursor-pointer rounded-2xl bg-transparent px-6 py-2 font-semibold`}
                        >
                          Slots
                        </Button>
                      </div>
                    </div>

                    <Separator />

                    {/* Date and time */}
                    <div className="space-y-6">
                      <h3 className="text-lg font-medium">
                        Set up your event date and time
                      </h3>

                      {/* Start Date and Time row */}
                      <div className="w-full md:w-[60%]">
                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                          <div className="w-full space-y-2">
                            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-white">
                              <CalendarIcon className="h-4 w-4" />
                              START DATE
                            </label>

                            <RHFDate
                              name="fromDate"
                              className="h-10 w-full cursor-pointer rounded-4xl border-gray-200 focus:border-blue-600"
                            />
                          </div>
                          <div className="space-y-2">
                            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-white">
                              <Clock className="h-4 w-4" />
                              START TIME
                            </label>
                            <input
                              title="Select Start Time"
                              type="time"
                              step="1800"
                              value={watch('fromTime') || '12:00'}
                              onChange={(e) =>
                                setValue('fromTime', e.target.value)
                              }
                              className="w-36 cursor-pointer rounded-4xl border border-gray-200 bg-[#F8F6F7] px-3 py-2 text-[15px] focus:border-blue-600 dark:border-zinc-700 dark:bg-transparent"
                            />
                          </div>
                        </div>
                      </div>
                      {/* End Date and Time row */}
                      <div className="w-full md:w-[60%]">
                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                          <div className="space-y-2">
                            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-white">
                              <CalendarIcon className="h-4 w-4" />
                              END DATE
                            </label>
                            <RHFDate
                              name="endDate"
                              minDate={new Date()}
                              className="h-10 w-full cursor-pointer rounded-4xl border-gray-200 focus:border-blue-600"
                            />
                          </div>
                          <div className="space-y-2">
                            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-white">
                              <Clock className="h-4 w-4" />
                              END TIME
                            </label>
                            <input
                              title="Select End Time"
                              type="time"
                              step="1800"
                              value={watch('endTime') || '13:00'}
                              onChange={(e) =>
                                setValue('endTime', e.target.value)
                              }
                              className="w-36 cursor-pointer rounded-4xl border border-gray-200 bg-[#F8F6F7] px-3 py-2 text-[15px] focus:border-blue-600 dark:border-zinc-700 dark:bg-transparent"
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    <Separator />

                    {/* Recurring event */}
                    <div className="space-y-6">
                      <h3 className="text-lg font-medium">Recurring event</h3>

                      <div className="flex items-center justify-start gap-2">
                        <div className="flex items-center gap-4">
                          <label className="flex cursor-pointer items-center gap-2">
                            <input
                              type="checkbox"
                              checked={recurring}
                              onChange={(e) =>
                                setValue('recurring', e.target.checked)
                              }
                              className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                            />
                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                              Enable
                            </span>
                          </label>
                        </div>

                        <div className="flex gap-4">
                          <RHFSelectField
                            name="recurringType"
                            placeholder="Select Recurrence"
                            options={[
                              { label: 'Weekly', value: 'weekly' },
                              { label: 'Monthly', value: 'monthly' },
                              { label: 'Daily', value: 'daily' },
                            ]}
                            className="w-32 cursor-pointer rounded-2xl border-gray-200 focus:border-blue-600"
                          />
                        </div>
                      </div>

                      {recurring && (
                        <>
                          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                            <div className="items-center justify-start gap-2 md:flex">
                              <label className="text-sm font-medium tracking-wide text-gray-700 uppercase dark:text-white">
                                RECURRING INTERVAL
                              </label>
                              <div className="flex items-center gap-2">
                                <input
                                  title="Set Recurring Interval"
                                  type="number"
                                  value={watch('recurringInterval')}
                                  onChange={(e) =>
                                    setValue(
                                      'recurringInterval',
                                      e.target.value
                                        ? Number(e.target.value)
                                        : 0
                                    )
                                  }
                                  className="w-16 rounded-2xl border border-gray-200 px-3 py-2 focus:border-blue-600 focus:outline-none"
                                  min="1"
                                />
                                <span className="text-sm text-gray-600 dark:text-white">
                                  {watch('recurringType') === 'weekly'
                                    ? 'Weeks'
                                    : watch('recurringType') === 'monthly'
                                      ? 'Months'
                                      : 'Days'}
                                </span>
                              </div>
                            </div>
                          </div>

                          <div className="space-y-2">
                            <label className="text-sm font-medium tracking-wide text-gray-700 uppercase dark:text-white">
                              RECURRING DAY
                            </label>
                            <div className="flex flex-wrap gap-2">
                              {weekDays.map((day) => (
                                <Button
                                  key={day.value}
                                  type="button"
                                  variant={
                                    recurringDays.includes(day.value)
                                      ? 'default'
                                      : 'outline'
                                  }
                                  size="sm"
                                  onClick={() => toggleRecurringDay(day.value)}
                                  className={`h-8 w-12 cursor-pointer text-xs ${
                                    recurringDays.includes(day.value)
                                      ? 'bg-blue-600 text-white'
                                      : 'text-gray-600 dark:text-white'
                                  }`}
                                >
                                  {day.label}
                                </Button>
                              ))}
                            </div>
                          </div>

                          <div className="space-y-4">
                            <label className="text-sm font-medium tracking-wide text-gray-700 uppercase dark:text-white">
                              RECURRING ENDS
                            </label>
                            <div className="mt-2 flex flex-col gap-3">
                              {/* Never */}
                              <div className="flex w-full items-center gap-3">
                                <label className="flex w-full items-center gap-3 rounded-2xl border-2 border-gray-200 bg-white px-3 py-2 text-gray-700 md:w-[60%] dark:border-zinc-700 dark:bg-[#23272f] dark:text-gray-200">
                                  <input
                                    type="radio"
                                    name="recurringEnd"
                                    value="never"
                                    checked={recurringEnd === 'never'}
                                    onChange={(e) =>
                                      setValue(
                                        'recurringEnd',
                                        e.target.value as any
                                      )
                                    }
                                    className="h-4 w-4 cursor-pointer rounded-2xl text-blue-600"
                                  />
                                  <span className="text-sm">Never</span>
                                </label>
                              </div>
                              {/* On Day */}
                              <div className="w-full items-center gap-3 md:flex">
                                <label className="flex w-full items-center gap-3 rounded-2xl border-2 border-gray-200 bg-white px-3 py-2 text-gray-700 md:w-[60%] dark:border-zinc-700 dark:bg-[#23272f] dark:text-gray-200">
                                  <input
                                    type="radio"
                                    name="recurringEnd"
                                    value="onDate"
                                    checked={recurringEnd === 'onDate'}
                                    onChange={(e) =>
                                      setValue(
                                        'recurringEnd',
                                        e.target.value as any
                                      )
                                    }
                                    className="h-4 w-4 cursor-pointer rounded-2xl text-blue-600"
                                  />
                                  <span className="text-sm">On Day</span>
                                </label>
                                {recurringEnd === 'onDate' && (
                                  <div className="mt-3 w-full bg-white md:mt-0 md:w-[30%] dark:bg-[#23272f]">
                                    <RHFDate
                                      name="recurringEndDate"
                                      className="w-full cursor-pointer rounded-2xl border-gray-200 focus:border-blue-600"
                                    />
                                  </div>
                                )}
                              </div>
                              {/* After */}
                              <div className="w-full items-center gap-3 md:flex">
                                <label className="flex w-full items-center gap-3 rounded-2xl border-2 border-gray-200 bg-white px-3 py-2 text-gray-700 md:w-[60%] dark:border-zinc-700 dark:bg-[#23272f] dark:text-gray-200">
                                  <input
                                    type="radio"
                                    name="recurringEnd"
                                    value="afterOccurrences"
                                    checked={
                                      recurringEnd === 'afterOccurrences'
                                    }
                                    onChange={(e) =>
                                      setValue(
                                        'recurringEnd',
                                        e.target.value as any
                                      )
                                    }
                                    className="h-4 w-4 cursor-pointer rounded-2xl text-blue-600"
                                  />
                                  <span className="text-sm">After</span>
                                </label>
                                {recurringEnd === 'afterOccurrences' && (
                                  <div className="mt-3 flex w-full items-center gap-2 rounded-2xl border border-gray-200 bg-white px-4 py-2 md:mt-0 md:w-[30%] dark:border-zinc-700 dark:bg-[#23272f]">
                                    <input
                                      title="Set Recurring Count"
                                      type="number"
                                      value={watch('recurringEndCount')}
                                      onChange={(e) =>
                                        setValue(
                                          'recurringEndCount',
                                          Number.parseInt(e.target.value)
                                        )
                                      }
                                      className="w-10 focus:border-blue-600 focus:outline-none"
                                      min="1"
                                    />
                                    <span className="text-sm text-gray-600 dark:text-gray-300">
                                      recurrings
                                    </span>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </>
                      )}
                    </div>

                    {/* Navigation buttons */}
                    <div className="mt-22 flex flex-wrap items-center justify-end gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setStep(1)}
                        className="cursor-pointer rounded-4xl py-2 md:mt-2 md:min-w-[90px]"
                      >
                        Back
                      </Button>
                      <Button
                        type="button"
                        disabled={!isStepValid(2)}
                        onClick={() => setStep(3)}
                        className="bg-primary hover:bg-primary cursor-pointer rounded-4xl py-2 text-white md:mt-2 md:min-w-[90px]"
                      >
                        Next
                      </Button>
                    </div>
                  </div>
                )}
                {step === 3 && (
                  <div>
                    <div className="w-full items-center justify-start md:flex">
                      <div className="flex flex-wrap gap-4">
                        {[
                          'Resend to Unopened Users',
                          'Include Names on Tickets',
                        ].map((item, index) => (
                          <div
                            key={index}
                            className="flex w-full items-center gap-2 sm:w-auto"
                          >
                            <Input
                              type="checkbox"
                              className="h-4 w-4 cursor-pointer"
                            />
                            <span className="text-foreground text-sm">
                              {item}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <h1 className="my-5 text-[16px] leading-5 font-medium">
                      General Information
                    </h1>
                    <div className="flex flex-wrap items-center gap-2 md:gap-4">
                      {['Paid', 'Free', 'Donation'].map((item, index) => (
                        <div
                          key={index}
                          className="flex w-full items-center gap-2 sm:w-auto"
                        >
                          <Button
                            variant={'outline'}
                            onClick={() => setVersion(index + 1)}
                            className={`cursor-pointer px-10 py-5 transition-all md:max-w-[140px] md:min-w-[140px] ${
                              version === index + 1
                                ? 'border-primary dark:border-primary border'
                                : ''
                            }`}
                          >
                            {item}
                          </Button>
                        </div>
                      ))}
                    </div>
                    <div className="relative mt-5 w-full md:w-[66%]">
                      <RHFTextField
                        name="name_"
                        placeholder="General Admission"
                        className="rounded-4xl border border-gray-200 bg-[#F8F6F7] px-4 text-sm font-medium"
                      />
                      {/* <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute top-0.5 right-1 cursor-pointer rounded-2xl text-gray-400"
                        >
                          <X className="h-4 w-4" />
                        </Button> */}
                    </div>
                    <div className="mt-4 grid w-full grid-cols-12 gap-4">
                      <div className="col-span-12 md:col-span-8">
                        <RHFTextField
                          name="description_"
                          multiline
                          rows={4}
                          placeholder="Type Ticket Description"
                          className="border border-gray-200 bg-[#F8F6F7] px-4 text-sm font-medium md:min-h-[132px]"
                        />
                      </div>
                      <div className="col-span-12 md:col-span-4">
                        <div className="space-y-2">
                          <label className="flex items-center gap-2 text-sm font-medium text-slate-500 dark:text-white">
                            AVAILABLE QUANTITY
                          </label>
                          <RHFTextField
                            name="quantity"
                            placeholder="100"
                            type="number"
                            className="rounded-4xl border border-gray-200 bg-[#F8F6F7] px-4 text-sm font-medium"
                          />
                        </div>
                        <div className="mt-3 flex items-end gap-4">
                          <div className="space-y-2">
                            <label className="flex items-center gap-2 text-sm font-medium text-slate-500 dark:text-white">
                              PRICE
                            </label>
                            <RHFTextField
                              name="price"
                              placeholder="0.00"
                              type="number"
                              className="rounded-4xl border border-gray-200 bg-[#F8F6F7] px-4 text-sm font-medium"
                            />
                          </div>
                          <RHFSelectField
                            name="currency"
                            placeholder="USD"
                            options={[
                              { label: 'USD', value: 'USD' },
                              { label: 'EURO', value: 'EUR' },
                              { label: 'GBP', value: 'GBP' },
                            ]}
                            className="cursor-pointer rounded-4xl border border-gray-200 bg-[#F8F6F7] px-4 text-sm font-medium"
                          />
                        </div>
                      </div>
                    </div>
                    <Separator className="my-4 md:my-8" />
                    <h1 className="my-5 text-[16px] leading-5 font-medium">
                      Set up sale start date and time
                    </h1>
                    <div className="w-full md:w-[60%]">
                      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                        <div className="space-y-2">
                          <label className="flex items-center gap-2 text-sm font-medium text-slate-500 dark:text-white">
                            <CalendarIcon className="h-4 w-4" />
                            START DATE
                          </label>
                          <RHFDate
                            name="fromDate_"
                            className="w-full cursor-pointer rounded-4xl border-gray-200 focus:border-blue-600"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="flex items-center gap-2 text-sm font-medium text-slate-500 dark:text-white">
                            <Clock className="h-4 w-4" />
                            START TIME
                          </label>
                          <input
                            title="Select Start Time"
                            type="time"
                            step="1800"
                            // value={watch('fromTime')}
                            // onChange={(e) =>
                            //   setValue('fromTime', e.target.value)
                            // }
                            className="w-25 cursor-pointer rounded-4xl border border-gray-200 bg-[#F8F6F7] px-3 py-2 focus:border-blue-600 dark:border-zinc-700 dark:bg-transparent"
                          />
                        </div>
                      </div>
                    </div>
                    {/* End Date and Time row */}
                    <div className="w-full md:mt-6 md:w-[60%]">
                      <div className="grid grid-cols-1 gap-6 gap-y-4 md:grid-cols-2">
                        <div className="space-y-2">
                          <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-white">
                            <CalendarIcon className="h-4 w-4" />
                            END DATE
                          </label>
                          <RHFDate
                            name="endDate_"
                            className="w-full cursor-pointer rounded-4xl border-gray-200 focus:border-blue-600"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="flex items-center gap-2 text-sm font-medium text-slate-500 dark:text-white">
                            <Clock className="h-4 w-4" />
                            END TIME
                          </label>
                          <input
                            title="Select End Time"
                            type="time"
                            step="1800"
                            // value={watch('endTime')}
                            // onChange={(e) =>
                            //   setValue('endTime', e.target.value)
                            // }
                            className="w-25 cursor-pointer rounded-4xl border border-gray-200 bg-[#F8F6F7] px-3 py-2 focus:border-blue-600 dark:border-zinc-700 dark:bg-transparent"
                          />
                        </div>
                      </div>
                      <div className="mt-6 w-full space-y-2 md:w-[60%]">
                        <label className="flex items-center gap-2 text-sm font-medium text-slate-500 dark:text-white">
                          TICKET OPTIONS
                        </label>
                        <RHFSelectField
                          name="ticketOptions"
                          placeholder="Select Ticket Options"
                          options={[
                            { label: 'General Admission', value: 'general' },
                            { label: 'VIP', value: 'vip' },
                            { label: 'Early Bird - 5$', value: 'early-bird' },
                          ]}
                          className="w-full cursor-pointer rounded-4xl border-gray-200"
                        />
                      </div>
                    </div>
                    <Separator className="my-4 md:my-8" />

                    <Button
                      type="button"
                      className="bg-primary hover:bg-primary cursor-pointer rounded-4xl py-2 text-white md:mt-2"
                    >
                      <Plus className="h-4 w-4" /> Add Date
                    </Button>

                    <h1 className="text-foreground my-5 text-[14px] leading-5 font-medium">
                      <span className="text-primary cursor-pointer">
                        + Create a section
                      </span>{' '}
                      if you want to sell multiple ticket types that share the
                      same inventory.
                    </h1>
                    <div className="mt-6 w-full space-y-2 md:w-[60%]">
                      <label className="flex items-center gap-2 text-sm font-medium text-slate-500 dark:text-white">
                        CHOOSE A SECTION
                      </label>
                      <RHFSelectField
                        name="time"
                        options={[
                          { label: '10:00AM', value: '10:00AM' },
                          { label: '11:00AM', value: '11:00AM' },
                          { label: '12:00PM', value: '12:00PM' },
                          { label: '1:00PM', value: '1:00PM' },
                          { label: '2:00PM', value: '2:00PM' },
                          { label: '3:00PM', value: '3:00PM' },
                        ]}
                        className="w-full cursor-pointer rounded-4xl border-gray-200"
                      />
                    </div>
                    <Separator className="my-4 md:my-8" />
                    <div className="my-6 flex items-center-safe gap-2">
                      <h1 className="my-5 flex-wrap text-[16px] leading-5 font-medium">
                        Advanced settings
                      </h1>
                      <ChevronDown className="h-4 w-4 cursor-pointer" />
                    </div>
                    <div className="mt-6 w-full space-y-2 md:w-[60%]">
                      <label className="flex items-center gap-2 text-sm font-medium text-slate-500 dark:text-white">
                        TICKETS PER ORDER
                      </label>
                      <div className="items-center gap-3 md:flex">
                        <RHFTextField
                          name="minQuantity"
                          placeholder="Minimum quantity"
                          type="number"
                          className="rounded-4xl border border-gray-200 bg-[#F8F6F7] px-4 text-sm font-medium"
                        />
                        <RHFTextField
                          name="maxQuantity"
                          placeholder="Maximum quantity"
                          type="number"
                          className="mt-3 rounded-4xl border border-gray-200 bg-[#F8F6F7] px-4 text-sm font-medium md:mt-0"
                        />
                      </div>
                      <label className="flex items-center gap-2 text-sm font-medium text-slate-500 dark:text-white">
                        SALES CHANNEL
                      </label>
                      <RHFSelectField
                        name="salesChannel"
                        placeholder="Select Sales Channel"
                        options={[
                          { label: 'Online', value: 'online' },
                          { label: 'In-person', value: 'in-person' },
                          { label: 'Phone', value: 'phone' },
                        ]}
                        className="w-full cursor-pointer rounded-4xl border-gray-200"
                      />
                    </div>
                    <Separator className="my-4 md:my-8" />
                    <div className="flex flex-wrap gap-3">
                      <Button
                        type="button"
                        className="bg-primary hover:bg-primary cursor-pointer rounded-4xl py-2 text-white md:mt-2"
                      >
                        <Plus className="h-4 w-4" /> Add tickets
                      </Button>

                      <Button
                        type="button"
                        className="bg-primary hover:bg-primary cursor-pointer rounded-4xl py-2 text-white md:mt-2"
                      >
                        <Plus className="h-4 w-4" />
                        Import Tickets
                      </Button>
                    </div>
                    <Separator className="my-4 md:my-8" />
                    <h1 className="text-primary my-5 cursor-pointer flex-wrap text-[16px] leading-5 font-medium">
                      + Add package
                    </h1>

                    <div className="mt-22 flex flex-wrap items-center justify-end gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setStep(2)}
                        className="cursor-pointer rounded-4xl py-2 md:mt-2 md:min-w-[90px]"
                      >
                        Back
                      </Button>

                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => router.push('/organizer/events/1')}
                        className="cursor-pointer rounded-4xl py-2 md:mt-2 md:min-w-[90px]"
                      >
                        Skip
                      </Button>

                      {loading || isAddingEvent || isUpdatingEvent ? (
                        <Button
                          type="button"
                          disabled
                          className="bg-primary hover:bg-primary cursor-not-allowed rounded-4xl py-2 text-white md:mt-2 md:min-w-[90px]"
                        >
                          <ButtonLoading title="Publishing" />
                        </Button>
                      ) : (
                        <Button
                          type="submit"
                          // onClick={() => router.push('/organizer/events/1')}
                          className="bg-primary hover:bg-primary cursor-pointer rounded-4xl py-2 text-white md:mt-2 md:min-w-[90px]"
                        >
                          Publish
                        </Button>
                      )}
                    </div>
                  </div>
                )}
              </FormProvider>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* <VenueTypeModal
        open={venueModal}
        onClose={() => setVenueModal(false)}
        editMode={false}
        isLoading={false}
        methods={null}
        buttonType={'button'}
        onSubmit={addNewVenue}
      /> */}

      <VenueTypeModal open={venueModal} onClose={() => setVenueModal(false)} />
    </div>
  );
};

export default CreateEventView;
