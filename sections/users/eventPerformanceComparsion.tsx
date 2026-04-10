import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import React from 'react'
import { EventPerformanceComparison } from '../invoices'

interface EventPerformanceComparsionInUserDetailsProps {
    chartData?: Array<{
        month: string;
        revenue: number;
        ticketesSold: number;
        totalAmount?: number;
        totalOrders?: number;
    }>;
    isLoading?: boolean;
}

const EventPerformanceComparsionInUserDetails = ({ chartData = [], isLoading = false }: EventPerformanceComparsionInUserDetailsProps) => {
    const mappedChartData = chartData.map((item) => ({
        month: item.month,
        desktop: Number(item.ticketesSold ?? item.totalOrders ?? 0),
        mobile: Number(item.revenue ?? item.totalAmount ?? 0),
    }))

    return (
            <Card className='shadow-lg dark:bg-[#171717]'>
                <CardHeader>
                    <div className='flex justify-between items-center'>
                        <h3 className='text-xl font-semibold'>Revenue Over Time</h3>
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
                <CardContent>
                    {isLoading ? (
                        <Skeleton className='h-[400px] w-full rounded-lg' />
                    ) : (
                        <EventPerformanceComparison
                            chartData={mappedChartData.length > 0 ? mappedChartData : [
                                { month: 'Jan', desktop: 0, mobile: 0 },
                                { month: 'Feb', desktop: 0, mobile: 0 },
                                { month: 'Mar', desktop: 0, mobile: 0 },
                                { month: 'Apr', desktop: 0, mobile: 0 },
                                { month: 'May', desktop: 0, mobile: 0 },
                                { month: 'Jun', desktop: 0, mobile: 0 },
                                { month: 'Jul', desktop: 0, mobile: 0 },
                                { month: 'Aug', desktop: 0, mobile: 0 },
                                { month: 'Sep', desktop: 0, mobile: 0 },
                                { month: 'Oct', desktop: 0, mobile: 0 },
                                { month: 'Nov', desktop: 0, mobile: 0 },
                                { month: 'Dec', desktop: 0, mobile: 0 },
                            ]}
                            chartConfig={{
                                desktop: { label: 'Tickets Sold', color: '#2563eb' },
                                mobile: { label: 'Revenue', color: '#7DAEF4' }
                            }}
                        />
                    )}
                </CardContent>
            </Card>
    )
}

export default EventPerformanceComparsionInUserDetails