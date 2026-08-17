'use client';

import { Avatar, AvatarImage } from '@/components/ui/avatar';
import CustomBadge from '@/components/ui/custom-badge';
import { TableCell, TableRow } from '@/components/ui/table';
import { noImageUrl, noImageUrlDev, noImageUrlDevCap } from '@/constant/constant';
import { Pencil, Tag, Trash2, TrendingUp } from 'lucide-react';
import { FC } from 'react';
import { getRefLabel, getServingLabel } from './menuItems-utils';
import { TableRowProps } from './types';

const PLACEHOLDER_IMAGE_URLS: string[] = [noImageUrl, noImageUrlDev, noImageUrlDevCap];

const MenuItemTableRow: FC<TableRowProps> = ({ item, lookups, handleDelete, handleEdit }) => {
  const menuTitle = getRefLabel(item.menu, lookups.menus);
  const subCategoryTitle = getRefLabel(item.subCategory, lookups.subCategories);
  const servingLabel = getServingLabel(item.serving) || getRefLabel(item.servingSize, lookups.servingSizes);

  // const subtitle = [item.amountQuantity].filter(Boolean).join(' · ');
  const hasDiscount = !!item.discountPrice && item.discountPrice > 0 && item.discountPrice < item.basePrice;
  const discountPercent = hasDiscount ? Math.round((1 - item.discountPrice! / item.basePrice) * 100) : 0;

  return (
    <TableRow className="h-14 w-full transition-colors hover:bg-[#f5f5f5] dark:hover:bg-[#272727]/50">
      <TableCell>
        <Avatar className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-xl bg-gray-100 shadow-sm dark:bg-gray-800">
          {item?.image && !PLACEHOLDER_IMAGE_URLS.includes(item.image) ? (
            <AvatarImage src={item.image} alt={item?.title} className="h-full w-full cursor-pointer object-cover" />
          ) : (
            <span className="text-lg font-semibold text-gray-500 dark:text-gray-300">{item?.title?.[0]?.toUpperCase() || ''}</span>
          )}
        </Avatar>
      </TableCell>

      <TableCell className="py-3 text-left">
        <div className="flex flex-col items-start gap-2">
          <span className="font-semibold capitalize">{item?.title || '-'}</span>

          {item.upSellItem === true || item.upSellItem === 'true' || item.isRecommended === true ? (
            <div className="item-start flex gap-x-2">
              {(item.upSellItem === true || item.upSellItem === 'true') && (
                <CustomBadge variant="info" className="gap-1 px-2 py-0.5 text-[11px]">
                  <TrendingUp className="h-3 w-3" />
                  Upsell
                </CustomBadge>
              )}

              {item.isRecommended === true && (
                <CustomBadge variant="warning" className="gap-1 px-2 py-0.5 text-[11px]">
                  <TrendingUp className="h-3 w-3" />
                  Recommended
                </CustomBadge>
              )}
            </div>
          ) : null}
        </div>

        {/* {subtitle && <div className="text-muted-foreground mt-0.5 text-xs">{subtitle}</div>} */}
      </TableCell>

      <TableCell className="text-left capitalize">{menuTitle}</TableCell>

      <TableCell className="text-left capitalize">{subCategoryTitle}</TableCell>

      <TableCell className="text-left capitalize">{servingLabel}</TableCell>

      <TableCell className="text-left">
        <div className="flex items-center gap-2">
          <span className="font-semibold">{item.basePrice.toFixed(2)}</span>
          {hasDiscount ? (
            <CustomBadge variant="error" className="gap-1 px-2 py-0.5 text-[11px]">
              <Tag className="h-3 w-3" />-{discountPercent}%
            </CustomBadge>
          ) : null}
        </div>
      </TableCell>

      <TableCell className="text-left">
        <CustomBadge variant={item.status === 'active' ? 'success' : 'error'}>{item.status}</CustomBadge>
      </TableCell>

      <TableCell className="text-end">
        <div className="flex justify-center gap-2">
          <button
            title="Edit Menu Item"
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
            title="Delete Menu Item"
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
export default MenuItemTableRow;
