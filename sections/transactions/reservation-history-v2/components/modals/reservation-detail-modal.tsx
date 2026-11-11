'use client';

import { Dialog, DialogContent, DialogHeader, DialogOverlay, DialogTitle } from '@/components/ui/dialog';
import { FC } from 'react';
import { formatEuro } from '../../forms/format';
import { Reservation } from '../../types/types';
import { InfoLine, SectionHeading } from '../table/detail-parts';

interface ReservationDetailModalProps {
  open: boolean;
  onClose: () => void;
  reservation: Reservation | null;
}

const ReservationDetailModal: FC<ReservationDetailModalProps> = ({ open, onClose, reservation }) => {
  if (!reservation) return null;

  const { reservation: reservationInfo, voucherNote, staff, settlement } = reservation.detail;
  const slotTime = reservation.slotNote.split(' · ')[0];

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogOverlay className="bg-opacity-30 fixed inset-0">
        <DialogContent aria-describedby={undefined} className="dark:bg-secondary mx-auto flex max-h-[90vh] w-full flex-col overflow-hidden md:max-w-175!">
          <DialogHeader className="shrink-0 border-b pb-3 dark:border-gray-700">
            <DialogTitle>Reservation {reservation.reservationId}</DialogTitle>
            <p className="text-muted-foreground text-sm">
              {reservation.guestName} · {slotTime} · {reservation.organization}
            </p>
          </DialogHeader>

          <div className="flex-1 space-y-6 overflow-y-auto px-1 py-4">
            <section>
              <SectionHeading title="Reservation" />
              <InfoLine label="Action / status" value={`${reservation.action} · ${reservation.status}`} />
              <InfoLine label="Type" value={reservationInfo.typeLabel} />
              <InfoLine label="Condition" value={reservationInfo.condition === 'free' ? 'free' : 'minimum_spend'} />
              <InfoLine label="Guests" value={reservationInfo.guests} />
              <InfoLine label="Table" value={reservationInfo.table} />
              <InfoLine label="Occasion" value={reservationInfo.occasion} />
              <InfoLine label="Contact" value={reservationInfo.contact} />
            </section>

            <section>
              <SectionHeading title="Voucher · the only voucher in the product" />
              {reservation.voucher ? (
                <>
                  <InfoLine label="Voucher code" value={reservation.voucher.code} />
                  <InfoLine label="Status" value={reservation.voucher.status} />
                  <InfoLine label="Prepaid amount" value={formatEuro(reservation.voucher.prepaidAmount)} />
                  <InfoLine label="Balance" value={formatEuro(reservation.voucher.balance)} />
                  <InfoLine label="Validity" value={reservation.voucher.validUntil} />
                </>
              ) : (
                <p className="text-muted-foreground text-sm">{voucherNote}</p>
              )}
            </section>

            <section>
              <SectionHeading title="Staff & access" />
              <InfoLine label="Staff" value={staff.label} />
              <InfoLine label="Via" value={staff.via || '—'} />
            </section>

            <section>
              <SectionHeading title="Settlement & documents" />
              <InfoLine label="Settlement" value={settlement.status || 'No transaction'} />
              <p className="text-muted-foreground mt-1 text-sm">{settlement.note}</p>
            </section>
          </div>
        </DialogContent>
      </DialogOverlay>
    </Dialog>
  );
};

export default ReservationDetailModal;
