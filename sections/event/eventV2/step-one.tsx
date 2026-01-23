'use client';

import { RHFTextField } from '@/components/rhf';
import RHFMultiSelectField from '@/components/rhf/RHFMultiSelectField';
import RHFCustomDropdown from '@/components/rhf/rhf-custom-dropdown';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Plus, X } from 'lucide-react';
import Image from 'next/image';
import { Controller } from 'react-hook-form';
import type { StepOneProps } from './types';

const StepOne = ({
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
  setFile,
  showPartnerOrganizer,
  setShowPartnerOrganizer,
  setVenueModal,
  router,
  setStep,
  isStepValid,
}: StepOneProps) => {
  const mediaUrl = watch('mediaUrl');
  const mediaType = watch('mediaType');
  const organization = watch('organization');
  const partnerOrganization = watch('partnerOrganization');
  const venue = watch('venue');

  // Show skeleton only if loading AND we don't have venues yet AND we don't have a selected venue
  const showVenueSkeleton = venuesLoading && venues?.length === 0 && !venue;

  return (
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
                      <video src={mediaUrl} controls className="h-full w-full object-cover" />
                    ) : (
                      <Image
                        src={mediaUrl}
                        alt="Event preview"
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, 40vw"
                        priority
                        quality={85}
                      />
                    )
                  ) : (
                    <div className="flex flex-row text-gray-400">
                      <span className="mr-2 text-3xl"> + </span>
                      <div className="flex flex-col">
                        <span className="text-[22.9px] font-semibold">Add photo</span>
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
                          setValue('mediaType', file.type.startsWith('video/') ? 'video' : 'image');
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
              className="rounded-lg border border-gray-200 bg-[#F8F6F7] px-4 text-lg font-medium focus:border-blue-600 dark:border-zinc-600 dark:hover:border-zinc-500"
            />
          </div>

          <RHFTextField
            name="description"
            placeholder="Type Event Description"
            multiline
            rows={8}
            className="max-w-xl resize-none rounded-lg border-gray-200 bg-[#F8F6F7] wrap-break-word whitespace-pre-wrap focus:border-blue-600 sm:min-h-30 lg:min-h-68.75 dark:border-zinc-600 dark:hover:border-zinc-500"
          />
        </div>
      </div>

      <div>
        <label className="text-sm font-medium tracking-wide text-gray-700 uppercase dark:text-gray-300">Organization</label>

        {orgLoading ? (
          <div className="mt-2 w-full gap-2 md:flex md:w-[50%]">
            <Skeleton className="h-8.75 flex-1 cursor-not-allowed rounded-4xl border-gray-200 px-5" />
          </div>
        ) : (
          <div className="mt-2 w-full gap-2 md:flex md:w-[70%]">
            <RHFCustomDropdown
              name="organization"
              placeholder="Choose Organization"
              className="sm:max-w-30 lg:max-w-110"
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
        <label className="text-sm font-medium tracking-wide text-gray-700 uppercase dark:text-gray-300">VENUE</label>

        {showVenueSkeleton ? (
          <div className="mt-2 w-full gap-2 md:flex md:w-[50%]">
            <Skeleton className="h-8.75 flex-1 cursor-not-allowed rounded-4xl border-gray-200 px-5" />
          </div>
        ) : (
          <div className="w-full items-center gap-2 md:flex md:w-[70%]">
            <RHFCustomDropdown
              name="venue"
              placeholder={!organization ? 'Select organization first' : 'Suggested Venue'}
              className="sm:max-w-30 lg:max-w-110"
              triggerClassName="h-10 rounded-4xl border-gray-200 cursor-pointer dark:border-gray-700 px-5"
              contentClassName="rounded-xl shadow-md"
              disabled={!organization}
              options={venues?.map((val: any) => ({
                value: val?._id,
                label: val?.title,
              }))}
              isLoading={venuesLoading && venues?.length === 0}
              showNone={false}
            />

            <Button
              type="button"
              className={`bg-primary hover:bg-primary mt-2 rounded-4xl py-2 text-white ${!organization ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}
              disabled={!organization}
              onClick={() => setVenueModal(true)}
            >
              Add Venue
            </Button>
          </div>
        )}

        <div className="mt-8">
          <label className="text-sm font-medium tracking-wide text-gray-700 uppercase dark:text-gray-300">Category</label>

          {categoriesLoading ? (
            <div className="mt-2 w-full gap-2 md:flex md:w-[50%]">
              <Skeleton className="h-8.75 flex-1 cursor-not-allowed rounded-4xl border-gray-200 px-5" />
            </div>
          ) : (
            <div className="mt-2 w-full gap-2 md:flex md:w-[70%]">
              <RHFMultiSelectField
                name="categories"
                placeholder="Choose Category"
                options={categoriesData?.map((val: any) => ({
                  value: val._id,
                  label: val.title,
                }))}
                className="h-10 cursor-pointer rounded-4xl border-gray-200 px-5 text-left text-[14px] focus:border-blue-600 sm:min-w-30 lg:min-w-110"
              />
            </div>
          )}
        </div>
      </div>

      {/* Tags */}
      <div>
        <label className="text-sm font-medium tracking-wide text-gray-700 uppercase dark:text-gray-300">TAGS</label>

        {tagsLoading ? (
          <div className="mt-2 w-full gap-2 md:flex md:w-[50%]">
            <Skeleton className="h-8.75 flex-1 cursor-not-allowed rounded-4xl border-gray-200 px-5" />
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
              className="h-10 cursor-pointer rounded-4xl border-gray-200 px-5 text-left text-[14px] focus:border-blue-600 sm:min-w-30 lg:min-w-110"
            />
          </div>
        )}
      </div>

      {/* Partner Organizer */}
      <div className="mt-4">
        <button
          type="button"
          className="flex cursor-pointer items-center gap-1 rounded-2xl text-sm font-medium text-blue-600 hover:text-blue-700"
          onClick={() => setShowPartnerOrganizer((v) => !v)}
        >
          <Plus className="h-4 w-4" />
          Add Partner Organization
        </button>

        {showPartnerOrganizer && (
          <div className="mt-2 flex w-[70%] gap-2">
            <RHFCustomDropdown
              name="partnerOrganization"
              placeholder="Search for partner organization"
              className="sm:max-w-30 lg:max-w-110"
              triggerClassName="h-[42px] rounded-4xl border-gray-200 cursor-pointer dark:border-gray-700 px-5"
              contentClassName="rounded-xl shadow-md"
              disabled={!organization}
              options={organizations
                ?.filter((org: any) => org._id !== organization)
                ?.map((org: any) => ({
                  value: org?._id,
                  label: org?.basicInfo?.name,
                }))}
              isLoading={orgLoading}
              showNone={false}
            />
          </div>
        )}
        {partnerOrganization && (
          <div className="mt-3 flex flex-wrap gap-2">
            <Badge className="bg-secondary flex items-center gap-1 py-1 text-xs text-white dark:bg-white dark:text-black">
              {organizations?.find((org: any) => org._id === partnerOrganization)?.basicInfo?.name || partnerOrganization}
              <button
                title="Remove Organizer"
                type="button"
                onClick={() => setValue('partnerOrganization', '')}
                className="ml-1 rounded-full p-0.5 hover:bg-gray-200 dark:hover:bg-gray-600"
              >
                <X className="h-3 w-3 cursor-pointer" />
              </button>
            </Badge>
          </div>
        )}
      </div>

      {/* Navigation buttons */}
      <div className="mt-22 flex flex-wrap items-center justify-end gap-2">
        <Button type="button" variant="outline" onClick={() => router.back()} className="cursor-pointer rounded-4xl py-2 md:mt-2 md:min-w-22.5">
          Cancel
        </Button>

        <Button
          type="button"
          disabled={!isStepValid(1)}
          onClick={() => setStep(2)}
          className="bg-primary hover:bg-primary cursor-pointer rounded-4xl py-2 text-white md:mt-2 md:min-w-22.5"
        >
          Next
        </Button>
      </div>
    </div>
  );
};

export default StepOne;
