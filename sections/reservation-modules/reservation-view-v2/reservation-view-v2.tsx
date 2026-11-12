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
import { EMPTY_LIST_FILTERS, IRREVERSIBLE_STATUSES, NEW_FILTER_LABEL, RESERVATION_STATUS_CONFIG, TIME_SLOTS } from './constants';
import { ReservationFormModal } from './modals/reservation-form-modal';
import { ReservationListSection, type ActiveFilterChip } from './reservation-list-section';
import { ReservationTypesSection } from './reservation-types-section';
import { TimeSlotsSection } from './time-slots-section';
import { ListFilters, Reservation, ReservationStatus, UserType } from './types';
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
  // Day, time slot and type select / deselect on click and act as list filters;
  // nothing selected means all (prototype v3.2). Clicking the selected day again
  // shows every date.
  const [isDayFilterOn, setIsDayFilterOn] = useState(true);
  const [listFilters, setListFilters] = useState<ListFilters>(EMPTY_LIST_FILTERS);
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
    newCount,
    isLoading: isListLoading,
    isFetching: isListFetching,
  } = useReservationList({
    organizationId,
    date: isDayFilterOn ? selectedDate : undefined,
    slot: isDayFilterOn ? selectedSlot : null,
    typeId: selectedTypeId,
    filters: listFilters,
    page,
  });

  const handlePickWeek = (date: Date) => {
    setWeekStart(toWeekStart(date));
    setSelectedDate(format(date, ISO));
    setIsDayFilterOn(true);
    setSelectedSlot(null);
    setPage(1);
  };

  const handleSelectDate = (date: string) => {
    setIsDayFilterOn(!(isDayFilterOn && date === selectedDate));
    setSelectedDate(date);
    setSelectedSlot(null);
    setPage(1);
  };

  const handleSelectSlot = (slot: string | null) => {
    setSelectedSlot(slot);
    if (slot) setIsDayFilterOn(true);
    setPage(1);
  };

  const handleSelectType = (typeId: string | null) => {
    setSelectedTypeId(typeId);
    setPage(1);
  };

  const handleFiltersChange = (filters: ListFilters) => {
    setListFilters(filters);
    setPage(1);
  };

  const handleClearAllFilters = () => {
    setIsDayFilterOn(false);
    setSelectedSlot(null);
    setSelectedTypeId(null);
    setListFilters(EMPTY_LIST_FILTERS);
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

  const applyStatus = async (item: Reservation, status: ReservationStatus) => {
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

  // Prototype v3.2: Reject, Cancel and No-show cannot be undone, so they ask first;
  // Confirm and Check in apply directly.
  const handleRequestStatus = (item: Reservation, status: ReservationStatus) => {
    if (IRREVERSIBLE_STATUSES.includes(status)) {
      setPendingStatus({ item, status });
      statusConfirm.onTrue();
      return;
    }
    void applyStatus(item, status);
  };

  const handleConfirmStatus = async () => {
    if (!pendingStatus) return;
    await applyStatus(pendingStatus.item, pendingStatus.status);
  };

  const confirmCopy = useMemo(() => {
    if (!pendingStatus) return { title: '', content: '', confirmText: 'Confirm' };

    const { item, status } = pendingStatus;
    const label = RESERVATION_STATUS_CONFIG[status].label;

    if (status === 'cancelled' && item.payment === 'paid') {
      return {
        title: 'Cancel reservation?',
        content: `${item.guestName} has paid the minimum spend. If the free cancellation window is closed, the prepayment is already with the organizer: the organizer refunds the guest directly and the commission is reversed on the next statement. This cannot be changed back.`,
        confirmText: 'Yes, cancel',
      };
    }

    const title = status === 'noShow' ? 'Mark as No-show?' : status === 'rejected' ? 'Reject reservation?' : 'Cancel reservation?';
    const forfeitNote = status === 'noShow' && item.payment === 'paid' ? ' The minimum spend voucher is forfeited and nothing is refunded.' : '';
    const confirmText = status === 'noShow' ? 'Yes, no-show' : status === 'rejected' ? 'Yes, reject' : 'Yes, cancel';

    return {
      title,
      content: `This sets ${item.guestName}'s reservation to ${label}. It cannot be changed back.${forfeitNote}`,
      confirmText,
    };
  }, [pendingStatus]);

  const dayLabel = format(parseISO(selectedDate), 'EEE dd/MM');
  const typeName = types.find((type) => type.typeId === selectedTypeId)?.name;

  const listSubtitle = useMemo(() => {
    const slotLabel = isDayFilterOn && selectedSlot ? `slot ${selectedSlot}` : 'all slots';
    return `${isDayFilterOn ? dayLabel : 'All dates'} · ${slotLabel} · ${typeName || 'all types'}`;
  }, [isDayFilterOn, dayLabel, selectedSlot, typeName]);

  /** Active filters as removable chips with Clear all (Filters v5 §2.6). */
  const filterChips = useMemo<ActiveFilterChip[]>(() => {
    const chips: ActiveFilterChip[] = [];
    if (isDayFilterOn) {
      chips.push({
        key: 'day',
        label: `Day: ${dayLabel}`,
        onRemove: () => {
          setIsDayFilterOn(false);
          setSelectedSlot(null);
          setPage(1);
        },
      });
    }
    if (isDayFilterOn && selectedSlot) chips.push({ key: 'slot', label: `Time slot: ${selectedSlot}`, onRemove: () => handleSelectSlot(null) });
    if (selectedTypeId) chips.push({ key: 'type', label: `Type: ${typeName || 'Selected type'}`, onRemove: () => handleSelectType(null) });
    if (listFilters.isNew) chips.push({ key: 'new', label: NEW_FILTER_LABEL, onRemove: () => handleFiltersChange({ ...listFilters, isNew: false }) });
    listFilters.statuses.forEach((status) =>
      chips.push({
        key: `status-${status}`,
        label: `Status: ${RESERVATION_STATUS_CONFIG[status].label}`,
        onRemove: () => handleFiltersChange({ ...listFilters, statuses: listFilters.statuses.filter((s) => s !== status) }),
      })
    );
    return chips;
  }, [isDayFilterOn, dayLabel, selectedSlot, selectedTypeId, typeName, listFilters]);

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
            isDaySelected={isDayFilterOn}
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
            filters={listFilters}
            onFiltersChange={handleFiltersChange}
            newCount={newCount}
            chips={filterChips}
            onClearAll={handleClearAllFilters}
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
        title={confirmCopy.title}
        content={confirmCopy.content}
        confirmText={confirmCopy.confirmText}
        cancelText="Back"
        isLoading={Boolean(pendingStatusId)}
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
