'use client';

import { Dialog, DialogContent, DialogHeader, DialogOverlay, DialogTitle } from '@/components/ui/dialog';
import { showSuccess } from '@/utils/toast';
import { FC } from 'react';
import { DocumentCard, InfoLine, PaymentAttemptRow, SectionHeading } from '../table/detail-parts';
import { formatEuro, formatPercent, formatSignedEuro } from '../../forms/format';
import { Transaction } from '../../types/types';

interface TransactionDetailModalProps {
  open: boolean;
  onClose: () => void;
  transaction: Transaction | null;
}

const TransactionDetailModal: FC<TransactionDetailModalProps> = ({ open, onClose, transaction }) => {
  if (!transaction) return null;

  const { moneySplit, parties, settlement, fiscalization, paymentAttempts } = transaction.detail;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogOverlay className="bg-opacity-30 fixed inset-0">
        <DialogContent
          aria-describedby={undefined}
          className="dark:bg-secondary mx-auto flex max-h-[90vh] w-full flex-col overflow-hidden md:max-w-[700px]!"
        >
          <DialogHeader className="shrink-0 border-b pb-3 dark:border-gray-700">
            <DialogTitle>Transaction {transaction.transactionId}</DialogTitle>
            <p className="text-muted-foreground text-sm">
              {transaction.subtype} · {transaction.capturedAt || 'Not captured'} · {transaction.organization || transaction.user?.name || '—'}
            </p>
          </DialogHeader>

          <div className="flex-1 space-y-6 overflow-y-auto px-1 py-4">
            <section>
              <SectionHeading title="Money split · integer cents, organizer never carries the gateway cost" />
              <InfoLine label="Gross (received)" value={formatEuro(moneySplit.gross)} />
              {moneySplit.commissionRate !== null && (
                <InfoLine
                  label="Commission rate"
                  value={
                    moneySplit.commissionAmount !== null
                      ? `${formatPercent(moneySplit.commissionRate)} · ${formatEuro(moneySplit.commissionAmount)}`
                      : formatPercent(moneySplit.commissionRate)
                  }
                />
              )}
              <InfoLine label="Organizer net" value={formatEuro(moneySplit.organizerNet)} />
              {moneySplit.serviceFeeLabel && <InfoLine label={moneySplit.serviceFeeLabel} value={formatEuro(moneySplit.serviceFeeAmount)} />}
              {moneySplit.gatewayCostLabel && <InfoLine label={moneySplit.gatewayCostLabel} value={formatSignedEuro(moneySplit.gatewayCostAmount)} />}
              <InfoLine label="Pleis net" value={formatEuro(moneySplit.pleisNet)} />
            </section>

            <section>
              <SectionHeading title="Parties · all three snapshotted, reproducible without the pdf" />
              <InfoLine label="Buyer" value={`${parties.buyer.name} · ${parties.buyer.subtitle}`} />
              {parties.organizer && <InfoLine label="Organizer (seller)" value={`${parties.organizer.name} · ${parties.organizer.subtitle}`} />}
              <InfoLine label="Pleis (collector)" value={`${parties.pleis.name} · ${parties.pleis.subtitle}`} />
            </section>

            <section>
              <SectionHeading title="Settlement" />
              <InfoLine label="Track" value={settlement.track} />
              <InfoLine label="Status" value={settlement.status || '—'} />
              <InfoLine label="Batch" value={settlement.batch} />
              <InfoLine label="Eligibility" value={settlement.eligibility} />
            </section>

            <section>
              <SectionHeading title="Fiscalization & documents" />
              <InfoLine label="Fiscalization" value={fiscalization.status || '—'} />
              <InfoLine label="Document status" value={fiscalization.documentStatus} />

              {fiscalization.documents.length > 0 && (
                <div className="mt-3 space-y-2">
                  {fiscalization.documents.map((document, idx) => (
                    <DocumentCard
                      key={`${document.code}-${idx}`}
                      document={document}
                      onView={() => showSuccess(`Opening ${document.label}`)}
                      onDownload={() => showSuccess(`Downloading ${document.label}`)}
                    />
                  ))}
                </div>
              )}
            </section>

            <section>
              <SectionHeading title="Payment attempts · one row per attempt" />
              <div className="space-y-2">
                {paymentAttempts.map((attempt) => (
                  <PaymentAttemptRow key={attempt.index} attempt={attempt} />
                ))}
              </div>
            </section>
          </div>
        </DialogContent>
      </DialogOverlay>
    </Dialog>
  );
};

export default TransactionDetailModal;
