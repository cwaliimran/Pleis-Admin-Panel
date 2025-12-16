export type OrderStatus = 'pending' | 'sent' | 'preparing' | 'delivered' | 'waiting-payment' | 'paid' | 'canceled';

export type DeliveryType = 'table' | 'pickup' | 'togo';

export type OrderTab = 'new-orders' | 'in-progress' | 'completed';

export type SubFilter = 'all' | 'table' | 'togo' | 'preorders';

export interface MenuItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
}

export type PaymentMethod = 'credit-card' | 'debit-card' | 'apple-pay' | 'google-pay' | 'cash' | 'paypal';

export type PaymentStatus = 'pending' | 'processing' | 'completed' | 'failed' | 'refunded';

export interface PaymentInfo {
  method: PaymentMethod;
  status: PaymentStatus;
  transactionId?: string;
  cardLast4?: string;
  cardBrand?: 'visa' | 'mastercard' | 'amex' | 'discover';
  paidAt?: string;
  refundedAt?: string;
  refundAmount?: number;
  processingFee?: number;
  tip?: number;
}

export interface Order {
  id: string;
  deliveryType: DeliveryType;
  location: string;
  userName: string;
  userHandle: string;
  userEmail: string;
  items: MenuItem[];
  status: OrderStatus;
  totalCost: number;
  notes?: string;
  isVIP?: boolean;
  tierName?: string;
  isPreorder?: boolean;
  partySize?: number;
  paymentType?: 'pay-now' | 'pay-later';
  paymentInfo?: PaymentInfo;
  completedAt?: string;
  createdAt: string;
}

export interface FilterOptions {
  statuses: OrderStatus[];
  deliveryTypes: DeliveryType[];
  preorderOnly: boolean;
  vipOnly: boolean;
}

export interface ModalAction {
  type: 'accept' | 'deliver' | 'paid' | 'cancel' | 'toggle-ordering';
  order?: Order;
  customerName?: string;
  location?: string;
  newState?: boolean;
}
