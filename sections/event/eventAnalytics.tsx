import React from 'react'
import { GenderDonutChart, VisitorAge } from '../invoices'
import { Card, CardContent, CardHeader } from '@/components/ui/card'

const EventAnalytics = () => {

  const totalDays = 30;
  const remainingDays = 5;
  const progressPercent = ((totalDays - remainingDays) / totalDays) * 100;
  return (
    <div className='grid grid-cols-12 gap-4'>
      <div className='md:col-span-4 col-span-12  '>
        <Card>
          <CardHeader>
            <h3 className='text-xl font-semibold '>Engagement</h3>
          </CardHeader>
          <CardContent className=''>
            <div className="flex justify-between items-center mt-4">
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
        <Card className='shadow-md h-[450px]  dark:bg-[#171717] pb-0 mb-3'>
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
      <div className='md:col-span-8 col-span-12 border '></div>
    </div>
  )
}

export default EventAnalytics