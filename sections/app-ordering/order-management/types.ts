export type OrderStatus = 'pending' | 'sent' | 'preparing' | 'delivered' | 'waiting-payment' | 'paid' | 'canceled';

export type DeliveryType = 'table' | 'pickup' | 'togo';

export type OrderTab = 'active' | 'preorders' | 'past';

export interface MenuItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
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
  isPreorder?: boolean;
  paymentType?: 'pay-now' | 'pay-later';
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
