'use client';

import { useMemo, useState } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useBoolean } from '@/hooks/useBoolean';
import ConfirmDialog from '@/components/comfirm-dialog/confirm-dialog';
import { showError, showSuccess } from '@/utils/toast';
import { getErrorMessage } from '@/utils/api';
import { NotificationCard } from './notification-card';
import { NotificationModal } from './notification-modal';
import { PreviewModal } from './preview-modal';
import { Notification, NotificationStats } from './types';
import { MOCK_NOTIFICATIONS } from './mock-data';
import { StatsCards } from './stats-card';
// import { useGetNotificationsQuery, useDeleteNotificationMutation } from '@/store/Reducer/notifications-api';

export default function GlobalNotificationsView() {
  const createModal = useBoolean();
  const deleteModal = useBoolean();
  const previewModal = useBoolean();

  // Uncomment when API is ready
  // const { data: notificationsData, isLoading } = useGetNotificationsQuery({
  //   page: 0,
  //   search: '',
  //   limit: '100',
  // });
  // const [deleteNotification, { isLoading: deleteLoading }] = useDeleteNotificationMutation();

  // Mock data for now
  const [notifications, setNotifications] = useState<Notification[]>(MOCK_NOTIFICATIONS);
  const [selectedNotification, setSelectedNotification] = useState<Notification | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  // Calculate stats
  const stats: NotificationStats = useMemo(() => {
    const totalSent = notifications.filter((n) => n.status === 'sent').length;
    const totalScheduled = notifications.filter((n) => n.status === 'scheduled').length;
    const totalReach = notifications.filter((n) => n.actualReach).reduce((sum, n) => sum + (n.actualReach || 0), 0);

    const activeFilters = notifications.reduce((sum, n) => {
      let count = 0;
      if (n.targeting?.location?.name) count++;
      if (n.targeting?.ageRange?.min) count++;
      if (n.targeting?.gender && n.targeting.gender !== 'all') count++;
      if (n.targeting?.interests && n.targeting.interests.length > 0) count++;
      return sum + count;
    }, 0);

    return {
      totalSent,
      totalScheduled,
      totalReach,
      activeFilters,
    };
  }, [notifications]);

  const handlePreview = (notification: Notification) => {
    setSelectedNotification(notification);
    previewModal.onTrue();
  };

  const handleDelete = (id: string) => {
    setSelectedId(id);
    deleteModal.onTrue();
  };

  const onDelete = async () => {
    if (!selectedId) return;

    try {
      // Uncomment when API is ready
      // const response = await deleteNotification(selectedId).unwrap();
      // if (response?.error) {
      //   const errorMessage = getErrorMessage(response.error);
      //   showError(errorMessage);
      //   return;
      // }
      // showSuccess(response?.message || 'Notification deleted successfully');

      // Mock deletion for now
      setNotifications((prev) => prev.filter((n) => n._id !== selectedId));
      showSuccess('Notification deleted successfully');

      setSelectedId(null);
      deleteModal.onFalse();
    } catch (error) {
      showError(getErrorMessage(error));
    }
  };

  return (
    <>
      <section className="min-h-screen">
        {/* Header */}
        <div className="sticky top-0 z-30 rounded-t-2xl bg-white shadow-sm dark:bg-[#222121]">
          <div className="px-6 py-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Global Notifications</h1>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Send platform-wide push notifications to targeted users</p>
                </div>
              </div>
              <Button onClick={createModal.onTrue} className="flex h-11 items-center gap-2 font-semibold">
                <Plus className="h-4 w-4" />
                Create Notification
              </Button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="rounded-b-2xl px-6 py-8 dark:bg-[#1a1a1a]">
          {/* Info Banner */}
          <div className="mb-6 flex items-center gap-5 rounded-xl bg-linear-to-br from-[#2A7B9B] to-[#1300FF] p-6 text-white">
            <div className="text-5xl">💡</div>
            <div className="flex-1">
              <h2 className="mb-2 text-lg font-bold">Reach Your Entire User Base</h2>
              <p className="text-sm leading-relaxed opacity-90">
                Send targeted push notifications to engage users with personalized content. Use filters to reach specific demographics, locations, and
                interest groups for maximum impact.
              </p>
            </div>
          </div>

          {/* Stats */}
          <div className="mb-8">
            <StatsCards stats={stats} />
          </div>

          {/* Notifications List */}
          <div className="space-y-4">
            {notifications.length === 0 ? (
              <div className="py-16 text-center">
                <div className="mb-4 text-6xl opacity-30">📬</div>
                <h3 className="mb-2 text-xl font-bold text-gray-900 dark:text-gray-100">No Notifications Yet</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">Create your first notification to engage with your users</p>
              </div>
            ) : (
              notifications.map((notification) => (
                <NotificationCard key={notification._id} notification={notification} onPreview={handlePreview} onDelete={handleDelete} />
              ))
            )}
          </div>
        </div>
      </section>

      {/* Modals */}
      <NotificationModal open={createModal.value} onClose={createModal.onFalse} isEdit={false} />

      <PreviewModal open={previewModal.value} onClose={previewModal.onFalse} notification={selectedNotification} />

      <ConfirmDialog
        open={deleteModal.value}
        title="Delete Notification"
        content="Are you sure you want to delete this notification? This action cannot be undone."
        onClose={() => {
          deleteModal.onFalse();
          setSelectedId(null);
        }}
        onConfirm={onDelete}
        isLoading={false}
      />
    </>
  );
}
