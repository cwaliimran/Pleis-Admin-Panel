'use client';

import { fDate } from '@/utils/format-time';
import { Calendar, CreditCard, MapPin, Receipt, Tag, Ticket } from 'lucide-react';
import { FC } from 'react';
import { InfoRow, PaymentStatusBadge, PriceBreakdown, Section } from './shared-components';
import { TicketingBookingOrderData } from './types';

const TicketingBookingsDetail: FC<{ orderData: TicketingBookingOrderData }> = ({ orderData }) => {
  if (!orderData) return null;

  const event = orderData.event;
  const pricing = orderData.orderPricing;
  const payment = orderData.paymentDetails;

  const priceItems = [
    { label: 'Subtotal', value: pricing?.subtotal || 0 },
    ...(pricing?.taxAmount ? [{ label: 'Tax', value: pricing.taxAmount }] : []),
    ...(pricing?.discount ? [{ label: 'Discount', value: pricing.discount, isDiscount: true }] : []),
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
              {event.basicInfo?.description && (
                <p className="mt-0.5 line-clamp-2 text-xs text-gray-500 dark:text-gray-400">{event.basicInfo.description}</p>
              )}
              {event.basicInfo?.venueLocation?.fullAddress && (
                <p className="mt-1 flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                  <MapPin className="h-3 w-3 shrink-0" />
                  {event.basicInfo.venueLocation.fullAddress}
                </p>
              )}
            </div>
            <div className="space-y-0.5">
              <InfoRow label="Start" value={event.schedule?.startDateTime ? fDate(event.schedule.startDateTime, 'DD/MM/YYYY HH:mm') : undefined} />
              <InfoRow label="End" value={event.schedule?.endDateTime ? fDate(event.schedule.endDateTime, 'DD/MM/YYYY HH:mm') : undefined} />
              <InfoRow label="Event Status" value={<span className="capitalize">{event.status}</span>} />
            </div>
          </div>
        </Section>
      )}

      {/* Booking Info */}
      <Section title="Booking Details" icon={<Ticket className="h-4 w-4 text-gray-500" />}>
        <div className="space-y-0.5">
          <InfoRow label="Purpose" value={<span className="capitalize">{orderData.purpose?.replace(/([A-Z])/g, ' $1')}</span>} />
          <InfoRow label="Tickets Purchased" value={orderData.ticketsPurchased} />
          <InfoRow label="Order Status" value={<span className="capitalize">{orderData.status}</span>} />
          <InfoRow label="Created" value={orderData.createdAt ? fDate(orderData.createdAt, 'DD/MM/YYYY HH:mm') : undefined} />
        </div>
      </Section>

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
        {pricing?.promoCode && (
          <div className="mt-2 flex items-center gap-1.5 rounded-md bg-blue-50 px-2 py-1 dark:bg-blue-900/20">
            <Tag className="h-3 w-3 text-blue-500" />
            <span className="text-xs font-medium text-blue-600 dark:text-blue-400">Promo: {pricing.promoCode}</span>
          </div>
        )}
      </Section>
    </div>
  );
};

export default TicketingBookingsDetail;
