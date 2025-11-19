'use client';

import FormProvider, { RHFDate, RHFSelectField } from '@/components/rhf';
import { Card } from '@/components/ui/card';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import * as Yup from 'yup';

export default function ReservationHeader() {
  const defaultValues = { interval: 'today' };

  const schema = Yup.object().shape({
    interval: Yup.string().required(),
  });

  const methods = useForm({
    resolver: yupResolver(schema),
    defaultValues: defaultValues,
  });

  const onSubmit = () => {};

  return (
    <>
      <Card className="dark:bg-secondary mt-3 w-full flex-1 gap-2 rounded-lg px-6 py-8">
        <div className="mb-0 flex items-center justify-between">
          <div className="space-y-1">
            <h2 className="text-2xl font-semibold">Reservation Management</h2>
            <p className="text-sm font-normal">Create and manage venue reservations by timeslot</p>
          </div>
          <div className="flex">
            <div className="flex items-center gap-3">
              <FormProvider methods={methods} onSubmit={methods.handleSubmit(onSubmit)}>
                <div className="flex items-center justify-center gap-3">
                  <div className="flex w-full items-center justify-center gap-x-2 rounded-md bg-white md:w-[200px] lg:w-[200px] dark:bg-[#171717]">
                    <RHFDate name="recurringEndDate" className="w-full cursor-pointer rounded-md border-gray-200 focus:border-blue-600" />
                  </div>

                  <div className="flex w-full items-center justify-center gap-x-2 rounded-md bg-white md:w-[200px] lg:w-[200px] dark:bg-[#171717]">
                    <RHFSelectField
                      name="Today"
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
    </>
  );
}
