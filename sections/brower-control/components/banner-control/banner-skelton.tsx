import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

const BannerCardSkeleton = () => {
  return (
    <Card className="group dark:bg-secondary bg-white py-0 shadow-lg">
      <CardContent className="p-0">
        {/* Image Skeleton */}
        <div className="relative overflow-hidden rounded-t-lg">
          <Skeleton className="h-48 w-full rounded-t-lg rounded-b-none" />
        </div>

        {/* Details Skeleton */}
        <div className="space-y-4 px-4 py-5">
          <div className="flex items-start justify-between">
            <div className="flex-1 space-y-3">
              {/* Badges Skeleton */}
              <div className="flex items-center space-x-2">
                <Skeleton className="h-5 w-16 rounded-full" />
                <Skeleton className="h-5 w-16 rounded-full" />
              </div>

              {/* Title Skeleton */}
              <Skeleton className="h-6 w-3/4" />

              {/* Link Skeleton */}
              <div className="flex items-center space-x-2">
                <Skeleton className="h-4 w-4 rounded" />
                <Skeleton className="h-4 w-20" />
              </div>
            </div>

            {/* Action Buttons Skeleton */}
            <div className="ml-4 flex items-center space-x-1">
              <Skeleton className="h-8 w-8 rounded" />
              <Skeleton className="h-8 w-8 rounded" />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default BannerCardSkeleton;
