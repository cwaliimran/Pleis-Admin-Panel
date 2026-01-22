import PaginationControls from '@/components/table/pagination-controls';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useGeteventNotificationsByIdQuery } from '@/store/Reducer/events';
import Image from 'next/image';
import { useState } from 'react';
import NotificationCardSkelton from './components/notification-card-skelton';

const LIMIT = 30;

const EventNotification = ({ id }: { id: any }) => {
  const [page, setPage] = useState(1);
  const { data, isLoading } = useGeteventNotificationsByIdQuery({ id, page: page - 1, limit: LIMIT });

  const notifications = data?.data || [];
  const totalRecords = data?.meta?.totalRecords || notifications.length;
  const totalPages = data?.meta?.totalPages || Math.ceil(totalRecords / LIMIT);

  return (
    <div>
      <h2 className="mb-4 text-xl font-bold">Event Notifications</h2>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        {isLoading && <NotificationCardSkelton />}

        {!isLoading && notifications?.length === 0 && <div className="col-span-full text-center text-slate-400">No notifications found.</div>}

        {!isLoading &&
          notifications.map((notif: any) => (
            <Card key={notif?._id} className="border border-gray-200 shadow transition-shadow hover:shadow-md dark:border-gray-800 dark:bg-[#18181c]">
              <CardHeader>
                <div className="flex items-center gap-4">
                  {notif?.image && (
                    <Image
                      src={notif?.image}
                      alt={notif?.title}
                      className="h-16 w-16 rounded-lg border border-gray-200 object-cover dark:border-gray-700"
                      width={200}
                      height={200}
                    />
                  )}
                  <div className="min-w-0 flex-1">
                    <CardTitle className="truncate text-lg font-bold text-neutral-800 dark:text-neutral-200">{notif?.title}</CardTitle>
                    <div className="mt-1 text-xs text-slate-400">{new Date(notif?.createdAt).toLocaleString()}</div>
                  </div>
                </div>
              </CardHeader>

              <CardContent>
                <div className="mb-3 line-clamp-3 text-[15px] font-medium text-slate-700 dark:text-slate-200">{notif?.message}</div>
                <div className="mb-2 flex flex-wrap gap-2 text-xs">
                  <span className="rounded bg-gray-100 px-2 py-0.5 font-semibold text-gray-700 dark:bg-gray-800 dark:text-gray-200">
                    Status: {notif?.status}
                  </span>
                  <span
                    className={`rounded px-2 py-0.5 font-semibold ${notif?.isDelivered ? 'bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-200' : 'bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400'}`}
                  >
                    {notif?.isDelivered ? 'Delivered' : 'Not Delivered'}
                  </span>
                  <span className="rounded bg-gray-100 px-2 py-0.5 font-semibold text-gray-700 dark:bg-gray-800 dark:text-gray-200">
                    {notif?.sendTiming === 'immediately' ? 'Immediate' : 'Scheduled'}
                  </span>
                  {notif?.scheduledDateTime && notif?.sendTiming === 'schedule' && (
                    <span className="rounded bg-gray-200 px-2 py-0.5 font-semibold text-gray-700 dark:bg-gray-700 dark:text-gray-200">
                      Scheduled: {new Date(notif?.scheduledDateTime).toLocaleString()}
                    </span>
                  )}
                  <span className="rounded bg-gray-100 px-2 py-0.5 font-semibold text-gray-700 dark:bg-gray-800 dark:text-gray-200">
                    Estimated: {notif?.estimated} / Delivered: {notif?.delivered}
                  </span>
                  {notif?.location?.city && (
                    <span className="rounded bg-gray-100 px-2 py-0.5 font-semibold text-gray-700 dark:bg-gray-800 dark:text-gray-200">
                      City: {notif?.location?.city}
                    </span>
                  )}
                  {notif.ageRange && (
                    <span className="rounded bg-gray-100 px-2 py-0.5 font-semibold text-gray-700 dark:bg-gray-800 dark:text-gray-200">
                      Age: {notif?.ageRange[0]} - {notif?.ageRange[1]}
                    </span>
                  )}
                </div>
                {notif.interests && notif.interests.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {notif?.interests?.map((interest: any, idx: number) => (
                      <span
                        key={interest + idx}
                        className="rounded-full bg-gray-200 px-3 py-1 text-xs font-semibold text-gray-700 dark:bg-gray-700 dark:text-gray-200"
                      >
                        Interest: {interest?.title}
                      </span>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
      </div>

      <div className="mt-6 flex justify-center">
        <PaginationControls limit={LIMIT} totalPages={totalPages} currentPage={page} totalRecords={totalRecords} onPageChange={setPage} />
      </div>
    </div>
  );
};

export default EventNotification;
