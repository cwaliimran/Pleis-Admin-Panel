'use client';

import { FC } from 'react';

const AppLoading: FC = () => {
  return (
    <div className="flex min-h-screen items-center justify-center dark:bg-black">
      <div className="text-center">
        <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-b-2 border-gray-900 dark:border-gray-100"></div>
        <p className="text-gray-600 dark:text-gray-400">Loading...</p>
      </div>
    </div>
  );
};

export { AppLoading };
