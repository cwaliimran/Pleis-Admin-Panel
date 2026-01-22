import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export default function NotificationCardSkelton() {
  return (
    <>
      {Array.from({ length: 4 }).map((_, idx) => (
        <Card key={idx} className="border border-gray-200 shadow dark:border-gray-800 dark:bg-[#18181c]">
          <CardHeader>
            <div className="flex items-center gap-4">
              <Skeleton className="h-16 w-16 rounded-lg" />
              <div className="min-w-0 flex-1">
                <Skeleton className="mb-2 h-5 w-32" />
                <Skeleton className="h-3 w-20" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Skeleton className="mb-2 h-4 w-full" />
            <Skeleton className="mb-2 h-4 w-3/4" />
            <div className="flex gap-2">
              <Skeleton className="h-4 w-16 rounded" />
              <Skeleton className="h-4 w-20 rounded" />
            </div>
          </CardContent>
        </Card>
      ))}
    </>
  );
}
