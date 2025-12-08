'use client';

import CustomBadge from '@/components/ui/custom-badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { TableCell, TableRow } from '@/components/ui/table';
import { capitalizeFirstLetter, fDate, formatStr } from '@/utils/format-time';
import { FC } from 'react';
import { TableRowProps } from './types';

const MarketingRequestTableRow: FC<TableRowProps> = ({ user, item, handleEdit }) => {
  return (
    <TableRow className="h-14 w-full transition-colors hover:bg-[#f5f5f5] dark:hover:bg-[#272727]/50">
      <TableCell className="text-left capitalize">{item?.user?.name || '-'}</TableCell>

      <TableCell className="text-left capitalize">{item?.title || '-'}</TableCell>

      <TableCell className="text-left">
        {item.description.length > 22 ? (
          <Dialog>
            <DialogTrigger asChild>
              <span className="cursor-pointer hover:text-blue-600" title="Click to view full description">
                {capitalizeFirstLetter(item?.description?.slice(0, 22) + '...')}
              </span>
            </DialogTrigger>
            <DialogContent className="dark:bg-secondary max-w-md">
              <DialogHeader>
                <DialogTitle>Description</DialogTitle>
              </DialogHeader>
              <div className="py-4">
                <p className="text-sm leading-relaxed text-gray-700 dark:text-gray-300">{capitalizeFirstLetter(item?.description || '-')}</p>
              </div>
            </DialogContent>
          </Dialog>
        ) : (
          capitalizeFirstLetter(item?.description || '-')
        )}
      </TableCell>

      <TableCell className="text-left">{item?.email}</TableCell>

      <TableCell className="text-left">{item?.phone}</TableCell>

      <TableCell className="text-left">€{item?.budget}</TableCell>

      <TableCell className="text-left">{fDate(item?.createdAt, formatStr.paramCase.date)}</TableCell>

      <TableCell className="text-left">
        <CustomBadge
          variant={item.status === 'accept' ? 'success' : item.status === 'reject' ? 'error' : item.status === 'pending' ? 'warning' : 'info'}
        >
          {item?.status}
        </CustomBadge>
      </TableCell>

      {user?.accountState?.userType === 'admin' && (
        <TableCell className="text-left">
          <Select defaultValue={item.status} onValueChange={(value) => handleEdit?.(item?._id, value)}>
            <SelectTrigger className="w-[120px] rounded-md border text-left">
              <SelectValue placeholder="Select status" />
            </SelectTrigger>

            <SelectContent className="dark:bg-secondary">
              <SelectItem value="accept">Accept</SelectItem>
              <SelectItem value="reject">Reject</SelectItem>
              <SelectItem value="done">Done</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
            </SelectContent>
          </Select>
        </TableCell>
      )}
    </TableRow>
  );
};
export default MarketingRequestTableRow;
