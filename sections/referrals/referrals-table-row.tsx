'use client';

import { Avatar, AvatarImage } from '@/components/ui/avatar';
import { TableCell, TableRow } from '@/components/ui/table';
import { useAppNavigator } from '@/hooks/useAppNavigator';
import { Eye } from 'lucide-react';
import { FC } from 'react';
import { TableRowProps } from './types';

const ReferralsTableRow: FC<TableRowProps> = ({ item, userType }) => {
  const { navigate } = useAppNavigator();

  return (
    <TableRow
      onClick={() => navigate(`/${userType}/referrals/${item?._id}`)}
      className="h-14 w-full cursor-pointer transition-colors hover:bg-[#f5f5f5] dark:hover:bg-[#272727]/50"
    >
      <TableCell className="flex items-center gap-2 text-left">
        <Avatar className="h-8 w-8">
          <AvatarImage
            src="https://github.com/shadcn.png"
            alt={item.photo || 'User'}
            className="object-cover"
          />
        </Avatar>
        {item?.user || '-'}
      </TableCell>
      <TableCell className="text-left">{item?.referrer || '-'}</TableCell>
      <TableCell className="text-left">{item?.refLimit || '-'}</TableCell>
      <TableCell className="text-left">{item?.refCount || '-'}</TableCell>
      <TableCell className="text-left">{item?.userPoints || '-'}</TableCell>
      <TableCell className="text-left">{item?.refPoints || '-'}</TableCell>
      <TableCell className="text-left">{item?.createdAt || '-'}</TableCell>
      <TableCell className="text-center">
        <div className="flex justify-center gap-2">
          <button
            title="View Venue"
            type="button"
            className="cursor-pointer rounded-md bg-gray-100 p-1.5 transition hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700"
          >
            <Eye className="h-4 w-4 text-gray-700 dark:text-gray-200" />
          </button>
        </div>
      </TableCell>
    </TableRow>
  );
};
export default ReferralsTableRow;
