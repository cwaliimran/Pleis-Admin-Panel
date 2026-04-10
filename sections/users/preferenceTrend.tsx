import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import React from 'react'
import { VisitorAge } from '../invoices'

interface PreferenceTrendProps {
    viewData?: Array<{
        ageGroup: string;
        visitors: number;
    }>;
    isLoading?: boolean;
}

const defaultViewData = [
    { ageGroup: 'Mon', visitors: 0 },
    { ageGroup: 'Tue', visitors: 0 },
    { ageGroup: 'Wed', visitors: 0 },
    { ageGroup: 'Thu', visitors: 0 },
    { ageGroup: 'Fri', visitors: 0 },
    { ageGroup: 'Sat', visitors: 0 },
    { ageGroup: 'Sun', visitors: 0 },
]

const PreferenceTrend = ({ viewData = defaultViewData, isLoading = false }: PreferenceTrendProps) => {
    const totalViews = viewData.reduce((sum, item) => sum + Number(item.visitors ?? 0), 0)
    const topSlot = viewData.reduce(
        (prev, curr) => (Number(curr.visitors ?? 0) > Number(prev.visitors ?? 0) ? curr : prev),
        viewData[0] ?? { ageGroup: 'N/A', visitors: 0 }
    )
    const topSlotPercentage = totalViews > 0 ? Math.round((Number(topSlot.visitors ?? 0) / totalViews) * 100) : 0

    return (
            <Card className=' h-[450px] dark:bg-[#171717]'>
                <CardHeader className='flex justify-between'>
                    <h1 className='text-2xl font-bold'>
                        Views Over Time
                    </h1>
                </CardHeader>
                <CardContent className='my-3'>
                    {isLoading ? (
                        <Skeleton className='h-[280px] w-full rounded-lg' />
                    ) : (
                        <VisitorAge
                            data={viewData}
                            direction='horizontal'
                        />
                    )}
                     <div className="mx-4 mt-4">
                  <p className="text-[12px] text-muted-foreground font-medium">
                    <span className="text-xl font-bold dark:text-white text-black">{topSlotPercentage}%</span> views came from {topSlot.ageGroup}
                  </p>
                </div>

                </CardContent>
            </Card>
    )
}

export default PreferenceTrend