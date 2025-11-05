'use client';

import { showSuccess } from '@/utils/toast';
import { Copy } from 'lucide-react';
import React, { useState } from 'react';
import ReservationGrid from '../reservation-view/new-reservation-chart';
import { ActiveBookings } from './components/active-bookings';
import { ActiveBooking, Booking } from './components/types';
import PendingRequests from './components/pending-request';

const mockBookings: Booking[] = [
  {
    id: 1,
    date: '2025-10-15',
    customer: 'John Smith',
    tier: 'Gold',
    table: 'VIP Table',
    guests: 6,
    time: '21:00 - 00:00',
    startTime: '21:00',
    endTime: '00:00',
    status: 'pending',
    price: 200,
  },
  {
    id: 2,
    date: '2025-10-15',
    customer: 'Sarah Johnson',
    tier: 'Silver',
    table: 'Lounge Area',
    guests: 4,
    time: '18:00 - 21:00',
    startTime: '18:00',
    endTime: '21:00',
    status: 'pending',
    price: 50,
  },
];

const activeBookings: ActiveBooking[] = [
  {
    id: 1,
    customerName: 'Anderson',
    table: 'VIP Table',
    time: '21:00 - 00:00',
    guests: 8,
    checkedIn: 6,
    phone: '+1234567890',
    note: 'Birthday celebration',
    status: 'checked-in',
  },
];

const ReservationCalendar: React.FC = () => {
  const [click, setClick] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [pendingBookings, setPendingBookings] = useState<Booking[]>(mockBookings);

  const handleConfirm = (id: number) => setPendingBookings((prev) => prev.filter((b) => b.id !== id));
  const handleReject = (id: number) => setPendingBookings((prev) => prev.filter((b) => b.id !== id));
  const handleChange = (id: number) => console.log('Change booking:', id);

  const formatDate = (date: Date) =>
    date.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });

  const handleCopyToDate = () => {
    setShowDatePicker(true);
  };

  const handleDateSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedDateValue = e.target.value;
    if (selectedDateValue) {
      showSuccess('Timeslots copied successfully!');
      setShowDatePicker(false);
      setSelectedDate(new Date(selectedDateValue));
    }
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
                onClick={() => setClick(false)}
                className="cursor-pointer rounded-md bg-gray-800 px-5 py-1.5 text-white hover:bg-gray-700 dark:bg-gray-300 dark:text-black dark:hover:bg-gray-400"
              >
                Close
              </button>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          <div className={`col-span-12 space-y-6 ${click ? 'lg:col-span-7' : 'lg:col-span-12'}`}>
            <ReservationGrid setClick={setClick} />
          </div>

          {click && (
            <div className="col-span-12 space-y-6 lg:col-span-5">
              <div className="rounded-lg border bg-white p-4 dark:bg-[#1E1E1E]">
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="font-semibold">{formatDate(selectedDate)}</h3>
                  <div className="flex gap-2">
                    {!showDatePicker ? (
                      <button
                        type="button"
                        onClick={handleCopyToDate}
                        className="flex cursor-pointer items-center gap-2 rounded-lg border px-3 py-2 text-sm hover:bg-gray-50 dark:hover:bg-gray-800"
                      >
                        <Copy className="h-4 w-4" /> Copy to Date
                      </button>
                    ) : (
                      <input
                        type="date"
                        title="copy date"
                        onChange={handleDateSelect}
                        className="w-[180px] cursor-pointer rounded-lg border px-3 py-2 text-sm dark:bg-[#2A2A2A] dark:text-white"
                        min={new Date().toISOString().split('T')[0]}
                        autoFocus
                      />
                    )}
                    {/* 
                  <button
                    type="button"
                    className="flex cursor-pointer items-center gap-2 rounded-lg bg-blue-600 px-3 py-2 text-sm text-white"
                  >
                    <Plus className="h-4 w-4" /> Add Slot
                  </button> */}
                  </div>
                </div>

                <PendingRequests bookings={pendingBookings} onConfirm={handleConfirm} onReject={handleReject} onChange={handleChange} />
              </div>

              <ActiveBookings bookings={activeBookings} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReservationCalendar;
