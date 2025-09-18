'use client';

import { Avatar, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import CustomBadge from '@/components/ui/custom-badge';
import { TableCell, TableRow } from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogTitle,
  DialogPortal,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { RootState } from '@/store/store';
import { getStatusVariant } from '@/utils/short-utils';
import { Eye, Gift, Pencil } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { FC, useState } from 'react';
import { useSelector } from 'react-redux';

interface PageProps {
  item: any;
  userType?: string;
  memberPage?: boolean;
  handleDelete?: (id: string) => void;
  handleEdit?: (id: string) => void;
}

const UserListTypeTableRow: FC<PageProps> = ({
  item,
  userType,
  memberPage,
  handleEdit,
}) => {
  const router = useRouter();
  const { user } = useSelector((state: RootState) => state.userSlice);

  // --- State for modals ---
  const [giftModalOpen, setGiftModalOpen] = useState(false);
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [points, setPoints] = useState('');

  const handleNavigate = () => {
    if (userType === 'super-admin') {
      router.push(
        `/super-admin/user/${item?.basicInfo?._id}?userType=${item?.accountState?.userType}`
      );
    } else if (userType === 'organizer') {
      router.push(
        `/organizer/user/${item?.basicInfo?._id}?userType=${item?.accountState?.userType}`
      );
    }
  };

  const handleSendGift = () => {
    console.log('Gift points sent:', points);
    setConfirmModalOpen(false);
    setGiftModalOpen(false);
    setPoints('');
  };

  return (
    <>
      <TableRow
        onClick={handleNavigate}
        className="h-14 w-full cursor-pointer transition-colors hover:bg-[#f5f5f5] dark:hover:bg-[#272727]/50"
      >
        <TableCell>
          <Avatar className="flex h-12 w-12 items-center justify-center overflow-hidden !rounded-xl bg-gray-100 shadow-sm dark:bg-gray-800">
            {item?.basicInfo?.profileIcon &&
            ![
              'https://pleisstorage.blob.core.windows.net/pleisappcontainer/noimage.png',
              'https://pleisstorage.blob.core.windows.net/pleisappcontainerdev/noImage.png',
            ].includes(item?.basicInfo?.profileIcon) ? (
              <AvatarImage
                src={item?.basicInfo?.profileIcon}
                alt="Store"
                className="h-full w-full cursor-pointer object-cover"
              />
            ) : (
              <span className="text-lg font-semibold text-gray-500 dark:text-gray-300">
                {item?.basicInfo?.firstName?.[0]?.toUpperCase() || ''}
              </span>
            )}
          </Avatar>
        </TableCell>

        <TableCell className="text-left font-medium capitalize">
          <div className="flex flex-col">
            <div>
              {item?.basicInfo?.firstName || '-'}{' '}
              {item?.basicInfo?.lastName || ''}{' '}
              {user?.basicInfo?._id === item?.basicInfo?._id ? '(You)' : ''}
            </div>
          </div>
        </TableCell>

        <TableCell className={`text-left text-sm`}>
          {item?.basicInfo?.username || '-'}
        </TableCell>

        {memberPage ? null : (
          <TableCell className="text-left text-sm capitalize">
            <Badge className="bg-secondary text-white dark:bg-white dark:text-black">
              {item?.accountState?.userType}
            </Badge>
          </TableCell>
        )}

        <TableCell className="text-left text-sm">-</TableCell>
        <TableCell className="text-left text-sm">-</TableCell>
        <TableCell className="text-left text-sm">-</TableCell>

        <TableCell className="text-muted-foreground text-left text-sm">
          <CustomBadge variant={getStatusVariant(item?.accountState?.status)}>
            {item?.accountState?.status}
          </CustomBadge>
        </TableCell>

        <TableCell className="text-center text-sm">
          {item?.metadata?.timezone || '-'}
        </TableCell>

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

            {!memberPage && (
              <>
                <button
                  type="button"
                  title="View User"
                  onClick={handleNavigate}
                  className="cursor-pointer rounded-md bg-gray-100 p-1.5 transition hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700"
                >
                  <Eye className="h-4 w-4 text-gray-700 dark:text-gray-200" />
                </button>

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

      {/* Gift Modal */}
      <Dialog open={giftModalOpen} onOpenChange={setGiftModalOpen}>
        <DialogPortal>
          <DialogOverlay className="fixed inset-0 bg-black/30" />
          <DialogContent className="dark:bg-secondary mx-auto rounded-2xl p-6 md:!max-w-md">
            <DialogHeader>
              <DialogTitle>Gift Points</DialogTitle>
            </DialogHeader>
            <div className="mt-4">
              <Input
                type="number"
                placeholder="Enter points"
                value={points}
                onChange={(e) => setPoints(e.target.value)}
              />
            </div>
            <DialogFooter className="mt-6 flex justify-end gap-2">
              <Button variant="outline" onClick={() => setGiftModalOpen(false)}>
                Cancel
              </Button>
              <Button
                onClick={() => setConfirmModalOpen(true)}
                disabled={!points}
              >
                Send
              </Button>
            </DialogFooter>
          </DialogContent>
        </DialogPortal>
      </Dialog>

      {/* Confirmation Modal */}
      <Dialog open={confirmModalOpen} onOpenChange={setConfirmModalOpen}>
        <DialogPortal>
          <DialogOverlay className="fixed inset-0 bg-black/30" />
          <DialogContent className="dark:bg-secondary mx-auto rounded-2xl p-6 md:!max-w-sm">
            <DialogHeader>
              <DialogTitle>Confirm Gift</DialogTitle>
            </DialogHeader>
            <p className="text-muted-foreground mt-3 text-sm">
              Are you sure you want to send{' '}
              <span className="font-semibold">{points}</span> points?
            </p>
            <DialogFooter className="mt-6 flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => setConfirmModalOpen(false)}
              >
                Cancel
              </Button>
              <Button onClick={handleSendGift}>Confirm</Button>
            </DialogFooter>
          </DialogContent>
        </DialogPortal>
      </Dialog>
    </>
  );
};

export default UserListTypeTableRow;

// 'use client';

// import { Avatar, AvatarImage } from '@/components/ui/avatar';
// import { Badge } from '@/components/ui/badge';
// import CustomBadge from '@/components/ui/custom-badge';
// import { TableCell, TableRow } from '@/components/ui/table';
// import { RootState } from '@/store/store';
// import { getStatusVariant } from '@/utils/short-utils';
// import { Eye, Gift, Pencil } from 'lucide-react';
// import { useRouter } from 'next/navigation';
// import { FC } from 'react';
// import { useSelector } from 'react-redux';

// interface PageProps {
//   item: any;
//   userType?: string;
//   memberPage?: boolean;
//   handleDelete?: (id: string) => void;
//   handleEdit?: (id: string) => void;
// }
// const UserListTypeTableRow: FC<PageProps> = ({
//   item,
//   userType,
//   memberPage,
//   handleEdit,
// }) => {
//   const router = useRouter();
//   const { user } = useSelector((state: RootState) => state.userSlice);

//   const handleNavigate = () => {
//     if (userType === 'super-admin') {
//       router.push(
//         `/super-admin/user/${item?.basicInfo?._id}?userType=${item?.accountState?.userType}`
//       );
//     } else if (userType === 'organizer') {
//       router.push(
//         `/organizer/user/${item?.basicInfo?._id}?userType=${item?.accountState?.userType}`
//       );
//     }
//   };

//   return (
//     <TableRow
//       onClick={handleNavigate}
//       className="h-14 w-full cursor-pointer transition-colors hover:bg-[#f5f5f5] dark:hover:bg-[#272727]/50"
//     >
//       <TableCell>
//         <Avatar className="flex h-12 w-12 items-center justify-center overflow-hidden !rounded-xl bg-gray-100 shadow-sm dark:bg-gray-800">
//           {item?.basicInfo?.profileIcon &&
//           item?.basicInfo?.profileIcon !==
//             'https://pleisstorage.blob.core.windows.net/pleisappcontainer/noimage.png' &&
//           item?.basicInfo?.profileIcon !==
//             'https://pleisstorage.blob.core.windows.net/pleisappcontainerdev/noImage.png' ? (
//             <AvatarImage
//               src={item?.basicInfo?.profileIcon}
//               alt="Store"
//               className="h-full w-full cursor-pointer object-cover"
//             />
//           ) : (
//             <span className="text-lg font-semibold text-gray-500 dark:text-gray-300">
//               {item?.basicInfo?.firstName?.[0]?.toUpperCase() || ''}
//             </span>
//           )}
//         </Avatar>
//       </TableCell>

//       <TableCell className="text-left font-medium capitalize">
//         <div className="flex flex-col">
//           <div>
//             {item?.basicInfo?.firstName || '-'}{' '}
//             {item?.basicInfo?.lastName || ''}{' '}
//             {user?.basicInfo?._id === item?.basicInfo?._id ? '(You)' : ''}
//           </div>
//           {/* <div>{item?.basicInfo?.email || '-'}</div> */}
//         </div>
//       </TableCell>

//       <TableCell className={`text-left text-sm`}>
//         {item?.basicInfo?.username || '-'}
//       </TableCell>

//       {memberPage ? null : (
//         <TableCell className="text-left text-sm capitalize">
//           <Badge className="bg-secondary text-white dark:bg-white dark:text-black">
//             {item?.accountState?.userType}
//           </Badge>
//         </TableCell>
//       )}

//       <TableCell className="text-left text-sm">-</TableCell>

//       <TableCell className="text-left text-sm">-</TableCell>

//       <TableCell className="text-left text-sm">-</TableCell>

//       <TableCell className="text-muted-foreground text-left text-sm">
//         <CustomBadge variant={getStatusVariant(item?.accountState?.status)}>
//           {item?.accountState?.status}
//         </CustomBadge>
//       </TableCell>

//       <TableCell className="text-center text-sm">
//         {item?.metadata?.timezone || '-'}
//       </TableCell>

//       <TableCell className="text-end">
//         <div className="flex gap-2">
//           <button
//             type="button"
//             title="View User"
//             onClick={handleNavigate}
//             className="cursor-pointer rounded-md bg-gray-100 p-1.5 transition hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700"
//           >
//             <Gift className="h-4 w-4 text-gray-700 dark:text-gray-200" />
//           </button>

//           <button
//             type="button"
//             title="View User"
//             onClick={handleNavigate}
//             className="cursor-pointer rounded-md bg-gray-100 p-1.5 transition hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700"
//           >
//             <Eye className="h-4 w-4 text-gray-700 dark:text-gray-200" />
//           </button>

//           <button
//             type="button"
//             title="Edit"
//             onClick={(e) => {
//               e.stopPropagation();
//               handleEdit?.(item?.basicInfo?._id);
//             }}
//             className="cursor-pointer rounded-md bg-gray-100 p-1.5 transition hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700"
//           >
//             <Pencil className="h-4 w-4 text-gray-700 dark:text-gray-200" />
//           </button>
//         </div>
//       </TableCell>
//     </TableRow>
//   );
// };
// export default UserListTypeTableRow;
