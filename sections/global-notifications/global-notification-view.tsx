'use client';

import ConfirmDialog from '@/components/comfirm-dialog/confirm-dialog';
import { TableFilters } from '@/components/table-filters';
import PaginationControls from '@/components/table/pagination-controls';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { useBoolean } from '@/hooks/useBoolean';
import { useDeleteNotificationMutation, useGetNotificationsQuery } from '@/store/Reducer/notifications-api';
import { getErrorMessage } from '@/utils/api';
import { formatDate } from '@/utils/format-time';
import { showError, showSuccess } from '@/utils/toast';
import { Plus, Settings2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { NotificationCard } from './notification-card';
import { NotificationModal } from './notification-modal';
import { PreviewModal } from './preview-modal';
import { StatsCards } from './stats-card';
import { Notification } from './types';

export default function GlobalNotificationsView() {
  const createModal = useBoolean();
  const deleteModal = useBoolean();
  const previewModal = useBoolean();

  // Pagination and filter state
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [search, setSearch] = useState('');
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [sendTiming, setSendTiming] = useState<string>('');
  const [isDelivered, setIsDelivered] = useState<string>('');

  const {
    data: notificationsData,
    isLoading,
    isFetching,
  } = useGetNotificationsQuery({
    page: page - 1,
    search,
    limit: String(limit),
    date: date ? formatDate(date) : undefined,
    sendTiming: sendTiming === 'all' ? '' : sendTiming,
    isDelivered: isDelivered === 'all' ? '' : isDelivered,
  });

  const [localData, setLocalData] = useState<any[]>([]);
  const [meta, setMeta] = useState({
    currentPage: page,
    totalPages: 1,
    totalRecords: 0,
    limit,
  });

  useEffect(() => {
    if (notificationsData?.data) {
      setLocalData(notificationsData.data);
      setMeta(
        notificationsData.meta || {
          currentPage: page,
          totalPages: 1,
          totalRecords: 0,
          limit,
        }
      );
    }
  }, [notificationsData, page, limit]);

  const statsData = notificationsData?.meta;

  const [deleteNotification, { isLoading: deleteLoading }] = useDeleteNotificationMutation();

  const [selectedNotification, setSelectedNotification] = useState<Notification | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);

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
      const response = await deleteNotification(selectedId).unwrap();

      if (response?.error) {
        const errorMessage = getErrorMessage(response.error);
        showError(errorMessage);
        return;
      }

      showSuccess(response?.message || 'Notification deleted successfully');

      setSelectedId(null);
      deleteModal.onFalse();
    } catch (error) {
      showError(getErrorMessage(error));
    }
  };

  const handleResetFilters = () => {
    setSearch('');
    setDate(undefined);
    setSendTiming('');
    setIsDelivered('');
    setPage(1);
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

              <div className="flex items-center gap-3">
                {/* Filter Sheet */}
                <Sheet>
                  <SheetTrigger asChild>
                    <Badge className="text-md flex cursor-pointer items-center gap-2 rounded-3xl border border-gray-300 bg-white px-4 py-2 text-black hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700">
                      <Settings2 className="h-5 w-5" />
                      <span className="whitespace-nowrap">Filters</span>
                    </Badge>
                  </SheetTrigger>
                  <SheetContent aria-describedby={undefined} side="right" className="dark:bg-secondary p-0">
                    <SheetHeader className="mb-2 border-b pb-2">
                      <SheetTitle>Filters</SheetTitle>
                    </SheetHeader>
                    <div className="flex flex-col gap-6 px-4 py-2">
                      <TableFilters
                        className="w-full [&_.w-44]:w-full [&_.w-\[180px\]]:w-full"
                        searchFilter={{
                          placeholder: 'Search notifications...',
                          value: search,
                          onChange: (val) => {
                            setSearch(val);
                            setPage(1);
                          },
                        }}
                        dateFilter={{
                          id: 'notification-date',
                          label: 'Date',
                          placeholder: 'Select date',
                          value: date,
                          onChange: (val) => {
                            setDate(val);
                            setPage(1);
                          },
                        }}
                        selectFilters={[
                          {
                            id: 'send-timing',
                            label: 'Send Timing',
                            placeholder: 'Select timing',
                            value: sendTiming,
                            onChange: (val) => {
                              setSendTiming(val);
                              setPage(1);
                            },
                            options: [
                              { value: 'all', label: 'All' },
                              { value: 'schedule', label: 'Scheduled' },
                              { value: 'immediately', label: 'Immediately' },
                            ],
                          },
                          {
                            id: 'is-delivered',
                            label: 'Delivery Status',
                            placeholder: 'Select status',
                            value: isDelivered,
                            onChange: (val) => {
                              setIsDelivered(val);
                              setPage(1);
                            },
                            options: [
                              { value: 'all', label: 'All' },
                              { value: 'true', label: 'Delivered' },
                              { value: 'false', label: 'Not Delivered' },
                            ],
                          },
                        ]}
                        resetFilter={{
                          onReset: handleResetFilters,
                          showResetButton: true,
                        }}
                        filtersAlignment="left"
                      />
                    </div>
                  </SheetContent>
                </Sheet>

                <Button onClick={createModal.onTrue} className="flex h-11 items-center gap-2 font-semibold">
                  <Plus className="h-4 w-4" />
                  Create Notification
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="rounded-b-2xl px-6 py-8 dark:bg-[#1a1a1a]">
          {/* Info Banner */}
          <div className="mb-6 flex items-center gap-5 rounded-xl bg-linear-to-br from-[#2A7B9B] to-[#1300FF] p-6 text-white">
            <div className="text-5xl">💡</div>
            <div className="flex-1">
              <h2 className="text-lg font-bold">Reach Your Entire User Base</h2>
              <p className="text-sm leading-relaxed opacity-90">
                Send targeted push notifications to engage users with personalized content. Use filters to reach specific demographics, locations, and
                interest groups for maximum impact.
              </p>
            </div>
          </div>

          {/* Stats */}
          <div className="mb-8">
            <StatsCards stats={statsData} isLoading={isLoading} />
          </div>

          {/* Notifications List */}
          <div className="space-y-4">
            {isLoading || isFetching ? (
              <div className="flex items-center justify-center py-16">
                <div className="border-t-primary h-8 w-8 animate-spin rounded-full border-2 border-gray-300" />
              </div>
            ) : localData?.length === 0 ? (
              <div className="py-16 text-center">
                <div className="mb-4 text-6xl opacity-30">📬</div>
                <h3 className="mb-2 text-xl font-bold text-gray-900 dark:text-gray-100">No Notifications Yet</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">Create your first notification to engage with your users</p>
              </div>
            ) : (
              localData?.map((notification: any) => (
                <NotificationCard key={notification._id} notification={notification} onPreview={handlePreview} onDelete={handleDelete} />
              ))
            )}
          </div>

          {/* Pagination */}
          {localData?.length > 0 && (
            <div className="mt-6">
              <PaginationControls
                currentPage={page}
                totalPages={meta.totalPages}
                totalRecords={meta.totalRecords}
                limit={limit}
                onPageChange={setPage}
              />
            </div>
          )}
        </div>
      </section>

      {/* Modals */}
      {createModal.value && <NotificationModal open={createModal.value} onClose={createModal.onFalse} isEdit={false} />}

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
        isLoading={deleteLoading}
      />
    </>
  );
}
