// ============================================
// RESERVATION MODAL UTILITY FUNCTIONS
// ============================================

import { EventDateRange } from './types';

/**
 * Parses event datetime string to Date object
 * Format: "2025-11-13 01:49 PM"
 */
export const parseEventDateTime = (dateTimeStr: string): Date | null => {
  if (!dateTimeStr) return null;

  try {
    const [datePart, timePart, meridiem] = dateTimeStr.split(' ');
    const [year, month, day] = datePart.split('-').map(Number);
    const [hours, minutes] = timePart.split(':').map(Number);

    let hour24 = hours;
    if (meridiem === 'PM' && hours !== 12) {
      hour24 = hours + 12;
    } else if (meridiem === 'AM' && hours === 12) {
      hour24 = 0;
    }

    return new Date(year, month - 1, day, hour24, minutes);
  } catch (error) {
    console.error('Error parsing date:', error);
    return null;
  }
};

/**
 * Formats Date to YYYY-MM-DD for input fields
 */
export const formatDateForInput = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

/**
 * Converts time string to total minutes since midnight
 * Works with both 24-hour (HH:MM) and 12-hour (HH:MM AM/PM) formats
 */
export const timeToMinutes = (timeStr: string): number => {
  if (!timeStr) return 0;

  // Check if it's 12-hour format (has AM/PM)
  if (timeStr.includes('AM') || timeStr.includes('PM')) {
    const [timePart, period] = timeStr.split(' ');
    const [hoursStr, minutesStr] = timePart.split(':');
    let hours = Number(hoursStr);
    const minutes = Number(minutesStr);

    if (period === 'PM' && hours !== 12) {
      hours += 12;
    } else if (period === 'AM' && hours === 12) {
      hours = 0;
    }

    return hours * 60 + minutes;
  }

  // 24-hour format
  const [hours, minutes] = timeStr.split(':').map(Number);
  return hours * 60 + minutes;
};

/**
 * Checks if a date string is within the event date range
 */
export const isDateInRange = (dateStr: string, startDate: Date, endDate: Date): boolean => {
  if (!dateStr) return false;

  const checkDate = new Date(dateStr);
  checkDate.setHours(0, 0, 0, 0);

  const start = new Date(startDate);
  start.setHours(0, 0, 0, 0);

  const end = new Date(endDate);
  end.setHours(0, 0, 0, 0);

  return checkDate >= start && checkDate <= end;
};

/**
 * CRITICAL: Validates if a time is within event range with EXACT minute precision
 * This checks both date AND time, including minutes
 */
export const isTimeInEventRange = (time24: string, dateStr: string, eventDateRange: EventDateRange): { valid: boolean; reason?: string } => {
  if (!time24 || !dateStr) {
    return { valid: true }; // Don't validate empty fields
  }

  if (!eventDateRange) {
    return { valid: true };
  }

  const selectedDate = new Date(dateStr);
  selectedDate.setHours(0, 0, 0, 0);

  const eventStartDate = new Date(eventDateRange.startDate);
  eventStartDate.setHours(0, 0, 0, 0);

  const eventEndDate = new Date(eventDateRange.endDate);
  eventEndDate.setHours(0, 0, 0, 0);

  const selectedTimeMinutes = timeToMinutes(time24);
  const eventStartMinutes = eventDateRange.startTimeMinutes;
  const eventEndMinutes = eventDateRange.endTimeMinutes;

  const isSameAsStartDate = selectedDate.getTime() === eventStartDate.getTime();
  const isSameAsEndDate = selectedDate.getTime() === eventEndDate.getTime();

  // CASE 1: Selected date is the event START date
  if (isSameAsStartDate) {
    // Time must be >= event start time (including exact minutes)
    if (selectedTimeMinutes < eventStartMinutes) {
      return {
        valid: false,
        reason: `Time must be ${eventDateRange.startTime} or later on this date`,
      };
    }
  }

  // CASE 2: Selected date is the event END date
  if (isSameAsEndDate) {
    // Time must be <= event end time (including exact minutes)
    if (selectedTimeMinutes > eventEndMinutes) {
      return {
        valid: false,
        reason: `Time must be ${eventDateRange.endTime} or earlier on this date`,
      };
    }
  }

  // CASE 3: Date is outside event range
  if (selectedDate < eventStartDate || selectedDate > eventEndDate) {
    return {
      valid: false,
      reason: 'Date is outside event range',
    };
  }

  return { valid: true };
};

/**
 * Checks if two time slots overlap
 */
export const doTimeSlotsOverlap = (slot1Start: string, slot1End: string, slot2Start: string, slot2End: string): boolean => {
  const slot1StartMin = timeToMinutes(slot1Start);
  const slot1EndMin = timeToMinutes(slot1End);
  const slot2StartMin = timeToMinutes(slot2Start);
  const slot2EndMin = timeToMinutes(slot2End);

  return slot2StartMin < slot1EndMin && slot2EndMin > slot1StartMin;
};

/**
 * Validates that time slots within a date don't overlap
 */
export const validateNoOverlap = (
  timeSlots: Array<{ startTime: string; endTime: string }>
): { valid: boolean; overlappingIndices?: [number, number] } => {
  for (let i = 0; i < timeSlots.length; i++) {
    for (let j = i + 1; j < timeSlots.length; j++) {
      if (doTimeSlotsOverlap(timeSlots[i].startTime, timeSlots[i].endTime, timeSlots[j].startTime, timeSlots[j].endTime)) {
        return { valid: false, overlappingIndices: [i, j] };
      }
    }
  }
  return { valid: true };
};

/**
 * Sorts time slots by start time
 */
export const sortTimeSlots = (timeSlots: Array<{ startTime: string; endTime: string }>): Array<{ startTime: string; endTime: string }> => {
  return [...timeSlots].sort((a, b) => {
    const aMinutes = timeToMinutes(a.startTime);
    const bMinutes = timeToMinutes(b.startTime);
    return aMinutes - bMinutes;
  });
};

// import { EventDateRange } from './types';

// /**
//  * Parses event datetime string to Date object
//  * Format: "2025-11-13 01:49 PM"
//  */
// export const parseEventDateTime = (dateTimeStr: string): Date | null => {
//   if (!dateTimeStr) return null;

//   try {
//     const [datePart, timePart, meridiem] = dateTimeStr.split(' ');
//     const [year, month, day] = datePart.split('-').map(Number);
//     const [hours, minutes] = timePart.split(':').map(Number);

//     let hour24 = hours;
//     if (meridiem === 'PM' && hours !== 12) {
//       hour24 = hours + 12;
//     } else if (meridiem === 'AM' && hours === 12) {
//       hour24 = 0;
//     }

//     return new Date(year, month - 1, day, hour24, minutes);
//   } catch (error) {
//     console.error('Error parsing date:', error);
//     return null;
//   }
// };

// /**
//  * Formats Date to YYYY-MM-DD for input fields
//  */
// export const formatDateForInput = (date: Date): string => {
//   const year = date.getFullYear();
//   const month = String(date.getMonth() + 1).padStart(2, '0');
//   const day = String(date.getDate()).padStart(2, '0');
//   return `${year}-${month}-${day}`;
// };

// /**
//  * Converts 24-hour time to 12-hour format with AM/PM
//  * Example: "14:30" → "02:30 PM"
//  */
// export const convertTo12HourFormat = (time24: string): string => {
//   if (!time24) return '';

//   const [hours, minutes] = time24.split(':').map(Number);
//   const period = hours >= 12 ? 'PM' : 'AM';
//   const hour12 = hours === 0 ? 12 : hours > 12 ? hours - 12 : hours;

//   return `${String(hour12).padStart(2, '0')}:${String(minutes).padStart(2, '0')} ${period}`;
// };

// /**
//  * Converts time string to total minutes since midnight
//  * Works with both 24-hour (HH:MM) and 12-hour (HH:MM AM/PM) formats
//  */
// export const timeToMinutes = (timeStr: string): number => {
//   if (!timeStr) return 0;

//   // Check if it's 12-hour format (has AM/PM)
//   if (timeStr.includes('AM') || timeStr.includes('PM')) {
//     const [timePart, period] = timeStr.split(' ');
//     let [hours, minutes] = timePart.split(':').map(Number);

//     if (period === 'PM' && hours !== 12) {
//       hours += 12;
//     } else if (period === 'AM' && hours === 12) {
//       hours = 0;
//     }

//     return hours * 60 + minutes;
//   }

//   // 24-hour format
//   const [hours, minutes] = timeStr.split(':').map(Number);
//   return hours * 60 + minutes;
// };

// /**
//  * Checks if a date string is within the event date range
//  */
// export const isDateInRange = (dateStr: string, startDate: Date, endDate: Date): boolean => {
//   if (!dateStr) return false;

//   const checkDate = new Date(dateStr);
//   checkDate.setHours(0, 0, 0, 0);

//   const start = new Date(startDate);
//   start.setHours(0, 0, 0, 0);

//   const end = new Date(endDate);
//   end.setHours(0, 0, 0, 0);

//   return checkDate >= start && checkDate <= end;
// };

// /**
//  * CRITICAL: Validates if a time is within event range with EXACT minute precision
//  * This checks both date AND time, including minutes
//  */
// export const isTimeInEventRange = (time24: string, dateStr: string, eventDateRange: EventDateRange): { valid: boolean; reason?: string } => {
//   if (!time24 || !dateStr) {
//     return { valid: true }; // Don't validate empty fields
//   }

//   if (!eventDateRange) {
//     return { valid: true };
//   }

//   const selectedDate = new Date(dateStr);
//   selectedDate.setHours(0, 0, 0, 0);

//   const eventStartDate = new Date(eventDateRange.startDate);
//   eventStartDate.setHours(0, 0, 0, 0);

//   const eventEndDate = new Date(eventDateRange.endDate);
//   eventEndDate.setHours(0, 0, 0, 0);

//   const selectedTimeMinutes = timeToMinutes(time24);
//   const eventStartMinutes = eventDateRange.startTimeMinutes;
//   const eventEndMinutes = eventDateRange.endTimeMinutes;

//   const isSameAsStartDate = selectedDate.getTime() === eventStartDate.getTime();
//   const isSameAsEndDate = selectedDate.getTime() === eventEndDate.getTime();

//   // CASE 1: Selected date is the event START date
//   if (isSameAsStartDate) {
//     // Time must be >= event start time (including exact minutes)
//     if (selectedTimeMinutes < eventStartMinutes) {
//       return {
//         valid: false,
//         reason: `Time must be ${eventDateRange.startTime} or later on this date`,
//       };
//     }
//   }

//   // CASE 2: Selected date is the event END date
//   if (isSameAsEndDate) {
//     // Time must be <= event end time (including exact minutes)
//     if (selectedTimeMinutes > eventEndMinutes) {
//       return {
//         valid: false,
//         reason: `Time must be ${eventDateRange.endTime} or earlier on this date`,
//       };
//     }
//   }

//   // CASE 3: Date is outside event range
//   if (selectedDate < eventStartDate || selectedDate > eventEndDate) {
//     return {
//       valid: false,
//       reason: 'Date is outside event range',
//     };
//   }

//   return { valid: true };
// };

// /**
//  * Checks if two time slots overlap
//  */
// export const doTimeSlotsOverlap = (slot1Start: string, slot1End: string, slot2Start: string, slot2End: string): boolean => {
//   const slot1StartMin = timeToMinutes(slot1Start);
//   const slot1EndMin = timeToMinutes(slot1End);
//   const slot2StartMin = timeToMinutes(slot2Start);
//   const slot2EndMin = timeToMinutes(slot2End);

//   return slot2StartMin < slot1EndMin && slot2EndMin > slot1StartMin;
// };

// /**
//  * Validates that time slots within a date don't overlap
//  */
// export const validateNoOverlap = (
//   timeSlots: Array<{ startTime: string; endTime: string }>
// ): { valid: boolean; overlappingIndices?: [number, number] } => {
//   for (let i = 0; i < timeSlots.length; i++) {
//     for (let j = i + 1; j < timeSlots.length; j++) {
//       if (doTimeSlotsOverlap(timeSlots[i].startTime, timeSlots[i].endTime, timeSlots[j].startTime, timeSlots[j].endTime)) {
//         return { valid: false, overlappingIndices: [i, j] };
//       }
//     }
//   }
//   return { valid: true };
// };

// /**
//  * Sorts time slots by start time
//  */
// export const sortTimeSlots = (timeSlots: Array<{ startTime: string; endTime: string }>): Array<{ startTime: string; endTime: string }> => {
//   return [...timeSlots].sort((a, b) => {
//     const aMinutes = timeToMinutes(a.startTime);
//     const bMinutes = timeToMinutes(b.startTime);
//     return aMinutes - bMinutes;
//   });
// };
