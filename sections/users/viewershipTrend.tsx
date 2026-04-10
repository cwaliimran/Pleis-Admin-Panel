import { Card, CardContent, CardHeader } from '@/components/ui/card'
import React from 'react'
import {  VisitorAge } from '../invoices'

interface ViewershipTrendProps {
    ageDemographics?: Array<{
        ageGroup: string;
        total?: number;
        Male?: number;
        Female?: number;
        Other?: number;
    }>;
}

const defaultAgeDemographics = [
    { ageGroup: '18-25', total: 0, Male: 0, Female: 0, Other: 0 },
    { ageGroup: '25-34', total: 0, Male: 0, Female: 0, Other: 0 },
    { ageGroup: '35-44', total: 0, Male: 0, Female: 0, Other: 0 },
    { ageGroup: '45-54', total: 0, Male: 0, Female: 0, Other: 0 },
    { ageGroup: '55+', total: 0, Male: 0, Female: 0, Other: 0 },
]

const ViewershipTrend = ({ ageDemographics = defaultAgeDemographics }: ViewershipTrendProps) => {
    const chartData = ageDemographics.map((item) => ({
        ageGroup: item.ageGroup,
        visitors: Number(item.total ?? item.Male ?? 0) + Number(item.Female ?? 0) + Number(item.Other ?? 0),
    }))

    const totalVisitors = chartData.reduce((sum, item) => sum + item.visitors, 0)
    const topGroup = chartData.reduce(
        (prev, curr) => (curr.visitors > prev.visitors ? curr : prev),
        chartData[0] ?? { ageGroup: 'N/A', visitors: 0 }
    )
    const topGroupPercentage = totalVisitors > 0 ? Math.round((topGroup.visitors / totalVisitors) * 100) : 0

    return (
        <Card className='shadow-lg    h-[450px] dark:bg-[#171717]'>
            <CardHeader className='flex justify-between'>
                <h1 className='text-2xl font-bold'>
                    Age Group Distribution
                </h1>
            </CardHeader>
            <CardContent>
                <VisitorAge
                    data={chartData}
                />
                 <div className="mx-4 mt-4">
                  <p className="text-[12px] text-muted-foreground font-medium">
                    <span className="text-xl font-bold dark:text-white text-black">{topGroupPercentage}%</span> visitors are {topGroup.ageGroup} years old
                  </p>
                </div>

            </CardContent>
        </Card>
    )
}

export default ViewershipTrend