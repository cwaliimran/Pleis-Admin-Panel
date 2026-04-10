'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Dialog, DialogContent, DialogOverlay, DialogTitle } from '@/components/ui/dialog';
import { useBoolean } from '@/hooks/useBoolean';
import { GenderDonutChart, ViewsOverTime, VisitorAge } from '@/sections/invoices';
import ReservationStatsCard from '@/sections/invoices/ReservationCard';
import VisitorRegionV2 from '@/sections/invoices/visitorRegionv2';

import ReservationList from '../ReservationTransactionList';
import StaffConfirmationsLog from '../StaffConfirmation';
import { useGetReservationsAnalyticsQuery } from '@/store/Reducer/reservations-api';
import DashboardSkeleton from '@/sections/super-admin-dashboard/components/DashboardSkeleton';
import { useCompanySelection } from '@/app/common/header/company-selection-storage';

const ReservationAnalyticsView = ({ userType, global: isGlobal }: { global: boolean; userType: string }) => {

  const { organizerOrganizationIds } = useCompanySelection();

  const { data: dashboardRaw = {} as any, isLoading, isFetching } = useGetReservationsAnalyticsQuery({
     organizations: userType === 'organizer' ? organizerOrganizationIds : undefined,
  }, { refetchOnMountOrArgChange: true });

  const openModal = useBoolean();
  const userLevelStats = dashboardRaw?.data?.userLevelStats || [];

  if (isLoading || isFetching) {
    return <DashboardSkeleton />;
  }

  return (
    <>
      <div className="mt-5 grid grid-cols-1 gap-2 md:grid-cols-3 md:gap-x-4 md:gap-y-4 lg:grid-cols-4">
        {dashboardRaw?.data?.stats?.map((card: any, index: number) => (
          <ReservationStatsCard key={index} item={card} />
        ))}
      </div>

      <div className="mt-5 grid grid-cols-12 gap-4">
        {/* --------------- Points activity over time --------------- */}
        <div className="col-span-12 md:col-span-12">
          <Card className="dark:bg-secondary col-span-12 shadow-md md:col-span-6">
            <CardHeader>
              <h3 className="text-md mb-3 font-medium">Reservation Volume Over Time</h3>
              {/* <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold">+10%</h3>
                <h3 className="text-md font-[400] text-gray-400">
                  Last 90 Days <span className="ml-1 text-green-500">+10%</span>
                </h3>
              </div> */}
            </CardHeader>
            <ViewsOverTime
              height={350}
              data={
                (dashboardRaw?.data?.reservationsOverTime || []).map((item: any) => ({
                  month: item.month,
                  views: item.value,
                }))
              }
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
              chartData={
                dashboardRaw?.data?.revenueOverTime?.map((item: any) => ({
                  month: item.month,
                  fixed: item.fixedPrice,
                  prepay: item.prepayOption,
                  minSpend: item.minimumSpendOnLocation,
                })) || []
              }
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
          <Card className="dark:bg-secondary h-[500px] gap-0 shadow-md">
            <CardHeader>
              <div className="mb-4 flex items-start justify-between">
                <h3 className="text-xl font-semibold">Reservation Type Breakdown</h3>

                <div className="flex flex-col items-end space-y-1">
                  {dashboardRaw?.data?.reservationTypes
                    ?.filter((type: any) => type.percent >= 5)
                    ?.slice(0, 5)
                    ?.map((type: any, idx: number) => (
                      <div className="flex items-center" key={type.reservationType}>
                        <div
                          className="mr-2 h-3 w-3 rounded-full"
                          style={{ backgroundColor: ['#2563EB', '#202C88', '#7DAEF4', '#5585ec', '#A0C4FF'][idx % 5] }}
                        />
                        <h1 className={`text-[13px] ${idx > 0 ? 'text-[#7DAEF4]' : ''}`}>
                          {type.reservationType}{' '}
                          <span className="font-semibold">
                            ({type.percent}% / {type.count})
                          </span>
                        </h1>
                      </div>
                    ))}
                </div>
              </div>
            </CardHeader>
            <GenderDonutChart
              data={(() => {
                const types = dashboardRaw?.data?.reservationTypes || [];
                const significant = types.filter((t: any) => t.percent >= 5);
                const other = types.filter((t: any) => t.percent < 5);
                const chartData = significant.map((t: any) => ({ name: t.reservationType, value: t.count }));
                if (other.length > 0) {
                  const totalOther = other.reduce((sum: number, t: any) => sum + t.count, 0);
                  chartData.push({ name: 'Other', value: totalOther });
                }
                return chartData;
              })()}
              COLORS={['#2563EB', '#202C88', '#7DAEF4', '#5585ec', '#A0C4FF', '#94A3B8']}
            />
          </Card>
        </div>

        {/* -------------- Timeslot Occupancy & Member Activity (Equal Height) -------------- */}
        <div className="col-span-12 grid grid-cols-12 items-start gap-4">
          <div className="col-span-12 md:col-span-6">
            <Card className="dark:bg-secondary w-full shadow-md">
              <CardHeader>
                <div className="flex items-center justify-start">
                  <h3 className="text-xl font-semibold">Timeslot Occupancy</h3>
                </div>
              </CardHeader>
              <VisitorAge
                data={
                  (dashboardRaw?.data?.reservationsByHour || []).map((item: any) => ({
                    ageGroup: item.time,
                    visitors: item.count,
                  }))
                }
              />
            </Card>
          </div>

          <div className="col-span-12 md:col-span-6">
            <Card className="dark:bg-secondary w-full shadow-md">
              <CardHeader>
                <div className="flex items-center justify-start">
                  <h3 className="text-xl font-semibold">Member Activity</h3>
                </div>
              </CardHeader>

              <div className="flex-1 pb-4">
                {userLevelStats.map((level: any) => (
                  <div key={level.levelName} className="mb-2">
                    <div className="mx-4 mt-2 flex items-start justify-between gap-4">
                      <h4 className="text-md mb-2 font-medium">{level.levelName}</h4>
                      <h4 className="text-md mb-2 font-medium">{level.percent}%</h4>
                    </div>
                    <div className="mx-4 flex flex-1 flex-col">
                      <div className="mb-2 h-3 w-full overflow-hidden rounded-full bg-gray-200">
                        <div className="bg-primary h-full transition-all duration-500" style={{ width: `${level.percent}%` }} />
                      </div>
                      <h4 className="text-md mb-2 font-medium">{level.count}</h4>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </div>

      <div className="mt-5 grid grid-cols-1 md:gap-4">
        <Card className="dark:bg-secondary gap-0 shadow-md">
          <CardHeader>
            <div className="mb-3 flex flex-col items-center gap-4 md:flex-row md:justify-between">
              <h3 className="ml-4 text-xl font-semibold">Reservation Transaction List</h3>
            </div>
          </CardHeader>

          <CardContent>
            <ReservationList userType={userType} />
          </CardContent>
        </Card>
      </div>

      <div className="mt-5 grid grid-cols-1 md:gap-4">
        <Card className="dark:bg-secondary gap-0 shadow-md">
          <CardHeader>
            <div className="mb-3 flex flex-col items-center gap-4 md:flex-row md:justify-between">
              <h3 className="ml-4 text-xl font-semibold">Staff Confirmations Log</h3>
            </div>
          </CardHeader>

          <CardContent>
            <StaffConfirmationsLog userType={userType} />
          </CardContent>
        </Card>
      </div>

      <Dialog open={openModal.value} onOpenChange={openModal.onToggle}>
        <DialogOverlay className="bg-opacity-30 fixed inset-0 flex items-center justify-center bg-white">
          <DialogContent>
            <DialogTitle>Create Program </DialogTitle>
            <div className="flex flex-col gap-4">
              <input type="text" placeholder="Organizer Name" className="z-10 rounded-md p-2 shadow-md" />
              <input type="email" placeholder="Email" className="z-10 rounded-md p-2 shadow-md" />
              <input type="tel" placeholder="Phone Number" className="z-10 rounded-md p-2 shadow-md" />
              <input type="text" placeholder="Address" className="z-10 rounded-md p-2 shadow-md" />
            </div>
            <div className="mt-4 flex justify-end">
              <Button onClick={openModal.onFalse} variant={'outline'} className="mr-2 cursor-pointer">
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
