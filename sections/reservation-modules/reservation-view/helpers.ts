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
 * Groups bookings by reservationType + startTime + endTime
 */
export const processReservationsToBookings = (reservations: ReservationData[]): ProcessedBooking[] => {
  if (!reservations || reservations.length === 0) return [];

  const bookingMap = new Map<string, ProcessedBooking>();

  reservations.forEach((reservation) => {
    const reservationType = reservation.reservation?.reservationType;
    if (!reservationType) return;

    reservation.timingSlots?.dateTimeSlots?.forEach((dateSlot) => {
      dateSlot.timeSlots?.forEach((timeSlot) => {
        const slotKey = `${reservationType}-${timeSlot.startTime}-${timeSlot.endTime}`;

        if (bookingMap.has(slotKey)) {
          const existing = bookingMap.get(slotKey)!;
          existing.bookings.push(reservation);
          existing.totalPartySize += reservation.partySize;
          existing.bookingCount += 1;
        } else {
          bookingMap.set(slotKey, {
            type: reservationType,
            startTime: timeSlot.startTime,
            endTime: timeSlot.endTime,
            slotKey,
            bookings: [reservation],
            totalPartySize: reservation.partySize,
            bookingCount: 1,
          });
        }
      });
    });
  });

  return Array.from(bookingMap.values());
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
