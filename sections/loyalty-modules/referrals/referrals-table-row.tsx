'use client';

// import { Avatar, AvatarImage } from '@/components/ui/avatar';
import { TableCell, TableRow } from '@/components/ui/table';
// import { useAppNavigator } from '@/hooks/useAppNavigator';
import { fDate, formatStr } from '@/utils/format-time';
import { FC } from 'react';
import { TableRowProps } from './types';
// import { noImageUrl, noImageUrlDev } from '@/constant/constant';

const ReferralsTableRow: FC<TableRowProps> = ({ item }) => {
  // const { navigate } = useAppNavigator();

  // const handleNavigate = () => {
  //   if (global) {
  //     navigate(`/${userType}/global-referrals/${item?._id}`);
  //   } else {
  //     navigate(`/${userType}/referrals/${item?._id}`);
  //   }
  // };

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

      <TableCell className="text-left">{item?.referrerUserName || '-'}</TableCell>

      <TableCell className="text-left">{item?.referralLimit}</TableCell>

      <TableCell className="text-left">{item?.referrerCount}</TableCell>

      <TableCell className="text-left">{item?.userReward}</TableCell>

      <TableCell className="text-left">{item?.referrerReward}</TableCell>

      <TableCell className="text-left">{fDate(item?.createdAt, formatStr.paramCase.date)}</TableCell>

      {/* <TableCell className="text-center">
        <div className="flex justify-center gap-2">
          <button
            title="View Venue"
            type="button"
            className="cursor-pointer rounded-md bg-gray-100 p-1.5 transition hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700"
          >
            <Eye className="h-4 w-4 text-gray-700 dark:text-gray-200" />
          </button>
        </div>
      </TableCell> */}
    </TableRow>
  );
};
export default ReferralsTableRow;
