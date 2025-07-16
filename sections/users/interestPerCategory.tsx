import { Card, CardContent, CardHeader } from '@/components/ui/card'
import React from 'react'
import { VisitorInterest } from '../invoices'

const InterestPerCategory = () => {
    return (
        <Card className='shadow-lg  h-[450px]'>
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
            {/* <CardContent className=''> */}
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
            {/* </CardContent> */}
        </Card>
    )
}

export default InterestPerCategory