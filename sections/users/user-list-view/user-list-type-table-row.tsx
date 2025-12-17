'use client';

import { Avatar, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import CustomBadge from '@/components/ui/custom-badge';
import { TableCell, TableRow } from '@/components/ui/table';
import { RootState } from '@/store/store';
import { getStatusVariant } from '@/utils/short-utils';
import { Eye, Gift, Pencil } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { FC, useState } from 'react';
import { useSelector } from 'react-redux';
import GiftPointsModal from './gift-points-modal';
import { noImageUrl, noImageUrlDev, noImageUrlDevCap } from '@/constant/constant';

interface PageProps {
  item: any;
  userType?: string;
  memberPage?: boolean;
  handleDelete?: (id: string) => void;
  handleEdit?: (id: string) => void;
}

const UserListTypeTableRow: FC<PageProps> = ({ item, userType, memberPage, handleEdit }) => {
  const router = useRouter();
  const { user } = useSelector((state: RootState) => state.userSlice);

  const [giftModalOpen, setGiftModalOpen] = useState(false);

  // const handleNavigate = () => {
  //   if (memberPage) {
  //     router.push(`/${userType}/members/${item?.basicInfo?._id}`);
  //     return;
  //   }

  //   if (userType === 'super-admin') {
  //     router.push(
  //       `/super-admin/user/${item?.basicInfo?._id}?userType=${item?.accountState?.userType}`
  //     );
  //   } else if (userType === 'organizer') {
  //     router.push(
  //       `/organizer/user/${item?.basicInfo?._id}?userType=${item?.accountState?.userType}`
  //     );
  //   }
  // };

  const handleNavigate = () => {
    const userId = item?.basicInfo?._id;
    const accountUserType = item?.accountState?.userType;

    if (!userId || !userType) return;

    if (memberPage) {
      router.push(`/${userType}/members/${userId}`);
      return;
    }

    const routes: Record<'super-admin' | 'organizer', string> = {
      'super-admin': `/super-admin/user/${userId}?userType=${accountUserType}`,
      organizer: `/organizer/user/${userId}?userType=${accountUserType}`,
    };

    const route = routes[userType as 'super-admin' | 'organizer'];

    if (route) {
      router.push(route);
    }
  };

  const handleGiftConfirm = (points: string, note: string) => {
    console.log('Gift points sent:', points, 'Note:', note);
    setGiftModalOpen(false);
  };

  return (
    <>
      <TableRow onClick={handleNavigate} className="h-14 w-full cursor-pointer transition-colors hover:bg-[#f5f5f5] dark:hover:bg-[#272727]/50">
        <TableCell>
          <Avatar className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-xl bg-gray-100 shadow-sm dark:bg-gray-800">
            {item?.basicInfo?.profileIcon &&
            item?.basicInfo?.profileIcon !== noImageUrl &&
            item?.basicInfo?.profileIcon !== noImageUrlDev &&
            item?.basicInfo?.profileIcon !== noImageUrlDevCap ? (
              <AvatarImage src={item?.basicInfo?.profileIcon} alt="Store" className="h-full w-full cursor-pointer object-cover" />
            ) : (
              <span className="text-lg font-semibold text-gray-500 dark:text-gray-300">{item?.basicInfo?.firstName?.[0]?.toUpperCase() || ''}</span>
            )}
          </Avatar>
        </TableCell>

        {memberPage ? null : (
          <TableCell className="text-left font-medium capitalize">
            <div className="flex flex-col">
              <div>
                {item?.basicInfo?.firstName || '-'} {item?.basicInfo?.lastName || ''} {user?.basicInfo?._id === item?.basicInfo?._id ? '(You)' : ''}
              </div>
            </div>
          </TableCell>
        )}

        <TableCell className={`text-left text-sm`}>{!memberPage ? item?.basicInfo?.username || '-' : 'johndoe123'}</TableCell>

        {memberPage ? null : (
          <TableCell className="text-left text-sm capitalize">
            <Badge className="bg-secondary text-white dark:bg-white dark:text-black">{item?.accountState?.userType}</Badge>
          </TableCell>
        )}

        <TableCell className="text-left text-sm">-</TableCell>
        <TableCell className="text-left text-sm">-</TableCell>
        <TableCell className="text-left text-sm">-</TableCell>

        <TableCell className="text-muted-foreground text-left text-sm">
          <CustomBadge variant={getStatusVariant(item?.accountState?.status)}>{item?.accountState?.status}</CustomBadge>
        </TableCell>

        <TableCell className="text-left text-sm">{item?.metadata?.timezone || '-'}</TableCell>

        <TableCell className="text-end">
          <div className={`flex gap-2 ${memberPage ? 'justify-center' : ''}`}>
            {/* Gift button */}
            {memberPage && (
              <button
                type="button"
                title="Gift Points"
                onClick={(e) => {
                  e.stopPropagation();
                  setGiftModalOpen(true);
                }}
                className="cursor-pointer rounded-md bg-gray-100 p-1.5 transition hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700"
              >
                <Gift className="h-4 w-4 text-gray-700 dark:text-gray-200" />
              </button>
            )}

            <button
              type="button"
              title="View User"
              onClick={handleNavigate}
              className="cursor-pointer rounded-md bg-gray-100 p-1.5 transition hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700"
            >
              <Eye className="h-4 w-4 text-gray-700 dark:text-gray-200" />
            </button>

            {!memberPage && (
              <>
                <button
                  type="button"
                  title="Edit"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleEdit?.(item?.basicInfo?._id);
                  }}
                  className="cursor-pointer rounded-md bg-gray-100 p-1.5 transition hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700"
                >
                  <Pencil className="h-4 w-4 text-gray-700 dark:text-gray-200" />
                </button>
              </>
            )}
          </div>
        </TableCell>
      </TableRow>

      {/* Modals */}
      <GiftPointsModal open={giftModalOpen} onOpenChange={setGiftModalOpen} onConfirm={handleGiftConfirm} />
    </>
  );
};

export default UserListTypeTableRow;
