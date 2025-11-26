'use client';

import FormProvider, { RHFDate, RHFSelectField } from '@/components/rhf';
import { Card } from '@/components/ui/card';
import { yupResolver } from '@hookform/resolvers/yup';
import React from 'react';
import { useForm } from 'react-hook-form';
import * as Yup from 'yup';
import { ReservationHeaderProps } from './reservation-types';

const schema = Yup.object({
  date: Yup.date().nullable().defined(),
  range: Yup.string().defined(),
});

type FormValues = Yup.InferType<typeof schema>;

export default function ReservationHeader({ date, onDateChange, range, onRangeChange }: ReservationHeaderProps) {
  const defaultValues: FormValues = {
    date: date ?? null,
    range: range,
  };

  const methods = useForm<FormValues>({
    resolver: yupResolver(schema),
    defaultValues,
    values: { date: date ?? null, range },
  });

  const { handleSubmit, watch, setValue } = methods;

  const watchedDate = watch('date');
  const watchedRange = watch('range');

  React.useEffect(() => {
    const currentDate = watchedDate ?? undefined;
    const propDate = date ?? undefined;

    if (currentDate?.getTime?.() !== propDate?.getTime?.()) {
      onDateChange(currentDate);

      // If date is selected, clear the range
      if (currentDate) {
        setValue('range', '');
        onRangeChange('');
      }
    }
  }, [watchedDate, date, onDateChange, setValue, onRangeChange]);

  React.useEffect(() => {
    if (watchedRange !== range) {
      onRangeChange(watchedRange);

      if (watchedRange) {
        setValue('date', null);
        onDateChange(undefined);
      }
    }
  }, [watchedRange, range, onRangeChange, setValue, onDateChange]);

  const onSubmit = () => {
    // No-op for this component as changes are handled in useEffect/watch
  };

  return (
    <Card className="dark:bg-secondary mt-3 w-full flex-1 gap-2 rounded-lg px-6 py-8">
      <div className="mb-0 flex items-center justify-between">
        <div className="space-y-1">
          <h2 className="text-2xl font-semibold">Reservation Management</h2>
          <p className="text-sm font-normal">Create and manage venue reservations by timeslot</p>
        </div>
        <div className="flex">
          <div className="flex items-center gap-3">
            <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
              <div className="flex items-center justify-center gap-3">
                <div className="flex w-full items-center justify-center gap-x-2 rounded-md bg-white md:w-[200px] lg:w-[230px] dark:bg-[#171717]">
                  <RHFDate name="date" className="w-full cursor-pointer rounded-md border-gray-200 focus:border-blue-600" label="Select Date" />
                </div>

                <div className="flex w-full items-center justify-center gap-x-2 rounded-md bg-white md:w-[200px] lg:w-[200px] dark:bg-[#171717]">
                  <RHFSelectField
                    name="range"
                    label="Select Range"
                    placeholder="Select Interval"
                    className="w-[200px] flex-1"
                    options={[
                      { value: 'today', label: 'Today' },
                      { value: 'weekly', label: 'This Week' },
                      { value: 'monthly', label: 'This Month' },
                    ]}
                  />
                </div>
              </div>
            </FormProvider>
          </div>
        </div>
      </div>
    </Card>
  );
}
