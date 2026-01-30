export type TimeSlot = {
  startTime: string;
  endTime: string;
};

export type DateTimeSlot = {
  date: string;
  timeSlots: TimeSlot[];
};

export type ReservationFormValues = {
  reservationType: string;
  availableReservations: number;
  maxCapacityPerReservation: number;
  conditionType: string;
  amount: string | null;
  customText: string;
  ticketType: string;
  taxPercentage: string;
  needsConfirmation: boolean;
  allowPreOrderMenuItems: boolean;
  ticketRequirement: boolean;
  optionalEventId: string;
  timingSlotsEnabled: boolean;
  status?: string;
};

export type ReservationModalProps = {
  open: boolean;
  onClose: () => void;
  isEdit?: boolean;
  selectedData?: any;
  organizationId: string | null;
  event: any;
};

export type EventSchedule = {
  type: 'oneTime' | 'recurring';
  startDateTime: string;
  endDateTime: string;
  recurringDetails?: {
    isEnabled: boolean;
    frequency: string;
    interval: number;
    daysOfWeek?: string[];
    endType?: string;
    occurrences?: number;
  };
};

export type EventData = {
  _id: string;
  basicInfo: {
    title: string;
  };
  schedule: EventSchedule;
};

export type EventDateRange = {
  startDate: Date;
  endDate: Date;
  minDate: string;
  maxDate: string;
  startTime: string;
  endTime: string;
  startTimeMinutes: number;
  endTimeMinutes: number;
};

export type ValidationErrors = Record<string, string>;

// ============================================
// Reservation Calendar Grid Types
// ============================================

// API Response Types for Calendar
export interface TimeSlotData {
  startTime: string;
  endTime: string;
  _id: string;
}

export interface DateTimeSlotData {
  date: string;
  timeSlots: TimeSlotData[];
  _id: string;
}

export interface ReservationData {
  _id: string;
  userId: string;
  partySize: number;
  organizationId: string;
  reservationId: string;
  companyOrganizer: string;
  timingSlots: {
    dateTimeSlots: DateTimeSlotData[];
  };
  notes: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  user: {
    _id: string;
    firstName: string;
    lastName: string;
    phoneNumber: {
      code: string;
      number: string;
    };
  };
  reservation: {
    _id: string;
    reservationType: string;
  };
  member: string;
  eventTitle: string;
}

// Processed booking for grid display
export interface ProcessedBooking {
  type: string;
  startTime: string;
  endTime: string;
  slotKey: string;
  bookings: ReservationData[];
  totalPartySize: number;
  bookingCount: number;
}

export interface ReservationGridProps {
  setClick: (value: boolean) => void;
  reservations: ReservationData[];
  isLoading: boolean;
  selectedDate: Date;
  onDateChange: (date: Date) => void;
  onSlotClick?: (slot: { reservationType: string; startTime: string; endTime: string; slotKey: string }) => void;
}
