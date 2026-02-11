// import { Card, CardContent, CardHeader } from '@/components/ui/card';

// export const ClubTitleSkeleton = () => (
//   <div>
//     <h2 className="mb-2.5 h-5 w-48 animate-pulse rounded-xl bg-gray-200 text-xl font-semibold dark:bg-gray-700"></h2>
//     <div className="flex w-full items-center justify-between gap-4">
//       <div className="max-w-sm flex-1">
//         <div className="h-9 w-full animate-pulse rounded-md bg-gray-200 dark:bg-gray-700"></div>
//       </div>
//       <div className="h-10 w-24 animate-pulse rounded-md bg-gray-300 dark:bg-gray-600"></div>
//     </div>
//   </div>
// );

// export const LoyaltyModelSkeleton = () => (
//   <div>
//     <h2 className="mb-4 h-6 w-64 animate-pulse rounded bg-gray-200 text-xl font-semibold dark:bg-gray-700"></h2>
//     <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
//       {[1, 2, 3].map((i) => (
//         <Card key={i} className="dark:bg-secondary border-muted border">
//           <CardHeader>
//             <div className="flex items-center gap-2">
//               <div className="h-5 w-5 animate-pulse rounded-full bg-gray-300 dark:bg-gray-600"></div>
//               <div className="h-6 w-24 animate-pulse rounded bg-gray-300 dark:bg-gray-600"></div>
//             </div>
//           </CardHeader>
//           <CardContent>
//             <div className="mb-2 h-4 w-full animate-pulse rounded bg-gray-300 dark:bg-gray-600"></div>
//             <div className="h-4 w-3/4 animate-pulse rounded bg-gray-300 dark:bg-gray-600"></div>
//           </CardContent>
//         </Card>
//       ))}
//     </div>
//     <div className="mt-5 flex items-center justify-between">
//       <div className="h-4 w-1/2 animate-pulse rounded bg-gray-200 dark:bg-gray-700"></div>
//       <div className="h-10 w-24 animate-pulse rounded-md bg-gray-300 dark:bg-gray-600"></div>
//     </div>
//   </div>
// );
import { Skeleton } from '@/components/ui/skeleton';

export const ClubTitleSkeleton = () => {
  return (
    <div>
      <Skeleton className="mb-4 h-6 w-40" />
      <div className="flex w-full items-center justify-between gap-4">
        <Skeleton className="h-12 max-w-sm flex-1" />
        <Skeleton className="h-10 w-20" />
      </div>
    </div>
  );
};

export const LoyaltyModelSkeleton = () => {
  return (
    <div>
      <Skeleton className="mb-4 h-6 w-48" />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Skeleton className="h-40 w-full" />
        <Skeleton className="h-40 w-full" />
        <Skeleton className="h-40 w-full" />
      </div>
      <div className="mt-5 flex items-center justify-between">
        <Skeleton className="h-4 w-96" />
        <Skeleton className="h-10 w-20" />
      </div>
    </div>
  );
};

export const SettingsDisplaySkeleton = () => {
  return (
    <div className="relative overflow-hidden rounded-lg border border-gray-200 bg-white shadow-md dark:border-gray-700 dark:bg-[#171717]">
      {/* Cover Image Skeleton */}
      <Skeleton className="h-48 w-full sm:h-64" />

      {/* Content Section */}
      <div className="relative px-6 pb-6">
        {/* Logo Skeleton */}
        <div className="relative -mt-16 mb-4">
          <Skeleton className="h-32 w-32 rounded-full" />
        </div>

        {/* Title & Category */}
        <div className="mb-4">
          <Skeleton className="mb-2 h-8 w-64" />
          <Skeleton className="h-6 w-24 rounded-full" />
        </div>

        {/* Description */}
        <Skeleton className="mb-4 h-16 w-full" />

        {/* Stats Pills */}
        <div className="flex flex-wrap gap-3">
          <Skeleton className="h-8 w-32 rounded-full" />
          <Skeleton className="h-8 w-32 rounded-full" />
          <Skeleton className="h-8 w-32 rounded-full" />
          <Skeleton className="h-8 w-32 rounded-full" />
          <Skeleton className="h-8 w-32 rounded-full" />
        </div>
      </div>
    </div>
  );
};
