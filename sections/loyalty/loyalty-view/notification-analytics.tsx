'use client';

import { Card, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { ViewsOverTime } from '@/sections/invoices';
import NotificationStatsCard from '@/sections/invoices/notificationCard';
import { useGetNotificationAnalyticsQuery } from '@/store/Reducer/notifications-api';
import { useMemo } from 'react';

type NotificationAnalyticsViewProps = {
  notificationId: string;
};

const NotificationAnalyticsView = ({ notificationId }: NotificationAnalyticsViewProps) => {
  const {
    data: notificationAnalytics,
    isLoading,
    isFetching,
    error,
  } = useGetNotificationAnalyticsQuery(
    { notificationId },
    { skip: !notificationId }
  );

  const statsCards = useMemo(() => {
    if (Array.isArray(notificationAnalytics?.stats)) {
      return notificationAnalytics.stats.map((item: any, index: number) => {
        const value = Number(item?.value ?? 0);
        const key = String(item?.key || `stat-${index}`);
        const title = String(item?.title || key);
        const isPercentage = key === 'percentageUsersRead' || title.toLowerCase().includes('percentage') || title.includes('%');

        return {
          id: key,
          title,
          amount: value,
          percent: isPercentage,
          status: 'default',
        };
      });
    }

    if (Array.isArray(notificationAnalytics?.statsCards)) {
      return notificationAnalytics.statsCards;
    }

    const toNum = (v: any) => Number(v ?? 0);

    return [
      {
        id: 'total-notifications-sent',
        title: 'Total Notifications Sent',
        amount: toNum(notificationAnalytics?.totalNotificationsSent ?? notificationAnalytics?.totalSent),
        status: 'default',
      },
      {
        id: 'users-reached',
        title: 'Users Reached',
        amount: toNum(notificationAnalytics?.usersReached),
        status: 'default',
      },
      {
        id: 'total-unique-users-clicked',
        title: 'Total Unique Users Clicked',
        amount: toNum(notificationAnalytics?.totalUniqueUsersClicked ?? notificationAnalytics?.uniqueUsersClicked),
        status: 'default',
      },
      {
        id: 'user-clicked-percentage',
        title: 'User Clicked %',
        amount: toNum(notificationAnalytics?.userClickedPercent ?? notificationAnalytics?.userClickedPercentage),
        percent: true,
        status: 'default',
      },
      {
        id: 'recipients-clicked-percentage',
        title: 'Recipients Clicked %',
        amount: toNum(notificationAnalytics?.recipientsClickedPercent ?? notificationAnalytics?.recipientsClickedPercentage),
        percent: true,
        status: 'default',
      },
    ];
  }, [notificationAnalytics]);

  const ctrOverTimeData = useMemo(() => {
    const raw =
      notificationAnalytics?.ctrOverTime ||
      notificationAnalytics?.ctr_over_time ||
      notificationAnalytics?.overTime ||
      [];

    if (!Array.isArray(raw)) return [];

    return raw.map((item: any, index: number) => ({
      month: item?.month || item?.label || item?.date || `#${index + 1}`,
      views: Number(item?.views ?? item?.value ?? item?.ctr ?? item?.CTR ?? 0),
    }));
  }, [notificationAnalytics]);

  const loading = isLoading || isFetching;
  const errorMessage =
    (error as any)?.data?.message ||
    (error as any)?.error ||
    (error ? 'Failed to load notification analytics.' : '');

  return (
    <>
      {/* --------------- LOYALTY TOP STATS ---------------*/}
      <div className="mt-5 grid grid-cols-1 gap-2 md:grid-cols-3 md:gap-x-4 md:gap-y-4 lg:grid-cols-3">
        {loading ? (
          Array.from({ length: 4 }).map((_, index) => (
            <Card key={`stats-skeleton-${index}`} className="dark:bg-secondary rounded-xl">
              <CardHeader>
                <Skeleton className="h-5 w-44" />
                <Skeleton className="mt-3 h-9 w-20" />
              </CardHeader>
            </Card>
          ))
        ) : errorMessage ? (
          <div className="col-span-12 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-600 dark:border-red-900/40 dark:bg-red-900/20 dark:text-red-300">
            {errorMessage}
          </div>
        ) : (
          statsCards.map((card: any, index: number) => <NotificationStatsCard key={card?.id || index} item={card} />)
        )}
      </div>

      {/* --------------- LOYALTY FIRST LAYER --------------- */}
      <div className="mt-5 grid grid-cols-12 gap-4">
        {/* -------------- New Members -------------- */}
        <div className="col-span-12 md:col-span-12">
          <Card className="dark:bg-secondary col-span-12 shadow-md md:col-span-6">
            <CardHeader>
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold">CTR Over Time</h3>
              </div>
            </CardHeader>

            {loading ? (
              <div className="px-6 pb-6">
                <Skeleton className="h-[330px] w-full rounded-lg" />
              </div>
            ) : errorMessage ? (
              <div className="px-6 pb-6 text-sm text-red-600 dark:text-red-300">{errorMessage}</div>
            ) : (
              <ViewsOverTime
                height={330}
                data={ctrOverTimeData}
              />
            )}
          </Card>
        </div>
      </div>
    </>
  );
};

export default NotificationAnalyticsView;
