// API Types
export type ApiOrderStatus = 'pending' | 'confirmed' | 'completed' | 'cancelled' | 'preorder';

export type ApiPickupType = 'tableService' | 'togo' | 'counter' | 'preorder';

export type ApiOrderType = 'walkIn' | 'preorder' | 'online' | 'qr' | 'phone';

export type ApiPaymentMethod = 'card' | 'applePay' | 'googlePay' | 'cash';

export type ApiPaymentStatus = 'pending' | 'paid' | 'failed';

// Frontend Types
export type OrderTab = 'active' | 'preorders' | 'past';

export type ActiveOrderSubTab = 'new-order' | 'in-progress' | 'completed';

export type DeliveryFilterType = 'all' | 'counter' | 'tableService' | 'togo' | 'preorder';

export type FrontendDeliveryType = 'table' | 'togo' | 'preorder' | 'counter';

// API Response Types
export interface ApiUser {
  _id: string;
  username: string;
  firstName: string;
  lastName: string;
  email: string;
}

export interface ApiMenuItemSnapshot {
  _id: string;
  image: string;
  title: string;
  description: string;
  type: string;
  category: string;
  basePrice: number;
  discountPrice: number | null;
  taxPercent: number;
  menu: string;
  startTime: string;
  endTime: string;
  creator: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface ApiMenuItem {
  menuItem: string;
  quantity: number;
  finalPrice: number;
  menuItemSnapShot: ApiMenuItemSnapshot;
  _id: string;
  isdelivered: boolean;
}

export interface ApiOrder {
  _id: string;
  user: ApiUser;
  items: ApiMenuItem[];
  totalPrice: number;
  status: ApiOrderStatus;
  deliveryAddress?: string;
  paymentMethod: ApiPaymentMethod;
  pickupType?: ApiPickupType;
  tableNumber?: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
  paymentStatus: ApiPaymentStatus;
  transactionId?: string;
  paidAt: string | null;
  organization: string;
  notes?: string;
  orderNumber?: string;
  orderType: ApiOrderType;
}

export interface ApiOrdersResponse {
  message: string;
  data: ApiOrder[];
  meta: {
    currentPage: number;
    totalPages: number;
    totalRecords: number;
    limit: number;
    constantData: {
      activeOrdersCount: number;
      preordersCount: number;
      pastOrdersCount: number;
      activeDetails: {
        new: number;
        inProgress: number;
        completed: number;
      };
    };
    count: {
      totalFiltered: number;
      total: number;
      active: number;
      inactive: number;
    };
  };
}

// Frontend Display Types (transformed from API)
export interface MenuItem {
  id: string;
  menuItemId: string;
  name: string;
  quantity: number;
  price: number;
  isDelivered: boolean;
}

export interface Order {
  id: string;
  deliveryType: FrontendDeliveryType;
  location: string;
  userName: string;
  userEmail: string;
  items: MenuItem[];
  status: ApiOrderStatus;
  totalCost: number;
  notes?: string;
  orderType: ApiOrderType;
  paymentMethod: ApiPaymentMethod;
  paymentStatus: ApiPaymentStatus;
  transactionId?: string;
  paidAt: string | null;
  orderNumber?: string;
  createdAt: string;
  updatedAt: string;
}

export interface FilterOptions {
  statuses: ApiOrderStatus[];
  deliveryTypes: FrontendDeliveryType[];
  preorderOnly: boolean;
}

export interface ModalAction {
  type: 'accept' | 'deliver' | 'paid' | 'cancel' | 'toggle-ordering' | 'deliver-all' | 'deliver-selected';
  order?: Order;
  newState?: boolean;
  selectedItemIds?: string[];
}

// // API Types
// export type ApiOrderStatus = 'pending' | 'confirmed' | 'completed' | 'cancelled' | 'preorder';

// export type ApiPickupType = 'tableService' | 'togo' | 'counter' | 'preorder';

// export type ApiOrderType = 'walkIn' | 'preorder' | 'online' | 'qr' | 'phone';

// export type ApiPaymentMethod = 'card' | 'applePay' | 'googlePay' | 'cash';

// export type ApiPaymentStatus = 'pending' | 'paid' | 'failed';

// // Frontend Types
// export type OrderTab = 'active' | 'preorders' | 'past';

// export type ActiveOrderSubTab = 'new-order' | 'in-progress' | 'completed';

// export type DeliveryFilterType = 'all' | 'tableService' | 'togo' | 'preorder' | 'counter';

// export type FrontendDeliveryType = 'table' | 'togo' | 'preorder' | 'counter';

// // API Response Types
// export interface ApiUser {
//   _id: string;
//   username: string;
//   firstName: string;
//   userlastName: string;
//   email: string;
// }

// export interface ApiMenuItemSnapshot {
//   _id: string;
//   image: string;
//   title: string;
//   description: string;
//   type: string;
//   category: string;
//   basePrice: number;
//   discountPrice: number | null;
//   taxPercent: number;
//   menu: string;
//   startTime: string;
//   endTime: string;
//   creator: string;
//   status: string;
//   createdAt: string;
//   updatedAt: string;
//   __v: number;
// }

// export interface ApiMenuItem {
//   menuItem: string;
//   quantity: number;
//   finalPrice: number;
//   menuItemSnapShot: ApiMenuItemSnapshot;
//   _id: string;
//   isdelivered: boolean;
// }

// export interface ApiOrder {
//   _id: string;
//   user: ApiUser;
//   items: ApiMenuItem[];
//   totalPrice: number;
//   status: ApiOrderStatus;
//   deliveryAddress?: string;
//   paymentMethod: ApiPaymentMethod;
//   pickupType?: ApiPickupType;
//   tableNumber?: string;
//   createdAt: string;
//   updatedAt: string;
//   __v: number;
//   paymentStatus: ApiPaymentStatus;
//   transactionId?: string;
//   paidAt: string | null;
//   organization: string;
//   notes?: string;
//   orderNumber?: string;
//   orderType: ApiOrderType;
// }

// export interface ApiOrdersResponse {
//   message: string;
//   data: {
//     orders: ApiOrder[];
//     activeOrdersCount: number;
//     preordersCount: number;
//     pastOrdersCount: number;
//     activeDetails: {
//       new: number;
//       inProgress: number;
//       completed: number;
//     };
//   };
//   meta: {
//     currentPage: number;
//     totalPages: number;
//     totalRecords: number;
//     limit: number;
//   };
// }

// // Frontend Display Types (transformed from API)
// export interface MenuItem {
//   id: string;
//   menuItemId: string;
//   name: string;
//   quantity: number;
//   price: number;
//   isDelivered: boolean;
// }

// export interface Order {
//   id: string;
//   deliveryType: FrontendDeliveryType;
//   location: string;
//   userName: string;
//   userEmail: string;
//   items: MenuItem[];
//   status: ApiOrderStatus;
//   totalCost: number;
//   notes?: string;
//   orderType: ApiOrderType;
//   paymentMethod: ApiPaymentMethod;
//   paymentStatus: ApiPaymentStatus;
//   transactionId?: string;
//   paidAt: string | null;
//   orderNumber?: string;
//   createdAt: string;
//   updatedAt: string;
// }

// export interface FilterOptions {
//   statuses: ApiOrderStatus[];
//   deliveryTypes: FrontendDeliveryType[];
//   preorderOnly: boolean;
// }

// export interface ModalAction {
//   type: 'accept' | 'deliver' | 'paid' | 'cancel' | 'toggle-ordering' | 'deliver-all' | 'deliver-selected';
//   order?: Order;
//   newState?: boolean;
//   selectedItemIds?: string[];
// }
