import { Avatar, AvatarImage } from '@/components/ui/avatar'
import { TableCell, TableRow } from '@/components/ui/table'
import { Ellipsis } from 'lucide-react';
import React, { FC } from 'react'

interface PagePoprs {
    item: any;
}
const LoyaltyTableRow: FC<PagePoprs> = ({ item }) => {
    return (
        <>
            <TableRow className="h-14">
                <TableCell className="text-start">{item.item}</TableCell>
                <TableCell className="text-center">{item.user}</TableCell>
                <TableCell className='bordder border-red-600'>
                    <div className='flex items-center gap-3'>
                        <Avatar>
                            <AvatarImage src="https://github.com/shadcn.png" className='cursor-pointer' />
                        </Avatar>
                        {item.user.length > 20 ? item.user.slice(0, 20) + '...' : item.user}
                    </div>
                </TableCell>
                <TableCell className="text-center">{item.points}</TableCell>
                <TableCell className="text-center">{item.date}</TableCell>
                <TableCell className="text-center">{item.amount}</TableCell>
                <TableCell className="text-center">{item.total}</TableCell>
                <TableCell className='text-end '>
                    <Ellipsis className='cursor-pointer' onClick={(e) => e.stopPropagation()} />
                </TableCell>
            </TableRow>
        </>
    )
}

export default LoyaltyTableRow