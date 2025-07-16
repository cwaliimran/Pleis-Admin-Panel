import { Card, CardHeader } from '@/components/ui/card'
import React from 'react'
import { userTags } from '../users/data'
import { Badge } from '@/components/ui/badge'

const EventCard = () => {
    return (
        <div>
            <Card className=' shadow-lg mb-3  dark:bg-[#171717]'>
                <CardHeader>
                    <h1 className='text-slate-500 font-semibold my-1'>ACTIVE EVENTS</h1>
                    <div className='flex items-start gap-2'>
                        <div>
                            <img src="/images/eventImage.png" alt="" className='md:w-[100px] md:h-[100px] rounded-md' />
                        </div>
                        <div className='flex items-center gap-2 flex-wrap'>
                            <div className=' flex flex-col items-start gap-2'>
                                <div className='flex items-center gap-2'>
                                    <img src="/images/eventImage.png" alt="" className='w-5 h-5 rounded-full' />
                                    <p className='text-slate-500 '>Peti Kupe</p>
                                </div>
                                <h1 className='text-xl font-semibold  text-slate-800 dark:text-white'> Event Name or Smth </h1>
                                <div className='flex flex-wrap gap-2'>
                                    {userTags.map((item, index) => (
                                        index !== 3 && <Badge key={index} className="bg-white dark:bg-black text-gray-400 border border-gray-400 rounded-full px-4 py-1 text-md font-medium hover:bg-gray-200 hover:text-gray-800 dark:hover:text-white transition-colors">
                                            {item}
                                        </Badge>
                                    ))
                                    }

                                </div>
                            </div>
                        </div>
                    </div>
                </CardHeader>

            </Card>
        </div>
    )
}

export default EventCard