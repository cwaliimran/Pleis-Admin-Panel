'use client';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogOverlay, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { FC, useEffect, useMemo, useState } from 'react';
import { DEFAULT_PERIOD_END, NEXT_PERIOD_START, OFF_APP_COMMISSION_RATE } from '../../data/mock-data';
import { formatEuro } from '../../forms/format';
import { OffAppOrder } from '../../types/types';

interface GenerateOffAppBatchModalProps {
  open: boolean;
  onClose: () => void;
  offAppOrders: OffAppOrder[];
  onGenerate: (periodEnd: string) => void;
}

const GenerateOffAppBatchModal: FC<GenerateOffAppBatchModalProps> = ({ open, onClose, offAppOrders, onGenerate }) => {
  const [periodEnd, setPeriodEnd] = useState(DEFAULT_PERIOD_END);

  useEffect(() => {
    if (open) setPeriodEnd(DEFAULT_PERIOD_END);
  }, [open]);

  const summary = useMemo(() => {
    const orderValue = offAppOrders.reduce((sum, o) => sum + o.orderValue, 0);
    return { count: offAppOrders.length, orderValue, commission: Math.round(orderValue * OFF_APP_COMMISSION_RATE * 100) / 100 };
  }, [offAppOrders]);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogOverlay className="bg-opacity-30 fixed inset-0">
        <DialogContent aria-describedby={undefined} className="dark:bg-secondary mx-auto w-full md:max-w-150!">
          <DialogHeader>
            <DialogTitle>Generate off-app batch</DialogTitle>
            <p className="text-muted-foreground text-sm">
              Fiscalizes orders paid outside the app and bills the ordering commission as a B2B eRačun. No pain.001, no money movement.
            </p>
          </DialogHeader>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label className="text-muted-foreground text-xs font-semibold tracking-wide uppercase">Period start · automatic</Label>
              <p className="text-sm font-semibold">{NEXT_PERIOD_START}</p>
            </div>
            <div className="space-y-1.5">
              <Label className="text-muted-foreground text-xs font-semibold tracking-wide uppercase">Period end</Label>
              <Input type="date" value={periodEnd} onChange={(e) => setPeriodEnd(e.target.value)} />
            </div>
          </div>

          <div className="overflow-hidden rounded-lg border">
            <table className="w-full text-sm">
              <thead>
                <tr className="dark:bg-secondary bg-slate-100">
                  <th className="px-3 py-2 text-left font-medium">Selection</th>
                  <th className="px-3 py-2 text-right font-medium">Value</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-t">
                  <td className="px-3 py-2">Off-app orders · delivered & paid · cash or organizer POS</td>
                  <td className="px-3 py-2 text-right font-semibold">{summary.count}</td>
                </tr>
                <tr className="border-t">
                  <td className="px-3 py-2">Off-app order value (customer paid the organizer directly)</td>
                  <td className="px-3 py-2 text-right font-semibold">{formatEuro(summary.orderValue)}</td>
                </tr>
                <tr className="border-t">
                  <td className="px-3 py-2">Pleis commission to bill · off-app ordering rate 3.00% · no gateway deduction</td>
                  <td className="px-3 py-2 text-right font-semibold">{formatEuro(summary.commission)}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="rounded-md border border-blue-300 bg-blue-50 p-3 text-xs text-blue-800 dark:border-blue-800 dark:bg-blue-900/20 dark:text-blue-300">
            Generating also produces a <strong>verification report</strong> — one row per organizer with the orders, the commission to bill, and the
            transaction ids behind each figure. That is what you check before confirming. Only one PENDING off-app batch may exist at a time.
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
            <Button className="bg-blue-600 text-white hover:bg-blue-700" disabled={summary.count === 0} onClick={() => onGenerate(periodEnd)}>
              Generate batch & report
            </Button>
          </div>
        </DialogContent>
      </DialogOverlay>
    </Dialog>
  );
};

export default GenerateOffAppBatchModal;
