'use client';

import { Avatar, AvatarImage } from '@/components/ui/avatar';
import { TableCell, TableRow } from '@/components/ui/table';
import { FC } from 'react';
import { TableRowProps } from './types';

const StreaksTableRow: FC<TableRowProps> = ({ item }) => {
  return (
    <TableRow className="h-14 w-full transition-colors hover:bg-[#f5f5f5] dark:hover:bg-[#272727]/50">
      <TableCell>
        <Avatar className="h-8 w-8">
          <AvatarImage
            src="https://github.com/shadcn.png"
            alt={item.photo}
            className="object-cover"
          />
        </Avatar>
      </TableCell>
      <TableCell className="text-left">{item.username}</TableCell>
      <TableCell className="text-left">{item.streak}</TableCell>
      <TableCell className="text-left">{item.longestStreak}</TableCell>
      <TableCell className="text-left">{item.pointsEarned}</TableCell>
    </TableRow>
  );
};
export default StreaksTableRow;
