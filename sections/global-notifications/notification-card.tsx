'use client';

import { Check, Eye, Image as ImageIcon, Link2, MapPin, Trash2, Users } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React from 'react';
import { NOTIFICATION_STATUS_COLORS } from './constants';
import { Notification } from './types';

interface NotificationCardProps {
  notification: any;
  onPreview: (notification: Notification) => void;
  onDelete: (id: string) => void;
}

export const NotificationCard: React.FC<NotificationCardProps> = ({ notification, onDelete }) => {
  const router = useRouter();

  const handleNavigate = () => {
    router.push(`/super-admin/notification-analytics/${notification?._id}`);
  };

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getDestinationLabel = (dest: any) => {
    if (dest?.destinationType === 'homeNotification') return 'App Home';
    if (dest?.destinationType === 'organizationNotification') return `Organization: ${dest?.organization?.basicInfo?.name || 'N/A'}`;
    if (dest?.destinationType === 'eventNotification') return `Event: ${dest.event?.basicInfo?.title || 'N/A'}`;
    return 'No destination';
  };

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6 transition-shadow hover:shadow-md dark:border-gray-700 dark:bg-[#222121]">
      <div className="flex items-start gap-4">
        {notification?.image ? (
          <Image src={notification?.image || ''} alt={notification?.title} width={300} height={300} className="h-24 w-24 rounded-lg object-cover" />
        ) : (
          <div className="flex h-24 w-24 items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-800">
            <ImageIcon className="h-8 w-8 text-gray-400 dark:text-gray-600" />
          </div>
        )}

        <div className="flex-1">
          <div className="mb-2 flex items-start justify-between">
            <div className="flex-1">
              <div className="mb-2 flex items-center gap-2">
                <span
                  className={`rounded px-2 py-1 text-xs font-semibold ${NOTIFICATION_STATUS_COLORS[notification.isDelivered ? 'sent' : 'scheduled']}`}
                >
                  {notification.isDelivered ? 'Sent' : 'Scheduled'}
                </span>
                <span className="text-sm text-gray-500 dark:text-gray-400">{formatDateTime(notification?.scheduledDateTime)}</span>
              </div>

              <h3 className="mb-1 text-lg font-bold text-gray-900 dark:text-gray-100">{notification?.title}</h3>
              <p className="mb-3 line-clamp-2 text-gray-700 dark:text-gray-300">{notification?.message}</p>

              <div className="mb-3 flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                <Link2 className="h-4 w-4" />
                <span>{getDestinationLabel(notification)}</span>
              </div>

              <div className="mb-3 flex flex-wrap gap-2">
                {notification.location?.city && (
                  <span className="flex items-center gap-1 rounded-full bg-blue-50 px-2 py-1 text-xs text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
                    <MapPin className="h-3 w-3" />
                    {notification.location.city} ({notification.location.radius}km)
                  </span>
                )}
                {notification.ageRange?.min && (
                  <span className="rounded-full bg-purple-50 px-2 py-1 text-xs text-purple-700 dark:bg-purple-900/30 dark:text-purple-400">
                    Age {notification.ageRange[0]}-{notification.ageRange[1]}
                  </span>
                )}
                {notification.gender && notification.gender !== 'all' && (
                  <span className="rounded-full bg-pink-50 px-2 py-1 text-xs text-pink-700 capitalize dark:bg-pink-900/30 dark:text-pink-400">
                    {notification.gender}
                  </span>
                )}
                {notification?.interests && notification?.interests.length > 0 && (
                  <span className="rounded-full bg-green-50 px-2 py-1 text-xs text-green-700 dark:bg-green-900/30 dark:text-green-400">
                    {notification?.interests.length} interests
                  </span>
                )}
              </div>

              <div className="flex items-center gap-6 text-sm">
                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                  <Users className="h-4 w-4" />
                  <div>
                    <span className="pr-1 font-medium">{notification?.estimated}</span>
                    <span>Estimated</span>
                  </div>
                </div>

                {notification?.isDelivered && (
                  <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                    <Check className="h-4 w-4" />
                    <div>
                      <span className="pr-1 font-medium">{notification?.delivered}</span>
                      <span>Delivered</span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="flex gap-2">
              <button
                title="button"
                type="button"
                onClick={handleNavigate}
                // onClick={() => onPreview(notification)}
                className="cursor-pointer rounded p-2 text-blue-600 transition-colors hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-900/30"
              >
                <Eye className="h-4 w-4" />
              </button>
              <button
                title="button"
                type="button"
                onClick={() => onDelete(notification?._id)}
                className="cursor-pointer rounded p-2 text-red-600 transition-colors hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/30"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
