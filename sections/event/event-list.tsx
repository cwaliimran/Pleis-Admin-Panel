'use client';

import ConfirmDialog from '@/components/comfirm-dialog/confirm-dialog';
import EventConfirmDialog from '@/components/comfirm-dialog/event-confirm-dialog';
import { Button } from '@/components/ui/button';
import { useBoolean } from '@/hooks/useBoolean';
import { EventTable } from '@/sections/event';
import { useDeleteeventMutation, useGeteventsQuery } from '@/store/Reducer/events';
import { formatDate } from '@/utils/format-time';
import { Plus } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

type OrganizationListProps = {
  userType?: 'organizer' | 'super-admin';
  organization?: string;
};

const EventList = ({ userType, organization }: OrganizationListProps) => {
  const router = useRouter();
  const deleteModal = useBoolean();
  const recurringDeleteModal = useBoolean();
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleteEvent] = useDeleteeventMutation();
  const [isDeleting, setIsDeleting] = useState(false);
  const [isDeletingAllEvents, setIsDeletingAllEvents] = useState(false);

  // Separate state for better control
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState<string>('');
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);

  const {
    data: apiData,
    isLoading,
    isFetching,
    refetch,
  } = useGeteventsQuery({
    page: page - 1,
    search,
    limit,
    status: status === 'all' ? undefined : status,
    startDate: startDate ? formatDate(startDate) : undefined,
    endDate: endDate ? formatDate(endDate) : undefined,
    ...(organization ? { organization } : {}),
  });

  const handleDelete = (data: any) => {
    if (!data) return;

    // If parentEvent is null, it's a parent/non-recurring event - use simple delete
    if (data?.recurringMeta?.parentEvent === null) {
      setDeleteId(data?._id);
      deleteModal.onTrue();
    } else {
      // It's a recurring child event - show options to delete single or all future
      setDeleteId(data?._id);
      recurringDeleteModal.onTrue();
    }
  };

  const onDelete = async (scope: string) => {
    if (!deleteId) return;

    if (scope === 'future') {
      setIsDeletingAllEvents(true);
    } else {
      setIsDeleting(true);
    }

    try {
      const payload = {
        id: deleteId,
        scope,
      };

      const res = await deleteEvent(payload).unwrap();

      if (res?.data) {
        refetch();
      }

      deleteModal.onFalse();
      recurringDeleteModal.onFalse();
      setDeleteId(null);
    } catch (error) {
      console.log('Failed to delete event', error);
    } finally {
      setIsDeleting(false);
      setIsDeletingAllEvents(false);
    }
  };

  const handleNavigateToCreate = () => {
    if (userType === 'super-admin') {
      router.push('/super-admin/events/create-event');
    } else {
      router.push('/organizer/events/create-event');
    }
  };

  // Pagination and filter handlers
  const onPageChange = (newPage: number) => {
    setPage(newPage);
  };

  const onLimitChange = (newLimit: number) => {
    setLimit(newLimit);
    setPage(1);
  };

  const onSearchChange = (searchTerm: string) => {
    setSearch(searchTerm);
    setPage(1);
  };

  const onStatusChange = (newStatus: string) => {
    setStatus(newStatus);
    setPage(1);
  };

  const onDateChange = (newStartDate: Date | undefined, newEndDate: Date | undefined) => {
    setStartDate(newStartDate);
    setEndDate(newEndDate);
    setPage(1);
  };

  const onResetFilters = () => {
    setPage(1);
    setLimit(10);
    setSearch('');
    setStatus('');
    setStartDate(undefined);
    setEndDate(undefined);
  };

  return (
    <div>
      {/* Create Event Button */}
      <div className="mt-3 flex w-full items-center justify-end md:mt-0">
        {!organization && (
          <Button className="bg-primary hover:bg-primary/80 cursor-pointer rounded-4xl py-2 text-white" onClick={handleNavigateToCreate}>
            <Plus />
            Create Event
          </Button>
        )}
      </div>

      {/* Simple Delete Confirmation Dialog - for parent/non-recurring events */}
      <ConfirmDialog
        open={deleteModal.value}
        title="Delete Event"
        content="Are you sure you want to delete this event? This action cannot be undone."
        onClose={() => {
          deleteModal.onFalse();
          setDeleteId(null);
        }}
        onConfirm={() => onDelete('single')}
        isLoading={isDeleting}
      />

      {/* Recurring Delete Confirmation Dialog - for recurring child events */}
      {recurringDeleteModal.value && (
        <EventConfirmDialog
          open={recurringDeleteModal.value}
          title="Delete Event"
          content="Are you sure you want to delete this event? This action cannot be undone."
          onClose={() => {
            recurringDeleteModal.onFalse();
            setDeleteId(null);
          }}
          onConfirm={onDelete}
          isLoading={isDeleting}
          isLoadingForAllEventsDelete={isDeletingAllEvents}
        />
      )}

      {/* Event Table */}
      <EventTable
        data={apiData?.data}
        loading={isLoading || isFetching}
        handleDelete={handleDelete}
        onPageChange={onPageChange}
        onLimitChange={onLimitChange}
        onSearch={onSearchChange}
        search={search}
        limit={limit}
        page={page}
        status={status}
        onStatusChange={onStatusChange}
        startDate={startDate}
        endDate={endDate}
        onDateChange={onDateChange}
        onResetFilters={onResetFilters}
        meta={apiData?.meta}
        userType={userType}
      />
    </div>
  );
};

export default EventList;
