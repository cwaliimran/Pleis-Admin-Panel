'use client';

import { Card } from '@/components/ui/card';
import { FC } from 'react';
import { OffAppBatch, PayoutStatement } from '../../types/types';
import OffAppBatchesTable from './off-app-batches-table';
import PayoutStatementsTable from './payout-statements-table';

export type PayoutsTab = 'statements' | 'offapp';

interface PayoutsCardProps {
  activeTab: PayoutsTab;
  onTabChange: (tab: PayoutsTab) => void;
  eligibleCount: number;
  offAppReadyCount: number;
  payoutStatements: PayoutStatement[];
  offAppBatches: OffAppBatch[];
  onConfirmStatement: (id: string) => void;
  onCancelStatement: (id: string) => void;
  onConfirmBatch: (id: string) => void;
  onCancelBatch: (id: string) => void;
}

const PayoutsCard: FC<PayoutsCardProps> = ({
  activeTab,
  onTabChange,
  eligibleCount,
  offAppReadyCount,
  payoutStatements,
  offAppBatches,
  onConfirmStatement,
  onCancelStatement,
  onConfirmBatch,
  onCancelBatch,
}) => (
  <Card className="dark:bg-secondary mt-5 mb-5 px-2 shadow-md md:px-8">
    <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
      <div>
        <h3 className="ml-2 text-xl font-semibold md:ml-0">{activeTab === 'statements' ? 'Payout statements' : 'Off-app batches'}</h3>
        <p className="text-muted-foreground ml-2 text-sm md:ml-0">
          {activeTab === 'statements'
            ? 'SEPA Instant Credit Transfer · pain.001.001.09 (HRInst) · one line per organizer parent company + one commission line'
            : 'Fiscalizes cash / organizer-POS orders and bills the ordering commission by B2B eRačun · no pain.001, no money movement'}
        </p>
      </div>

      <div className="flex shrink-0 items-center rounded-full border border-gray-300 p-0.5 dark:border-gray-600">
        <button
          type="button"
          onClick={() => onTabChange('statements')}
          className={`cursor-pointer rounded-full px-3 py-1.5 text-sm font-medium transition ${
            activeTab === 'statements'
              ? 'bg-blue-600 text-white'
              : 'text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800'
          }`}
        >
          Payout statements
        </button>
        <button
          type="button"
          onClick={() => onTabChange('offapp')}
          className={`cursor-pointer rounded-full px-3 py-1.5 text-sm font-medium transition ${
            activeTab === 'offapp' ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800'
          }`}
        >
          Off-app batches
        </button>
      </div>
    </div>

    <div className="mt-4 rounded-md border border-blue-300 bg-blue-50 p-3 text-xs text-blue-800 dark:border-blue-800 dark:bg-blue-900/20 dark:text-blue-300">
      {activeTab === 'statements' ? (
        <>
          <strong>Flow:</strong> Generate → the pain.001 file downloads → you verify it against transaction history and the bank statement → Confirm or
          Cancel. Confirming marks transactions <strong>PAID OUT</strong> but does <strong>not</strong> fiscalize — press Fiscalize separately.{' '}
          {eligibleCount} transactions are ready for the next statement.
        </>
      ) : (
        <>
          <strong>Off-app batch:</strong> no pain.001, no money movement — the customer already paid the organizer directly (cash / their POS). Confirming
          fiscalizes those orders and issues one commission <strong>B2B eRačun</strong> per organizer (Fiskalizacija 2.0, no gateway deduction).{' '}
          {offAppReadyCount} off-app orders are ready for the next batch.
        </>
      )}
    </div>

    <div className="mt-4">
      {activeTab === 'statements' ? (
        <PayoutStatementsTable data={payoutStatements} onConfirm={onConfirmStatement} onCancel={onCancelStatement} />
      ) : (
        <OffAppBatchesTable data={offAppBatches} onConfirm={onConfirmBatch} onCancel={onCancelBatch} />
      )}
    </div>
  </Card>
);

export default PayoutsCard;
