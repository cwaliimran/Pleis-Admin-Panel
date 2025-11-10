'use client';

import { PrimaryIcon } from '@/assets/svg/svg-icon';
import { Avatar, AvatarImage } from '@/components/ui/avatar';
import CustomBadge from '@/components/ui/custom-badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { TableCell, TableRow } from '@/components/ui/table';
import { noImageUrl, noImageUrlDev } from '@/constant/constant';
import { fDate, formatStr } from '@/utils/format-time';
import { Pencil, Trash2 } from 'lucide-react';
import Image from 'next/image';
import { FC } from 'react';
import placeHolderImg from '../../assets/profile/placeholder.png';

interface PageProps {
  item: any;
  handleDelete?: (id: string) => void;
  handlePinned?: (id: string) => void;
  handleEdit?: (id: string) => void;
}
const VenueTypeTableRow: FC<PageProps> = ({ item, handleDelete, handlePinned, handleEdit }) => {
  return (
    <TableRow className="h-14 w-full transition-colors hover:bg-[#f5f5f5] dark:hover:bg-[#272727]/50">
      <TableCell>
        <div className="flex items-center gap-3 capitalize">{item?.title || '-'}</div>
      </TableCell>

      <TableCell className="text-left">{fDate(item?.createdAt, formatStr.paramCase.date)}</TableCell>

      <TableCell className="flex items-center justify-start gap-x-2 pt-3 text-left">
        <Avatar className="">
          {item?.organization?.basicInfo?.media?.logo &&
          item?.organization?.basicInfo?.media?.logo !== noImageUrl &&
          item?.organization?.basicInfo?.media?.logo !== noImageUrlDev ? (
            <AvatarImage
              src={item?.organization?.basicInfo?.media?.logo}
              alt="organization logo"
              className="h-full w-full cursor-pointer object-cover"
            />
          ) : (
            <Image src={placeHolderImg} alt="placeholder img" className="h-full w-full cursor-pointer object-cover" height={10} width={10} />
          )}
        </Avatar>
        {item?.organization?.basicInfo?.name || 'Unknown'}
      </TableCell>

      <TableCell className="text-left">
        <Avatar className="flex size-9 items-center justify-center overflow-hidden rounded-full bg-gray-100 shadow-sm dark:bg-gray-800">
          {item?.floorPlan && item?.floorPlan !== noImageUrl && item?.floorPlan !== noImageUrlDev ? (
            <AvatarImage src={item?.floorPlan} alt="Store" className="h-full w-full cursor-pointer object-cover" />
          ) : (
            <Image src={placeHolderImg} alt="placeholder img" className="h-full w-full cursor-pointer object-cover" height={10} width={10} />
          )}
        </Avatar>
      </TableCell>

      <TableCell className="text-left">
        {item?.location?.fullAddress.length > 39 ? (
          <Dialog>
            <DialogTrigger asChild>
              <span className="cursor-pointer hover:text-blue-600" title="Click to view full description">
                {item?.location?.fullAddress?.slice(0, 30) + '...'}
              </span>
            </DialogTrigger>
            <DialogContent className="dark:bg-secondary max-w-md">
              <DialogHeader>
                <DialogTitle>Location</DialogTitle>
              </DialogHeader>
              <div className="py-4">
                <p className="text-sm leading-relaxed text-gray-700 dark:text-gray-300">{item?.location?.fullAddress}</p>
              </div>
            </DialogContent>
          </Dialog>
        ) : (
          item?.location?.fullAddress
        )}
      </TableCell>

      <TableCell className="text-muted-foreground text-left text-sm">
        <CustomBadge variant={item?.status === 'active' ? 'success' : item?.status === 'inactive' ? 'error' : 'default'}>{item?.status}</CustomBadge>
      </TableCell>

      <TableCell className="text-left">{fDate(item?.updatedAt, formatStr.paramCase.date)}</TableCell>

      <TableCell className="text-end">
        <div className="flex gap-2">
          <button
            type="button"
            title="Select Primary"
            onClick={(e) => {
              e.stopPropagation();
              handlePinned?.(item);
            }}
            className={`cursor-pointer rounded-md ${item?.isPrimary ? 'bg-green-600 text-white dark:bg-green-700' : 'bg-gray-100 dark:bg-gray-800'} p-1.5 transition`}
          >
            <PrimaryIcon />
          </button>

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
export default VenueTypeTableRow;
