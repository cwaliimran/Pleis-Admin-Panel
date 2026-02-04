'use client';

import { TruncatedTextWithModal } from '@/components/common/long-text-modal';
import { TableCell, TableRow } from '@/components/ui/table';
import { fDate, formatStr } from '@/utils/format-time';
import { FC } from 'react';
import { TableRowProps } from './types';
import { getDomainType } from '../helpers';

const UserAllTransactionTableRow: FC<TableRowProps> = ({ item }) => {
  const getLabel = (type: string) => {
    switch (type) {
      case 'earn':
        return 'Earn';
      case 'redeem':
        return 'Redeem';
      case 'adjustment':
        return 'Adjustment';
      default:
        return '-';
    }
  };

  return (
    <>
      <TableRow className="h-14 w-full transition-colors hover:bg-[#f5f5f5] dark:hover:bg-[#272727]/50">
        <TableCell className="text-left capitalize">
          {item?.user?.firstName || ''} {item?.user?.lastName || ''}
        </TableCell>

        <TableCell className="text-left">
          <TruncatedTextWithModal text={item?.description || 'N/A'} title="Description" />
        </TableCell>

        <TableCell className="text-left capitalize">{item?.organization?.basicInfo?.name || 'N/A'}</TableCell>

        <TableCell className="text-left capitalize">
          <TruncatedTextWithModal text={item?.publicId} title="Public ID" />
        </TableCell>

        <TableCell className="text-left capitalize">{item?.batchId || 'N/A'}</TableCell>

        <TableCell className="text-left capitalize">{getLabel(item?.type)}</TableCell>

        {/* <TableCell className="text-left capitalize">{item?.domainType || 'N/A'}</TableCell> */}
        <TableCell className="text-left capitalize">{getDomainType(item?.domainType)}</TableCell>

        <TableCell className="text-left capitalize">{item?.points.total || 'N/A'}</TableCell>

        <TableCell className="text-left">{fDate(item?.createdAt, formatStr.split.dateTime)}</TableCell>

        {/* <TableCell className="text-center">
          <CustomBadge
            variant={
              item?.status === 'confirmed' ? 'success' : item?.status === 'pending' ? 'warning' : item?.status === 'cancelled' ? 'error' : 'default'
            }
          >
            {item?.status === 'confirmed'
              ? 'gaining'
              : item?.status === 'pending'
                ? 'pending'
                : item?.status === 'cancelled'
                  ? 'cancelled'
                  : 'spending'}
          </CustomBadge>
        </TableCell> */}
      </TableRow>
    </>
  );
};
export default UserAllTransactionTableRow;
