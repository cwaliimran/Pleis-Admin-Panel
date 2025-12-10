'use client';

import { Card, CardHeader } from '@/components/ui/card';
import { ViewsOverTime } from '@/sections/invoices';
import NotificationStatsCard from '@/sections/invoices/notificationCard';
import { globalNotificationData } from '@/sections/loyalty/data';

const NotificationAnalyticsView = () => {
  return (
    <>
      {/* --------------- LOYALTY TOP STATS ---------------*/}
      <div className="mt-5 grid grid-cols-1 gap-2 md:grid-cols-3 md:gap-x-4 md:gap-y-4 lg:grid-cols-3">
        {globalNotificationData?.map((card: any, index) => (
          <NotificationStatsCard key={index} item={card} />
        ))}
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

            <ViewsOverTime
              height={330}
              data={[
                { month: 'Jan', views: 2 },
                { month: 'Feb', views: 1398 },
                { month: 'Mar', views: 6800 },
                { month: 'Apr', views: 2908 },
                { month: 'May', views: 4800 },
                { month: 'Jun', views: 2800 },
                { month: 'Jul', views: 6300 },
                { month: 'Aug', views: 5000 },
                { month: 'Sep', views: 6000 },
                { month: 'Oct', views: 7000 },
                { month: 'Nov', views: 8000 },
                { month: 'Dec', views: 9000 },
              ]}
            />
          </Card>
        </div>
      </div>
    </>
  );
};

export default NotificationAnalyticsView;
