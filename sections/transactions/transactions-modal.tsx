'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogOverlay,
  DialogTitle,
} from '@/components/ui/dialog';

type ChallengeModalProps = {
  open: boolean;
  onClose: () => void;
  selectedData?: any;
};

const TransactionModal = ({
  open,
  onClose,
  selectedData,
}: ChallengeModalProps) => {
  console.log('selectedData', selectedData);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogOverlay className="bg-opacity-30 fixed inset-0">
        <DialogContent className="dark:bg-secondary mx-auto flex max-h-[90vh] min-h-[45vh] w-full flex-col overflow-y-auto rounded-2xl p-6 md:!max-w-[750px]">
          <DialogHeader>
            <DialogTitle>Transaction Details</DialogTitle>
          </DialogHeader>

          <div className="mt-4 grid w-full grid-cols-1 gap-x-6 gap-y-5 md:grid-cols-2">
            <div>
              <h4 className="text-muted-foreground text-sm font-medium">
                Transaction ID
              </h4>
              <p className="text-base font-semibold">TXN-123456</p>
            </div>

            <div>
              <h4 className="text-muted-foreground text-sm font-medium">
                Timestamp
              </h4>
              <p className="text-base font-semibold">17-09-2025 14:22</p>
            </div>

            <div>
              <h4 className="text-muted-foreground text-sm font-medium">
                Transaction Type
              </h4>
              <p className="text-base font-semibold">Purchase - In App Order</p>
            </div>

            <div>
              <h4 className="text-muted-foreground text-sm font-medium">
                Points
              </h4>
              <p className="text-base font-semibold text-green-600">+150</p>
            </div>

            <div>
              <h4 className="text-muted-foreground text-sm font-medium">
                User
              </h4>
              <p className="text-base font-semibold">John Doe</p>
            </div>

            <div>
              <h4 className="text-muted-foreground text-sm font-medium">
                Organizer / Venue
              </h4>
              <p className="text-base font-semibold">
                Emily Carter — FoodFest 2025
              </p>
            </div>

            <div>
              <h4 className="text-muted-foreground text-sm font-medium">
                Reference Details
              </h4>
              <p className="text-base font-semibold">
                2x Burger Combo, 1x Fries
              </p>
            </div>

            <div>
              <h4 className="text-muted-foreground text-sm font-medium">
                Challenge Details
              </h4>
              <p className="text-base font-semibold">
                7-day streak challenge completion
              </p>
            </div>

            <div>
              <h4 className="text-muted-foreground text-sm font-medium">
                Reward Details
              </h4>
              <p className="text-base font-semibold">Free Large Pizza</p>
            </div>

            <div>
              <h4 className="text-muted-foreground text-sm font-medium">
                Status
              </h4>
              <p className="inline-flex rounded-md bg-green-100 px-2 py-1 text-xs font-medium text-green-700">
                Success
              </p>
            </div>
          </div>
        </DialogContent>
      </DialogOverlay>
    </Dialog>
  );
};

export default TransactionModal;
