'use client';

import { fDate } from '@/utils/format-time';
import { ArrowRight, Calendar, CreditCard, MapPin, Receipt, Repeat2, Shield, Ticket, Zap } from 'lucide-react';
import { FC } from 'react';
import { InfoRow, PaymentStatusBadge, PriceBreakdown, Section } from './shared-components';
import { TicketTransferBooking } from './types';

const TicketTransferDetail: FC<{ orderData: TicketTransferBooking[] }> = ({ orderData }) => {
  if (!orderData?.length) return null;

  // Ticket transfer orderData is an array; typically one booking
  return (
    <div className="space-y-3">
      {orderData.map((booking) => (
        <TicketTransferBookingCard key={booking._id} booking={booking} />
      ))}
    </div>
  );
};

// ─── Single Booking Card ────────────────────────────────────────

const TicketTransferBookingCard: FC<{ booking: TicketTransferBooking }> = ({ booking }) => {
  const event = booking.order?.event;
  const ticket = booking.ticket?.ticketId;
  const pricing = booking.order?.orderPricing;
  const payment = booking.order?.paymentDetails;
  const protection = booking.ticket?.protectionUserDetails;

  const priceItems = [
    { label: 'Subtotal', value: pricing?.subtotal || 0 },
    ...(pricing?.taxAmount ? [{ label: 'Tax', value: pricing.taxAmount }] : []),
    { label: 'Total', value: pricing?.total || 0, isBold: true },
  ];

  return (
    <div className="space-y-3">
      {/* Event Info */}
      {event && (
        <Section title="Event" icon={<Calendar className="h-4 w-4 text-gray-500" />}>
          <div className="space-y-2">
            {event.basicInfo?.media?.name && (
              <img
                src={event.basicInfo.media.name}
                alt={event.basicInfo.title}
                className="h-28 w-full rounded-lg border object-cover dark:border-gray-700"
              />
            )}
            <div>
              <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">{event.basicInfo?.title}</p>
              {event.basicInfo?.venueLocation?.fullAddress && (
                <p className="mt-0.5 flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                  <MapPin className="h-3 w-3" />
                  {event.basicInfo.venueLocation.fullAddress}
                </p>
              )}
            </div>
            <div className="space-y-0.5">
              <InfoRow label="Start" value={event.schedule?.startDateTime ? fDate(event.schedule.startDateTime, 'DD/MM/YYYY HH:mm') : undefined} />
              <InfoRow label="End" value={event.schedule?.endDateTime ? fDate(event.schedule.endDateTime, 'DD/MM/YYYY HH:mm') : undefined} />
            </div>
          </div>
        </Section>
      )}

      {/* Ticket Info */}
      {ticket && (
        <Section title="Ticket" icon={<Ticket className="h-4 w-4 text-gray-500" />}>
          <div className="space-y-0.5">
            <InfoRow label="Ticket Title" value={ticket.title} />
            <InfoRow label="Booking ID" value={booking.ticketBookingId} />
            <InfoRow label="Status" value={<span className="capitalize">{booking.status}</span>} />
            <InfoRow label="Pricing Phase" value={<span className="capitalize">{booking.pricingPhase}</span>} />
            <InfoRow label="Price" value={`€${ticket.price?.toFixed(2)}`} />
            <InfoRow label="Tax" value={`${ticket.taxPercentage}%`} />
            <InfoRow label="Transfer Fee" value={`€${ticket.transferFee?.toFixed(2)}`} />

            {booking.isFastTrack && ticket.fastTrackEntry?.enabled && (
              <InfoRow
                label="Fast Track"
                value={
                  <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-medium text-amber-700 dark:bg-amber-900/30 dark:text-amber-300">
                    <Zap className="h-3 w-3" /> +€{ticket.fastTrackEntry.extraPrice}
                  </span>
                }
              />
            )}
          </div>
        </Section>
      )}

      {/* Protection / User Details */}
      {protection && (
        <Section title="Protection Details" icon={<Shield className="h-4 w-4 text-gray-500" />}>
          <div className="space-y-0.5">
            <InfoRow label="Resale Protection" value={<span className="capitalize">{ticket?.resaleProtection?.replace(/([A-Z])/g, ' $1')}</span>} />
            <InfoRow
              label="Name"
              value={
                <span className="capitalize">
                  {protection.firstName} {protection.surName}
                </span>
              }
            />
            <InfoRow label="Date of Birth" value={protection.dob ? fDate(protection.dob, 'DD/MM/YYYY') : undefined} />
            <InfoRow label="PID" value={protection.pid} />
          </div>
        </Section>
      )}

      {/* Transfer History */}
      {booking.transferHistory?.length > 0 && (
        <Section title="Transfer History" icon={<Repeat2 className="h-4 w-4 text-gray-500" />}>
          <div className="space-y-2">
            {booking.transferHistory.map((transfer) => (
              <div
                key={transfer._id}
                className="flex items-center gap-2 rounded-md border border-gray-100 bg-gray-50/50 p-2.5 dark:border-gray-700 dark:bg-gray-800/50"
              >
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-medium text-gray-900 dark:text-gray-100">
                    {transfer.fromUser?.firstName} {transfer.fromUser?.lastName}
                    {transfer.fromUser?.username ? ` (@${transfer.fromUser.username})` : ''}
                  </p>
                </div>
                <ArrowRight className="h-4 w-4 shrink-0 text-gray-400" />
                <div className="min-w-0 flex-1 text-right">
                  {transfer.toUser ? (
                    <p className="text-xs font-medium text-gray-900 dark:text-gray-100">
                      {transfer.toUser.firstName} {transfer.toUser.lastName}
                      {transfer.toUser.username ? ` (@${transfer.toUser.username})` : ''}
                    </p>
                  ) : (
                    <p className="text-xs text-gray-400 italic">Pending</p>
                  )}
                </div>
              </div>
            ))}
            <p className="text-[10px] text-gray-400">
              Last transfer: {fDate(booking.transferHistory[booking.transferHistory.length - 1]?.transferDate, 'DD/MM/YYYY HH:mm')}
            </p>
          </div>
        </Section>
      )}

      {/* Payment */}
      <Section title="Payment" icon={<CreditCard className="h-4 w-4 text-gray-500" />}>
        <div className="space-y-0.5">
          <InfoRow label="Transaction ID" value={payment?.transactionId} />
          <InfoRow label="Method" value={<span className="capitalize">{payment?.paymentMethod}</span>} />
          <InfoRow label="Status" value={<PaymentStatusBadge status={payment?.paymentStatus || ''} />} />
        </div>
      </Section>

      {/* Price Breakdown */}
      <Section title="Price Breakdown" icon={<Receipt className="h-4 w-4 text-gray-500" />}>
        <PriceBreakdown items={priceItems} currency={pricing?.currency || '€'} />
      </Section>
    </div>
  );
};

export default TicketTransferDetail;
