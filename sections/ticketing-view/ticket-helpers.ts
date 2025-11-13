import { fDate, convertTimeFormat } from '@/utils/format-time';
import dayjs from 'dayjs';

export interface EventData {
  _id: string;
  basicInfo: {
    title: string;
  };
  schedule: {
    type: string;
    startDateTime: string;
    endDateTime: string;
    recurringDetails?: any;
  };
}

export interface FormData {
  type: string;
  quantity: number;
  price: number;
  tax: string;
  event: string;
  status: string;
  publishSettings: {
    publishType: 'instant' | 'scheduled' | 'manual';
    scheduledDate: string;
  };
  features: {
    timeslot: boolean;
    timeSlotConfig: any;
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

export interface TicketPayload {
  id?: string;
  title: string;
  price: number;
  taxPercentage: number;
  event: string;
  status: string;
  quantity?: number;
  scheduledPublishAt?: string;
  timingSlots: {
    enabled: boolean;
    dateTimeSlots?: any[];
  };
  repeatable: {
    isRepeatable: boolean;
    visits?: number;
  };
  resaleProtection: string;
  transferFee?: number;
  timeSensitivePricing?: {
    earlyBird?: {
      endDate: string;
      discountedPrice: number;
    };
    lastMinute?: {
      startDate: string;
      discountedPrice: number;
    };
  };
  fastTrackEntry: {
    enabled: boolean;
    quantity?: number;
    extraPrice?: number;
  };
  requiresReservation: {
    enabled: boolean;
    type?: string;
  };
}

export const formatDateTimeForAPI = (datetimeLocal: string): string => {
  if (!datetimeLocal) return '';
  const date = new Date(datetimeLocal);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours24 = date.getHours();
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const period = hours24 >= 12 ? 'PM' : 'AM';
  const hours12 = hours24 % 12 || 12;
  const paddedHours12 = String(hours12).padStart(2, '0');
  return `${year}-${month}-${day} ${paddedHours12}:${minutes} ${period}`;
};

export const formatAPIDateTimeToLocal = (apiDateTime: string): string => {
  if (!apiDateTime) return '';

  try {
    const parsedDate = parseAPIDateTime(apiDateTime);
    if (!parsedDate) {
      if (process.env.NODE_ENV === 'development') {
        console.warn('Failed to parse API datetime, trying direct conversion:', apiDateTime);
      }
      const directDate = new Date(apiDateTime);
      if (!isNaN(directDate.getTime())) {
        const year = directDate.getFullYear();
        const month = String(directDate.getMonth() + 1).padStart(2, '0');
        const day = String(directDate.getDate()).padStart(2, '0');
        const hours = String(directDate.getHours()).padStart(2, '0');
        const minutes = String(directDate.getMinutes()).padStart(2, '0');
        return `${year}-${month}-${day}T${hours}:${minutes}`;
      }
      return '';
    }

    const year = parsedDate.getFullYear();
    const month = String(parsedDate.getMonth() + 1).padStart(2, '0');
    const day = String(parsedDate.getDate()).padStart(2, '0');
    const hours = String(parsedDate.getHours()).padStart(2, '0');
    const minutes = String(parsedDate.getMinutes()).padStart(2, '0');

    return `${year}-${month}-${day}T${hours}:${minutes}`;
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error('Error formatting API datetime to local:', error);
    }
    return '';
  }
};

export const formatDateOnlyToLocal = (dateOnly: string): string => {
  if (!dateOnly) return '';

  if (dateOnly.match(/^\d{4}-\d{2}-\d{2}$/)) {
    return `${dateOnly}T00:00`;
  }

  try {
    const date = new Date(dateOnly);
    if (!isNaN(date.getTime())) {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}T00:00`;
    }
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error('Error formatting date only to local:', error);
    }
  }

  return '';
};
export const formatDateForAPI = (datetimeLocal: string): string => {
  if (!datetimeLocal) return '';
  const date = new Date(datetimeLocal);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export const parseAPIDateTime = (dateTimeString: string): Date | null => {
  if (!dateTimeString) return null;

  try {
    if (process.env.NODE_ENV === 'development') {
      console.log('Parsing dateTimeString:', dateTimeString);
    }

    const cleanInput = dateTimeString.trim().replace(/\s+/g, ' ');

    const parts = cleanInput.split(' ');

    if (process.env.NODE_ENV === 'development') {
      console.log('Cleaned input:', cleanInput);
      console.log('Split parts:', parts);
    }

    if (parts.length === 1) {
      const datePart = parts[0];
      if (datePart && datePart.match(/^\d{4}-\d{2}-\d{2}$/)) {
        const result = new Date(`${datePart}T00:00:00`);
        return isNaN(result.getTime()) ? null : result;
      }
      return tryAlternativeParsing(dateTimeString);
    }

    if (parts.length < 3) {
      console.error('Invalid date format. Expected "YYYY-MM-DD HH:MM AM/PM", got parts:', parts);
      return tryAlternativeParsing(dateTimeString);
    }

    const datePart = parts[0];
    const timePart = parts[1];
    const period = parts[parts.length - 1];

    if (process.env.NODE_ENV === 'development') {
      console.log('Extracted parts:', { datePart, timePart, period });
    }

    if (!datePart || !datePart.match(/^\d{4}-\d{2}-\d{2}$/)) {
      console.error('Invalid date part:', datePart);
      return tryAlternativeParsing(dateTimeString);
    }

    if (!timePart || !timePart.match(/^\d{1,2}:\d{2}$/)) {
      console.error('Invalid time part:', timePart);
      return tryAlternativeParsing(dateTimeString);
    }

    const normalizedPeriod = period?.toUpperCase();
    if (!normalizedPeriod || !['AM', 'PM'].includes(normalizedPeriod)) {
      console.error('Invalid period. Expected "AM" or "PM", got:', period);
      return tryAlternativeParsing(dateTimeString);
    }

    const [hoursStr, minutesStr] = timePart.split(':');
    let hours = parseInt(hoursStr, 10);
    const minutes = parseInt(minutesStr, 10);

    if (isNaN(hours) || isNaN(minutes)) {
      console.error('Invalid time values:', { hoursStr, minutesStr });
      return tryAlternativeParsing(dateTimeString);
    }

    if (normalizedPeriod === 'PM' && hours !== 12) {
      hours += 12;
    } else if (normalizedPeriod === 'AM' && hours === 12) {
      hours = 0;
    }

    if (hours < 0 || hours > 23 || minutes < 0 || minutes > 59) {
      console.error('Time values out of range:', { hours, minutes });
      return tryAlternativeParsing(dateTimeString);
    }

    const time24 = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
    const dateTimeISO = `${datePart}T${time24}:00`;

    if (process.env.NODE_ENV === 'development') {
      console.log('Final ISO string:', dateTimeISO);
    }

    const result = new Date(dateTimeISO);
    if (isNaN(result.getTime())) {
      console.error('Invalid date created from ISO string:', dateTimeISO);
      return tryAlternativeParsing(dateTimeString);
    }

    return result;
  } catch (error) {
    console.error('Error parsing date time:', error, 'Input:', dateTimeString);
    return tryAlternativeParsing(dateTimeString);
  }
};

const tryAlternativeParsing = (dateTimeString: string): Date | null => {
  try {
    if (process.env.NODE_ENV === 'development') {
      console.log('Trying alternative parsing for:', dateTimeString);
    }

    const directDate = new Date(dateTimeString);
    if (!isNaN(directDate.getTime())) {
      if (process.env.NODE_ENV === 'development') {
        console.log('Successfully parsed with direct Date constructor');
      }
      return directDate;
    }

    if (dateTimeString.includes('T')) {
      const isoDate = new Date(dateTimeString);
      if (!isNaN(isoDate.getTime())) {
        if (process.env.NODE_ENV === 'development') {
          console.log('Successfully parsed ISO format');
        }
        return isoDate;
      }
    }

    console.error('All parsing methods failed for:', dateTimeString);
    return null;
  } catch (error) {
    console.error('Alternative parsing also failed:', error);
    return null;
  }
};

export const getEventDateConstraints = (eventData: EventData | null) => {
  if (!eventData?.schedule) {
    return { minDate: null, maxDate: null, startDateTime: null, endDateTime: null };
  }

  if (process.env.NODE_ENV === 'development') {
    console.log('Event schedule data:', eventData.schedule);
    console.log('Start DateTime string:', eventData.schedule.startDateTime);
    console.log('End DateTime string:', eventData.schedule.endDateTime);
  }

  const startDate = parseAPIDateTime(eventData.schedule.startDateTime);
  const endDate = parseAPIDateTime(eventData.schedule.endDateTime);

  if (process.env.NODE_ENV === 'development') {
    console.log('Parsed start date:', startDate);
    console.log('Parsed end date:', endDate);
  }

  if (!startDate || !endDate) {
    console.warn('Failed to parse event dates:', {
      startDateTime: eventData.schedule.startDateTime,
      endDateTime: eventData.schedule.endDateTime,
      parsedStart: startDate,
      parsedEnd: endDate,
    });
    return { minDate: null, maxDate: null, startDateTime: null, endDateTime: null };
  }

  return {
    minDate: fDate(startDate, 'YYYY-MM-DD'),
    maxDate: fDate(endDate, 'YYYY-MM-DD'),
    startDateTime: startDate,
    endDateTime: endDate,
  };
};

export const isDateWithinEventSchedule = (selectedDate: string, eventData: EventData | null): { isValid: boolean; message?: string } => {
  if (!eventData?.schedule) {
    return { isValid: false, message: 'Event data not available' };
  }

  const constraints = getEventDateConstraints(eventData);

  if (!constraints.minDate || !constraints.maxDate) {
    return { isValid: false, message: 'Invalid event schedule' };
  }

  const selected = dayjs(selectedDate);
  const min = dayjs(constraints.minDate);
  const max = dayjs(constraints.maxDate);

  if (selected.isBefore(min, 'day')) {
    return {
      isValid: false,
      message: `Date cannot be before event start date (${dayjs(constraints.minDate).format('MMM DD, YYYY')})`,
    };
  }

  if (selected.isAfter(max, 'day')) {
    return {
      isValid: false,
      message: `Date cannot be after event end date (${dayjs(constraints.maxDate).format('MMM DD, YYYY')})`,
    };
  }

  return { isValid: true };
};

export const transformApiDataToForm = (apiData: any): Partial<FormData> => {
  if (!apiData) return {};

  if (process.env.NODE_ENV === 'development') {
    console.log('🔄 Transforming API data to form format:', apiData);
  }

  let publishType: 'instant' | 'scheduled' | 'manual' = 'instant';
  if (apiData.status === 'scheduled') {
    publishType = 'scheduled';
  } else if (apiData.status === 'inactive') {
    publishType = 'manual';
  }

  const resaleMap: { [key: string]: 'none' | 'name' | 'full' } = {
    none: 'none',
    nameSurname: 'name',
    nameSurnamePid: 'full',
  };

  let timeSlotConfig = null;
  if (apiData.timingSlots?.enabled && apiData.timingSlots.dateTimeSlots) {
    timeSlotConfig = apiData.timingSlots.dateTimeSlots.map((dateSlot: any) => ({
      date: dateSlot.date,
      timeSlots: dateSlot.timeSlots.map((slot: any, index: number) => {
        let startTime = '09:00';
        let endTime = '11:00';

        try {
          startTime = convertTimeFormat(slot.startTime, true);
          endTime = convertTimeFormat(slot.endTime, true);
        } catch (error) {
          console.warn('Error converting time format:', error, 'Using defaults');
        }

        return {
          id: slot._id || `slot-${Date.now()}-${index}`,
          quantity: parseInt(slot.quantity) || 0,
          startTime,
          endTime,
        };
      }),
    }));
  }

  const transformedData = {
    type: apiData.title || '',
    quantity: !apiData.timingSlots?.enabled ? apiData.quantity || 0 : 0,
    price: apiData.price || 0,
    tax: apiData.taxPercentage?.toString() || '',
    event: apiData.event?._id || apiData.event || '',
    status: apiData.status === 'scheduled' ? 'inactive' : 'active',
    publishSettings: {
      publishType,
      scheduledDate: apiData.scheduledPublishAt ? formatAPIDateTimeToLocal(apiData.scheduledPublishAt) : '',
    },
    features: {
      timeslot: apiData.timingSlots?.enabled || false,
      timeSlotConfig,
      repeatable: apiData.repeatable?.isRepeatable || false,
      repeatableVisits: apiData.repeatable?.visits?.toString() || '',
      resale: resaleMap[apiData.resaleProtection] || 'none',
      earlyBirdEnabled: !!apiData.timeSensitivePricing?.earlyBird,
      earlyBirdDate: apiData.timeSensitivePricing?.earlyBird?.endDate ? formatDateOnlyToLocal(apiData.timeSensitivePricing.earlyBird.endDate) : '',
      earlyBirdPrice: apiData.timeSensitivePricing?.earlyBird?.discountedPrice?.toString() || '',
      lastMinuteEnabled: !!apiData.timeSensitivePricing?.lastMinute,
      lastMinuteDate: apiData.timeSensitivePricing?.lastMinute?.startDate
        ? formatDateOnlyToLocal(apiData.timeSensitivePricing.lastMinute.startDate)
        : '',
      lastMinutePrice: apiData.timeSensitivePricing?.lastMinute?.discountedPrice?.toString() || '',
      fasttrack: apiData.fastTrackEntry?.enabled || false,
      fasttrackQuantity: apiData.fastTrackEntry?.quantity?.toString() || '',
      fasttrackPrice: apiData.fastTrackEntry?.extraPrice?.toString() || '',
      reservation: apiData.requiresReservation?.enabled || false,
      reservationType: apiData.requiresReservation?.type || '',
      transfer: !!apiData.transferFee,
      transferFee: apiData.transferFee?.toString() || '',
    },
  };

  if (process.env.NODE_ENV === 'development') {
    console.log('✅ Transformed form data:', transformedData);
  }

  return transformedData;
};

export const getUpdatedFields = (formData: FormData, originalData: any): Partial<any> => {
  const updatedFields: any = { id: originalData._id };

  if (formData.type !== originalData.title) updatedFields.title = formData.type;
  if (formData.price !== originalData.price) updatedFields.price = formData.price;
  if (formData.tax !== originalData.taxPercentage?.toString()) updatedFields.taxPercentage = parseFloat(formData.tax) || 0;
  if (formData.event !== originalData.event?._id && formData.event !== originalData.event) updatedFields.event = formData.event;

  if (!formData.features.timeslot && formData.quantity !== originalData.quantity) {
    updatedFields.quantity = formData.quantity;
  }

  const publishType = formData.publishSettings.publishType;
  let newStatus = 'active';
  if (publishType === 'manual') newStatus = 'inactive';
  if (publishType === 'scheduled') newStatus = 'scheduled';

  if (newStatus !== originalData.status) {
    updatedFields.status = newStatus;
  }

  if (publishType === 'scheduled' && formData.publishSettings.scheduledDate) {
    const newScheduledDate = formatDateTimeForAPI(formData.publishSettings.scheduledDate);
    if (newScheduledDate !== originalData.scheduledPublishAt) {
      updatedFields.scheduledPublishAt = newScheduledDate;
    }
  }

  if (formData.features.timeslot !== originalData.timingSlots?.enabled) {
    updatedFields.timingSlots = {
      enabled: formData.features.timeslot,
      dateTimeSlots: formData.features.timeslot ? formData.features.timeSlotConfig || [] : [],
    };
  } else if (
    formData.features.timeslot &&
    JSON.stringify(formData.features.timeSlotConfig) !== JSON.stringify(originalData.timingSlots?.dateTimeSlots)
  ) {
    updatedFields.timingSlots = {
      enabled: true,
      dateTimeSlots: formData.features.timeSlotConfig || [],
    };
  }

  const originalRepeatable = originalData.repeatable?.isRepeatable || false;
  const originalRepeatableVisits = originalData.repeatable?.visits || 1;
  if (formData.features.repeatable !== originalRepeatable) {
    updatedFields.repeatable = {
      isRepeatable: formData.features.repeatable,
      visits: formData.features.repeatable ? parseInt(formData.features.repeatableVisits) || 1 : 1,
    };
  } else if (formData.features.repeatable && parseInt(formData.features.repeatableVisits) !== originalRepeatableVisits) {
    updatedFields.repeatable = {
      isRepeatable: true,
      visits: parseInt(formData.features.repeatableVisits) || 1,
    };
  }

  const resaleMap: { [key: string]: string } = {
    none: 'none',
    name: 'nameSurname',
    full: 'nameSurnamePid',
  };
  const newResaleProtection = resaleMap[formData.features.resale] || 'none';
  if (newResaleProtection !== originalData.resaleProtection) {
    updatedFields.resaleProtection = newResaleProtection;
  }

  const originalTransferFee = originalData.transferFee || 0;
  const newTransferFee = formData.features.transfer ? parseFloat(formData.features.transferFee) || 0 : 0;
  if ((!formData.features.transfer && originalTransferFee > 0) || (formData.features.transfer && newTransferFee !== originalTransferFee)) {
    if (formData.features.transfer && newTransferFee > 0) {
      updatedFields.transferFee = newTransferFee;
    } else {
      updatedFields.transferFee = null;
    }
  }

  const originalEarlyBird = originalData.timeSensitivePricing?.earlyBird;
  const originalLastMinute = originalData.timeSensitivePricing?.lastMinute;
  const hasEarlyBirdChanged = formData.features.earlyBirdEnabled !== !!originalEarlyBird;
  const hasLastMinuteChanged = formData.features.lastMinuteEnabled !== !!originalLastMinute;

  let earlyBirdDateChanged = false;
  let earlyBirdPriceChanged = false;
  let lastMinuteDateChanged = false;
  let lastMinutePriceChanged = false;

  if (formData.features.earlyBirdEnabled && originalEarlyBird) {
    const newEarlyBirdDate = formatDateForAPI(formData.features.earlyBirdDate);
    const newEarlyBirdPrice = parseFloat(formData.features.earlyBirdPrice);
    earlyBirdDateChanged = newEarlyBirdDate !== originalEarlyBird.endDate;
    earlyBirdPriceChanged = newEarlyBirdPrice !== originalEarlyBird.discountedPrice;
  }

  if (formData.features.lastMinuteEnabled && originalLastMinute) {
    const newLastMinuteDate = formatDateForAPI(formData.features.lastMinuteDate);
    const newLastMinutePrice = parseFloat(formData.features.lastMinutePrice);
    lastMinuteDateChanged = newLastMinuteDate !== originalLastMinute.startDate;
    lastMinutePriceChanged = newLastMinutePrice !== originalLastMinute.discountedPrice;
  }

  if (
    hasEarlyBirdChanged ||
    hasLastMinuteChanged ||
    earlyBirdDateChanged ||
    earlyBirdPriceChanged ||
    lastMinuteDateChanged ||
    lastMinutePriceChanged
  ) {
    const timeSensitivePricing: any = {};

    if (formData.features.earlyBirdEnabled) {
      timeSensitivePricing.earlyBird = {
        endDate: formatDateForAPI(formData.features.earlyBirdDate),
        discountedPrice: parseFloat(formData.features.earlyBirdPrice),
      };
    }

    if (formData.features.lastMinuteEnabled) {
      timeSensitivePricing.lastMinute = {
        startDate: formatDateForAPI(formData.features.lastMinuteDate),
        discountedPrice: parseFloat(formData.features.lastMinutePrice),
      };
    }

    if (Object.keys(timeSensitivePricing).length > 0) {
      updatedFields.timeSensitivePricing = timeSensitivePricing;
    } else {
      updatedFields.timeSensitivePricing = null;
    }
  }

  const originalFastTrack = originalData.fastTrackEntry?.enabled || false;
  const originalFastTrackQty = originalData.fastTrackEntry?.quantity || 0;
  const originalFastTrackPrice = originalData.fastTrackEntry?.extraPrice || 0;

  if (formData.features.fasttrack !== originalFastTrack) {
    updatedFields.fastTrackEntry = {
      enabled: formData.features.fasttrack,
      quantity: formData.features.fasttrack ? parseInt(formData.features.fasttrackQuantity) || 0 : 0,
      extraPrice: formData.features.fasttrack ? parseFloat(formData.features.fasttrackPrice) || 0 : 0,
    };
  } else if (formData.features.fasttrack) {
    const newFastTrackQty = parseInt(formData.features.fasttrackQuantity) || 0;
    const newFastTrackPrice = parseFloat(formData.features.fasttrackPrice) || 0;
    if (newFastTrackQty !== originalFastTrackQty || newFastTrackPrice !== originalFastTrackPrice) {
      updatedFields.fastTrackEntry = {
        enabled: true,
        quantity: newFastTrackQty,
        extraPrice: newFastTrackPrice,
      };
    }
  }

  const originalReservation = originalData.requiresReservation?.enabled || false;
  const originalReservationType = originalData.requiresReservation?.type || '';

  if (formData.features.reservation !== originalReservation) {
    updatedFields.requiresReservation = {
      enabled: formData.features.reservation,
      type: formData.features.reservation ? formData.features.reservationType || 'any' : '',
    };
  } else if (formData.features.reservation && formData.features.reservationType !== originalReservationType) {
    updatedFields.requiresReservation = {
      enabled: true,
      type: formData.features.reservationType || 'any',
    };
  }

  return updatedFields;
};

export const transformTicketPayload = (formData: FormData, editMode: boolean = false, selectedDataId?: string, originalData?: any): any => {
  if (editMode && originalData) {
    return getUpdatedFields(formData, originalData);
  }

  let status = 'active';
  if (formData.publishSettings.publishType === 'scheduled') {
    status = 'scheduled';
  } else if (formData.publishSettings.publishType === 'manual') {
    status = 'inactive';
  }

  const payload: TicketPayload = {
    title: formData.type,
    price: formData.price,
    taxPercentage: parseInt(formData.tax),
    event: formData.event,
    status: status,
    timingSlots: {
      enabled: false,
    },
    repeatable: {
      isRepeatable: false,
    },
    resaleProtection: 'none',
    fastTrackEntry: {
      enabled: false,
    },
    requiresReservation: {
      enabled: false,
    },
  };

  if (editMode && selectedDataId) {
    payload.id = selectedDataId;
  }

  if (!formData.features.timeslot) {
    payload.quantity = formData.quantity;
  }

  if (status === 'scheduled' && formData.publishSettings.scheduledDate) {
    payload.scheduledPublishAt = formatDateTimeForAPI(formData.publishSettings.scheduledDate);
  }

  if (formData.features.timeslot) {
    payload.timingSlots = {
      enabled: true,
      dateTimeSlots: formData.features.timeSlotConfig || [],
    };
  }

  if (formData.features.repeatable) {
    payload.repeatable = {
      isRepeatable: true,
      visits: parseInt(formData.features.repeatableVisits) || 1,
    };
  }

  const resaleMap: { [key: string]: string } = {
    none: 'none',
    name: 'nameSurname',
    full: 'nameSurnamePid',
  };
  payload.resaleProtection = resaleMap[formData.features.resale] || 'none';

  if (formData.features.transfer && formData.features.transferFee) {
    payload.transferFee = parseFloat(formData.features.transferFee);
  }

  const timeSensitivePricing: any = {};
  if (formData.features.earlyBirdEnabled) {
    timeSensitivePricing.earlyBird = {
      endDate: formatDateForAPI(formData.features.earlyBirdDate),
      discountedPrice: parseFloat(formData.features.earlyBirdPrice),
    };
  }
  if (formData.features.lastMinuteEnabled) {
    timeSensitivePricing.lastMinute = {
      startDate: formatDateForAPI(formData.features.lastMinuteDate),
      discountedPrice: parseFloat(formData.features.lastMinutePrice),
    };
  }
  if (Object.keys(timeSensitivePricing).length > 0) {
    payload.timeSensitivePricing = timeSensitivePricing;
  }

  if (formData.features.fasttrack) {
    payload.fastTrackEntry = {
      enabled: true,
      quantity: parseInt(formData.features.fasttrackQuantity) || 0,
      extraPrice: parseFloat(formData.features.fasttrackPrice) || 0,
    };
  }

  if (formData.features.reservation) {
    payload.requiresReservation = {
      enabled: true,
      type: formData.features.reservationType || 'any',
    };
  }

  return payload;
};
