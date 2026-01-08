'use client';

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

  const handleDelete = (id: string) => {
    setDeleteId(id);
    deleteModal.onTrue();
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

      {/* Delete Confirmation Dialog */}
      <EventConfirmDialog
        open={deleteModal.value}
        title="Delete Event"
        content="Are you sure you want to delete this event? This action cannot be undone."
        onClose={deleteModal.onFalse}
        onConfirm={onDelete}
        isLoading={isDeleting}
        isLoadingForAllEventsDelete={isDeletingAllEvents}
      />

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

// 'use client';

// import ConfirmDialog from '@/components/comfirm-dialog/confirm-dialog';
// import { Button } from '@/components/ui/button';
// import { useBoolean } from '@/hooks/useBoolean';
// import { EventTable } from '@/sections/event';
// import { useDeleteeventMutation, useGeteventsQuery } from '@/store/Reducer/events';
// import { formatDate } from '@/utils/format-time';
// import { Plus } from 'lucide-react';
// import { useRouter } from 'next/navigation';
// import { useState } from 'react';

// type OrganizationListProps = {
//   userType?: 'organizer' | 'super-admin';
//   organization?: string;
// };

// const EventList = ({ userType, organization }: OrganizationListProps) => {
//   const router = useRouter();
//   const deleteModal = useBoolean();
//   const [deleteId, setDeleteId] = useState<string | null>(null);
//   const [deleteEvent] = useDeleteeventMutation();
//   const [isDeleting, setIsDeleting] = useState(false);
//   // Unified filter state
//   const [filters, setFilters] = useState({
//     page: 1,
//     limit: 10,
//     search: '',
//     status: '',
//     startDate: undefined as Date | undefined,
//     endDate: undefined as Date | undefined,
//   });

//   const {
//     data: apiData,
//     isLoading,
//     isFetching,
//     refetch,
//   } = useGeteventsQuery({
//     page: filters.page,
//     search: filters.search,
//     limit: filters.limit,
//     status: filters.status === 'all' ? undefined : filters.status,
//     startDate: filters.startDate ? formatDate(filters.startDate) : undefined,
//     endDate: filters.endDate ? formatDate(filters.endDate) : undefined,
//     ...(organization ? { organization } : {}),
//   });

//   const handleDelete = (id: string) => {
//     setDeleteId(id);
//     deleteModal.onTrue();
//   };

//   const onDelete = async () => {
//     try {
//       // Call the delete function from your API or store
//       if (deleteId) {
//         deleteModal.onFalse();
//         setIsDeleting(true);
//         const res = await deleteEvent(deleteId).unwrap();
//         if (res?.data) {
//           refetch();
//         }
//       }
//     } catch (error) {
//       console.log('Failed to delete event', error);
//     } finally {
//       setIsDeleting(false);
//     }
//   };

//   const handleNavigateToCreate = () => {
//     if (userType === 'super-admin') {
//       router.push('/super-admin/events/create-event');
//     } else {
//       router.push('/organizer/events/create-event');
//     }
//   };

//   // Update filter state
//   const updateFilter = (key: string, value: any) => {
//     setFilters((prev) => ({ ...prev, [key]: value, page: 1 }));
//   };

//   // Pagination handlers
//   const onPageChange = (newPage: number) => updateFilter('page', newPage);
//   const onLimitChange = (newLimit: number) => updateFilter('limit', newLimit);
//   const onSearchChange = (searchTerm: string) => updateFilter('search', searchTerm);
//   const onStatusChange = (newStatus: string) => updateFilter('status', newStatus);
//   const onDateChange = (newStartDate: Date | undefined, newEndDate: Date | undefined) => {
//     updateFilter('startDate', newStartDate);
//     updateFilter('endDate', newEndDate);
//   };

//   const onResetFilters = () => {
//     setFilters({
//       page: 1,
//       limit: 10,
//       search: '',
//       status: '',
//       startDate: undefined,
//       endDate: undefined,
//     });
//   };

//   return (
//     <div>
//       {/* Create Event Button */}
//       <div className="mt-3 flex w-full items-center justify-end md:mt-0">
//         {!organization && (
//           <Button className="bg-primary hover:bg-primary/80 cursor-pointer rounded-4xl py-2 text-white" onClick={handleNavigateToCreate}>
//             <Plus />
//             Create Event
//           </Button>
//         )}
//       </div>

//       {/* Delete Confirmation Dialog */}
//       <ConfirmDialog
//         open={deleteModal.value}
//         title="Delete Event"
//         content="Are you sure you want to delete this event?"
//         onClose={deleteModal.onFalse}
//         onConfirm={onDelete}
//         isLoading={isDeleting}
//       />

//       {/* Event Table */}
//       <EventTable
//         data={apiData?.data}
//         loading={isLoading || isFetching}
//         handleDelete={handleDelete}
//         onPageChange={onPageChange}
//         onLimitChange={onLimitChange}
//         onSearch={onSearchChange}
//         search={filters.search}
//         limit={filters.limit}
//         page={filters.page}
//         status={filters.status}
//         onStatusChange={onStatusChange}
//         startDate={filters.startDate}
//         endDate={filters.endDate}
//         onDateChange={onDateChange}
//         onResetFilters={onResetFilters}
//         meta={apiData?.meta}
//         userType={userType}
//       />
//     </div>
//   );
// };

// export default EventList;
