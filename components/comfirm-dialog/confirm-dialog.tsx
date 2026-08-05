import { cn } from '@/lib/utils';
import React, { FC } from 'react';
import ButtonLoading from '../common/button-loading';
import { Button } from '../ui/button';
import { Dialog, DialogContent, DialogHeader, DialogOverlay, DialogTitle } from '../ui/dialog';

interface ConfirmDialogProps {
  open: boolean;
  isLoading?: boolean;
  title?: string;
  content?: string;
  onClose?: () => void;
  onConfirm?: () => void;
  action?: React.ReactNode;
  buttonClass?: any;
}
const ConfirmDialog: FC<ConfirmDialogProps> = ({ open, title, content, onClose, onConfirm, isLoading, buttonClass }) => {
  return (
    <div>
      <Dialog open={open} onOpenChange={onClose}>
        <DialogOverlay className="fixed inset-0 flex items-center justify-center">
          <DialogContent aria-describedby={undefined} className="dark:bg-secondary w-full max-w-md rounded-lg p-6 shadow-lg">
            <DialogHeader>
              <DialogTitle className="text-lg font-semibold">{title || 'Confirm Action'}</DialogTitle>
            </DialogHeader>
            <p className="mb-4 text-sm text-gray-600 dark:text-white">{content || 'Are you sure you want to proceed?'}</p>
            <div className="flex justify-end space-x-2">
              <Button variant={'outline'} className="cursor-pointer" onClick={onClose}>
                Cancel
              </Button>

              {isLoading ? (
                // Same `buttonClass` as the idle state, so a dialog with a custom
                // colour does not flip to the destructive red while submitting.
                <Button type="button" disabled className={cn('cursor-not-allowed bg-[#E7000B] hover:bg-[#E7000B]/80', buttonClass)}>
                  <ButtonLoading />
                </Button>
              ) : (
                <Button className={cn('cursor-pointer bg-[#E7000B] hover:bg-[#E7000B]/80', buttonClass)} onClick={onConfirm}>
                  Confirm
                </Button>
              )}
            </div>
          </DialogContent>
        </DialogOverlay>
      </Dialog>
    </div>
  );
};

export default ConfirmDialog;
