import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import React from 'react';

/**
 * Full-page skeleton loader that mirrors the dashboard layout.
 * Shown while useGetDashboardQuery is loading.
 */
const DashboardSkeleton = () => {
  return (
    <div className="mx-1 mt-5 pb-8 md:mx-4">
      {/* Top filter bar */}
      <div className="flex justify-end">
        <Skeleton className="h-10 w-80 rounded-full" />
      </div>

      {/* Stats cards row */}
      <div className="mt-5 grid grid-cols-1 gap-2 md:grid-cols-2 md:gap-x-4 md:gap-y-4 lg:grid-cols-3 xl:grid-cols-4">
        {Array.from({ length: 7 }).map((_, i) => (
          <Card key={i} className="dark:bg-secondary rounded-[8px]">
            <CardHeader>
              <Skeleton className="h-4 w-32" />
              <div className="mt-3 flex items-center justify-between">
                <Skeleton className="h-8 w-24" />
                <Skeleton className="h-6 w-16 rounded-full" />
              </div>
            </CardHeader>
          </Card>
        ))}
      </div>

      {/* Large chart */}
      <Card className="dark:bg-secondary mt-5 shadow-lg">
        <CardHeader>
          <Skeleton className="h-5 w-64" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-[250px] w-full rounded-md" />
        </CardContent>
      </Card>

      {/* 3-column row */}
      <div className="mt-5 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <Card key={i} className="dark:bg-secondary h-[450px] shadow-md">
            <CardHeader>
              <Skeleton className="h-5 w-40" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-[320px] w-full rounded-md" />
            </CardContent>
          </Card>
        ))}
      </div>

      {/* 2-column rows */}
      {[1, 2, 3].map((row) => (
        <div key={row} className="mt-5 grid grid-cols-12 gap-4">
          {[0, 1].map((col) => (
            <Card key={col} className="dark:bg-secondary col-span-12 h-[450px] shadow-lg md:col-span-6">
              <CardHeader>
                <Skeleton className="h-5 w-48" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-[320px] w-full rounded-md" />
              </CardContent>
            </Card>
          ))}
        </div>
      ))}
    </div>
  );
};

export default DashboardSkeleton;
