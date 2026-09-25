'use client';

import { Button } from '@/components/ui/button';
import { useBoolean } from '@/hooks/useBoolean';
import { showSuccess } from '@/utils/toast';
import { FileText, Plus } from 'lucide-react';
import { useMemo, useState } from 'react';
import FiscalizeModal from './components/modals/fiscalize-modal';
import GenerateOffAppBatchModal from './components/modals/generate-off-app-batch-modal';
import GeneratePayoutStatementModal from './components/modals/generate-payout-statement-modal';
import PayoutsStatCard from './components/stats/payouts-stat-card';
import PayoutsCard, { PayoutsTab } from './components/table/payouts-card';
import {
  INITIAL_ELIGIBLE_TRANSACTIONS,
  INITIAL_FISCALIZE_QUEUE,
  INITIAL_OFF_APP_BATCHES,
  INITIAL_OFF_APP_ORDERS,
  INITIAL_PAYOUT_STATEMENTS,
  OFF_APP_COMMISSION_RATE,
} from './data/mock-data';
import { formatEuro } from './forms/format';
import { EligibleTransaction, OffAppBatch, OffAppOrder, PayoutStatement } from './types/types';

const formatDots = (isoDate: string): string => {
  const [year, month, day] = isoDate.split('-');
  return `${day}.${month}.${year}`;
};

const formatCompact = (isoDate: string): string => isoDate.replaceAll('-', '');

const nowLabel = (): string => {
  const now = new Date();
  const pad = (value: number) => String(value).padStart(2, '0');
  return `${pad(now.getDate())}.${pad(now.getMonth() + 1)}.${now.getFullYear()} ${pad(now.getHours())}:${pad(now.getMinutes())}`;
};

const PayoutsBatchesView = () => {
  const [activeTab, setActiveTab] = useState<PayoutsTab>('statements');
  const [eligibleTransactions, setEligibleTransactions] = useState<EligibleTransaction[]>(INITIAL_ELIGIBLE_TRANSACTIONS);
  const [offAppOrders, setOffAppOrders] = useState<OffAppOrder[]>(INITIAL_OFF_APP_ORDERS);
  const [fiscalizeQueue, setFiscalizeQueue] = useState(INITIAL_FISCALIZE_QUEUE);
  const [payoutStatements, setPayoutStatements] = useState<PayoutStatement[]>(INITIAL_PAYOUT_STATEMENTS);
  const [offAppBatches, setOffAppBatches] = useState<OffAppBatch[]>(INITIAL_OFF_APP_BATCHES);

  const fiscalizeModal = useBoolean();
  const generateStatementModal = useBoolean();
  const generateBatchModal = useBoolean();

  const readyForPayoutTotal = useMemo(() => eligibleTransactions.reduce((sum, t) => sum + t.organizerNet, 0), [eligibleTransactions]);
  const pendingStatementsCount = useMemo(() => payoutStatements.filter((s) => s.status === 'PENDING').length, [payoutStatements]);
  const hasPendingOffAppBatch = useMemo(() => offAppBatches.some((b) => b.status === 'PENDING'), [offAppBatches]);

  const handleRunFiscalize = () => {
    showSuccess(`Fiscalized ${fiscalizeQueue.length} transaction(s)`);
    setFiscalizeQueue([]);
    fiscalizeModal.onFalse();
  };

  const handleGenerateStatement = (periodEnd: string, executionDate: string) => {
    const organizerCompanies = new Set(eligibleTransactions.map((t) => t.organizerCompany));
    const organizerTotal = eligibleTransactions.reduce((sum, t) => sum + t.organizerNet, 0);
    const commission = eligibleTransactions.reduce((sum, t) => sum + t.commissionAmount, 0);
    const compact = formatCompact(periodEnd);

    const newStatement: PayoutStatement = {
      id: `pb-${periodEnd}`,
      code: `PB-${formatDots(periodEnd).split('.').reverse().join('-')}`,
      fileName: `INST.${compact}.0001.xml`,
      msgId: `INST${compact}0001`,
      periodStart: '01.07.2026',
      periodEnd: formatDots(periodEnd),
      generatedAt: nowLabel(),
      generatedBy: 'Suheer Zahid',
      transactionsCount: eligibleTransactions.length,
      linesCount: organizerCompanies.size + 1,
      linesNote: `${organizerCompanies.size} organizers + 1 commission`,
      organizerTotal,
      commission,
      controlSum: organizerTotal + commission,
      status: 'PENDING',
    };

    setPayoutStatements((prev) => [newStatement, ...prev]);
    setEligibleTransactions([]);
    showSuccess(`${newStatement.fileName} generated and downloaded`);
    generateStatementModal.onFalse();
    void executionDate;
  };

  const handleConfirmStatement = (id: string) => {
    setPayoutStatements((prev) => prev.map((s) => (s.id === id ? { ...s, status: 'PAID', confirmedAt: nowLabel() } : s)));
    showSuccess('Statement confirmed — transactions marked PAID OUT');
  };

  const handleCancelStatement = (id: string) => {
    setPayoutStatements((prev) => prev.map((s) => (s.id === id ? { ...s, status: 'CANCELLED' } : s)));
    showSuccess('Statement cancelled');
  };

  const handleGenerateBatch = (periodEnd: string) => {
    const organizerCompanies = new Set(offAppOrders.map((o) => o.organizerCompany));
    const orderValue = offAppOrders.reduce((sum, o) => sum + o.orderValue, 0);
    const commission = Math.round(orderValue * OFF_APP_COMMISSION_RATE * 100) / 100;

    const newBatch: OffAppBatch = {
      id: `ob-${periodEnd}`,
      code: `OB-${formatDots(periodEnd).split('.').reverse().join('-')}`,
      periodStart: '01.07.2026',
      periodEnd: formatDots(periodEnd),
      generatedAt: nowLabel(),
      generatedBy: 'Suheer Zahid',
      ordersCount: offAppOrders.length,
      offAppOrderValue: orderValue,
      pleisCommission: commission,
      linesCount: organizerCompanies.size,
      status: 'PENDING',
    };

    setOffAppBatches((prev) => [newBatch, ...prev]);
    setOffAppOrders([]);
    showSuccess(`${newBatch.code} generated with verification report`);
    generateBatchModal.onFalse();
  };

  const handleConfirmBatch = (id: string) => {
    setOffAppBatches((prev) => prev.map((b) => (b.id === id ? { ...b, status: 'CONFIRMED', confirmedAt: nowLabel() } : b)));
    showSuccess('Batch confirmed and fiscalized');
  };

  const handleCancelBatch = (id: string) => {
    setOffAppBatches((prev) => prev.map((b) => (b.id === id ? { ...b, status: 'CANCELLED' } : b)));
    showSuccess('Batch cancelled');
  };

  return (
    <div>
      <div className="mt-2 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Payouts & batches</h1>
          <p className="text-muted-foreground mt-1 max-w-2xl text-sm">
            Generated on demand — nothing is sent to the bank automatically. Generate a statement, verify the pain.001 file against transaction history
            and the bank statement, then Confirm or Cancel. Fiscalize runs separately, over every paid-out transaction.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="outline" className="flex items-center gap-2" onClick={fiscalizeModal.onTrue} disabled={fiscalizeQueue.length === 0}>
            <FileText className="h-4 w-4" />
            Fiscalize
          </Button>
          <Button
            className="flex items-center gap-2 bg-blue-600 text-white hover:bg-blue-700"
            onClick={activeTab === 'statements' ? generateStatementModal.onTrue : generateBatchModal.onTrue}
            disabled={activeTab === 'statements' ? eligibleTransactions.length === 0 : offAppOrders.length === 0 || hasPendingOffAppBatch}
          >
            <Plus className="h-4 w-4" />
            {activeTab === 'statements' ? 'Generate payout' : 'Generate off-app batch'}
          </Button>
        </div>
      </div>

      <div className="mt-5 grid grid-cols-1 gap-2 md:grid-cols-3 md:gap-x-4 md:gap-y-4 lg:grid-cols-4">
        <PayoutsStatCard title="Ready for payout" value={String(eligibleTransactions.length)} note={`Organizer total ${formatEuro(readyForPayoutTotal)}`} raise="100%" />
        <PayoutsStatCard
          title="Pending statements"
          value={String(pendingStatementsCount)}
          note={pendingStatementsCount === 0 ? 'Nothing awaiting verification' : 'Awaiting confirmation'}
          raise="100%"
        />
        <PayoutsStatCard
          title="Awaiting fiscalization"
          value={String(fiscalizeQueue.length)}
          note="Paid out · NOT_FISCALIZED or FAILED"
          raise="100%"
        />
        <PayoutsStatCard title="Off-app orders ready" value={String(offAppOrders.length)} note="Cash / organizer POS · delivered & paid" raise="100%" />
      </div>

      <PayoutsCard
        activeTab={activeTab}
        onTabChange={setActiveTab}
        eligibleCount={eligibleTransactions.length}
        offAppReadyCount={offAppOrders.length}
        payoutStatements={payoutStatements}
        offAppBatches={offAppBatches}
        onConfirmStatement={handleConfirmStatement}
        onCancelStatement={handleCancelStatement}
        onConfirmBatch={handleConfirmBatch}
        onCancelBatch={handleCancelBatch}
      />

      <FiscalizeModal open={fiscalizeModal.value} onClose={fiscalizeModal.onFalse} queue={fiscalizeQueue} onRunFiscalize={handleRunFiscalize} />

      <GeneratePayoutStatementModal
        open={generateStatementModal.value}
        onClose={generateStatementModal.onFalse}
        eligibleTransactions={eligibleTransactions}
        onGenerate={handleGenerateStatement}
      />

      <GenerateOffAppBatchModal
        open={generateBatchModal.value}
        onClose={generateBatchModal.onFalse}
        offAppOrders={offAppOrders}
        onGenerate={handleGenerateBatch}
      />
    </div>
  );
};

export default PayoutsBatchesView;
