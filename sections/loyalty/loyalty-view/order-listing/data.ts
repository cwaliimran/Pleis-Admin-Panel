// path/to/your/data/transactionListData.ts

export const transactionListHeadLabel = [
  { id: 'user', label: 'Customer', align: 'left' },
  { id: 'orderTime', label: 'Time', align: 'start' },
  { id: 'paymentStatus', label: 'Payment Status', align: 'start' },
  { id: 'totalAmount', label: 'Total Amount', align: 'start' },
  { id: 'orderStatus', label: 'Order Status', align: 'start' },
  { id: 'staff', label: 'Handled By', align: 'start' },
  { id: 'actions', label: '', align: 'center' },
];

export const transactionListData = [
  {
    user: 'John Doe',
    avatar: 'https://i.pravatar.cc/150?img=1',
    orderTime: '8:45 PM',
    paymentStatus: 'Paid',
    totalAmount: '€78.50',
    orderStatus: 'Completed',
    staff: 'Jane S.',
  },
  {
    user: 'Sarah Khan',
    avatar: 'https://i.pravatar.cc/150?img=2',
    orderTime: '8:30 PM',
    paymentStatus: 'Pending',
    totalAmount: '€45.00',
    orderStatus: 'Processing',
    staff: 'John B.',
  },
  {
    user: 'David Miller',
    avatar: 'https://i.pravatar.cc/150?img=3',
    orderTime: '7:55 PM',
    paymentStatus: 'Refunded',
    totalAmount: '€12.90',
    orderStatus: 'Canceled',
    staff: 'Jane S.',
  },
  {
    user: 'Emily Johnson',
    avatar: 'https://i.pravatar.cc/150?img=4',
    orderTime: '7:35 PM',
    paymentStatus: 'Paid',
    totalAmount: '€150.00',
    orderStatus: 'Completed',
    staff: 'Alice T.',
  },
];

// path/to/your/data/menuItemData.ts

export const menuItemHeadLabel = [
  { id: 'item', label: 'Menu Item', align: 'left' },
  { id: 'category', label: 'Category', align: 'start' },
  { id: 'salesCount', label: 'Sales Count', align: 'start' },
  { id: 'totalRevenue', label: 'Revenue', align: 'start' },
  { id: 'refunds', label: 'Refunds', align: 'start' },
  { id: 'status', label: 'Availability', align: 'start' },
  { id: 'actions', label: '', align: 'center' },
];

export const menuItemData = [
  {
    item: 'Signature Cocktail',
    category: 'Drinks',
    salesCount: 1250,
    totalRevenue: '€15,000',
    refunds: 12,
    status: 'Available',
  },
  {
    item: 'Gourmet Burger',
    category: 'Food',
    salesCount: 890,
    totalRevenue: '€13,350',
    refunds: 5,
    status: 'Low Stock',
  },
  {
    item: 'Venue T-Shirt (L)',
    category: 'Merch',
    salesCount: 320,
    totalRevenue: '€6,400',
    refunds: 2,
    status: 'Available',
  },
  {
    item: 'Vegan Wrap',
    category: 'Food',
    salesCount: 150,
    totalRevenue: '€1,800',
    refunds: 1,
    status: 'Unavailable',
  },
];

// path/to/your/data/promotionsData.ts

export const promotionsHeadLabel = [
  { id: 'promotionName', label: 'Promotion Name', align: 'left' },
  { id: 'type', label: 'Type', align: 'start' },
  { id: 'discount', label: 'Discount', align: 'start' },
  { id: 'items', label: 'Applicable Items', align: 'start' },
  { id: 'startDate', label: 'Start Date', align: 'start' },
  { id: 'endDate', label: 'End Date', align: 'start' },
  { id: 'status', label: 'Status', align: 'start' },
  { id: 'actions', label: '', align: 'center' },
];

export const promotionsData = [
  {
    promotionName: 'Happy Hour Drinks',
    type: 'Time-Based',
    discount: '25%',
    items: 'All cocktails',
    startDate: '2025-11-01',
    endDate: '2025-11-30',
    status: 'Active',
  },
  {
    promotionName: 'New Merch Launch',
    type: 'Item Discount',
    discount: '€5 OFF',
    items: 'Venue T-Shirts',
    startDate: '2025-11-25',
    endDate: 'N/A',
    status: 'Active',
  },
  {
    promotionName: 'Weekend Burger Combo',
    type: 'Bundle Offer',
    discount: '10% OFF',
    items: 'Gourmet Burger + Drink',
    startDate: '2025-10-01',
    endDate: '2025-11-20',
    status: 'Expired',
  },
];
