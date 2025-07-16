import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select'
import React from 'react'
import { VisitorAge } from '../invoices'

const PreferenceTrend = () => {
    return (
            <Card className=' h-[450px]'>
                <CardHeader className='flex justify-between'>
                    <h1 className='text-2xl font-bold'>
                        Preference Trends
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
                <CardContent className='my-3'>
                    <VisitorAge
                        data={[
                            { ageGroup: "18-24", visitors: 120 },
                            { ageGroup: "25-34", visitors: 200 },
                            { ageGroup: "35-44", visitors: 150 },
                            { ageGroup: "45-54", visitors: 90 },
                            { ageGroup: "55+", visitors: 70 }
                        ]}
                    />
                     <div className="mx-4 mt-4">
                  <p className="text-[12px] text-muted-foreground font-medium">
                    <span className="text-xl font-bold dark:text-white text-black">66%</span> visitors are 45-55 years old
                  </p>
                </div>

                </CardContent>
            </Card>
    )
}

export default PreferenceTrend