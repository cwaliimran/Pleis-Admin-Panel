'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import CustomBadge from '@/components/ui/custom-badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { TableCell, TableRow } from '@/components/ui/table';
import { noImageUrl, noImageUrlDev } from '@/constant/constant';
import { fDate, formatStr } from '@/utils/format-time';
import { Pencil, Trash2 } from 'lucide-react';
import { FC, useState } from 'react';

interface PageProps {
  item: any;
  handleDelete?: (id: string) => void;
  handleEdit?: (id: string) => void;
  categoryTitleMap?: Record<string, string>;
}

const getCategoryLabel = (category: any, categoryTitleMap: Record<string, string> = {}) => {
  if (!category) return '';
  if (typeof category === 'string') return categoryTitleMap[category] || category;
  return category?.title || category?.name || category?.label || '';
};

const getCategoriesText = (item: any, categoryTitleMap: Record<string, string> = {}) => {
  const source = item?.categories ?? item?.category;
  if (!source) return '-';

  if (Array.isArray(source)) {
    const labels = source.map((category) => getCategoryLabel(category, categoryTitleMap)).filter(Boolean);
    return labels.length ? labels.join(', ') : '-';
  }

  const singleLabel = getCategoryLabel(source, categoryTitleMap);
  return singleLabel || '-';
};

const truncateText = (value: string, maxLength: number) => {
  if (!value || value.length <= maxLength) return value;
  return `${value.substring(0, maxLength).trim()}...`;
};

const VenueTypeTableRow: FC<PageProps> = ({ item, handleDelete, handleEdit, categoryTitleMap }) => {
  const [isCategoriesModalOpen, setIsCategoriesModalOpen] = useState(false);
  const categoriesText = getCategoriesText(item, categoryTitleMap);
  const isCategoriesTruncated = categoriesText.length > 20;
  const categoriesDisplayText = truncateText(categoriesText, 20);

  return (
    <>
      <TableRow className="h-14 w-full transition-colors hover:bg-[#f5f5f5] dark:hover:bg-[#272727]/50">
        <TableCell>
          <Avatar className="flex h-12 w-12 items-center justify-center overflow-hidden !rounded-xl bg-gray-100 shadow-sm dark:bg-gray-800">
            {(() => {
              const imageUrl = item?.image && item.image !== noImageUrl && item.image !== noImageUrlDev
                ? item.image
                : item?.imageInfo?.url && item.imageInfo.name !== 'noimage.png'
                  ? item.imageInfo.url
                  : null;
              return imageUrl ? (
                <AvatarImage src={imageUrl} alt="Store" className="h-full w-full cursor-pointer object-cover" />
              ) : null;
            })()}
            <AvatarFallback className="bg-gray-100 text-lg font-semibold text-gray-500 dark:bg-gray-800 dark:text-gray-300">
              {item?.title?.[0]?.toUpperCase() || ''}
            </AvatarFallback>
          </Avatar>
        </TableCell>

        <TableCell className="text-left font-medium capitalize">{item?.title}</TableCell>
        <TableCell className="text-left text-sm">
          <span
            className={isCategoriesTruncated ? 'text-foreground cursor-pointer transition-colors hover:text-blue-600 hover:underline' : ''}
            onClick={(e) => {
              if (!isCategoriesTruncated) return;
              e.stopPropagation();
              setIsCategoriesModalOpen(true);
            }}
          >
            {categoriesDisplayText}
          </span>
        </TableCell>
        <TableCell className="text-left text-sm">{fDate(item?.createdAt, formatStr.split.date)}</TableCell>
        <TableCell className="text-muted-foreground text-left text-sm">
          <CustomBadge variant={item?.status === 'active' ? 'success' : item?.status === 'inactive' ? 'error' : 'default'}>{item?.status}</CustomBadge>
        </TableCell>

        <TableCell className="text-end">
          <div className="flex gap-2">
            <button
              type="button"
              title="Edit"
              onClick={(e) => {
                e.stopPropagation();
                handleEdit?.(item._id);
              }}
              className="cursor-pointer rounded-md bg-gray-100 p-1.5 transition hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700"
            >
              <Pencil className="h-4 w-4 text-gray-700 dark:text-gray-200" />
            </button>

            <button
              type="button"
              title="Delete"
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

      <Dialog open={isCategoriesModalOpen} onOpenChange={setIsCategoriesModalOpen}>
        <DialogContent aria-describedby={undefined} className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Categories</DialogTitle>
          </DialogHeader>
          <p className="text-sm leading-6 break-words">{categoriesText}</p>
        </DialogContent>
      </Dialog>
    </>
  );
};
export default VenueTypeTableRow;
