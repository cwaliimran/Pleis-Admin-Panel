import { useGeteventAnalyticsByIdQuery } from '@/store/Reducer/events';
import React from 'react';
import { VisitorGanderAnalytics } from '../users';
import EventTopInterests from './components/event-top-interests';
import EventAgeDistribution from './components/event-age-distribution';
import EventViewsOverTime from './components/event-views-over-time';

const dateFilterMap: Record<string, string> = {
  today: 'today',
  week: 'thisWeek',
  month: 'thisMonth',
  all: 'all',
};

const EventAnalytics = ({ id, refreshKey = 0 }: { id: string; refreshKey?: number }) => {
  const [dateTab, setDateTab] = React.useState('all');
  const previousRefreshKey = React.useRef(refreshKey);

  const {
    data: analyticsData = {},
    isLoading,
    isFetching,
    refetch,
  } = useGeteventAnalyticsByIdQuery(
    {
      id,
      dateFilter: dateFilterMap[dateTab] ?? 'all',
    },
    {
      refetchOnMountOrArgChange: true,
    }
  );

  React.useEffect(() => {
    if (previousRefreshKey.current !== refreshKey) {
      previousRefreshKey.current = refreshKey;
      refetch();
    }
  }, [refreshKey, refetch]);

  const viewerShipTrends = analyticsData?.viewerShipTrends ?? analyticsData?.viewershipTrends ?? {};

  const mapStatToRow = (item: any, statType: 'sales' | 'views' | 'revenue') => {
    if (statType === 'sales') {
      return {
        month: item?.month ?? item?.label ?? item?.day ?? 'N/A',
        value: Number(item?.value ?? item?.sales ?? 0),
      };
    }

    if (statType === 'views') {
      return {
        ageGroup: item?.day ?? item?.month ?? item?.label ?? item?.ageGroup ?? 'N/A',
        visitors: Number(item?.visitors ?? item?.value ?? item?.count ?? 0),
      };
    }

    return {
      month: item?.month ?? item?.label ?? item?.day ?? 'N/A',
      revenue: Number(item?.revenue ?? item?.totalAmount ?? item?.current ?? 0),
      ticketesSold: Number(item?.ticketesSold ?? item?.totalOrders ?? item?.value ?? 0),
    };
  };

  // const salesTrendData = (analyticsData?.salesOverTime ?? analyticsData?.reservationsOverTime ?? []).map((item: any) => mapStatToRow(item, 'sales'));

  const viewsOverTimeData = (analyticsData?.eventViewsByTime ?? analyticsData?.viewsOverTime ?? analyticsData?.weeklyViews ?? []).map((item: any) =>
    mapStatToRow(item, 'views')
  );

  // const eventPerformanceData = (analyticsData?.eventOverTime ?? analyticsData?.revenueAnalytics?.trend ?? []).map((item: any) =>
  //   mapStatToRow(item, 'revenue')
  // );

  const ageDemographicsData =
    viewerShipTrends?.ageDemographics ??
    (analyticsData?.audienceAnalytics?.ageRanges ?? []).map((item: any) => ({
      ageGroup: item?.label ?? 'N/A',
      total: Number(item?.value ?? 0),
    }));

  const genderAnalyticsData =
    viewerShipTrends?.genderAnalytics ??
    Object.entries(analyticsData?.audienceAnalytics?.gender ?? {}).map(([name, value]: any) => ({
      name: `${name}s`,
      count: Number(value?.count ?? 0),
      percent: Number(value?.percentage ?? 0),
    }));

  // const regionOverviewData = viewerShipTrends?.regionOverview ?? [];
  const interestPerCategoryData = analyticsData?.interestPerCategory ?? [];

  return (
    <div>
      {/* <div className="flex items-start justify-start gap-4 p-2 md:flex-row md:items-center">
        <Tabs value={dateTab} onValueChange={setDateTab}>
          <div className="scrollbar-hide overflow-x-auto whitespace-nowrap">
            <TabsList className="flex items-center gap-2 rounded-full border bg-[#EBEBEB] p-1 dark:border-white dark:bg-black">
              {dateTabs.map((item) => (
                <TabsTrigger
                  key={item.value}
                  value={item.value}
                  className={cn('text-md relative z-10 cursor-pointer rounded-full px-4 py-2 font-semibold transition-colors')}
                >
                  {item.label}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>
        </Tabs>
      </div> */}

      <div className="mt-5 grid w-full grid-cols-12 gap-4">
        {/* <div className="col-span-12 lg:col-span-6">
          <SaleTrend chartData={salesTrendData} isLoading={isLoading || isFetching} />
        </div> */}

        <div className="col-span-12 lg:col-span-6">
          <EventViewsOverTime viewData={viewsOverTimeData} isLoading={isLoading || isFetching} />
        </div>

        {/* <div className="col-span-12 lg:col-span-12">
          <EventPerformanceComparsionInUserDetails chartData={eventPerformanceData} isLoading={isLoading || isFetching} />
        </div> */}

        {/* <div className="col-span-12 lg:col-span-6">
          <RegionOverview data={regionOverviewData} isLoading={isLoading || isFetching} />
        </div> */}

        <div className="col-span-12 lg:col-span-6">
          <EventAgeDistribution ageDemographics={ageDemographicsData} />
        </div>

        <div className="col-span-12 lg:col-span-6">
          <VisitorGanderAnalytics title="Audience Gender Distribution" data={genderAnalyticsData} isLoading={isLoading || isFetching} />
        </div>

        <div className="col-span-12 lg:col-span-6">
          <EventTopInterests data={interestPerCategoryData} isLoading={isLoading || isFetching} />
        </div>
      </div>
    </div>
  );
};

export default EventAnalytics;
