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
