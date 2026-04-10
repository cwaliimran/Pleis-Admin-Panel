'use client';

import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export const MembersLoyaltySkeleton: React.FC = () => {
  return (
    <>
      {/* Header Skeleton */}
      <Card className="dark:bg-secondary mt-5 shadow-md">
        <CardHeader>
          <div className="w-full">
            <div>
              <Skeleton className="h-8 w-48 mb-2" />
              <Skeleton className="h-4 w-32" />
            </div>

            <div className="mt-4 space-y-2">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-2 w-full" />
              <Skeleton className="h-3 w-40" />
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4">
            {Array.from({ length: 10 }).map((_, i) => (
              <Card key={i} className="dark:bg-secondary gap-2 shadow-sm">
                <CardHeader>
                  <Skeleton className="h-4 w-24" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-6 w-16" />
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Analytics Charts Skeleton */}
      <div className="mt-5 grid grid-cols-12 gap-4">
        {Array.from({ length: 2 }).map((_, i) => (
          <div key={i} className="col-span-12 md:col-span-6">
            <Card className="dark:bg-secondary shadow-md">
              <CardHeader>
                <Skeleton className="h-6 w-40" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-64 w-full" />
              </CardContent>
            </Card>
          </div>
        ))}
      </div>
    </>
  );
};
