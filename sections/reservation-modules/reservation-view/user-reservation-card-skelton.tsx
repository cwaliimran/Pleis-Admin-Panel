import React from 'react';

export default function UserReservationCardSkelton({ count = 1 }: { count?: number }) {
  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className="animate-pulse rounded-lg border border-gray-200 bg-gray-50 px-4 py-5 shadow-sm dark:border-[#3c3a3aae] dark:bg-[#222121]"
        >
          {/* Header */}
          <div className="mb-4 flex items-center justify-between">
            {/* User details */}
            <div className="flex items-center justify-start gap-2">
              <div className="h-5 w-32 rounded bg-gray-300 dark:bg-gray-600"></div>
              <div className="h-5 w-16 rounded bg-gray-300 dark:bg-gray-600"></div>
            </div>

            {/* Date and Time */}
            <div className="space-y-1 text-right">
              <div className="h-4 w-20 rounded bg-gray-300 dark:bg-gray-600"></div>
              <div className="h-4 w-28 rounded bg-gray-300 dark:bg-gray-600"></div>
            </div>
          </div>

          {/* Reservation Details */}
          <div className="mb-4 grid grid-cols-3 gap-3">
            <div>
              <div className="mb-1 h-3 w-24 rounded bg-gray-300 dark:bg-gray-600"></div>
              <div className="h-4 w-20 rounded bg-gray-300 dark:bg-gray-600"></div>
            </div>
            <div>
              <div className="mb-1 h-3 w-24 rounded bg-gray-300 dark:bg-gray-600"></div>
              <div className="h-4 w-16 rounded bg-gray-300 dark:bg-gray-600"></div>
            </div>
            <div>
              <div className="mb-1 h-3 w-24 rounded bg-gray-300 dark:bg-gray-600"></div>
              <div className="h-4 w-24 rounded bg-gray-300 dark:bg-gray-600"></div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-4 grid grid-cols-3 gap-2">
            <div className="h-9 rounded-md bg-gray-300 dark:bg-gray-600"></div>
            <div className="h-9 rounded-md bg-gray-300 dark:bg-gray-600"></div>
            <div className="h-9 rounded-md bg-gray-300 dark:bg-gray-600"></div>
          </div>
        </div>
      ))}
    </>
  );
}
