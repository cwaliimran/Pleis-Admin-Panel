'use client';

import { Dialog, DialogContent, DialogHeader, DialogOverlay, DialogTitle } from '@/components/ui/dialog';
import { showSuccess } from '@/utils/toast';
import { FC } from 'react';
import { formatEuro, formatPercent } from '../../forms/format';
import { Ticket } from '../../types/types';
import { DocumentCard, InfoLine, SectionHeading } from '../table/detail-parts';

interface TicketDetailModalProps {
  open: boolean;
  onClose: () => void;
  ticket: Ticket | null;
}

const getChainId = (ticketId: string): string => ticketId.replace('TCK-', 'C-');

const TicketDetailModal: FC<TicketDetailModalProps> = ({ open, onClose, ticket }) => {
  if (!ticket) return null;

  const { ticket: ticketInfo, parties, moneySplit, settlement, documents } = ticket.detail;
  const eventTime = ticket.eventScheduleNote.split(' · ')[0];

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogOverlay className="bg-opacity-30 fixed inset-0">
        <DialogContent aria-describedby={undefined} className="dark:bg-secondary mx-auto flex max-h-[90vh] w-full flex-col overflow-hidden md:max-w-175!">
          <DialogHeader className="shrink-0 border-b pb-3 dark:border-gray-700">
            <DialogTitle>Ticket {ticket.ticketId}</DialogTitle>
            <p className="text-muted-foreground text-sm">
              {ticket.eventName} · {eventTime}
            </p>
          </DialogHeader>

          <div className="flex-1 space-y-6 overflow-y-auto px-1 py-4">
            <section>
              <SectionHeading title="Ticket" />
              <InfoLine label="Type" value={ticketInfo.type} />
              <InfoLine label="Action / status" value={`${ticket.action} · ${ticket.status}`} />
              <InfoLine label="Source" value={ticket.source} />
              <InfoLine label="Chain" value={`${getChainId(ticket.ticketId)} · ${ticket.isLatestState ? 'latest state' : 'superseded'}`} />
              <InfoLine label="Repeatable" value={ticketInfo.repeatable ? 'Yes' : 'No'} />
              <InfoLine label="Resale protection" value={ticketInfo.resaleProtection} />
              <InfoLine label="Billko item code" value={ticket.billkoItemCode} />
              {ticketInfo.fastTrack && <InfoLine label="Fast track" value="Yes" />}
              {ticketInfo.usageNote && <InfoLine label="Usage" value={ticketInfo.usageNote} />}
            </section>

            <section>
              <SectionHeading title="Ownership" />
              <InfoLine label="Current owner" value={parties.currentOwner.name} />
              <InfoLine label="Original buyer" value={parties.originalBuyer.name} />
              <InfoLine label="Ownership changed" value={ticket.ownershipChanged ? 'Yes' : 'No'} />
            </section>

            <section>
              <SectionHeading title="Money" />
              <InfoLine label="Price paid" value={formatEuro(moneySplit.pricePaid)} />
              <InfoLine label="Base price" value={formatEuro(moneySplit.basePrice)} />
              {moneySplit.transferFee !== undefined && <InfoLine label="Transfer fee" value={formatEuro(moneySplit.transferFee)} />}
              {moneySplit.fastTrackFee !== undefined && <InfoLine label="Fast track fee" value={formatEuro(moneySplit.fastTrackFee)} />}
              {moneySplit.serviceFee !== undefined && <InfoLine label="Service fee" value={formatEuro(moneySplit.serviceFee)} />}
              {moneySplit.taxRate !== undefined && <InfoLine label="Tax" value={`${moneySplit.taxRate}% · ${moneySplit.taxLabel}`} />}
              {moneySplit.commissionRate !== undefined && <InfoLine label="Commission rate" value={formatPercent(moneySplit.commissionRate)} />}
            </section>

            <section>
              <SectionHeading title="Scans" />
              <InfoLine label="Scan count" value={ticket.scanCount} />
              <InfoLine label="Last scan" value={ticket.scanNote || 'Never scanned'} />
            </section>

            <section>
              <SectionHeading title="Settlement & documents" />
              <InfoLine label="Settlement" value={settlement.status || '—'} />
              <InfoLine label="Transaction" value={ticket.linkedTransactionId} />

              {documents.length > 0 && (
                <div className="mt-3 space-y-2">
                  {documents.map((document, idx) => (
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
          </div>
        </DialogContent>
      </DialogOverlay>
    </Dialog>
  );
};

export default TicketDetailModal;
