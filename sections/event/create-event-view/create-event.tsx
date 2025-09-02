'use client';

import Header from '@/app/common/header';
import FormProvider, { RHFSelectField, RHFTextField } from '@/components/rhf';
import RHFDate from '@/components/rhf/rhf-date';
import RHFTextfieldWithSelect from '@/components/rhf/rhf-text-field-with-select';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogOverlay,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { useBoolean } from '@/hooks/useBoolean';
import { yupResolver } from '@hookform/resolvers/yup';
import { CalendarIcon, ChevronDown, Clock, Plus, X } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import * as Yup from 'yup';

interface EventFormValues {
  image: File | null;
  name: string;
  venue: string;
  category: string[];
  tag: string[];
  organizers: string[];
  partnerOrganizers: string[];
  fromDate: Date | null;
  fromTime: string;
  endDate: Date | null;
  endTime: string;
  description: string;
  eventType: 'one-time' | 'slots';
  recurring: boolean;
  recurringType: string;
  recurringInterval: number;
  recurringDays: string[];
  recurringEnd: 'never' | 'on-day' | 'after';
  recurringEndDate: Date | null;
  recurringEndCount: number;
  categoryInput?: string;
  tagInput?: string;
  organizerInput?: string;
  partnerOrganizerInput?: string;
  organization?: string;
}

const defaultValues: EventFormValues = {
  image: null,
  name: '',
  venue: '',
  category: [],
  tag: [],
  organization: '',
  organizers: [],
  partnerOrganizers: [],
  fromDate: new Date(),
  fromTime: '10:00',
  endDate: new Date(),
  endTime: '23:00',
  description: '',
  eventType: 'one-time',
  recurring: false,
  recurringType: 'weekly',
  recurringInterval: 1,
  recurringDays: [],
  recurringEnd: 'never',
  recurringEndDate: null,
  recurringEndCount: 13,
  categoryInput: '',
  tagInput: '',
  organizerInput: '',
  partnerOrganizerInput: '',
};
const organizationOptions = [
  { label: 'Organization A', value: 'orgA' },
  { label: 'Organization B', value: 'orgB' },
  { label: 'Organization C', value: 'orgC' },
];

const venueOptions = [
  { label: 'Suggested Venue', value: 'suggested-venue' },
  { label: 'Conference Center', value: 'conference-center' },
  { label: 'Community Hall', value: 'community-hall' },
];

const categoryOptions = [
  { label: 'Music', value: 'music' },
  { label: 'Sports', value: 'sports' },
];

const tagOptions = [
  { label: 'Technology', value: 'technology' },
  { label: 'Business', value: 'business' },
  { label: 'Health', value: 'health' },
  { label: 'Music', value: 'music' },
];

const organizerOptions = [
  { label: 'Organization A', value: 'orgA' },
  { label: 'Organization B', value: 'orgB' },
  { label: 'Organization C', value: 'orgC' },
];

const weekDays = [
  { label: 'MON', value: 'monday' },
  { label: 'TUE', value: 'tuesday' },
  { label: 'WED', value: 'wednesday' },
  { label: 'THU', value: 'thursday' },
  { label: 'FRI', value: 'friday' },
  { label: 'SAT', value: 'saturday' },
  { label: 'SUN', value: 'sunday' },
];

const VenueDefaultValues = {
  // image: null,
  name: '',
  venueType: '',
  organization: '',
  location: '',
  clity: '',
  country: '',
};

const CreateEventView = (props:any) => {
  const { title='Create' } = props;
  const fileInputRef = useRef<HTMLInputElement>(null);
  const openModal = useBoolean();
  // const {id} = useParams();
  const [step, setStep] = useState(1);
  const [version, setVersion] = useState(1);
  const [showPartnerOrganizer, setShowPartnerOrganizer] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const methods = useForm<EventFormValues>({ defaultValues });
  const router = useRouter();
  const {
    watch,
    setValue,
    //   getValues
  } = methods;

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [step, version]);

  const schema = Yup.object().shape({
    name: Yup.string().required('Venue name is required'),
    venueType: Yup.string().required('Venue Type is required'),
    organization: Yup.string().required('Organization is required'),
    location: Yup.string().required('Location is required'),
    clity: Yup.string(),
    country: Yup.string(),
  });

  const venueMethods = useForm({
    resolver: yupResolver(schema),
    defaultValues: VenueDefaultValues,
  });

  const venue = watch('venue');
  const category = watch('category');
  const tag = watch('tag');
  const organizers = watch('organizers');
  const partnerOrganizers = watch('partnerOrganizers');
  const eventType = watch('eventType');
  const recurring = watch('recurring');
  const recurringType = watch('recurringType');
  const recurringDays = watch('recurringDays');
  const recurringEnd = watch('recurringEnd');

  const categoryInput = watch('categoryInput') || '';
  const tagInput = watch('tagInput') || '';
  const organizerInput = watch('organizerInput') || '';
  const partnerOrganizerInput = watch('partnerOrganizerInput') || '';

  //   const progress = step === 1 ? 50 : 100;

  //   const addCategory = () => {
  //     if (categoryInput && !category.includes(categoryInput)) {
  //       setValue("category", [...category, categoryInput]);
  //       setValue("categoryInput", "");
  //     }
  //   };

  const removeCategory = (val: string) => {
    setValue(
      'category',
      category.filter((v) => v !== val)
    );
  };

  const addTag = () => {
    if (tagInput && !tag.includes(tagInput)) {
      setValue('tag', [...tag, tagInput]);
      setValue('tagInput', '');
    }
  };

  const removeTag = (val: string) => {
    setValue(
      'tag',
      tag.filter((v) => v !== val)
    );
  };

  //   const addOrganizer = () => {
  //     if (organizerInput && !organizers.includes(organizerInput)) {
  //       setValue("organizers", [...organizers, organizerInput]);
  //       setValue("organizerInput", "");
  //     }
  //   };

  //   const removeOrganizer = (val: string) => {
  //     setValue(
  //       "organizers",
  //       organizers.filter((v) => v !== val)
  //     );
  //   };

  const addPartnerOrganizer = () => {
    if (
      partnerOrganizerInput &&
      !partnerOrganizers.includes(partnerOrganizerInput)
    ) {
      setValue('partnerOrganizers', [
        ...partnerOrganizers,
        partnerOrganizerInput,
      ]);
      setValue('partnerOrganizerInput', '');
    }
  };

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

  const handleAvatarChange = () => {
    fileInputRef.current?.click();
  };

  const CloseModal = () => {
    methods.reset(defaultValues);
    openModal.onFalse();
  };

  return (
    <div>
      <div className="font['Inter'] flex min-h-screen w-full flex-col items-center bg-[#f8f6f7] py-4 dark:bg-black">
        <div className="mb-2 flex w-full justify-end"></div>

        <div className="w-full md:mx-auto md:max-w-4xl">
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
                onSubmit={methods.handleSubmit(() => {})}
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
                                {preview ? (
                                  <img
                                    src={preview || '/placeholder.svg'}
                                    alt="Preview"
                                    className="h-full w-full object-cover"
                                  />
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
                                      const reader = new FileReader();
                                      reader.onloadend = () => {
                                        setPreview(reader.result as string);
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
                            placeholder="Summer Festival"
                            className="rounded-4xl border border-gray-200 bg-[#F8F6F7] px-4 text-lg font-medium focus:border-blue-600"
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="absolute top-0.5 right-1 cursor-pointer rounded-2xl text-gray-400"
                            onClick={() => methods.setValue('name', '')}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                        <RHFTextField
                          name="description"
                          placeholder="Type Event Description"
                          multiline
                          rows={8}
                          className="resize-none border-gray-200 bg-[#F8F6F7] focus:border-blue-600 sm:min-h-[120px] lg:min-h-[275px]"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-sm font-medium tracking-wide text-gray-700 uppercase dark:text-gray-300">
                        Organization
                      </label>
                      <div className="mt-2 w-full gap-2 md:flex md:w-[70%]">
                        <RHFSelectField
                          name="organization"
                          placeholder="Choose Organization"
                          options={organizationOptions}
                          value={watch('organization')}
                          onChange={(e: any) =>
                            setValue('organization', e.target.value)
                          }
                          className="mt-2 h-[40px] flex-1 cursor-pointer rounded-4xl border-gray-200 px-5 focus:border-blue-600 sm:min-w-[120px] lg:min-w-[440px]"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-sm font-medium tracking-wide text-gray-700 uppercase dark:text-gray-300">
                        VENUE
                      </label>
                      <div className="mt-2 w-full items-center gap-2 md:flex md:w-[70%]">
                        <RHFSelectField
                          name="venue"
                          placeholder="Suggested Venue"
                          options={venueOptions}
                          value={venue}
                          onChange={(e: any) =>
                            setValue('venue', e.target.value)
                          }
                          className="mt-2 h-[40px] flex-1 cursor-pointer rounded-4xl border-gray-200 px-5 focus:border-blue-600 sm:min-w-[120px] lg:min-w-[440px]"
                        />

                        <Button
                          className="bg-primary hover:bg-primary mt-2 cursor-pointer rounded-4xl py-2 text-white"
                          onClick={openModal.onTrue}
                        >
                          Add Venue
                        </Button>
                      </div>
                      <div className="mt-5">
                        <label className="text-sm font-medium tracking-wide text-gray-700 uppercase dark:text-gray-300">
                          Category
                        </label>
                        <div className="mt-2 w-full gap-2 md:flex md:w-[70%]">
                          <RHFSelectField
                            name="categoryInput"
                            placeholder="Choose Category"
                            options={categoryOptions}
                            value={categoryInput}
                            onChange={(e: any) =>
                              setValue('categoryInput', e.target.value)
                            }
                            className="mt-2 h-[40px] flex-1 cursor-pointer rounded-4xl border-gray-200 px-5 text-[14px] focus:border-blue-600 sm:min-w-[120px] lg:min-w-[440px]"
                          />
                        </div>
                        {category.length > 0 && (
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
                        )}
                      </div>
                    </div>

                    {/* Tags */}
                    <div>
                      <label className="text-sm font-medium tracking-wide text-gray-700 uppercase dark:text-gray-300">
                        TAGS
                      </label>
                      <div className="mt-2 w-full items-center gap-2 md:flex md:w-[70%]">
                        <input
                          type="text"
                          placeholder="Search for tag"
                          value={tagInput}
                          onChange={(e) => setValue('tagInput', e.target.value)}
                          className="h-[40px] w-full max-w-md cursor-pointer rounded-4xl border border-gray-200 px-5 py-[8px] text-[14px] focus:border-blue-600 focus:outline-none"
                        />

                        <Button
                          type="button"
                          onClick={addTag}
                          className="bg-primary hover:bg-primary cursor-pointer rounded-4xl py-2 text-white"
                        >
                          Add
                        </Button>
                      </div>
                      {tag.length > 0 && (
                        <div className="mt-2 flex flex-wrap gap-2">
                          {tag.map((t: string) => (
                            <Badge
                              key={t}
                              className="bg-secondary flex items-center gap-1 text-sm text-white dark:bg-white dark:text-black"
                            >
                              {tagOptions.find((opt) => opt.value === t)
                                ?.label || t}
                              <button
                                type="button"
                                title="Remove Tag"
                                onClick={() => removeTag(t)}
                                className="ml-1 rounded-full p-0.5 hover:bg-gray-200"
                              >
                                <X className="h-3 w-3 cursor-pointer" />
                              </button>
                            </Badge>
                          ))}
                        </div>
                      )}
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
                          <input
                            type="text"
                            placeholder="Search for partner organizer"
                            value={partnerOrganizerInput}
                            onChange={(e) =>
                              setValue('partnerOrganizerInput', e.target.value)
                            }
                            className="h-[40px] w-full max-w-md cursor-pointer rounded-4xl border border-gray-200 px-5 py-[8px] text-[14px]"
                          />

                          <Button
                            type="button"
                            onClick={addPartnerOrganizer}
                            className="bg-primary hover:bg-primary cursor-pointer rounded-4xl py-2 text-white md:mt-0"
                          >
                            Add
                          </Button>
                        </div>
                      )}
                      {partnerOrganizers.length > 0 && (
                        <div className="mt-2 flex flex-wrap gap-2">
                          {partnerOrganizers.map((po: string) => (
                            <Badge
                              key={po}
                              className="bg-secondary flex items-center gap-1 text-sm text-white dark:bg-white dark:text-black"
                            >
                              {organizerOptions.find((opt) => opt.value === po)
                                ?.label || po}
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
                          onClick={() => setValue('eventType', 'one-time')}
                          className={`border-2 ${
                            eventType === 'one-time'
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
                              value={watch('fromTime')}
                              onChange={(e) =>
                                setValue('fromTime', e.target.value)
                              }
                              className="w-32 cursor-pointer rounded-4xl border border-gray-200 bg-[#F8F6F7] px-3 py-2 text-[15px] focus:border-blue-600 dark:border-zinc-700 dark:bg-transparent"
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
                              value={watch('endTime')}
                              onChange={(e) =>
                                setValue('endTime', e.target.value)
                              }
                              className="w-32 cursor-pointer rounded-4xl border border-gray-200 bg-[#F8F6F7] px-3 py-2 text-[15px] focus:border-blue-600 dark:border-zinc-700 dark:bg-transparent"
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
                            value={recurringType}
                            onChange={(e: any) =>
                              setValue('recurringType', e.target.value)
                            }
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
                                      Number.parseInt(e.target.value)
                                    )
                                  }
                                  className="w-16 rounded-2xl border border-gray-200 px-3 py-2 focus:border-blue-600 focus:outline-none"
                                  min="1"
                                />
                                <span className="text-sm text-gray-600 dark:text-white">
                                  Weekly
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
                                    value="on-day"
                                    checked={recurringEnd === 'on-day'}
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
                                {recurringEnd === 'on-day' && (
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
                                    value="after"
                                    checked={recurringEnd === 'after'}
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
                                {recurringEnd === 'after' && (
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
                      {/* <Button
                        type="button"
                        variant="outline"
                        onClick={() => setStep(1)}
                        className="w-22 rounded-4xl cursor-pointer mt-2 md:py-6 py-3  md:px-18 px-5"
                      >
                        Back
                      </Button>
                      <Button
                        // type="submit"
                        onClick={() => setStep(3)}
                        className="w-22 bg-blue-600 hover:bg-blue-700 text-white rounded-4xl cursor-pointer mt-2 md:py-6 py-3  md:px-18 px-5"
                      >
                        Next
                      </Button> */}
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setStep(1)}
                        className="cursor-pointer rounded-4xl py-2 md:mt-2 md:min-w-[90px]"
                      >
                        Back
                      </Button>
                      {/* <Button
                        type="button"
                        onClick={() => setStep(2)}
                        className="w-22 bg-blue-600 hover:bg-blue-700 text-white rounded-4xl cursor-pointer mt-2 md:py-6 py-3  md:px-18 px-5"
                      >
                        Next
                      </Button> */}
                      <Button
                        type="button"
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
                        name="name"
                        placeholder="General Admission"
                        className="rounded-4xl border border-gray-200 bg-[#F8F6F7] px-4 text-sm font-medium"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute top-0.5 right-1 cursor-pointer rounded-2xl text-gray-400"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="mt-4 grid w-full grid-cols-12 gap-4">
                      <div className="col-span-12 md:col-span-8">
                        <RHFTextField
                          name="description"
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
                            defaultValue={'EURO'}
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
                            name="fromDate"
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
                            value={watch('fromTime')}
                            onChange={(e) =>
                              setValue('fromTime', e.target.value)
                            }
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
                            name="endDate"
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
                            value={watch('endTime')}
                            onChange={(e) =>
                              setValue('endTime', e.target.value)
                            }
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
                          defaultValue="early-bird"
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

                      <Button
                        type="button"
                        onClick={() => router.push('/organizer/events/1')}
                        className="bg-primary hover:bg-primary cursor-pointer rounded-4xl py-2 text-white md:mt-2 md:min-w-[90px]"
                      >
                        Publish
                      </Button>
                    </div>
                  </div>
                )}
              </FormProvider>
            </CardContent>
          </Card>
        </div>
      </div>
      <Dialog open={openModal.value} onOpenChange={CloseModal}>
        <DialogOverlay className="bg-opacity-30 fixed inset-0 flex w-full items-center justify-center bg-white md:w-lg">
          <DialogContent className="mx-auto max-h-[90vh] min-h-[86vh] overflow-y-auto dark:bg-[#171717]">
            <DialogHeader>
              <DialogTitle>Create Venue </DialogTitle>
            </DialogHeader>
            <FormProvider
              methods={venueMethods}
              onSubmit={venueMethods.handleSubmit(() => {})}
            >
              <div className="mt-4 flex flex-col gap-4">
                {/* <RHFUploadAvatar name="image" label="Venue Image" /> */}

                <RHFTextField
                  name="name"
                  label="Venue Name"
                  placeholder="Enter Venue Name"
                  className={` ${
                    methods.formState.errors.name ? 'border-red-400' : ''
                  }`}
                />

                <RHFTextfieldWithSelect
                  name="venueType"
                  label="Venue Type"
                  placeholder="Select Venue Type"
                  options={[
                    { value: 'event1', label: 'Event 1' },
                    { value: 'event2', label: 'Event 2' },
                    { value: 'event3', label: 'Event 3' },
                  ]}
                />
                <RHFTextfieldWithSelect
                  name="organization"
                  label="Organization"
                  placeholder="Select Organization"
                  options={[
                    { label: 'Organization A', value: 'org-a' },
                    { label: 'Organization B', value: 'org-b' },
                    { label: 'Organization C', value: 'org-c' },
                  ]}
                />

                <RHFTextField
                  name="location"
                  label="Location"
                  placeholder="Enter Location"
                />

                <div>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleAvatarChange}
                    className="border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
                  >
                    Upload Floor Plan
                  </Button>
                  <p className="mt-2 text-sm text-gray-500">
                    JPG or PNG. 1MB max.
                  </p>
                </div>

                <div className="w-full">
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
                </div>

                <div className="flex justify-end gap-2">
                  <Button
                    type="submit"
                    className="cursor-pointer bg-blue-700 text-white hover:bg-blue-800"
                  >
                    Add Venu
                  </Button>
                </div>
              </div>
            </FormProvider>
          </DialogContent>
        </DialogOverlay>
      </Dialog>
    </div>
  );
};

export default CreateEventView;
