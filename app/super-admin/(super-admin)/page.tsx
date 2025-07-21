"use client"
import Header from '@/app/common/header'
import FilterDropdown from '@/components/filter-dropdown/FilterDropdown'
import { Badge } from '@/components/ui/badge'
import { Card, CardHeader } from '@/components/ui/card'
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { cn } from '@/lib/utils'
import { EventPerformanceComparison, FollowerCount, GenderDonutChart, InvoiceCard, invoicesData, MostViewedEvent, TopPerformaningEvents, TransactionHistory, Trend, ViewsOverTime, VisitorAge, VisitorInterest, VisitorRegion } from '@/sections/invoices'
import DashboardCard from '@/sections/invoices/dashboardCard'
import { DashboardCardData } from '@/sections/invoices/data'
import { useMockedUser } from '@/store/store'
import { Settings2, X } from 'lucide-react'
import React from 'react'

const Page = () => {

  const [active, setActive] = React.useState('all');
  const [selectedOptions, setSelectedOptions] = React.useState<string[]>([]);
  const { user } = useMockedUser();
  return (
    <div>
      <Header
        links={[
          { name: "Dashboard", href: "/super-admin" },
          { name: "Home" }
        ]}
      />

      <div className='md:mx-4 mx-1 mt-5'>

        <div className=' flex md:justify-end md:flex-row flex-col-reverse md:items-center gap-2'>
          <div className='flex justify-end md:flex-row flex-col-reverse  md:items-center gap-2'>
            <div className='flex items-center md:justify-center justify-end'>
              <Badge className="bg-white text-black shadow-md px-5 py-1 rounded-2xl text-md flex items-center gap-2 w-fit">
                <Settings2 className="w-5 h-5" />

                <span className="whitespace-nowrap">Filter (3)</span>

                <X className="w-4 h-4 cursor-pointer " onClick={() => setActive('')} />
              </Badge>
            </div>
            <Tabs defaultValue="today" className='w-full  justify-end md:block hidden'>
              <TabsList className='flex items-center gap-2 bg-[#EBEBEB] dark:bg-black dark:border-white border  rounded-full p-1'>
                <TabsTrigger value="today" className={cn(
                  "text-md font-semibold relative z-10 rounded-full px-4 py-2 transition-colors cursor-pointer ",
                )}>Today</TabsTrigger>
                <TabsTrigger value="week" className={cn(
                  "text-md font-semibold relative z-10 rounded-full px-4 py-2 transition-colors cursor-pointer",
                )}>Week</TabsTrigger>
                <TabsTrigger value="month" className={cn(
                  "text-md font-semibold relative z-10 rounded-full px-4 py-2 transition-colors cursor-pointer",
                )}>Month</TabsTrigger>
                <TabsTrigger value="all" className={cn(
                  "text-md font-semibold relative z-10 rounded-full px-4 py-2 transition-colors cursor-pointer",
                )}>All</TabsTrigger>
              </TabsList>
            </Tabs>
            <div className="block md:hidden ">
              <Select>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select timeframe" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="today">Today</SelectItem>
                  <SelectItem value="week">Week</SelectItem>
                  <SelectItem value="month">Month</SelectItem>
                  <SelectItem value="all">All</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
        <div className='grid md:grid-cols-3 lg:grid-cols-4  grid-cols-1 md:gap-x-7 md:gap-y-4 gap-2 mt-5 '>
          {invoicesData.map((item: any) => (
            <InvoiceCard
              key={item?._id}
              item={item}
            />
          ))}
        </div>
        <Card className='shadow-lg mt-10 dark:bg-[#171717]'>
          <CardHeader>
            <div className='flex justify-between items-center'>
              <h3 className='text-xl font-semibold'>Organizer Performance Comparison</h3>
              <div className='flex flex-col items-center'>
                <div className='flex items-center'>
                  <div className='w-3 h-3 rounded-full bg-black mr-2' />
                  <h1 className='text-md leading-6 '>
                    Tickets Sold
                  </h1>
                </div>
                <div className='flex mt-2 items-center'>
                  <div className='w-3 h-3 rounded-full bg-[#7DAEF4] leading-10 mr-2' />
                  <h1 className='text-[#7DAEF4] text-md'>
                    Revenue
                  </h1>
                </div>
              </div>
            </div>
          </CardHeader>
          <EventPerformanceComparison
            chartData={[
              { month: "January", desktop: 700, mobile: 80 },
              { month: "February", desktop: 305, mobile: 200 },
              { month: "March", desktop: 237, mobile: 120 },
              { month: "April", desktop: 73, mobile: 190 },
              { month: "May", desktop: 209, mobile: 130 },
              { month: "June", desktop: 214, mobile: 140 },
              { month: "July", desktop: 300, mobile: 200 },
              { month: "August", desktop: 400, mobile: 300 },
              { month: "September", desktop: 500, mobile: 400 },
              { month: "October", desktop: 600, mobile: 500 },
            ]
            }
            chartConfig={{
              desktop: { label: "Tickets Sold", color: "#2563eb" },
              mobile: { label: "Revenue", color: "#7DAEF4" }
            }}
          />
        </Card>


        <div className='grid md:grid-cols-3 md:gap-x-7 md:gap-y-4 gap-4 mt-10'>

          <div>
            <Card className='shadow-md  w-full max-h-full h-[450px] dark:bg-[#171717]'>
              <CardHeader>
                <div className='flex justify-start items-center'>
                  <h3 className='text-xl font-semibold'>Age Demographics</h3>
                </div>
              </CardHeader>
              <div className='flex-1 '>
                <VisitorAge
                  direction='vertical'
                  data={[
                    { ageGroup: "18", visitors: 120 },
                    { ageGroup: "18-25", visitors: 120 },
                    { ageGroup: "25-34", visitors: 200 },
                    { ageGroup: "35-44", visitors: 150 },
                    { ageGroup: "45-54", visitors: 90 },
                    { ageGroup: "55+", visitors: 70 }

                  ]}
                />
                <div className="mx-4 mt-4">
                  <p className="text-[12px] text-muted-foreground font-medium">
                    <span className="text-xl font-bold dark:text-white text-black">66%</span> visitors are 45-55 years old
                  </p>
                </div>
              </div>
            </Card>

          </div>

          <div>
            <Card className='shadow-md h-[450px]  dark:bg-[#171717]'>
              <CardHeader>
                <div className='flex justify-between items-start '>
                  <h3 className='text-xl font-semibold'>Region Overview</h3>
                  <div className='flex flex-col items-center'>
                    <div className='flex items-center'>
                      <div className='w-3 h-3 rounded-full bg-[#2563EB] mr-2' />
                      <h1 className='text-md leading-6 '>
                        Males
                      </h1>
                    </div>
                    <div className='flex mt-2 items-center'>
                      <div className='w-3 h-3 rounded-full bg-[#202C88] leading-10 mr-2' />
                      <h1 className='text-[#7DAEF4] text-md'>
                        Females
                      </h1>
                    </div>
                    <div className='flex mt-2 items-center'>
                      <div className='w-3 h-3 rounded-full bg-[#7DAEF4] leading-10 mr-2' />
                      <h1 className='text-[#7DAEF4] text-md'>
                        Other
                      </h1>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <VisitorRegion
                chartData={[
                  { month: "Jan", males: 186, females: 80, others: 50 },
                  { month: "Feb", males: 305, females: 200, others: 100 },
                  { month: "Mar", males: 237, females: 120, others: 70 },
                  { month: "Apr", males: 73, females: 190, others: 60 },
                  { month: "May", males: 209, females: 130, others: 90 },
                  { month: "Jun", males: 214, females: 140, others: 80 }
                ]}
                chartConfig={{
                  males: { label: "Males", color: "#2563eb" },
                  females: { label: "Females", color: "#202C88" },
                  others: { label: "Others", color: "#7DAEF4" }
                }}
              />
            </Card>
          </div>
          <div>
            <Card className='shadow-md  h-[450px] dark:bg-[#171717] pb-0 p'>
              <CardHeader className=''>
                <div className='flex justify-between items-start '>
                  <h3 className='text-xl font-semibold'> Gender Analytics</h3>
                  <div className="flex flex-col gap-3 items-start rounded-md">
                    {[
                      { label: "Males", color: "#2563EB", value: "60% / 2000" },
                      { label: "Females", color: "#202C88", value: "20% / 2000" },
                      { label: "Other", color: "#7DAEF4", value: "20% / 2000" },
                    ].map((item, index) => (
                      <div key={index} className="flex items-center justify-between w-full">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                          <span className="text-sm" style={{ color: item.color }}>{item.label}</span>
                        </div>
                        <span className="text-sm text-gray-700 ml-1">{item.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <GenderDonutChart
                  data={[
                    { name: "Males", value: 60 },
                    { name: "Females", value: 20 },
                    { name: "Others", value: 20 }
                  ]}
                  COLORS={["#2563EB", "#202C88", "#7DAEF4"]}
                />
              </CardHeader>
            </Card>
          </div>
        </div>
        <div className='grid grid-cols-12 gap-4 mt-5'>
          <Card className='col-span-12 md:col-span-7 shadow-lg h-[450px]  dark:bg-[#171717]'>
            <CardHeader>
              <div className='flex justify-between items-center'>
                <div className='flex items-start flex-col'>
                  <h3 className='text-xl font-semibold'>Trends</h3>
                  <div className='flex flex-col items-center'>
                    <div className='flex items-center'>
                      <div className='w-3 h-3 rounded-full bg-[#2563EB] mr-2' />
                      <h1 className='text-md leading-6 '>
                        This Month
                      </h1>
                    </div>
                    <div className='flex mt-2 items-center'>
                      <div className='w-3 h-3 rounded-full bg-[#7B7E91] leading-10 mr-2' />
                      <h1 className='text-[#7B7E91] text-md'>
                        Last Month
                      </h1>
                    </div>
                  </div>
                </div>
                <div>
                  <Select defaultValue='totalSales'>
                    <SelectTrigger >
                      <SelectValue placeholder="" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup className='w-auto'>
                        <SelectLabel>Sale</SelectLabel>
                        <SelectItem value="totalSales">Total Sales</SelectItem>
                        <SelectItem value="totalRevenue">Total Revenue</SelectItem>
                        <SelectItem value="totalVisitors">Total Visitors</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            <Trend data={
              [
                { month: "Jan", current: 2400, previous: 2000 },
                { month: "Feb", current: 1398, previous: 1500 },
                { month: "Mar", current: 9800, previous: 6000 },
                { month: "Apr", current: 3908, previous: 3000 },
                { month: "May", current: 4800, previous: 3500 },
                { month: "Jun", current: 3800, previous: 3200 },
                { month: "Jul", current: 4300, previous: 3400 },
              ]
            } />
          </Card>

          <Card className='col-span-12 md:col-span-5 shadow-lg  h-[450px]  dark:bg-[#171717]'>
            <CardHeader>
              <div className='flex justify-between items-center'>
                <h3 className='text-xl font-semibold'>Interest per Category</h3>
                <div className='flex flex-col items-center'>
                  <div className='flex items-center'>
                    <div className='w-3 h-3 rounded-full bg-[#020617] mr-2' />
                    <h1 className='text-md leading-6 '>
                      Males
                    </h1>
                  </div>
                  <div className='flex mt-2 items-center'>
                    <div className='w-3 h-3 rounded-full bg-[#202C88] leading-10 mr-2' />
                    <h1 className='text-[#202C88] text-md'>
                      Females
                    </h1>
                  </div>

                </div>
              </div>
            </CardHeader>
            <VisitorInterest
              chartData={[
                { month: "January", males: 186, females: 80 },
                { month: "February", males: 305, females: 200 },
                { month: "March", males: 237, females: 120 },
                { month: "April", males: 73, females: 190 },
                { month: "May", males: 209, females: 130 },
                { month: "June", males: 214, females: 140 }
              ]}
              chartConfig={{
                males: { label: "Males", color: "#2563EB" },
                females: { label: "Females", color: "#202C88" },
              }}
            />
          </Card>
        </div>
        <div className='grid grid-cols-12 gap-4 mt-5 '>
          <Card className='col-span-12 md:col-span-6 shadow-lg h-[450px]  dark:bg-[#171717]'>
            <CardHeader>
              <div className='flex justify-between items-center'>
                <h3 className='text-xl font-semibold'>Organizer Activity Over Time</h3>
                <div className='flex flex-col items-center'>
                  <Select defaultValue='newEvent'>
                    <SelectTrigger >
                      <SelectValue placeholder="" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup className='w-auto'>
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
                { month: "Jan", views: 2400 },
                { month: "Feb", views: 1398 },
                { month: "Mar", views: 9800 },
                { month: "Apr", views: 3908 },
                { month: "May", views: 4800 },
                { month: "Jun", views: 3800 },
                { month: "Jul", views: 4300 },
                { month: "Aug", views: 5000 },
                { month: "Sep", views: 6000 },
                { month: "Oct", views: 7000 },
                { month: "Nov", views: 8000 },
                { month: "Dec", views: 9000 }
              ]}

            />
          </Card>
          <Card className='col-span-12 md:col-span-6 shadow-lg  h-[450px]  dark:bg-[#171717]'>
            <CardHeader>
              <div className='flex justify-between items-center'>
                <h3 className='text-xl font-semibold'>Top Searches</h3>

              </div>
            </CardHeader>

            <MostViewedEvent
              chartData={[
                { month: "January", search: 189 },
                { month: "February", search: 305 },
                { month: "March", search: 237 },
                { month: "April", search: 73 },
                { month: "May", search: 209 },
                { month: "June", search: 214 }
              ]}
              chartConfig={{
                search: { label: "Search", color: "#2563EB" },
              }}

            />
          </Card>
        </div>
        <div className='grid grid-cols-12 gap-4 mt-5'>
          <Card className='col-span-12 md:col-span-6 shadow-lg h-[550px]  dark:bg-[#171717]'>
            <CardHeader>
              <div className='flex justify-between items-center'>
                <h3 className='text-xl font-semibold'>Growth of Register Users</h3>
                <div className='flex flex-col items-center'>
                  <Select defaultValue='users'>
                    <SelectTrigger >
                      <SelectValue placeholder="" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup className='w-auto'>
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
                { month: "Jan", followers: 1200 },
                { month: "Feb", followers: 1500 },
                { month: "Mar", followers: 1300 },
                { month: "Apr", followers: 1000 },
                { month: "May", followers: 1800 },
                { month: "Jun", followers: 2500 },
                { month: "Jul", followers: 3000 },
                { month: "Aug", followers: 3500 },
                { month: "Sep", followers: 4000 },
                { month: "Oct", followers: 4500 },
                { month: "Nov", followers: 5000 },
                { month: "Dec", followers: 5500 }
              ]}
            />
          </Card>
          <Card className='col-span-12 md:col-span-6 shadow-lg  h-[550px]  dark:bg-[#171717]'>
            <CardHeader>
              <div className='flex justify-between items-center'>
                <h3 className='text-xl font-semibold'>Top Performing Organizers</h3>
              </div>
            </CardHeader>
            <TopPerformaningEvents />
          </Card>
        </div>
        <div className='grid grid-cols-12 mt-5'>
          <Card className='col-span-12 shadow-lg  dark:bg-[#171717]'>
            <CardHeader>
              <div className='flex md:justify-between md:items-center flex-col md:flex-row gap-4'>
                <h3 className='text-xl font-semibold'>Transaction History</h3>
                <div>

                  <div className="w-full">
                    {/* Show select on small screens */}
                    <div className="block sm:hidden">
                      <Select value={active} onValueChange={setActive}>
                        <SelectTrigger className="w-full bg-[#EBEBEB] dark:bg-black dark:text-white">
                          <SelectValue placeholder="Select tab" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All</SelectItem>
                          <SelectItem value="transactions">Transactions</SelectItem>
                          <SelectItem value="refunds">Refunds</SelectItem>
                        </SelectContent>
                      </Select>
                      </div>

                      {/* Show tabs on medium and larger screens */}
                      <div className="hidden sm:block">
                        <Tabs value={active} onValueChange={setActive} defaultValue="all" className="w-full">
                          <TabsList className="flex items-center gap-2 bg-[#EBEBEB] dark:bg-black dark:border-white border rounded-full p-1">
                            <TabsTrigger
                              value="all"
                              className={cn(
                                "text-md font-semibold relative z-10 rounded-full px-4 py-2 transition-colors cursor-pointer"
                              )}
                            >
                              All
                            </TabsTrigger>
                            <TabsTrigger
                              value="transactions"
                              className={cn(
                                "text-md font-semibold relative z-10 rounded-full px-4 py-2 transition-colors cursor-pointer"
                              )}
                            >
                              Transactions
                            </TabsTrigger>
                            <TabsTrigger
                              value="refunds"
                              className={cn(
                                "text-md font-semibold relative z-10 rounded-full px-4 py-2 transition-colors cursor-pointer"
                              )}
                            >
                              Refunds
                            </TabsTrigger>
                          </TabsList>
                        </Tabs>
                      </div>
                    </div>

                  </div>
                  <div className='flex flex-col md:items-center items-end'>
                    <FilterDropdown
                      selectedOptions={selectedOptions}
                      onSelectOption={setSelectedOptions}
                      options={[
                        { id: "user", label: "User" },
                        { id: 'contact', label: 'Contact' },
                        { id: "invoice", label: "Invoice" },
                        { id: 'organizer', label: 'Organizer ' },
                        { id: 'date', label: 'Date' },
                        { id: 'total', label: 'Total' },
                        { id: "transactionType", label: "Transaction Type" },
                        { id: 'status', label: 'Status' },
                      ]}
                    />
                  </div>
                </div>
            </CardHeader>
            <TransactionHistory />
          </Card>
        </div>
        <div className='grid grid-cols-12 gap-4 mt-5'>
          {DashboardCardData.map((item: any, index) => (
            <div key={index} className='col-span-12 md:col-span-4  '>
              <DashboardCard item={item} />
            </div>
          ))}
        </div>


      </div>
    </div>
  )
}

export default Page