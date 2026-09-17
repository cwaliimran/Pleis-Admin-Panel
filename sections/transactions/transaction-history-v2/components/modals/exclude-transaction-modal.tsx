'use client';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogOverlay, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { AlertTriangle } from 'lucide-react';
import { FC, useEffect, useState } from 'react';
import { CATEGORY_CONFIG } from '../../config/config';
import { formatEuro } from '../../forms/format';
import { Transaction } from '../../types/types';

interface ExcludeTransactionModalProps {
  open: boolean;
  transaction: Transaction | null;
  onClose: () => void;
  onConfirm: (transaction: Transaction, reason: string) => void;
}

const ExcludeTransactionModal: FC<ExcludeTransactionModalProps> = ({ open, transaction, onClose, onConfirm }) => {
  const [reason, setReason] = useState('');

  useEffect(() => {
    if (open) setReason('');
  }, [open, transaction?.id]);

  if (!transaction) return null;

  const buyerName = transaction.user?.name || 'Guest';
  const canSubmit = reason.trim().length > 0;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogOverlay className="bg-opacity-30 fixed inset-0">
        <DialogContent aria-describedby={undefined} className="dark:bg-secondary mx-auto w-full md:max-w-[560px]!">
          <DialogHeader>
            <DialogTitle>Exclude from payout — {transaction.transactionId}</DialogTitle>
            <p className="text-muted-foreground text-sm">
              {CATEGORY_CONFIG[transaction.category].label} · {formatEuro(transaction.amount)} · {buyerName}
            </p>
          </DialogHeader>

          <div className="space-y-4">
            <p className="text-sm text-gray-600 dark:text-gray-300">
              For manually handled cases: refunds settled outside the system, goodwill compensation, disputed amounts, test transactions, data errors.
            </p>

            <div className="space-y-2">
              <Label className="text-xs font-semibold tracking-wide uppercase">Reason · required, stored in exclusion_reason</Label>
              <Textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="e.g. Refund settled by bank transfer outside the system — case #4412"
                className="min-h-24"
              />
            </div>

            <div className="flex items-start gap-2 rounded-md border border-amber-300 bg-amber-50 p-3 dark:border-amber-700 dark:bg-amber-900/20">
              <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-600 dark:text-amber-400" />
              <p className="text-xs text-amber-800 dark:text-amber-300">
                The transaction will never enter a statement (payout_status = EXCLUDED). Superadmin can revert it to PENDING later. Every exclusion writes
                an audit entry with actor, timestamp, old status, new status and the reason.
              </p>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" onClick={onClose}>
              Back
            </Button>
            <Button variant="destructive" disabled={!canSubmit} onClick={() => onConfirm(transaction, reason.trim())}>
              Exclude transaction
            </Button>
          </div>
        </DialogContent>
      </DialogOverlay>
    </Dialog>
  );
};

export default ExcludeTransactionModal;
