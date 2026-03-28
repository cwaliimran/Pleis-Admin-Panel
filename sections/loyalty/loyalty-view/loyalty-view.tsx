'use client';

import { Button } from '@/components/ui/button';
import { Card, CardHeader } from '@/components/ui/card';
import { Dialog, DialogContent, DialogOverlay, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useBoolean } from '@/hooks/useBoolean';
// import { useCompanySelectionState } from '@/hooks/useCompanySelectionState';
import { cn } from '@/lib/utils';
import { GenderDonutChart, InvoiceCard, MostViewedEvent, ViewsOverTime, VisitorAge, VisitorRegion } from '@/sections/invoices';
import { LoyaltyCard, MostEngagedMembers } from '@/sections/loyalty';
import {
  loyaltPointsDashboard,
  loyaltyCardHeaderData,
  loyaltyMidCardData,
  LoyaltyPoints,
  rewardData,
  rewardDataWithLimitedAvail,
  TabData,
  tabsData,
} from '@/sections/loyalty/data';
import GlobalLoyaltyTransactionDashboardWidget from '@/sections/transactions/global-loyalty-transaction/global-loyalty-transaction-dashboard-widget';
import LoyaltyTransactionDashboardWidget from '@/sections/transactions/loyalty-transaction/loyalty-transaction-dashboard-widget';
import RewardCard from '@/sections/loyalty/rewardCard';
// import { useGetLoyaltyDashboardQuery } from '@/store/Reducer/dashboard';
import { useRouter } from 'next/navigation';
import React from 'react';
import { useGetGlobalLoyaltyDashboardQuery } from '@/store/Reducer/dashboard';
import DashboardSkeleton from '@/sections/super-admin-dashboard/components/DashboardSkeleton';

const LoyaltyView = ({ global, userType }: { global: boolean; userType: string }) => {
  const router = useRouter();
  const openModal = useBoolean();

  // const { companyId } = useCompanySelectionState();

  const [mainActive, setMainActive] = React.useState('overview');
  const [activeDurationTab, setActiveDurationTab] = React.useState('monthly');

  // Map tab values to API dateFilter values
  const dateFilterMap: Record<string, string> = {
    daily: 'today',
    weekly: 'thisWeek',
    monthly: 'thisMonth',
    yearly: 'thisYear',
    all: 'all',
  };

  const {
    data: dashboardRaw = {} as any,
    isLoading,
    isFetching,
  } = useGetGlobalLoyaltyDashboardQuery({
     dateFilter: dateFilterMap[activeDurationTab] ?? 'all',
  });

  const membersActivity = Array.isArray(dashboardRaw?.data?.membersActivity) ? dashboardRaw.data.membersActivity : [];
  const activeActivity = membersActivity.find((item: any) => String(item?.name || '').toLowerCase() === 'active');
  const inactiveActivity = membersActivity.find((item: any) => String(item?.name || '').toLowerCase() === 'inactive');

  const activePercent = Number(activeActivity?.percent ?? 0);
  const inactivePercent = Number(inactiveActivity?.percent ?? 0);
  const activeCount = Number(activeActivity?.count ?? 0);
  const inactiveCount = Number(inactiveActivity?.count ?? 0);

  const mappedStatsTitle: Record<string, string> = {
    totalUsers: 'Total Members',
    activeUsers: 'Active Members',
    inactiveUsers: 'Inactive Members',
    newUsers: 'New Members',
  };

  const dashboardStats = Array.isArray(dashboardRaw?.data?.stats) ? dashboardRaw.data.stats : [];

  const midCardKeyTitleMap: Record<string, string> = {
    totalUsers: 'Existing Members',
    newUsers: 'New Members',
  };

  const loyaltyMidStatCards = (['totalUsers', 'newUsers'] as const)
    .map((key) => {
      const stat = dashboardStats.find((s: any) => s?.key === key);
      if (!stat) return null;
      const growthNumber = Number(stat?.growth ?? 0);
      const growth =
        key === 'newUsers'
          ? undefined
          : Number.isFinite(growthNumber)
            ? `${growthNumber > 0 ? '+' : ''}${growthNumber.toFixed(2)}%`
            : undefined;
      return {
        id: key,
        title: midCardKeyTitleMap[key],
        amount: Number(stat?.value ?? 0),
        status: stat?.selectedSubFilter || 'all',
        raise: growth,
      };
    })
    .filter(Boolean);

  const hideGrowthForKeys = new Set(['inactiveUsers', 'newUsers']);
  const hideGrowthForTitles = new Set(['Inactive Members', 'New Members', 'New Members this Month']);
  const rawAgeDemographics = Array.isArray(dashboardRaw?.data?.usersDashboardAnalytics?.ageDemographics)
    ? dashboardRaw.data.usersDashboardAnalytics.ageDemographics
    : [];
  const ageDemographicsData = rawAgeDemographics.map((item: any) => ({
    ageGroup: item?.ageGroup || '',
    visitors: Number(item?.total ?? 0),
  }));
  const topAgeGroup = ageDemographicsData.reduce(
    (max: { ageGroup: string; visitors: number }, cur: { ageGroup: string; visitors: number }) =>
      cur.visitors > max.visitors ? cur : max,
    { ageGroup: '', visitors: 0 }
  );
  const totalAgeVisitors = ageDemographicsData.reduce((sum: number, item: { visitors: number }) => sum + item.visitors, 0);
  const topAgePercent =
    totalAgeVisitors > 0 ? Math.round((topAgeGroup.visitors / totalAgeVisitors) * 100) : 0;

  const regionOverviewData = Array.isArray(dashboardRaw?.data?.usersDashboardAnalytics?.regionOverview)
    ? dashboardRaw.data.usersDashboardAnalytics.regionOverview.map((item: any) => ({
        month: item?.region || '',
        males: Number(item?.males ?? 0),
        females: Number(item?.females ?? 0),
        others: Number(item?.others ?? 0),
      }))
    : [];

  const genderColorMap: Record<string, string> = {
    Males: '#2563EB',
    Females: '#202C88',
    Others: '#7DAEF4',
  };
  const genderOrder = ['Males', 'Females', 'Others'];
  const rawGenderAnalytics = Array.isArray(dashboardRaw?.data?.usersDashboardAnalytics?.genderAnalytics)
    ? dashboardRaw.data.usersDashboardAnalytics.genderAnalytics
    : [];
  const genderAnalyticsData = genderOrder.map((name) => {
    const matchedItem = rawGenderAnalytics.find((item: any) => String(item?.name || '').toLowerCase() === name.toLowerCase());

    return {
      name,
      count: Number(matchedItem?.count ?? 0),
      percent: Number(matchedItem?.percent ?? 0),
      color: genderColorMap[name],
    };
  });
  const genderDonutChartData = genderAnalyticsData.map((item) => ({
    name: item.name,
    value: item.count,
  }));

  const newUsersGrowthChartData = Array.isArray(dashboardRaw?.data?.newUsersDashboardAnalytics?.userGrowth)
    ? dashboardRaw.data.newUsersDashboardAnalytics.userGrowth.map((item: any) => ({
        month: item?.month || '',
        views: Number(item?.total ?? 0),
      }))
    : [];

  const globalLoyaltyWalletStats = dashboardRaw?.data?.globalloyaltyWalletStats;
  const loyaltyPointsCards: LoyaltyPoints[] = globalLoyaltyWalletStats
    ? [
        {
          id: 1,
          name: 'Total points earned',
          points: Number(globalLoyaltyWalletStats?.totalPointsEarned ?? 0),
        },
        {
          id: 2,
          name: 'Total points redeemed',
          points: Number(globalLoyaltyWalletStats?.totalPointsRedeemed ?? 0),
        },
        {
          id: 3,
          name: 'Average points per user',
          points: Number(globalLoyaltyWalletStats?.averagePointsPerUser ?? 0),
        },
        {
          id: 4,
          name: 'Total points activity',
          points: Number(globalLoyaltyWalletStats?.totalPointsActivity ?? 0),
        },
        {
          id: 5,
          name: 'Total points balance',
          points: Number(globalLoyaltyWalletStats?.totalPointsBalance ?? 0),
        },
      ]
    : loyaltPointsDashboard;

  const topStatCards =
    dashboardStats?.length > 0
      ? dashboardStats?.map((stat: any, index: number) => {
          const growthNumber = Number(stat?.growth ?? 0);
          const growth = Number.isFinite(growthNumber) ? `${growthNumber > 0 ? '+' : ''}${growthNumber?.toFixed(2)}%` : undefined;

          return {
            id: stat?.key || `loyalty-stat-${index}`,
            title: mappedStatsTitle[stat?.key] || stat?.title || 'Members',
            amount: Number(stat?.value ?? 0),
            status: stat?.selectedSubFilter || 'all',
            raise: hideGrowthForKeys.has(stat?.key) ? undefined : growth,
          };
        })
      : loyaltyCardHeaderData.map((card: any) => ({
          ...card,
          raise: hideGrowthForTitles.has(card?.title) ? undefined : card?.raise,
        }));

  const handleTabClick = (tab: TabData) => {
    setMainActive(tab.value);
    router.push(`/${userType}/${tab.link}`);
  };

   // ---- Loading state ----
     if (isLoading || isFetching) {
       return <DashboardSkeleton />;
     }
   

  return (
    <>
      <div className="mt-10 flex w-full flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div
          className={`${global ? 'w-[50%]' : 'w-[90%]'} border-b border-gray-200 text-center text-sm font-medium text-gray-500 dark:border-gray-700 dark:text-gray-400`}
        >
          <ul className="-mb-px flex flex-wrap">
            {tabsData
              .filter((tab) => (global ? tab.value !== 'tiers' : true))
              .map((tab: TabData, index: number) => (
                <li key={index} className="me-0">
                  <div
                    onClick={() => handleTabClick(tab)}
                    className={`inline-block cursor-pointer rounded-t-lg border-b-3 p-4 pb-1 text-[13px] sm:text-[15px] ${
                      mainActive === tab.value
                        ? 'border-[#64748B] font-semibold text-gray-700 dark:text-white'
                        : 'border-transparent text-gray-600 hover:border-gray-300 hover:text-gray-800 dark:text-gray-200 dark:hover:text-gray-300'
                    }`}
                  >
                    {tab.label}
                  </div>
                </li>
              ))}
          </ul>
        </div>
      </div>

      <div className="mt-5 w-full">
        {/* Show select on small screens */}
        <div className="block sm:hidden">
          <Select value={activeDurationTab} onValueChange={setActiveDurationTab}>
            <SelectTrigger className="w-full bg-[#EBEBEB] dark:bg-black dark:text-white">
              <SelectValue placeholder="Select tab" />
            </SelectTrigger>
            <SelectContent className="dark:bg-secondary">
              <SelectItem className="py-3" value="monthly">
                Monthly
              </SelectItem>
              <SelectItem className="py-3" value="daily">
                Daily
              </SelectItem>
              <SelectItem className="py-3" value="weekly">
                Weekly
              </SelectItem>
              <SelectItem className="py-3" value="yearly">
                Yearly
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Show tabs on medium and larger screens */}
        <div className="hidden sm:block">
          <Tabs value={activeDurationTab} onValueChange={setActiveDurationTab} defaultValue="all" className="w-full">
            <TabsList className="flex h-[2.6rem] items-center gap-2 rounded-full border bg-[#EBEBEB] p-1 dark:border-white dark:bg-black">
              <TabsTrigger
                value="monthly"
                className={cn(
                  'text-md relative z-10 cursor-pointer rounded-full px-4 py-2 font-normal transition-colors',
                  'data-[state=active]:font-semibold data-[state=active]:dark:bg-white data-[state=active]:dark:text-black'
                )}
              >
                Monthly
              </TabsTrigger>
              <TabsTrigger
                value="daily"
                className={cn(
                  'text-md relative z-10 cursor-pointer rounded-full px-4 py-2 font-normal transition-colors',
                  'data-[state=active]:font-semibold data-[state=active]:dark:bg-white data-[state=active]:dark:text-black'
                )}
              >
                Daily
              </TabsTrigger>
              <TabsTrigger
                value="weekly"
                className={cn(
                  'text-md relative z-10 cursor-pointer rounded-full px-4 py-2 font-normal transition-colors',
                  'data-[state=active]:font-semibold data-[state=active]:dark:bg-white data-[state=active]:dark:text-black'
                )}
              >
                Weekly
              </TabsTrigger>
              <TabsTrigger
                value="yearly"
                className={cn(
                  'text-md relative z-10 cursor-pointer rounded-full px-4 py-2 font-normal transition-colors',
                  'data-[state=active]:font-semibold data-[state=active]:dark:bg-white data-[state=active]:dark:text-black'
                )}
              >
                Yearly
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>

      {/* --------------- LOYALTY TOP STATS ---------------*/}
      <div className="mt-5 grid grid-cols-1 gap-2 md:grid-cols-3 md:gap-x-4 md:gap-y-4 lg:grid-cols-4">
        {topStatCards?.map((card: any, index: number) => (
          <InvoiceCard key={index} item={card} />
        ))}
      </div>

      {/* --------------- LOYALTY FIRST LAYER --------------- */}
      <div className="mt-5 grid grid-cols-12 gap-4">
        {/* -------------- New Members -------------- */}
        <div className="col-span-12 md:col-span-6">
          <Card className="dark:bg-secondary col-span-12 shadow-md md:col-span-6">
            <CardHeader>
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold">New Members</h3>
              </div>
            </CardHeader>

            <ViewsOverTime
              height={330}
              data={newUsersGrowthChartData}
            />
          </Card>
        </div>

        {/* -------------- Member Activity -------------- */}
        <div className="col-span-12 md:col-span-6">
          <div className="flex flex-col gap-3">
            {/* Member Activity Card */}
            <Card className="dark:bg-secondary w-full shadow-md">
              <CardHeader>
                <div className="flex items-center justify-start">
                  <h3 className="text-xl font-semibold">Member Activity</h3>
                </div>
              </CardHeader>

              <div className="flex-1">
                {/* Active Members */}
                <div className="mx-4 mt-2 flex items-start justify-between gap-4">
                  <h4 className="text-md mb-2 font-medium">Active Members</h4>
                  <h4 className="text-md mb-2 font-medium">{activePercent}%</h4>
                </div>
                <div className="mx-4 flex flex-1 flex-col">
                  <div className="mb-2 h-3 w-full overflow-hidden rounded-full bg-gray-200">
                    <div
                      className="bg-primary h-full transition-all duration-500"
                      style={{ width: `${Math.max(0, Math.min(100, activePercent))}%` }}
                    ></div>
                  </div>
                  <h4 className="text-md mb-2 font-medium">{activeCount}</h4>
                </div>

                {/* Inactive Members */}
                <div className="mx-4 mt-2 flex items-start justify-between">
                  <h4 className="text-md mb-2 font-medium">Inactive Members</h4>
                  <h4 className="text-md mb-2 font-medium">{inactivePercent}%</h4>
                </div>
                <div className="mx-4 flex flex-1 flex-col">
                  <div className="mb-2 h-3 w-full overflow-hidden rounded-full bg-gray-200">
                    <div
                      className="bg-primary h-full transition-all duration-500"
                      style={{ width: `${Math.max(0, Math.min(100, inactivePercent))}%` }}
                    ></div>
                  </div>
                  <h4 className="text-md mb-2 font-medium">{inactiveCount}</h4>
                </div>
              </div>
            </Card>

            {/* Loyalty Cards */}
            <div className="grid gap-5 md:grid-cols-2">
              {(loyaltyMidStatCards.length > 0 ? loyaltyMidStatCards : loyaltyMidCardData?.slice(0, 2)).map((card: any, index: number) => (
                <InvoiceCard key={index} item={card} />
              ))}
            </div>
          </div>
        </div>

        {/* -------------- Age Demographics -------------- */}
        <div className="col-span-12 md:col-span-4">
          <Card className="dark:bg-secondary h-[450px] w-full shadow-md">
            <CardHeader>
              <div className="flex items-center justify-start">
                <h3 className="text-xl font-semibold">Age Demographics</h3>
              </div>
            </CardHeader>
            <div className="flex-1">
              <VisitorAge data={ageDemographicsData} />
              {topAgeGroup.ageGroup && (
                <div className="mx-4 mt-4">
                  <p className="text-muted-foreground text-sm font-medium">
                    <span className="text-xl font-bold text-black dark:text-white">{topAgePercent}%</span> visitors are {topAgeGroup.ageGroup} years old
                  </p>
                </div>
              )}
            </div>
          </Card>
        </div>

        {/* -------------- Location -------------- */}
        <div className="col-span-12 md:col-span-4">
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
              chartData={regionOverviewData}
              chartConfig={{
                males: { label: 'Males', color: '#2563eb' },
                females: { label: 'Females', color: '#202C88' },
                others: { label: 'Others', color: '#7DAEF4' },
              }}
            />
          </Card>
        </div>

        {/* -------------- Gender Analytics -------------- */}
        <div className="col-span-12 md:col-span-4">
          <Card className="dark:bg-secondary h-[450px] gap-0 shadow-md">
            <CardHeader>
              <div className="mb-4 flex items-start justify-between">
                <h3 className="text-xl font-semibold"> Gender Analytics</h3>

                <div className="flex flex-col items-end space-y-1">
                  {genderAnalyticsData.map((item) => (
                    <div key={item.name} className="flex items-center">
                      <div className="mr-2 h-3 w-3 rounded-full" style={{ backgroundColor: item.color }} />
                      <h1 className={`text-[13px] ${item.name === 'Males' || item.name === 'Others' ? 'text-[#7DAEF4]' : ''}`}>
                        {item.name} <span className="font-semibold">({item.percent}% / {item.count})</span>
                      </h1>
                    </div>
                  ))}
                </div>
              </div>
            </CardHeader>
            <GenderDonutChart
              data={genderDonutChartData}
              COLORS={genderOrder.map((item) => genderColorMap[item])}
            />
          </Card>
        </div>
      </div>

      {/* --------------- LOYALTY POINTS ---------------*/}
      <div className="grid-col-12 mt-5 grid">
        <h1 className="mx-2 my-5 text-xl font-semibold">Loyalty Points</h1>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-5">
          {loyaltyPointsCards?.map((item: LoyaltyPoints) => (
            <LoyaltyCard key={item.id} item={item} />
          ))}
        </div>
      </div>

      {/* --------------- LOYALTY SECOND LAYER --------------- */}
      <div className="mt-5 grid grid-cols-12 gap-4">
        {/* --------------- Points activity over time --------------- */}
        <div className="col-span-12 md:col-span-12">
          <Card className="dark:bg-secondary col-span-12 shadow-md md:col-span-6">
            <CardHeader>
              <h3 className="text-md mb-3 font-medium">Points activity over time</h3>
              {/* <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold">+10%</h3>
                <h3 className="text-md font-[400] text-gray-400">
                  Last 90 Days <span className="ml-1 text-green-500">+10%</span>
                </h3>
              </div> */}
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

        {/* --------------- Tier analytics --------------- */}
        {!global && (
          <div className={`col-span-12 ${global ? 'md:col-span-6' : 'md:col-span-4'}`}>
            <Card className="dark:bg-secondary h-[450px] gap-0 shadow-md">
              <CardHeader>
                <div className="mb-4 flex items-start justify-between">
                  <h3 className="text-xl font-semibold"> Tier Analytics</h3>

                  <div className="flex flex-col items-end space-y-1">
                    <div className="flex items-center">
                      <div className="mr-2 h-3 w-3 rounded-full bg-[#2563EB]" />
                      <h1 className="text-[13px]">
                        Guest <span className="font-semibold">(20% / 2000)</span>
                      </h1>
                    </div>
                    <div className="flex items-center">
                      <div className="mr-2 h-3 w-3 rounded-full bg-[#202C88] leading-10" />
                      <h1 className="text-[13px] text-[#7DAEF4]">
                        Members <span className="font-semibold">(20% / 2000)</span>
                      </h1>
                    </div>
                    <div className="flex items-center">
                      <div className="mr-2 h-3 w-3 rounded-full bg-[#7DAEF4] leading-10" />
                      <h1 className="text-[13px] text-[#7DAEF4]">
                        Vip <span className="font-semibold">(10% / 1000)</span>
                      </h1>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <GenderDonutChart
                data={[
                  { name: 'Guest', value: 400 },
                  { name: 'Members', value: 300 },
                  { name: 'Vip', value: 100 },
                ]}
                COLORS={['#2563EB', '#202C88', '#7DAEF4']}
              />
            </Card>
          </div>
        )}

        {/* --------------- Points activity over time --------------- */}
        <div className={`col-span-12 ${global ? 'md:col-span-6' : 'md:col-span-4'}`}>
          <Card className="dark:bg-secondary col-span-12 gap-0 shadow-md md:col-span-6">
            <CardHeader>
              <h3 className="text-md font-medium">Points distribution by activity type</h3>
            </CardHeader>

            <VisitorAge
              noHeaderTotal={false}
              height={370}
              data={[
                { ageGroup: 'Referral', visitors: 300 },
                { ageGroup: 'Purchase', visitors: 250 },
                { ageGroup: 'Socials', visitors: 150 },
                { ageGroup: 'Birthday', visitors: 150 },
                { ageGroup: 'Bonus', visitors: 280 },
                { ageGroup: 'Product', visitors: 200 },
                { ageGroup: 'Loyalty', visitors: 200 },
              ]}
            />
          </Card>
        </div>

        {/* --------------- Status analytics --------------- */}
        <div className={`col-span-12 ${global ? 'md:col-span-6' : 'md:col-span-4'}`}>
          <Card className="dark:bg-secondary h-[450px] gap-0 shadow-md">
            <CardHeader>
              <div className="mb-4 flex items-start justify-between">
                <h3 className="text-xl font-semibold"> Status Analytics</h3>

                <div className="flex flex-col items-end space-y-1">
                  <div className="flex items-center">
                    <div className="mr-2 h-3 w-3 rounded-full bg-[#2563EB]" />
                    <h1 className="text-[13px]">
                      Silver <span className="font-semibold">(20% / 2000)</span>
                    </h1>
                  </div>
                  <div className="flex items-center">
                    <div className="mr-2 h-3 w-3 rounded-full bg-[#202C88] leading-10" />
                    <h1 className="text-[13px] text-[#7DAEF4]">
                      Gold <span className="font-semibold">(20% / 2000)</span>
                    </h1>
                  </div>
                  <div className="flex items-center">
                    <div className="mr-2 h-3 w-3 rounded-full bg-[#7DAEF4] leading-10" />
                    <h1 className="text-[13px] text-[#7DAEF4]">
                      Platinum <span className="font-semibold">(10% / 1000)</span>
                    </h1>
                  </div>
                </div>
              </div>
            </CardHeader>
            <GenderDonutChart
              data={[
                { name: 'Silver', value: 400 },
                { name: 'Gold', value: 300 },
                { name: 'Platinum', value: 100 },
              ]}
              COLORS={['#2563EB', '#202C88', '#7DAEF4']}
            />
          </Card>
        </div>
      </div>

      {/* --------------- REWARDS --------------- */}
      <div className="my-5 mt-8 grid grid-cols-12 gap-4">
        <div className="col-span-12 flex flex-col">
          <h1 className="text-3xl font-bold">Rewards</h1>
          <h1 className="text-md mt-2 text-gray-400">Redeem points for exclusive rewards</h1>
        </div>
      </div>

      <div className="mt-5 grid gap-4 md:grid-cols-3">
        <h1 className="text-lg font-bold">Most Popular</h1>
        <h1 className="text-lg font-bold">Expired</h1>
        <h1 className="text-lg font-bold">Limited Availability</h1>
      </div>

      <div className="mt-3 grid gap-4 md:grid-cols-3">
        <div className="space-y-5">
          {rewardData.map((item, index) => (
            <RewardCard key={index} item={item} />
          ))}
        </div>
        <div className="space-y-5">
          {rewardData.map((item, index) => (
            <RewardCard key={index} item={item} />
          ))}
        </div>
        <div className="space-y-5">
          {rewardDataWithLimitedAvail.map((item, index) => (
            <RewardCard key={index} item={item} />
          ))}
        </div>
      </div>

      <div className="mt-5">
        <Button variant={'outline'} className="cursor-pointer font-bold">
          See All
        </Button>
      </div>

      {/* --------------- SPENDINGS --------------- */}
      <div className="my-5 grid grid-cols-12 gap-4">
        <div className="col-span-12">
          <h1 className="text-2xl font-bold sm:text-3xl">Spendings</h1>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
        {/* --------------- Most Engaged Members --------------- */}
        <div>
          <Card className="dark:bg-secondary col-span-12 gap-0 shadow-lg md:col-span-6">
            <CardHeader>
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold sm:text-xl">Most Engaged Members</h3>
              </div>
            </CardHeader>
            <MostEngagedMembers />
          </Card>
        </div>

        {/* --------------- Members with the Highest Points --------------- */}
        <div>
          <Card className="dark:bg-secondary col-span-12 gap-0 shadow-lg md:col-span-6">
            <CardHeader>
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold sm:text-xl">Members with the Highest Points</h3>
              </div>
            </CardHeader>
            <MostEngagedMembers />
          </Card>
        </div>

        {/* --------------- Total Spending by Members --------------- */}
        <div>
          <Card className="dark:bg-secondary col-span-12 shadow-md md:col-span-6">
            <CardHeader>
              <h3 className="text-xl font-semibold">Total Spending by Members</h3>
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
        </div>

        {/* --------------- Most popular products or services --------------- */}
        <div>
          <Card className="dark:bg-secondary shadow-md">
            <CardHeader>
              <h3 className="text-xl font-semibold">Most popular products or services</h3>
            </CardHeader>
            <VisitorAge
              data={[
                { ageGroup: 'Coffee', visitors: 120 },
                { ageGroup: 'Vodka', visitors: 200 },
                { ageGroup: 'Item', visitors: 150 },
                { ageGroup: 'Item', visitors: 90 },
                { ageGroup: 'Item', visitors: 70 },
                { ageGroup: 'Item', visitors: 70 },
                { ageGroup: 'Item', visitors: 70 },
              ]}
            />
          </Card>
        </div>

        {/* --------------- Spending patterns over time --------------- */}
        <div>
          <Card className="dark:bg-secondary shadow-md">
            <CardHeader>
              <div className="flex items-start justify-between">
                <h3 className="text-lg font-semibold">Spending patterns over time</h3>

                <div className="flex flex-col items-center">
                  <div className="flex items-center">
                    <div className="mr-2 h-3 w-3 rounded-full bg-[#2563EB]" />
                    <h1 className="text-sm">Low Income</h1>
                  </div>
                  <div className="mt-2 flex items-center">
                    <div className="mr-2 h-3 w-3 rounded-full bg-[#202C88]" />
                    <h1 className="text-sm text-[#7DAEF4]">High Income</h1>
                  </div>
                </div>
              </div>
            </CardHeader>
            <VisitorRegion
              chartData={[
                { month: 'January', males: 186, females: 80 },
                { month: 'February', males: 305, females: 200 },
                { month: 'March', males: 237, females: 120 },
                { month: 'April', males: 73, females: 190 },
                { month: 'May', males: 209, females: 130 },
                { month: 'June', males: 214, females: 140 },
              ]}
              chartConfig={{
                males: { label: 'Males', color: '#2563eb' },
                females: { label: 'Females', color: '#7DAEF4' },
              }}
            />
          </Card>
        </div>

        {/* --------------- Spending breakdown by product type --------------- */}
        <div>
          <Card className="dark:bg-secondary shadow-md">
            <CardHeader>
              <div className="flex items-start justify-between">
                <h3 className="text-lg font-semibold">Spending breakdown by product type</h3>
              </div>
            </CardHeader>
            <MostViewedEvent
              chartData={[
                { month: 'Product', search: 189 },
                { month: 'Product', search: 305 },
                { month: 'Product', search: 237 },
                { month: 'Product', search: 73 },
                { month: 'Product', search: 209 },
                { month: 'Product', search: 214 },
                { month: 'Product', search: 314 },
                { month: 'Product', search: 114 },
              ]}
              chartConfig={{
                search: { label: 'Category', color: '#2563EB' },
              }}
            />
          </Card>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-1 md:gap-4">
        {global ? (
          <GlobalLoyaltyTransactionDashboardWidget global={global} />
        ) : (
          <LoyaltyTransactionDashboardWidget global={global} userType={userType} />
        )}
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

export default LoyaltyView;
