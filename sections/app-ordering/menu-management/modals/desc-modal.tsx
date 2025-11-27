'use client';

import { Button } from '@/components/ui/button';
import React from 'react';
import { DescModalProps } from '../types';

const DescModal: React.FC<DescModalProps> = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={onClose}>
      <div className="w-full max-w-sm rounded-lg bg-white p-6 shadow-xl dark:bg-[#222121]" onClick={(e) => e.stopPropagation()}>
        <h3 className="mb-4 text-lg font-bold">{title || 'Description'}</h3>

        <div className="max-h-96 overflow-y-auto text-[15px] whitespace-pre-wrap text-gray-700 dark:text-gray-300">{children}</div>

        <Button onClick={onClose} className="mt-4 w-full" type="button">
          Close
        </Button>
      </div>
    </div>
  );
};

export default DescModal;
