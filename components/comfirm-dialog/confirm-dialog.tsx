import React, { FC } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogOverlay, DialogTitle } from '../ui/dialog';
import { Button } from '../ui/button';
import ButtonLoading from '../common/button-loading';

interface ConfirmDialogProps {
  open: boolean;
  isLoading?: boolean;
  title?: string;
  content?: string;
  onClose?: () => void;
  onConfirm?: () => void;
  action?: React.ReactNode;
}
const ConfirmDialog: FC<ConfirmDialogProps> = ({ open, title, content, onClose, onConfirm ,isLoading}) => {
  return (
    <div>
      <Dialog open={open} onOpenChange={onClose}>
        <DialogOverlay className="fixed inset-0 flex items-center justify-center">
          <DialogContent aria-describedby={undefined} className=" p-6 rounded-lg shadow-lg max-w-md w-full dark:bg-secondary">
            <DialogHeader>
              <DialogTitle className="text-lg font-semibold">{title || "Confirm Action"}</DialogTitle>
            </DialogHeader>
            <p className="text-sm text-gray-600 dark:text-white mb-4">{content || "Are you sure you want to proceed?"}</p>
            <div className="flex justify-end space-x-2">
              <Button variant={"outline"} className='cursor-pointer' onClick={onClose} >Cancel</Button>

              {isLoading ? (
                <Button type='button' className='cursor-not-allowed bg-[#E7000B] hover:bg-[#E7000B]/80' onClick={onConfirm}><ButtonLoading /></Button>
              ):(
                <Button className='cursor-pointer bg-[#E7000B] hover:bg-[#E7000B]/80' onClick={onConfirm}>Confirm</Button>
              )}
            </div>
          </DialogContent>
        </DialogOverlay>
      </Dialog>
    </div>
  )
}

export default ConfirmDialog
