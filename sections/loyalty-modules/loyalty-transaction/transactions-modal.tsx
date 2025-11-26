'use client';

import { Dialog, DialogContent, DialogHeader, DialogOverlay, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { fDate, formatStr } from '@/utils/format-time';

type ChallengeModalProps = {
  open: boolean;
  onClose: () => void;
  selectedData?: any;
};

const TransactionModal = ({ open, onClose, selectedData: item }: ChallengeModalProps) => {
  const getLabel = (type: string) => {
    switch (type) {
      case 'eventTicketPurchase':
        return 'Event Ticket Purchase';
      case 'reservations':
        return 'Reservations';
      default:
        return '-';
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogOverlay className="bg-opacity-30 fixed inset-0">
        <DialogContent
          aria-describedby={undefined}
          className="dark:bg-secondary mx-auto flex max-h-[90vh] min-h-[45vh] w-full flex-col overflow-y-auto rounded-2xl p-6 md:!max-w-[750px]"
        >
          <DialogHeader>
            <DialogTitle>Transaction Details</DialogTitle>
          </DialogHeader>

          <div className="mt-4 grid w-full grid-cols-1 gap-x-6 gap-y-5 md:grid-cols-2">
            <div>
              <h4 className="text-muted-foreground text-sm font-medium">Transaction ID</h4>
              <p className="text-base font-semibold">{item?.paymentDetails?.paymentId || 'N/A'}</p>
            </div>

            <div>
              <h4 className="text-muted-foreground text-sm font-medium">Timestamp</h4>
              <p className="text-base font-semibold">{fDate(item?.createdAt, formatStr.paramCase.dateTime)}</p>
            </div>

            <div>
              <h4 className="text-muted-foreground text-sm font-medium">Transaction Type</h4>
              <p className="text-base font-semibold">{getLabel(item?.purpose)}</p>
            </div>

            <div>
              <h4 className="text-muted-foreground text-sm font-medium">Points</h4>
              {item?.pointsRedeemed && item.pointsRedeemed !== 0 ? (
                <span className="text-red-600">-{item.pointsRedeemed}</span>
              ) : item?.pointsEarned && item.pointsEarned !== 0 ? (
                <span className="text-green-600">+{item.pointsEarned}</span>
              ) : (
                'N/A'
              )}
            </div>

            <div>
              <h4 className="text-muted-foreground text-sm font-medium">User</h4>
              <p className="text-base font-semibold">
                {item?.user?.firstName || ''} {item?.user?.lastName || ''}
              </p>
            </div>

            <div>
              <h4 className="text-muted-foreground text-sm font-medium">Organization</h4>
              <p className="text-base font-semibold">{item?.organization?.basicInfo?.name || '-'}</p>
            </div>

            <div>
              <h4 className="text-muted-foreground text-sm font-medium">Reference Details</h4>
              <p className="text-base font-semibold">
                {(() => {
                  const titles = item?.tickets?.map((t: any) => t?.ticket?.snapshot?.title)?.filter(Boolean) as string[] | undefined;

                  const titlesString = titles?.length ? titles.join(', ') : 'N/A';

                  const shouldTruncate = titlesString.length > 22;
                  const displayText = shouldTruncate ? titlesString.slice(0, 22) + '...' : titlesString;

                  return shouldTruncate ? (
                    <Dialog>
                      <DialogTrigger asChild>
                        <span className="cursor-pointer hover:text-blue-600" title="Click to view full titles">
                          {displayText}
                        </span>
                      </DialogTrigger>

                      <DialogContent className="dark:bg-secondary max-w-md">
                        <DialogHeader>
                          <DialogTitle>Reference</DialogTitle>
                        </DialogHeader>

                        <div className="py-4">
                          <p className="text-sm leading-relaxed text-gray-700 dark:text-gray-300">{titlesString}</p>
                        </div>
                      </DialogContent>
                    </Dialog>
                  ) : (
                    displayText
                  );
                })()}
              </p>
            </div>

            <div>
              <h4 className="text-muted-foreground text-sm font-medium">Challenge Details</h4>
              {/* <p className="text-base font-semibold">7-day streak challenge completion</p> */}
              <p className="text-base font-semibold">-</p>
            </div>

            <div>
              <h4 className="text-muted-foreground text-sm font-medium">Reward Details</h4>
              {/* <p className="text-base font-semibold">Free Large Pizza</p> */}
              <p className="text-base font-semibold">-</p>
            </div>

            <div>
              <h4 className="text-muted-foreground text-sm font-medium">Status</h4>
              <p className="inline-flex rounded-md bg-green-100 px-2 py-1 text-xs font-medium text-green-700 capitalize">
                {item?.status === 'confirmed'
                  ? 'gaining'
                  : item?.status === 'pending'
                    ? 'pending'
                    : item?.status === 'cancelled'
                      ? 'cancelled'
                      : 'spending'}
              </p>
            </div>
          </div>
        </DialogContent>
      </DialogOverlay>
    </Dialog>
  );
};

export default TransactionModal;
