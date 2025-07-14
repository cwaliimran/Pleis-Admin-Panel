"use client"
import { Avatar, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { TableCell, TableRow } from '@/components/ui/table'
import { ChevronDown, Ellipsis, Pencil, Trash2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import React, { FC } from 'react'

interface PageProps {
    item: any,
    handleDelete?: (id: string) => void;
    handleEdit?: (id: string) => void;
}
const VenueTableRow: FC<PageProps> = ({ item,handleDelete,handleEdit }) => {

    const headLabel = [
        { id: "name", label: "Name", align: 'left' },
        { id: "dateAdded", label: "Date Added", align: "left" },
        { id: 'organizaiton', label: "Organization", align: "left" },
        { id: "location", label: "Location", align: "left" },
        { id: "region", label: "region", align: "left" },
        { id: "actions", label: "" }
    ]


    const router = useRouter();

    return (
        <TableRow className=" transition-colors h-14 w-full" >
            <TableCell>
                <div className='flex items-center gap-3'>
                    <Avatar className="!rounded-xl  shadow-sm w-12 h-12 overflow-hidden">
                        <AvatarImage
                            src="https://github.com/shadcn.png"
                            alt="Store"
                            className="object-cover w-full h-full cursor-pointer"
                        />
                    </Avatar>
                    {item.name.length > 20 ? item.name.slice(0, 20) + "..." : item.name}
                </div>
            </TableCell>
            <TableCell className="text-left">
                {item.dateAdded}
            </TableCell>

            <TableCell className="text-left flex items-center gap-2">
                <Avatar className="">
                    <AvatarImage
                        src="https://github.com/shadcn.png"
                        alt="Store"
                        className=""
                    />
                </Avatar>
                {item.organization.name}
            </TableCell>
            <TableCell>
                {item.location}
            </TableCell>
            <TableCell className="text-left">
                {item.region}
            </TableCell>

            <TableCell className="text-end">
                <div className="flex gap-2 ">
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

export default VenueTableRow