'use client';

import { Avatar, AvatarImage } from '@/components/ui/avatar';
import CustomBadge from '@/components/ui/custom-badge';
import { TableCell, TableRow } from '@/components/ui/table';
import { noImageUrl, noImageUrlDev } from '@/constant/constant';
import { fDate, formatStr } from '@/utils/format-time';
import { Eye, Pencil, Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { FC } from 'react';

interface PageProps {
  item: any;
  handleDelete?: (id: string) => void;
  userType?: any;
}

const OrganizationTypeTableRow: FC<PageProps> = ({ item, handleDelete, userType }) => {
  const router = useRouter();

  return (
    <TableRow
      className="h-14 w-full cursor-pointer transition-colors hover:bg-[#f5f5f5] dark:hover:bg-[#272727]/50"
      onClick={() =>
        userType === 'organizer' ? router.push(`/organizer/organization/${item?._id}`) : router.push(`/super-admin/organization/${item?._id}`)
      }
    >
      <TableCell>
        <Avatar className="flex h-12 w-12 items-center justify-center overflow-hidden !rounded-xl bg-gray-100 shadow-sm dark:bg-gray-800">
          {item?.basicInfo?.media?.logo && item?.basicInfo?.media?.logo !== noImageUrl && item?.basicInfo?.media?.logo !== noImageUrlDev ? (
            <AvatarImage src={item?.basicInfo?.media?.logo} alt="Store" className="h-full w-full cursor-pointer object-cover" />
          ) : (
            <span className="text-lg font-semibold text-gray-500 dark:text-gray-300">{item?.basicInfo?.name?.[0]?.toUpperCase() || ''}</span>
          )}
        </Avatar>
      </TableCell>

      <TableCell className="text-left font-medium capitalize">{item?.basicInfo?.name || '-'}</TableCell>

      <TableCell className="text-left text-sm">{item?.organizer || '-'}</TableCell>

      <TableCell className="text-left text-sm">{fDate(item?.createdAt, formatStr.paramCase.date)}</TableCell>

      <TableCell className="text-left text-sm">-</TableCell>

      <TableCell className="text-left text-sm">-</TableCell>

      <TableCell className="text-left text-sm">-</TableCell>

      <TableCell className="text-left text-sm">-</TableCell>

      <TableCell className="text-left text-sm">-</TableCell>

      <TableCell className="text-muted-foreground text-left text-sm">
        <CustomBadge variant={item?.status === 'active' ? 'success' : item?.status === 'inactive' ? 'error' : 'default'}>{item?.status}</CustomBadge>
      </TableCell>

      <TableCell className="text-end">
        <div className="flex gap-2">
          <button
            title="View Organization"
            type="button"
            className="cursor-pointer rounded-md bg-gray-100 p-1.5 transition hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700"
          >
            <Eye className="h-4 w-4 text-gray-700 dark:text-gray-200" />
          </button>

          <button
            title="Edit Organization"
            type="button"
            className="cursor-pointer rounded-md bg-gray-100 p-1.5 transition hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700"
          >
            <Pencil className="h-4 w-4 text-gray-700 dark:text-gray-200" />
          </button>

          <button
            type="button"
            title="Delete"
            onClick={(e) => {
              e.stopPropagation();
              handleDelete?.(item._id);
            }}
            className="cursor-pointer rounded-md bg-red-100 p-1.5 transition hover:bg-red-200 dark:bg-red-900 dark:hover:bg-red-800"
          >
            <Trash2 className="h-4 w-4 text-red-600 dark:text-red-300" />
          </button>
        </div>
      </TableCell>
    </TableRow>
  );
};
export default OrganizationTypeTableRow;
