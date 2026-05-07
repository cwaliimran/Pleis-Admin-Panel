'use client';

import { Avatar, AvatarImage } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import CustomBadge from '@/components/ui/custom-badge';
import { TableCell, TableRow } from '@/components/ui/table';
import { noImageUrl, noImageUrlDev } from '@/constant/constant';
import { fDate, formatStr } from '@/utils/format-time';
import { Eye, Pencil, Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { FC, useState } from 'react';

interface PageProps {
  item: any;
  handleDelete?: (id: string) => void;
  userType?: any;
}

interface TextOverflowModalState {
  isOpen: boolean;
  fullText: string;
}

const truncateText = (text: string, limit: number = 15): string => {
  if (!text) return text;
  if (text.length > limit) {
    return text.substring(0, limit).trim() + '...';
  }
  return text;
};

// const currencyFormatter = new Intl.NumberFormat('en-US', {
//   style: 'currency',
//   currency: 'EUR',
//   minimumFractionDigits: 2,
//   maximumFractionDigits: 2,
// });

const numberFormatter = new Intl.NumberFormat('en-US');

// const formatCurrency = (value?: number | null) => {
//   if (value === undefined || value === null || Number.isNaN(Number(value))) {
//     return '-';
//   }

//   return currencyFormatter.format(Number(value));
// };

const formatPercent = (value?: number | null) => {
  if (value === undefined || value === null || Number.isNaN(Number(value))) {
    return '-';
  }

  return `${Number(value)}%`;
};

const formatDateUS = (date?: string | null) => {
  if (!date) return '-';

  const parsed = new Date(date);
  if (Number.isNaN(parsed.getTime())) return '-';

  return parsed.toLocaleDateString('en-US');
};

const formatCount = (value?: number | null) => {
  if (value === undefined || value === null || Number.isNaN(Number(value))) {
    return '-';
  }

  return numberFormatter.format(Number(value));
};

const OrganizationTypeTableRow: FC<PageProps> = ({ item, handleDelete, userType }) => {
  const router = useRouter();
  const [isSubscriptionTypeModalOpen, setIsSubscriptionTypeModalOpen] = useState(false);
  const [isCommissionModalOpen, setIsCommissionModalOpen] = useState(false);
  const [textOverflowModal, setTextOverflowModal] = useState<TextOverflowModalState>({
    isOpen: false,
    fullText: '',
  });
  const inactiveSubscription = item?.user?.inActiveSubscription;

  const subscriptionTypeItems = Array.isArray(inactiveSubscription?.subscriptionTypes) ? inactiveSubscription.subscriptionTypes.filter(Boolean) : [];
  const primarySubscriptionType = subscriptionTypeItems[0] || '-';
  const remainingSubscriptionTypeCount = Math.max(subscriptionTypeItems.length - 1, 0);

  const subscriptionEndDate = inactiveSubscription?.endDate;

  const orderingCommission = inactiveSubscription?.orderingCommission;
  const ticketingCommission = inactiveSubscription?.ticketingCommission;
  const reservationCommission = inactiveSubscription?.reservationCommission;

  // const commissionItems = [
  //   { label: 'Ordering', value: orderingCommission },
  //   { label: 'Ticketing', value: ticketingCommission },
  //   { label: 'Reservation', value: reservationCommission },
  // ].filter((entry) => entry.value !== undefined && entry.value !== null && !Number.isNaN(Number(entry.value)));

  // const primaryCommission = commissionItems[0];
  // const remainingCommissionCount = Math.max(commissionItems.length - 1, 0);

  return (
    <>
      <TableRow
        className="h-14 w-full cursor-pointer transition-colors hover:bg-[#f5f5f5] dark:hover:bg-[#272727]/50"
        onClick={() =>
          userType === 'organizer' ? router.push(`/organizer/organization/${item?._id}`) : router.push(`/super-admin/organization/${item?._id}`)
        }
      >
        <TableCell>
          <Avatar className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-xl! bg-gray-100 shadow-sm dark:bg-gray-800">
            {item?.basicInfo?.media?.logo && item?.basicInfo?.media?.logo !== noImageUrl && item?.basicInfo?.media?.logo !== noImageUrlDev ? (
              <AvatarImage src={item?.basicInfo?.media?.logo} alt="Store" className="h-full w-full cursor-pointer object-cover" />
            ) : (
              <span className="text-lg font-semibold text-gray-500 dark:text-gray-300">{item?.basicInfo?.name?.[0]?.toUpperCase() || ''}</span>
            )}
          </Avatar>
        </TableCell>

        <TableCell className="text-left font-medium capitalize">
          <span
            className={item?.basicInfo?.name && item?.basicInfo?.name.length > 15 ? 'cursor-pointer transition-colors hover:text-blue-600' : ''}
            title={item?.basicInfo?.name && item?.basicInfo?.name.length > 15 ? item?.basicInfo?.name : ''}
            onClick={(e) => {
              if (item?.basicInfo?.name && item?.basicInfo?.name.length > 15) {
                e.stopPropagation();
                setTextOverflowModal({
                  isOpen: true,
                  fullText: item?.basicInfo?.name,
                });
              }
            }}
          >
            {truncateText(item?.basicInfo?.name || '-', 15)}
          </span>
        </TableCell>

        {userType !== 'organizer' && (
          <TableCell className="text-left text-sm">
            <span
              className={
                item?.creator &&
                (item?.creator?.firstName || item?.creator?.lastName) &&
                ((item?.creator?.firstName || '') + ' ' + (item?.creator?.lastName || '')).length > 15
                  ? 'cursor-pointer transition-colors hover:text-blue-600'
                  : ''
              }
              title={
                item?.creator &&
                (item?.creator?.firstName || item?.creator?.lastName) &&
                ((item?.creator?.firstName || '') + ' ' + (item?.creator?.lastName || '')).length > 15
                  ? (item?.creator?.firstName || '') + ' ' + (item?.creator?.lastName || '')
                  : ''
              }
              onClick={(e) => {
                const creatorName = (item?.creator?.firstName || '') + ' ' + (item?.creator?.lastName || '');
                if (creatorName.length > 15) {
                  e.stopPropagation();
                  setTextOverflowModal({
                    isOpen: true,
                    fullText: creatorName,
                  });
                }
              }}
            >
              {truncateText(((item?.creator?.firstName || '') + ' ' + (item?.creator?.lastName || '')).trim(), 15)}
            </span>
          </TableCell>
        )}

        <TableCell className="text-left text-sm">{fDate(item?.createdAt, formatStr.split.date)}</TableCell>

        <TableCell className="text-left text-sm">
          <div className="flex items-center gap-2">
            <span
              className={
                primarySubscriptionType !== '-' && primarySubscriptionType.length > 15 ? 'cursor-pointer transition-colors hover:text-blue-600' : ''
              }
              title={primarySubscriptionType !== '-' && primarySubscriptionType.length > 15 ? primarySubscriptionType : ''}
              onClick={(e) => {
                if (primarySubscriptionType !== '-' && primarySubscriptionType.length > 15) {
                  e.stopPropagation();
                  setTextOverflowModal({
                    isOpen: true,
                    fullText: primarySubscriptionType,
                  });
                }
              }}
            >
              {truncateText(primarySubscriptionType, 15)}
            </span>

            {remainingSubscriptionTypeCount > 0 && (
              <button
                type="button"
                className="cursor-pointer text-sm font-semibold text-blue-600 hover:underline"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsSubscriptionTypeModalOpen(true);
                }}
              >
                +{remainingSubscriptionTypeCount}
              </button>
            )}
          </div>
        </TableCell>

        <TableCell className="text-left text-sm">{formatDateUS(subscriptionEndDate)}</TableCell>

        {/* <TableCell className="text-left text-sm">
        <div className="flex items-center gap-2">
          <span>{primaryCommission ? `${primaryCommission.label}: ${formatPercent(primaryCommission.value)}` : '-'}</span>

          {remainingCommissionCount > 0 && (
            <button
              type="button"
              className="cursor-pointer text-sm font-semibold text-blue-600 hover:underline"
              onClick={(e) => {
                e.stopPropagation();
                setIsCommissionModalOpen(true);
              }}
            >
              +{remainingCommissionCount}
            </button>
          )}
        </div>
      </TableCell> */}

        <TableCell className="text-left text-sm">{formatCount(item?.viewCount)}</TableCell>

        {/* <TableCell className="text-left text-sm">{formatCurrency(item?.revenue)}</TableCell> */}

        <TableCell className="text-left text-sm">{item?.meta?.favoritesCount}</TableCell>

        <TableCell className="text-left text-sm">{item?.meta?.activeEventsCount}</TableCell>

        <TableCell className="text-muted-foreground text-left text-sm">
          <CustomBadge variant={item?.status === 'active' ? 'success' : item?.status === 'inactive' ? 'error' : 'default'}>
            {item?.status}
          </CustomBadge>
        </TableCell>

        <TableCell className="text-end">
          <div className="flex gap-2">
            <button
              title="View Org"
              type="button"
              className="cursor-pointer rounded-md bg-gray-100 p-1.5 transition hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700"
            >
              <Eye className="h-4 w-4 text-gray-700 dark:text-gray-200" />
            </button>

            <button
              title="Edit Org"
              type="button"
              className="cursor-pointer rounded-md bg-gray-100 p-1.5 transition hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700"
            >
              <Pencil className="h-4 w-4 text-gray-700 dark:text-gray-200" />
            </button>

            <button
              title="Delete Org"
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

      <Dialog open={isCommissionModalOpen} onOpenChange={setIsCommissionModalOpen}>
        <DialogContent
          aria-describedby={undefined}
          className="max-w-md"
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          <DialogHeader>
            <DialogTitle>Commission Details</DialogTitle>
          </DialogHeader>

          <div className="space-y-2 text-sm">
            <div className="flex items-center justify-between">
              <span>Ordering Commission</span>
              <span className="font-medium">{formatPercent(orderingCommission)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Ticketing Commission</span>
              <span className="font-medium">{formatPercent(ticketingCommission)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Reservation Commission</span>
              <span className="font-medium">{formatPercent(reservationCommission)}</span>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={isSubscriptionTypeModalOpen} onOpenChange={setIsSubscriptionTypeModalOpen}>
        <DialogContent
          aria-describedby={undefined}
          className="max-w-md"
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          <DialogHeader>
            <DialogTitle>Subscription Types</DialogTitle>
          </DialogHeader>

          <div className="space-y-2 text-sm">
            {subscriptionTypeItems.length > 0 ? (
              subscriptionTypeItems.map((type: string, index: number) => (
                <div key={`${type}-${index}`} className="capitalize">
                  {type}
                </div>
              ))
            ) : (
              <div>-</div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={textOverflowModal.isOpen} onOpenChange={(isOpen) => setTextOverflowModal({ ...textOverflowModal, isOpen })}>
        <DialogContent
          aria-describedby={undefined}
          className="max-w-md"
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          <DialogHeader>
            <DialogTitle>Full Value</DialogTitle>
          </DialogHeader>

          <div className="text-sm">
            <p className="text-base font-medium break-words">{textOverflowModal.fullText}</p>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
export default OrganizationTypeTableRow;
