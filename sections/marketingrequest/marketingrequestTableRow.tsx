"use client";
import { Badge } from '@/components/ui/badge';
import { TableCell, TableRow } from '@/components/ui/table';
import { Eye, Pencil, Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React, { FC } from 'react';

interface PageProps {
    item: {
        id: string;
        title: string;
        budget: number;
        organization: string;
        phone: string;
        email: string;
        status: 'pending' | 'approved' | 'rejected';
    };
    handleDelete?: (id: string) => void;
    handleEdit?: (id: string) => void;
}

const EventTableRow: FC<PageProps> = ({ item, handleDelete, handleEdit }) => {
    const router = useRouter();

    return (
        <TableRow
            className="transition-colors h-14 w-full"
        >
            <TableCell className="text-left">
                {item.title.length > 20 ? item.title.slice(0, 20) + "..." : item.title}
            </TableCell>

            <TableCell className="text-left">
                ${item.budget.toLocaleString()}
            </TableCell>

            <TableCell className="text-left">
                {item.organization.length > 20 ? item.organization.slice(0, 20) + "..." : item.organization}
            </TableCell>

            <TableCell className="text-left">
                {item.phone}
            </TableCell>

            <TableCell className="text-left">
                {item.email}
            </TableCell>

            <TableCell className="text-left">
                <Badge
                    variant="outline"
                    className={`
      capitalize
      ${item.status === 'approved' && 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'}
      ${item.status === 'pending' && 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'}
      ${item.status === 'rejected' && 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300'}
    `}
                >
                    {item.status}
                </Badge>
            </TableCell>

            <TableCell className="text-right">
                <div className="flex gap-2 justify-end">
                    <button
                        className="p-1.5 rounded-md bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 transition cursor-pointer"
                    >
                        <Eye className="w-4 h-4 text-gray-700 dark:text-gray-200" />
                    </button>


                </div>
            </TableCell>
        </TableRow>
    );
};

export default EventTableRow;
