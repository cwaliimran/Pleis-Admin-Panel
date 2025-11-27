export type MenuCategory = 'drinks' | 'food' | 'desserts' | 'merchandise';

export type MenuTab = 'all' | 'limited' | 'upsells' | 'out-of-stock';

export type AvailabilityType = 'preorder-only' | 'preorder-and-event' | 'preorder-unlock';

export type DiscountType = 'percentage' | 'fixed';

export interface MenuItem {
  id: string;
  name: string;
  category: MenuCategory;
  price: number;
  description?: string;
  imageUrl?: string;
  isInStock: boolean;
  isUpsell: boolean;
  isLimitedTime: boolean;
  isPreorder: boolean;
  soldCount: number;
  limitedTimeEnd?: Date;
  availabilityType?: AvailabilityType;
}

export interface MenuStats {
  totalItems: number;
  inStock: number;
  outOfStock: number;
  limitedTimeItems: number;
  upsellItems: number;
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
}