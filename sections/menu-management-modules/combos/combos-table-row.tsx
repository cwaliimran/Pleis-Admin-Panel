'use client';

import CustomBadge from '@/components/ui/custom-badge';
import { TableCell, TableRow } from '@/components/ui/table';
import { CirclePlus, Pencil, Trash2 } from 'lucide-react';
import { FC } from 'react';
import { getComboFinalPrice, getPriceModeLabel, getRefLabel, getSumOfParts } from './combos-utils';
import { TableRowProps } from './types';

const STATUS_BADGE: Record<string, { variant: 'success' | 'error' | 'warning'; label: string }> = {
  active: { variant: 'success', label: 'Active' },
  inactive: { variant: 'error', label: 'Inactive' },
  draft: { variant: 'warning', label: 'Draft' },
};

const ComboTableRow: FC<TableRowProps> = ({ item, handleDelete, handleEdit }) => {
  const sumOfParts = getSumOfParts(item.menuItems);
  const finalPrice = getComboFinalPrice(item.priceMode, sumOfParts, item.price);
  const badge = STATUS_BADGE[item.status] || STATUS_BADGE.inactive;

  return (
    <TableRow className="h-14 w-full transition-colors hover:bg-[#f5f5f5] dark:hover:bg-[#272727]/50">
      <TableCell className="text-left">
        <div className="flex items-center gap-2">
          <span className="font-medium">{item.name}</span>
          <span className="inline-flex items-center gap-1 rounded-full bg-orange-100 px-2 py-0.5 text-[11px] font-medium text-orange-700">
            <CirclePlus className="h-3 w-3" />
            Combo
          </span>
        </div>
        <p className="text-muted-foreground mt-1 text-xs">Subcategory: {getRefLabel(item.subCategory)}</p>
        {/* {item.description && <p className="text-muted-foreground mt-1 text-xs">{item.description}</p>} */}
      </TableCell>

      <TableCell className="text-left">
        <div className="flex flex-col gap-0.5 text-sm">
          {(item.menuItems || []).map((menuItem, idx) => (
            <span key={`${getRefLabel(menuItem)}-${idx}`}>{getRefLabel(menuItem)}</span>
          ))}
        </div>
      </TableCell>

      <TableCell className="text-left">€{sumOfParts.toFixed(2)}</TableCell>

      <TableCell className="text-left">
        <div className="flex flex-col gap-0.5">
          <span className="text-muted-foreground text-xs">{getPriceModeLabel(item.priceMode)}</span>
          {/* `price` means something different per mode, so show what the guest actually pays. */}
          <span className="font-semibold">{finalPrice != null ? `€${finalPrice.toFixed(2)}` : '—'}</span>
        </div>
      </TableCell>

      <TableCell className="text-left">
        {!item.applicableMenus || item.applicableMenus.length === 0 ? (
          <span className="bg-accent text-muted-foreground rounded-full px-2 py-0.5 text-[11px]">— never appears</span>
        ) : (
          <div className="flex flex-wrap gap-1">
            {item.applicableMenus.map((menu) => (
              <span key={menu._id} className="rounded-full bg-blue-100 px-2 py-0.5 text-[11px] font-medium text-blue-700">
                {menu.title}
              </span>
            ))}
          </div>
        )}
      </TableCell>

      <TableCell className="text-left">
        <CustomBadge variant={badge.variant}>{badge.label}</CustomBadge>
      </TableCell>

      <TableCell className="text-end">
        <div className="flex justify-center gap-2">
          <button
            title="Edit Combo"
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handleEdit?.(item._id);
            }}
            className="cursor-pointer rounded-md bg-gray-100 p-1.5 transition hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700"
          >
            <Pencil className="h-4 w-4 text-gray-700 dark:text-gray-200" />
          </button>

          <button
            title="Delete Combo"
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handleDelete?.(item._id);
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

export default ComboTableRow;
