'use client';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { FC, useState } from 'react';

type Props = {
  open: boolean;
  onClose: () => void;
  ticket: any;
};

const ReplySupportModal: FC<Props> = ({ open, onClose, ticket }) => {
  const [reply, setReply] = useState('');

  const handleSubmit = () => {
    // API call here
    console.log('Reply:', reply, 'Ticket:', ticket?.id);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent aria-describedby={undefined} className="dark:bg-secondary mx-auto flex w-full flex-col overflow-y-auto md:max-w-[550px]!">
        <DialogHeader>
          <DialogTitle>Reply</DialogTitle>
        </DialogHeader>

        <div className="w-full space-y-3">
          <Textarea placeholder="Write your reply..." value={reply} onChange={(e) => setReply(e.target.value)} rows={7} />

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleSubmit}>Send Reply</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ReplySupportModal;
