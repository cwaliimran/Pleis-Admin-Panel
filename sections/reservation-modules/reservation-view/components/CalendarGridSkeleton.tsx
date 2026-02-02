import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export default function CalendarGridSkeleton() {
  return (
    <div>
      {/* Header Card Skeleton */}
      <Card className="mb-4 border-gray-300 bg-gray-100 dark:border-zinc-700 dark:bg-zinc-900">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Skeleton className="h-5 w-5 rounded bg-gray-300 dark:bg-zinc-700" />
              <Skeleton className="h-9 w-40 rounded bg-gray-300 dark:bg-zinc-700" />
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Calendar Grid Skeleton */}
      <div className="max-w-full">
        <div className="max-h-150 overflow-auto rounded-lg border border-gray-300 bg-gray-100 dark:border-zinc-700 dark:bg-zinc-900">
          <table className="w-full border-collapse text-sm">
            <thead className="sticky top-0 z-20 bg-gray-200 dark:bg-zinc-800">
              <tr>
                <th className="sticky left-0 z-20 min-w-20 border border-gray-300 bg-gray-200 p-2 text-left dark:border-zinc-700 dark:bg-zinc-800">
                  <Skeleton className="h-4 w-12 bg-gray-300 dark:bg-zinc-600" />
                </th>
                {Array.from({ length: 12 }).map((_, i) => (
                  <th key={i} className="min-w-22.5 border border-gray-300 p-2 dark:border-zinc-700">
                    <Skeleton className="h-4 w-16 bg-gray-300 dark:bg-zinc-600" />
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {Array.from({ length: 4 }).map((_, rowIdx) => (
                <tr key={rowIdx}>
                  <td className="sticky left-0 z-10 h-14 border border-gray-300 bg-gray-200 p-2 dark:border-zinc-700 dark:bg-zinc-800">
                    <Skeleton className="h-4 w-16 bg-gray-300 dark:bg-zinc-600" />
                  </td>
                  {Array.from({ length: 12 }).map((_, colIdx) => (
                    <td key={colIdx} className="border border-gray-300 bg-white p-2 dark:border-zinc-700 dark:bg-zinc-950">
                      {/* Randomly show some skeleton booking cards */}
                      {(rowIdx + colIdx) % 4 === 0 && (
                        <div className="relative h-full overflow-hidden rounded border border-gray-200 bg-gray-50 p-2 dark:border-zinc-600 dark:bg-zinc-800/80">
                          <Skeleton className="absolute top-0 right-0 h-5 w-16 rounded-none rounded-tr-xs rounded-bl-md bg-gray-300 dark:bg-zinc-600" />
                          <div className="mt-4 space-y-2">
                            <Skeleton className="h-3 w-14 bg-gray-300 dark:bg-zinc-600" />
                            <Skeleton className="h-3 w-20 bg-gray-300 dark:bg-zinc-600" />
                          </div>
                        </div>
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Stats Card Skeleton */}
      <Card className="mt-4 border-gray-300 bg-gray-100 dark:border-zinc-700 dark:bg-zinc-900">
        <CardContent className="p-4">
          <div className="grid grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i}>
                <Skeleton className="mb-2 h-3 w-20 bg-gray-300 dark:bg-zinc-700" />
                <Skeleton className="h-8 w-12 bg-gray-300 dark:bg-zinc-600" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
