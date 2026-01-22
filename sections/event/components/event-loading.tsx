import React from 'react';

export default function EventLoading() {
  return (
    <>
      <div className="flex h-96 items-center justify-center text-center">
        <div>
          <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-b-2 border-gray-900 dark:border-gray-100"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    </>
  );
}
