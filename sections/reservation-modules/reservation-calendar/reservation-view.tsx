'use client';

import { useCompanySelectionState } from '@/hooks/useCompanySelectionState';
import { useGetReservationCalendarQuery } from '@/store/Reducer/reservation-calendar-api';
import { format } from 'date-fns';
import React, { useMemo, useState } from 'react';
import ReservationGrid from '../../reservation-modules/reservation-view/new-reservation-chart';
import { getTimeIndex } from '../../reservation-modules/reservation-view/helpers';
import { ActiveBookings } from './components/active-bookings';
import PendingRequests from './components/pending-request';
import { CalendarReservation, SelectedSlot } from './components/types';

const ReservationCalendar: React.FC = () => {
  const [click, setClick] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedSlot, setSelectedSlot] = useState<SelectedSlot | null>(null);

  const { organizationId } = useCompanySelectionState();

  const { data, isLoading, refetch } = useGetReservationCalendarQuery(
    { date: format(selectedDate, 'yyyy-MM-dd'), organization: organizationId },
    { skip: !organizationId, refetchOnMountOrArgChange: true }
  );

  // Filter bookings based on selected slot (handles merged/overlapping slots)
  const filteredBookings = useMemo(() => {
    if (!selectedSlot || !data?.data) return [];

    const slotStartIdx = getTimeIndex(selectedSlot.startTime);
    const slotEndIdx = getTimeIndex(selectedSlot.endTime);

    return data.data.filter((booking: CalendarReservation) => {
      const reservationType = booking.reservation?.reservationType;
      const timeSlot = booking.timingSlots?.dateTimeSlots?.[0]?.timeSlots?.[0];

      if (!reservationType || !timeSlot) return false;

      // Must match reservation type
      if (reservationType !== selectedSlot.reservationType) return false;

      // Check if booking's time range overlaps with the selected slot's time range
      // Two intervals overlap if: bookingStart <= slotEnd AND bookingEnd >= slotStart
      const bookingStartIdx = getTimeIndex(timeSlot.startTime);
      const bookingEndIdx = getTimeIndex(timeSlot.endTime);

      return bookingStartIdx <= slotEndIdx && bookingEndIdx >= slotStartIdx;
    });
  }, [data?.data, selectedSlot]);

  // Handle slot click from grid
  const handleSlotClick = (slot: SelectedSlot) => {
    setSelectedSlot(slot);
    setClick(true);
  };

  // Handle close panel
  const handleClose = () => {
    setClick(false);
    setSelectedSlot(null);
  };

  // Handle refetch after status update (no loading state shown)
  const handleStatusUpdate = () => {
    refetch();
  };

  return (
    <div className="min-h-screen p-4">
      <div className="mx-auto w-full">
        <div className="mb-8 flex items-end justify-between">
          <div className="heading">
            <h1 className="mb-2 text-3xl font-bold">Reservation Calendar</h1>
            <p>Manage timeslots and bookings across dates</p>
          </div>

          {click && (
            <div className="close_button">
              <button
                title="close"
                type="button"
                onClick={handleClose}
                className="cursor-pointer rounded-md bg-gray-800 px-5 py-1.5 text-white hover:bg-gray-700 dark:bg-gray-300 dark:text-black dark:hover:bg-gray-400"
              >
                Close
              </button>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          <div className={`col-span-12 space-y-6 ${click ? 'lg:col-span-7' : 'lg:col-span-12'}`}>
            <ReservationGrid
              setClick={setClick}
              reservations={data?.data || []}
              isLoading={isLoading}
              selectedDate={selectedDate}
              onDateChange={setSelectedDate}
              onSlotClick={handleSlotClick}
            />
          </div>

          {click && (
            <div className="col-span-12 space-y-6 lg:col-span-5">
              <div className="rounded-xl border bg-white p-4 dark:bg-[#1E1E1E]">
                <PendingRequests bookings={filteredBookings} selectedSlot={selectedSlot} onStatusUpdate={handleStatusUpdate} />
              </div>

              <ActiveBookings bookings={data?.data || []} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReservationCalendar;
