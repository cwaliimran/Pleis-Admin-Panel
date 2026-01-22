import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import { useGeteventAnalyticsByIdQuery } from '@/store/Reducer/events';
import React from 'react';
import { GenderDonutChart, Trend, VisitorAge } from '../invoices';
import { eventTabForAnalytics } from './data';
import TicketPerformanceChart from './ticketPerformance';
import EventLoading from './components/event-loading';

const EventAnalytics = ({ id }: { id: any }) => {
  const [active, setActive] = React.useState('fromSales');

  const { data = {}, isLoading } = useGeteventAnalyticsByIdQuery(id);
  // Defensive fallback for missing fields
  const engagementStats = data?.engagementStats || { views: 0, favorites: 0 };
  const weeklyViews = data?.weeklyViews || [];
  const audienceAnalytics = data?.audienceAnalytics || { gender: {}, ageRanges: [] };
  const genderStats = audienceAnalytics.gender || {};
  const ageRanges = audienceAnalytics.ageRanges || [];
  const ticketPerformanceWeekly = data?.ticketPerformanceWeekly || [];
  const revenueAnalytics = data?.revenueAnalytics || { totalRevenue: 0, currency: '', trend: [] };
  const totalRevenue = revenueAnalytics.totalRevenue ?? 0;
  const currency = revenueAnalytics.currency ?? '';
  const trend = revenueAnalytics.trend || [];

  // Calculate max for normalization (avoid division by zero)
  const maxEngagement = Math.max(engagementStats.favorites ?? 0, engagementStats.views ?? 0, 1);

  return (
    <>
      {isLoading ? (
        <EventLoading />
      ) : (
        <div className="grid grid-cols-12 gap-4">
          <div className="col-span-12 lg:col-span-4">
            {/* Engagement */}
            <Card className="mb-3 shadow-md dark:bg-[#171717]">
              <CardHeader>
                <h3 className="text-xl font-semibold">Engagement</h3>
              </CardHeader>
              <CardContent className="">
                <div className="tex-md flex items-center justify-between">
                  <h1 className="font-semibold text-slate-500">Favorites</h1>
                  <h1 className="text-slate-500">{engagementStats.favorites ?? 0}</h1>
                </div>
                <div className="mt-2 flex items-start justify-between gap-4">
                  <div className="flex flex-1 flex-col">
                    <div className="mb-2 h-2 w-full overflow-hidden rounded-full bg-gray-200">
                      <div
                        className="bg-primary h-full transition-all duration-500"
                        style={{ width: `${((engagementStats.favorites ?? 0) / maxEngagement) * 100}%` }}
                      ></div>
                    </div>
                    <div className="text-right text-xs text-slate-400">
                      {maxEngagement > 0 ? `${Math.round(((engagementStats.favorites ?? 0) / maxEngagement) * 100)}%` : '0%'}
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <h1 className="font-semibold text-slate-500">Views</h1>
                  <h1 className="text-slate-500">{engagementStats.views ?? 0}</h1>
                </div>
                <div className="mt-2 flex items-start justify-between gap-4">
                  <div className="flex flex-1 flex-col">
                    <div className="mb-2 h-2 w-full overflow-hidden rounded-full bg-gray-200">
                      <div
                        className="bg-primary h-full transition-all duration-500"
                        style={{ width: `${((engagementStats.views ?? 0) / maxEngagement) * 100}%` }}
                      ></div>
                    </div>
                    <div className="text-right text-xs text-slate-400">
                      {maxEngagement > 0 ? `${Math.round(((engagementStats.views ?? 0) / maxEngagement) * 100)}%` : '0%'}
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
              <CardContent className="p-0">
                <VisitorAge direction="horizontal" data={weeklyViews.map((item: any) => ({ ageGroup: item.day, visitors: item.visitors }))} />
              </CardContent>
              <div className="mx-4 mb-2">
                {/* Optionally, you can show a calculated trend here if available */}
                <p className="text-muted-foreground text-[12px] font-medium">
                  {/* Placeholder for trend, replace with real calculation if available */}
                  <span className="text-xl font-bold text-black dark:text-white">
                    {engagementStats.views > 0 ? `${engagementStats.views}` : 'No'}
                  </span>{' '}
                  Views this week
                </p>
              </div>
            </Card>

            {/* Views */}
            <Card className="mb-3 pb-0 shadow-md dark:bg-[#171717]">
              <CardHeader>
                <h3 className="text-xl font-semibold">Age Group</h3>
              </CardHeader>
              <CardContent className="p-0">
                <VisitorAge direction="horizontal" data={ageRanges.map((item: any) => ({ ageGroup: item.label, visitors: item.value }))} />
              </CardContent>
            </Card>

            {/* Gender Analytic */}
            <Card className="pb-0 shadow-md dark:bg-[#171717]">
              <CardHeader className="">
                <h3 className="text-xl font-semibold lg:text-center"> Gender Analytics</h3>
                <CardContent className="p-0">
                  {[
                    genderStats.Male?.count ?? 0,
                    genderStats.Female?.count ?? 0,
                    genderStats.Other?.count ?? 0,
                    genderStats.Unknown?.count ?? 0,
                  ].some((v) => v > 0) ? (
                    <GenderDonutChart
                      size={120}
                      data={[
                        { name: 'Male', value: genderStats.Male?.count ?? 0 },
                        { name: 'Female', value: genderStats.Female?.count ?? 0 },
                        { name: 'Other', value: genderStats.Other?.count ?? 0 },
                        { name: 'Unknown', value: genderStats.Unknown?.count ?? 0 },
                      ].filter((g) => g.value > 0)}
                      COLORS={['#2563EB', '#202C88', '#7DAEF4', '#A0AEC0']}
                    />
                  ) : (
                    <div className="flex h-[120px] items-center justify-center text-sm text-slate-400">No gender analytics data available</div>
                  )}
                </CardContent>
                <div className="flex flex-col">
                  {['Male', 'Female', 'Other', 'Unknown'].map((key, idx) => (
                    <div className="flex justify-between px-4" key={key}>
                      <div className="mb-2 flex items-center">
                        <div className={`mr-2 h-3 w-3 rounded-full`} style={{ backgroundColor: ['#2563EB', '#202C88', '#7DAEF4', '#A0AEC0'][idx] }} />
                        <h1 className="text-md leading-6">{key}</h1>
                      </div>
                      <h1>
                        {genderStats[key]?.count ?? 0} ({genderStats[key]?.percentage ?? 0}%)
                      </h1>
                    </div>
                  ))}
                </div>
              </CardHeader>
            </Card>
          </div>
          <div className="col-span-12 lg:col-span-8">
            {/* Ticket Performance  */}
            <Card className="h-[450px] shadow-md dark:bg-[#171717]">
              <CardHeader>
                <h3 className="text-xl font-semibold"> Ticket Performance </h3>
              </CardHeader>
              <CardContent>
                <TicketPerformanceChart data={ticketPerformanceWeekly.map((item: any) => ({ day: item.day, value: item.value }))} />
              </CardContent>
            </Card>
            {/* Total Revenue */}
            <Card className="mt-10 h-[500px] shadow-md dark:bg-[#171717]">
              <CardHeader>
                <div className="flex flex-col justify-between gap-4 md:flex-row lg:items-center">
                  <div>
                    <h3 className="text-xl font-semibold"> Total Revenue </h3>
                    <h3 className="text-2xl font-bold">
                      {totalRevenue?.toLocaleString(undefined, { maximumFractionDigits: 2 })} {currency}
                    </h3>
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
                      <Tabs value={active} onValueChange={setActive} defaultValue="all" className="hidden w-full md:block">
                        <TabsList className="flex items-end gap-2 rounded-full border bg-[#EBEBEB] p-1 dark:border-white dark:bg-black">
                          {eventTabForAnalytics.map((tab: any) => (
                            <TabsTrigger
                              key={tab.value}
                              value={tab.value}
                              className={cn(
                                'relative z-10 cursor-pointer rounded-full py-2 text-sm font-semibold transition-colors',
                                active === tab.value ? 'bg-white dark:bg-gray-800' : 'text-muted-foreground'
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
                  data={trend.map((item: any) => ({ month: item.month, current: item.current, previous: item.previous }))}
                />
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </>
  );
};

export default EventAnalytics;
