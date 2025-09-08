'use client';

import { Avatar, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { TableCell, TableRow } from '@/components/ui/table';

import { Check, Eye, Pencil, Trash2 } from 'lucide-react';
import React, { FC, useState } from 'react';
import { useRouter } from 'next/navigation';
import CustomBadge from '@/components/ui/custom-badge';
import UserDetailsModal from '@/components/modals/UserDetailsModal';
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
  userType?: 'super-admin' | 'organizer';
}

const UserListTableRow: FC<Props> = ({
  item,
  handleDelete,
  handleEdit,
  pendingUser,
  handlePending,
  userType,
}) => {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleViewUser = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsModalOpen(true);
  };

  return (
    <>
      <TableRow
        className={`h-14 w-full transition-colors ${
          pendingUser ? '' : 'cursor-pointer'
        }`}
        onClick={() =>
          userType === 'super-admin'
            ? router.push(`/super-admin/user/${item.id}?userType=${item.role}`)
            : userType === 'organizer' &&
              router.push(`/organizer/user/${item.id}?userType=${item.role}`)
        }
      >
        <TableCell>
          <Avatar className="h-12 w-12 overflow-hidden !rounded-xl shadow-sm">
            <AvatarImage
              src={item.image}
              alt={`${item.firstName} ${item.lastName}`}
              className="h-full w-full cursor-pointer object-cover"
            />
          </Avatar>
        </TableCell>

        {/* Full Name */}
        <TableCell className="text-left">{item.firstName}</TableCell>
        <TableCell className="text-left">{item.lastName}</TableCell>

        {pendingUser && (
          <TableCell className="text-left text-sm">
            {item.organization || 'N/A'}
          </TableCell>
        )}

        {/* Email */}
        {/* <TableCell className="text-left text-sm">
                {item.email}
            </TableCell> */}
        {/* Username */}
        {!pendingUser && (
          <TableCell className="text-left text-sm">
            {item.firstName.toLowerCase() + ' ' + item.lastName.toLowerCase()}
          </TableCell>
        )}

        {/* Role */}
        {!pendingUser && (
          <TableCell className="text-left capitalize">
            <Badge className="bg-secondary text-white dark:bg-white dark:text-black">
              {item.role}
            </Badge>
          </TableCell>
        )}

        {/* Status */}
        {!pendingUser && (
          <TableCell className="text-left">
            <CustomBadge
              variant={
                item.status === 'active'
                  ? 'success'
                  : item.status === 'pending'
                    ? 'warning'
                    : 'error'
              }
            >
              {item.status}
            </CustomBadge>
          </TableCell>
        )}
        {!pendingUser && (
          <TableCell className="text-left">
            {item.totalPoints || 'N/A'}
          </TableCell>
        )}
        {!pendingUser && (
          <TableCell className="text-left">
            {item.totalRevenue || 'N/A'}
          </TableCell>
        )}
        {!pendingUser && (
          <TableCell className="text-left">{item.region || 'N/A'}</TableCell>
        )}

        {pendingUser && (
          <TableCell className="text-left">{item.phone || 'N/A'}</TableCell>
        )}

        {/* Actions */}
        <TableCell className="text-end">
          <div className="flex gap-2">
            {/* Eye button for user details */}
            {!pendingUser && (
              <button
                type="button"
                title="View User"
                className="cursor-pointer rounded-md bg-gray-100 p-1.5 transition hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700"
              >
                <Eye className="h-4 w-4 text-gray-700 dark:text-gray-200" />
              </button>
            )}

            {pendingUser && (
              <button
                type="button"
                title="View User"
                onClick={handleViewUser}
                className="cursor-pointer rounded-md bg-gray-100 p-1.5 transition hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700"
              >
                <Eye className="h-4 w-4 text-gray-700 dark:text-gray-200" />
              </button>
            )}

            {!pendingUser && (
              <button
                type="button"
                title="Edit User"
                onClick={(e) => {
                  e.stopPropagation();
                  handleEdit?.(item.id);
                }}
                className="cursor-pointer rounded-md bg-gray-100 p-1.5 transition hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700"
              >
                <Pencil className="h-4 w-4 text-gray-700 dark:text-gray-200" />
              </button>
            )}

            {pendingUser && (
              <button
                type="button"
                title="Approve User"
                onClick={(e) => {
                  e.stopPropagation();
                  handlePending?.(item.id);
                }}
                className="dark:bg-primary dark:hover:bg-primary cursor-pointer rounded-md bg-blue-100 p-1.5 transition hover:bg-blue-200"
              >
                <Check className="text-primary h-4 w-4 dark:text-blue-300" />
              </button>
            )}

            <button
              type="button"
              title="Delete User"
              onClick={(e) => {
                e.stopPropagation();
                handleDelete?.(item.id);
              }}
              className="cursor-pointer rounded-md bg-red-100 p-1.5 transition hover:bg-red-200 dark:bg-red-900 dark:hover:bg-red-800"
            >
              <Trash2 className="h-4 w-4 text-red-600 dark:text-red-300" />
            </button>
          </div>
        </TableCell>
      </TableRow>

      {/* User Details Modal */}
      <UserDetailsModal
        user={item}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
};

export default UserListTableRow;
