import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users2 } from 'lucide-react';
import React, { FC } from 'react'

interface PageProps {
    item: any; // Define the type of item based on your requirements
}
const RewardCard: FC<PageProps> = ({ item }) => {

    const totalDays = 30;
    const remainingDays = 5;
    const progressPercent = ((totalDays - remainingDays) / totalDays) * 100;
    return (
        <div>
            <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
                <CardHeader>
                    <div className='flex'>
                        <div>
                            <img src="/images/rewardImage.png" alt="" className='w-20 h-20 cursor-pointer' />
                        </div>
                        <div className='ml-4'>
                            <h1 className=' text-xl font-bold mb-2'>
                                {item.name}
                            </h1>
                            <p className='text-md  text-gray-400'>
                                {item.description.length > 45 ? item.description.slice(0, 45) + '...' : item.description}
                            </p>
                            <div className='flex'>
                                <h1 className='text-md font-bold text-gray-400 mt-2'>
                                    {item.points} Points
                                </h1>
                                <div className='flex items-center ml-4'>
                                    <Users2 className='text-gray-400 h-5 w-5' />
                                    <h1 className='text-md font-bold text-gray-400 ml-1'>
                                        Claimed Rewards {item.claimRewards}
                                    </h1>
                                </div>
                            </div>
                        </div>
                    </div>
                </CardHeader>
                <hr />
                <CardContent>
                    <div className=" flex justify-between items-start gap-4">
                        <h2 className="text-sm text-gray-500">  REWARD AVAILABILITY </h2>
                        <h2 className="text-sm text-gray-500">  488/2300 </h2>
                    </div>
                    <div className="flex-1 flex flex-col">

                        <div className="w-full h-2 bg-gray-200 rounded-full  overflow-hidden">
                            <div
                                className="h-full bg-blue-600 transition-all duration-500"
                                style={{ width: `${progressPercent}%` }}
                            ></div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

export default RewardCard