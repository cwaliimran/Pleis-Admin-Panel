'use client';

import { TableCell, TableRow } from '@/components/ui/table';
import { fDate, formatStr } from '@/utils/format-time';
import { FC } from 'react';
import { TableRowProps } from './types';

const ReferralsTableRow: FC<TableRowProps> = ({ item, global }) => {
  return (
    <TableRow
      // onClick={handleNavigate}
      className="h-14 w-full transition-colors hover:bg-[#f5f5f5] dark:hover:bg-[#272727]/50"
    >
      {/* <TableCell>
        <Avatar className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-xl bg-gray-100 shadow-sm dark:bg-gray-800">
          {item?.profileIcon && item?.profileIcon !== noImageUrl && item?.profileIcon !== noImageUrlDev ? (
            <AvatarImage src={item?.profileIcon} alt="Menu Item" className="h-full w-full cursor-pointer object-cover" />
          ) : (
            <span className="text-lg font-semibold text-gray-500 dark:text-gray-300">{item?.firstName?.[0]?.toUpperCase() || ''}</span>
          )}
        </Avatar>
      </TableCell> */}

      <TableCell className="text-left">
        {item?.firstName || '-'} {item?.lastName || '-'}
      </TableCell>

      <TableCell className="text-left">{item?.referrerUserName}</TableCell>

      <TableCell className="text-left">{item?.referralLimit}</TableCell>

      <TableCell className="text-left">{global ? item?.referrerCount : item?.loyaltyReferralsCount}</TableCell>

      <TableCell className="text-left">{item?.userReward}</TableCell>

      <TableCell className="text-left">{item?.referrerReward}</TableCell>

      <TableCell className="text-left">{fDate(item?.createdAt, formatStr.split.date)}</TableCell>

      <TableCell className="text-left">{fDate(item?.expiryDate, formatStr.split.date)}</TableCell>
    </TableRow>
  );
};
export default ReferralsTableRow;
