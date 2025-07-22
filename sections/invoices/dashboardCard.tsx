import { Avatar, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Ellipsis, MapPin } from 'lucide-react'
import React, { FC } from 'react'

interface PageProps {
  item: any
}
const DashboardCard: FC<PageProps> = ({ item }) => {
  return (
    <div>
      <Card className='shadow-lg w-full md:h-[300px] mb-3  dark:bg-secondary'>
        <CardHeader className=''>
          <div className='flex justify-between items-center'>
            <div>
              {item.status && (
                <Badge className={`${item.status === "new request" ? "text-green-800 bg-green-100" : "text-red-800 bg-red-100"} rounded-full px-3 py-1 text-xs font-medium`}>
                  {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                </Badge>
              )}
            </div>
            <div>
              <Ellipsis className='cursor-pointer w-4 h-5' />
            </div>
          </div>
        </CardHeader>
        <hr />
        <CardContent>
          <div className='flex items-center gap-3'>
            <Avatar>
               <AvatarImage src="https://github.com/shadcn.png" className='cursor-pointer' />
            </Avatar>
            <h1>
              {item.name}
            </h1>
          </div>
           <h1 className='mt-2 text-lg font-semibold'>
             {item.title}
           </h1>
            <p className='text-md text-gray-500 my-3'>
              {item.description}
              </p>
                <div className='flex items-center gap-2 '>
                  <MapPin />
              <span className='text-md '>
                {item.location.length > 20 ? item.location.slice(0, 20) + "..." : item.location}
              </span>
                </div>
        </CardContent>
      </Card>

    </div>
  )
}

export default DashboardCard