export type OrderStatus = 'sent' | 'preparing' | 'delivered' | 'waiting-payment' | 'paid' | 'canceled';

export interface OrderItem {
  quantity: number;
  name: string;
  price: number;
}

export interface Order {
  id: string;
  deliveryIcon: string;
  deliveryLabel: string;
  customerName: string;
  summary: string; // "3 items • $42.50"
  status: OrderStatus;
  isVip?: boolean;
  isPreorder?: boolean;
  contact: {
    handle: string;
    email: string;
  };
  items: OrderItem[];
  notes?: string;
  total: number;
  paymentType?: string;
}

export type TabId = 'active' | 'preorders' | 'past';
