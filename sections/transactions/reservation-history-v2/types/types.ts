export type ReservationAction = 'create' | 'update' | 'cancel' | 'refund' | 'no_show';

export type ReservationStatus = 'new' | 'awaiting_payment' | 'confirmed' | 'show' | 'no_show' | 'cancelled' | 'expired';

export type ReservationCondition = 'free' | 'minimum_spend';

export type ReservationTypeCategory = 'standard_table' | 'vip_booth' | 'group_table';

export type VoucherStatus = 'ISSUED' | 'PARTIALLY_USED' | 'USED' | 'EXPIRED' | 'CANCELLED' | 'FORFEITED';

export type SettlementStatus = 'HELD' | 'PENDING' | 'SETTLED' | 'EXCLUDED' | 'NO_TRANSACTION' | null;

export type StaffActionVia = 'web_admin_app' | 'mobile_staff_app' | 'auto';

export interface ReservationVoucher {
  code: string;
  status: VoucherStatus;
  prepaidAmount: number;
  balance: number;
  validUntil?: string;
  expiringWithin7Days?: boolean;
}

export interface ReservationDetail {
  reservation: {
    typeLabel: string;
    condition: ReservationCondition;
    guests: number;
    table?: string;
    occasion?: string;
    contact?: string;
  };
  voucherNote?: string;
  staff: {
    label: string;
    via: StaffActionVia | null;
  };
  settlement: {
    status: SettlementStatus;
    note: string;
  };
}

export interface Reservation {
  id: string;
  reservationId: string;
  guestName: string;
  action: ReservationAction;
  company: string;
  organization: string;
  venue: string;
  isToday: boolean;
  slotNote: string;
  reservationTypeCategory: ReservationTypeCategory;
  reservationTypeLabel: string;
  guests: number;
  table?: string;
  condition: ReservationCondition;
  voucher: ReservationVoucher | null;
  status: ReservationStatus;
  statusNote?: string;
  deadlinePassed?: boolean;
  autoConfirmed: boolean;
  hasRejectionReason: boolean;
  hasGuestNote: boolean;
  staffLabel: string;
  staffVia: StaffActionVia | null;
  guestCodesNote?: string;
  occasion?: string;
  contactPhone?: string;
  settlementStatus: SettlementStatus;
  createdAt: string;
  isLatestState: boolean;
  detail: ReservationDetail;
}
