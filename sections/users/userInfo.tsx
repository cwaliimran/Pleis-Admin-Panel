import { Badge } from '@/components/ui/badge'
import { Card, CardHeader } from '@/components/ui/card'
import { MapPin } from 'lucide-react'
import React from 'react'

const UserInfo = () => {
    return (
        <div className='grid grid-cols-12 gap-4 mt-7'>
            <div className=' md:col-span-5 col-span-12'>
                <Card className='shadow-lg'>
                    <CardHeader>
                        <h1 className='text-slate-500 font-semibold'>DESCRIPTION</h1>
                        <p className=' mt-2'>
                            Peti Kupe je destinacija u kojoj se isprepliću glazba, umjetnosti, edukativni sadržaji i gastronomija.
                        </p>
                        <div className='flex flex-wrap gap-2 mt-2'>
                            <Badge className={`bg-white dark:bg-black text-gray-400  border- border-gray-400 rounded-full px-3 py-1 text-xs font-medium hover:bg-gray-200 hover:text-gray-800 dark:hover:text-white transition-colors`}>
                                +18
                            </Badge>
                            <Badge className={`bg-white dark:bg-black text-gray-400  border- border-gray-400 rounded-full px-3 py-1 text-xs font-medium hover:bg-gray-200 hover:text-gray-800 dark:hover:text-white transition-colors`}>
                                Premium
                            </Badge> <Badge className={`bg-white dark:bg-black text-gray-400  border- border-gray-400 rounded-full px-3 py-1 text-xs font-medium hover:bg-gray-200 hover:text-gray-800 dark:hover:text-white transition-colors`}>
                                Premium
                            </Badge>
                        </div>

                    </CardHeader>
                </Card>
            </div>
            <div className='md:col-span-7 col-span-12'>
                <Card className='shadow-lg'>
                    <CardHeader>
                        <h1 className='text-slate-500 font-semibold'>LOCATION PIN</h1>
                        <div className='flex items-center gap-2 mt-2'>
                            <MapPin />
                            <span >Trnjanska cesta 5, 10 000 Zagreb, Cro...</span>
                        </div>
                    </CardHeader>
                </Card>
            </div>
        </div>
    )
}

export default UserInfo