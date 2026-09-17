'use client';

import { Dialog, DialogContent, DialogHeader, DialogOverlay, DialogTitle } from '@/components/ui/dialog';
import { showSuccess } from '@/utils/toast';
import { FC } from 'react';
import { formatEuro, formatPercent } from '../../forms/format';
import { Ticket } from '../../types/types';
import { DocumentCard, InfoLine, ScanAttemptRow, SectionHeading } from '../table/detail-parts';

interface TicketDetailModalProps {
  open: boolean;
  onClose: () => void;
  ticket: Ticket | null;
}

const TicketDetailModal: FC<TicketDetailModalProps> = ({ open, onClose, ticket }) => {
  if (!ticket) return null;

  const { ticket: ticketInfo, parties, moneySplit, settlement, documents, scans } = ticket.detail;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogOverlay className="bg-opacity-30 fixed inset-0">
        <DialogContent aria-describedby={undefined} className="dark:bg-secondary mx-auto flex max-h-[90vh] w-full flex-col overflow-hidden md:max-w-175!">
          <DialogHeader className="shrink-0 border-b pb-3 dark:border-gray-700">
            <DialogTitle>Ticket {ticket.ticketId}</DialogTitle>
            <p className="text-muted-foreground text-sm">
              {ticketInfo.type} · {ticket.createdAt} · {ticket.eventName}
            </p>
          </DialogHeader>

          <div className="flex-1 space-y-6 overflow-y-auto px-1 py-4">
            <section>
              <SectionHeading title="Ticket" />
              <InfoLine label="Type" value={ticketInfo.type} />
              <InfoLine label="Resale protection" value={ticketInfo.resaleProtection} />
              <InfoLine label="Repeatable" value={ticketInfo.repeatable ? 'Yes' : 'No'} />
              <InfoLine label="Usage" value={ticketInfo.usageNote} />
              <InfoLine label="Fast track" value={ticketInfo.fastTrack ? 'Yes' : 'No'} />
            </section>

            <section>
              <SectionHeading title="Parties" />
              <InfoLine label="Current owner" value={`${parties.currentOwner.name} · ${parties.currentOwner.subtitle}`} />
              <InfoLine label="Original buyer" value={`${parties.originalBuyer.name} · ${parties.originalBuyer.subtitle}`} />
              {parties.assignedHolder && <InfoLine label="Assigned holder" value={`${parties.assignedHolder.name} · ${parties.assignedHolder.subtitle}`} />}
              {parties.organizer && <InfoLine label="Organizer" value={`${parties.organizer.name} · ${parties.organizer.subtitle}`} />}
            </section>

            <section>
              <SectionHeading title="Money" />
              <InfoLine label="Base price" value={formatEuro(moneySplit.basePrice)} />
              <InfoLine label="Price paid" value={formatEuro(moneySplit.pricePaid)} />
              {moneySplit.transferFee !== undefined && <InfoLine label="Transfer fee" value={formatEuro(moneySplit.transferFee)} />}
              {moneySplit.fastTrackFee !== undefined && <InfoLine label="Fast track fee" value={formatEuro(moneySplit.fastTrackFee)} />}
              {moneySplit.serviceFee !== undefined && <InfoLine label="Service fee" value={formatEuro(moneySplit.serviceFee)} />}
              {moneySplit.taxRate !== undefined && (
                <InfoLine label="Tax" value={`${formatPercent(moneySplit.taxRate)} · ${moneySplit.taxLabel}`} />
              )}
              {moneySplit.commissionRate !== undefined && <InfoLine label="Commission rate" value={formatPercent(moneySplit.commissionRate)} />}
            </section>

            <section>
              <SectionHeading title="Settlement" />
              <InfoLine label="Status" value={settlement.status || '—'} />
              <InfoLine label="Batch" value={settlement.batch} />
              <InfoLine label="Eligibility" value={settlement.eligibility} />
            </section>

            {documents.length > 0 && (
              <section>
                <SectionHeading title="Documents" />
                <div className="space-y-2">
                  {documents.map((document, idx) => (
                    <DocumentCard
                      key={`${document.code}-${idx}`}
                      document={document}
                      onView={() => showSuccess(`Opening ${document.label}`)}
                      onDownload={() => showSuccess(`Downloading ${document.label}`)}
                    />
                  ))}
                </div>
              </section>
            )}

            <section>
              <SectionHeading title="Scan history" />
              {scans.length > 0 ? (
                <div className="space-y-2">
                  {scans.map((scan) => (
                    <ScanAttemptRow key={scan.index} scan={scan} />
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500 dark:text-gray-400">Never scanned.</p>
              )}
            </section>
          </div>
        </DialogContent>
      </DialogOverlay>
    </Dialog>
  );
};

export default TicketDetailModal;
