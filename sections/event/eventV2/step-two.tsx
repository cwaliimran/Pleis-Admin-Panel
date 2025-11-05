'use client';

import { RHFSelectField } from '@/components/rhf';
import RHFDate from '@/components/rhf/rhf-date';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { CalendarIcon, Clock } from 'lucide-react';
import { recurringTypeOptions, weekDays } from './constants';
import type { StepTwoProps } from './types';

const StepTwo = ({
  // methods,
  watch,
  setValue,
  recurring,
  recurringDays,
  recurringEnd,
  eventType,
  toggleRecurringDay,
  setStep,
  isStepValid,
}: StepTwoProps) => {
  return (
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
                ? 'border-blue-700 text-blue-700 dark:border-blue-600 dark:text-blue-400'
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
              eventType === 'slots' ? 'border-blue-700 text-blue-700 dark:border-blue-600 dark:text-blue-400' : 'border-gray-300 dark:border-zinc-700'
            } cursor-pointer rounded-2xl bg-transparent px-6 py-2 font-semibold`}
          >
            Slots
          </Button>
        </div>
      </div>

      <Separator />

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

              <RHFDate name="fromDate" className="h-10 w-full cursor-pointer rounded-4xl border-gray-200 focus:border-blue-600" />
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
                onChange={(e) => setValue('fromTime', e.target.value)}
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
              <RHFDate name="endDate" minDate={new Date()} className="h-10 w-full cursor-pointer rounded-4xl border-gray-200 focus:border-blue-600" />
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
                onChange={(e) => setValue('endTime', e.target.value)}
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
                onChange={(e) => setValue('recurring', e.target.checked)}
                className="cursor-pointe h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="cursor-pointer text-sm font-medium text-gray-700 dark:text-gray-300">Enable</span>
            </label>
          </div>

          <div className="flex gap-4">
            <RHFSelectField
              name="recurringType"
              placeholder="Select Recurrence"
              options={recurringTypeOptions}
              className="w-32 cursor-pointer rounded-2xl border-gray-200 focus:border-blue-600"
            />
          </div>
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
                    value={watch('recurringInterval')}
                    onChange={(e) => setValue('recurringInterval', e.target.value ? Number(e.target.value) : 0)}
                    className="w-16 rounded-2xl border border-gray-200 px-3 py-2 focus:border-blue-600 focus:outline-none"
                    min="1"
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
                      onChange={(e) => setValue('recurringEnd', e.target.value as any)}
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
                      onChange={(e) => setValue('recurringEnd', e.target.value as any)}
                      className="h-4 w-4 cursor-pointer rounded-2xl text-blue-600"
                    />
                    <span className="text-sm">On Date</span>
                  </label>
                  {recurringEnd === 'onDate' && (
                    <div className="mt-3 w-full md:mt-0 md:w-[30%]">
                      <RHFDate
                        name="recurringEndDate"
                        className="h-10 w-full cursor-pointer rounded-2xl border-gray-200 bg-white focus:border-blue-600 dark:bg-[#23272f]"
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
                      checked={recurringEnd === 'afterOccurrences'}
                      onChange={(e) => setValue('recurringEnd', e.target.value as any)}
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
                        onChange={(e) => setValue('recurringEndCount', Number.parseInt(e.target.value))}
                        className="w-10 focus:border-blue-600 focus:outline-none"
                        min="1"
                      />
                      <span className="text-sm text-gray-600 dark:text-gray-300">recurrings</span>
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
        <Button type="button" variant="outline" onClick={() => setStep(1)} className="cursor-pointer rounded-4xl py-2 md:mt-2 md:min-w-[90px]">
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
  );
};

export default StepTwo;
