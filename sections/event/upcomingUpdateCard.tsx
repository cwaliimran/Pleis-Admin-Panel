import { Card, CardHeader } from '@/components/ui/card'
import { Ellipsis } from 'lucide-react'
import React from 'react'

function UpcomingUpdateCard() {
    return (
        <Card className=' shadow-lg mb-3  dark:bg-[#171717] mt-3'>
            <CardHeader>
                <div className='flex justify-between'>
                    <h1 className='text-slate-500 font-semibold my-1'>UpCOMING UPDATE</h1>
                    <Ellipsis />
                </div>
                <div className='flex items-start gap-2'>
                    
                    <div className='flex items-center gap-2 flex-wrap'>
                        <div className=' flex flex-col items-start gap-2'>
                            <div className='flex items-center gap-2'>
                                <img src="/images/eventImage.png" alt="" className='w-7 h-7 rounded-sm' />
                                <p className='text-foreground '>Name of Event</p>
                            </div>
                            <h1 className='text-xl font-semibold  text-slate-800 dark:text-white'> Insert Update Title</h1>
                            <h1 className='text-muted-foreground'>
                                Description of the lorem ispum dolor sit amet  lorem ispum dolor sit amet.....
                            </h1>
                        </div>
                    </div>
                </div>
            </CardHeader>

        </Card>
    )
}

export default UpcomingUpdateCard