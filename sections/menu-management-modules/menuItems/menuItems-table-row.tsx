'use client';

import { Avatar, AvatarImage } from '@/components/ui/avatar';
import CustomBadge from '@/components/ui/custom-badge';
import { TableCell, TableRow } from '@/components/ui/table';
import { noImageUrl, noImageUrlDev } from '@/constant/constant';
import { Layers, Pencil, Tag, Trash2, TrendingUp } from 'lucide-react';
import { FC } from 'react';
import { formatAvailableDays, formatDaypart } from './constants';
import { TableRowProps } from './types';

const MenuItemTableRow: FC<TableRowProps> = ({ item, menus, subcategories, presetTypes, allItems, handleDelete, handleEdit }) => {
  const menuTitles = item.menuIds.map((id) => menus.find((menu) => menu._id === id)?.title).filter(Boolean).join(', ') || '-';
  const subcategoryTitle = subcategories.find((subcategory) => subcategory._id === item.subcategoryId)?.title || '-';
  const presetType = presetTypes.find((preset) => preset._id === item.presetTypeId);

  const isCombo = item.quantityType === 'combo';
  const comboItems = isCombo ? (item.comboItemIds || []).map((id) => allItems.find((menuItem) => menuItem._id === id)).filter(Boolean) : [];
  const sumOfParts = comboItems.reduce((sum, comboItem) => sum + (comboItem?.price || 0), 0);
  const discountPercent = isCombo && sumOfParts > item.price ? Math.round((1 - item.price / sumOfParts) * 100) : 0;

  const subtitle = isCombo
    ? `${comboItems.length} items${item.availableDays.length ? ` · ${formatAvailableDays(item.availableDays)}` : ''}${
        item.daypart?.length ? ` · ${formatDaypart(item.daypart)}` : ''
      }`
    : [presetType?.label, item.amount].filter(Boolean).join(' · ');

  return (
    <TableRow className="h-14 w-full transition-colors hover:bg-[#f5f5f5] dark:hover:bg-[#272727]/50">
      <TableCell>
        <Avatar className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-xl bg-gray-100 shadow-sm dark:bg-gray-800">
          {item?.image && item.image !== noImageUrl && item.image !== noImageUrlDev ? (
            <AvatarImage src={item?.image} alt={item?.title} className="h-full w-full cursor-pointer object-cover" />
          ) : (
            <span className="text-lg font-semibold text-gray-500 dark:text-gray-300">{item?.title?.[0]?.toUpperCase() || ''}</span>
          )}
        </Avatar>
      </TableCell>

      <TableCell className="text-left">
        <div className="flex items-center gap-2">
          <span className="font-semibold capitalize">{item?.title || '-'}</span>
          {isCombo && (
            <CustomBadge variant="warning" className="gap-1 px-2 py-0.5 text-[11px]">
              <Layers className="h-3 w-3" />
              Combo
            </CustomBadge>
          )}
          {item.isUpsell && (
            <CustomBadge variant="info" className="gap-1 px-2 py-0.5 text-[11px]">
              <TrendingUp className="h-3 w-3" />
              Upsell
            </CustomBadge>
          )}
        </div>
        {subtitle && <div className="text-muted-foreground mt-0.5 text-xs">{subtitle}</div>}
      </TableCell>

      <TableCell className="text-left capitalize">{menuTitles}</TableCell>

      <TableCell className="text-left capitalize">{subcategoryTitle}</TableCell>

      <TableCell className="text-left capitalize">{presetType?.label || '—'}</TableCell>

      <TableCell className="text-left capitalize">{isCombo ? 'Combo' : item.serving}</TableCell>

      <TableCell className="text-left">
        <div className="flex items-center gap-2">
          <span className="font-semibold">{item.price.toFixed(2)}</span>
          {discountPercent > 0 ? (
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
