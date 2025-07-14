"use client"
import { Avatar, AvatarImage } from '@/components/ui/avatar'
import { TableCell, TableRow } from '@/components/ui/table'
import { Eye, Pencil, Trash2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import React, { FC } from 'react'

interface PageProps {
    item: any,
    handleDelete?: (id: string) => void;
    handleEdit?: (id: string) => void;
}
const EventTableRow: FC<PageProps> = ({ item, handleDelete, handleEdit }) => {

    const router = useRouter();

    return (
        <TableRow className=" transition-colors h-14 w-full" onClick={() => router.push(`/super-admin/events/${item.id}`)}>
            <TableCell>
                <Avatar className="!rounded-xl  shadow-sm w-12 h-12 overflow-hidden">
                    <AvatarImage
                        src="https://github.com/shadcn.png"
                        alt="Store"
                        className="object-cover w-full h-full cursor-pointer"
                    />
                </Avatar>
            </TableCell>
            <TableCell className="text-left">
                {item.name.length > 20 ? item.name.slice(0, 20) + "..." : item.name}
            </TableCell>
            <TableCell className="text-left">
                {item.venue}
            </TableCell>
            <TableCell className="text-left">
                {item.organizaiton}
            </TableCell>

            <TableCell>
                {item.fromDate ? item.fromDate : "N/A"}
            </TableCell>
            <TableCell className="text-left">
                {item.endDate ? item.endDate : "N/A"}
            </TableCell>
            <TableCell className="text-end">
                <div className="flex gap-2 ">
                    <button
                        className="p-1.5 rounded-md bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 transition cursor-pointer"
                    >
                        <Eye className="w-4 h-4 text-gray-700 dark:text-gray-200" />
                    </button>
                    <button
                        onClick={(e) => { e.stopPropagation(); handleEdit?.(item.id) }}
                        className="p-1.5 rounded-md bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 transition cursor-pointer"
                    >
                        <Pencil className="w-4 h-4 text-gray-700 dark:text-gray-200" />
                    </button>

                    <button
                        onClick={(e) => { e.stopPropagation(); handleDelete?.(item.id) }}
                        className="p-1.5 rounded-md bg-red-100 hover:bg-red-200 dark:bg-red-900 dark:hover:bg-red-800 transition cursor-pointer"
                    >
                        <Trash2 className="w-4 h-4 text-red-600 dark:text-red-300" />
                    </button>
                </div>
            </TableCell>
        </TableRow>
    )
}

export default EventTableRow