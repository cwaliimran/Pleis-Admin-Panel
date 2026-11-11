'use client';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogOverlay, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { FC, useEffect, useMemo, useState } from 'react';
import { DEFAULT_PERIOD_END, NEXT_PERIOD_START } from '../../data/mock-data';
import { formatEuro } from '../../forms/format';
import { EligibleTransaction } from '../../types/types';

interface GeneratePayoutStatementModalProps {
  open: boolean;
  onClose: () => void;
  eligibleTransactions: EligibleTransaction[];
  onGenerate: (periodEnd: string, executionDate: string) => void;
}

const GeneratePayoutStatementModal: FC<GeneratePayoutStatementModalProps> = ({ open, onClose, eligibleTransactions, onGenerate }) => {
  const [periodEnd, setPeriodEnd] = useState(DEFAULT_PERIOD_END);
  const [executionDate, setExecutionDate] = useState(DEFAULT_PERIOD_END);

  useEffect(() => {
    if (open) {
      setPeriodEnd(DEFAULT_PERIOD_END);
      setExecutionDate(DEFAULT_PERIOD_END);
    }
  }, [open]);

  const summary = useMemo(() => {
    const organizerCompanies = new Set(eligibleTransactions.map((t) => t.organizerCompany));
    const organizerTotal = eligibleTransactions.reduce((sum, t) => sum + t.organizerNet, 0);
    const commissionTotal = eligibleTransactions.reduce((sum, t) => sum + t.commissionAmount, 0);
    const lines = organizerCompanies.size + 1;

    return {
      eligibleCount: eligibleTransactions.length,
      organizerCompanyCount: organizerCompanies.size,
      organizerTotal,
      commissionTotal,
      controlSum: organizerTotal + commissionTotal,
      lines,
    };
  }, [eligibleTransactions]);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogOverlay className="bg-opacity-30 fixed inset-0">
        <DialogContent aria-describedby={undefined} className="dark:bg-secondary mx-auto w-full md:max-w-150!">
          <DialogHeader>
            <DialogTitle>Generate payout statement</DialogTitle>
            <p className="text-muted-foreground text-sm">SEPA Instant Credit Transfer · pain.001.001.09 (HRInst)</p>
          </DialogHeader>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label className="text-muted-foreground text-xs font-semibold tracking-wide uppercase">Period start · automatic</Label>
              <p className="text-sm font-semibold">{NEXT_PERIOD_START}</p>
              <p className="text-muted-foreground text-xs">end of the last non-cancelled statement, no gaps, no overlap</p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-muted-foreground text-xs font-semibold tracking-wide uppercase">Period end · you pick the day</Label>
                <Input type="date" value={periodEnd} onChange={(e) => setPeriodEnd(e.target.value)} />
              </div>
              <div className="space-y-1.5">
                <Label className="text-muted-foreground text-xs font-semibold tracking-wide uppercase">Execution date</Label>
                <Input type="date" value={executionDate} onChange={(e) => setExecutionDate(e.target.value)} />
              </div>
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
                  <td className="px-3 py-2">Eligible transactions (PENDING · no statement · service completed)</td>
                  <td className="px-3 py-2 text-right font-semibold">{summary.eligibleCount}</td>
                </tr>
                <tr className="border-t">
                  <td className="px-3 py-2">Organizer parent companies → one CdtTrfTxInf each</td>
                  <td className="px-3 py-2 text-right font-semibold">{summary.organizerCompanyCount} lines</td>
                </tr>
                <tr className="border-t">
                  <td className="px-3 py-2">Commission → single self-transfer line, locked → operating account</td>
                  <td className="px-3 py-2 text-right font-semibold">1 line · {formatEuro(summary.commissionTotal)}</td>
                </tr>
                <tr className="border-t">
                  <td className="px-3 py-2">Organizer total</td>
                  <td className="px-3 py-2 text-right font-semibold">{formatEuro(summary.organizerTotal)}</td>
                </tr>
                <tr className="border-t">
                  <td className="px-3 py-2">Control sum (NbOfTxs {summary.lines})</td>
                  <td className="px-3 py-2 text-right font-semibold">{formatEuro(summary.controlSum)}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="rounded-md border border-blue-300 bg-blue-50 p-3 text-xs text-blue-800 dark:border-blue-800 dark:bg-blue-900/20 dark:text-blue-300">
            0 transaction(s) stay PENDING because the service has not completed (e.g. the event has not ended) — they roll into a later statement. Refunds
            and disputes are EXCLUDED automatically. Selection runs FOR UPDATE SKIP LOCKED, so no row can land in two files.
          </div>

          <div className="rounded-md border border-amber-300 bg-amber-50 p-3 text-xs text-amber-800 dark:border-amber-800 dark:bg-amber-900/20 dark:text-amber-300">
            The file downloads to your computer. Verify it against transaction history and the bank statement, upload it to the banking application
            yourself, then come back and Confirm.
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
            <Button
              className="bg-blue-600 text-white hover:bg-blue-700"
              disabled={summary.eligibleCount === 0}
              onClick={() => onGenerate(periodEnd, executionDate)}
            >
              Generate & download pain.001
            </Button>
          </div>
        </DialogContent>
      </DialogOverlay>
    </Dialog>
  );
};

export default GeneratePayoutStatementModal;
