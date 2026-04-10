import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import React from 'react'
import { VisitorInterest } from '../invoices'

interface InterestPerCategoryProps {
    data?: Array<{
        category: string;
        males: number;
        females: number;
        others?: number;
    }>;
    isLoading?: boolean;
}

const InterestPerCategory = ({ data = [], isLoading = false }: InterestPerCategoryProps) => {
    return (
        <Card className='shadow-lg  h-[450px] dark:bg-[#171717]'>
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
                {isLoading ? (
                    <div className='px-4 pt-2'>
                        <Skeleton className='h-[300px] w-full rounded-lg' />
                    </div>
                ) : (
                    <VisitorInterest
                        chartData={
                            data.length > 0
                                ? data.map((item) => ({
                                      category: item.category,
                                      males: Number(item.males ?? 0),
                                      females: Number(item.females ?? 0),
                                  }))
                                : [
                                      { category: 'Eat & Dining', males: 0, females: 0 },
                                      { category: 'Nightlife', males: 0, females: 0 },
                                      { category: 'Coffee & Drinks', males: 0, females: 0 },
                                      { category: 'Art & Culture', males: 0, females: 0 },
                                      { category: 'Experiences', males: 0, females: 0 },
                                      { category: 'Theater & Shows', males: 0, females: 0 },
                                  ]
                        }
                        chartConfig={{
                            males: { label: 'Males', color: '#2563EB' },
                            females: { label: 'Females', color: '#202C88' },
                        }}
                    />
                )}
            {/* </CardContent> */}
        </Card>
    )
}

export default InterestPerCategory