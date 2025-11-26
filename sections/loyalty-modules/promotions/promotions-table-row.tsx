'use client';

import { Avatar, AvatarImage } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { TableCell, TableRow } from '@/components/ui/table';
import { capitalizeFirstLetter, fDate, formatStr } from '@/utils/format-time';
import { Pencil, Trash2 } from 'lucide-react';
import { FC } from 'react';
import { TableRowProps } from './types';
import { noImageUrl, noImageUrlDev } from '@/constant/constant';

const PromotionsTableRow: FC<TableRowProps> = ({ item, handleDelete, handleEdit }) => {
  const getPromotionTypeLabel = (type: string) => {
    switch (type) {
      case 'buyMenuItem':
        return 'Buy Menu Item';
      case 'buyMenuItemPromotion':
        return 'Buy Menu Item';
      case 'happyHour':
        return 'Happy Hour';
      case 'claimPromotion':
        return 'Claim Promotion';
      case 'productSale':
        return 'Product Sale';
      default:
        return '-';
    }
  };

  return (
    <TableRow className="h-14 w-full transition-colors hover:bg-[#f5f5f5] dark:hover:bg-[#272727]/50">
      <TableCell>
        <Avatar className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-xl bg-gray-100 shadow-sm dark:bg-gray-800">
          {item?.image && item?.image !== noImageUrl && item?.image !== noImageUrlDev ? (
            <AvatarImage src={item?.image} alt="Menu Item" className="h-full w-full cursor-pointer object-cover" />
          ) : (
            <span className="text-lg font-semibold text-gray-500 dark:text-gray-300">{item?.title?.[0]?.toUpperCase() || ''}</span>
          )}
        </Avatar>
      </TableCell>

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

      <TableCell className="text-left">
        <span className="inline-block rounded-full bg-blue-100 px-2 py-1 text-xs font-medium text-blue-800 dark:bg-blue-900 dark:text-blue-200">
          {getPromotionTypeLabel(item?.promotionType)}
        </span>
      </TableCell>

      <TableCell className="text-left">
        {fDate(item?.startDate, item?.promotionType !== 'happyHour' ? formatStr.paramCase.date : formatStr.paramCase.dateTime)}
      </TableCell>

      <TableCell className="text-left">
        {fDate(item?.endDate, item?.promotionType !== 'happyHour' ? formatStr.paramCase.date : formatStr.paramCase.dateTime)}
      </TableCell>

      <TableCell className="text-left">{item?.tierLimit?.title || '-'}</TableCell>

      <TableCell className="text-left capitalize">{item?.recurringDetails?.frequency || '-'}</TableCell>

      <TableCell className="text-end">
        <div className="flex gap-2">
          <button
            title="View Venue"
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handleEdit?.(item?._id);
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
              handleDelete?.(item?._id);
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
export default PromotionsTableRow;
