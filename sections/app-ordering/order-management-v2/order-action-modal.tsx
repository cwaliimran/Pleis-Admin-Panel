'use client';

import ButtonLoading from '@/components/common/button-loading';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import React, { useEffect, useState } from 'react';
import { DESTRUCTIVE_ACTION_COPY, REJECTION_REASON_OPTIONS } from './constants';
import { DestructiveActionPayload, DestructiveActionType, Order, RejectionReason } from './types';

interface OrderActionModalProps {
  open: boolean;
  /** `reject` for orders never accepted, `cancel` for ones already in progress. */
  action: DestructiveActionType;
  order: Order | null;
  isSubmitting: boolean;
  onClose: () => void;
  onConfirm: (payload: DestructiveActionPayload) => void;
}

export const OrderActionModal: React.FC<OrderActionModalProps> = ({ open, action, order, isSubmitting, onClose, onConfirm }) => {
  const [reason, setReason] = useState<RejectionReason | ''>('');
  const [note, setNote] = useState('');

  const copy = DESTRUCTIVE_ACTION_COPY[action];

  // Reset on open so a reopened modal never carries the previous answer.
  useEffect(() => {
    if (!open) return;
    setReason('');
    setNote('');
  }, [open, order?.id]);

  const handleConfirm = () => {
    if (!reason) return;
    onConfirm({ reason, note });
  };

  return (
    <Dialog open={open} onOpenChange={(next) => !next && onClose()}>
      <DialogContent aria-describedby={undefined} className="w-full max-w-md gap-0 p-0 dark:bg-[#222121]">
        <DialogHeader className="border-b border-gray-200 px-6 py-4 dark:border-gray-800">
          <DialogTitle className="text-lg font-bold">{copy.title}</DialogTitle>
        </DialogHeader>

        <div className="max-h-[65vh] overflow-y-auto px-6 py-5">
          <p className="mb-5 text-sm leading-relaxed text-gray-600 dark:text-gray-400">
            Order <span className="font-bold text-gray-900 dark:text-gray-100">#{order?.orderNumber}</span> {copy.lead}
          </p>

          <div className="mb-2 text-sm font-semibold text-gray-900 dark:text-gray-100">
            Reason <span className="font-normal text-gray-500 dark:text-gray-400">· required</span>
          </div>

          <RadioGroup value={reason} onValueChange={(next) => setReason(next as RejectionReason)} className="gap-2">
            {REJECTION_REASON_OPTIONS.map((option) => (
              <div
                key={option.value}
                // Clicking anywhere in the row picks it; the item itself stays
                // focusable so the group is still keyboard navigable.
                onClick={() => setReason(option.value)}
                className={cn(
                  'flex cursor-pointer items-center gap-3 rounded-lg border p-3 transition-colors',
                  reason === option.value
                    ? 'border-blue-500 bg-blue-50 dark:border-blue-600 dark:bg-blue-950/30'
                    : 'border-gray-200 hover:border-gray-300 dark:border-gray-700 dark:hover:border-gray-600'
                )}
              >
                <RadioGroupItem id={`reason-${option.value}`} value={option.value} />
                <label htmlFor={`reason-${option.value}`} className="cursor-pointer text-sm font-semibold text-gray-900 dark:text-gray-100">
                  {option.label}
                </label>
              </div>
            ))}
          </RadioGroup>

          <div className="mt-5 mb-2 text-sm font-semibold text-gray-900 dark:text-gray-100">
            Note <span className="font-normal text-gray-500 dark:text-gray-400">· optional</span>
          </div>
          <Textarea
            rows={3}
            value={note}
            onChange={(event) => setNote(event.target.value)}
            placeholder="Anything the customer should know"
            aria-label="Note for the customer"
          />

          <p className="mt-4 text-xs leading-relaxed text-gray-500 dark:text-gray-400">
            The customer is notified with this reason. Any voucher amount is released back to their balance and no loyalty points are awarded.
          </p>
        </div>

        <div className="flex justify-end gap-2 border-t border-gray-200 px-6 py-4 dark:border-gray-800">
          <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting} className="cursor-pointer font-semibold">
            Keep order
          </Button>
          {isSubmitting ? (
            <Button type="button" disabled className="cursor-not-allowed bg-red-500 hover:bg-red-500">
              <ButtonLoading />
            </Button>
          ) : (
            <Button
              type="button"
              onClick={handleConfirm}
              disabled={!reason}
              className="cursor-pointer bg-red-500 font-semibold text-white hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {copy.confirmLabel}
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
