'use client';

import { Card, CardHeader } from '@/components/ui/card';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import {
  EventPerformanceComparison,
  FollowerCount,
  GenderDonutChart,
  MostViewedEvent,
  TopPerformaningEvents,
  Trend,
  ViewsOverTime,
  VisitorAge,
  VisitorInterest,
  VisitorRegion,
} from '@/sections/invoices';
import { useGetDashboardQuery } from '@/store/Reducer/dashboard';
import { useState } from 'react';
import DashboardSkeleton from '../super-admin-dashboard/components/DashboardSkeleton';
import DashboardStatsCard from '../super-admin-dashboard/components/DashboardStatsCard';
import TransactionHistoryDashboardWidget from '../transactions/transaction-history/transaction-history-dashboard-widget';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
interface StatItem {
  key: string;
  title: string;
  value: number;
  growth: number;
  subFilters: { key: string; label: string }[];
  selectedSubFilter: string;
}

const OrganizerDashboard = () => {
  const [active, setActive] = useState('all');

  const dateFilterMap: Record<string, string> = {
    today: 'today',
    week: 'thisWeek',
    month: 'thisMonth',
    all: 'all',
  };

  const {
    data: dashboardRaw = {} as any,
    isLoading,
    isFetching,
  } = useGetDashboardQuery({
    dateFilter: dateFilterMap[active] ?? 'all',
  });

  // ---- Safely extract all sections from the API response ----
  const dashboard = dashboardRaw?.data ?? dashboardRaw ?? {};

  const stats: StatItem[] = dashboard.stats ?? [];

  // ---- Loading state ----
  if (isLoading || isFetching) {
    return <DashboardSkeleton />;
  }

  return (
    <div>
      <div className="mx-1 mt-5 pb-12 md:mx-4">
        {/* ---------------------------------------------------------------- */}
        {/* Top-level date filter (wiring deferred — UI only for now)        */}
        {/* ---------------------------------------------------------------- */}
        <div className="flex flex-col-reverse gap-2 md:flex-row md:items-center md:justify-end">
          <div className="flex flex-col-reverse justify-end gap-2 md:flex-row md:items-center">
            <Tabs value={active} onValueChange={setActive} className="hidden w-full justify-end md:block">
              <TabsList className="flex items-center gap-2 rounded-full border bg-[#EBEBEB] p-1 dark:border-white dark:bg-black">
                {['today', 'week', 'month', 'all'].map((val) => (
                  <TabsTrigger
                    key={val}
                    value={val}
                    className={cn('text-md relative z-10 cursor-pointer rounded-full px-4 py-2 font-semibold capitalize transition-colors')}
                  >
                    {val === 'all' ? 'All' : val.charAt(0).toUpperCase() + val.slice(1)}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
            <div className="block md:hidden">
              <Select value={active} onValueChange={setActive}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select timeframe" />
                </SelectTrigger>
                <SelectContent className="dark:bg-secondary">
                  {['today', 'week', 'month', 'all'].map((val) => (
                    <SelectItem key={val} value={val} className="capitalize">
                      {val === 'all' ? 'All' : val.charAt(0).toUpperCase() + val.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* ---------------------------------------------------------------- */}
        {/* Stats Cards                                                      */}
        {/* ---------------------------------------------------------------- */}
        <div className="mt-5 grid grid-cols-1 gap-2 md:grid-cols-2 md:gap-x-4 md:gap-y-4 lg:grid-cols-3 xl:grid-cols-4">
          {stats.map((stat) => (
            <DashboardStatsCard key={stat.key} stat={stat} />
          ))}
        </div>

        {/* event performance comparsion */}
        <Card className="dark:bg-secondary mt-5 shadow-lg lg:mt-10">
          <CardHeader>
            <div className="items-center justify-between lg:flex">
              <h3 className="text-xl font-semibold">Event Performance Comparison</h3>
              <div className="flex flex-col lg:items-center">
                <div className="flex items-center">
                  <div className="mr-2 h-2 w-2 rounded-full bg-black" />
                  <h1 className="text-[14px] leading-6">Tickets Sold</h1>
                </div>
                <div className="mt-2 flex items-center">
                  <div className="mr-2 h-2 w-2 rounded-full bg-[#7DAEF4] leading-10" />
                  <h1 className="text-[14px] text-[#7DAEF4]">Revenue</h1>
                </div>
              </div>
            </div>
          </CardHeader>
          <EventPerformanceComparison
            chartData={[
              { month: 'January', desktop: 186, mobile: 80 },
              { month: 'February', desktop: 305, mobile: 200 },
              { month: 'March', desktop: 237, mobile: 120 },
              { month: 'April', desktop: 73, mobile: 190 },
              { month: 'May', desktop: 209, mobile: 130 },
              { month: 'June', desktop: 214, mobile: 140 },
            ]}
            chartConfig={{
              desktop: { label: 'Tickets Sold', color: '#2563eb' },
              mobile: { label: 'Revenue', color: '#7DAEF4' },
            }}
          />
        </Card>
        <div className="mt-5 grid gap-2 md:grid-cols-3 md:gap-x-7 md:gap-y-4">
          <div>
            {/* visitor age demographics */}
            <Card className="dark:bg-secondary h-[450px] w-full shadow-lg">
              <CardHeader>
                <div className="flex items-center justify-start">
                  <h3 className="text-xl font-semibold">Visitor Age Demographics</h3>
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
                    <span className="text-xl font-bold text-black">66%</span> visitors are 45-55 years old
                  </p>
                </div>
              </div>
            </Card>
          </div>

          <div>
            {/* Visitor Region Overview */}
            <Card className="dark:bg-secondary h-[450px] shadow-lg">
              <CardHeader>
                <div className="items-start justify-between md:flex">
                  <h3 className="text-xl font-semibold">Visitor Region Overview</h3>
                  <div className="flex flex-col md:items-center">
                    <div className="flex items-center">
                      <div className="mr-2 h-2 w-2 rounded-full bg-[#2563EB]" />
                      <h1 className="text-[14px] leading-6">Males</h1>
                    </div>
                    <div className="mt-2 flex items-center">
                      <div className="mr-2 h-2 w-2 rounded-full bg-[#202C88] leading-10" />
                      <h1 className="text-[14px] text-[#7DAEF4]">Females</h1>
                    </div>
                    <div className="mt-2 flex items-center">
                      <div className="mr-2 h-2 w-2 rounded-full bg-[#7DAEF4] leading-10" />
                      <h1 className="text-md text-[#7DAEF4]">Females</h1>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <VisitorRegion
                chartData={[
                  { month: 'January', males: 186, females: 80, others: 50 },
                  { month: 'February', males: 305, females: 200, others: 100 },
                  { month: 'March', males: 237, females: 120, others: 70 },
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
          </div>
          <div>
            {/* Visitor Gender Analytics */}
            <Card className="dark:bg-secondary h-[450px] !pb-0 shadow-lg">
              <CardHeader>
                <div className="items-start justify-between md:flex">
                  <h3 className="text-xl font-semibold">Visitor Gender Analytics</h3>
                  <div className="flex flex-col md:items-center">
                    <div className="flex items-center">
                      <div className="mr-2 h-2 w-2 rounded-full bg-[#2563EB]" />
                      <h1 className="text-[14px] leading-6">Males</h1>
                    </div>
                    <div className="mt-2 flex items-center">
                      <div className="mr-2 h-2 w-2 rounded-full bg-[#202C88] leading-10" />
                      <h1 className="text-[14px] text-[#7DAEF4]">Females</h1>
                    </div>
                    <div className="mt-2 flex items-center">
                      <div className="mr-2 h-2 w-2 rounded-full bg-[#7DAEF4] leading-10" />
                      <h1 className="text-md text-[#7DAEF4]">Females</h1>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <GenderDonutChart
                size={120}
                data={[
                  { name: 'Males', value: 400 },
                  { name: 'Females', value: 300 },
                  { name: 'Others', value: 100 },
                ]}
                COLORS={['#2563EB', '#202C88', '#7DAEF4']}
              />
            </Card>
          </div>
        </div>
        <div className="mt-5 grid grid-cols-12 gap-4">
          {/* Trends */}
          <Card className="dark:bg-secondary col-span-12 h-[450px] shadow-lg md:col-span-7">
            <CardHeader>
              <div className="items-center justify-between md:flex">
                <div className="flex flex-col items-start">
                  <h3 className="text-xl font-semibold">Trends</h3>
                  <div className="flex flex-col items-center">
                    <div className="flex items-center">
                      <div className="mr-2 h-2 w-2 rounded-full bg-[#2563EB]" />
                      <h1 className="text-[14px] leading-6">This Month</h1>
                    </div>
                    <div className="mt-2 flex items-center">
                      <div className="mr-2 h-2 w-2 rounded-full bg-[#7B7E91] leading-10" />
                      <h1 className="text-[14px] text-[#7B7E91]">Last Month</h1>
                    </div>
                  </div>
                </div>
                <div className="mt-2 md:mt-0">
                  <Select defaultValue="totalSales">
                    <SelectTrigger>
                      <SelectValue placeholder="" />
                    </SelectTrigger>
                    <SelectContent className="dark:bg-secondary">
                      <SelectGroup className="w-auto">
                        <SelectLabel>Sale</SelectLabel>
                        <SelectItem value="salesTrend">Total Sales</SelectItem>
                        <SelectItem value="revenueTrend">Total Revenue</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            <Trend
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
          </Card>
          {/* visitor interest */}
          <Card className="dark:bg-secondary col-span-12 h-[450px] shadow-lg md:col-span-5">
            <CardHeader>
              <div className="justify-between md:flex md:items-center">
                <h3 className="text-xl font-semibold">Visitor Interest</h3>
                <div className="flex flex-col md:items-center">
                  <div className="flex items-center">
                    <div className="mr-2 h-2 w-2 rounded-full bg-[#020617]" />
                    <h1 className="text-[14px] leading-6">Males</h1>
                  </div>
                  <div className="mt-2 flex items-center">
                    <div className="mr-2 h-2 w-2 rounded-full bg-[#202C88] leading-10" />
                    <h1 className="text-[14px] text-[#202C88]">Females</h1>
                  </div>
                </div>
              </div>
            </CardHeader>
            <VisitorInterest
              chartData={[
                { month: 'January', males: 186, females: 80 },
                { month: 'February', males: 305, females: 200 },
                { month: 'March', males: 237, females: 120 },
                { month: 'April', males: 73, females: 190 },
                { month: 'May', males: 209, females: 130 },
                { month: 'June', males: 214, females: 140 },
              ]}
              chartConfig={{
                males: { label: 'Males', color: '#2563EB' },
                females: { label: 'Females', color: '#202C88' },
              }}
            />
          </Card>
        </div>
        <div className="mt-5 grid grid-cols-12 gap-4">
          {/* Views Over Time */}
          <Card className="dark:bg-secondary col-span-12 h-[450px] shadow-lg md:col-span-6">
            <CardHeader>
              <div className="lgitems-center justify-between lg:flex">
                <h3 className="text-xl font-semibold">Views Over Time</h3>
                <div className="mt-2 flex flex-col lg:mt-0 lg:items-center">
                  <Select defaultValue="newEvent">
                    <SelectTrigger>
                      <SelectValue placeholder="" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup className="w-auto">
                        <SelectLabel>Event</SelectLabel>
                        <SelectItem value="newEvent">New Event</SelectItem>
                        <SelectItem value="otherEvent">Other Event</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            <ViewsOverTime
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
          {/* most viewed event */}
          <Card className="dark:bg-secondary col-span-12 h-[450px] shadow-lg md:col-span-6">
            <CardHeader>
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold">Most Viewed Event</h3>
              </div>
            </CardHeader>

            <MostViewedEvent
              chartData={[
                { month: 'January', search: 189 },
                { month: 'February', search: 305 },
                { month: 'March', search: 237 },
                { month: 'April', search: 73 },
                { month: 'May', search: 209 },
                { month: 'June', search: 214 },
              ]}
              chartConfig={{
                search: { label: 'Search', color: '#2563EB' },
              }}
            />
          </Card>
        </div>
        <div className="mt-5 grid grid-cols-12 gap-4">
          {/* Follower Count */}
          <Card className="dark:bg-secondary col-span-12 h-[550px] shadow-lg md:col-span-6">
            <CardHeader>
              <div className="justify-between md:items-center lg:flex">
                <h3 className="text-xl font-semibold">Follower Count</h3>
                <div className="mt-2 flex flex-col lg:mt-0 lg:items-center">
                  <Select defaultValue="users">
                    <SelectTrigger>
                      <SelectValue placeholder="" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup className="w-auto">
                        <SelectLabel>Event</SelectLabel>
                        <SelectItem value="users">Users</SelectItem>
                        <SelectItem value="otherUsers">Other Users</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            <FollowerCount
              data={[
                { month: 'Jan', followers: 1200 },
                { month: 'Feb', followers: 1500 },
                { month: 'Mar', followers: 1300 },
                { month: 'Apr', followers: 1000 },
                { month: 'May', followers: 1800 },
                { month: 'Jun', followers: 2500 },
                { month: 'Jul', followers: 3000 },
                { month: 'Aug', followers: 3500 },
                { month: 'Sep', followers: 4000 },
                { month: 'Oct', followers: 4500 },
                { month: 'Nov', followers: 5000 },
                { month: 'Dec', followers: 5500 },
              ]}
            />
          </Card>
          {/* Top Performing Events */}
          <Card className="dark:bg-secondary col-span-12 h-[550px] shadow-lg md:col-span-6">
            <CardHeader>
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold">Top Performing Events</h3>
              </div>
            </CardHeader>
            <TopPerformaningEvents />
          </Card>
        </div>

        {/* ---------------------------------------------------------------- */}
        {/* Transaction History                                              */}
        {/* ---------------------------------------------------------------- */}
        <div className="mt-5 grid grid-cols-12">
          <div className="col-span-12">
            <TransactionHistoryDashboardWidget userType="organizer" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrganizerDashboard;
