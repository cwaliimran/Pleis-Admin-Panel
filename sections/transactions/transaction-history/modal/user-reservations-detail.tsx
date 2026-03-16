'use client';

import { fDate } from '@/utils/format-time';
import { CalendarCheck, Clock, CreditCard, Gift, Phone, Receipt, Tag, Users } from 'lucide-react';
import { FC } from 'react';
import { InfoRow, PaymentStatusBadge, PriceBreakdown, Section } from './shared-components';
import { ReservationOrderData } from './types';

const UserReservationsDetail: FC<{ orderData: ReservationOrderData }> = ({ orderData }) => {
  if (!orderData) return null;

  const snapshot = orderData.reservationSnapshot;
  const breakdown = orderData.priceBreakDown;

  const priceItems = [
    { label: 'Reservation Amount', value: breakdown?.reservationAmount || 0 },
    ...(breakdown?.reservationTax ? [{ label: 'Tax', value: breakdown.reservationTax }] : []),
    ...(breakdown?.promoDiscount ? [{ label: 'Promo Discount', value: breakdown.promoDiscount, isDiscount: true }] : []),
    { label: 'Total', value: breakdown?.reservationFinalAmount || 0, isBold: true },
  ];

  // Extract time slots
  const dateTimeSlots = orderData.timingSlots?.dateTimeSlots || [];

  return (
    <div className="space-y-3">
      {/* Reservation Info */}
      <Section title="Reservation Details" icon={<CalendarCheck className="h-4 w-4 text-gray-500" />}>
        <div className="space-y-0.5">
          <InfoRow label="Booking ID" value={orderData.bookingId} />
          <InfoRow label="Status" value={<span className="capitalize">{orderData.status}</span>} />
          <InfoRow label="Reservation Type" value={snapshot?.reservationType} />
          <InfoRow label="Condition" value={<span className="capitalize">{snapshot?.conditionType}</span>} />
          {snapshot?.needsConfirmation && (
            <InfoRow
              label="Confirmation"
              value={
                <span className="inline-flex items-center rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-medium text-amber-700 dark:bg-amber-900/30 dark:text-amber-300">
                  Required
                </span>
              }
            />
          )}
        </div>
      </Section>

      {/* Guest Info */}
      <Section title="Guest Information" icon={<Users className="h-4 w-4 text-gray-500" />}>
        <div className="space-y-0.5">
          <InfoRow
            label="Guest Name"
            value={
              <span className="capitalize">
                {orderData.firstName} {orderData.lastName}
              </span>
            }
          />
          <InfoRow label="Party Size" value={`${orderData.partySize} ${orderData.partySize > 1 ? 'guests' : 'guest'}`} />
          {orderData.phoneNumber?.number && (
            <InfoRow
              label="Phone"
              value={
                <span className="flex items-center gap-1">
                  <Phone className="h-3 w-3" />
                  {orderData.phoneNumber.code} {orderData.phoneNumber.number}
                </span>
              }
            />
          )}
          {orderData.notes && <InfoRow label="Notes" value={orderData.notes} />}
        </div>
      </Section>

      {/* Time Slots */}
      {dateTimeSlots.length > 0 && (
        <Section title="Date & Time" icon={<Clock className="h-4 w-4 text-gray-500" />}>
          <div className="space-y-2">
            {dateTimeSlots.map((slot: any, idx: number) => (
              <div key={slot._id || idx} className="rounded-md border border-gray-100 bg-gray-50/50 p-2.5 dark:border-gray-700 dark:bg-gray-800/50">
                <p className="mb-1.5 text-xs font-medium text-gray-900 dark:text-gray-100">{fDate(slot.date, 'DD MMMM YYYY')}</p>
                {slot.timeSlots?.map((ts: any) => (
                  <div key={ts._id} className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-300">
                    <Clock className="h-3 w-3" />
                    {fDate(ts.startTime, 'HH:mm')} – {fDate(ts.endTime, 'HH:mm')}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </Section>
      )}

      {/* Capacity & Bonus */}
      {(snapshot?.availableReservations || snapshot?.maxCapacityPerReservation || snapshot?.bonusPoints) && (
        <Section title="Reservation Capacity" icon={<Gift className="h-4 w-4 text-gray-500" />}>
          <div className="space-y-0.5">
            {snapshot?.availableReservations && <InfoRow label="Available Slots" value={snapshot.availableReservations} />}
            {snapshot?.maxCapacityPerReservation && <InfoRow label="Max per Reservation" value={`${snapshot.maxCapacityPerReservation} guests`} />}
            {snapshot?.bonusPoints ? (
              <InfoRow
                label="Bonus Points"
                value={
                  <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-2 py-0.5 text-[10px] font-medium text-green-700 dark:bg-green-900/30 dark:text-green-300">
                    <Gift className="h-3 w-3" /> +{snapshot.bonusPoints} pts
                  </span>
                }
              />
            ) : null}
          </div>
        </Section>
      )}

      {/* Payment Info */}
      <Section title="Payment" icon={<CreditCard className="h-4 w-4 text-gray-500" />}>
        <div className="space-y-0.5">
          <InfoRow label="Transaction ID" value={orderData.paymentDetails?.transactionId} />
          <InfoRow label="Payment Status" value={<PaymentStatusBadge status={orderData.paymentDetails?.paymentStatus} />} />
          <InfoRow label="Paid At" value={orderData.paidAt ? fDate(orderData.paidAt, 'DD/MM/YYYY HH:mm') : undefined} />
        </div>
      </Section>

      {/* Price Breakdown */}
      <Section title="Price Breakdown" icon={<Receipt className="h-4 w-4 text-gray-500" />}>
        <PriceBreakdown items={priceItems} />
        {breakdown?.promoCode && (
          <div className="mt-2 flex items-center gap-1.5 rounded-md bg-blue-50 px-2 py-1 dark:bg-blue-900/20">
            <Tag className="h-3 w-3 text-blue-500" />
            <span className="text-xs font-medium text-blue-600 dark:text-blue-400">Promo: {breakdown.promoCode}</span>
          </div>
        )}
      </Section>
    </div>
  );
};

export default UserReservationsDetail;
