'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { FC } from 'react';

interface WinnersModalProps {
  open: boolean;
  onClose: () => void;
  giveawayId: string | null;
}

const WinnersModal: FC<WinnersModalProps> = ({ open, onClose, giveawayId }) => {
  // Dummy winners list for now
  console.log('giveawayId', giveawayId);

  const dummyWinners = [
    { id: 'w1', name: 'John Doe', email: 'john@example.com', ticketNumber: 'A-1023' },
    { id: 'w2', name: 'Sarah Khan', email: 'sarah@example.com', ticketNumber: 'B-5542' },
    { id: 'w3', name: 'Ahmed Raza', email: 'ahmed@example.com', ticketNumber: 'C-8891' },
  ];

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="dark:bg-secondary">
        <DialogHeader>
          <DialogTitle>Winners List</DialogTitle>
        </DialogHeader>

        <div>
          <div className="mt-2 space-y-3">
            {dummyWinners.length > 0 ? (
              dummyWinners.map((winner) => (
                <div key={winner.id} className="rounded-md border bg-gray-50 p-3 dark:border-gray-600 dark:bg-gray-800">
                  <p className="text-sm font-medium">{winner.name}</p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">{winner.email}</p>
                </div>
              ))
            ) : (
              <p className="text-sm">No winners yet.</p>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default WinnersModal;
