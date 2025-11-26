import React from 'react';

export default function SearchResultSkelton() {
  return (
    <div className="space-y-2 rounded-lg p-0">
      <div className="flex animate-pulse items-center justify-between rounded-md border border-gray-300 bg-white p-4 dark:border-gray-700 dark:bg-[#222222]">
        <div className="flex w-full items-center gap-4">
          <div className="flex w-full flex-col">
            <div className="mb-2 h-4 w-1/3 rounded bg-gray-300 dark:bg-gray-700" />
            <div className="mb-1 h-3 w-1/2 rounded bg-gray-200 dark:bg-gray-800" />
            <div className="h-2 w-1/4 rounded bg-gray-300 dark:bg-gray-700" />
          </div>
        </div>

        <div className="h-8 w-24 rounded bg-gray-300 dark:bg-gray-700" />
      </div>
    </div>
  );
}
