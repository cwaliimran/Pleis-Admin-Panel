'use client';

import { TruncatedTextWithModal } from '@/components/common/long-text-modal';
import CustomBadge from '@/components/ui/custom-badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { TableCell, TableRow } from '@/components/ui/table';
import { fDate, formatStr } from '@/utils/format-time';
import { FC } from 'react';
import { TableRowProps } from './types';

const MarketingRequestTableRow: FC<TableRowProps> = ({ user, item, handleEdit }) => {
  return (
    <TableRow className="h-14 w-full transition-colors hover:bg-[#f5f5f5] dark:hover:bg-[#272727]/50">
      <TableCell className="text-left capitalize">
        {item?.userId?.firstName} {item?.userId?.lastName}
      </TableCell>

      <TableCell className="text-left capitalize">{item?.title || '-'}</TableCell>

      <TableCell className="text-left">
        <TruncatedTextWithModal text={item?.description} title="Description" />
      </TableCell>

      <TableCell className="text-left">{item?.email}</TableCell>

      <TableCell className="text-left">
        {item?.phoneNumber?.code} {item?.phoneNumber?.number}
      </TableCell>

      <TableCell className="text-left">{item?.budget ? `€${item?.budget}` : 'N/A'}</TableCell>

      <TableCell className="text-left">{fDate(item?.createdAt, formatStr.paramCase.date)}</TableCell>

      <TableCell className="text-left">
        <CustomBadge
          variant={item.status === 'active' ? 'success' : item.status === 'rejected' ? 'error' : item.status === 'pending' ? 'warning' : 'info'}
        >
          {item?.status}
        </CustomBadge>
      </TableCell>

      {user?.accountState?.userType === 'admin' && (
        <TableCell className="text-left">
          <Select defaultValue={item.status} onValueChange={(value) => handleEdit?.(item?._id, value)}>
            <SelectTrigger className="w-[140px] rounded-md border text-left">
              <SelectValue placeholder="Select status" />
            </SelectTrigger>

            <SelectContent className="dark:bg-secondary">
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
            </SelectContent>
          </Select>
        </TableCell>
      )}
    </TableRow>
  );
};
export default MarketingRequestTableRow;
