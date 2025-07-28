import { Avatar } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { TableCell, TableRow } from '@/components/ui/table';
import { AvatarImage } from '@radix-ui/react-avatar';
import { Ellipsis, TrendingUp } from 'lucide-react';
import React from 'react'
import { FC } from 'react'

interface PageProps {
    item: any;
}
const TransactionHitoryTableRow: FC<PageProps> = ({ item }) => {
    return (
        <TableRow className=" transition-colors h-14">
            <TableCell>
                <div className='flex items-center gap-3'>
                    <Avatar>
                        <AvatarImage src="https://github.com/shadcn.png" className='cursor-pointer' />
                    </Avatar>
                    <div className='flex flex-col'>
                        {item.user.length > 20 ? item.user.slice(0, 20) + "..." : item.user}
                        {item.phone && (
                            <span className='text-xs text-gray-500'>
                                {item.phone.length > 15 ? item.phone.slice(0, 15) + "..." : item.phone}
                            </span>
                        )}
                    </div>
                </div>
            </TableCell>
            <TableCell>  {item.contact ? item.contact.length > 20 ? item.contact.slice(0, 20) + "..." : item.contact : "N/A"} </TableCell>
            <TableCell>{item.invoice ? item.invoice.length > 20 ? item.invoice.slice(0, 20) + "..." : item.invoice : "N/A"}</TableCell>
            <TableCell>{item.organizer ? item.organizer.length > 20 ? item.organizer.slice(0, 20) + "..." : item.organizer : "N/A"}</TableCell>
            <TableCell>
                {item.date ? new Date(item.date).toLocaleDateString() : "N/A"}
            </TableCell>
            <TableCell className="text-center">
                {item.total ? item.total : "N/A"}
            </TableCell>
            <TableCell className="text-center">
                {item.transactionType ? (
                    <Badge className={`${item.transactionType === "credit" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"} rounded-full px-3 py-1 text-xs font-medium`}>
                        {item.transactionType.charAt(0).toUpperCase() + item.transactionType.slice(1)}
                    </Badge>
                ) : "N/A"}
            </TableCell>
            <TableCell className="text-center">

                {item.status && (
                    <Badge className={`${item.status === "paid" ? "text-green-800 bg-green-100" : "text-red-800 bg-red-100"} rounded-full px-3 py-1 text-xs font-medium`}>
                        {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                    </Badge>
                )}
            </TableCell>
            <TableCell className='text-end '>
                <Ellipsis className='cursor-pointer' />
            </TableCell>
        </TableRow>

    )
}

export default TransactionHitoryTableRow