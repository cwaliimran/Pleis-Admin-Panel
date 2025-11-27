'use client';

import React, { useEffect, useRef } from 'react';
import QRCode from 'qrcode';
import { Button } from '@/components/ui/button';
import { SavedQRCode } from './types';
import { QR_TYPE_CONFIG } from './constants';
import { Download, Trash2 } from 'lucide-react';

interface SavedQRCardProps {
  qrCode: SavedQRCode;
  onDownload: (qrCode: SavedQRCode) => void;
  onDelete: (id: string) => void;
}

export const SavedQRCard: React.FC<SavedQRCardProps> = ({ qrCode, onDownload, onDelete }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (canvasRef.current) {
      QRCode.toCanvas(canvasRef.current, qrCode.url, {
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
    <div className="rounded-2xl bg-white p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md dark:bg-[#222121]">
      <div className="mb-4 flex justify-center rounded-xl bg-gray-50 p-5 dark:bg-[#1a1a1a]">
        <canvas ref={canvasRef} width="200" height="200" className="max-w-full" />
      </div>

      <div className="mb-4">
        <div className="mb-1 text-xs font-semibold tracking-wide text-gray-500 uppercase dark:text-gray-500">{typeLabel}</div>
        <div className="mb-1 text-base font-bold text-gray-900 dark:text-gray-100">{qrCode.name}</div>
        <div className="text-sm text-gray-500 dark:text-gray-500">Generated on {qrCode.date}</div>
      </div>

      {/* <div className="grid grid-cols-2 gap-2">
        <Button onClick={() => onDownload(qrCode)} className="gap-2 text-sm font-semibold">
          ⬇️ Download
        </Button>

        <Button className={`cursor-pointer bg-[#E7000B] hover:bg-[#E7000B]/80`} onClick={() => onDelete(qrCode.id)}>
          Delete
        </Button>
      </div> */}

      <div className="flex items-center justify-center gap-2">
        <Button onClick={() => onDownload(qrCode)} className="flex items-center justify-center gap-2 text-sm font-semibold">
          <Download className="h-4 w-4" />
        </Button>

        <Button
          className={`flex cursor-pointer items-center justify-center gap-2 bg-[#E7000B] hover:bg-[#E7000B]/80`}
          onClick={() => onDelete(qrCode.id)}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};
