'use client';

import { Avatar, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import CustomBadge from '@/components/ui/custom-badge';
import { TableCell, TableRow } from '@/components/ui/table';
import { noImageUrl } from '@/constant/constant';
import { getStatusVariant } from '@/utils/short-utils';
import { Eye, Pencil } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { FC } from 'react';

interface PageProps {
  item: any;
  userType?: string;
  handleDelete?: (id: string) => void;
  handleEdit?: (id: string) => void;
}
const UserListTypeTableRow: FC<PageProps> = ({
  item,
  userType,
  handleEdit,
}) => {
  const router = useRouter();

  const handleNavigate = () => {
    if (userType === 'super-admin') {
      router.push(
        `/super-admin/user/${item?.basicInfo?._id}?userType=${item?.accountState?.userType}`
      );
    } else if (userType === 'organizer') {
      router.push(
        `/organizer/user/${item?.basicInfo?._id}?userType=${item?.accountState?.userType}`
      );
    }
  };

  return (
    <TableRow className="h-14 w-full transition-colors hover:bg-[#f5f5f5] dark:hover:bg-[#272727]/50">
      <TableCell>
        <Avatar className="flex h-12 w-12 items-center justify-center overflow-hidden !rounded-xl bg-gray-100 shadow-sm dark:bg-gray-800">
          {item?.basicInfo?.profileIcon &&
          item?.basicInfo?.profileIcon !== noImageUrl ? (
            <AvatarImage
              src={item?.basicInfo?.profileIcon}
              alt="Store"
              className="h-full w-full cursor-pointer object-cover"
            />
          ) : (
            <span className="text-lg font-semibold text-gray-500 dark:text-gray-300">
              {item?.basicInfo?.firstName?.[0]?.toUpperCase() || ''}
            </span>
          )}
        </Avatar>
      </TableCell>

      <TableCell className="text-left font-medium capitalize">
        {item?.basicInfo?.firstName || '-'}{" "}{item?.basicInfo?.lastName || ''}
      </TableCell>

      <TableCell className={`text-left text-sm`}>
        {item?.basicInfo?.username || '-'}
      </TableCell>

      <TableCell className="text-left text-sm capitalize">
        <Badge className="bg-secondary text-white dark:bg-white dark:text-black">
          {item?.accountState?.userType}
        </Badge>
      </TableCell>

      <TableCell className="text-left text-sm">-</TableCell>

      <TableCell className="text-left text-sm">-</TableCell>

      <TableCell className="text-left text-sm">-</TableCell>

      <TableCell className="text-muted-foreground text-left text-sm">
        <CustomBadge variant={getStatusVariant(item?.accountState?.status)}>
          {item?.accountState?.status}
        </CustomBadge>
      </TableCell>

      <TableCell className="text-center text-sm">
        {item?.metadata?.timezone || '-'}
      </TableCell>

      <TableCell className="text-end">
        <div className="flex gap-2">
          <button
            type="button"
            title="View User"
            onClick={handleNavigate}
            className="cursor-pointer rounded-md bg-gray-100 p-1.5 transition hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700"
          >
            <Eye className="h-4 w-4 text-gray-700 dark:text-gray-200" />
          </button>

          <button
            type="button"
            title="Edit"
            onClick={(e) => {
              e.stopPropagation();
              handleEdit?.(item?.basicInfo?._id);
            }}
            className="cursor-pointer rounded-md bg-gray-100 p-1.5 transition hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700"
          >
            <Pencil className="h-4 w-4 text-gray-700 dark:text-gray-200" />
          </button>
        </div>
      </TableCell>
    </TableRow>
  );
};
export default UserListTypeTableRow;
