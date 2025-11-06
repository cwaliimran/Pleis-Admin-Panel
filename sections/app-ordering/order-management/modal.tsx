'use client';

import { FC, ReactNode } from 'react';
import { X } from 'lucide-react';

interface Props {
  open: boolean;
  title: string;
  children: ReactNode;
  onClose: () => void;
  onConfirm: () => void;
  confirmLabel?: string;
  confirmClass?: string;
}

export const Modal: FC<Props> = ({
  open,
  title,
  children,
  onClose,
  onConfirm,
  confirmLabel = 'Confirm',
  confirmClass = 'bg-blue-600 hover:bg-blue-700',
}) => {
  if (!open) return null;

  return (
    <div className="animate-fadeIn fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-5">
      <div className="animate-slideUp w-full max-w-sm rounded-2xl bg-white p-6">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-xl font-bold">{title}</h2>
          <button title="button" type="button" onClick={onClose} className="text-blue-600">
            <X size={28} />
          </button>
        </div>
        <p className="mb-6 text-gray-600">{children}</p>
        <div className="grid grid-cols-2 gap-3">
          <button title="button" type="button" onClick={onClose} className="rounded-xl bg-gray-100 py-3 font-bold text-gray-800">
            Cancel
          </button>
          <button title="button" type="button" onClick={onConfirm} className={`rounded-xl py-3 font-bold text-white ${confirmClass}`}>
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
};
