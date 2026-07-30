'use client';

import ConfirmDialog from '@/components/comfirm-dialog/confirm-dialog';
import { Button } from '@/components/ui/button';
import { useBoolean } from '@/hooks/useBoolean';
import { useOrganizerOrganization } from '@/hooks/useOrganizerOrganization';
import { getErrorMessage } from '@/utils/api';
import { showError, showSuccess } from '@/utils/toast';
import { addDays, format, parseISO, startOfWeek } from 'date-fns';
import { Plus } from 'lucide-react';
import React, { useMemo, useState } from 'react';
import { TIME_SLOTS } from './constants';
import { ReservationFormModal } from './modals/reservation-form-modal';
import { ReservationListSection } from './reservation-list-section';
import { ReservationTypesSection } from './reservation-types-section';
import { TimeSlotsSection } from './time-slots-section';
import { ListFilter, Reservation, ReservationPayload, ReservationQuery, ReservationStatus, UserType } from './types';
import { useReservationView } from './use-reservation-view';
import { WeekViewSection } from './week-view-section';

const ISO = 'yyyy-MM-dd';

/** Weeks run Monday → Sunday, matching the strip and the picker. */
const toWeekStart = (date: Date) => startOfWeek(date, { weekStartsOn: 1 });

interface ReservationViewV2Props {
  userType?: UserType;
}

export const ReservationViewV2: React.FC<ReservationViewV2Props> = ({ userType = 'super-admin' }) => {
  // Single source of truth for the organization id — super-admin resolves it from
  // the company selector in the header, organizer from the dropdown this hook renders.
  const { organizationId, OrganizationDropdown } = useOrganizerOrganization({
    userType,
    storageKey: 'reservation-view-v2-organization',
  });

  const [weekStart, setWeekStart] = useState<Date>(() => toWeekStart(new Date()));
  const [selectedDate, setSelectedDate] = useState<string>(() => format(new Date(), ISO));
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [selectedTypeId, setSelectedTypeId] = useState<string | null>(null);
  const [listFilter, setListFilter] = useState<ListFilter>('all');

  const [editing, setEditing] = useState<Reservation | null>(null);
  const [pendingDelete, setPendingDelete] = useState<Reservation | null>(null);

  const formModal = useBoolean();
  const deleteConfirm = useBoolean();

  const weekDates = useMemo(() => Array.from({ length: 7 }, (_, index) => format(addDays(weekStart, index), ISO)), [weekStart]);

  // Memoised because the data hook re-fetches whenever this object changes.
  const query: ReservationQuery = useMemo(
    () => ({ date: selectedDate, slot: selectedSlot, typeId: selectedTypeId, filter: listFilter }),
    [selectedDate, selectedSlot, selectedTypeId, listFilter]
  );

  const {
    days,
    slots,
    types,
    reservations,
    venues,
    reservationTypes,
    conditions,
    isFetching,
    isMutating,
    createReservation,
    updateReservation,
    deleteReservation,
    setStatus,
  } = useReservationView({ organizationId, weekDates, query });

  const handlePickWeek = (date: Date) => {
    setWeekStart(toWeekStart(date));
    setSelectedDate(format(date, ISO));
    setSelectedSlot(null);
  };

  const handleSelectDate = (date: string) => {
    setSelectedDate(date);
    // A slot that was busy on one day is rarely the one you want on the next.
    setSelectedSlot(null);
  };

  const handleOpenCreate = () => {
    setEditing(null);
    formModal.onTrue();
  };

  const handleOpenEdit = (item: Reservation) => {
    setEditing(item);
    formModal.onTrue();
  };

  const handleSubmit = async (payload: ReservationPayload) => {
    if (editing) {
      await updateReservation(editing.id, payload);
      return;
    }
    await createReservation(payload);
  };

  const handleSetStatus = async (item: Reservation, status: ReservationStatus) => {
    try {
      await setStatus(item.id, status);
      showSuccess(status === 'confirmed' ? 'Reservation confirmed' : 'Reservation cancelled');
    } catch (error) {
      showError(getErrorMessage(error));
    }
  };

  const handleConfirmDelete = async () => {
    if (!pendingDelete) return;

    try {
      await deleteReservation(pendingDelete.id);
      showSuccess('Reservation deleted');
      deleteConfirm.onFalse();
      setPendingDelete(null);
      // The modal stays open when deleting from inside it, so close it too.
      formModal.onFalse();
      setEditing(null);
    } catch (error) {
      showError(getErrorMessage(error));
    }
  };

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
            isLoading={isFetching && days.length === 0}
          />

          <TimeSlotsSection slots={slots} selectedSlot={selectedSlot} onSelectSlot={setSelectedSlot} />

          <ReservationTypesSection types={types} selectedTypeId={selectedTypeId} onSelectType={setSelectedTypeId} />

          <ReservationListSection
            data={reservations}
            subtitle={listSubtitle}
            filter={listFilter}
            onFilterChange={setListFilter}
            isLoading={isFetching}
            isMutating={isMutating}
            onCreate={handleOpenCreate}
            onEdit={handleOpenEdit}
            onDelete={(item) => {
              setPendingDelete(item);
              deleteConfirm.onTrue();
            }}
            onSetStatus={handleSetStatus}
          />
        </>
      )}

      <ReservationFormModal
        open={formModal.value}
        reservation={editing}
        venues={venues}
        reservationTypes={reservationTypes}
        conditions={conditions}
        defaults={{
          date: selectedDate,
          time: selectedSlot || TIME_SLOTS[0],
          reservationTypeId: selectedTypeId || '',
        }}
        isSubmitting={isMutating}
        onSubmit={handleSubmit}
        onDelete={
          editing
            ? () => {
                setPendingDelete(editing);
                deleteConfirm.onTrue();
              }
            : undefined
        }
        onClose={() => {
          formModal.onFalse();
          setEditing(null);
        }}
      />

      <ConfirmDialog
        open={deleteConfirm.value}
        title="Delete reservation?"
        content={`The reservation for "${pendingDelete?.guestName}" will be removed. This cannot be undone.`}
        isLoading={isMutating}
        onClose={() => {
          deleteConfirm.onFalse();
          setPendingDelete(null);
        }}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
};

export default ReservationViewV2;
