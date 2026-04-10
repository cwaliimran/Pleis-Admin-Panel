import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import React from 'react'
import { VisitorRegion } from '../invoices'

interface RegionOverviewProps {
  data?: Array<{
    region: string;
    males: number;
    females: number;
    others: number;
  }>;
  isLoading?: boolean;
}

const RegionOverview = ({ data = [], isLoading = false }: RegionOverviewProps) => {
  const chartData = data.length > 0
    ? data.map((item) => ({
        month: item.region,
        males: Number(item.males ?? 0),
        females: Number(item.females ?? 0),
        others: Number(item.others ?? 0),
      }))
    : [
        { month: 'Asia', males: 0, females: 0, others: 0 },
        { month: 'Europe', males: 0, females: 0, others: 0 },
        { month: 'Africa', males: 0, females: 0, others: 0 },
        { month: 'Americas', males: 0, females: 0, others: 0 },
        { month: 'Oceania', males: 0, females: 0, others: 0 },
        { month: 'Other', males: 0, females: 0, others: 0 },
      ]

  return (
    <Card className='shadow-lg h-[450px] dark:bg-[#171717]'>
      <CardHeader>
        <div className='flex justify-between items-center'>
          <h3 className='text-xl font-semibold'>Region Overview</h3>
          <div className='flex flex-col items-center'>
            <div className='flex items-center'>
              <div className='w-3 h-3 rounded-full bg-[#2563EB] mr-2' />
              <h1 className='text-md leading-6 '>Males</h1>
            </div>
            <div className='flex mt-2 items-center'>
              <div className='w-3 h-3 rounded-full bg-[#202C88] leading-10 mr-2' />
              <h1 className='text-[#202C88] text-md'>Females</h1>
            </div>
            <div className='flex mt-2 items-center'>
              <div className='w-3 h-3 rounded-full bg-[#7DAEF4] leading-10 mr-2' />
              <h1 className='text-[#7DAEF4] text-md'>Others</h1>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <Skeleton className='h-[270px] w-full rounded-lg' />
        ) : (
          <VisitorRegion
            chartData={chartData}
            chartConfig={{
              males: { label: 'Males', color: '#2563EB' },
              females: { label: 'Females', color: '#202C88' },
              others: { label: 'Others', color: '#7DAEF4' },
            }}
          />
        )}
      </CardContent>
    </Card>
  )
}

export default RegionOverview