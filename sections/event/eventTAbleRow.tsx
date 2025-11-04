'use client';

import ImageWithFallback from '@/components/common/img-with-fallback';
import { Avatar, AvatarImage } from '@/components/ui/avatar';
import CustomBadge from '@/components/ui/custom-badge';
import { TableCell, TableRow } from '@/components/ui/table';
import { noImageUrl, noImageUrlDev } from '@/constant/constant';
import { formatDateTime, getStatusVariant } from '@/utils/short-utils';
import { Eye, Pencil, Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { FC } from 'react';

interface PageProps {
  item: any;
  handleDelete?: (id: string) => void;
  userType?: string;
}

const EventTableRow: FC<PageProps> = ({ item, handleDelete, userType }) => {
  const router = useRouter();

  const handleNavigateToDetails = () => {
    router.push(`/${userType}/events/${item._id}`);
  };

  const handleEdit = (id: any) => {
    router.push(`/${userType}/events/edit-event/${id}`);
  };

  const media = item?.basicInfo?.media;
  const mediaUrl = typeof media === 'string' ? media.toLowerCase() : '';
  const isVideo = mediaUrl.endsWith('.mp4');

  return (
    <TableRow className="h-14 w-full cursor-pointer transition-colors" onClick={handleNavigateToDetails}>
      <TableCell>
        {/* <Avatar className="h-12 w-12 overflow-hidden !rounded-xl shadow-sm"> */}
        {/* {item?.basicInfo?.media && item.basicInfo.media !== 'noimage.png' ? (
            <ImageWithFallback
            url={item?.basicInfo?.mediaInfo?.url}
            alt={item?.basicInfo?.title}
            className="h-full w-full cursor-pointer object-cover"
            />
            ) : (
              <span className="text-lg font-semibold text-gray-500 dark:text-gray-300">{item?.basicInfo?.title?.[0]?.toUpperCase() || ''}</span>
              )} */}

        <Avatar className="flex h-12 w-12 items-center justify-center overflow-hidden !rounded-xl bg-gray-100 shadow-sm dark:bg-gray-800">
          {item?.basicInfo?.media && item?.basicInfo?.media !== noImageUrl && item?.basicInfo?.media !== noImageUrlDev && isVideo ? (
            <AvatarImage src={item?.basicInfo?.media} alt="Store" className="h-full w-full cursor-pointer object-cover" />
          ) : (
            <span className="text-lg font-semibold text-gray-500 dark:text-gray-300">{item?.basicInfo?.title?.[0]?.toUpperCase() || ''}</span>
          )}
        </Avatar>
      </TableCell>

      <TableCell className="text-left capitalize">
        {item?.basicInfo?.title?.length > 20 ? item.basicInfo.title.slice(0, 20) + '...' : item.basicInfo.title}
      </TableCell>

      <TableCell className="text-left">
        <div className="flex items-center justify-start gap-2">
          {item?.basicInfo?.organization?.basicInfo?.mediaInfo?.logo?.url && (
            <Avatar className="h-6 w-6 !rounded">
              <ImageWithFallback
                url={item?.basicInfo?.organization?.basicInfo?.mediaInfo?.logo?.url}
                alt={item?.basicInfo?.organization?.basicInfo?.name}
                className="h-full w-full object-cover"
              />
              {/* <AvatarImage
                src={item?.basicInfo?.organization?.basicInfo?.mediaInfo?.logo?.url}
                alt={item?.basicInfo?.organization?.basicInfo?.mediaInfo?.logo?.name}
                className="object-cover w-full h-full"
              /> */}
            </Avatar>
          )}
          <span>{item?.basicInfo?.organization?.basicInfo?.name || '-'}</span>
        </div>
      </TableCell>

      <TableCell className="text-left capitalize">{item?.basicInfo?.venue?.title || '-'}</TableCell>

      <TableCell>{item?.schedule?.startDateTime ? formatDateTime(item.schedule.startDateTime) : '-'}</TableCell>

      <TableCell className="text-left">{item?.schedule?.endDateTime ? formatDateTime(item.schedule.endDateTime) : '-'}</TableCell>

      <TableCell>{item?.meta?.revenue ? item.meta.revenue : '-'}</TableCell>

      <TableCell className="text-left">{item?.meta?.views ? item.meta.views : '-'}</TableCell>

      <TableCell className="text-left">{item?.meta?.region || '-'}</TableCell>

      <TableCell className="text-muted-foreground text-left text-sm">
        <CustomBadge variant={getStatusVariant(item?.status)}>{item?.status}</CustomBadge>
      </TableCell>

      {/* Category */}
      {/* <TableCell className="text-left flex items-center gap-2">
      {item?.basicInfo?.category?.imageInfo?.url &&
      item?.basicInfo?.category?.imageInfo?.name !== "noimage.png" ? (
        <Avatar className="w-6 h-6 !rounded">
        <AvatarImage
          src={item?.basicInfo?.category?.imageInfo?.url}
          alt={item?.basicInfo?.category?.imageInfo?.name}
          className="object-cover w-full h-full"
        />
        </Avatar>
      ) : null}
      <span>{item?.basicInfo?.category?.title || "-"}</span>
      </TableCell> */}

      {/* Actions */}
      <TableCell className="text-end">
        <div className="flex gap-2">
          <button
            title="View Details"
            type="button"
            className="cursor-pointer rounded-md bg-gray-100 p-1.5 transition hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700"
          >
            <Eye className="h-4 w-4 text-gray-700 dark:text-gray-200" />
          </button>

          <button
            title="Edit Event"
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
            title="Delete Event"
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

export default EventTableRow;
