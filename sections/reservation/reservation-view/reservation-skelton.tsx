import React from 'react';

export default function ReservationSkelton() {
  return (
    <>
      <div className="flex animate-pulse items-center justify-between">
        <div>
          <div className="mb-3 h-7 w-32 rounded bg-gray-200 dark:bg-gray-700"></div>

          <div className="flex gap-12">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i}>
                <div className="mb-1 h-4 w-20 rounded bg-gray-200 dark:bg-gray-700"></div>
                <div className="h-5 w-24 rounded bg-gray-300 dark:bg-gray-600"></div>
              </div>
            ))}
          </div>
        </div>

        <div className="h-8 w-8 rounded-full bg-gray-300 dark:bg-gray-600"></div>
      </div>
    </>
  );
}
