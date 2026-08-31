'use client';

import CustomBadge from '@/components/ui/custom-badge';
import { TableCell, TableRow } from '@/components/ui/table';
import { cn } from '@/lib/utils';
import { fDate, formatStr } from '@/utils/format-time';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, Loader2, Pencil, Trash2 } from 'lucide-react';
import { FC } from 'react';
import { TableRowProps } from './types';

const MenuSubcategoryTableRow: FC<TableRowProps> = ({ item, handleDelete, handleEdit, dragDisabled, deleteChecking }) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: item._id,
    disabled: dragDisabled,
  });

  const dragStyle = transform ? { transform: CSS.Transform.toString(transform), transition } : undefined;

  return (
    <TableRow
      ref={setNodeRef}
      style={dragStyle}
      className={cn('h-14 w-full transition-colors hover:bg-[#f5f5f5] dark:hover:bg-[#272727]/50', isDragging && 'opacity-50')}
    >
      <TableCell className="w-10">
        <button
          type="button"
          title={dragDisabled ? 'Clear filters to reorder' : 'Drag to reorder'}
          disabled={dragDisabled}
          {...attributes}
          {...listeners}
          className={cn(
            'rounded p-1 text-gray-400 transition hover:bg-gray-100 dark:hover:bg-gray-700',
            dragDisabled ? 'cursor-not-allowed opacity-40' : 'cursor-grab hover:cursor-grabbing'
          )}
        >
          <GripVertical className="h-4 w-4" />
        </button>
      </TableCell>

      <TableCell className="text-left">
        <span className="font-semibold">{item.title || '-'}</span>
      </TableCell>

      <TableCell className="text-left">
        <span className="font-semibold">{item.order || '-'}</span>
      </TableCell>

      <TableCell className="text-left">
        <span className="font-semibold">{item?.menuItemsCount}</span>
      </TableCell>

      <TableCell className="text-left">{fDate(item.createdAt, formatStr.split.date)}</TableCell>

      <TableCell className="text-left">
        <CustomBadge variant={item.status === 'active' ? 'success' : 'error'}>{item.status}</CustomBadge>
      </TableCell>

      <TableCell className="text-end">
        <div className="flex justify-center gap-2">
          <button
            title="Edit Subcategory"
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
            title={deleteChecking ? 'Checking menu items...' : 'Delete Subcategory'}
            type="button"
            disabled={deleteChecking}
            onClick={(e) => {
              e.stopPropagation();
              handleDelete?.(item._id);
            }}
            className={cn(
              'rounded-md bg-red-100 p-1.5 transition dark:bg-red-900',
              deleteChecking ? 'cursor-not-allowed opacity-70' : 'cursor-pointer hover:bg-red-200 dark:hover:bg-red-800'
            )}
          >
            {deleteChecking ? (
              <Loader2 className="h-4 w-4 animate-spin text-red-600 dark:text-red-300" />
            ) : (
              <Trash2 className="h-4 w-4 text-red-600 dark:text-red-300" />
            )}
          </button>
        </div>
      </TableCell>
    </TableRow>
  );
};

export default MenuSubcategoryTableRow;
