import { Order } from './types';

export const mockOrders: Record<'active' | 'preorders' | 'past', Order[]> = {
  active: [
    {
      id: '1',
      deliveryIcon: 'Plate',
      deliveryLabel: 'Table 12',
      customerName: 'Sarah Johnson',
      summary: '3 items • $42.50',
      status: 'preparing',
      isVip: true,
      contact: { handle: '@sarahj', email: 'sarah.johnson@email.com' },
      items: [
        { quantity: 2, name: 'Caesar Salad', price: 24 },
        { quantity: 1, name: 'Grilled Chicken', price: 18.5 },
      ],
      notes: 'No croutons on one salad. Extra dressing on the side.',
      total: 42.5,
    },
    // … (all 8 active orders – omitted for brevity)
    // copy-paste the rest from the HTML, just map fields to the interface
  ],
  preorders: [/* … */],
  past: [/* … */],
};