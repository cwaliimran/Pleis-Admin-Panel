import { Avatar } from '@/components/ui/avatar';
import { TableCell, TableRow } from '@/components/ui/table';
import { AvatarImage } from '@radix-ui/react-avatar';
import { TrendingUp } from 'lucide-react';
import React from 'react'
import { FC } from 'react'

interface PageProps {
    item: any;
}
const TopPerformaningEventTableRow: FC<PageProps> = ({ item }) => {
    return (
        <TableRow className="h-14">
            <TableCell>
                <div className='flex items-center gap-3'>
                    <Avatar>
                        <AvatarImage src="https://github.com/shadcn.png" className='cursor-pointer' />
                    </Avatar>
                    {item.organizerName}
                </div>
            </TableCell>
            <TableCell className="text-center">{item.revenue}</TableCell>
            <TableCell className="text-center">{item.roi}%</TableCell>
            <TableCell className="text-center">
                <div className="flex items-center justify-center gap-3">
                    {item.engagement}% <TrendingUp className="w-5 h-5 text-[#79D48B]" />
                </div>
            </TableCell>
        </TableRow>

    )
}

export default TopPerformaningEventTableRow