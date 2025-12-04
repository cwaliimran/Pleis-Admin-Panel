'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useState, FC, useEffect } from 'react';

interface ReviewEditModalProps {
  open: boolean;
  onClose: () => void;
  onUpdate: (text: string) => void;
  defaultReview: string;
}

const ReviewEditModal: FC<ReviewEditModalProps> = ({ open, onClose, onUpdate, defaultReview }) => {
  const [review, setReview] = useState(defaultReview);

  useEffect(() => {
    setReview(defaultReview);
  }, [defaultReview]);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="dark:bg-secondary max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Review</DialogTitle>
        </DialogHeader>

        <Textarea value={review} onChange={(e) => setReview(e.target.value)} className="min-h-[120px]" placeholder="Update review..." />

        <div className="mt-4 flex justify-end gap-2">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={() => onUpdate(review)}>Update</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ReviewEditModal;
