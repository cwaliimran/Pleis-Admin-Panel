import { Clock } from 'lucide-react';
import { ActiveBooking, ActiveBookingsProps } from './types';

export const ActiveBookings: React.FC<ActiveBookingsProps> = ({ bookings }) => {
  if (bookings.length === 0) return null;

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 text-gray-900 dark:text-gray-100">
        <Clock className="h-5 w-5 text-green-600 dark:text-green-400" />
        <h3 className="text-lg font-semibold">
          Active Bookings ({bookings.length})
        </h3>
      </div>

      {bookings.map((booking: ActiveBooking) => (
        <div
          key={booking.id}
          className="space-y-3 rounded-lg border-2 border-green-200 bg-green-50 p-4 dark:border-green-800 dark:bg-green-900/20"
        >
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg border-2 border-green-200 bg-white dark:border-green-600 dark:bg-gray-700">
                <span className="text-xl font-bold text-gray-900 dark:text-gray-100">
                  {booking.guests}
                </span>
              </div>
              <div>
                <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  {booking.customerName}
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {booking.table} · {booking.time}
                </p>
              </div>
            </div>
            <span className="rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-700 dark:bg-green-900/40 dark:text-green-300">
              checked-in
            </span>
          </div>

          <div className="flex items-center gap-6 text-sm">
            <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
              <span className="font-medium">Guests:</span>
              <span className="font-semibold">{booking.guests}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
              <span className="font-medium">Checked:</span>
              <span className="font-semibold text-blue-600 dark:text-blue-400">
                {booking.checkedIn}/{booking.guests}
              </span>
            </div>
            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
              <svg
                className="h-4 w-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                />
              </svg>
              <span>{booking.phone}</span>
            </div>
          </div>

          {booking.note && (
            <div className="border-t border-green-200 pt-2 dark:border-green-800">
              <p className="text-sm text-gray-600 italic dark:text-gray-400">
                {booking.note}
              </p>
            </div>
          )}

          {/* <div className="flex gap-2 pt-2">
            <button className="flex-1 rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-800">
              View Details
            </button>
            <button className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700">
              Check Out
            </button>
          </div> */}
        </div>
      ))}
    </div>
  );
};
