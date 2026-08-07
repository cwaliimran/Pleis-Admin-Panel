'use client';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Skeleton } from '@/components/ui/skeleton';
import QRCode from 'qrcode';
import React, { useEffect, useState } from 'react';
import { DELIVERY_OPTION_TYPE_CONFIG } from './constants';
import { DeliveryOption } from './types';

// ============================================================
// Delivery option — QR code
//
// The code encodes the record's Mongo `_id` and nothing else, so whatever
// scans it resolves the option itself rather than a URL that could go stale.
//
// Rendered as a data URL rather than onto a canvas ref: the dialog mounts
// its content only while open, and a data URL sidesteps having to wait for
// the ref to attach before drawing.
// ============================================================

/** Fixed, not theme-aware: a QR needs dark-on-light to stay scannable. */
const QR_DARK = '#1d1d1f';
const QR_LIGHT = '#ffffff';

interface DeliveryOptionQrModalProps {
  open: boolean;
  onClose: () => void;
  /** The option to encode. Absent until a row's QR button is clicked. */
  option?: DeliveryOption | null;
}

export const DeliveryOptionQrModal: React.FC<DeliveryOptionQrModalProps> = ({ open, onClose, option }) => {
  const [dataUrl, setDataUrl] = useState<string | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    if (!open || !option) return;

    // Cleared first so reopening for another option never shows the previous code.
    setDataUrl(null);
    setFailed(false);

    let cancelled = false;

    QRCode.toDataURL(option.id, {
      width: 512, // generated larger than displayed so it stays crisp
      margin: 2,
      color: { dark: QR_DARK, light: QR_LIGHT },
    })
      .then((url) => {
        if (!cancelled) setDataUrl(url);
      })
      .catch(() => {
        if (!cancelled) setFailed(true);
      });

    // Guards against a slow generation for a previous option landing last.
    return () => {
      cancelled = true;
    };
  }, [open, option]);

  const renderCode = () => {
    if (failed) {
      return <p className="px-4 py-16 text-center text-sm text-red-600 dark:text-red-400">Could not generate the QR code.</p>;
    }

    if (!dataUrl) {
      return <Skeleton className="h-64 w-64 rounded-lg" />;
    }

    return (
      // eslint-disable-next-line @next/next/no-img-element -- a data URL, so there is nothing for next/image to optimise
      <img src={dataUrl} alt={`QR code for ${option?.name ?? 'delivery option'}`} className="h-64 w-64" />
    );
  };

  return (
    <Dialog open={open} onOpenChange={(next) => !next && onClose()}>
      <DialogContent className="w-full max-w-sm dark:bg-[#222121]">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">{option?.name || 'Delivery option'}</DialogTitle>
          <DialogDescription>
            {option ? `${DELIVERY_OPTION_TYPE_CONFIG[option.type].label} — scan to open this delivery option.` : 'Scan to open this delivery option.'}
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col items-center gap-4 py-2">
          {/* Always on white, whatever the app theme — see QR_DARK/QR_LIGHT above. */}
          <div className="flex items-center justify-center rounded-xl bg-white p-4 shadow-sm">{renderCode()}</div>

          <p className="max-w-full text-center font-mono text-xs break-all text-gray-500 dark:text-gray-400">{option?.id}</p>
        </div>

        <div className="mt-2 flex justify-end">
          <Button type="button" variant="outline" onClick={onClose} className="cursor-pointer font-semibold">
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
