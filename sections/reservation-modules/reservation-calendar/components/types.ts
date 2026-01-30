// Types

// Selected slot info for filtering
export interface SelectedSlot {
  reservationType: string;
  startTime: string;
  endTime: string;
  slotKey: string;
}

// API Response Types for Calendar Reservations
export interface CalendarReservation {
  _id: string;
  userId: string;
  partySize: number;
  organizationId: string;
  reservationId: string;
  companyOrganizer: string;
  timingSlots: {
    dateTimeSlots: {
      date: string;
      timeSlots: {
        startTime: string;
        endTime: string;
        _id: string;
      }[];
      _id: string;
    }[];
  };
  optionalEventId?: string;
  notes: string;
  status: 'pending' | 'confirmed' | 'cancelled' | string;
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
    conditionType?: string;
    amount?: number;
    ticketType?: string | null;
  };
  member: string;
  eventTitle: string;
}

// Legacy Booking type (kept for backward compatibility)
export interface Booking {
  id: number;
  date: string;
  customer: string;
  tier: 'Gold' | 'Silver' | 'Bronze';
  table: string;
  guests: number;
  time: string;
  startTime: string;
  endTime: string;
  status: 'pending' | 'confirmed' | 'cancelled';
  price: number;
}

export interface TimeSlot {
  id: number;
  name: string;
  maxGuests: number;
  available: number;
  booked: number;
  price: number;
}

export interface CalendarStats {
  slots: number;
  pending: number;
  booked: number;
  highlighted?: boolean;
}

export interface CalendarViewProps {
  selectedDate: Date;
  onDateSelect: (date: Date) => void;
}

export interface PendingRequestsProps {
  bookings: CalendarReservation[];
  selectedSlot?: SelectedSlot | null;
  onStatusUpdate?: () => void;
}

export interface TimeSlotsProps {
  slots: TimeSlot[];
  selectedTime: string;
  onTimeSelect: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

export interface ActiveBookingsProps {
  bookings: CalendarReservation[];
}

// Legacy ActiveBooking type (kept for reference)
export interface ActiveBooking {
  id: number;
  customerName: string;
  table: string;
  time: string;
  guests: number;
  checkedIn: number;
  phone: string;
  note?: string;
  status: 'checked-in' | 'reserved';
}
