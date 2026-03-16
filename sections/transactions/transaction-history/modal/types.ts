// ─── Common Types ───────────────────────────────────────────────

export interface OrganizationBasicInfo {
  media: {
    logo: string;
    cover: string;
  };
  name: string;
  phoneNumber: {
    code: string;
    number: string;
  };
  website: string;
  socialLinks: {
    youtube: string;
    facebook: string;
    instagram: string;
    tiktok: string;
  };
}

export interface OrganizationInfo {
  _id: string;
  basicInfo: OrganizationBasicInfo;
}

export interface UserInfo {
  _id: string;
  profileIcon: string;
  firstName: string;
  lastName: string;
  username: string;
  email: string;
}

export interface CompanyOrganizerInfo {
  _id: string;
  profileIcon: string;
  firstName: string;
  lastName: string;
  email: string;
  username: string;
}

export interface TransactionPayload {
  event: string;
  transaction: {
    id: string;
    orderNumber: string;
    status: string;
    amount: number;
    currency: string;
    metadata: Record<string, any>;
  };
  user: string;
}

// ─── Menu Orders ────────────────────────────────────────────────

export interface MenuItemSnapshot {
  _id: string;
  image: string;
  title: string;
  description: string;
  type: string;
  category: {
    _id: string;
    title: string;
    image?: string;
    status: string;
  };
  basePrice: number;
  discountPrice: number;
  taxPercent: number;
  menu: {
    _id: string;
    title: string;
    description: string;
  };
  sale?: {
    _id: string;
    title: string;
    discountType: string;
    discountValue: number;
  };
  saleDiscountType?: string;
  saleDiscountValue?: number;
}

export interface MenuOrderItem {
  menuItem: string;
  quantity: number;
  isdelivered: boolean;
  finalPrice: number;
  menuItemSnapShot: MenuItemSnapshot;
  _id: string;
}

export interface MenuOrderData {
  _id: string;
  organization: string;
  user: string;
  items: MenuOrderItem[];
  totalPrice: number;
  priceBreakdown: {
    itemsTotal: number;
    saleDiscount: number;
    promoDiscount: number;
    tax: number;
    finalTotal: number;
    promoCode: string | null;
  };
  status: string;
  notes: string;
  paymentMethod: string;
  paymentStatus: string;
  paidAt: string;
  transactionId: string;
  orderType: string;
  pickupType: string;
  orderNumber: string;
  createdAt: string;
  updatedAt: string;
}

// ─── User Reservations ──────────────────────────────────────────

export interface ReservationSnapshot {
  _id: string;
  reservationType: string;
  conditionType: string;
  amount: number;
  taxPercentage: string;
  timingSlots: {
    enabled: boolean;
    dateTimeSlots: Array<{
      date: string;
      timeSlots: Array<{
        startTime: string;
        endTime: string;
        _id: string;
      }>;
      _id: string;
    }>;
  };
  needsConfirmation: boolean;
  allowPreOrderMenuItems: boolean;
  bonusPoints: number;
  availableReservations: number;
  maxCapacityPerReservation: number;
}

export interface ReservationOrderData {
  _id: string;
  userId: string;
  partySize: number;
  amount: number;
  organizationId: string;
  reservationId: string;
  reservationSnapshot: ReservationSnapshot;
  firstName: string;
  lastName: string;
  phoneNumber: {
    code: string;
    number: string;
  };
  notes: string;
  status: string;
  paymentDetails: {
    cardId: string | null;
    transactionId: string;
    paymentStatus: string;
  };
  paidAt: string;
  bookingId: string;
  priceBreakDown: {
    reservationAmount: number;
    reservationTax: number;
    promoDiscount: number;
    reservationFinalAmount: number;
    promoCode: string | null;
  };
  createdAt: string;
  updatedAt: string;
  timingSlots: any;
}

// ─── Ticket Transfer ────────────────────────────────────────────

export interface TicketTransferBooking {
  _id: string;
  order: {
    _id: string;
    user: string;
    organization: string;
    companyOrganizer: string;
    purpose: string;
    event: {
      _id: string;
      basicInfo: {
        media: { type: string; name: string };
        title: string;
        description: string;
        venueLocation: {
          fullAddress: string;
          city: string;
          country: string;
        };
      };
      schedule: {
        type: string;
        startDateTime: string;
        endDateTime: string;
      };
    };
    orderPricing: {
      subtotal: number;
      taxAmount: number;
      total: number;
      currency: string;
    };
    ticketsPurchased: number;
    paymentDetails: {
      paymentMethod: string;
      paymentStatus: string;
      transactionId: string;
    };
    status: string;
  };
  ticket: {
    ticketId: {
      _id: string;
      title: string;
      price: number;
      taxPercentage: number;
      transferFee: number;
      resaleProtection: string;
      fastTrackEntry: {
        enabled: boolean;
        quantity: number;
        extraPrice: number;
      };
    };
    snapshot: Record<string, any>;
    protectionUserDetails: {
      firstName: string;
      surName: string;
      dob: string;
      pid: string;
    };
  };
  status: string;
  isFastTrack: boolean;
  pricingPhase: string;
  ticketBookingId: string;
  transferHistory: Array<{
    fromUser: {
      _id: string;
      firstName: string;
      lastName: string;
      username: string;
    };
    toUser: {
      _id: string;
      firstName: string;
      lastName: string;
      username: string;
    } | null;
    transferDate: string;
    _id: string;
  }>;
  createdAt: string;
  updatedAt: string;
}

// ─── Ticketing Bookings ─────────────────────────────────────────

export interface TicketingBookingOrderData {
  _id: string;
  user: string;
  organization: string;
  companyOrganizer: string;
  purpose: string;
  event: {
    _id: string;
    basicInfo: {
      media: { type: string; name: string };
      title: string;
      description: string;
      organization: string;
      venueLocation: {
        fullAddress: string;
        city: string;
        country: string;
      };
    };
    schedule: {
      type: string;
      startDateTime: string;
      endDateTime: string;
    };
    status: string;
  };
  reservation: any;
  orderPricing: {
    subtotal: number;
    taxAmount: number;
    discount: number;
    total: number;
    currency: string;
    promoCode: string | null;
  };
  ticketsPurchased: number;
  paymentDetails: {
    cardId: string | null;
    transactionId: string;
    paymentMethod: string;
    paymentStatus: string;
  };
  status: string;
  createdAt: string;
  updatedAt: string;
}

// ─── Union: Transaction Detail Response ─────────────────────────

export interface TransactionDetailBase {
  _id: string;
  provider: string;
  orderType: 'menuorders' | 'userreservations' | 'tickettransfer' | 'ticketingbookings';
  amount: string;
  orderNumber: string;
  organization: OrganizationInfo;
  companyOrganizer: CompanyOrganizerInfo;
  user: UserInfo;
  userOrders: any[];
  paymentStatus: string;
  transactionId: string;
  payload: TransactionPayload;
  createdAt: string;
  updatedAt: string;
}

export interface MenuOrderTransaction extends TransactionDetailBase {
  orderType: 'menuorders';
  orderData: MenuOrderData;
}

export interface ReservationTransaction extends TransactionDetailBase {
  orderType: 'userreservations';
  orderData: ReservationOrderData;
}

export interface TicketTransferTransaction extends TransactionDetailBase {
  orderType: 'tickettransfer';
  orderData: TicketTransferBooking[];
}

export interface TicketingBookingTransaction extends TransactionDetailBase {
  orderType: 'ticketingbookings';
  orderData: TicketingBookingOrderData;
}

export type TransactionDetail = MenuOrderTransaction | ReservationTransaction | TicketTransferTransaction | TicketingBookingTransaction;
