import React from 'react';
import { GenderDonutChart, Trend, VisitorAge } from '../invoices';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import TicketPerformanceChart from './ticketPerformance';
import { eventTabForAnalytics } from './data';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
// import { Badge, Calendar } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const EventAnalytics = () => {
  const [active, setActive] = React.useState('fromSales');
  return (
    <div className="grid grid-cols-12 gap-4">
      <div className="col-span-12 lg:col-span-4">
        {/* Engagement */}
        <Card className="mb-3 shadow-md dark:bg-[#171717]">
          <CardHeader>
            <h3 className="text-xl font-semibold">Engagement</h3>
          </CardHeader>
          <CardContent className="">
            <div className="tex-md flex items-center justify-between">
              <h1 className="font-semibold text-slate-500">Clicks</h1>
              <h1 className="text-slate-500">2,300</h1>
            </div>
            <div className="mt-2 flex items-start justify-between gap-4">
              <div className="flex flex-1 flex-col">
                <div className="mb-2 h-2 w-full overflow-hidden rounded-full bg-gray-200">
                  <div className="bg-primary h-full w-5/6 transition-all duration-500"></div>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <h1 className="font-semibold text-slate-500">Clicks</h1>
              <h1 className="text-slate-500">2,300</h1>
            </div>
            <div className="mt-2 flex items-start justify-between gap-4">
              <div className="flex flex-1 flex-col">
                <div className="mb-2 h-2 w-full overflow-hidden rounded-full bg-gray-200">
                  <div className="bg-primary h-full w-5/6 transition-all duration-500"></div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        {/* Views */}
        <Card className="mb-3 pb-0 shadow-md dark:bg-[#171717]">
          <CardHeader>
            <h3 className="text-xl font-semibold"> Views</h3>
          </CardHeader>
          <CardContent className="!p-0">
            <VisitorAge
              direction="horizontal"
              data={[
                { ageGroup: 'Mon', visitors: 120 },
                { ageGroup: 'Tue', visitors: 120 },
                { ageGroup: 'Wed', visitors: 200 },
                { ageGroup: 'Thu', visitors: 150 },
                { ageGroup: 'Fri', visitors: 90 },
                { ageGroup: 'Sat', visitors: 70 },
                { ageGroup: 'Sun', visitors: 70 },
              ]}
            />
          </CardContent>
          <div className="mx-4 mb-2">
            <p className="text-muted-foreground text-[12px] font-medium">
              <span className="text-xl font-bold text-black dark:text-white">
                30%
              </span>{' '}
              Sales performance is 30% better compare to last month
            </p>
          </div>
          {/* </CardHeader> */}
        </Card>

        {/* Views */}
        <Card className="mb-3 pb-0 shadow-md dark:bg-[#171717]">
          <CardHeader>
            <h3 className="text-xl font-semibold">Age Group</h3>
          </CardHeader>
          <CardContent className="!p-0">
            <VisitorAge
              direction="horizontal"
              data={[
                { ageGroup: '11-20', visitors: 120 },
                { ageGroup: '21-30', visitors: 170 },
                { ageGroup: '31-40', visitors: 200 },
                { ageGroup: '41-50', visitors: 150 },
                { ageGroup: '51-60', visitors: 90 },
                { ageGroup: '61-70', visitors: 70 },
                { ageGroup: '71+', visitors: 70 },
              ]}
            />
          </CardContent>
        </Card>

        {/* Gender Analytic */}
        <Card className="pb-0 shadow-md dark:bg-[#171717]">
          <CardHeader className="">
            <h3 className="text-xl font-semibold lg:text-center">
              {' '}
              Gender Analytics
            </h3>

            <CardContent className="p-0">
              <GenderDonutChart
                size={120}
                data={[
                  { name: 'Males', value: 60 },
                  { name: 'Females', value: 20 },
                  { name: 'Others', value: 20 },
                ]}
                COLORS={['#2563EB', '#202C88', '#7DAEF4']}
              />
            </CardContent>
            <div className="flex flex-col">
              <div className="flex justify-between px-4">
                <div className="mb-2 flex items-center">
                  <div className="mr-2 h-3 w-3 rounded-full bg-[#2563EB]" />
                  <h1 className="text-md leading-6">Old</h1>
                </div>
                <h1>300</h1>
              </div>
              <div className="flex justify-between px-4">
                <div className="mt-2 flex text-center">
                  <div className="mr-2 h-3 w-3 rounded-full bg-[#202C88] leading-10" />
                  <h1 className="text-md text-[#7DAEF4]">Others</h1>
                </div>
                <h1>100</h1>
              </div>
              <div className="flex justify-between px-4">
                <div className="mt-2 flex items-center">
                  <div className="mr-2 h-3 w-3 rounded-full bg-[#7DAEF4] leading-10" />
                  <h1 className="text-md text-[#7DAEF4]">New</h1>
                </div>
                <h1>400</h1>
              </div>
            </div>
          </CardHeader>
        </Card>
      </div>
      <div className="col-span-12 lg:col-span-8">
        {/* Ticket Performance  */}
        <Card className="h-[450px] shadow-md dark:bg-[#171717]">
          <CardHeader>
            {' '}
            <h3 className="text-xl font-semibold"> Ticket Performance </h3>{' '}
          </CardHeader>
          <CardContent>
            <TicketPerformanceChart
              data={[
                { day: 'Mon', value: 3000 },
                { day: 'Tue', value: 2000 },
                { day: 'Wed', value: 4000 },
                { day: 'Thu', value: 3500 },
                { day: 'Fri', value: 5000 },
                { day: 'Sat', value: 6500 },
                { day: 'Sun', value: 5500 },
              ]}
            />
          </CardContent>
        </Card>
        {/* Total Revenue */}
        <Card className="mt-10 h-[500px] shadow-md dark:bg-[#171717]">
          <CardHeader>
            <div className="flex flex-col justify-between gap-4 md:flex-row lg:items-center">
              <div>
                <h3 className="text-xl font-semibold"> Total Revenue </h3>
                <h3 className="text-2xl font-bold">12, 026e</h3>
              </div>
              <div>
                <div className="w-full text-end">
                  {/* Show only on small screens */}
                  <div className="mb-4 block md:hidden">
                    <Select value={active} onValueChange={setActive}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select tab" />
                      </SelectTrigger>
                      <SelectContent>
                        {eventTabForAnalytics.map((tab: any) => (
                          <SelectItem key={tab.value} value={tab.value}>
                            {tab.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  {/* Show only on medium and larger screens */}
                  <Tabs
                    value={active}
                    onValueChange={setActive}
                    defaultValue="all"
                    className="hidden w-full md:block"
                  >
                    <TabsList className="flex items-end gap-2 rounded-full border bg-[#EBEBEB] p-1 dark:border-white dark:bg-black">
                      {eventTabForAnalytics.map((tab: any) => (
                        <TabsTrigger
                          key={tab.value}
                          value={tab.value}
                          className={cn(
                            'relative z-10 cursor-pointer rounded-full py-2 text-sm font-semibold transition-colors',
                            active === tab.value
                              ? 'bg-white dark:bg-gray-800'
                              : 'text-muted-foreground'
                          )}
                        >
                          {tab.label}
                        </TabsTrigger>
                      ))}
                    </TabsList>
                  </Tabs>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Trend
              previousLineStyle="solid"
              data={[
                { month: 'Jan', current: 2400, previous: 2000 },
                { month: 'Feb', current: 1398, previous: 1500 },
                { month: 'Mar', current: 9800, previous: 6000 },
                { month: 'Apr', current: 3908, previous: 3000 },
                { month: 'May', current: 4800, previous: 3500 },
                { month: 'Jun', current: 3800, previous: 3200 },
                { month: 'Jul', current: 4300, previous: 3400 },
              ]}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EventAnalytics;
