'use client';

import { useState } from 'react';
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
import { Textarea } from '@/components/ui/textarea';

interface GiftPointsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (points: string, note: string) => void;
}

const GiftPointsModal = ({
  open,
  onOpenChange,
  onConfirm,
}: GiftPointsModalProps) => {
  const [points, setPoints] = useState('');
  const [note, setNote] = useState('');
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);

  const handleClose = () => {
    setPoints('');
    setNote('');
    setConfirmModalOpen(false);
    onOpenChange(false);
  };

  const handleSend = () => {
    setConfirmModalOpen(true);
  };

  const handleConfirm = () => {
    onConfirm(points, note);
    handleClose();
  };

  const handleCancelConfirm = () => {
    setConfirmModalOpen(false);
  };

  return (
    <>
      {/* Gift Points Modal */}
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogPortal>
          <DialogOverlay className="fixed inset-0 bg-black/30" />
          {/* <DialogContent className="dark:bg-secondary mx-auto rounded-2xl p-6 md:!max-w-md"> */}
          <DialogContent
            aria-describedby={undefined}
            className="dark:bg-secondary max-w-lg"
          >
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

            <div className="mt-1">
              <Textarea
                placeholder="Note (optional)"
                value={note}
                onChange={(e) => setNote(e.target.value)}
              />
            </div>

            <DialogFooter className="mt-2 flex justify-end gap-2">
              <Button variant="outline" onClick={handleClose}>
                Cancel
              </Button>
              <Button onClick={handleSend} disabled={!points}>
                Send
              </Button>
            </DialogFooter>
          </DialogContent>
        </DialogPortal>
      </Dialog>

      {/* Confirmation Modal - Higher z-index to appear above */}
      <Dialog open={confirmModalOpen} onOpenChange={setConfirmModalOpen}>
        <DialogPortal>
          <DialogOverlay className="fixed inset-0 z-[60] bg-black/50" />
          <DialogContent
            aria-describedby={undefined}
            className="dark:bg-secondary z-[60] mx-auto rounded-2xl p-6 md:!max-w-md"
          >
            <DialogHeader>
              <DialogTitle>Confirm Gift</DialogTitle>
            </DialogHeader>
            <p className="text-muted-foreground mt-3 text-sm">
              Are you sure you want to send{' '}
              <span className="font-semibold">{points}</span> points?
            </p>
            <DialogFooter className="mt-6 flex justify-end gap-2">
              <Button variant="outline" onClick={handleCancelConfirm}>
                Cancel
              </Button>
              <Button onClick={handleConfirm}>Confirm</Button>
            </DialogFooter>
          </DialogContent>
        </DialogPortal>
      </Dialog>
    </>
  );
};

export default GiftPointsModal;
