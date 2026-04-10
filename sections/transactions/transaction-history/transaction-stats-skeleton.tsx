import { Skeleton } from '@/components/ui/skeleton';

interface TransactionStatsSkeletonProps {
  count?: number;
}

const TransactionStatsSkeleton = ({ count = 4 }: TransactionStatsSkeletonProps) => {
  return Array.from({ length: count }).map((_, index) => (
    <div key={index} className="dark:bg-secondary rounded-xl border p-6">
      <Skeleton className="h-5 w-32" />
      <div className="mt-4 flex items-center justify-between">
        <Skeleton className="h-10 w-16" />
        <Skeleton className="h-7 w-16 rounded-full" />
      </div>
    </div>
  ));
};

export default TransactionStatsSkeleton;
