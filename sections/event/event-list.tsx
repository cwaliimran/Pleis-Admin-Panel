'use client';
// import OverlayLoading from '@/components/atoms/overlay-loading';
import ConfirmDialog from '@/components/comfirm-dialog/confirm-dialog';
import { Button } from '@/components/ui/button';
import { useBoolean } from '@/hooks/useBoolean';
import { EventTable } from '@/sections/event';
import {
  useDeleteeventMutation,
  useGeteventsQuery,
} from '@/store/Reducer/events';
import { formatDate } from '@/utils/format-time';
// import { fi } from 'date-fns/locale';
import { Plus } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

type OrganizationListProps = {
  userType?: 'organizer' | 'super-admin';
};

const EventList = ({ userType }: OrganizationListProps) => {
  const router = useRouter();
  const deleteModal = useBoolean();
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleteEvent] = useDeleteeventMutation();
  const [isDeleting, setIsDeleting] = useState(false);
  // Unified filter state
  const [filters, setFilters] = useState({
    page: 1,
    limit: 10,
    search: '',
    status: '',
    startDate: undefined as Date | undefined,
    endDate: undefined as Date | undefined,
  });

  const {
    data: apiData,
    isLoading,
    refetch,
  } = useGeteventsQuery({
    page: filters.page - 1,
    search: filters.search,
    limit: filters.limit,
    status: filters.status === 'all' ? undefined : filters.status,
    startDate: filters.startDate ? formatDate(filters.startDate) : undefined,
    endDate: filters.endDate ? formatDate(filters.endDate) : undefined,
  });

  const handleDelete = (id: string) => {
    setDeleteId(id);
    deleteModal.onTrue();
  };

  const onDelete = async () => {
    try {
      // Call the delete function from your API or store
      if (deleteId) {
        deleteModal.onFalse();
        setIsDeleting(true);
        const res = await deleteEvent(deleteId).unwrap();
        if (res?.data) {
          refetch();
        }
      }
    } catch (error) {
      console.log('Failed to delete event', error);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleNavigateToCreate = () => {
    if (userType === 'super-admin') {
      router.push('/super-admin/events/create-event');
    } else {
      router.push('/organizer/events/create-event');
    }
  };

  // Update filter state
  const updateFilter = (key: string, value: any) => {
    setFilters((prev) => ({ ...prev, [key]: value, page: 1 }));
  };

  // Pagination handlers
  const onPageChange = (newPage: number) => updateFilter('page', newPage);
  const onLimitChange = (newLimit: number) => updateFilter('limit', newLimit);
  const onSearchChange = (searchTerm: string) =>
    updateFilter('search', searchTerm);
  const onStatusChange = (newStatus: string) =>
    updateFilter('status', newStatus);
  const onDateChange = (
    newStartDate: Date | undefined,
    newEndDate: Date | undefined
  ) => {
    console.log('Date range changed:', newStartDate, newEndDate);
    updateFilter('startDate', newStartDate);
    updateFilter('endDate', newEndDate);
  };

  const onResetFilters = () => {
    setFilters({
      page: 1,
      limit: 10,
      search: '',
      status: '',
      startDate: undefined,
      endDate: undefined,
    });
  };

  return (
    <div>
      {/* <OverlayLoading show={isLoading || isDeleting} /> */}

      {/* Create Event Button */}
      <div className="mt-3 flex w-full items-center justify-end md:mt-0">
        <Button
          className="bg-primary hover:bg-primary/80 cursor-pointer rounded-4xl py-2 text-white"
          onClick={handleNavigateToCreate}
        >
          <Plus />
          Create Event
        </Button>
      </div>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        open={deleteModal.value}
        title="Delete Event"
        content="Are you sure you want to delete this event?"
        onClose={deleteModal.onFalse}
        onConfirm={onDelete}
        isLoading={isDeleting}
      />

      {/* Event Table */}
      <EventTable
        data={apiData?.data}
        loading={isLoading}
        handleDelete={handleDelete}
        onPageChange={onPageChange}
        onLimitChange={onLimitChange}
        onSearch={onSearchChange}
        search={filters.search}
        limit={filters.limit}
        page={filters.page}
        status={filters.status}
        onStatusChange={onStatusChange}
        startDate={filters.startDate}
        endDate={filters.endDate}
        onDateChange={onDateChange}
        onResetFilters={onResetFilters}
        meta={apiData?.meta}
        userType={userType}
      />
    </div>
  );
};

export default EventList;
