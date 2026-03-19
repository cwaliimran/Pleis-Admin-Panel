'use client';

import { Card, CardHeader } from '@/components/ui/card';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import {
  EventPerformanceComparison,
  FollowerCount,
  GenderDonutChart,
  Trend,
  ViewsOverTime,
  VisitorAge,
  VisitorInterest,
  VisitorRegion,
} from '@/sections/invoices';
import TransactionHistoryDashboardWidget from '@/sections/transactions/transaction-history/transaction-history-dashboard-widget';
import { useGetDashboardQuery } from '@/store/Reducer/dashboard';
import { useGetMarketingRequestQuery } from '@/store/Reducer/marketing-request-api';
import { useRouter } from 'next/navigation';
import React from 'react';
import DashboardCard from './components/Dashboardcard';
import DashboardSkeleton from './components/DashboardSkeleton';
import DashboardStatsCard from './components/DashboardStatsCard';
import MostViewedEvent from './components/Mostviewedevent';
import TopPerformingOrganizers from './components/TopPerformingOrganizers';

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

interface MonthlyTicketRevenue {
  month: string;
  tickets: number;
  revenue: number;
}

interface AgeDemographic {
  ageGroup: string;
  total: number;
}

interface GenderAnalytic {
  name: string;
  count: number;
  percent: number;
}

interface RegionOverview {
  region: string;
  males: number;
  females: number;
  others: number;
}

interface UserGrowth {
  month: string;
  total: number;
}

interface InterestCategory {
  category: string;
  males: number;
  females: number;
  others: number;
}

interface SearchAnalytic {
  month: string;
  search: number;
}

interface OrganizerActivity {
  month: string;
  events: number;
}

interface TopOrganizer {
  organizerName: string;
  organizerLogo: string;
  revenue: number;
  engagement: number;
}

// ---------------------------------------------------------------------------
// Gender chart colour map
// ---------------------------------------------------------------------------
const GENDER_COLORS: Record<string, string> = {
  Males: '#2563EB',
  Females: '#202C88',
  Others: '#7DAEF4',
};

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------
const SuperAdminDashboardView = () => {
  const [active, setActive] = React.useState('all');
  const router = useRouter();

  // Map tab values to API dateFilter values
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

  // ---- Marketing requests for bottom cards ----
  const { data: marketingRaw = {} as any } = useGetMarketingRequestQuery({
    page: 0,
    search: '',
    limit: 3,
    userType: 'super-admin',
  });
  const marketingRequests = marketingRaw?.data ?? [];

  // ---- Safely extract all sections from the API response ----
  const dashboard = dashboardRaw?.data ?? dashboardRaw ?? {};

  const stats: StatItem[] = dashboard.stats ?? [];
  const organizersPerformanceComparison: MonthlyTicketRevenue[] = dashboard.organizersPerformanceComparison ?? [];

  const usersDashboardAnalytics = dashboard.usersDashboardAnalytics ?? {};
  const ageDemographics: AgeDemographic[] = usersDashboardAnalytics.ageDemographics ?? [];
  const genderAnalytics: GenderAnalytic[] = usersDashboardAnalytics.genderAnalytics ?? [];
  const regionOverview: RegionOverview[] = usersDashboardAnalytics.regionOverview ?? [];
  const userGrowth: UserGrowth[] = usersDashboardAnalytics.userGrowth ?? [];

  const interestPerCategory: InterestCategory[] = dashboard.interestPerCategory?.interestPerCategory ?? [];
  const topSearchesAnalytics: SearchAnalytic[] = dashboard.topSearchesAnalytics ?? [];
  const topPerformingOrganizers: TopOrganizer[] = dashboard.topPerformingOrganizers ?? [];
  const organizerActivityOverTime: OrganizerActivity[] = dashboard.organizerActivityOverTime ?? [];

  // ---- Filter regions with actual data (exclude all-zero regions) ----
  const activeRegions = regionOverview.filter((r) => r.males > 0 || r.females > 0 || r.others > 0);

  // ---- Derived data for Gender Analytics legend ----
  const totalGenderCount = genderAnalytics.reduce((sum, g) => sum + g.count, 0);

  // ---- Derived: find dominant age group ----
  const dominantAge = ageDemographics.length ? ageDemographics.reduce((max, cur) => (cur.total > max.total ? cur : max), ageDemographics[0]) : null;
  const dominantAgePercent =
    dominantAge && totalGenderCount > 0 ? Math.round((dominantAge.total / ageDemographics.reduce((s, a) => s + a.total, 0)) * 100) : 0;

  // ---- Loading state ----
  if (isLoading || isFetching) {
    return <DashboardSkeleton />;
  }

  return (
    <div>
      <div className="mx-1 mt-5 pb-8 md:mx-4">
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

        {/* ---------------------------------------------------------------- */}
        {/* Organizer Performance Comparison                                 */}
        {/* ---------------------------------------------------------------- */}
        <Card className="dark:bg-secondary mt-5 shadow-lg lg:mt-5">
          <CardHeader>
            <div className="items-center justify-between md:flex">
              <h3 className="text-xl font-semibold">Organizer Performance Comparison</h3>
              <div className="flex flex-col md:items-center">
                <div className="flex items-center">
                  <div className="mr-2 h-2 w-2 rounded-full bg-black dark:bg-white" />
                  <h1 className="text-[14px] leading-6">Tickets Sold</h1>
                </div>
                <div className="mt-2 flex items-center">
                  <div className="mr-2 h-2 w-2 rounded-full bg-[#7DAEF4]" />
                  <h1 className="text-[14px] text-[#7DAEF4]">Revenue</h1>
                </div>
              </div>
            </div>
          </CardHeader>
          <EventPerformanceComparison
            chartData={organizersPerformanceComparison.map((item) => ({
              month: item.month,
              desktop: item.tickets,
              mobile: item.revenue,
            }))}
            chartConfig={{
              desktop: { label: 'Tickets Sold', color: '#2563eb' },
              mobile: { label: 'Revenue', color: '#7DAEF4' },
            }}
          />
        </Card>

        {/* ---------------------------------------------------------------- */}
        {/* Age Demographics · Region Overview · Gender Analytics            */}
        {/* ---------------------------------------------------------------- */}
        <div className="mt-5 grid gap-4 md:grid-cols-2 md:gap-x-7 md:gap-y-4 lg:mt-5 lg:grid-cols-3">
          {/* Age Demographics */}
          <Card className="dark:bg-secondary max-h-full w-full shadow-md md:h-[450px]">
            <CardHeader>
              <h3 className="text-xl font-semibold">Age Demographics</h3>
            </CardHeader>
            <div className="flex-1">
              <VisitorAge
                direction="vertical"
                data={ageDemographics.map((item) => ({
                  ageGroup: item.ageGroup,
                  visitors: item.total,
                }))}
              />
              {dominantAge && (
                <div className="mx-4 mt-4">
                  <p className="text-muted-foreground text-[12px] font-medium">
                    <span className="text-xl font-bold text-black dark:text-white">{dominantAgePercent}%</span> visitors are {dominantAge.ageGroup}{' '}
                    years old
                  </p>
                </div>
              )}
            </div>
          </Card>

          {/* Region Overview */}
          <Card className="dark:bg-secondary h-[450px] shadow-md">
            <CardHeader>
              <div className="items-start justify-between md:flex">
                <h3 className="text-xl font-semibold">Region Overview</h3>
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
              chartData={activeRegions.map((item) => ({
                month: item.region,
                males: item.males,
                females: item.females,
                others: item.others,
              }))}
              chartConfig={{
                males: { label: 'Males', color: '#2563eb' },
                females: { label: 'Females', color: '#202C88' },
                others: { label: 'Others', color: '#7DAEF4' },
              }}
            />
          </Card>

          {/* Gender Analytics */}
          <Card className="dark:bg-secondary h-[450px] pb-0 shadow-md">
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
                      <span className="ml-1 text-[14px] text-gray-700 dark:text-white">
                        {g.percent}% / {totalGenderCount}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
              <GenderDonutChart
                data={genderAnalytics.map((g) => ({ name: g.name, value: g.count }))}
                COLORS={genderAnalytics.map((g) => GENDER_COLORS[g.name] ?? '#A0AEC0')}
              />
            </CardHeader>
          </Card>
        </div>

        {/* ---------------------------------------------------------------- */}
        {/* Trends · Interest per Category                                   */}
        {/* ---------------------------------------------------------------- */}
        <div className="mt-5 grid grid-cols-12 gap-4">
          {/* Trends — dropdown removed per requirement */}
          <Card className="dark:bg-secondary col-span-12 h-[450px] shadow-lg md:col-span-6 lg:col-span-7">
            <CardHeader>
              <div className="flex flex-col items-start">
                <h3 className="text-xl font-semibold">Trends</h3>
                <div className="flex flex-col items-center">
                  <div className="flex items-center">
                    <div className="mr-2 h-2 w-2 rounded-full bg-[#2563EB]" />
                    <h1 className="text-[14px] leading-6">This Month</h1>
                  </div>
                  <div className="mt-2 flex items-center">
                    <div className="mr-2 h-2 w-2 rounded-full bg-[#7B7E91]" />
                    <h1 className="text-[14px] text-[#7B7E91]">Last Month</h1>
                  </div>
                </div>
              </div>
            </CardHeader>
            {/* Trends data not available in current API — kept as placeholder */}
            <Trend
              data={[
                { month: 'Jan', current: 0, previous: 0 },
                { month: 'Feb', current: 0, previous: 0 },
                { month: 'Mar', current: 0, previous: 0 },
                { month: 'Apr', current: 0, previous: 0 },
                { month: 'May', current: 0, previous: 0 },
                { month: 'Jun', current: 0, previous: 0 },
              ]}
            />
          </Card>

          {/* Interest per Category */}
          <Card className="dark:bg-secondary col-span-12 shadow-lg md:col-span-6 md:h-[450px] lg:col-span-5">
            <CardHeader>
              <div className="justify-between md:flex md:items-center">
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
            <VisitorInterest
              chartData={interestPerCategory.map((item) => ({
                month: item.category,
                males: item.males,
                females: item.females,
              }))}
              chartConfig={{
                males: { label: 'Males', color: '#2563EB' },
                females: { label: 'Females', color: '#202C88' },
              }}
            />
          </Card>
        </div>

        {/* ---------------------------------------------------------------- */}
        {/* Organizer Activity Over Time · Top Searches                      */}
        {/* ---------------------------------------------------------------- */}
        <div className="mt-5 grid grid-cols-12 gap-4">
          <Card className="dark:bg-secondary col-span-12 h-[450px] shadow-lg md:col-span-6">
            <CardHeader>
              <div className="justify-between lg:flex lg:items-center">
                <h3 className="text-xl font-semibold">Organizer Activity Over Time</h3>
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
              data={organizerActivityOverTime.map((item) => ({
                month: item.month,
                views: item.events,
              }))}
            />
          </Card>

          <Card className="dark:bg-secondary col-span-12 h-[450px] shadow-lg md:col-span-6">
            <CardHeader>
              <h3 className="text-xl font-semibold">Top Searches</h3>
            </CardHeader>
            <MostViewedEvent
              chartData={topSearchesAnalytics.map((item) => ({
                month: item.month,
                search: item.search,
              }))}
              chartConfig={{
                search: { label: 'Search', color: '#2563EB' },
              }}
            />
          </Card>
        </div>

        {/* ---------------------------------------------------------------- */}
        {/* Growth of Registered Users · Top Performing Organizers           */}
        {/* ---------------------------------------------------------------- */}
        <div className="mt-5 grid grid-cols-12 gap-4">
          <Card className="dark:bg-secondary col-span-12 h-[550px] shadow-lg md:col-span-6">
            <CardHeader>
              <h3 className="text-xl font-semibold">Growth of Registered Users</h3>
            </CardHeader>
            <FollowerCount
              data={userGrowth.map((item) => ({
                month: item.month,
                followers: item.total,
              }))}
            />
          </Card>

          <Card className="dark:bg-secondary col-span-12 h-[550px] shadow-lg md:col-span-6">
            <CardHeader>
              <h3 className="text-xl font-semibold">Top Performing Organizers</h3>
            </CardHeader>
            <TopPerformingOrganizers data={topPerformingOrganizers} />
          </Card>
        </div>

        {/* ---------------------------------------------------------------- */}
        {/* Transaction History                                              */}
        {/* ---------------------------------------------------------------- */}
        <div className="mt-5 grid grid-cols-12">
          <div className="col-span-12">
            <TransactionHistoryDashboardWidget />
          </div>
        </div>

        {/* ---------------------------------------------------------------- */}
        {/* Marketing Requests Cards                                         */}
        {/* ---------------------------------------------------------------- */}
        {marketingRequests.length > 0 && (
          <div className="mt-7 mb-3">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-xl font-semibold">Marketing Requests</h3>
              <button
                type="button"
                title="View More"
                onClick={() => router.push('/super-admin/marketing-requests')}
                className="text-primary hover:text-primary/80 cursor-pointer text-sm font-semibold transition-colors"
              >
                View More →
              </button>
            </div>
            <div className="grid grid-cols-12 gap-4">
              {marketingRequests.slice(0, 3).map((item: any) => (
                <div key={item._id} className="col-span-12 lg:col-span-4">
                  <DashboardCard item={item} />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SuperAdminDashboardView;
