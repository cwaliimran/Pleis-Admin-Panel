'use client';
import FilterDropdown from '@/components/filter-dropdown/FilterDropdown';
import { Button } from '@/components/ui/button';
import { Card, CardHeader } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import {
  EventPerformanceComparison,
  FollowerCount,
  GenderDonutChart,
  InvoiceCard,
  MostViewedEvent,
  TopPerformaningEvents,
  TransactionHistory,
  Trend,
  ViewsOverTime,
  VisitorAge,
  VisitorInterest,
  VisitorRegion,
} from '@/sections/invoices';
import { invoicesData2 } from '@/sections/invoices/data';
import { useEffect, useState } from 'react';
import Header from '../../../common/header';

const Page = () => {
  const [active, setActive] = useState('all');
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [hasScrolledToBottom, setHasScrolledToBottom] = useState(false);

  useEffect(() => {
    setShowTermsModal(true);
  }, []);

  const handleTermsSubmit = () => {
    if (acceptedTerms) {
      setShowTermsModal(false);
    }
  };

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
    if (scrollTop + clientHeight >= scrollHeight - 10) {
      setHasScrolledToBottom(true);
    }
  };

  return (
    <div>
      <Header
        links={[
          { name: 'Dashboard', href: '/organizer/dashboard' },
          { name: 'Home' },
        ]}
      />

      <div className="mx-1 mt-5 pb-12 md:mx-4">
        <div className="flex flex-col-reverse gap-2 md:flex-row md:items-center md:justify-end">
          <div className="flex flex-col-reverse justify-end gap-2 md:flex-row md:items-center">
            <div className="flex items-center justify-end md:justify-center">
              {/* <Badge className="bg-white text-black shadow-md px-5 py-1 rounded-2xl text-md flex items-center gap-2 w-fit">
                <Settings2 className="w-5 h-5" />

                <span className="whitespace-nowrap">Filter (3)</span>

                <X
                  className="w-4 h-4 cursor-pointer "
                  onClick={() => setActive("")}
                />
              </Badge> */}
            </div>
            <Tabs
              defaultValue="today"
              className="hidden w-full justify-end md:block"
            >
              <TabsList className="flex items-center gap-2 rounded-full border bg-[#EBEBEB] p-1 dark:border-white dark:bg-black">
                <TabsTrigger
                  value="today"
                  className={cn(
                    'text-md relative z-10 cursor-pointer rounded-full px-4 py-2 font-semibold transition-colors'
                  )}
                >
                  Today
                </TabsTrigger>
                <TabsTrigger
                  value="week"
                  className={cn(
                    'text-md relative z-10 cursor-pointer rounded-full px-4 py-2 font-semibold transition-colors'
                  )}
                >
                  Week
                </TabsTrigger>
                <TabsTrigger
                  value="month"
                  className={cn(
                    'text-md relative z-10 cursor-pointer rounded-full px-4 py-2 font-semibold transition-colors'
                  )}
                >
                  Month
                </TabsTrigger>
                <TabsTrigger
                  value="all"
                  className={cn(
                    'text-md relative z-10 cursor-pointer rounded-full px-4 py-2 font-semibold transition-colors'
                  )}
                >
                  All
                </TabsTrigger>
              </TabsList>
            </Tabs>
            <div className="block md:hidden">
              <Select>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select timeframe" />
                </SelectTrigger>
                <SelectContent className="dark:bg-secondary">
                  <SelectItem value="today">Today</SelectItem>
                  <SelectItem value="week">Week</SelectItem>
                  <SelectItem value="month">Month</SelectItem>
                  <SelectItem value="all">All</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
        <div className="mt-5 grid grid-cols-1 gap-2 md:grid-cols-2 md:gap-x-4 md:gap-y-4 lg:grid-cols-4">
          {invoicesData2.map((item: any) => (
            <InvoiceCard key={item?._id} item={item} />
          ))}
        </div>
        {/* event performance comparsion */}
        <Card className="dark:bg-secondary mt-5 shadow-lg lg:mt-10">
          <CardHeader>
            <div className="items-center justify-between lg:flex">
              <h3 className="text-xl font-semibold">
                Event Performance Comparison
              </h3>
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
                  <h3 className="text-xl font-semibold">
                    Visitor Age Demographics
                  </h3>
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

          <div>
            {/* Visitor Region Overview */}
            <Card className="dark:bg-secondary h-[450px] shadow-lg">
              <CardHeader>
                <div className="items-center justify-between md:flex">
                  <h3 className="text-xl font-semibold">
                    Visitor Region Overview
                  </h3>
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
                <div className="items-center justify-between md:flex">
                  <h3 className="text-xl font-semibold">
                    Visitor Gender Analytics
                  </h3>
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
                        <SelectItem value="totalSales">Total Sales</SelectItem>
                        <SelectItem value="totalRevenue">
                          Total Revenue
                        </SelectItem>
                        <SelectItem value="totalVisitors">
                          Total Visitors
                        </SelectItem>
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
        <div className="mt-5 grid grid-cols-12">
          <Card className="dark:bg-secondary col-span-12 shadow-lg">
            <CardHeader>
              {/* <div className="flex md:justify-between md:items-center flex-col md:flex-row gap-4"> */}
              <div className="grid grid-cols-3 items-center gap-4">
                <h3 className="text-xl font-semibold">Transaction History</h3>

                {/* Show select on small screens */}
                <div className="block sm:hidden">
                  <Select value={active} onValueChange={setActive}>
                    <SelectTrigger className="w-full bg-[#EBEBEB] dark:bg-black dark:text-white">
                      <SelectValue placeholder="Select tab" />
                    </SelectTrigger>
                    <SelectContent className="dark:bg-secondary">
                      <SelectItem value="all">All</SelectItem>
                      <SelectItem value="transactions">Transactions</SelectItem>
                      <SelectItem value="refunds">Refunds</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="hidden w-full md:block">
                  <Tabs
                    value={active}
                    onValueChange={setActive}
                    defaultValue="all"
                    className="w-full"
                  >
                    <TabsList className="flex items-center gap-2 rounded-full border bg-[#EBEBEB] p-1 dark:border-white dark:bg-black">
                      <TabsTrigger
                        value="all"
                        className={cn(
                          'text-md relative z-10 cursor-pointer rounded-full px-4 py-2 font-semibold transition-colors'
                        )}
                      >
                        All
                      </TabsTrigger>
                      <TabsTrigger
                        value="transactions"
                        className={cn(
                          'text-md relative z-10 cursor-pointer rounded-full px-4 py-2 font-semibold transition-colors'
                        )}
                      >
                        Transactions
                      </TabsTrigger>
                      <TabsTrigger
                        value="refunds"
                        className={cn(
                          'text-md relative z-10 cursor-pointer rounded-full px-4 py-2 font-semibold transition-colors'
                        )}
                      >
                        Refunds
                      </TabsTrigger>
                    </TabsList>
                  </Tabs>
                </div>

                <div className="flex items-center justify-end">
                  <FilterDropdown
                    selectedOptions={selectedOptions}
                    onSelectOption={setSelectedOptions}
                    options={[
                      { id: 'user', label: 'User' },
                      { id: 'contact', label: 'Contact' },
                      { id: 'invoice', label: 'Invoice' },
                      { id: 'organizer', label: 'Organizer ' },
                      { id: 'date', label: 'Date' },
                      { id: 'total', label: 'Total' },
                      { id: 'transactionType', label: 'Transaction Type' },
                      { id: 'status', label: 'Status' },
                    ]}
                  />
                </div>
              </div>
            </CardHeader>
            <TransactionHistory />
          </Card>
        </div>
        {/* <div className='grid grid-cols-12 gap-4 mt-5'>
                    {DashboardCardData.map((item: any, index) => (
                        <div key={index} className='col-span-12 md:col-span-4  '>
                            <DashboardCard item={item} />
                        </div>
                    ))}
                </div> */}
      </div>

      {/* Terms and Conditions Modal */}
      <Dialog open={showTermsModal} onOpenChange={() => {}}>
        <DialogContent className="max-h-[80vh] max-w-2xl border-none p-0 [&>button]:hidden">
          <DialogHeader className="p-6 pb-0">
            <DialogTitle className="text-2xl font-bold">
              Terms and Conditions
            </DialogTitle>
          </DialogHeader>

          <div className="px-6">
            <div
              className="max-h-[400px] space-y-4 overflow-y-auto pr-4 text-sm"
              onScroll={handleScroll}
            >
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">
                  1. Acceptance of Terms
                </h3>
                <p>
                  By accessing and using this platform, you accept and agree to
                  be bound by the terms and provision of this agreement. If you
                  do not agree to abide by the above, please do not use this
                  service.
                </p>

                <h3 className="text-lg font-semibold">2. Use License</h3>
                <p>
                  Permission is granted to temporarily download one copy of the
                  materials on our platform for personal, non-commercial
                  transitory viewing only. This is the grant of a license, not a
                  transfer of title, and under this license you may not:
                </p>
                <ul className="list-disc space-y-1 pl-6">
                  <li>modify or copy the materials;</li>
                  <li>
                    use the materials for any commercial purpose or for any
                    public display (commercial or non-commercial);
                  </li>
                  <li>
                    attempt to decompile or reverse engineer any software
                    contained on the platform;
                  </li>
                  <li>
                    remove any copyright or other proprietary notations from the
                    materials.
                  </li>
                </ul>

                <h3 className="text-lg font-semibold">3. Disclaimer</h3>
                <p>
                  The materials on our platform are provided on an as is basis.
                  We make no warranties, expressed or implied, and hereby
                  disclaim and negate all other warranties including without
                  limitation, implied warranties or conditions of
                  merchantability, fitness for a particular purpose, or
                  non-infringement of intellectual property or other violation
                  of rights.
                </p>

                <h3 className="text-lg font-semibold">4. Limitations</h3>
                <p>
                  In no event shall our company or its suppliers be liable for
                  any damages (including, without limitation, damages for loss
                  of data or profit, or due to business interruption) arising
                  out of the use or inability to use the materials on our
                  platform, even if we or our authorized representative has been
                  notified orally or in writing of the possibility of such
                  damage. Because some jurisdictions do not allow limitations on
                  implied warranties, or limitations of liability for
                  consequential or incidental damages, these limitations may not
                  apply to you.
                </p>

                <h3 className="text-lg font-semibold">5. Privacy Policy</h3>
                <p>
                  Your privacy is important to us. Our Privacy Policy explains
                  how we collect, use, and protect your information when you use
                  our platform. By using our platform, you agree to the
                  collection and use of information in accordance with our
                  Privacy Policy.
                </p>

                <h3 className="text-lg font-semibold">
                  6. User Responsibilities
                </h3>
                <p>
                  As a user of this platform, you are responsible for
                  maintaining the confidentiality of your account and password
                  and for restricting access to your computer. You agree to
                  accept responsibility for all activities that occur under your
                  account or password.
                </p>

                <h3 className="text-lg font-semibold">7. Governing Law</h3>
                <p>
                  These terms and conditions are governed by and construed in
                  accordance with the laws and you irrevocably submit to the
                  exclusive jurisdiction of the courts in that state or
                  location.
                </p>

                <p className="pt-4 text-xs text-gray-500">
                  Last updated: July 2025
                </p>
              </div>
            </div>
          </div>

          <div className="border-t p-6 pt-4">
            <div className="mb-4 flex items-center space-x-2">
              <Checkbox
                id="accept-terms"
                checked={acceptedTerms}
                className={`cursor-pointer border border-black ${acceptedTerms ? 'dark:border-primary' : 'dark:border-white'}`}
                onCheckedChange={(checked) =>
                  setAcceptedTerms(checked as boolean)
                }
                disabled={!hasScrolledToBottom}
              />
              <label
                htmlFor="accept-terms"
                className={`text-sm leading-none font-medium peer-disabled:cursor-not-allowed ${
                  !hasScrolledToBottom ? 'text-gray-400' : 'cursor-pointer'
                }`}
              >
                I accept the Terms and Conditions
              </label>
            </div>

            <div className="flex justify-end space-x-2">
              <Button
                onClick={handleTermsSubmit}
                disabled={!acceptedTerms}
                className="w-full md:w-auto"
              >
                Continue to Dashboard
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Page;
