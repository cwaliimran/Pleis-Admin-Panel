'use client';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogOverlay, DialogTitle } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { FC } from 'react';
import { formatEuro } from '../../forms/format';
import { FiscalizeQueueItem } from '../../types/types';

interface FiscalizeModalProps {
  open: boolean;
  onClose: () => void;
  queue: FiscalizeQueueItem[];
  onRunFiscalize: () => void;
}

const FiscalizeModal: FC<FiscalizeModalProps> = ({ open, onClose, queue, onRunFiscalize }) => (
  <Dialog open={open} onOpenChange={onClose}>
    <DialogOverlay className="bg-opacity-30 fixed inset-0">
      <DialogContent aria-describedby={undefined} className="dark:bg-secondary mx-auto w-full md:max-w-150!">
        <DialogHeader>
          <DialogTitle>Fiscalize</DialogTitle>
          <p className="text-muted-foreground text-sm">
            Runs over every paid-out transaction not yet fiscalized — regardless of which statement it came from. Idempotent: pressing it repeatedly is
            safe.
          </p>
        </DialogHeader>

        <div className="overflow-hidden rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Transaction</TableHead>
                <TableHead>Module</TableHead>
                <TableHead>Statement</TableHead>
                <TableHead>Current status</TableHead>
                <TableHead className="text-right">Pleis net</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {queue.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center">
                    Nothing to fiscalize
                  </TableCell>
                </TableRow>
              ) : (
                queue.map((item) => (
                  <TableRow key={item.transactionId}>
                    <TableCell>{item.transactionId}</TableCell>
                    <TableCell>{item.module}</TableCell>
                    <TableCell>{item.statement}</TableCell>
                    <TableCell className="font-semibold">{item.currentStatus}</TableCell>
                    <TableCell className="text-right">{formatEuro(item.pleisNet)}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        <div className="rounded-md border border-blue-300 bg-blue-50 p-3 text-xs text-blue-800 dark:border-blue-800 dark:bg-blue-900/20 dark:text-blue-300">
          Each transaction goes to Billko. Commission invoices are issued as <strong>B2B eRačun</strong> (one per organizer, per statement period, Tg4 25%).
          Failures are retried on the next run — one failed line never blocks the batch. PENDING and EXCLUDED are never fiscalized; FISCALIZED is skipped,
          so nothing fiscalizes twice.
        </div>

        <div className="flex justify-end gap-2 pt-2">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          <Button className="bg-blue-600 text-white hover:bg-blue-700" disabled={queue.length === 0} onClick={onRunFiscalize}>
            Run Fiscalize · {queue.length} transactions
          </Button>
        </div>
      </DialogContent>
    </DialogOverlay>
  </Dialog>
);

export default FiscalizeModal;
