'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { FC } from 'react';
import { useGetGiveawayWinnersQuery } from '@/store/Reducer/giveaways-api';
import { skipToken } from '@reduxjs/toolkit/query/react';

interface WinnersModalProps {
  open: boolean;
  onClose: () => void;
  giveawayId: string | null;
}

const WinnersModal: FC<WinnersModalProps> = ({ open, onClose, giveawayId }) => {
  const { data, isLoading } = useGetGiveawayWinnersQuery(giveawayId ? { giveawayId } : skipToken);
  const winners = data?.data || [];

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent aria-describedby={undefined} className="dark:bg-secondary">
        <DialogHeader>
          <DialogTitle>Winners List</DialogTitle>
        </DialogHeader>

        <div>
          <div className="mt-2 space-y-3">
            {isLoading ? (
              <>
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="animate-pulse rounded-md border bg-gray-50 p-3 dark:border-gray-600 dark:bg-gray-800">
                    <div className="mb-2 h-4 w-1/2 rounded bg-gray-200 dark:bg-gray-700" />
                    <div className="h-3 w-1/3 rounded bg-gray-200 dark:bg-gray-700" />
                  </div>
                ))}
              </>
            ) : winners.length > 0 ? (
              winners.map((winner: any, index: number) => (
                <div key={index} className="rounded-md border bg-gray-50 p-3 dark:border-gray-600 dark:bg-gray-800">
                  <p className="text-sm font-medium">
                    {winner.firstName} {winner.lastName} - {winner.username}
                  </p>
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
