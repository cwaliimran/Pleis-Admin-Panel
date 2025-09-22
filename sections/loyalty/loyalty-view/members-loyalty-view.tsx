'use client';

import { Card, CardHeader } from '@/components/ui/card';
import { InvoiceCard, ViewsOverTime } from '@/sections/invoices';
import { loyaltyCardHeaderData } from '@/sections/loyalty/data';

const MembersLoyaltyView = () => {
  return (
    <>
      {/* --------------- LOYALTY TOP STATS ---------------*/}
      <div className="mt-5 grid grid-cols-1 gap-2 md:grid-cols-3 md:gap-x-4 md:gap-y-4 lg:grid-cols-4">
        {loyaltyCardHeaderData?.map((card: any, index) => (
          <InvoiceCard key={index} item={card} />
        ))}
      </div>

      {/* --------------- LOYALTY FIRST LAYER --------------- */}
      <div className="mt-5 grid grid-cols-12 gap-4">
        {/* -------------- Spendings -------------- */}
        <div className="col-span-12 md:col-span-6">
          <Card className="dark:bg-secondary col-span-12 shadow-md md:col-span-6">
            <CardHeader>
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold">Spendings</h3>
              </div>
            </CardHeader>

            <ViewsOverTime
              height={330}
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

        {/* -------------- Age Demographics -------------- */}
        {/* <div className="col-span-12 md:col-span-4">
          <Card className="dark:bg-secondary h-[450px] w-full shadow-md">
            <CardHeader>
              <div className="flex items-center justify-start">
                <h3 className="text-xl font-semibold">Age Demographics</h3>
              </div>
            </CardHeader>
            <div className="flex-1">
              <VisitorAge
                data={[
                  { ageGroup: '18-24', visitors: 120 },
                  { ageGroup: '25-34', visitors: 200 },
                  { ageGroup: '35-44', visitors: 150 },
                  { ageGroup: '45-54', visitors: 90 },
                  { ageGroup: '55+', visitors: 70 },
                ]}
              />
              <div className="mx-4 mt-4">
                <p className="text-muted-foreground text-sm font-medium">
                  <span className="text-xl font-bold text-black">66%</span>{' '}
                  visitors are 45-55 years old
                </p>
              </div>
            </div>
          </Card>
        </div> */}

        {/* -------------- Location -------------- */}
        {/* <div className="col-span-12 md:col-span-4">
          <Card className="dark:bg-secondary h-[450px] shadow-md">
            <CardHeader>
              <div className="flex items-start justify-between">
                <h3 className="text-xl font-semibold">Location</h3>

                <div className="flex flex-col items-end space-y-1">
                  <div className="flex items-center">
                    <div className="mr-2 h-3 w-3 rounded-full bg-[#2563EB]" />
                    <h1 className="text-sm">Males</h1>
                  </div>
                  <div className="flex items-center">
                    <div className="mr-2 h-3 w-3 rounded-full bg-[#202C88]" />
                    <h1 className="text-sm text-[#7DAEF4]">Females</h1>
                  </div>
                  <div className="flex items-center">
                    <div className="mr-2 h-3 w-3 rounded-full bg-[#7DAEF4]" />
                    <h1 className="text-sm text-[#7DAEF4]">Other</h1>
                  </div>
                </div>
              </div>
            </CardHeader>
            <VisitorRegion
              chartData={[
                { month: 'Jan', males: 186, females: 80, others: 50 },
                { month: 'Feb', males: 305, females: 200, others: 100 },
                { month: 'Mar', males: 237, females: 120, others: 70 },
                { month: 'April', males: 73, females: 190, others: 60 },
                { month: 'May', males: 209, females: 130, others: 90 },
                { month: 'June', males: 214, females: 140, others: 80 },
              ]}
              chartConfig={{
                males: { label: 'Males', color: '#2563eb' },
                females: { label: 'Females', color: '#202C88' },
                others: { label: 'Others', color: '#7DAEF4' },
              }}
            />
          </Card>
        </div> */}

        {/* -------------- Gender Analytics -------------- */}
        {/* <div className="col-span-12 md:col-span-4">
          <Card className="dark:bg-secondary h-[450px] gap-0 shadow-md">
            <CardHeader>
              <div className="mb-4 flex items-start justify-between">
                <h3 className="text-xl font-semibold"> Gender Analytics</h3>

                <div className="flex flex-col items-end space-y-1">
                  <div className="flex items-center">
                    <div className="mr-2 h-3 w-3 rounded-full bg-[#2563EB]" />
                    <h1 className="text-[13px]">
                      Females{' '}
                      <span className="font-semibold">(20% / 2000)</span>
                    </h1>
                  </div>
                  <div className="flex items-center">
                    <div className="mr-2 h-3 w-3 rounded-full bg-[#202C88] leading-10" />
                    <h1 className="text-[13px] text-[#7DAEF4]">
                      Males <span className="font-semibold">(20% / 2000)</span>
                    </h1>
                  </div>
                  <div className="flex items-center">
                    <div className="mr-2 h-3 w-3 rounded-full bg-[#7DAEF4] leading-10" />
                    <h1 className="text-[13px] text-[#7DAEF4]">
                      Others <span className="font-semibold">(10% / 1000)</span>
                    </h1>
                  </div>
                </div>
              </div>
            </CardHeader>
            <GenderDonutChart
              data={[
                { name: 'Males', value: 400 },
                { name: 'Females', value: 300 },
                { name: 'Others', value: 100 },
              ]}
              COLORS={['#2563EB', '#202C88', '#7DAEF4']}
            />
          </Card>
        </div> */}
      </div>
    </>
  );
};

export default MembersLoyaltyView;
