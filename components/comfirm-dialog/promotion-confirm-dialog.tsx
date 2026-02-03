import React, { FC } from 'react';
import ButtonLoading from '../common/button-loading';
import { Button } from '../ui/button';
import { Dialog, DialogContent, DialogHeader, DialogOverlay, DialogTitle } from '../ui/dialog';

interface ConfirmDialogProps {
  open: boolean;
  isLoading?: boolean;
  isLoadingForAllEventsDelete?: boolean;
  title?: string;
  content?: string;
  onClose?: () => void;
  // onConfirm?: () => void;
  onConfirm: (scope: string) => void;
  action?: React.ReactNode;
  buttonClass?: any;
}
const PromotionConfirmDialog: FC<ConfirmDialogProps> = ({
  open,
  title,
  content,
  onClose,
  onConfirm,
  isLoading,
  buttonClass,
  isLoadingForAllEventsDelete,
}) => {
  return (
    <div>
      <Dialog open={open} onOpenChange={onClose}>
        <DialogOverlay className="fixed inset-0 flex items-center justify-center">
          <DialogContent aria-describedby={undefined} className="dark:bg-secondary w-full max-w-md rounded-lg p-6 shadow-lg">
            <DialogHeader>
              <DialogTitle className="text-lg font-semibold">{title || 'Confirm Action'}</DialogTitle>
            </DialogHeader>
            <p className="mb-4 text-sm text-gray-600 dark:text-white">{content || 'Are you sure you want to proceed?'}</p>
            <div className="flex flex-col gap-y-2">
              {/* <Button variant={'outline'} className="cursor-pointer" onClick={onClose}>
                Cancel
              </Button> */}

              {isLoading ? (
                <Button type="button" disabled className="w-full cursor-not-allowed bg-[#E7000B] hover:bg-[#E7000B]/80">
                  <ButtonLoading />
                </Button>
              ) : (
                <Button
                  className={`w-full cursor-pointer bg-[#E7000B] font-medium text-white shadow-sm transition-all hover:bg-[#E7000B]/90 ${buttonClass}`}
                  onClick={() => onConfirm('single')}
                >
                  Delete This Promotion Only
                </Button>
              )}

              {isLoadingForAllEventsDelete ? (
                <Button type="button" disabled variant="outline" className="w-full cursor-not-allowed border-[#E7000B] text-[#E7000B]">
                  <ButtonLoading />
                </Button>
              ) : (
                <Button
                  variant="outline"
                  className={`w-full cursor-pointer border-2 border-[#E7000B] font-medium text-[#E7000B] transition-all hover:bg-[#E7000B] hover:text-white dark:text-white ${buttonClass}`}
                  // onClick={onConfirm}
                  onClick={() => onConfirm('future')}
                >
                  Delete This & All After
                </Button>
              )}
            </div>
          </DialogContent>
        </DialogOverlay>
      </Dialog>
    </div>
  );
};

export default PromotionConfirmDialog;
