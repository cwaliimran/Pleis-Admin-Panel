import { Card, CardContent, CardHeader } from '@/components/ui/card'
import React from 'react'
import { activePromontions } from './data'
import { Rocket } from 'lucide-react'
import { Badge } from '@/components/ui/badge'

const ActivePromontion = () => {
    return (
        <Card className='shadow-lg dark:bg-[#171717]'>
            <CardHeader>
                <h1 className=' font-bold text-xl'>Active Promontions & Boosts</h1>
            </CardHeader>
            <hr />
            <CardContent>
                {activePromontions.map((item: any) => (
                    <div key={item.title} className='flex gap-2 items-center mb-6'>
                        <Rocket />
                        <div className='ml-2'>
                            <h1 className='text-lg font-semibold'>{item.title}</h1>
                            <p className=' text-gray-500'>{item.description}</p>
                        </div>
                        <Badge className='border-gray-300 rounded-2xl ml-auto bg-transparent px-3 py-1 text-lg text-gray-700 dark:text-gray-400'>Boost</Badge>
                    </div>
                ))}

            </CardContent>

        </Card>
    )
}

export default ActivePromontion