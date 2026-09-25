'use client';

import { Dialog, DialogContent, DialogHeader, DialogOverlay, DialogTitle } from '@/components/ui/dialog';
import { showSuccess } from '@/utils/toast';
import { FC } from 'react';
import { formatEuro } from '../../forms/format';
import { Order } from '../../types/types';
import { DocumentCard, InfoLine, SectionHeading } from '../table/detail-parts';

interface OrderDetailModalProps {
  open: boolean;
  onClose: () => void;
  order: Order | null;
}

const OrderDetailModal: FC<OrderDetailModalProps> = ({ open, onClose, order }) => {
  if (!order) return null;

  const { order: orderInfo, money, settlement, documents } = order.detail;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogOverlay className="bg-opacity-30 fixed inset-0">
        <DialogContent aria-describedby={undefined} className="dark:bg-secondary mx-auto flex max-h-[90vh] w-full flex-col overflow-hidden md:max-w-175!">
          <DialogHeader className="shrink-0 border-b pb-3 dark:border-gray-700">
            <DialogTitle>Order {order.orderReference}</DialogTitle>
            <p className="text-muted-foreground text-sm">
              {order.organization} · {order.locationLabel} · {order.createdAt}
            </p>
          </DialogHeader>

          <div className="flex-1 space-y-6 overflow-y-auto px-1 py-4">
            <section>
              <SectionHeading title="Order" />
              <InfoLine label="Status" value={order.status} />
              <InfoLine label="Round" value={order.roundLabel} />
              <InfoLine label="Payment type" value={order.paymentType} />
              <InfoLine label="Delivery" value={`${order.deliveryMethod} · ${order.locationLabel}`} />
              <InfoLine label="Items" value={order.itemCount} />
              <InfoLine label="Note" value={orderInfo.note} />
            </section>

            <section>
              <SectionHeading title="Money · this round" />
              <InfoLine label="Order total" value={formatEuro(money.orderTotal)} />
              <InfoLine label="Subtotal" value={formatEuro(money.subtotal)} />
              <InfoLine label="Tip · separate 0% Tg1 line" value={money.tipNote} />
              <InfoLine label="Voucher applied" value={money.voucherNote} />
              <InfoLine label="Transaction gross" value={money.transactionGrossNote} />
            </section>

            <section>
              <SectionHeading title="Staff" />
              <InfoLine label="Handled by" value={order.handledBy || '—'} />
            </section>

            <section>
              <SectionHeading title="Settlement & documents" />
              <InfoLine label="Track" value={settlement.track} />
              <InfoLine label="Settlement" value={settlement.settlementNote} />
              <InfoLine label="Fiscalization" value={settlement.fiscalizationNote} />

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

export default OrderDetailModal;
