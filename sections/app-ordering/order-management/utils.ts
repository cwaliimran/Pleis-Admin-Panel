import { ApiOrder, Order, MenuItem } from './types';
import { mapPickupTypeToDeliveryType } from './constants';

/**
 * Transform API order to frontend order format
 */
export const transformApiOrderToFrontend = (apiOrder: ApiOrder): Order => {
  const deliveryType = mapPickupTypeToDeliveryType(apiOrder.pickupType);

  // Determine location based on delivery type
  let location = '';
  if (apiOrder.pickupType === 'tableService' && apiOrder.tableNumber) {
    location = `Table ${apiOrder.tableNumber}`;
  } else if (apiOrder.pickupType === 'togo') {
    location = 'To Go';
  } else if (apiOrder.pickupType === 'preorder') {
    location = 'Preorder';
  } else if (apiOrder.pickupType === 'counter') {
    location = 'Counter';
  } else {
    location = apiOrder.deliveryAddress || 'N/A';
  }

  // Transform items
  const items: MenuItem[] = apiOrder.items.map((item) => ({
    id: item._id,
    menuItemId: item.menuItem,
    name: item.menuItemSnapShot.title,
    quantity: item.quantity,
    price: item.finalPrice,
    isDelivered: item.isdelivered,
  }));

  return {
    id: apiOrder._id,
    deliveryType,
    location,
    userName: `${apiOrder.user.firstName} ${apiOrder.user.userlastName}`.trim(),
    userEmail: apiOrder.user.email,
    items,
    status: apiOrder.status,
    totalCost: apiOrder.totalPrice,
    notes: apiOrder.notes,
    orderType: apiOrder.orderType,
    paymentMethod: apiOrder.paymentMethod,
    paymentStatus: apiOrder.paymentStatus,
    transactionId: apiOrder.transactionId,
    paidAt: apiOrder.paidAt,
    orderNumber: apiOrder.orderNumber,
    createdAt: apiOrder.createdAt,
    updatedAt: apiOrder.updatedAt,
  };
};

/**
 * Transform array of API orders to frontend format
 */
export const transformApiOrdersToFrontend = (apiOrders: ApiOrder[]): Order[] => {
  return apiOrders.map(transformApiOrderToFrontend);
};
