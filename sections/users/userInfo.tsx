'use client';

import { Button } from '@/components/ui/button';
import { Card, CardHeader } from '@/components/ui/card';
import { useBoolean } from '@/hooks/useBoolean';
import { defaultValues, schema } from '@/lib/schemas/organization-schema';
import { showError } from '@/utils/toast';
import { yupResolver } from '@hookform/resolvers/yup';
import { Pencil } from 'lucide-react';
import { useForm } from 'react-hook-form';
import AddOtherDetailsModal from '../organization-section/add-other-details-modal';

interface UserInfoProps {
  newOrganization?: any;
  setNewOrganization?: any;
}

const UserInfo = ({ newOrganization }: UserInfoProps) => {
  const openModal = useBoolean();

  const methods = useForm({
    resolver: yupResolver(schema),
    defaultValues: defaultValues,
  });

  const CloseModal = () => {
    methods.reset(defaultValues);
    openModal.onFalse();
  };

  const showToast = () => {
    showError('Please create an organization first!');
  };

  return (
    <>
      <div>
        <div className="flex justify-end">
          {newOrganization ? (
            <Pencil
              width={22}
              className="mr-2 cursor-pointer text-gray-500 transition-colors hover:text-gray-700"
              onClick={openModal.onTrue}
            />
          ) : (
            <Pencil
              width={22}
              className="mr-2 cursor-not-allowed text-gray-500 transition-colors hover:text-gray-700"
              onClick={showToast}
            />
          )}
        </div>

        <div className="mt-4 grid grid-cols-12 gap-4">
          {/* ---------- LEFT SIDE ---------- */}
          <div className="col-span-12 lg:col-span-5">
            {/* DESCRIPTION */}
            <Card className="shadow-lg dark:bg-[#171717]">
              <CardHeader>
                <h1 className="font-semibold text-slate-500">DESCRIPTION</h1>
                <p className="mt-2"></p>
              </CardHeader>
            </Card>

            {/* VENU */}
            <Card className="mt-4 shadow-lg dark:bg-[#171717]">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <h1 className="font-semibold text-slate-500">VENUE TYPE</h1>
                  <Button
                    variant="default"
                    // disabled
                    className="cursor-pointer rounded-full"
                  >
                    Add Venue
                  </Button>
                </div>
                <div className="mt-2 flex items-center gap-2">
                  {/* <PartyPopper /> */}
                  <p className="mt-2 text-lg">{/* Nightclub */}</p>
                </div>
              </CardHeader>
            </Card>
            {/* CATEGORIES */}
            <Card className="mt-4 shadow-lg dark:bg-[#171717]">
              <CardHeader>
                <h1 className="font-semibold text-slate-500">CATEGORIES</h1>
                <div className="mt-2 flex flex-wrap items-center gap-2"></div>
              </CardHeader>
            </Card>

            {/* OPERATING HOURS */}
            <Card className="mt-4 shadow-lg dark:bg-[#171717]">
              <CardHeader>
                <h1 className="mb-4 font-semibold text-slate-500">
                  OPERATING HOURS
                </h1>
                <div className="space-y-3">
                  {[
                    {
                      day: 'Monday',
                      startTime: '00:00 AM',
                      endTime: '11:00 PM',
                      closed: false,
                    },
                    {
                      day: 'Tuesday',
                      startTime: '00:00 PM',
                      endTime: '11:00 PM',
                      closed: false,
                    },
                    {
                      day: 'Wednesday',
                      startTime: '00:00 PM',
                      endTime: '11:00 PM',
                      closed: false,
                    },
                    {
                      day: 'Thursday',
                      startTime: '00:00 PM',
                      endTime: '11:00 PM',
                      closed: false,
                    },
                    {
                      day: 'Friday',
                      startTime: '00:00 AM',
                      endTime: '11:00 PM',
                      closed: false,
                    },
                    {
                      day: 'Saturday',
                      startTime: '00:00 AM',
                      endTime: '11:00 AM',
                      closed: true,
                    },
                    {
                      day: 'Sunday',
                      startTime: '00:00 AM',
                      endTime: '11:00 AM',
                      closed: true,
                    },
                  ].map((schedule, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between py-0.5 last:border-b-0"
                    >
                      <div className="flex-1 items-center justify-between gap-4 lg:flex">
                        <span className="w-20 text-sm font-medium text-gray-700 dark:text-gray-300">
                          {schedule.day}
                        </span>

                        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                          <span className="w-[100%] rounded border bg-gray-50 px-2 py-1 lg:w-24 dark:bg-gray-800">
                            {schedule.startTime}
                          </span>
                          <span className="text-xs text-gray-500">to</span>
                          <span className="w-[100%] rounded border bg-gray-50 px-2 py-1 lg:w-24 dark:bg-gray-800">
                            {schedule.endTime}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardHeader>
            </Card>
          </div>

          {/* ---------- RIGHT SIDE ---------- */}
          <div className="col-span-12 lg:col-span-7">
            {/* USER INFO */}
            <Card className="shadow-lg dark:bg-[#171717]">
              <CardHeader className="flex w-full flex-col gap-2">
                <h1 className="font-semibold text-slate-500">VENUE</h1>
                <div className="mt-2 flex items-center gap-2">
                  {/* <PartyPopper className="w-4 h-4" />
                  <span> Vibrant club</span> */}
                </div>
                <div className="mt-2 flex items-center gap-2">
                  {/* <MapPin />
                  <span>Trnjanska cesta 5, 10 000 Zagreb, Cro...</span> */}
                </div>
                {/* <img
                  src="/images/mapImage.png"
                  alt=""
                  className="w-full h-full mt-2"
                /> */}
                <div className="col-span-12 flex h-[100px] w-full items-center justify-center rounded-lg border border-dashed border-gray-300 bg-gray-100 md:col-span-12 md:h-[140px] dark:bg-gray-800">
                  <span className="text-sm text-gray-400">
                    No Venue Selected
                  </span>
                </div>
              </CardHeader>
            </Card>

            {/* USER GALLERY */}
            <Card className="dark:bg-secondary mt-5 shadow-lg">
              <CardHeader className="gap-4">
                <h1 className="font-semibold text-slate-500">GALLERY</h1>
                {/* Placeholder image */}
                <div className="col-span-12 flex h-[100px] w-full items-center justify-center rounded-lg border border-dashed border-gray-300 bg-gray-100 md:col-span-12 md:h-[140px] dark:bg-gray-800">
                  <span className="text-sm text-gray-400">No Image</span>
                </div>
              </CardHeader>
            </Card>
          </div>
        </div>

        <AddOtherDetailsModal
          open={openModal.value}
          onClose={CloseModal}
          newOrganization={newOrganization}
        />
      </div>
    </>
  );
};

export default UserInfo;
