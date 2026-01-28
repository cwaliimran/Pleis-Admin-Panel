'use client';

import { Avatar, AvatarImage } from '@/components/ui/avatar';
import { TableCell, TableRow } from '@/components/ui/table';
import { noImageUrl, noImageUrlDev } from '@/constant/constant';
import { fDate, formatStr } from '@/utils/format-time';
import { FC } from 'react';
import { TableRowProps } from './types';

const StreaksTableRow: FC<TableRowProps> = ({ item }) => {
  const username = item?.user?.username.toLowerCase() || `N/A`;

  return (
    <TableRow className="h-14 w-full transition-colors hover:bg-[#f5f5f5] dark:hover:bg-[#272727]/50">
      <TableCell>
        <Avatar className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-xl bg-gray-100 shadow-sm dark:bg-gray-800">
          {item?.user?.profileIcon && item?.user?.profileIcon !== noImageUrl && item?.user?.profileIcon !== noImageUrlDev ? (
            <AvatarImage src={item?.user?.profileIcon} alt="Menu Item" className="h-full w-full cursor-pointer object-cover" />
          ) : (
            <span className="text-lg font-semibold text-gray-500 dark:text-gray-300">{item?.user?.username?.[0]?.toUpperCase() || ''}</span>
          )}
        </Avatar>
      </TableCell>
      <TableCell className="text-left">{username}</TableCell>
      <TableCell className="text-left">
        {item?.user?.firstName} {item?.user?.lastName}
      </TableCell>
      <TableCell className="text-left">{item?.streak || 'N/A'}</TableCell>
      <TableCell className="text-left">{item?.longestStreak || 'N/A'}</TableCell>
      <TableCell className="text-left">{item?.points || 'N/A'}</TableCell>
      <TableCell className="text-left">{item?.visits || 'N/A'}</TableCell>
      <TableCell className="text-left">{fDate(item?.lastVisitAt, formatStr.split.dateTime)}</TableCell>
    </TableRow>
  );
};
export default StreaksTableRow;
