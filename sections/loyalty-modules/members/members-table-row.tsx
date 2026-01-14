'use client';

import { Avatar, AvatarImage } from '@/components/ui/avatar';
import CustomBadge from '@/components/ui/custom-badge';
import { TableCell, TableRow } from '@/components/ui/table';
import { noImageUrl, noImageUrlDev } from '@/constant/constant';
import { getStatusVariant } from '@/utils/short-utils';
import { Eye, Gift } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { FC } from 'react';
import { TableRowProps } from './types';

const LoyaltyMembersTableRow: FC<TableRowProps> = ({ item, global, userType, handleGiftModal }) => {
  const router = useRouter();

  const handleNavigate = () => {
    const userId = item?._id;
    if (!userId || !userType) return;

    if (userId) {
      router.push(`/${userType}/members/${userId}`);
      return;
    }
  };

  return (
    <>
      <TableRow className="h-14 w-full transition-colors hover:bg-[#f5f5f5] dark:hover:bg-[#272727]/50">
        <TableCell>
          <Avatar className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-xl bg-gray-100 shadow-sm dark:bg-gray-800">
            {item?.user?.profileIcon && item?.user?.profileIcon !== noImageUrl && item?.user?.profileIcon !== noImageUrlDev ? (
              <AvatarImage src={item?.user?.profileIcon} alt="Menu Item" className="h-full w-full cursor-pointer object-cover" />
            ) : (
              <span className="text-lg font-semibold text-gray-500 dark:text-gray-300">{item?.user?.firstName?.[0]?.toUpperCase() || ''}</span>
            )}
          </Avatar>
        </TableCell>

        <TableCell className="text-left capitalize">{item?.user?.username || 'N/A'}</TableCell>

        {global && <TableCell className="text-left capitalize">{item?.user?.globalStatus || 'N/A'}</TableCell>}

        <TableCell className="text-left capitalize">{item?.points || 'N/A'}</TableCell>

        <TableCell className="text-left capitalize">{item?.user?.revenue || 'N/A'}</TableCell>

        <TableCell className="text-left">
          <CustomBadge variant={getStatusVariant(item.status)}>{item.status}</CustomBadge>
        </TableCell>

        <TableCell className="text-left capitalize">{item?.user?.timezone || 'N/A'}</TableCell>

        <TableCell className="text-end">
          <div className="flex items-center justify-center gap-2">
            <button
              type="button"
              title="Gift Points"
              onClick={(e) => {
                e.stopPropagation();
                handleGiftModal(item?._id);
              }}
              className="cursor-pointer rounded-md bg-gray-100 p-1.5 transition hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700"
            >
              <Gift className="h-4 w-4 text-gray-700 dark:text-gray-200" />
            </button>

            <button
              type="button"
              title="View User"
              onClick={handleNavigate}
              className="cursor-pointer rounded-md bg-gray-100 p-1.5 transition hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700"
            >
              <Eye className="h-4 w-4 text-gray-700 dark:text-gray-200" />
            </button>
          </div>
        </TableCell>
      </TableRow>
    </>
  );
};
export default LoyaltyMembersTableRow;
