import { Card, CardContent, CardHeader } from '@/components/ui/card'
import React from 'react'
import { GenderDonutChart } from '../invoices'

const VisitorGanderAnalytics = () => {
    return (
        <div>
            <Card className='shadow-lg p-0 m-0'>
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
                                    Females
                                </h1>
                            </div>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className=' p-0 m-0'>
                    <GenderDonutChart
                        data={[
                            { name: "Males", value: 400 },
                            { name: "Females", value: 300 },
                            { name: "Others", value: 100 }
                        ]}
                        COLORS={["#2563EB", "#202C88", "#7DAEF4"]}
                    />
                </CardContent>
            </Card>
        </div>
    )
}

export default VisitorGanderAnalytics