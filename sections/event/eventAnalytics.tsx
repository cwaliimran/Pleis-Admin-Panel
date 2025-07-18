import React from 'react'
import { GenderDonutChart, Trend, VisitorAge } from '../invoices'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import TicketPerformanceChart from './ticketPerformance';
import { eventTabForAnalytics } from './data';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import { Badge, Calendar } from 'lucide-react';

const EventAnalytics = () => {

  const [active, setActive] = React.useState("fromSales");
  return (
    <div className='grid grid-cols-12 gap-4'>
      {/* <div className='flex justify-end items-center'>
        <Badge className="bg-white text-black shadow-md px-5 py-1 rounded-2xl text-md flex items-center gap-2 w-fit">
          <Calendar className="w-5 h-5" />

          <span className="whitespace-nowrap">Filter (3)</span>
        </Badge>
      </div> */}
      <div className='md:col-span-4 col-span-12  '>
        <Card className='mb-3  shadow-md dark:bg-[#171717]'>
          <CardHeader>
            <h3 className='text-xl font-semibold '>Engagement</h3>
          </CardHeader>
          <CardContent className=''>
            <div className="flex justify-between items-center tex-md">
              <h1 className="text-slate-500 font-semibold">
                Clicks
              </h1>
              <h1 className="text-slate-500 ">2,300</h1>
            </div>
            <div className="mt-2 flex justify-between items-start gap-4">
              <div className="flex-1 flex flex-col">
                <div className="w-full h-2 bg-gray-200 rounded-full mb-2 overflow-hidden">
                  <div className="h-full bg-blue-600 transition-all duration-500 w-5/6"></div>
                </div>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <h1 className="text-slate-500 font-semibold">
                Clicks
              </h1>
              <h1 className="text-slate-500 ">2,300</h1>
            </div>
            <div className="mt-2 flex justify-between items-start gap-4">
              <div className="flex-1 flex flex-col">
                <div className="w-full h-2 bg-gray-200 rounded-full mb-2 overflow-hidden">
                  <div className="h-full bg-blue-600 transition-all duration-500 w-5/6"></div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className='shadow-md dark:bg-[#171717] pb-0 mb-3'>
          <CardHeader>
            <h3 className='text-xl font-semibold '> Views</h3>
          </CardHeader>
          <CardContent className='!p-0'>
            <VisitorAge
              direction='horizontal'
              data={[
                { ageGroup: "Mon", visitors: 120 },
                { ageGroup: "Tue", visitors: 120 },
                { ageGroup: "Wed", visitors: 200 },
                { ageGroup: "Thu", visitors: 150 },
                { ageGroup: "Fri", visitors: 90 },
                { ageGroup: "Sat", visitors: 70 },
                { ageGroup: "Sun", visitors: 70 }

              ]}
            />
          </CardContent>
          <div className="mx-4 mb-2">
            <p className="text-[12px] text-muted-foreground font-medium">
              <span className="text-xl font-bold dark:text-white text-black">30%</span> Sales performance is 30%
              better compare to last month
            </p>
          </div>
          {/* </CardHeader> */}
        </Card>
        <Card className='shadow-md   dark:bg-[#171717] pb-0'>
          <CardHeader className=''>
            <h3 className='text-xl font-semibold text-center'> Gender Analytics</h3>

            <CardContent className='p-0'>
              <GenderDonutChart
                size={120}
                data={[
                  { name: "Males", value: 60 },
                  { name: "Females", value: 20 },
                  { name: "Others", value: 20 }
                ]}
                COLORS={["#2563EB", "#202C88", "#7DAEF4"]}
              />
            </CardContent>
            <div className='flex flex-col '>
              <div className='flex justify-between px-4'>
                <div className='flex items-center mb-2'>
                  <div className='w-3 h-3 rounded-full bg-[#2563EB] mr-2' />
                  <h1 className='text-md leading-6 '>
                    Old
                  </h1>
                </div>
                <h1>300</h1>
              </div>
              <div className='flex justify-between px-4'>
                <div className='flex mt-2 text-center '>
                  <div className='w-3 h-3 rounded-full bg-[#202C88] leading-10 mr-2' />
                  <h1 className='text-[#7DAEF4] text-md'>
                    Others
                  </h1>
                </div>
                <h1 >100</h1>
              </div>
              <div className='flex justify-between px-4'>
                <div className='flex mt-2 items-center '>
                  <div className='w-3 h-3 rounded-full bg-[#7DAEF4] leading-10 mr-2' />
                  <h1 className='text-[#7DAEF4] text-md'>
                    New
                  </h1>
                </div>
                <h1>400</h1>
              </div>
            </div>
          </CardHeader>
        </Card>
      </div>
      <div className='md:col-span-8 col-span-12 '>
        <Card className='shadow-md dark:bg-[#171717] h-[450px]'>
          <CardHeader> <h3 className='text-xl font-semibold'> Ticket Performance </h3> </CardHeader>
          <CardContent>
            <TicketPerformanceChart
              data={[
                { day: 'Mon', value: 3000 },
                { day: 'Tue', value: 2000 },
                { day: 'Wed', value: 4000 },
                { day: 'Thu', value: 3500 },
                { day: 'Fri', value: 5000 },
                { day: 'Sat', value: 6500 },
                { day: 'Sun', value: 5500 },
              ]}
            />
          </CardContent>
        </Card>
        <Card className='mt-10 h-[500px] shadow-md dark:bg-[#171717]'>
          <CardHeader>
            <div className='flex md:flex-row flex-col justify-between items-center gap-4'>
              <div>
                <h3 className='text-xl font-semibold'> Total Revenue </h3>
                <h3 className='text-2xl font-bold'>12, 026e</h3>
              </div>
              <div>
                <Tabs value={active} onValueChange={setActive} defaultValue="all" className='w-full  text-end'>
                  <TabsList className='flex items-end  gap-2 bg-[#EBEBEB] dark:bg-black dark:border-white border  rounded-full p-1'>
                    {eventTabForAnalytics.map((tab: any) => (
                      <TabsTrigger
                        key={tab.value}
                        value={tab.value}
                        className={cn(
                          "text-sm font-semibold relative z-10 rounded-full  py-2 transition-colors cursor-pointer",
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
          </CardHeader>
          <CardContent>
            <Trend
              previousLineStyle="solid"
              data={
                [
                  { month: "Jan", current: 2400, previous: 2000 },
                  { month: "Feb", current: 1398, previous: 1500 },
                  { month: "Mar", current: 9800, previous: 6000 },
                  { month: "Apr", current: 3908, previous: 3000 },
                  { month: "May", current: 4800, previous: 3500 },
                  { month: "Jun", current: 3800, previous: 3200 },
                  { month: "Jul", current: 4300, previous: 3400 },
                ]
              }
            />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default EventAnalytics