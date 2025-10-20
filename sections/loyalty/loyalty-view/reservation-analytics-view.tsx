'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogOverlay,
  DialogTitle,
} from '@/components/ui/dialog';
import { useBoolean } from '@/hooks/useBoolean';
import {
  GenderDonutChart,
  ViewsOverTime,
  VisitorAge,
} from '@/sections/invoices';
import ReservationStatsCard from '@/sections/invoices/ReservationCard';
import VisitorRegionV2 from '@/sections/invoices/visitorRegionv2';
import { reservationCardHeaderData } from '@/sections/loyalty/data';
import ReservationList from '../ReservationTransactionList';
import StaffConfirmationsLog from '../StaffConfirmation';

const ReservationAnalyticsView = ({
  userType,
}: {
  global: boolean;
  userType: string;
}) => {
  const openModal = useBoolean();
  console.log('userType', userType);
  const activePercent = 75;
  const inactivePercent = 25;
  const thirdPercent = 40;

  return (
    <>
      <div className="mt-5 grid grid-cols-1 gap-2 md:grid-cols-3 md:gap-x-4 md:gap-y-4 lg:grid-cols-4">
        {reservationCardHeaderData?.map((card: any, index) => (
          <ReservationStatsCard key={index} item={card} />
        ))}
      </div>

      <div className="mt-5 grid grid-cols-12 gap-4">
        {/* --------------- Points activity over time --------------- */}
        <div className="col-span-12 md:col-span-12">
          <Card className="dark:bg-secondary col-span-12 shadow-md md:col-span-6">
            <CardHeader>
              <h3 className="text-md mb-3 font-medium">
                Reservation Volume Over Time
              </h3>
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold">+10%</h3>
                <h3 className="text-md font-[400] text-gray-400">
                  Last 90 Days <span className="ml-1 text-green-500">+10%</span>
                </h3>
              </div>
            </CardHeader>
            <ViewsOverTime
              height={350}
              data={[
                { month: 'Jan', views: 2400 },
                { month: 'Feb', views: 1398 },
                { month: 'Mar', views: 9800 },
                { month: 'Apr', views: 3908 },
                { month: 'May', views: 4800 },
                { month: 'Jun', views: 3800 },
                { month: 'Jul', views: 4300 },
                { month: 'Aug', views: 5000 },
                { month: 'Sep', views: 6000 },
                { month: 'Oct', views: 7000 },
                { month: 'Nov', views: 8000 },
                { month: 'Dec', views: 9000 },
              ]}
            />
          </Card>
        </div>
      </div>

      {/* --------------- LOYALTY FIRST LAYER --------------- */}
      <div className="mt-5 grid grid-cols-12 gap-4">
        {/* -------------- New Members -------------- */}
        <div className="col-span-12 md:col-span-7">
          <Card className="dark:bg-secondary h-full shadow-md">
            <CardHeader>
              <div className="flex items-start justify-between">
                <h3 className="text-lg font-semibold">Revenue Over Time</h3>

                <div className="flex flex-col items-center">
                  <div className="flex items-center">
                    <div className="mr-2 h-3 w-3 rounded-full bg-[#5585ec]" />
                    <h1 className="text-sm">Fixed</h1>
                  </div>
                  <div className="flex items-center">
                    <div className="mr-2 h-3 w-3 rounded-full bg-[#2563EB]" />
                    <h1 className="text-sm">Prepay</h1>
                  </div>
                  <div className="mt-2 flex items-center">
                    <div className="mr-2 h-3 w-3 rounded-full bg-[#202C88]" />
                    <h1 className="text-sm text-[#7DAEF4]">Min Spend</h1>
                  </div>
                </div>
              </div>
            </CardHeader>

            <VisitorRegionV2
              chartData={[
                { month: 'January', fixed: 220, prepay: 150, minSpend: 80 },
                { month: 'February', fixed: 300, prepay: 180, minSpend: 100 },
                { month: 'March', fixed: 280, prepay: 210, minSpend: 120 },
                { month: 'April', fixed: 260, prepay: 200, minSpend: 110 },
                { month: 'May', fixed: 310, prepay: 240, minSpend: 140 },
                { month: 'June', fixed: 350, prepay: 260, minSpend: 150 },
              ]}
              chartConfig={{
                fixed: { label: 'Fixed', color: '#5585ec' },
                prepay: { label: 'Prepay', color: '#2563EB' },
                minSpend: { label: 'Min Spend', color: '#202C88' },
              }}
            />
          </Card>
        </div>

        {/* -------------- Member Activity -------------- */}
        <div className="col-span-12 md:col-span-5">
          <Card className="dark:bg-secondary h-[450px] gap-0 shadow-md">
            <CardHeader>
              <div className="mb-4 flex items-start justify-between">
                <h3 className="text-xl font-semibold">
                  Reservation Type Breakdown
                </h3>

                <div className="flex flex-col items-end space-y-1">
                  <div className="flex items-center">
                    <div className="mr-2 h-3 w-3 rounded-full bg-[#2563EB]" />
                    <h1 className="text-[13px]">
                      VIP table{' '}
                      <span className="font-semibold">(20% / 2000)</span>
                    </h1>
                  </div>
                  <div className="flex items-center">
                    <div className="mr-2 h-3 w-3 rounded-full bg-[#202C88] leading-10" />
                    <h1 className="text-[13px] text-[#7DAEF4]">
                      Lounge <span className="font-semibold">(20% / 2000)</span>
                    </h1>
                  </div>
                  <div className="flex items-center">
                    <div className="mr-2 h-3 w-3 rounded-full bg-[#7DAEF4] leading-10" />
                    <h1 className="text-[13px] text-[#7DAEF4]">
                      Standing Area{' '}
                      <span className="font-semibold">(10% / 1000)</span>
                    </h1>
                  </div>
                </div>
              </div>
            </CardHeader>
            <GenderDonutChart
              data={[
                { name: 'VIP table', value: 400 },
                { name: 'Lounge', value: 300 },
                { name: 'Standing Area', value: 100 },
              ]}
              COLORS={['#2563EB', '#202C88', '#7DAEF4']}
            />
          </Card>
        </div>

        {/* -------------- Age Demographics -------------- */}
        <div className="col-span-12 md:col-span-6">
          <Card className="dark:bg-secondary h-[450px] w-full shadow-md">
            <CardHeader>
              <div className="flex items-center justify-start">
                <h3 className="text-xl font-semibold">Timeslot Occupancy</h3>
              </div>
            </CardHeader>
            <div className="flex-1">
              <VisitorAge
                data={[
                  { ageGroup: '5-6 PM', visitors: 120 },
                  { ageGroup: '6-7 PM', visitors: 200 },
                  { ageGroup: '7-8 PM', visitors: 150 },
                  { ageGroup: '8-9 PM', visitors: 90 },
                  { ageGroup: '9-10 PM', visitors: 70 },
                  { ageGroup: '10-11 PM', visitors: 170 },
                  { ageGroup: '11-12 PM', visitors: 140 },
                ]}
              />
            </div>
          </Card>
        </div>

        <div className="col-span-12 md:col-span-6">
          <div className="flex h-full flex-col gap-3">
            {/* Member Activity Card */}
            <Card className="dark:bg-secondary h-full w-full shadow-md">
              <CardHeader>
                <div className="flex items-center justify-start">
                  <h3 className="text-xl font-semibold">Member Activity</h3>
                </div>
              </CardHeader>

              <div className="flex-1">
                {/* SILVER */}
                <div className="mx-4 mt-2 flex items-start justify-between gap-4">
                  <h4 className="text-md mb-2 font-medium">Silver</h4>
                  <h4 className="text-md mb-2 font-medium">{activePercent}%</h4>
                </div>
                <div className="mx-4 flex flex-1 flex-col">
                  <div className="mb-2 h-3 w-full overflow-hidden rounded-full bg-gray-200">
                    <div
                      className="bg-primary h-full transition-all duration-500"
                      style={{ width: `${activePercent}%` }}
                    ></div>
                  </div>
                  <h4 className="text-md mb-2 font-medium">6000</h4>
                </div>

                {/* GOLD */}
                <div className="mx-4 mt-2 flex items-start justify-between">
                  <h4 className="text-md mb-2 font-medium">Gold</h4>
                  <h4 className="text-md mb-2 font-medium">
                    {inactivePercent}%
                  </h4>
                </div>
                <div className="mx-4 flex flex-1 flex-col">
                  <div className="mb-2 h-3 w-full overflow-hidden rounded-full bg-gray-200">
                    <div
                      className="bg-primary h-full transition-all duration-500"
                      style={{ width: `${inactivePercent}%` }}
                    ></div>
                  </div>
                  <h4 className="text-md mb-2 font-medium">2000</h4>
                </div>

                {/* PLATINUM */}
                <div className="mx-4 mt-2 flex items-start justify-between">
                  <h4 className="text-md mb-2 font-medium">Platinum</h4>
                  <h4 className="text-md mb-2 font-medium">{thirdPercent}%</h4>
                </div>
                <div className="mx-4 flex flex-1 flex-col">
                  <div className="mb-2 h-3 w-full overflow-hidden rounded-full bg-gray-200">
                    <div
                      className="bg-primary h-full transition-all duration-500"
                      style={{ width: `${thirdPercent}%` }}
                    ></div>
                  </div>
                  <h4 className="text-md mb-2 font-medium">2000</h4>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>

      <div className="mt-5 grid grid-cols-1 md:gap-4">
        <Card className="dark:bg-secondary gap-0 shadow-md">
          <CardHeader>
            <div className="mb-3 flex flex-col items-center gap-4 md:flex-row md:justify-between">
              <h3 className="ml-4 text-xl font-semibold">
                Reservation Transaction List
              </h3>
            </div>
          </CardHeader>

          <CardContent>
            <ReservationList />
          </CardContent>
        </Card>
      </div>

      <div className="mt-5 grid grid-cols-1 md:gap-4">
        <Card className="dark:bg-secondary gap-0 shadow-md">
          <CardHeader>
            <div className="mb-3 flex flex-col items-center gap-4 md:flex-row md:justify-between">
              <h3 className="ml-4 text-xl font-semibold">
                Staff Confirmations Log
              </h3>
            </div>
          </CardHeader>

          <CardContent>
            <StaffConfirmationsLog />
          </CardContent>
        </Card>
      </div>

      <Dialog open={openModal.value} onOpenChange={openModal.onToggle}>
        <DialogOverlay className="bg-opacity-30 fixed inset-0 flex items-center justify-center bg-white">
          <DialogContent>
            <DialogTitle>Create Program </DialogTitle>
            <div className="flex flex-col gap-4">
              <input
                type="text"
                placeholder="Organizer Name"
                className="z-10 rounded-md p-2 shadow-md"
              />
              <input
                type="email"
                placeholder="Email"
                className="z-10 rounded-md p-2 shadow-md"
              />
              <input
                type="tel"
                placeholder="Phone Number"
                className="z-10 rounded-md p-2 shadow-md"
              />
              <input
                type="text"
                placeholder="Address"
                className="z-10 rounded-md p-2 shadow-md"
              />
            </div>
            <div className="mt-4 flex justify-end">
              <Button
                onClick={openModal.onFalse}
                variant={'outline'}
                className="mr-2 cursor-pointer"
              >
                Cancel
              </Button>
              <Button onClick={openModal.onFalse} className="cursor-pointer">
                add Program
              </Button>
            </div>
          </DialogContent>
        </DialogOverlay>
      </Dialog>
    </>
  );
};

export default ReservationAnalyticsView;
