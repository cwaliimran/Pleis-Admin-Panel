'use client';

import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogOverlay, DialogTitle } from '@/components/ui/dialog';
import { Smartphone } from 'lucide-react';
import { Notification } from './types';
import Image from 'next/image';

interface PreviewModalProps {
  open: boolean;
  onClose: () => void;
  notification: Notification | null;
}

export const PreviewModal: React.FC<PreviewModalProps> = ({ open, onClose, notification }) => {
  if (!notification) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogOverlay className="bg-opacity-30 fixed inset-0">
        <DialogContent aria-describedby={undefined} className="dark:bg-secondary mx-auto flex w-full max-w-sm flex-col items-center">
          <DialogHeader>
            <DialogTitle>Notification Preview</DialogTitle>
          </DialogHeader>

          <div className="mt-4 w-full rounded-lg bg-gray-100 p-4 dark:bg-gray-800">
            <div className="rounded-lg bg-white p-4 shadow-lg dark:bg-[#222121]">
              <div className="flex items-start gap-3">
                <Smartphone className="h-10 w-10 text-blue-600 dark:text-blue-400" />
                <div className="flex-1">
                  <div className="mb-1 font-bold text-gray-900 dark:text-gray-100">{notification.title}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">{notification.message}</div>
                </div>
              </div>
              {notification.image && (
                <Image src={notification.image} alt={notification.title} height={300} width={300} className="mt-3 h-32 w-full rounded object-cover" />
              )}
            </div>
          </div>
        </DialogContent>
      </DialogOverlay>
    </Dialog>
  );
};
