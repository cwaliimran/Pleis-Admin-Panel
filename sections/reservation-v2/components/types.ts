// Types
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
  bookings: Booking[];
  onConfirm: (id: number) => void;
  onReject: (id: number) => void;
  onChange: (id: number) => void;
}

export interface TimeSlotsProps {
  slots: TimeSlot[];
  selectedTime: string;
  onTimeSelect: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

export interface ActiveBookingsProps {
  bookings: ActiveBooking[];
}

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