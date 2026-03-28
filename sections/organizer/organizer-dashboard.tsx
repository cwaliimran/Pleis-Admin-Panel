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
import { useMemo, useState } from 'react';
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
  const [trendType, setTrendType] = useState<'salesTrend' | 'revenueTrend'>('salesTrend');

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

  const GENDER_COLORS: Record<string, string> = { Males: '#2563EB', Females: '#202C88', Others: '#7DAEF4' };
  const genderAnalytics: { name: string; count: number; percent: number }[] =
    dashboard?.usersDashboardAnalyticsOrganizer?.genderAnalytics ?? [];
  const totalGenderCount = genderAnalytics.reduce((sum: number, g: any) => sum + (g.count ?? 0), 0);

  // ---- Trends ----
  const trendRaw = dashboard?.trends?.[trendType] ?? [];
  const currentYear = trendRaw[0]?.year;
  const previousYear = trendRaw[1]?.year;
  const trendChartData = useMemo(() => {
    const currentData: any[] = trendRaw[0]?.data ?? [];
    const previousData: any[] = trendRaw[1]?.data ?? [];
    return currentData.map((item: any, i: number) => ({
      month: item?.month,
      current: item?.total ?? 0,
      previous: previousData[i]?.total ?? 0,
    }));
  }, [trendRaw]);

  const interestPerCategory: { category: string; males: number; females: number }[] =
    dashboard?.interestPerCategory?.interestPerCategory ?? [];

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
                  <div className="mr-2 h-2 w-2 rounded-full bg-[#2563eb]" />
                  <h1 className="text-[14px] leading-6 text-[#2563eb]">Tickets Sold</h1>
                </div>
                <div className="mt-2 flex items-center">
                  <div className="mr-2 h-2 w-2 rounded-full bg-[#7DAEF4]" />
                  <h1 className="text-[14px] text-[#7DAEF4]">Revenue</h1>
                </div>
              </div>
            </div>
          </CardHeader>
          <EventPerformanceComparison
            chartData={(dashboard?.eventPerformanceComparision ?? []).map((item: any) => ({
              month: item?.month,
              desktop: item?.tickets,
              mobile: item?.revenue,
            }))}
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
                  data={(dashboard?.usersDashboardAnalyticsOrganizer?.ageDemographics ?? []).map((item: any) => ({
                    ageGroup: item?.ageGroup,
                    visitors: item?.total,
                  }))}
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
            <Card className="dark:bg-secondary h-[450px] shadow-md">
              <CardHeader>
                <div className="items-start justify-between md:flex">
                  <h3 className="text-xl font-semibold"> Visitor Region Overview</h3>
                  <div className="flex flex-col justify-start md:items-center md:justify-center">
                    {[
                      { label: 'Males', color: '#2563EB' },
                      { label: 'Females', color: '#202C88' },
                      { label: 'Other', color: '#7DAEF4' },
                    ].map((item) => (
                      <div key={item.label} className="mt-2 flex items-center first:mt-0">
                        <div className="mr-2 h-2 w-2 rounded-full" style={{ backgroundColor: item.color }} />
                        <h1 className="text-[14px]" style={{ color: item.color }}>
                          {item.label}
                        </h1>
                      </div>
                    ))}
                  </div>
                </div>
              </CardHeader>
              <VisitorRegion
                chartData={dashboard?.usersDashboardAnalyticsOrganizer?.regionOverview?.map((item : any ) => ({
                  month: item?.region,
                  males: item?.males,
                  females: item?.females,
                  others: item?.others,
                }))}
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
                <div className="items-start justify-between lg:flex">
                  <h3 className="text-xl font-semibold">Gender Analytics</h3>
                  <div className="mt-2 flex flex-col items-start rounded-md md:mt-0 md:gap-2 lg:gap-3">
                    {genderAnalytics.map((g) => (
                      <div key={g.name} className="flex w-full items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="h-2 w-2 rounded-full" style={{ backgroundColor: GENDER_COLORS[g.name] ?? '#A0AEC0' }} />
                          <span className="text-[14px]" style={{ color: GENDER_COLORS[g.name] ?? '#A0AEC0' }}>
                            {g.name}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardHeader>
              {totalGenderCount > 0 ? (
                <GenderDonutChart
                  data={genderAnalytics.map((g) => ({ name: g.name, value: g.count }))}
                  COLORS={genderAnalytics.map((g) => GENDER_COLORS[g.name] ?? '#A0AEC0')}
                />
              ) : (
                <div className="flex h-full items-center justify-center pb-6">
                  <p className="text-muted-foreground text-sm">No data available</p>
                </div>
              )}
            </Card>
          </div>
        </div>
        <div className="mt-5 grid grid-cols-12 gap-4">
          {/* Trends */}
          <Card className="dark:bg-secondary col-span-12 h-[450px] shadow-lg md:col-span-6 lg:col-span-7">
            <CardHeader>
              <div className="items-center justify-between md:flex">
                <div className="flex flex-col items-start">
                  <h3 className="text-xl font-semibold">Trends</h3>
                  <div className="mt-1 flex flex-col">
                    <div className="flex items-center">
                      <div className="mr-2 h-2 w-2 rounded-full bg-[#2563EB]" />
                      <h1 className="text-[14px] leading-6">{currentYear ?? 'Current Year'}</h1>
                    </div>
                    <div className="mt-1 flex items-center">
                      <div className="mr-2 h-2 w-2 rounded-full bg-[#7B7E91]" />
                      <h1 className="text-[14px] text-[#7B7E91]">{previousYear ?? 'Previous Year'}</h1>
                    </div>
                  </div>
                </div>
                <div className="mt-2 md:mt-0">
                  <Select value={trendType} onValueChange={(val: any) => setTrendType(val as 'salesTrend' | 'revenueTrend')}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select trend" />
                    </SelectTrigger>
                    <SelectContent className="dark:bg-secondary">
                      <SelectGroup className="w-auto">
                        <SelectLabel>Trend</SelectLabel>
                        <SelectItem value="salesTrend">Total Sales</SelectItem>
                        <SelectItem value="revenueTrend">Total Revenue</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            <Trend data={trendChartData} />
          </Card>
          {/* visitor interest */}
          <Card className="dark:bg-secondary col-span-12 shadow-lg md:col-span-6 md:h-[450px] lg:col-span-5">
            <CardHeader>
              <div className="justify-between md:flex md:items-start">
                <h3 className="text-xl font-semibold">Interest per Category</h3>

                <div className="flex flex-col md:items-center">
                  <div className="flex items-center">
                    <div className="mr-2 h-2 w-2 rounded-full bg-[#020617]" />
                    <h1 className="text-[14px] leading-6">Males</h1>
                  </div>
                  <div className="mt-2 flex items-center">
                    <div className="mr-2 h-2 w-2 rounded-full bg-[#202C88]" />
                    <h1 className="text-[14px] text-[#202C88]">Females</h1>
                  </div>
                </div>
              </div>
            </CardHeader>
            {interestPerCategory?.length > 0 ? (
              <VisitorInterest
                chartData={interestPerCategory?.map((item) => ({
                  month: item?.category,
                  males: item?.males,
                  females: item?.females,
                }))}
                chartConfig={{
                  males: { label: 'Males', color: '#2563EB' },
                  females: { label: 'Females', color: '#202C88' },
                }}
              />
            ) : (
              <div className="flex h-full items-center justify-center pb-6">
                <p className="text-muted-foreground text-sm">No data available</p>
              </div>
            )}
          </Card>
        </div>
        <div className="mt-5 grid grid-cols-12 gap-4">
          {/* Views Over Time */}
          <Card className="dark:bg-secondary col-span-12 h-[450px] shadow-lg md:col-span-6">
            <CardHeader>
              <div className="lgitems-center justify-between lg:flex">
                <h3 className="text-xl font-semibold">Event Views Over Time</h3>
                <div className="mt-2 flex flex-col lg:mt-0 lg:items-center">
                  {/* <Select defaultValue="newEvent">
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
                  </Select> */}
                </div>
              </div>
            </CardHeader>
            <ViewsOverTime
              data={(dashboard?.eventViewsOverTime ?? []).map((item: any) => ({
                month: item?.month,
                views: item?.events ?? 0,
              }))}
            />
          </Card>
          {/* most viewed event */}
          <Card className="dark:bg-secondary col-span-12 h-[450px] shadow-lg md:col-span-6">
            <CardHeader>
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold">Most Viewed Event</h3>
              </div>
            </CardHeader>

            {(dashboard?.topViewedEvents?.mostViewedEvents ?? []).length > 0 ? (
              <MostViewedEvent
                chartData={(dashboard?.topViewedEvents?.mostViewedEvents ?? []).map((item: any) => ({
                  month: item?.title,
                  search: item?.totalViews ?? 0,
                }))}
                chartConfig={{
                  search: { label: 'Views', color: '#2563EB' },
                }}
              />
            ) : (
              <div className="flex h-full items-center justify-center pb-6">
                <p className="text-muted-foreground text-sm">No data available</p>
              </div>
            )}
          </Card>
        </div>
        <div className="mt-5 grid grid-cols-12 gap-4">
          {/* Follower Count */}
          <Card className="dark:bg-secondary col-span-12 h-[550px] shadow-lg md:col-span-6">
            <CardHeader>
              <div className="justify-between md:items-center lg:flex">
                <h3 className="text-xl font-semibold">Follower Count</h3>
                <div className="mt-2 flex flex-col lg:mt-0 lg:items-center">
                  {/* <Select defaultValue="users">
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
                  </Select> */}
                </div>
              </div>
            </CardHeader>
            <FollowerCount
              data={dashboard?.followersOverTime ?? []}
            />
          </Card>
          {/* Top Performing Events */}
          <Card className="dark:bg-secondary col-span-12 h-[550px] shadow-lg md:col-span-6">
            <CardHeader>
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold">Top Performing Events</h3>
              </div>
            </CardHeader>
            <TopPerformaningEvents data={dashboard?.topPerformingEvents ?? []} />
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
