import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select'
import React from 'react'
import {  VisitorAge } from '../invoices'

const ViewershipTrend = () => {
    return (
        <Card className='shadow-lg'>
            <CardHeader className='flex justify-between'>
                <h1 className='text-2xl font-bold'>
                    Viewership Trends
                </h1>
                <Select defaultValue='filter'>
                    <SelectTrigger className='rounded-3xl  font-bold text-md'>
                        <SelectValue placeholder="" />
                    </SelectTrigger>
                    <SelectContent >
                        <SelectGroup className='w-auto rounded-2xl '>
                            <SelectLabel>Filter</SelectLabel>
                            <SelectItem value="filter">filter</SelectItem>
                        </SelectGroup>
                    </SelectContent>
                </Select>
            </CardHeader>
            <CardContent>
                <VisitorAge
                    data={[
                        { ageGroup: "18-24", visitors: 120 },
                        { ageGroup: "25-34", visitors: 200 },
                        { ageGroup: "35-44", visitors: 150 },
                        { ageGroup: "45-54", visitors: 90 },
                        { ageGroup: "55+", visitors: 70 }
                    ]}
                />

            </CardContent>
        </Card>
    )
}

export default ViewershipTrend