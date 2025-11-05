'use client';

import { Avatar, AvatarImage } from '@/components/ui/avatar';
import { TableCell, TableRow } from '@/components/ui/table';
import { Check, Eye, Trash2 } from 'lucide-react';
import { FC, useState } from 'react';
import PendingUserDetailsModal from './pending-user-details-modal';
import { noImageUrl, noImageUrlDev, noImageUrlDevCap } from '@/constant/constant';

interface PageProps {
  item: any;
  handleDelete?: (id: string) => void;
  handlePending?: (id: string) => void;
}
const SupplierTypeTableRow: FC<PageProps> = ({ item, handleDelete, handlePending }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleViewUser = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsModalOpen(true);
  };

  return (
    <>
      <TableRow className="h-14 w-full transition-colors hover:bg-[#f5f5f5] dark:hover:bg-[#272727]/50">
        <TableCell>
          <Avatar className="flex h-12 w-12 items-center justify-center overflow-hidden !rounded-xl bg-gray-100 shadow-sm dark:bg-gray-800">
            {item?.basicInfo?.profileIcon &&
            item?.basicInfo?.profileIcon !== noImageUrl &&
            item?.basicInfo?.profileIcon !== noImageUrlDev &&
            item?.basicInfo?.profileIcon !== noImageUrlDevCap ? (
              <AvatarImage src={item?.basicInfo?.profileIcon} alt="Store" className="h-full w-full cursor-pointer object-cover" />
            ) : (
              <span className="text-lg font-semibold text-gray-500 dark:text-gray-300">{item?.basicInfo?.firstName?.[0]?.toUpperCase() || ''}</span>
            )}
          </Avatar>
        </TableCell>

        <TableCell className="text-left text-sm">
          {item?.basicInfo?.firstName || '-'} {item?.basicInfo?.lastName || ''}
        </TableCell>

        <TableCell className="text-left text-sm">{item?.basicInfo?.organizationName || '-'}</TableCell>

        <TableCell className="text-left text-sm">
          {item?.basicInfo?.phoneNumber?.code || ''}
          {item?.basicInfo?.phoneNumber?.number || ''}
        </TableCell>

        <TableCell className="text-end">
          <div className="flex gap-2">
            <button
              type="button"
              title="View User"
              onClick={handleViewUser}
              className="cursor-pointer rounded-md bg-gray-100 p-1.5 transition hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700"
            >
              <Eye className="h-4 w-4 text-gray-700 dark:text-gray-200" />
            </button>

            <button
              type="button"
              title="Approve User"
              onClick={(e) => {
                e.stopPropagation();
                handlePending?.(item?.basicInfo?._id);
              }}
              className="dark:bg-primary dark:hover:bg-primary cursor-pointer rounded-md bg-blue-100 p-1.5 transition hover:bg-blue-200"
            >
              <Check className="text-primary h-4 w-4 dark:text-blue-300" />
            </button>

            <button
              type="button"
              title="Delete User"
              onClick={(e) => {
                e.stopPropagation();
                handleDelete?.(item?.basicInfo?._id);
              }}
              className="cursor-pointer rounded-md bg-red-100 p-1.5 transition hover:bg-red-200 dark:bg-red-900 dark:hover:bg-red-800"
            >
              <Trash2 className="h-4 w-4 text-red-600 dark:text-red-300" />
            </button>
          </div>
        </TableCell>
      </TableRow>

      <PendingUserDetailsModal user={item} isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
};
export default SupplierTypeTableRow;
