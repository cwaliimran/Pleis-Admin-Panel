'use client';

import { Button } from '@/components/ui/button';
import { fDate, formatStr } from '@/utils/format-time';
import { Download, Trash2 } from 'lucide-react';
import QRCode from 'qrcode';
import React, { useEffect, useRef } from 'react';
import { QR_TYPE_CONFIG } from './constants';
import { SavedQRCardProps } from './types';

export const SavedQRCard: React.FC<SavedQRCardProps> = ({ qrCode, onDownload, onDelete }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (canvasRef.current) {
      QRCode.toCanvas(canvasRef.current, qrCode.image, {
        width: 200,
        margin: 2,
        color: {
          dark: qrCode.color,
          light: qrCode.bgColor,
        },
      });
    }
  }, [qrCode]);

  const typeLabel = QR_TYPE_CONFIG[qrCode.type]?.title || qrCode.type;

  return (
    <div className="cursor-pointer rounded-2xl bg-white p-5 shadow-sm dark:bg-[#222121]">
      <div className="mb-4 flex justify-center rounded-xl bg-gray-50 p-5 dark:bg-[#1a1a1a]">
        <canvas ref={canvasRef} width="200" height="200" className="max-w-full" />
      </div>

      <div className="mb-4 text-center">
        <div className="mb-1 text-xs font-semibold tracking-wide text-gray-500 uppercase dark:text-gray-500">{typeLabel}</div>
        <div className="mb-1 text-base font-bold text-gray-900 capitalize dark:text-gray-100">{qrCode?.label}</div>
        <div className="text-sm text-gray-500 dark:text-gray-500">Generated on: {fDate(qrCode?.createdAt, formatStr.paramCase.date)}</div>
      </div>

      <div className="flex items-center justify-center gap-2">
        <Button onClick={() => onDownload(qrCode)} className="flex items-center justify-center gap-2 text-sm font-semibold">
          <Download className="h-4 w-4" />
        </Button>

        <Button
          className={`flex cursor-pointer items-center justify-center gap-2 bg-[#E7000B] hover:bg-[#E7000B]/80`}
          onClick={() => onDelete(qrCode?._id)}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};
