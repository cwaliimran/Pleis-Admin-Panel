// API Response Types
export interface ApiCategory {
  _id: string;
  title: string;
}

export interface ApiEvent {
  _id: string;
  basicInfo: {
    title: string;
  };
}

export interface ApiMenuItem {
  _id: string;
  image: string;
  title: string;
  description: string;
  category: ApiCategory;
  basePrice: number;
  discountPrice: number;
  taxPercent: number;
  startTime: string;
  endTime: string;
  isLimitedTimeOffer: boolean;
  isScheduled: boolean;
  startDate: string | null;
  endDate: string | null;
  event: ApiEvent | null;
  availabilityType: string | null;
  upSellItem: boolean;
  isAvailableInStock: boolean;
  createdAt: string;
}

export interface ApiMenuResponse {
  message: string;
  data: ApiMenuItem[];
  meta: {
    totalMenuItems: number;
    inStock: number;
    outOfStock: number;
    limitedTimeItems: number;
    upSellItems: number;
    scheduledItems: number;
    count: {
      currentPage: number;
      totalPages: number;
      totalRecords: number;
      limit: number;
    };
  };
}

// Sale API Types
export interface ApiSaleMenuItem {
  _id: string;
  title: string;
  image: string;
  description: string;
  basePrice: number;
  discountPrice: number | null;
  taxPercent: number;
  availabilityType: string | null;
  isLimitedTimeOffer: boolean;
  upSellItem: boolean;
  isAvailableInStock: boolean;
  isScheduled: boolean;
  createdAt: string;
  menu: {
    _id: string;
    title: string;
    organization: string;
  };
  category: ApiCategory;
}

export interface ApiSaleItem {
  _id: string;
  title: string;
  totalPriceBeforeDiscount: number;
  totalPrice: number;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  startDateTime: string;
  endDateTime: string;
  status: 'active' | 'inactive';
  createdAt: string;
  menuItems: ApiSaleMenuItem[];
}

export interface ApiSaleResponse {
  message: string;
  data: ApiSaleItem[];
  meta: {
    currentPage: number;
    totalPages: number;
    totalRecords: number;
    limit: number;
  };
}

// Frontend Sale Item
export interface SaleItem {
  id: string;
  title: string;
  totalPriceBeforeDiscount: number;
  totalPrice: number;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  startDateTime: Date;
  endDateTime: Date;
  status: 'active' | 'inactive';
  createdAt: string;
  menuItems: {
    id: string;
    title: string;
    image: string;
    basePrice: number;
    isAvailableInStock: boolean;
  }[];
  itemCount: number;
}

// Frontend Types
export type MenuCategory = string;

export type MenuTab = 'all' | 'sale' | 'limited' | 'upsells' | 'out-of-stock' | 'schedule-sale';

export type MenuFilter = 'all' | 'limited' | 'upsell' | 'outOfStock' | 'schedule';

export type SortBy = 'name' | 'priceLowToHigh' | 'priceHighToLow' | 'recentlyAdded';

export type AvailabilityType = 'preorder-only' | 'preorder-and-event' | 'preorder-unlock' | 'preOrdersOnly' | 'preOrdersEvent';

export type DiscountType = 'percentage' | 'fixed';

export interface MenuItem {
  id: string;
  name: string;
  category: string;
  categoryId: string;
  price: number;
  discountPrice: number;
  description?: string;
  imageUrl?: string;
  isInStock: boolean;
  isUpsell: boolean;
  isLimitedTime: boolean;
  isScheduled: boolean;
  isPreorder: boolean;
  soldCount: number;
  limitedTimeEnd?: Date;
  availabilityType?: AvailabilityType | null;
  taxPercent: number;
  startTime?: string;
  endTime?: string;
  startDate?: string | null;
  endDate?: string | null;
  event?: {
    id: string;
    title: string;
  } | null;
  createdAt: string;
  // Sale-related fields
  isOnSale?: boolean;
  salePrice?: number;
  saleStartDate?: Date;
  saleEndDate?: Date;
  discountType?: DiscountType;
  discountValue?: number;
}

export interface MenuStats {
  totalItems: number;
  inStock: number;
  outOfStock: number;
  limitedTimeItems: number;
  upsellItems: number;
  scheduledItems: number;
}

export interface LimitedTimeFormData {
  name: string;
  category: MenuCategory;
  price: number;
  description: string;
  imageUrl?: string;
  startDate: string;
  startTime: string;
  endDate: string;
  endTime: string;
  availabilityType: AvailabilityType;
  isUpsell: boolean;
}

export interface MenuItemFormData {
  name: string;
  category: MenuCategory;
  price: number;
  description: string;
  imageUrl?: string;
  isUpsell: boolean;
}

export interface BulkSaleFormData {
  saleName: string;
  discountType: DiscountType;
  discountValue: number;
  startDate: string;
  startTime: string;
  endDate: string;
  endTime: string;
  selectedItems: string[];
}

export interface ModalAction {
  type: 'add' | 'edit' | 'limited-time' | 'bulk-sale';
  item?: MenuItem;
}

export interface DescModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export interface MenuItemCardProps {
  item: MenuItem;
  onEdit: (item: MenuItem) => void;
  onToggleStock: (item: MenuItem) => void;
  onToggleUpsell: (item: MenuItem) => void;
  isUpdating?: boolean;
}

export interface CategoryOption {
  label: string;
  value: string;
}

// // API Response Types
// export interface ApiCategory {
//   _id: string;
//   title: string;
// }

// export interface ApiEvent {
//   _id: string;
//   basicInfo: {
//     title: string;
//   };
// }

// export interface ApiMenuItem {
//   _id: string;
//   image: string;
//   title: string;
//   description: string;
//   category: ApiCategory;
//   basePrice: number;
//   discountPrice: number;
//   taxPercent: number;
//   startTime: string;
//   endTime: string;
//   isLimitedTimeOffer: boolean;
//   isScheduled: boolean;
//   startDate: string | null;
//   endDate: string | null;
//   event: ApiEvent | null;
//   availabilityType: string | null;
//   upSellItem: boolean;
//   isAvailableInStock: boolean;
//   createdAt: string;
// }

// export interface ApiMenuResponse {
//   message: string;
//   data: ApiMenuItem[];
//   meta: {
//     totalMenuItems: number;
//     inStock: number;
//     outOfStock: number;
//     limitedTimeItems: number;
//     upSellItems: number;
//     scheduledItems: number;
//     count: {
//       currentPage: number;
//       totalPages: number;
//       totalRecords: number;
//       limit: number;
//     };
//   };
// }

// // Frontend Types
// export type MenuCategory = string;

// export type MenuTab = 'all' | 'limited' | 'upsells' | 'out-of-stock' | 'schedule-sale';

// export type MenuFilter = 'all' | 'limited' | 'upsell' | 'outOfStock' | 'schedule';

// export type SortBy = 'name' | 'priceLowToHigh' | 'priceHighToLow' | 'recentlyAdded';

// export type AvailabilityType = 'preorder-only' | 'preorder-and-event' | 'preorder-unlock' | 'preOrdersOnly' | 'preOrdersEvent';

// export type DiscountType = 'percentage' | 'fixed';

// export interface MenuItem {
//   id: string;
//   name: string;
//   category: string;
//   categoryId: string;
//   price: number;
//   discountPrice: number;
//   description?: string;
//   imageUrl?: string;
//   isInStock: boolean;
//   isUpsell: boolean;
//   isLimitedTime: boolean;
//   isScheduled: boolean;
//   isPreorder: boolean;
//   soldCount: number;
//   limitedTimeEnd?: Date;
//   availabilityType?: AvailabilityType | null;
//   taxPercent: number;
//   startTime?: string;
//   endTime?: string;
//   startDate?: string | null;
//   endDate?: string | null;
//   event?: {
//     id: string;
//     title: string;
//   } | null;
//   createdAt: string;
//   // Sale-related fields
//   isOnSale?: boolean;
//   salePrice?: number;
//   saleStartDate?: Date;
//   saleEndDate?: Date;
//   discountType?: DiscountType;
//   discountValue?: number;
// }

// export interface MenuStats {
//   totalItems: number;
//   inStock: number;
//   outOfStock: number;
//   limitedTimeItems: number;
//   upsellItems: number;
//   scheduledItems: number;
// }

// export interface LimitedTimeFormData {
//   name: string;
//   category: MenuCategory;
//   price: number;
//   description: string;
//   imageUrl?: string;
//   startDate: string;
//   startTime: string;
//   endDate: string;
//   endTime: string;
//   availabilityType: AvailabilityType;
//   isUpsell: boolean;
// }

// export interface MenuItemFormData {
//   name: string;
//   category: MenuCategory;
//   price: number;
//   description: string;
//   imageUrl?: string;
//   isUpsell: boolean;
// }

// export interface BulkSaleFormData {
//   saleName: string;
//   discountType: DiscountType;
//   discountValue: number;
//   startDate: string;
//   startTime: string;
//   endDate: string;
//   endTime: string;
//   selectedItems: string[];
// }

// export interface ModalAction {
//   type: 'add' | 'edit' | 'limited-time' | 'bulk-sale';
//   item?: MenuItem;
// }

// export interface DescModalProps {
//   isOpen: boolean;
//   onClose: () => void;
//   title: string;
//   children: React.ReactNode;
// }

// export interface MenuItemCardProps {
//   item: MenuItem;
//   onEdit: (item: MenuItem) => void;
//   onToggleStock: (item: MenuItem) => void;
// }

// export interface CategoryOption {
//   label: string;
//   value: string;
// }

// // export type MenuCategory = 'drinks' | 'food' | 'desserts' | 'merchandise';

// // export type MenuTab = 'all' | 'limited' | 'upsells' | 'out-of-stock' | 'schedule-sale';

// // export type AvailabilityType = 'preorder-only' | 'preorder-and-event' | 'preorder-unlock';

// // export type DiscountType = 'percentage' | 'fixed';

// // export interface MenuItem {
// //   id: string;
// //   name: string;
// //   category: MenuCategory;
// //   price: number;
// //   description?: string;
// //   imageUrl?: string;
// //   isInStock: boolean;
// //   isUpsell: boolean;
// //   isLimitedTime: boolean;
// //   isPreorder: boolean;
// //   soldCount: number;
// //   limitedTimeEnd?: Date;
// //   availabilityType?: AvailabilityType;
// //   // Sale-related fields
// //   isOnSale?: boolean;
// //   salePrice?: number;
// //   saleStartDate?: Date;
// //   saleEndDate?: Date;
// //   discountType?: DiscountType;
// //   discountValue?: number;
// // }

// // export interface MenuStats {
// //   totalItems: number;
// //   inStock: number;
// //   outOfStock: number;
// //   limitedTimeItems: number;
// //   upsellItems: number;
// //   saleItems: number;
// // }

// // export interface LimitedTimeFormData {
// //   name: string;
// //   category: MenuCategory;
// //   price: number;
// //   description: string;
// //   imageUrl?: string;
// //   startDate: string;
// //   startTime: string;
// //   endDate: string;
// //   endTime: string;
// //   availabilityType: AvailabilityType;
// //   isUpsell: boolean;
// // }

// // export interface MenuItemFormData {
// //   name: string;
// //   category: MenuCategory;
// //   price: number;
// //   description: string;
// //   imageUrl?: string;
// //   isUpsell: boolean;
// // }

// // export interface BulkSaleFormData {
// //   saleName: string;
// //   discountType: DiscountType;
// //   discountValue: number;
// //   startDate: string;
// //   startTime: string;
// //   endDate: string;
// //   endTime: string;
// //   selectedItems: string[];
// // }

// // export interface ModalAction {
// //   type: 'add' | 'edit' | 'limited-time' | 'bulk-sale';
// //   item?: MenuItem;
// // }

// // export interface DescModalProps {
// //   isOpen: boolean;
// //   onClose: () => void;
// //   title: string;
// //   children: React.ReactNode;
// // }

// // export interface MenuItemCardProps {
// //   item: MenuItem;
// //   onEdit: (item: MenuItem) => void;
// //   onToggleStock: (item: MenuItem) => void;
// // }
