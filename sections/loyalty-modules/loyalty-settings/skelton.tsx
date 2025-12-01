import { Card, CardContent, CardHeader } from '@/components/ui/card';

export const ClubTitleSkeleton = () => (
  <div>
    <h2 className="mb-2.5 h-5 w-48 animate-pulse rounded-xl bg-gray-200 text-xl font-semibold dark:bg-gray-700"></h2>
    <div className="flex w-full items-center justify-between gap-4">
      <div className="max-w-sm flex-1">
        <div className="h-9 w-full animate-pulse rounded-md bg-gray-200 dark:bg-gray-700"></div>
      </div>
      <div className="h-10 w-24 animate-pulse rounded-md bg-gray-300 dark:bg-gray-600"></div>
    </div>
  </div>
);

export const LoyaltyModelSkeleton = () => (
  <div>
    <h2 className="mb-4 h-6 w-64 animate-pulse rounded bg-gray-200 text-xl font-semibold dark:bg-gray-700"></h2>
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {[1, 2, 3].map((i) => (
        <Card key={i} className="dark:bg-secondary border-muted border">
          <CardHeader>
            <div className="flex items-center gap-2">
              <div className="h-5 w-5 animate-pulse rounded-full bg-gray-300 dark:bg-gray-600"></div>
              <div className="h-6 w-24 animate-pulse rounded bg-gray-300 dark:bg-gray-600"></div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="mb-2 h-4 w-full animate-pulse rounded bg-gray-300 dark:bg-gray-600"></div>
            <div className="h-4 w-3/4 animate-pulse rounded bg-gray-300 dark:bg-gray-600"></div>
          </CardContent>
        </Card>
      ))}
    </div>
    <div className="mt-5 flex items-center justify-between">
      <div className="h-4 w-1/2 animate-pulse rounded bg-gray-200 dark:bg-gray-700"></div>
      <div className="h-10 w-24 animate-pulse rounded-md bg-gray-300 dark:bg-gray-600"></div>
    </div>
  </div>
);
