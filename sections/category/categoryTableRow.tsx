"use client"
import { Avatar, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { TableCell, TableRow } from '@/components/ui/table'
import { ChevronDown, Ellipsis } from 'lucide-react'
import { useRouter } from 'next/navigation'
import React, { FC } from 'react'

interface PageProps {
    item: any
}
const CategoryTableRow: FC<PageProps> = ({ item }) => {

    const router = useRouter();

    return (
        <TableRow className=" transition-colors h-14 w-full" onClick={() => router.push(`/organizer/users/${item._id}`)}>
            <TableCell>
                <div className='flex items-center gap-3'>
                    <Avatar>
                        <AvatarImage src="https://github.com/shadcn.png" className='cursor-pointer' />
                    </Avatar>
                    {item.name.length > 20 ? item.name.slice(0, 20) + "..." : item.name}
                </div>
            </TableCell>
            <TableCell className="text-center">
                {item.totalRevenue ? item.totalRevenue : "N/A"}e
            </TableCell>
            <TableCell className="text-center">
                {item.views ? item.views : "N/A"}
            </TableCell>
            <TableCell className="text-center">
                {item.ticketsSold ? item.ticketsSold : "N/A"}
            </TableCell>

            <TableCell>
                {item.date ? new Date(item.date).toLocaleDateString() : "N/A"}
            </TableCell>
            <TableCell className="text-center">
                {item.commission ? item.commission : "N/A"}% <ChevronDown className='inline-block ml-1 h-5 w-5 cursor-pointer' />
            </TableCell>
            <TableCell className="text-center">

                {item.status && (
                    <Badge className={`${item.status === "Premium User" ? "text-green-800 bg-green-100" : "text-red-800 bg-red-100"} rounded-full px-3 py-1 text-xs font-medium`}>
                        {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                    </Badge>
                )}
            </TableCell>
            <TableCell className='text-end '>
                <Ellipsis className='cursor-pointer' onClick={(e) => e.stopPropagation()} />
            </TableCell>
        </TableRow>
    )
}

export default CategoryTableRow