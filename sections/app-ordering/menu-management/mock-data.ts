import { MenuItem, MenuStats } from './types';

export const MOCK_MENU_ITEMS: MenuItem[] = [
  {
    id: '1',
    name: 'Signature Cocktail',
    category: 'drinks',
    price: 12.0,
    description: 'Our house special mix with premium spirits and fresh ingredients.',
    isInStock: true,
    isUpsell: true,
    isLimitedTime: false,
    isPreorder: false,
    soldCount: 847,
    isOnSale: true,
    salePrice: 9.0,
    discountType: 'percentage',
    discountValue: 25,
    saleStartDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // Started 2 days ago
    saleEndDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // Ends in 5 days
  },
  {
    id: '2',
    name: 'Summer Special Mojito',
    category: 'drinks',
    price: 10.0,
    description: 'Limited summer edition with tropical fruits. Available for preorder only.',
    isInStock: true,
    isUpsell: false,
    isLimitedTime: true,
    isPreorder: true,
    soldCount: 234,
    limitedTimeEnd: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days from now
    availabilityType: 'preorder-only',
  },
  {
    id: '3',
    name: 'Margherita Pizza',
    category: 'food',
    price: 16.0,
    description: 'Classic Italian pizza with fresh mozzarella and basil.',
    isInStock: false,
    isUpsell: false,
    isLimitedTime: false,
    isPreorder: false,
    soldCount: 564,
  },
  {
    id: '4',
    name: 'Premium Burger',
    category: 'food',
    price: 18.0,
    description: 'Gourmet burger with aged cheddar and special sauce.',
    isInStock: true,
    isUpsell: true,
    isLimitedTime: false,
    isPreorder: false,
    soldCount: 412,
    isOnSale: true,
    salePrice: 14.0,
    discountType: 'fixed',
    discountValue: 4,
    saleStartDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // Started 1 day ago
    saleEndDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // Ends in 7 days
  },
  {
    id: '5',
    name: 'Exclusive Event T-Shirt',
    category: 'merchandise',
    price: 25.0,
    description:
      'Limited edition tee. Only available at venue for those who preordered. Limited edition tee. Only available at venue for those who preordered.Limited edition tee. Only available at venue for those who preordered.',
    isInStock: true,
    isUpsell: false,
    isLimitedTime: true,
    isPreorder: true,
    soldCount: 89,
    limitedTimeEnd: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000), // 10 days from now
    availabilityType: 'preorder-unlock',
  },
  {
    id: '6',
    name: 'Iced Coffee',
    category: 'drinks',
    price: 5.0,
    description: 'Cold brew coffee with ice and your choice of milk.',
    isInStock: true,
    isUpsell: false,
    isLimitedTime: false,
    isPreorder: false,
    soldCount: 356,
  },
];

export const MOCK_STATS: MenuStats = {
  totalItems: 42,
  inStock: 38,
  outOfStock: 4,
  limitedTimeItems: 7,
  upsellItems: 12,
  saleItems: 2,
};
