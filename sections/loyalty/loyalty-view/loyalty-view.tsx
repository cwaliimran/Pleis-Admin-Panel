'use client';

import FormProvider from '@/components/rhf';
import RHFCustomDropdown from '@/components/rhf/rhf-custom-dropdown';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogOverlay,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useBoolean } from '@/hooks/useBoolean';
import { defaultValues, schema } from '@/lib/schemas/organization-schema';
import { cn } from '@/lib/utils';
import {
  GenderDonutChart,
  InvoiceCard,
  MostViewedEvent,
  ViewsOverTime,
  VisitorAge,
  VisitorRegion,
} from '@/sections/invoices';
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
import LoyaltyList from '@/sections/loyalty/loyaltyList';
import RewardCard from '@/sections/loyalty/rewardCard';
import { yupResolver } from '@hookform/resolvers/yup';
import { Settings2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React from 'react';
import { useForm } from 'react-hook-form';

const LoyaltyView = ({
  global,
  userType,
}: {
  global: boolean;
  userType: string;
}) => {
  const openModal = useBoolean();
  const router = useRouter();

  const methods = useForm({
    resolver: yupResolver(schema),
    defaultValues: defaultValues,
  });

  const onSubmit = () => {};

  const [mainActive, setMainActive] = React.useState('overview');
  const [activeTransactionTab, setActiveTransactionTab] = React.useState('all');
  const [activeDurationTab, setActiveDurationTab] = React.useState('monthly');

  const activePercent = 75;
  const inactivePercent = 25;

  const handleTabClick = (tab: TabData) => {
    setMainActive(tab.value);
    router.push(`/organizer/${tab.link}`);
  };

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

        {/* Action Buttons */}
        <div className="flex w-full items-center gap-2 md:justify-end">
          {userType === 'super-admin' && global === false && (
            <>
              <FormProvider
                methods={methods}
                onSubmit={methods.handleSubmit(onSubmit)}
              >
                <div className="w-full rounded-md bg-white md:w-[240px] lg:w-[240px] dark:bg-[#171717]">
                  <RHFCustomDropdown
                    name="organizations"
                    placeholder="Select Organization"
                    options={[
                      { value: 'org1', label: 'Organization 1' },
                      { value: 'org2', label: 'Organization 2' },
                      { value: 'org3', label: 'Organization 3' },
                    ]}
                    isLoading={false}
                    showNone={false}
                  />
                </div>
              </FormProvider>
            </>
          )}
          <Badge className="text-md flex cursor-pointer items-center gap-2 rounded-3xl border border-gray-300 bg-white px-4 py-2 text-black">
            <Settings2 className="h-5 w-5" />
            <span className="whitespace-nowrap">Filter</span>
          </Badge>
          {/* <Button
            className="bg-primary border-primary flex cursor-pointer items-center gap-2 rounded-3xl border px-4 py-2 text-white transition-colors"
            onClick={openModal.onTrue}
          >
            <Plus />
            Create Program
          </Button> */}
        </div>
      </div>

      <div className="mt-5 w-full">
        {/* Show select on small screens */}
        <div className="block sm:hidden">
          <Select
            value={activeDurationTab}
            onValueChange={setActiveDurationTab}
          >
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
          <Tabs
            value={activeDurationTab}
            onValueChange={setActiveDurationTab}
            defaultValue="all"
            className="w-full"
          >
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
        {loyaltyCardHeaderData?.map((card: any, index) => (
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
                      style={{ width: `${activePercent}%` }}
                    ></div>
                  </div>
                  <h4 className="text-md mb-2 font-medium">6000</h4>
                </div>

                {/* Inactive Members */}
                <div className="mx-4 mt-2 flex items-start justify-between">
                  <h4 className="text-md mb-2 font-medium">Inactive Members</h4>
                  <h4 className="text-md mb-2 font-medium">
                    {inactivePercent}%
                  </h4>
                </div>
                <div className="mx-4 flex flex-1 flex-col">
                  <div className="mb-2 h-3 w-full overflow-hidden rounded-full bg-gray-200">
                    <div
                      className="bg-primary h-full transition-all duration-500"
                      style={{ width: `${inactivePercent}%` }}
                    ></div>
                  </div>
                  <h4 className="text-md mb-2 font-medium">2000</h4>
                </div>
              </div>
            </Card>

            {/* Loyalty Cards */}
            <div className="grid gap-5 md:grid-cols-2">
              {loyaltyMidCardData?.slice(0, 2).map((card: any, index) => (
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
        </div>

        {/* -------------- Gender Analytics -------------- */}
        <div className="col-span-12 md:col-span-4">
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
        </div>
      </div>

      {/* --------------- LOYALTY POINTS ---------------*/}
      <div className="grid-col-12 mt-5 grid">
        <h1 className="mx-2 my-5 text-xl font-semibold">Loyalty Points</h1>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-5">
          {loyaltPointsDashboard?.map((item: LoyaltyPoints) => (
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
              <h3 className="text-md mb-3 font-medium">
                Points activity over time
              </h3>
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold">+10%</h3>
                <h3 className="text-md font-[400] text-gray-400">
                  Last 90 Days <span className="ml-1 text-green-500">+10%</span>
                </h3>
              </div>
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

        {/* --------------- Points activity over time --------------- */}
        <div className="col-span-12 md:col-span-6">
          <Card className="dark:bg-secondary col-span-12 gap-0 shadow-md md:col-span-6">
            <CardHeader>
              <h3 className="text-md font-medium">
                Points distribution by activity type
              </h3>
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

        {/* --------------- Tier analytics --------------- */}
        <div className="col-span-12 md:col-span-6">
          <Card className="dark:bg-secondary h-[450px] gap-0 shadow-md">
            <CardHeader>
              <div className="mb-4 flex items-start justify-between">
                <h3 className="text-xl font-semibold"> Tier Analytics</h3>

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
                      Platinum{' '}
                      <span className="font-semibold">(10% / 1000)</span>
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
          <h1 className="text-md mt-2 text-gray-400">
            Redeem points for exclusive rewards
          </h1>
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
                <h3 className="text-lg font-semibold sm:text-xl">
                  Most Engaged Members
                </h3>
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
                <h3 className="text-lg font-semibold sm:text-xl">
                  Members with the Highest Points
                </h3>
              </div>
            </CardHeader>
            <MostEngagedMembers />
          </Card>
        </div>

        {/* --------------- Total Spending by Members --------------- */}
        <div>
          <Card className="dark:bg-secondary col-span-12 shadow-md md:col-span-6">
            <CardHeader>
              <h3 className="text-xl font-semibold">
                Total Spending by Members
              </h3>
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
              <h3 className="text-xl font-semibold">
                Most popular products or services
              </h3>
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
                <h3 className="text-lg font-semibold">
                  Spending patterns over time
                </h3>

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
                <h3 className="text-lg font-semibold">
                  Spending breakdown by product type
                </h3>
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

      <div className="mt-5 grid grid-cols-1 md:gap-4">
        <Card className="dark:bg-secondary gap-0 shadow-md">
          <CardHeader>
            <div className="mb-3 flex flex-col items-center gap-4 md:flex-row md:justify-between">
              <div className="w-full pl-4">
                {/* Show select on small screens */}
                <div className="block sm:hidden">
                  <Select
                    value={activeTransactionTab}
                    onValueChange={setActiveTransactionTab}
                  >
                    <SelectTrigger className="w-full bg-[#EBEBEB] dark:bg-black dark:text-white">
                      <SelectValue placeholder="Select tab" />
                    </SelectTrigger>
                    <SelectContent className="dark:bg-secondary">
                      <SelectItem className="py-3" value="all">
                        All
                      </SelectItem>
                      <SelectItem className="py-3" value="transactions">
                        Transactions
                      </SelectItem>
                      <SelectItem className="py-3" value="refunds">
                        Refunds
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Show tabs on medium and larger screens */}
                <div className="hidden sm:block">
                  <Tabs
                    value={activeTransactionTab}
                    onValueChange={setActiveTransactionTab}
                    defaultValue="all"
                    className="w-full"
                  >
                    <TabsList className="flex h-[2.8rem] items-center gap-2 rounded-full border bg-[#EBEBEB] p-1 dark:border-white dark:bg-black">
                      <TabsTrigger
                        value="all"
                        className={cn(
                          'text-md relative z-10 cursor-pointer rounded-full px-4 py-2 font-semibold transition-colors',
                          'data-[state=active]:font-semibold data-[state=active]:dark:bg-white data-[state=active]:dark:text-black'
                        )}
                      >
                        All
                      </TabsTrigger>
                      <TabsTrigger
                        value="transactions"
                        className={cn(
                          'text-md relative z-10 cursor-pointer rounded-full px-4 py-2 font-semibold transition-colors',
                          'data-[state=active]:font-semibold data-[state=active]:dark:bg-white data-[state=active]:dark:text-black'
                        )}
                      >
                        Transactions
                      </TabsTrigger>
                      <TabsTrigger
                        value="refunds"
                        className={cn(
                          'text-md relative z-10 cursor-pointer rounded-full px-4 py-2 font-semibold transition-colors',
                          'data-[state=active]:font-semibold data-[state=active]:dark:bg-white data-[state=active]:dark:text-black'
                        )}
                      >
                        Refunds
                      </TabsTrigger>
                    </TabsList>
                  </Tabs>
                </div>
              </div>

              <Badge className="text-md flex cursor-pointer items-center gap-2 rounded-sm bg-white px-3 py-1 text-black shadow-md">
                <Settings2 className="h-5 w-5" />
                <span className="whitespace-nowrap">By Profile</span>
              </Badge>
            </div>
          </CardHeader>

          <CardContent>
            <LoyaltyList />
          </CardContent>
        </Card>
      </div>

      <Dialog open={openModal.value} onOpenChange={openModal.onToggle}>
        <DialogOverlay className="bg-opacity-30 fixed inset-0 flex items-center justify-center bg-white">
          <DialogContent>
            <DialogTitle>Create Program </DialogTitle>
            <div className="flex flex-col gap-4">
              <input
                type="text"
                placeholder="Organizer Name"
                className="z-10 rounded-md p-2 shadow-md"
              />
              <input
                type="email"
                placeholder="Email"
                className="z-10 rounded-md p-2 shadow-md"
              />
              <input
                type="tel"
                placeholder="Phone Number"
                className="z-10 rounded-md p-2 shadow-md"
              />
              <input
                type="text"
                placeholder="Address"
                className="z-10 rounded-md p-2 shadow-md"
              />
            </div>
            <div className="mt-4 flex justify-end">
              <Button
                onClick={openModal.onFalse}
                variant={'outline'}
                className="mr-2 cursor-pointer"
              >
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
