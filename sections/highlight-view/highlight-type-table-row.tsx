'use client';

import { Avatar, AvatarImage } from '@/components/ui/avatar';
import CustomBadge from '@/components/ui/custom-badge';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { TableCell, TableRow } from '@/components/ui/table';
import { fDate, formatStr } from '@/utils/format-time';
import { getStatusVariant } from '@/utils/short-utils';
import { Pencil, Play, Trash2 } from 'lucide-react';
import { FC } from 'react';

interface PageProps {
  item: any;
  handleDelete?: (id: string) => void;
  handleEdit?: (id: string) => void;
}
const HighlightTypeTableRow: FC<PageProps> = ({
  item,
  handleDelete,
  handleEdit,
}) => {
  return (
    <TableRow className="h-14 w-full transition-colors hover:bg-[#f5f5f5] dark:hover:bg-[#272727]/50">
      <TableCell className="text-left font-medium capitalize">
        {item?.title || '-'}
      </TableCell>

      <TableCell className="text-left">
        <div className="flex items-center gap-2">
          <Avatar className="h-8 w-8">
            <AvatarImage
              src={item?.object?.basicInfo?.mediaInfo?.logo?.url || ''}
              alt={item?.object?.basicInfo?.mediaInfo?.logo?.name || 'unknown'}
              className="object-cover"
            />

            {item?.object?.basicInfo?.mediaInfo?.logo?.url &&
            item?.object?.basicInfo?.mediaInfo?.logo?.name !== 'noimage.png' ? (
              <AvatarImage
                src={item?.object?.basicInfo?.mediaInfo?.logo?.url}
                alt={
                  item?.object?.basicInfo?.mediaInfo?.logo?.name || 'unknown'
                }
                className="h-full w-full cursor-pointer object-cover"
              />
            ) : (
              <span className="text-lg font-semibold text-gray-500 dark:text-gray-300">
                {item?.object?.basicInfo?.name?.[0]?.toUpperCase() || ''}
              </span>
            )}
          </Avatar>
          {item?.object?.basicInfo?.name || '-'}
        </div>
      </TableCell>

      <TableCell>{item?.event || '-'}</TableCell>

      <TableCell>
        <Dialog>
          <DialogTrigger asChild>
            <Play className="text-primary h-4 w-4 cursor-pointer" />
          </DialogTrigger>
          <DialogContent
            aria-description={undefined}
            className="max-w-2xl overflow-hidden p-2"
          >
            <video
              controls
              autoPlay
              className="h-full w-full"
              // src={item.video}
              src={
                'https://test-videos.co.uk/vids/bigbuckbunny/mp4/h264/720/Big_Buck_Bunny_720_10s_1MB.mp4'
              }
            />
          </DialogContent>
        </Dialog>
      </TableCell>

      <TableCell className="text-left text-sm">
        {fDate(item?.createdAt, formatStr.paramCase.date)}
      </TableCell>

      <TableCell className="text-muted-foreground text-left text-sm">
        <CustomBadge variant={getStatusVariant(item?.status)}>
          {item?.status}
        </CustomBadge>
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
  );
};
export default HighlightTypeTableRow;
