'use client';

import CustomBadge from '@/components/ui/custom-badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { TableCell, TableRow } from '@/components/ui/table';
import { capitalizeFirstLetter, fDate, formatStr } from '@/utils/format-time';
import { showError, showSuccess } from '@/utils/toast';
import { Copy, Pencil, Trash2 } from 'lucide-react';
import { FC } from 'react';
import { TableRowProps } from './types';

const handleCopyPromoCode = async (promoCode: string) => {
  try {
    await navigator.clipboard.writeText(promoCode);
    showSuccess('Promo code copied to clipboard!');
  } catch {
    showError('Failed to copy promo code.');
  }
};

const PromoCodeTableRow: FC<TableRowProps> = ({ item, handleDelete, handleEdit }) => {
  return (
    <TableRow className="h-14 w-full transition-colors hover:bg-[#f5f5f5] dark:hover:bg-[#272727]/50">
      <TableCell className="text-left capitalize">{item?.title || '-'}</TableCell>

      <TableCell className="text-left capitalize">
        <div className="flex items-center gap-2">
          {item?.promoCode || '-'}
          {item?.promoCode && (
            <Copy
              size={15}
              className="cursor-pointer text-black/80 dark:text-white/80"
              onClick={(e) => {
                e.stopPropagation();
                handleCopyPromoCode(item.promoCode);
              }}
            />
          )}
        </div>
      </TableCell>

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

      <TableCell className="text-left capitalize">{item?.discountType}</TableCell>

      <TableCell className="text-left">
        {item?.discountValue}
        {item?.discountType === 'amount' ? ' €' : item?.discountType === 'percentage' ? ' %' : ''}
      </TableCell>

      <TableCell className="text-left">{item?.maxDiscountCap}</TableCell>

      <TableCell className="text-left">{item?.maxUsage}</TableCell>

      <TableCell className="text-left">{item?.usedCount}</TableCell>

      <TableCell className="text-left">{fDate(item?.expiryDate, formatStr.split.date)}</TableCell>

      <TableCell className="text-left">
        <CustomBadge variant={item.status === 'active' ? 'success' : item.status === 'inactive' ? 'error' : 'info'}>{item.status}</CustomBadge>
      </TableCell>

      <TableCell className="text-end">
        <div className="flex gap-2">
          <button
            title="Edit Promo Code"
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
            title="Delete Promo Code"
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
export default PromoCodeTableRow;
