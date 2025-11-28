'use client';

import React from 'react';
import { Button } from '@/components/ui/button';

interface SaveBannerProps {
  visible: boolean;
  onSave: () => void;
  onDiscard: () => void;
}

export const SaveBanner: React.FC<SaveBannerProps> = ({ visible, onSave, onDiscard }) => {
  return (
    <div
      className={`fixed right-0 bottom-0 left-0 z-[150] bg-gray-900 text-white shadow-2xl transition-transform duration-300 dark:bg-black ${
        visible ? 'translate-y-0' : 'translate-y-full'
      }`}
    >
      <div className="mx-auto flex max-w-screen-xl items-center justify-between gap-5 px-8 py-5">
        <div className="flex-1">
          <div className="mb-1 text-base font-bold">You have unsaved changes</div>
          <div className="text-sm opacity-80">Your ordering settings have been modified. Save to apply changes.</div>
        </div>
        <div className="flex gap-3">
          <Button variant="secondary" onClick={onDiscard} className="font-semibold">
            Discard
          </Button>
          <Button onClick={onSave} className="font-semibold">
            Save Changes
          </Button>
        </div>
      </div>
    </div>
  );
};
