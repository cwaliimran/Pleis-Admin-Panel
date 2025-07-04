import { Card, CardContent, CardHeader } from '@/components/ui/card'
import React from 'react'
import { GenderDonutChart } from '../invoices'

const TotalFollowers = () => {
    return (
        <div>
            <Card className='shadow-lg'>
                <CardHeader>
                    <div className='flex justify-between items-center'>
                        <h1 className=' font-bold text-xl'>Total Followers</h1>
                        <div className='flex items-center gap-2'>
                            <span className='text-lg font-bold'>12,342</span>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <GenderDonutChart
                        data={[
                            { name: "New", value: 300 },
                            { name: "Old", value: 400 },
                            { name: "Others", value: 100 }
                        ]}
                        COLORS={["#7DAEF4", "#2563EB", "#202C88"]}
                    />
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
                </CardContent>
            </Card>
        </div>
    )
}

export default TotalFollowers