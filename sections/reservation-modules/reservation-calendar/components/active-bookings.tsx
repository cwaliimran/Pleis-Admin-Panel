import { Clock, Phone, Users } from 'lucide-react';
import { useMemo } from 'react';
import { normalizeTimeTo24 } from '../../reservation-view/helpers';
import { ActiveBookingsProps, CalendarReservation } from './types';

/**
 * Parse time string (e.g., "05:00 PM") to minutes since midnight
 */
const parseTimeToMinutes = (timeStr: string): number => {
  const normalized = normalizeTimeTo24(timeStr);
  if (!normalized) return 0;

  const [hourStr, minuteStr] = normalized.split(':');
  const hour24 = Number(hourStr);
  const minutes = Number(minuteStr);
  return hour24 * 60 + minutes;
};

/**
 * Check if current time falls within the booking time range
 */
const isBookingActive = (booking: CalendarReservation): boolean => {
  const timeSlot = booking.timingSlots?.dateTimeSlots?.[0]?.timeSlots?.[0];
  const bookingDate = booking.timingSlots?.dateTimeSlots?.[0]?.date;

  if (!timeSlot || !bookingDate) return false;

  const now = new Date();
  const today = now.toISOString().split('T')[0];

  // Only show bookings for today
  if (bookingDate !== today) return false;

  // Only show confirmed bookings
  if (booking.status !== 'confirmed') return false;

  const currentMinutes = now.getHours() * 60 + now.getMinutes();
  const startMinutes = parseTimeToMinutes(timeSlot.startTime);
  const endMinutes = parseTimeToMinutes(timeSlot.endTime);

  // Handle overnight bookings (e.g., 11:00 PM - 02:00 AM)
  if (endMinutes < startMinutes) {
    return currentMinutes >= startMinutes || currentMinutes <= endMinutes;
  }

  return currentMinutes >= startMinutes && currentMinutes <= endMinutes;
};

export const ActiveBookings: React.FC<ActiveBookingsProps> = ({ bookings }) => {
  // Filter bookings to only show active ones (current time within booking time range)
  const activeBookings = useMemo(() => {
    return bookings.filter(isBookingActive);
  }, [bookings]);

  if (activeBookings.length === 0) {
    return (
      <div className="rounded-xl border bg-white p-4 dark:bg-[#1E1E1E]">
        <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
          <Clock className="h-5 w-5" />
          <h3 className="font-semibold">No Active Bookings</h3>
        </div>
        <p className="mt-2 text-sm text-gray-400 dark:text-gray-500">No bookings are currently active at this time.</p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border bg-white p-4 dark:bg-[#1E1E1E]">
      <div className="mb-4 flex items-center gap-2 text-gray-900 dark:text-gray-100">
        <Clock className="h-5 w-5 text-green-600 dark:text-green-400" />
        <h3 className="text-lg font-semibold">Active Bookings ({activeBookings.length})</h3>
      </div>

      <div className="max-h-80 space-y-4 overflow-y-auto">
        {activeBookings.map((booking: CalendarReservation) => {
          const timeSlot = booking.timingSlots?.dateTimeSlots?.[0]?.timeSlots?.[0];
          const startTime = normalizeTimeTo24(timeSlot?.startTime || '');
          const endTime = normalizeTimeTo24(timeSlot?.endTime || '');
          const customerName = `${booking.user?.firstName || ''} ${booking.user?.lastName || ''}`.trim();
          const phone = booking.user?.phoneNumber ? `${booking.user.phoneNumber.code}${booking.user.phoneNumber.number}` : '';

          return (
            <div
              key={booking._id}
              className="space-y-3 rounded-lg border-2 border-green-200 bg-green-50 p-4 dark:border-green-800 dark:bg-green-900/20"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg border-2 border-green-200 bg-white dark:border-green-600 dark:bg-gray-700">
                    <span className="text-xl font-bold text-gray-900 dark:text-gray-100">{booking.partySize}</span>
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{customerName || 'Unknown Customer'}</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {booking.reservation?.reservationType} · {startTime} - {endTime}
                    </p>
                  </div>
                </div>
                <span className="rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-700 dark:bg-green-900/40 dark:text-green-300">
                  Active
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-4 text-sm">
                <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                  <Users className="h-4 w-4" />
                  <span className="font-medium">{booking.partySize} guests</span>
                </div>
                {phone && (
                  <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                    <Phone className="h-4 w-4" />
                    <span>{phone}</span>
                  </div>
                )}
                {booking.member && (
                  <span className="rounded bg-yellow-100 px-2 py-0.5 text-xs font-medium text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300">
                    {booking.member}
                  </span>
                )}
              </div>

              {booking.eventTitle && <div className="text-xs text-gray-500 dark:text-gray-400">Event: {booking.eventTitle}</div>}

              {booking.notes && (
                <div className="border-t border-green-200 pt-2 dark:border-green-800">
                  <p className="text-sm text-gray-600 italic dark:text-gray-400">{booking.notes}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
