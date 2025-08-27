'use client';

import { PrimaryIcon } from '@/assets/svg/svg-icon';
import { Avatar, AvatarImage } from '@/components/ui/avatar';
import CustomBadge from '@/components/ui/custom-badge';
import { TableCell, TableRow } from '@/components/ui/table';
import { fDate, formatStr } from '@/utils/format-time';
import { Pencil, Trash2 } from 'lucide-react';
import { FC } from 'react';

interface PageProps {
  item: any;
  handleDelete?: (id: string) => void;
  handleEdit?: (id: string) => void;
}
const VenueTypeTableRow: FC<PageProps> = ({
  item,
  handleDelete,
  handleEdit,
}) => {
  return (
    <TableRow className="h-14 w-full transition-colors hover:bg-[#f5f5f5] dark:hover:bg-[#272727]/50">
      <TableCell>
        <div className="flex items-center gap-3">{item?.title || '-'}</div>
      </TableCell>

      <TableCell className="text-left">
        {fDate(item?.createdAt, formatStr.paramCase.date)}
      </TableCell>

      <TableCell className="flex items-center gap-2 text-left">
        <Avatar className="">
          <AvatarImage
            src="https://github.com/shadcn.png"
            alt="Store"
            className=""
          />
        </Avatar>
        {item?.location?.fullAddress}
      </TableCell>

      <TableCell className="text-left">
        {item?.location?.fullAddress || '-'}
      </TableCell>

      <TableCell className="text-muted-foreground text-left text-sm">
        <CustomBadge
          variant={
            item?.status === 'active'
              ? 'success'
              : item?.status === 'inactive'
                ? 'error'
                : 'default'
          }
        >
          {item?.status}
        </CustomBadge>
      </TableCell>

      <TableCell className="text-left">
        {fDate(item?.updatedAt, formatStr.paramCase.date)}
      </TableCell>

      <TableCell className="text-end">
        <div className="flex gap-2">
          <button
            type="button"
            title="Select Primary"
            className={`cursor-pointer rounded-md ${item?.pinned ? 'bg-green-600 text-white dark:bg-green-700' : 'bg-gray-100 dark:bg-gray-800'} p-1.5 transition`}
          >
            <PrimaryIcon />
          </button>

          <button
            title="View Venue"
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handleEdit?.(item);
            }}
            className="cursor-pointer rounded-md bg-gray-100 p-1.5 transition hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700"
          >
            <Pencil className="h-4 w-4 text-gray-700 dark:text-gray-200" />
          </button>

          <button
            title="View Venue"
            type="button"
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
export default VenueTypeTableRow;
