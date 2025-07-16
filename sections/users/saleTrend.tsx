import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select'
import React from 'react'
import { MostViewedEvent } from '../invoices'

const saleTrend = () => {
    return (
        <div>
            <Card className='h-[450px]'>
                <CardHeader className='flex justify-between'>
                    <h1 className='text-2xl font-bold'>
                        Sales Trends
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
                    <MostViewedEvent
                        chartData={[
                            { month: "January", search: 189 },
                            { month: "February", search: 305 },
                            { month: "March", search: 237 },
                            { month: "April", search: 73 },
                            { month: "May", search: 209 },
                            { month: "June", search: 214 }
                        ]}
                        chartConfig={{
                            search: { label: "Category", color: "#2563EB" },
                        }}
                    />
                    

                </CardContent>
            </Card>
        </div>
    )
}

export default saleTrend