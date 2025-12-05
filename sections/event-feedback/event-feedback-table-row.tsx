'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { TableCell, TableRow } from '@/components/ui/table';
import { capitalizeFirstLetter, fDate, formatStr } from '@/utils/format-time';
import { FC } from 'react';
import { TableRowProps } from './types';

const EventFeedbackTableRow: FC<TableRowProps> = ({ item }) => {
  return (
    <TableRow className="h-14 w-full transition-colors hover:bg-[#f5f5f5] dark:hover:bg-[#272727]/50">
      <TableCell className="text-left capitalize">{item?.title || '-'}</TableCell>

      <TableCell className="text-left capitalize">{item?.username || '-'}</TableCell>

      <TableCell className="text-left">
        {item?.comment?.length > 22 ? (
          <Dialog>
            <DialogTrigger asChild>
              <span className="cursor-pointer hover:text-blue-600" title="Click to view full description">
                {capitalizeFirstLetter(item?.comment?.slice(0, 22) + '...')}
              </span>
            </DialogTrigger>
            <DialogContent className="dark:bg-secondary max-w-md">
              <DialogHeader>
                <DialogTitle>Comment</DialogTitle>
              </DialogHeader>
              <div className="py-4">
                <p className="text-sm leading-relaxed text-gray-700 dark:text-gray-300">{capitalizeFirstLetter(item?.comment || '-')}</p>
              </div>
            </DialogContent>
          </Dialog>
        ) : (
          capitalizeFirstLetter(item?.comment || '-')
        )}
      </TableCell>

      <TableCell className="text-left">{item?.rating || '-'}</TableCell>

      <TableCell className="text-left">{fDate(item?.createdAt, formatStr.paramCase.dateTime)}</TableCell>
    </TableRow>
  );
};
export default EventFeedbackTableRow;
