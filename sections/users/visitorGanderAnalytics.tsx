import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import React from 'react'
import { GenderDonutChart } from '../invoices'

interface VisitorGanderAnalyticsProps {
    data?: Array<{
        name: string;
        count: number;
        percent?: number;
    }>;
    isLoading?: boolean;
}

const VisitorGanderAnalytics = ({ data = [], isLoading = false }: VisitorGanderAnalyticsProps) => {
    const chartData = data.length > 0
        ? data.map((item) => ({
            name: item.name,
            value: Number(item.count ?? 0),
        }))
        : [
            { name: 'Males', value: 0 },
            { name: 'Females', value: 0 },
            { name: 'Others', value: 0 },
        ]

    return (
        <div>
            <Card className='shadow-lg p-0 m-0 h-[450px] dark:bg-[#171717]'>
                <CardHeader>
                    <div className='flex justify-between items-center'>
                        <h3 className='text-xl font-semibold'>Visitor Gender Analytics</h3>
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
                                    Others
                                </h1>
                            </div>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className=''>
                    {isLoading ? (
                        <Skeleton className='h-[330px] w-full rounded-lg' />
                    ) : (
                        <GenderDonutChart
                            data={chartData}
                            COLORS={["#2563EB", "#202C88", "#7DAEF4"]}
                        />
                    )}
                </CardContent>
            </Card>
        </div>
    )
}

export default VisitorGanderAnalytics