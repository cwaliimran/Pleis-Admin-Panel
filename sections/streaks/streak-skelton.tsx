import React from 'react';

export default function StreakSkelton() {
  return (
    <>
      {[1, 2].map((_, idx) => (
        <div
          key={idx}
          className="card dark:bg-secondary mb-4 animate-pulse rounded-md border border-gray-200 bg-white px-4 py-3 shadow-sm dark:border-none"
        >
          <div className="card-body">
            <div className="flex items-center justify-start gap-4">
              <div className="flex size-10 items-center justify-center rounded-md bg-gray-300 dark:bg-gray-700" />
              <div>
                <div className="mb-2 h-5 w-32 rounded bg-gray-200 dark:bg-gray-600" />
                <div className="mb-1 h-4 w-20 rounded bg-gray-100 dark:bg-gray-700" />
              </div>
            </div>
          </div>
        </div>
      ))}
    </>
  );
}
