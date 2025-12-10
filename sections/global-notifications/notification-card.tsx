'use client';

import React from 'react';
import { Image as ImageIcon, Link2, MapPin, Check, Users, Eye, Trash2 } from 'lucide-react';
import { Notification } from './types';
import { NOTIFICATION_STATUS_COLORS } from './constants';
import Image from 'next/image';

interface NotificationCardProps {
  notification: Notification;
  onPreview: (notification: Notification) => void;
  onDelete: (id: string) => void;
}

export const NotificationCard: React.FC<NotificationCardProps> = ({ notification, onPreview, onDelete }) => {
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

  const getDestinationLabel = (dest: Notification['destination']) => {
    if (!dest || dest.type === 'none') return 'App Home';
    if (dest.type === 'organization') return `Organization: ${dest.name}`;
    if (dest.type === 'event') return `Event: ${dest.name}`;
    return 'No destination';
  };

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6 transition-shadow hover:shadow-md dark:border-gray-700 dark:bg-[#222121]">
      <div className="flex items-start gap-4">
        {notification.image ? (
          <Image src={notification.image} alt={notification.title} width={300} height={300} className="h-24 w-24 rounded-lg object-cover" />
        ) : (
          <div className="flex h-24 w-24 items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-800">
            <ImageIcon className="h-8 w-8 text-gray-400 dark:text-gray-600" />
          </div>
        )}

        <div className="flex-1">
          <div className="mb-2 flex items-start justify-between">
            <div className="flex-1">
              <div className="mb-2 flex items-center gap-2">
                <span className={`rounded px-2 py-1 text-xs font-semibold ${NOTIFICATION_STATUS_COLORS[notification.status]}`}>
                  {notification.status === 'sent' ? 'Sent' : 'Scheduled'}
                </span>
                <span className="text-sm text-gray-500 dark:text-gray-400">{formatDateTime(notification.sendTime)}</span>
              </div>

              <h3 className="mb-1 text-lg font-bold text-gray-900 dark:text-gray-100">{notification.title}</h3>
              <p className="mb-3 line-clamp-2 text-gray-700 dark:text-gray-300">{notification.message}</p>

              <div className="mb-3 flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                <Link2 className="h-4 w-4" />
                <span>{getDestinationLabel(notification.destination)}</span>
              </div>

              <div className="mb-3 flex flex-wrap gap-2">
                {notification.targeting.location?.name && (
                  <span className="flex items-center gap-1 rounded-full bg-blue-50 px-2 py-1 text-xs text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
                    <MapPin className="h-3 w-3" />
                    {notification.targeting.location.name} ({notification.targeting.location.radius}km)
                  </span>
                )}
                {notification.targeting.ageRange?.min && (
                  <span className="rounded-full bg-purple-50 px-2 py-1 text-xs text-purple-700 dark:bg-purple-900/30 dark:text-purple-400">
                    Age {notification.targeting.ageRange.min}-{notification.targeting.ageRange.max}
                  </span>
                )}
                {notification.targeting.gender && notification.targeting.gender !== 'all' && (
                  <span className="rounded-full bg-pink-50 px-2 py-1 text-xs text-pink-700 capitalize dark:bg-pink-900/30 dark:text-pink-400">
                    {notification.targeting.gender}
                  </span>
                )}
                {notification.targeting.interests && notification.targeting.interests.length > 0 && (
                  <span className="rounded-full bg-green-50 px-2 py-1 text-xs text-green-700 dark:bg-green-900/30 dark:text-green-400">
                    {notification.targeting.interests.length} interests
                  </span>
                )}
              </div>

              <div className="flex items-center gap-6 text-sm">
                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                  <Users className="h-4 w-4" />
                  <span className="font-medium">{notification.estimatedReach.toLocaleString()}</span>
                  <span>estimated</span>
                </div>
                {notification.actualReach && (
                  <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
                    <Check className="h-4 w-4" />
                    <span className="font-medium">{notification.actualReach.toLocaleString()}</span>
                    <span>delivered</span>
                  </div>
                )}
              </div>
            </div>

            <div className="flex gap-2">
              <button
                title="button"
                type="button"
                onClick={() => onPreview(notification)}
                className="cursor-pointer rounded p-2 text-blue-600 transition-colors hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-900/30"
              >
                <Eye className="h-4 w-4" />
              </button>
              <button
                title="button"
                type="button"
                onClick={() => onDelete(notification._id)}
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
