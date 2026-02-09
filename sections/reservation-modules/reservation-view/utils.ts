import { EventDateRange } from './types';

// ============================================
// DATE FORMATTING HELPERS
// ============================================

/**
 * Formats date to European format (dd/mm/yyyy)
 */
export const formatDateToEuropean = (dateString: string | Date): string => {
  if (!dateString) return '';
  const date = typeof dateString === 'string' ? new Date(dateString) : dateString;
  if (isNaN(date.getTime())) return String(dateString);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};

/**
 * Formats datetime string to European format with time (dd/mm/yyyy HH:mm)
 */
export const formatDateTimeToEuropean = (dateTimeString: string): string => {
  if (!dateTimeString) return '';
  const date = new Date(dateTimeString);
  if (isNaN(date.getTime())) return dateTimeString;
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  return `${day}/${month}/${year} ${hours}:${minutes}`;
};

// ============================================
// DATE/TIME PARSING & VALIDATION
// ============================================

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
 * Determines if a time (in minutes) falls within a daily operating window.
 * Handles both same-day windows (e.g., 9:00 AM to 5:00 PM) and cross-midnight windows (e.g., 10:00 PM to 2:00 AM).
 *
 * @param timeMinutes - The time to check (in minutes from midnight)
 * @param windowStartMinutes - The window start time (in minutes from midnight)
 * @param windowEndMinutes - The window end time (in minutes from midnight)
 * @returns true if the time is within the window
 */
export const isTimeInDailyWindow = (timeMinutes: number, windowStartMinutes: number, windowEndMinutes: number): boolean => {
  // Same-day window: start <= end (e.g., 09:00 to 17:00)
  if (windowStartMinutes <= windowEndMinutes) {
    return timeMinutes >= windowStartMinutes && timeMinutes <= windowEndMinutes;
  }

  // Cross-midnight window: start > end (e.g., 22:00 to 02:00)
  // Valid times are: >= start OR <= end
  return timeMinutes >= windowStartMinutes || timeMinutes <= windowEndMinutes;
};

/**
 * Converts minutes since midnight to a readable time string for error messages
 */
export const minutesToTimeString = (minutes: number): string => {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  const period = hours >= 12 ? 'PM' : 'AM';
  const displayHours = hours === 0 ? 12 : hours > 12 ? hours - 12 : hours;
  return `${String(displayHours).padStart(2, '0')}:${String(mins).padStart(2, '0')} ${period}`;
};

/**
 * CRITICAL: Validates if a time is within the event's operating window.
 *
 * For multi-day events, the start and end TIMES define a DAILY OPERATING WINDOW
 * that applies to EVERY day within the event range.
 *
 * Example: Event from "2026-02-01 12:00 AM" to "2026-02-04 09:00 AM"
 * - Daily window: 12:00 AM to 09:00 AM
 * - On ANY date within the event (Feb 1-4), only times from 12:00 AM to 09:00 AM are valid
 * - 02:00 PM on Feb 3 would be INVALID (outside the daily window)
 *
 * Special boundary handling:
 * - On START date: time must be >= event start time (within the daily window constraint)
 * - On END date: time must be <= event end time (within the daily window constraint)
 */
export const isTimeInEventRange = (time24: string, dateStr: string, eventDateRange: EventDateRange): { valid: boolean; reason?: string } => {
  // Don't validate empty fields
  if (!time24 || !dateStr) {
    return { valid: true };
  }

  if (!eventDateRange) {
    return { valid: true };
  }

  // Parse the selected date (set to midnight for date comparison)
  const selectedDate = new Date(dateStr);
  selectedDate.setHours(0, 0, 0, 0);

  const eventStartDate = new Date(eventDateRange.startDate);
  eventStartDate.setHours(0, 0, 0, 0);

  const eventEndDate = new Date(eventDateRange.endDate);
  eventEndDate.setHours(0, 0, 0, 0);

  // STEP 1: Check if date is within event range
  if (selectedDate < eventStartDate || selectedDate > eventEndDate) {
    return {
      valid: false,
      reason: 'Date is outside event range',
    };
  }

  const selectedTimeMinutes = timeToMinutes(time24);
  const eventStartMinutes = eventDateRange.startTimeMinutes;
  const eventEndMinutes = eventDateRange.endTimeMinutes;

  const isSameAsStartDate = selectedDate.getTime() === eventStartDate.getTime();
  const isSameAsEndDate = selectedDate.getTime() === eventEndDate.getTime();
  const isSingleDayEvent = eventStartDate.getTime() === eventEndDate.getTime();

  // Determine if it's a same-day window or cross-midnight window
  const isSameDayWindow = eventStartMinutes <= eventEndMinutes;

  // STEP 2: Single day event (same start and end date)
  if (isSingleDayEvent) {
    if (selectedTimeMinutes < eventStartMinutes) {
      return {
        valid: false,
        reason: `Time must be ${eventDateRange.startTime} or later`,
      };
    }
    if (selectedTimeMinutes > eventEndMinutes) {
      return {
        valid: false,
        reason: `Time must be ${eventDateRange.endTime} or earlier`,
      };
    }
    return { valid: true };
  }

  // STEP 3: Multi-day event validation
  // The daily window is defined by the event's start and end TIMES

  if (isSameDayWindow) {
    // Same-day window (e.g., 12:00 AM to 09:00 AM or 09:00 AM to 05:00 PM)
    // Valid times: startTime <= time <= endTime

    // Check if time is within the daily window
    const isInDailyWindow = selectedTimeMinutes >= eventStartMinutes && selectedTimeMinutes <= eventEndMinutes;

    if (!isInDailyWindow) {
      return {
        valid: false,
        reason: `Time must be between ${eventDateRange.startTime} and ${eventDateRange.endTime} (event operating hours)`,
      };
    }

    // Additional boundary checks for start/end dates
    if (isSameAsStartDate) {
      if (selectedTimeMinutes < eventStartMinutes) {
        return {
          valid: false,
          reason: `Time must be ${eventDateRange.startTime} or later on the event start date`,
        };
      }
    }

    if (isSameAsEndDate) {
      if (selectedTimeMinutes > eventEndMinutes) {
        return {
          valid: false,
          reason: `Time must be ${eventDateRange.endTime} or earlier on the event end date`,
        };
      }
    }
  } else {
    // Cross-midnight window (e.g., 10:00 PM to 02:00 AM)
    // Valid times: time >= startTime OR time <= endTime

    const isInDailyWindow = selectedTimeMinutes >= eventStartMinutes || selectedTimeMinutes <= eventEndMinutes;

    if (!isInDailyWindow) {
      return {
        valid: false,
        reason: `Time must be ${eventDateRange.startTime} or later, OR ${eventDateRange.endTime} or earlier (event operating hours)`,
      };
    }

    // For start date with cross-midnight: time must be >= start time (before midnight portion)
    if (isSameAsStartDate && selectedTimeMinutes < eventStartMinutes && selectedTimeMinutes > eventEndMinutes) {
      return {
        valid: false,
        reason: `On the start date, time must be ${eventDateRange.startTime} or later`,
      };
    }

    // For end date with cross-midnight: time must be <= end time (after midnight portion)
    if (isSameAsEndDate && selectedTimeMinutes > eventEndMinutes && selectedTimeMinutes < eventStartMinutes) {
      return {
        valid: false,
        reason: `On the end date, time must be ${eventDateRange.endTime} or earlier`,
      };
    }
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
