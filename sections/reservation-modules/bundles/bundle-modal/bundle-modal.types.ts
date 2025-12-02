export type BundleFormValues = {
  name: string;
  description: string;
  event: string;
  startDate: string | Date;
  endDate: string | Date;
  price: number;
  tickets: TicketItem[];
  reservations: ReservationItem[];
  preorders: PreorderItem[];
  status?: 'active' | 'inactive';
};

export type TicketItem = {
  ticketId: string;
  quantity: number;
};

export type ReservationItem = {
  reservationId: string;
  quantity: number;
};

export type PreorderItem = {
  menuItemId: string;
  quantity: number;
};

export type TicketData = {
  _id: string;
  title: string;
  amount: number;
};

export type ReservationData = {
  _id: string;
  reservationType: string;
  amount: number;
  maxCapacityPerReservation: number;
};

export type MenuItemData = {
  _id: string;
  title: string;
  price: number;
};

export type BundleModalProps = {
  open: boolean;
  onClose: () => void;
  isEdit?: boolean;
  selectedData?: any;
  companyId?: string | null;
  organizationId?: string | null;
};
