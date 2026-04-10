import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import React from "react";
import { dateTabs } from "./data";
import { cn } from "@/lib/utils";
import {
  FollowerGenderDistributionChart,
  FollowerInterestsChart,
  FollowerLocationDistributionChart,
  FollowersTagsChart,
  PageViewTrendsChart,
  RepeatPurchaseUsersChart,
  TicketSalesGrowthChart,
  VisitorRetentionTrendsChart,
  mapGenderData,
  mapInterestData,
  mapLocationData,
  mapRepeatPurchaseData,
  mapTagData,
  mapTimelineData,
} from "./organization-analytics";
import { useGetOrganizationAnalyticsQuery } from "@/store/Reducer/organization";

// Maps the tab values from UI to what the API expects
const dateFilterMap: Record<string, string> = {
  today: "today",
  week: "thisWeek",
  month: "thisMonth",
  all: "all",
};

interface OrgAnalyticsProps {
  organizationData?: any;
  userType?: string;
  organizationId?: string;
  refreshKey?: number;
}

const OrgAnalytics = ({ organizationData, userType, organizationId, refreshKey = 0 }: OrgAnalyticsProps) => {
  const [dateTab, setDateTab] = React.useState("all");
  const previousRefreshKey = React.useRef(refreshKey);

  const isSuperAdmin = userType === 'super-admin';

  const hasPremium =
    isSuperAdmin ||
    organizationData?.subscription?.status === 'active' ||
    organizationData?.activeSubscription?.status === 'active' ||
    organizationData?.subscriptions?.some((s: any) => s?.status === 'active') ||
    false;

  const { data: analyticsData, isLoading: analyticsLoading, isFetching: analyticsFetching, refetch } = useGetOrganizationAnalyticsQuery(
    {
      organizationId: organizationId ?? organizationData?._id,
      dateFilter: dateFilterMap[dateTab] ?? "all",
    },
    {
      skip: !organizationId && !organizationData?._id,
      refetchOnMountOrArgChange: true,
    }
  );

  React.useEffect(() => {
    if (previousRefreshKey.current !== refreshKey) {
      previousRefreshKey.current = refreshKey;
      refetch();
    }
  }, [refreshKey, refetch]);

  const pageViewTrendsData = mapTimelineData(
    analyticsData?.viewsByTime ?? analyticsData?.pageViewTrends ?? analyticsData?.viewsOverTime ?? analyticsData?.eventViewsByTime ?? analyticsData?.weeklyViews ?? [],
    ["views", "value", "count", "totalViews"]
  );
  const ticketSalesGrowthData = mapTimelineData(
    analyticsData?.ticketSalesGrowthOverTime ?? analyticsData?.salesOverTime ?? analyticsData?.reservationsOverTime ?? [],
    ["sales", "ticketsSold", "ticketesSold", "value", "totalOrders", "count"]
  );
  const repeatPurchaseUsersData = mapRepeatPurchaseData(
    analyticsData?.repeatPurchasesByTime ?? analyticsData?.repeatPurchaseUsersOverTime ?? analyticsData?.repeatPurchasesOverTime ?? analyticsData?.returningCustomersOverTime ?? [],
  );
  const visitorRetentionTrendsData = mapTimelineData(
    analyticsData?.userStreaksByTime ?? analyticsData?.visitsByMonth ?? analyticsData?.visitsOverTime ?? analyticsData?.visitorRetentionTrends ?? analyticsData?.retentionOverTime ?? analyticsData?.visitorRetentionOverTime ?? [],
    ["totalVisits", "visits", "visitCount", "count", "value", "total", "retentionRate", "retention"]
  );

  const genderAnalyticsData =
    analyticsData?.viewerShipTrends?.genderAnalytics ??
    analyticsData?.viewershipTrends?.genderAnalytics ??
    [];
  const regionOverviewData =
    analyticsData?.viewerShipTrends?.regionOverview ??
    analyticsData?.viewershipTrends?.regionOverview ??
    [];
  const interestPerCategoryData = analyticsData?.followerInterests ?? analyticsData?.interestPerCategory ?? [];
  const interestPerTagData = analyticsData?.interestPerTag ?? analyticsData?.followerTags ?? [];

  const mappedInterestData = mapInterestData(interestPerCategoryData);
  const mappedTagData = mapTagData(interestPerTagData);
  const mappedGenderData = mapGenderData(genderAnalyticsData);
  const mappedLocationData = mapLocationData(regionOverviewData);

  return (
    <div>
      <div className="flex justify-start md:flex-row flex-col md:items-center items-start gap-4 p-2">
        <Tabs value={dateTab} onValueChange={setDateTab}>
          <div className="overflow-x-auto whitespace-nowrap scrollbar-hide">
            <TabsList className="flex items-center gap-2 bg-[#EBEBEB] dark:bg-black dark:border-white border rounded-full p-1">
              {dateTabs.map((item) => (
                <TabsTrigger
                  key={item.value}
                  value={item.value}
                  className={cn(
                    "text-md font-semibold relative z-10 rounded-full px-4 py-2 transition-colors cursor-pointer"
                  )}
                >
                  {item.label}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>
        </Tabs>
      </div>
      <div className="w-full grid grid-cols-12 gap-4 mt-5">
        <div className="lg:col-span-6 col-span-12">
          <PageViewTrendsChart
            data={pageViewTrendsData}
            isLoading={analyticsLoading || analyticsFetching}
          />
        </div>
        <div className="lg:col-span-6 col-span-12">
          <TicketSalesGrowthChart
            data={ticketSalesGrowthData}
            isLoading={analyticsLoading || analyticsFetching}
          />
        </div>

        <div className="lg:col-span-6 col-span-12">
          <RepeatPurchaseUsersChart
            data={repeatPurchaseUsersData}
            isLoading={analyticsLoading || analyticsFetching}
          />
        </div>
        <div className="lg:col-span-6 col-span-12">
          <VisitorRetentionTrendsChart
            data={visitorRetentionTrendsData}
            isLoading={analyticsLoading || analyticsFetching}
          />
        </div>

        <div className="lg:col-span-6 col-span-12">
          <FollowerInterestsChart
            data={mappedInterestData}
            isLoading={analyticsLoading || analyticsFetching}
          />
        </div>
        <div className="lg:col-span-6 col-span-12">
          <FollowersTagsChart
            data={mappedTagData}
            isLoading={analyticsLoading || analyticsFetching}
          />
        </div>

        <div className="col-span-12 grid grid-cols-12 gap-4 relative overflow-hidden rounded-xl">
          {/* Grid Content (Blurred behind overlay) */}
          <div className="lg:col-span-6 col-span-12">
            <FollowerGenderDistributionChart
              data={mappedGenderData}
              isLoading={analyticsLoading || analyticsFetching}
            />
          </div>
          <div className="lg:col-span-6 col-span-12">
            <FollowerLocationDistributionChart
              data={mappedLocationData}
              isLoading={analyticsLoading || analyticsFetching}
            />
          </div>

          {/* Overlay with background blur — only shown when no active subscription */}
          {!hasPremium && (
            <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/40 backdrop-blur-md">
              <div className="text-center space-y-4">
                <h2 className="text-white text-2xl font-semibold">
                  To see detailed analytics
                </h2>
                <button className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-md">
                  Upgrade to Premium
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrgAnalytics;
