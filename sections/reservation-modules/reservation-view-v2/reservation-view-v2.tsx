'use client';

import ConfirmDialog from '@/components/comfirm-dialog/confirm-dialog';
import { Button } from '@/components/ui/button';
import { useBoolean } from '@/hooks/useBoolean';
import { useOrganizerOrganization } from '@/hooks/useOrganizerOrganization';
import { useUpdateUserReservationStatusMutation } from '@/store/Reducer/user-reservations-api';
import { getErrorMessage } from '@/utils/api';
import { showError, showSuccess } from '@/utils/toast';
import { addDays, format, parseISO, startOfWeek } from 'date-fns';
import { Plus } from 'lucide-react';
import React, { useMemo, useState } from 'react';
import { RESERVATION_STATUS_CONFIG, TIME_SLOTS } from './constants';
import { ReservationFormModal } from './modals/reservation-form-modal';
import { ReservationListSection } from './reservation-list-section';
import { ReservationTypesSection } from './reservation-types-section';
import { TimeSlotsSection } from './time-slots-section';
import { ListFilter, Reservation, ReservationStatus, UserType } from './types';
import { useReservationCalendar } from './use-reservation-calendar';
import { useReservationList } from './use-reservation-list';
import { WeekViewSection } from './week-view-section';

const ISO = 'yyyy-MM-dd';

const toWeekStart = (date: Date) => startOfWeek(date, { weekStartsOn: 1 });

interface ReservationViewV2Props {
  userType?: UserType;
}

export const ReservationViewV2: React.FC<ReservationViewV2Props> = ({ userType = 'super-admin' }) => {
  const { organizationId, OrganizationDropdown } = useOrganizerOrganization({
    userType,
    storageKey: 'reservation-view-v2-organization',
  });

  const [weekStart, setWeekStart] = useState<Date>(() => toWeekStart(new Date()));
  const [selectedDate, setSelectedDate] = useState<string>(() => format(new Date(), ISO));
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [selectedTypeId, setSelectedTypeId] = useState<string | null>(null);
  const [listFilter, setListFilter] = useState<ListFilter>('all');
  const [page, setPage] = useState(1);

  const [editing, setEditing] = useState<Reservation | null>(null);
  const [pendingStatusId, setPendingStatusId] = useState<string | null>(null);
  const [pendingStatus, setPendingStatus] = useState<{ item: Reservation; status: ReservationStatus } | null>(null);

  const formModal = useBoolean();
  const statusConfirm = useBoolean();

  const [updateStatus] = useUpdateUserReservationStatusMutation();

  const weekDates = useMemo(() => Array.from({ length: 7 }, (_, index) => format(addDays(weekStart, index), ISO)), [weekStart]);

  const {
    days,
    slots,
    hasDataForDate,
    isLoading: isCalendarLoading,
    isFetching: isCalendarFetching,
  } = useReservationCalendar({ organizationId, date: selectedDate, weekDates });

  const {
    reservations,
    types,
    pagination,
    isLoading: isListLoading,
    isFetching: isListFetching,
  } = useReservationList({
    organizationId,
    date: selectedDate,
    slot: selectedSlot,
    typeId: selectedTypeId,
    filter: listFilter,
    page,
  });

  const handlePickWeek = (date: Date) => {
    setWeekStart(toWeekStart(date));
    setSelectedDate(format(date, ISO));
    setSelectedSlot(null);
    setPage(1);
  };

  const handleSelectDate = (date: string) => {
    setSelectedDate(date);
    setSelectedSlot(null);
    setPage(1);
  };

  const handleSelectSlot = (slot: string | null) => {
    setSelectedSlot(slot);
    setPage(1);
  };

  const handleSelectType = (typeId: string | null) => {
    setSelectedTypeId(typeId);
    setPage(1);
  };

  const handleFilterChange = (filter: ListFilter) => {
    setListFilter(filter);
    setPage(1);
  };

  const handleOpenCreate = () => {
    setEditing(null);
    formModal.onTrue();
  };

  const handleOpenEdit = (item: Reservation) => {
    setEditing(item);
    formModal.onTrue();
  };

  const handleRequestStatus = (item: Reservation, status: ReservationStatus) => {
    setPendingStatus({ item, status });
    statusConfirm.onTrue();
  };

  const handleConfirmStatus = async () => {
    if (!pendingStatus) return;

    const { item, status } = pendingStatus;
    setPendingStatusId(item.id);

    try {
      const response = await updateStatus({ id: item.id, status }).unwrap();
      showSuccess(response?.message || `Reservation ${RESERVATION_STATUS_CONFIG[status].label.toLowerCase()}`);
      statusConfirm.onFalse();
      setPendingStatus(null);
    } catch (error) {
      showError(getErrorMessage(error));
    } finally {
      setPendingStatusId(null);
    }
  };

  const isRejecting = pendingStatus?.status === 'rejected';

  const listSubtitle = useMemo(() => {
    const dayLabel = format(parseISO(selectedDate), 'EEE dd/MM');
    const slotLabel = selectedSlot ? `slot ${selectedSlot}` : 'all slots';
    const typeLabel = types.find((type) => type.typeId === selectedTypeId)?.name || 'all types';
    return `${dayLabel} · ${slotLabel} · ${typeLabel}`;
  }, [selectedDate, selectedSlot, selectedTypeId, types]);

  return (
    <div className="flex flex-col gap-6 pb-10">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Reservation Management</h1>
          <p className="mt-1 text-sm leading-relaxed text-gray-500 dark:text-gray-400">
            View and manage reservations by day, time slot, and reservation type.
          </p>
        </div>

        <div className="flex flex-col items-stretch gap-3 sm:flex-row sm:items-center">
          {OrganizationDropdown}

          <Button type="button" onClick={handleOpenCreate} disabled={!organizationId} className="h-10 cursor-pointer gap-1 font-semibold">
            <Plus className="h-4 w-4" />
            Add reservation
          </Button>
        </div>
      </div>

      {!organizationId ? (
        <div className="py-24 text-center">
          <div className="mb-4 text-6xl opacity-30">🏢</div>
          <h3 className="mb-2 text-xl font-bold text-gray-900 dark:text-gray-100">
            {userType === 'organizer' ? 'Select an Organization' : 'No Company Selected'}
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {userType === 'organizer'
              ? 'Choose an organization from the dropdown above to view reservations'
              : 'Please select a company to view reservations'}
          </p>
        </div>
      ) : (
        <>
          <WeekViewSection
            days={days}
            selectedDate={selectedDate}
            onSelectDate={handleSelectDate}
            onPickWeek={handlePickWeek}
            isLoading={isCalendarLoading}
          />

          <TimeSlotsSection
            slots={slots}
            selectedSlot={selectedSlot}
            onSelectSlot={handleSelectSlot}
            isLoading={isCalendarLoading || isCalendarFetching}
            isEmpty={!hasDataForDate}
            emptyMessage={`No reservations on ${format(parseISO(selectedDate), 'EEE dd/MM/yyyy')}`}
          />

          <ReservationTypesSection types={types} selectedTypeId={selectedTypeId} onSelectType={handleSelectType} />

          <ReservationListSection
            data={reservations}
            subtitle={listSubtitle}
            filter={listFilter}
            onFilterChange={handleFilterChange}
            pagination={pagination}
            onPageChange={setPage}
            isLoading={isListLoading || isListFetching}
            pendingStatusId={pendingStatusId}
            onCreate={handleOpenCreate}
            onEdit={handleOpenEdit}
            onSetStatus={handleRequestStatus}
          />
        </>
      )}

      <ReservationFormModal
        open={formModal.value}
        reservation={editing}
        organizationId={organizationId}
        defaults={{
          date: selectedDate,
          time: selectedSlot || TIME_SLOTS[0],
          reservationTypeId: selectedTypeId || '',
        }}
        onClose={() => {
          formModal.onFalse();
          setEditing(null);
        }}
      />

      <ConfirmDialog
        open={statusConfirm.value}
        title={isRejecting ? 'Reject reservation?' : 'Confirm reservation?'}
        content={
          pendingStatus
            ? `The reservation for "${pendingStatus.item.guestName}" will be marked as ${RESERVATION_STATUS_CONFIG[
                pendingStatus.status
              ].label.toLowerCase()}.`
            : ''
        }
        isLoading={Boolean(pendingStatusId)}
        buttonClass={isRejecting ? undefined : 'bg-green-600 hover:bg-green-600/80'}
        onClose={() => {
          statusConfirm.onFalse();
          setPendingStatus(null);
        }}
        onConfirm={handleConfirmStatus}
      />
    </div>
  );
};

export default ReservationViewV2;
