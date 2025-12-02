import { TicketData, ReservationData, MenuItemData } from './bundle-modal.types';

export const calculateOriginalPrice = (
  tickets: any[],
  reservations: any[],
  preorders: any[],
  ticketsData: TicketData[],
  reservationsData: ReservationData[],
  menuItemsData: MenuItemData[]
): number => {
  const ticketTotal = tickets.reduce((sum: number, item: any) => {
    const ticket = ticketsData.find((t) => t._id === item.ticketId);
    return sum + (ticket?.amount || 0) * item.quantity;
  }, 0);

  const reservationTotal = reservations.reduce((sum: number, item: any) => {
    const reservation = reservationsData.find((r) => r._id === item.reservationId);
    return sum + (reservation?.amount || 0) * item.quantity;
  }, 0);

  const preorderTotal = preorders.reduce((sum: number, item: any) => {
    const menuItem = menuItemsData.find((m) => m._id === item.menuItemId);
    return sum + (menuItem?.price || 0) * item.quantity;
  }, 0);

  return ticketTotal + reservationTotal + preorderTotal;
};

export const calculateDiscount = (originalPrice: number, bundlePrice: number): number => {
  if (!originalPrice || !bundlePrice) return 0;
  return Math.round(((originalPrice - bundlePrice) / originalPrice) * 100);
};

export const getItemName = (
  id: string,
  type: 'ticket' | 'reservation' | 'preorder',
  ticketsData: TicketData[],
  reservationsData: ReservationData[],
  menuItemsData: MenuItemData[]
): string => {
  if (type === 'ticket') {
    return ticketsData.find((t) => t._id === id)?.title || '';
  } else if (type === 'reservation') {
    return reservationsData.find((r) => r._id === id)?.reservationType || '';
  } else {
    return menuItemsData.find((m) => m._id === id)?.title || '';
  }
};

export const getItemPrice = (
  id: string,
  type: 'ticket' | 'reservation' | 'preorder',
  ticketsData: TicketData[],
  reservationsData: ReservationData[],
  menuItemsData: MenuItemData[]
): number => {
  if (type === 'ticket') {
    return ticketsData.find((t) => t._id === id)?.amount || 0;
  } else if (type === 'reservation') {
    return reservationsData.find((r) => r._id === id)?.amount || 0;
  } else {
    return menuItemsData.find((m) => m._id === id)?.price || 0;
  }
};

export const formatDateTimeForAPI = (date: Date | string, time: string = '12:00'): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const [hours, minutes] = time.split(':');
  const period = parseInt(hours) >= 12 ? 'PM' : 'AM';
  const displayHours = parseInt(hours) % 12 || 12;
  const month = String(dateObj.getMonth() + 1).padStart(2, '0');
  const day = String(dateObj.getDate()).padStart(2, '0');
  const year = dateObj.getFullYear();
  return `${year}-${month}-${day} ${displayHours}:${minutes} ${period}`;
};

export const parseDateTimeFromAPI = (dateTimeStr: string): { date: Date; time: string } => {
  const [datePart, timePart, period] = dateTimeStr.split(' ');
  const [year, month, day] = datePart.split('-');
  const [hours, minutes] = timePart.split(':');

  let hour24 = parseInt(hours);
  if (period === 'PM' && hour24 !== 12) {
    hour24 += 12;
  } else if (period === 'AM' && hour24 === 12) {
    hour24 = 0;
  }

  return {
    date: new Date(parseInt(year), parseInt(month) - 1, parseInt(day)),
    time: `${String(hour24).padStart(2, '0')}:${minutes}`,
  };
};
