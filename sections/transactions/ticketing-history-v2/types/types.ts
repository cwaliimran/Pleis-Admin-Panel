export type TicketAction = 'purchase' | 'gift' | 'transfer' | 'refund';

export type TicketStatus = 'active' | 'used' | 'partially_used' | 'expired' | 'refunded' | 'superseded' | 'cancelled';

export type TicketSource = 'direct_purchase' | 'waitlist' | 'giveaway' | 'loyalty_reward' | 'transfer' | 'gift';

export type TimeSensitivePricing = 'none' | 'early_bird' | 'last_minute';

export type ResaleProtection = 'none' | 'name' | 'name_oib';

export type ScanResult = 'accepted' | 'rejected_already_used' | 'rejected_max_uses_reached' | 'rejected_expired' | 'rejected_invalid';

export type TicketTypeCategory = 'standard' | 'vip' | 'season_pass';

export type SettlementStatus = 'PENDING' | 'HELD' | 'SETTLED' | 'EXCLUDED' | 'NO_TRANSACTION' | null;

export interface TicketPerson {
  name: string;
  email?: string;
}

export interface TicketParty {
  name: string;
  subtitle: string;
}

export interface TicketDocument {
  code: 'INV' | 'CONF' | 'STORNO' | 'ERACUN';
  label: string;
  subtitle: string;
}

export interface ScanAttempt {
  index: number;
  result: ScanResult;
  detail: string;
}

export interface TicketDetail {
  ticket: {
    type: string;
    resaleProtection: ResaleProtection;
    repeatable: boolean;
    usageNote?: string;
    fastTrack: boolean;
  };
  parties: {
    currentOwner: TicketParty;
    originalBuyer: TicketParty;
    assignedHolder?: TicketParty;
    organizer?: TicketParty;
  };
  moneySplit: {
    basePrice: number;
    pricePaid: number | null;
    fastTrackFee?: number;
    serviceFee?: number;
    transferFee?: number;
    taxRate?: number;
    taxLabel?: string;
    commissionRate?: number;
  };
  settlement: {
    status: SettlementStatus;
    batch?: string;
    eligibility?: string;
  };
  documents: TicketDocument[];
  scans: ScanAttempt[];
}

export interface Ticket {
  id: string;
  ticketId: string;
  billkoItemCode: string | null;
  eventName: string;
  eventScheduleNote: string;
  eventEnded: boolean;
  ticketTypeCategory: TicketTypeCategory;
  ticketTypeLabel: string;
  usageNote?: string;
  resaleProtection: ResaleProtection;
  holderDataMissing: boolean;
  action: TicketAction;
  actionNote?: string;
  status: TicketStatus;
  source: TicketSource;
  hasTransaction: boolean;
  ownershipChanged: boolean;
  fastTrack: boolean;
  timeSensitivePricing: TimeSensitivePricing;
  repeatable: boolean;
  linkedReservation: boolean;
  owner: TicketPerson;
  ownerNote: string;
  pricePaid: number | null;
  basePrice?: number;
  scanCount: number;
  scanNote?: string;
  scanResult?: ScanResult;
  scannedBy?: string;
  company: string;
  organization: string;
  venue: string;
  settlementStatus: SettlementStatus;
  invoiceStatus: string[];
  missingFiscalNumber: boolean;
  billkoErrors: boolean;
  hasStorno: boolean;
  createdAt: string;
  isLatestState: boolean;
  detail: TicketDetail;
}
