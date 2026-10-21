export type OrderStatus = 'sent' | 'preparing' | 'delivered' | 'awaiting_payment' | 'paid' | 'rejected' | 'cancelled';

export type PaymentType = 'pay_now' | 'pay_later' | 'cash_at_venue';

export type DeliveryMethod = 'counter_pickup' | 'table_delivery' | 'to_go';

export type CancelReason = 'item_out_of_stock' | 'venue_busy_or_closing' | 'customer_request' | 'customer_not_found_at_table' | 'other';

export type RoundType = 'first' | 'later';

export type SettlementStatus = 'PENDING' | 'HELD' | 'SETTLED' | 'EXCLUDED' | null;

export type FiscalizationStatus = 'NOT_FISCALIZED' | 'FISCALIZED' | 'FISCALIZATION_FAILED' | null;

export interface OrderDocument {
  code: 'INV' | 'CONF' | 'STORNO';
  label: string;
  subtitle: string;
}

export interface OrderDetail {
  order: {
    note?: string;
  };
  money: {
    orderTotal: number;
    subtotal: number;
    tipNote: string;
    voucherNote: string;
    transactionGrossNote: string;
  };
  settlement: {
    track: string;
    settlementNote: string;
    fiscalizationNote: string;
  };
  documents: OrderDocument[];
}

export interface Order {
  id: string;
  orderReference: string;
  transactionRef: string;
  company: string;
  organization: string;
  venue: string;
  locationLabel: string;
  deliveryMethod: DeliveryMethod;
  roundLabel: string;
  roundType: RoundType;
  hasLaterRounds: boolean;
  itemCount: number;
  itemsNote?: string;
  voucherCode?: string;
  paymentType: PaymentType;
  total: number;
  totalNote?: string;
  tipAmount?: number;
  voucherDiscount?: number;
  status: OrderStatus;
  cancelReason?: CancelReason;
  customerNotified?: boolean;
  handledBy?: string;
  handledVia?: string;
  settlementTrack: 'payout' | 'offapp';
  settlementStatus: SettlementStatus;
  fiscalizationStatus: FiscalizationStatus;
  hasGuestNote: boolean;
  loyaltyPointsAwarded: boolean;
  linkedReservation: boolean;
  createdAt: string;
  detail: OrderDetail;
}
