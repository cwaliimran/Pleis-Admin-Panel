'use client';

import CustomBadge from '@/components/ui/custom-badge';
import { TableCell, TableRow } from '@/components/ui/table';
import { Pencil, Trash2 } from 'lucide-react';
import { FC } from 'react';
import { TableRowProps } from './types';

const CATEGORY_BADGE_VARIANT: Record<string, 'info' | 'warning'> = {
  'preset-cat-1': 'info',
  'preset-cat-2': 'warning',
};

const PresetTypeTableRow: FC<TableRowProps> = ({ item, categories, subcategories, typeNames, handleDelete, handleEdit }) => {
  const category = categories.find((cat) => cat._id === item.categoryId);
  const subcategory = subcategories.find((sub) => sub._id === item.subcategoryId);
  const typeName = item.name || typeNames.find((type) => type._id === item.typeNameId)?.title;

  return (
    <TableRow className="h-14 w-full transition-colors hover:bg-[#f5f5f5] dark:hover:bg-[#272727]/50">
      <TableCell className="text-left font-mono font-semibold">{item.code}</TableCell>

      <TableCell className="text-left">
        <CustomBadge variant={CATEGORY_BADGE_VARIANT[item.categoryId] || 'default'} className="uppercase">
          {category?.code || '-'}
        </CustomBadge>
      </TableCell>

      <TableCell className="text-left">{subcategory?.title || '-'}</TableCell>

      <TableCell className="text-left">{typeName || '-'}</TableCell>

      <TableCell className="text-left">
        <CustomBadge variant={item.status === 'active' ? 'success' : 'default'}>{item.status}</CustomBadge>
      </TableCell>

      <TableCell className="text-end">
        <div className="flex justify-center gap-2">
          <button
            title="Edit Preset Type"
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
            title="Delete Preset Type"
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

export default PresetTypeTableRow;
