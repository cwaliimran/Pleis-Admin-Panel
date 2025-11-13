// event-ticketing-helpers.ts
import { fDate, formatStr, convertTimeFormat } from '@/utils/format-time';

export interface EventData {
  _id: string;
  schedule?: {
    type?: string;
    startDateTime?: string;
    endDateTime?: string;
  };
}

export interface TimeSlot {
  quantity: string;
  startTime: string;
  endTime: string;
}

export interface DateTimeSlot {
  date: string;
  timeSlots: TimeSlot[];
}

export interface TicketingFormData {
  type: string;
  quantity: number;
  price: number;
  tax: string;
  publishSettings: {
    publishType: 'instant' | 'scheduled' | 'manual';
    scheduledDate: string;
  };
  features: {
    timeslot: boolean;
    timeSlotConfig: DateTimeSlot[] | null;
    repeatable: boolean;
    repeatableVisits: string;
    resale: 'none' | 'name' | 'full';
    earlyBirdEnabled: boolean;
    earlyBirdDate: string;
    earlyBirdPrice: string;
    lastMinuteEnabled: boolean;
    lastMinuteDate: string;
    lastMinutePrice: string;
    fasttrack: boolean;
    fasttrackQuantity: string;
    fasttrackPrice: string;
    reservation: boolean;
    reservationType: string;
    transfer: boolean;
    transferFee: string;
  };
}

/**
 * Maps resale protection form value to API value
 */
export const mapResaleProtection = (value: 'none' | 'name' | 'full'): string | null => {
  const mapping: Record<string, string | null> = {
    none: null,
    name: 'nameSurname',
    full: 'nameSurnamePid',
  };
  return mapping[value] ?? null;
};

/**
 * Maps API resale protection value to form value
 */
export const mapResaleProtectionReverse = (value: string | null): 'none' | 'name' | 'full' => {
  if (!value) return 'none';
  const mapping: Record<string, 'none' | 'name' | 'full'> = {
    nameSurname: 'name',
    nameSurnamePid: 'full',
  };
  return mapping[value] ?? 'none';
};

/**
 * Converts 24-hour time to 12-hour format (e.g., "14:30" -> "02:30 PM")
 */
export const convertTo12Hour = (time24: string): string => {
  const [hours, minutes] = time24.split(':').map(Number);
  const period = hours >= 12 ? 'PM' : 'AM';
  const hours12 = hours % 12 || 12;
  return `${hours12}:${String(minutes).padStart(2, '0')} ${period}`;
};

/**
 * Converts 12-hour time to 24-hour format (e.g., "02:30 PM" -> "14:30")
 */
export const convertTo24Hour = (time12: string): string => {
  const [time, period] = time12.split(' ');
  let [hours, minutes] = time.split(':').map(Number);

  if (period === 'PM' && hours !== 12) {
    hours += 12;
  } else if (period === 'AM' && hours === 12) {
    hours = 0;
  }

  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
};

/**
 * Get event date constraints for date picker validation
 */
export const getEventDateConstraints = (eventData: EventData | null) => {
  if (!eventData?.schedule?.startDateTime || !eventData?.schedule?.endDateTime) {
    return {
      minDate: null,
      maxDate: null,
      startDateTime: null,
      endDateTime: null,
    };
  }

  try {
    const startParts = eventData.schedule.startDateTime.split(' ');
    const endParts = eventData.schedule.endDateTime.split(' ');

    const startDate = startParts[0];
    const endDate = endParts[0];

    return {
      minDate: startDate,
      maxDate: endDate,
      startDateTime: eventData.schedule.startDateTime,
      endDateTime: eventData.schedule.endDateTime,
    };
  } catch (error) {
    console.error('Error parsing event dates:', error);
    return {
      minDate: null,
      maxDate: null,
      startDateTime: null,
      endDateTime: null,
    };
  }
};

/**
 * Validate if a date is within the event schedule
 */
export const isDateWithinEventSchedule = (dateString: string, eventData: EventData | null): { isValid: boolean; message?: string } => {
  if (!eventData?.schedule?.startDateTime || !eventData?.schedule?.endDateTime) {
    return { isValid: true };
  }

  try {
    const constraints = getEventDateConstraints(eventData);
    if (!constraints.minDate || !constraints.maxDate) {
      return { isValid: true };
    }

    const selectedDate = new Date(dateString);
    const minDate = new Date(constraints.minDate);
    const maxDate = new Date(constraints.maxDate);

    if (selectedDate < minDate || selectedDate > maxDate) {
      return {
        isValid: false,
        message: `Date must be between ${minDate.toLocaleDateString()} and ${maxDate.toLocaleDateString()}`,
      };
    }

    return { isValid: true };
  } catch (error) {
    console.error('Error validating date:', error);
    return { isValid: true };
  }
};

/**
 * Transform ticketing form data to API payload
 */
export const transformTicketingPayload = (formData: TicketingFormData, eventId: string) => {
  const payload: any = {
    title: formData.type,
    price: formData.price,
    taxPercentage: Number(formData.tax),
    event: eventId,
  };

  // Handle quantity or timing slots
  if (formData.features.timeslot && formData.features.timeSlotConfig) {
    payload.timingSlots = {
      enabled: true,
      dateTimeSlots: formData.features.timeSlotConfig.map((dts) => ({
        date: dts.date,
        timeSlots: dts.timeSlots.map((slot) => ({
          quantity: slot.quantity,
          startTime: slot.startTime,
          endTime: slot.endTime,
        })),
      })),
    };
  } else {
    payload.quantity = formData.quantity;
    payload.timingSlots = {
      enabled: false,
    };
  }

  // Handle repeatable tickets
  if (formData.features.repeatable) {
    payload.repeatable = {
      isRepeatable: true,
      visits: Number(formData.features.repeatableVisits),
    };
  } else {
    payload.repeatable = {
      isRepeatable: false,
    };
  }

  // Handle resale protection
  const resaleValue = mapResaleProtection(formData.features.resale);
  if (resaleValue) {
    payload.resaleProtection = resaleValue;
  }

  // Handle transfer fee
  if (formData.features.transfer && formData.features.transferFee) {
    payload.transferFee = Number(formData.features.transferFee);
  }

  // Handle time sensitive pricing
  const timeSensitivePricing: any = {};

  if (formData.features.earlyBirdEnabled && formData.features.earlyBirdDate && formData.features.earlyBirdPrice) {
    // Convert datetime-local to API format
    const earlyBirdDateTime = new Date(formData.features.earlyBirdDate);
    const earlyBirdDateStr = fDate(earlyBirdDateTime, formatStr.paramCase.db);
    const earlyBirdTimeStr = convertTimeFormat(earlyBirdDateTime.toTimeString().substring(0, 5), false);

    timeSensitivePricing.earlyBird = {
      endDate: `${earlyBirdDateStr} ${earlyBirdTimeStr}`,
      discountedPrice: Number(formData.features.earlyBirdPrice),
    };
  }

  if (formData.features.lastMinuteEnabled && formData.features.lastMinuteDate && formData.features.lastMinutePrice) {
    // Convert datetime-local to API format
    const lastMinuteDateTime = new Date(formData.features.lastMinuteDate);
    const lastMinuteDateStr = fDate(lastMinuteDateTime, formatStr.paramCase.db);
    const lastMinuteTimeStr = convertTimeFormat(lastMinuteDateTime.toTimeString().substring(0, 5), false);

    timeSensitivePricing.lastMinute = {
      startDate: `${lastMinuteDateStr} ${lastMinuteTimeStr}`,
      discountedPrice: Number(formData.features.lastMinutePrice),
    };
  }

  if (Object.keys(timeSensitivePricing).length > 0) {
    payload.timeSensitivePricing = timeSensitivePricing;
  }

  // Handle fast track entry
  if (formData.features.fasttrack) {
    payload.fastTrackEntry = {
      enabled: true,
      quantity: Number(formData.features.fasttrackQuantity) || 0,
      extraPrice: Number(formData.features.fasttrackPrice) || 0,
    };
  } else {
    payload.fastTrackEntry = {
      enabled: false,
    };
  }

  // Handle reservation
  if (formData.features.reservation && formData.features.reservationType) {
    payload.requiresReservation = {
      enabled: true,
      type: formData.features.reservationType,
    };
  } else {
    payload.requiresReservation = {
      enabled: false,
    };
  }

  // Handle publish settings
  if (formData.publishSettings.publishType === 'instant') {
    payload.status = 'active';
  } else if (formData.publishSettings.publishType === 'scheduled') {
    payload.status = 'scheduled';
    if (formData.publishSettings.scheduledDate) {
      // Convert datetime-local to API format
      const scheduledDateTime = new Date(formData.publishSettings.scheduledDate);
      const scheduledDateStr = fDate(scheduledDateTime, formatStr.paramCase.db);
      const scheduledTimeStr = convertTimeFormat(scheduledDateTime.toTimeString().substring(0, 5), false);
      payload.scheduledPublishAt = `${scheduledDateStr} ${scheduledTimeStr}`;
    }
  } else if (formData.publishSettings.publishType === 'manual') {
    payload.status = 'inactive';
  }

  return payload;
};

/**
 * Transform API data to form data for editing
 */
export const transformApiDataToTicketingForm = (apiData: any): Partial<TicketingFormData> => {
  const formData: Partial<TicketingFormData> = {
    type: apiData.title || '',
    quantity: apiData.quantity || 0,
    price: apiData.price || 0,
    tax: String(apiData.taxPercentage || 0),
    publishSettings: {
      publishType: 'instant',
      scheduledDate: '',
    },
    features: {
      timeslot: false,
      timeSlotConfig: null,
      repeatable: false,
      repeatableVisits: '',
      resale: 'none',
      earlyBirdEnabled: false,
      earlyBirdDate: '',
      earlyBirdPrice: '',
      lastMinuteEnabled: false,
      lastMinuteDate: '',
      lastMinutePrice: '',
      fasttrack: false,
      fasttrackQuantity: '',
      fasttrackPrice: '',
      reservation: false,
      reservationType: '',
      transfer: false,
      transferFee: '',
    },
  };

  // Parse status and publish settings
  if (apiData.status === 'active') {
    formData.publishSettings!.publishType = 'instant';
  } else if (apiData.status === 'scheduled') {
    formData.publishSettings!.publishType = 'scheduled';
    if (apiData.scheduledPublishAt) {
      // Convert API format to datetime-local format
      const scheduledDate = new Date(apiData.scheduledPublishAt);
      formData.publishSettings!.scheduledDate = scheduledDate.toISOString().slice(0, 16);
    }
  } else if (apiData.status === 'inactive') {
    formData.publishSettings!.publishType = 'manual';
  }

  // Parse timing slots
  if (apiData.timingSlots?.enabled && apiData.timingSlots?.dateTimeSlots) {
    formData.features!.timeslot = true;
    formData.features!.timeSlotConfig = apiData.timingSlots.dateTimeSlots.map((dts: any) => ({
      date: dts.date,
      timeSlots: dts.timeSlots.map((slot: any) => ({
        id: Date.now().toString() + Math.random(),
        quantity: Number(slot.quantity) || 0,
        startTime: convertTo24Hour(slot.startTime),
        endTime: convertTo24Hour(slot.endTime),
      })),
    }));
  }

  // Parse repeatable
  if (apiData.repeatable?.isRepeatable) {
    formData.features!.repeatable = true;
    formData.features!.repeatableVisits = String(apiData.repeatable.visits || 1);
  }

  // Parse resale protection
  if (apiData.resaleProtection) {
    formData.features!.resale = mapResaleProtectionReverse(apiData.resaleProtection);
  }

  // Parse transfer fee
  if (apiData.transferFee) {
    formData.features!.transfer = true;
    formData.features!.transferFee = String(apiData.transferFee);
  }

  // Parse time sensitive pricing
  if (apiData.timeSensitivePricing?.earlyBird) {
    formData.features!.earlyBirdEnabled = true;
    const earlyBirdDate = new Date(apiData.timeSensitivePricing.earlyBird.endDate);
    formData.features!.earlyBirdDate = earlyBirdDate.toISOString().slice(0, 16);
    formData.features!.earlyBirdPrice = String(apiData.timeSensitivePricing.earlyBird.discountedPrice);
  }

  if (apiData.timeSensitivePricing?.lastMinute) {
    formData.features!.lastMinuteEnabled = true;
    const lastMinuteDate = new Date(apiData.timeSensitivePricing.lastMinute.startDate);
    formData.features!.lastMinuteDate = lastMinuteDate.toISOString().slice(0, 16);
    formData.features!.lastMinutePrice = String(apiData.timeSensitivePricing.lastMinute.discountedPrice);
  }

  // Parse fast track
  if (apiData.fastTrackEntry?.enabled) {
    formData.features!.fasttrack = true;
    formData.features!.fasttrackQuantity = String(apiData.fastTrackEntry.quantity || '');
    formData.features!.fasttrackPrice = String(apiData.fastTrackEntry.extraPrice || '');
  }

  // Parse reservation
  if (apiData.requiresReservation?.enabled) {
    formData.features!.reservation = true;
    formData.features!.reservationType = apiData.requiresReservation.type || '';
  }

  return formData;
};
