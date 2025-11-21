'use client';

import ButtonLoading from '@/components/common/button-loading';
import { RHFSelectField } from '@/components/rhf';
import RHFDate from '@/components/rhf/rhf-date';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { CalendarIcon, Clock } from 'lucide-react';
import * as React from 'react';
import { recurringTypeOptions, weekDays } from './constants';
import type { StepTwoProps } from './types';

const StepTwo = ({
  watch,
  setValue,
  recurring,
  recurringDays,
  recurringEnd,
  toggleRecurringDay,
  setStep,
  isStepValid,
  isEditMode,
  loading,
  isAddingEvent,
  isUpdatingEvent,
  methods,
}: StepTwoProps) => {
  const isLoading = loading || isAddingEvent || isUpdatingEvent;
  const { formState } = methods;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const hasChanges = React.useMemo(() => {
    if (!isEditMode) return true;

    if (formState.isDirty) return true;

    if (recurring) {
      const hasRecurringData = watch('recurringType') && watch('recurringInterval') > 0 && recurringDays.length > 0 && watch('recurringEnd');

      return hasRecurringData;
    }

    return false;
  }, [formState.isDirty, recurring, watch, recurringDays, isEditMode]);

  return (
    <div className="space-y-8">
      {/* Date and time */}
      <div className="space-y-6">
        <h3 className="text-lg font-medium">Set up your event date and time</h3>

        {/* Start Date and Time row */}
        <div className="w-full md:w-[60%]">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="w-full space-y-2">
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-white">
                <CalendarIcon className="h-4 w-4" />
                START DATE
              </label>

              <RHFDate name="fromDate" minDate={today} className="h-10 w-full cursor-pointer rounded-4xl border-gray-200 focus:border-blue-600" />
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
                onChange={(e) => setValue('fromTime', e.target.value, { shouldDirty: true })}
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
                minDate={watch('fromDate') || today}
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
                onChange={(e) => setValue('endTime', e.target.value, { shouldDirty: true })}
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
                onChange={(e) => setValue('recurring', e.target.checked, { shouldDirty: true })}
                className="h-4 w-4 cursor-pointer rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="cursor-pointer text-sm font-medium text-gray-700 dark:text-gray-300">Enable</span>
            </label>
          </div>

          {recurring && (
            <div className="flex gap-4">
              <RHFSelectField
                name="recurringType"
                placeholder="Select Recurrence"
                options={recurringTypeOptions}
                className="w-32 cursor-pointer rounded-2xl border-gray-200 focus:border-blue-600"
              />
            </div>
          )}
        </div>

        {recurring && (
          <>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div className="items-center justify-start gap-2 md:flex">
                <label className="text-sm font-medium tracking-wide text-gray-700 uppercase dark:text-white">RECURRING INTERVAL</label>
                <div className="flex items-center gap-2">
                  <input
                    title="Set Recurring Interval"
                    type="number"
                    value={watch('recurringInterval') === 0 ? '' : watch('recurringInterval')}
                    onChange={(e) => {
                      const val = e.target.value;
                      setValue('recurringInterval', val === '' ? 0 : Number(val), { shouldDirty: true });
                    }}
                    className="w-16 rounded-2xl border border-gray-200 px-3 py-2 focus:border-blue-600 focus:outline-none"
                    min="1"
                    placeholder="1"
                  />
                  <span className="text-sm text-gray-600 dark:text-white">
                    {watch('recurringType') === 'weekly' ? 'Weeks' : watch('recurringType') === 'monthly' ? 'Months' : 'Days'}
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium tracking-wide text-gray-700 uppercase dark:text-white">RECURRING DAY</label>
              <div className="flex flex-wrap gap-2">
                {weekDays.map((day) => (
                  <Button
                    key={day.value}
                    type="button"
                    variant={recurringDays.includes(day.value) ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => toggleRecurringDay(day.value)}
                    className={`h-8 w-12 cursor-pointer text-xs ${
                      recurringDays.includes(day.value) ? 'bg-blue-600 text-white' : 'text-gray-600 dark:text-white'
                    }`}
                  >
                    {day.label}
                  </Button>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <label className="text-sm font-medium tracking-wide text-gray-700 uppercase dark:text-white">RECURRING ENDS</label>
              <div className="mt-2 flex flex-col gap-3">
                {/* Never */}
                <div className="flex w-full items-center gap-3">
                  <label className="flex w-full items-center gap-3 rounded-2xl border-2 border-gray-200 bg-white px-3 py-2 text-gray-700 md:w-[60%] dark:border-zinc-700 dark:bg-[#23272f] dark:text-gray-200">
                    <input
                      type="radio"
                      name="recurringEnd"
                      value="never"
                      checked={recurringEnd === 'never'}
                      onChange={(e) => setValue('recurringEnd', e.target.value as 'never' | 'onDate' | 'afterOccurrences', { shouldDirty: true })}
                      className="h-4 w-4 cursor-pointer rounded-2xl text-blue-600"
                    />
                    <span className="text-sm">Never</span>
                  </label>
                </div>
                {/* On Date */}
                <div className="w-full items-center gap-3 md:flex">
                  <label className="flex w-full items-center gap-3 rounded-2xl border-2 border-gray-200 bg-white px-3 py-2 text-gray-700 md:w-[60%] dark:border-zinc-700 dark:bg-[#23272f] dark:text-gray-200">
                    <input
                      type="radio"
                      name="recurringEnd"
                      value="onDate"
                      checked={recurringEnd === 'onDate'}
                      onChange={(e) => setValue('recurringEnd', e.target.value as 'never' | 'onDate' | 'afterOccurrences', { shouldDirty: true })}
                      className="h-4 w-4 cursor-pointer rounded-2xl text-blue-600"
                    />
                    <span className="text-sm">On Date</span>
                  </label>
                  {recurringEnd === 'onDate' && (
                    <div className="mt-3 w-full md:mt-0 md:w-[30%]">
                      <RHFDate
                        name="recurringEndDate"
                        minDate={watch('endDate') || today}
                        className="h-10 w-full cursor-pointer rounded-2xl border-gray-200 bg-white focus:border-blue-600 dark:bg-[#23272f]"
                      />
                    </div>
                  )}
                </div>
                {/* After Occurrences */}
                <div className="w-full items-center gap-3 md:flex">
                  <label className="flex w-full items-center gap-3 rounded-2xl border-2 border-gray-200 bg-white px-3 py-2 text-gray-700 md:w-[60%] dark:border-zinc-700 dark:bg-[#23272f] dark:text-gray-200">
                    <input
                      type="radio"
                      name="recurringEnd"
                      value="afterOccurrences"
                      checked={recurringEnd === 'afterOccurrences'}
                      onChange={(e) => setValue('recurringEnd', e.target.value as 'never' | 'onDate' | 'afterOccurrences', { shouldDirty: true })}
                      className="h-4 w-4 cursor-pointer rounded-2xl text-blue-600"
                    />
                    <span className="text-sm">After</span>
                  </label>
                  {recurringEnd === 'afterOccurrences' && (
                    <div className="mt-3 flex w-full items-center gap-2 rounded-2xl border border-gray-200 bg-white px-4 py-2 md:mt-0 md:w-[30%] dark:border-zinc-700 dark:bg-[#23272f]">
                      <input
                        title="Set Recurring Count"
                        type="number"
                        value={watch('recurringEndCount') || ''}
                        onChange={(e) => {
                          const val = e.target.value;
                          setValue('recurringEndCount', val === '' ? undefined : Number.parseInt(val, 10), { shouldDirty: true });
                        }}
                        className="w-10 focus:border-blue-600 focus:outline-none dark:bg-transparent"
                        min="1"
                        placeholder="1"
                      />
                      <span className="text-sm text-gray-600 dark:text-gray-300">occurrences</span>
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
          disabled={isLoading}
        >
          Back
        </Button>

        {isEditMode ? (
          isLoading ? (
            <Button
              type="button"
              disabled
              className="bg-primary hover:bg-primary cursor-not-allowed rounded-4xl py-2 text-white md:mt-2 md:min-w-[90px]"
            >
              <ButtonLoading title="Updating" />
            </Button>
          ) : (
            <Button
              type="submit"
              disabled={!isStepValid(2) || !hasChanges}
              className="bg-primary hover:bg-primary cursor-pointer rounded-4xl py-2 text-white md:mt-2 md:min-w-[90px]"
            >
              Update Event
            </Button>
          )
        ) : (
          <Button
            type="button"
            disabled={!isStepValid(2)}
            onClick={() => setStep(3)}
            className="bg-primary hover:bg-primary cursor-pointer rounded-4xl py-2 text-white md:mt-2 md:min-w-[90px]"
          >
            Next
          </Button>
        )}
      </div>
    </div>
  );
};

export default StepTwo;
