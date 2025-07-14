'use client';

import { TableCell, TableRow } from '@/components/ui/table';
import { Avatar, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Ellipsis, Pencil, Trash2 } from 'lucide-react';
import React, { FC } from 'react';

interface UserItem {
    id: string;
    image: string;
    firstName: string;
    lastName: string;
    email: string;
    role: string;
    status: string;
}

interface Props {
    item: UserItem;
    handleDelete?: (id: string) => void;
    handleEdit?: (id: string) => void;
}

const UserListTableRow: FC<Props> = ({ item, handleDelete, handleEdit }) => {
    return (
        <TableRow className="transition-colors h-14 w-full">
            {/* Avatar */}
            <TableCell>
                {/* <Avatar className="!rounded-xl shadow-sm w-10 h-10 overflow-hidden">
                    <AvatarImage
                        src={item.image}
                        alt={`${item.firstName} ${item.lastName}`}
                        className="object-cover w-full h-full"
                    />
                </Avatar> */}
                <Avatar className="!rounded-xl  shadow-sm w-12 h-12 overflow-hidden">
                    <AvatarImage
                        src={item.image}
                        alt={`${item.firstName} ${item.lastName}`}
                        className="object-cover w-full h-full cursor-pointer"
                    />
                </Avatar>
            </TableCell>

            {/* Full Name */}
            <TableCell className="text-left ">
                {item.firstName}
            </TableCell>
            <TableCell className="text-left">
                {item.lastName}
            </TableCell>

            {/* Email */}
            <TableCell className="text-left text-sm">
                {item.email}
            </TableCell>

            {/* Role */}
            <TableCell className="text-left capitalize">
                <Badge variant="secondary">{item.role}</Badge>
            </TableCell>

            {/* Status */}
            <TableCell className="text-left">
                <Badge
                    variant={
                        item.status === 'active'
                            ? 'default'
                            : item.status === 'inactive'
                                ? 'outline'
                                : 'secondary'
                    }
                    className="capitalize"
                >
                    {item.status}
                </Badge>
            </TableCell>

            {/* Actions */}
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
    );
};

export default UserListTableRow;
