'use client';

import { TableCell, TableRow } from '@/components/ui/table';
import { Avatar, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Check, Ellipsis, Eye, Pencil, Trash2 } from 'lucide-react';
import React, { FC } from 'react';

interface UserItem {
    id: string;
    image: string;
    firstName: string;
    lastName: string;
    email: string;
    role: string;
    status: string;
    organization?: string;
    phone?: string;
    totalPoints?: number;
    totalRevenue?: number;
    region?: string;
}

interface Props {
    item: UserItem;
    handleDelete?: (id: string) => void;
    handleEdit?: (id: string) => void;
    handlePending?: (id: string) => void;
    pendingUser?: boolean;
    userType?: "super-admin" | "organizer";
}

const UserListTableRow: FC<Props> = ({ item, handleDelete, handleEdit, pendingUser, handlePending, userType }) => {
    const router = require('next/navigation').useRouter();
    return (
        <TableRow className="transition-colors h-14 w-full"
            onClick={() => userType === "super-admin" ? router.push(`/super-admin/user/${item.id}?userType=${item.role}`) : userType === "organizer" &&
                router.push(`/organizer/user/${item.id}?userType=${item.role}`)}>
            <TableCell>

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

            {pendingUser && <TableCell className="text-left text-sm">
                {item.organization || 'N/A'}
            </TableCell>}


            {/* Email */}
            {/* <TableCell className="text-left text-sm">
                {item.email}
            </TableCell> */}
            {/* Username */}
            {!pendingUser && <TableCell className="text-left text-sm">
                {item.firstName.toLowerCase() + ' ' + item.lastName.toLowerCase()}
            </TableCell>}

            {/* Role */}
            {!pendingUser && <TableCell className="text-left capitalize">
                <Badge className='bg-secondary dark:bg-white text-white dark:text-black'>{item.role}</Badge>
            </TableCell>}

            {/* Status */}
            {!pendingUser && <TableCell className="text-left">
                <Badge
                    variant={
                        item.status === 'active'
                            ? 'default'
                            : item.status === 'inactive'
                                ? 'outline'
                                : 'destructive'
                    }
                    className="capitalize"
                >
                    {item.status}
                </Badge>

            </TableCell>}
            {!pendingUser && <TableCell className="text-center">
                {item.totalPoints || 'N/A'}
            </TableCell>}
            {!pendingUser && <TableCell className="text-center">
                {item.totalRevenue || 'N/A'}
            </TableCell>}
            {!pendingUser && <TableCell className="text-left">
                {item.region || 'N/A'}
            </TableCell>}

            {
                pendingUser && <TableCell className="text-left">
                    {item.phone || 'N/A'}
                </TableCell>
            }

            {/* Actions */}
            <TableCell className="text-end">
                <div className="flex gap-2 ">
                    {/* Eye button for user details */}
                    <button
                        onClick={e => { e.stopPropagation(); router.push(`/super-admin/user/user-detail/`); }}
                        className="p-1.5 rounded-md bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 transition cursor-pointer"
                    >
                        <Eye className="w-4 h-4 text-gray-700 dark:text-gray-200" />
                    </button>
                    {!pendingUser && <button
                        onClick={(e) => { e.stopPropagation(); handleEdit?.(item.id) }}
                        className="p-1.5 rounded-md bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 transition cursor-pointer"
                    >
                        <Pencil className="w-4 h-4 text-gray-700 dark:text-gray-200" />
                    </button>}
                    {
                        pendingUser && <button
                            onClick={(e) => { e.stopPropagation(); handlePending?.(item.id) }}
                            className="p-1.5 rounded-md bg-blue-100 hover:bg-blue-200 dark:bg-primary dark:hover:bg-primary transition cursor-pointer"
                        >
                            <Check className="w-4 h-4 text-primary dark:text-blue-300" />
                        </button>
                    }

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