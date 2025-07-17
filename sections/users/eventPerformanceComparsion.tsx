import { Card, CardHeader } from '@/components/ui/card'
import React from 'react'
import { EventPerformanceComparison } from '../invoices'

const EventPerformanceComparsionInUserDetails = () => {
    return (
            <Card className='shadow-lg dark:bg-[#171717]'>
                <CardHeader>
                    <div className='flex justify-between items-center'>
                        <h3 className='text-xl font-semibold'>Event Performance Comparison</h3>
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
                                    Revenue Per Ticket
                                </h1>
                            </div>
                        </div>
                    </div>
                </CardHeader>
                <EventPerformanceComparison
                    chartData={[
                        { month: "January", desktop: 186, mobile: 80 },
                        { month: "February", desktop: 305, mobile: 200 },
                        { month: "March", desktop: 237, mobile: 120 },
                        { month: "April", desktop: 73, mobile: 190 },
                        { month: "May", desktop: 209, mobile: 130 },
                        { month: "June", desktop: 214, mobile: 140 },
                    ]
                    }
                    chartConfig={{
                        desktop: { label: "Tickets Sold", color: "#2563eb" },
                        mobile: { label: "Revenue", color: "#7DAEF4" }
                    }}
                />
            </Card>
    )
}

export default EventPerformanceComparsionInUserDetails