import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import React from 'react'
import { MostViewedEvent } from '../invoices'

interface SaleTrendProps {
  chartData?: Array<{ month: string; value: number }>;
  isLoading?: boolean;
}

const saleTrend = ({ chartData, isLoading }: SaleTrendProps) => {
  const mappedData = (chartData ?? []).map((item) => ({
    month: item.month,
    search: item.value,
  }));

    return (
        <div>
            <Card className='h-[450px] dark:bg-[#171717]'>
                <CardHeader className='flex justify-between'>
                    <h1 className='text-2xl font-bold'>
                        Sales Over Time
                    </h1>
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <div className="flex flex-col gap-3 pt-4">
                      <Skeleton className="h-[260px] w-full rounded-lg" />
                    </div>
                  ) : (
                    <MostViewedEvent
                        chartData={mappedData.length > 0 ? mappedData : [
                            { month: "Jan", search: 0 },
                            { month: "Feb", search: 0 },
                            { month: "Mar", search: 0 },
                            { month: "Apr", search: 0 },
                            { month: "May", search: 0 },
                            { month: "Jun", search: 0 },
                        ]}
                        chartConfig={{
                            search: { label: "Sales", color: "#2563EB" },
                        }}
                    />
                  )}
                </CardContent>
            </Card>
        </div>
    )
}

export default saleTrend