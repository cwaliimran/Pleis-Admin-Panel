import { ProcessedBooking, ReservationData } from './types';

/**
 * Generate time slots for the grid (24 hours in 15-minute intervals)
 * Returns array of time strings like "12:00 AM", "12:15 AM", etc.
 */
export const generateTimeSlots = (): string[] => {
  const slots: string[] = [];
  // 24 hours * 4 intervals per hour = 96 intervals
  for (let i = 0; i < 24 * 4; i++) {
    const totalMinutes = i * 15;
    const hour = Math.floor(totalMinutes / 60);
    const minute = totalMinutes % 60;
    const ampm = hour < 12 ? 'AM' : 'PM';
    const displayHour = hour % 12 === 0 ? 12 : hour % 12;
    const displayMinute = minute.toString().padStart(2, '0');
    slots.push(`${displayHour}:${displayMinute} ${ampm}`);
  }
  return slots;
};

/**
 * Convert time string (e.g., "09:00 PM") to grid index
 * Based on 24-hour grid starting from 12:00 AM
 */
export const getTimeIndex = (timeStr: string): number => {
  const [time, period] = timeStr.split(' ');
  const [hour, minute] = time.split(':').map(Number);
  let hour24 = hour;
  if (period === 'PM' && hour !== 12) hour24 += 12;
  if (period === 'AM' && hour === 12) hour24 = 0;
  const totalMinutes = hour24 * 60 + minute;
  return Math.floor(totalMinutes / 15);
};

/**
 * Extract unique reservation types from API data
 */
export const extractReservationTypes = (reservations: ReservationData[]): string[] => {
  if (!reservations || reservations.length === 0) return [];
  const types = new Set<string>();
  reservations.forEach((reservation) => {
    if (reservation.reservation?.reservationType) {
      types.add(reservation.reservation.reservationType);
    }
  });
  return Array.from(types).sort();
};

/**
 * Process reservations into grouped bookings for the grid
 * Groups bookings by reservationType and merges overlapping time slots
 * e.g., if one booking is 12:30 AM - 01:30 AM and another is 01:00 AM - 02:00 AM,
 * they will be merged into a single grid cell spanning 12:30 AM - 02:00 AM
 */
export const processReservationsToBookings = (reservations: ReservationData[]): ProcessedBooking[] => {
  if (!reservations || reservations.length === 0) return [];

  // First, collect all time slots with their reservations grouped by type
  const typeBookings = new Map<
    string,
    Array<{
      startTime: string;
      endTime: string;
      startIdx: number;
      endIdx: number;
      reservation: ReservationData;
    }>
  >();

  reservations.forEach((reservation) => {
    const reservationType = reservation.reservation?.reservationType;
    if (!reservationType) return;

    reservation.timingSlots?.dateTimeSlots?.forEach((dateSlot) => {
      dateSlot.timeSlots?.forEach((timeSlot) => {
        if (!typeBookings.has(reservationType)) {
          typeBookings.set(reservationType, []);
        }

        const startIdx = getTimeIndex(timeSlot.startTime);
        const endIdx = getTimeIndex(timeSlot.endTime);

        typeBookings.get(reservationType)!.push({
          startTime: timeSlot.startTime,
          endTime: timeSlot.endTime,
          startIdx,
          endIdx,
          reservation,
        });
      });
    });
  });

  // Now merge overlapping intervals for each type
  const result: ProcessedBooking[] = [];

  typeBookings.forEach((bookings, type) => {
    if (bookings.length === 0) return;

    // Sort by start index
    bookings.sort((a, b) => a.startIdx - b.startIdx);

    // Merge overlapping intervals using interval merging algorithm
    const merged: Array<{
      startIdx: number;
      endIdx: number;
      startTime: string;
      endTime: string;
      reservations: ReservationData[];
    }> = [];

    for (const booking of bookings) {
      if (merged.length === 0) {
        merged.push({
          startIdx: booking.startIdx,
          endIdx: booking.endIdx,
          startTime: booking.startTime,
          endTime: booking.endTime,
          reservations: [booking.reservation],
        });
      } else {
        const last = merged[merged.length - 1];
        // Check if current booking overlaps with the last merged interval
        // Two intervals overlap if: booking.startIdx <= last.endIdx
        if (booking.startIdx <= last.endIdx) {
          // Merge: extend the end if needed and add reservation
          if (booking.endIdx > last.endIdx) {
            last.endIdx = booking.endIdx;
            last.endTime = booking.endTime;
          }
          last.reservations.push(booking.reservation);
        } else {
          // No overlap, create new merged interval
          merged.push({
            startIdx: booking.startIdx,
            endIdx: booking.endIdx,
            startTime: booking.startTime,
            endTime: booking.endTime,
            reservations: [booking.reservation],
          });
        }
      }
    }

    // Convert merged intervals to ProcessedBooking
    for (const interval of merged) {
      const slotKey = `${type}-${interval.startTime}-${interval.endTime}`;
      const totalPartySize = interval.reservations.reduce((sum, r) => sum + r.partySize, 0);

      result.push({
        type,
        startTime: interval.startTime,
        endTime: interval.endTime,
        slotKey,
        bookings: interval.reservations,
        totalPartySize,
        bookingCount: interval.reservations.length,
      });
    }
  });

  return result;
};

/**
 * Get processed booking at a specific slot
 * Uses inclusive end time to ensure visual coverage matches the booking end time
 */
export const getRequestAtSlot = (processedBookings: ProcessedBooking[], type: string, timeIdx: number): ProcessedBooking | undefined => {
  return processedBookings.find((booking) => {
    if (booking.type !== type) return false;
    const startIdx = getTimeIndex(booking.startTime);
    const endIdx = getTimeIndex(booking.endTime);
    // Use inclusive end (<=) so the booking visually covers up to and including the end time column
    return timeIdx >= startIdx && timeIdx <= endIdx;
  });
};

/**
 * Check if the given time index is the start of a booking
 */
export const isRequestStart = (processedBookings: ProcessedBooking[], type: string, timeIdx: number): boolean => {
  const request = getRequestAtSlot(processedBookings, type, timeIdx);
  if (!request) return false;
  return getTimeIndex(request.startTime) === timeIdx;
};

/**
 * Get the span (number of columns) of a booking
 * Adds 1 to include the end time column in the visual span
 * e.g., 04:00 PM to 05:00 PM = 5 columns (4:00, 4:15, 4:30, 4:45, 5:00)
 */
export const getRequestSpan = (processedBookings: ProcessedBooking[], type: string, timeIdx: number): number => {
  const request = getRequestAtSlot(processedBookings, type, timeIdx);
  if (!request) return 0;
  const startIdx = getTimeIndex(request.startTime);
  const endIdx = getTimeIndex(request.endTime);
  // Add 1 to include the end time column in the span
  return endIdx - startIdx + 1;
};

/**
 * Calculate total covers (party sizes) from reservations
 */
export const calculateTotalCovers = (reservations: ReservationData[]): number => {
  return reservations.reduce((acc, res) => acc + res.partySize, 0);
};

/**
 * Calculate average party size from reservations
 */
export const calculateAvgPartySize = (reservations: ReservationData[]): string => {
  if (reservations.length === 0) return '0';
  const totalCovers = calculateTotalCovers(reservations);
  return (totalCovers / reservations.length).toFixed(1);
};

// ============================================
// Time Conversion Helpers
// ============================================

/**
 * Convert 12-hour format (02:30 PM) to 24-hour format (14:30) for input elements
 */
export const convert12To24 = (time12: string): string => {
  if (!time12) return '';
  const match = time12.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
  if (!match) return '';
  let hours = parseInt(match[1], 10);
  const minutes = match[2];
  const period = match[3].toUpperCase();
  if (period === 'PM' && hours !== 12) hours += 12;
  if (period === 'AM' && hours === 12) hours = 0;
  return `${hours.toString().padStart(2, '0')}:${minutes}`;
};

/**
 * Convert 24-hour format (14:30) to 12-hour format (02:30 PM) for display/API
 */
export const convert24To12 = (time24: string): string => {
  if (!time24) return '';
  const [hoursStr, minutes] = time24.split(':');
  let hours = parseInt(hoursStr, 10);
  const period = hours >= 12 ? 'PM' : 'AM';
  if (hours === 0) hours = 12;
  else if (hours > 12) hours -= 12;
  return `${hours.toString().padStart(2, '0')}:${minutes} ${period}`;
};

/**
 * Format time to ensure leading zeros (e.g., "2:30 AM" -> "02:30 AM")
 */
export const formatTimeWithLeadingZero = (time: string): string => {
  if (!time) return '';
  const match = time.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
  if (!match) return time;
  const hours = parseInt(match[1], 10);
  const minutes = match[2];
  const period = match[3].toUpperCase();
  return `${hours.toString().padStart(2, '0')}:${minutes} ${period}`;
};
