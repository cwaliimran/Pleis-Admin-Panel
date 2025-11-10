import React from 'react';
import { Skeleton } from './skeleton';

export default function FieldSkeleton() {
  return (
    <>
      <div className="mt-2 w-full space-y-2 md:w-full">
        <Skeleton className="ml-1 h-3 w-20 flex-1 cursor-not-allowed rounded-4xl border-gray-200 px-5" />
        <Skeleton className="h-8 flex-1 cursor-not-allowed rounded-4xl border-gray-200 px-5" />
      </div>
    </>
  );
}
