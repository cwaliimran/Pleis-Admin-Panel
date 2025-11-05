'use client';

import ConfirmDialog from '@/components/comfirm-dialog/confirm-dialog';
import QueryDialog from '@/components/comfirm-dialog/query-dialog';
import { useBoolean } from '@/hooks/useBoolean';
import { Check, Clock, X } from 'lucide-react';
import React, { useState } from 'react';
import { Booking, PendingRequestsProps } from './types';
import ChangeRequestModal from './change-request-modal';

const PendingRequests: React.FC<PendingRequestsProps> = ({
  bookings,
  // onConfirm,
  // onReject,
  // onChange,
}) => {
  const openModal = useBoolean();
  const confirmModal = useBoolean();
  const deleteModal = useBoolean();

  const [selectedBooking, setSelectedBooking] = useState(null);

  if (bookings.length === 0) return null;

  const handleChangeReservation = (booking: any) => {
    setSelectedBooking(booking);
    openModal.onTrue();
  };

  return (
    <>
      <div className="space-y-4 rounded-lg border border-orange-200 bg-orange-50 p-4 dark:border-[#155efcbd] dark:bg-[#155efcbd]">
        <div className="flex items-center gap-2 text-orange-800 dark:text-white">
          <Clock className="h-5 w-5" />
          <h3 className="font-semibold">Pending Confirmation Requests ({bookings.length})</h3>
        </div>

        {bookings?.map((booking: Booking) => (
          <div key={booking.id} className="dark:bg-secondary space-y-3 rounded-lg bg-white p-4 shadow-sm">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold">{booking.customer}</span>
                  <span
                    className={`rounded px-2 py-1 text-xs ${booking.tier === 'Gold' ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-800'}`}
                  >
                    {booking.tier}
                  </span>
                </div>
                <div className="mt-1 text-sm">
                  {booking.table} · {booking.guests} guests · {booking.startTime} - {booking.endTime}
                </div>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                // onClick={() => onConfirm(booking.id)}
                onClick={confirmModal.onTrue}
                className="flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-lg bg-green-600 px-4 py-2 text-white hover:bg-green-700"
              >
                <Check className="h-4 w-4" /> Confirm
              </button>
              <button
                type="button"
                // onClick={() => onChange(booking.id)}
                onClick={() => handleChangeReservation(booking)}
                className="flex-1 cursor-pointer rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
              >
                Change
              </button>
              <button
                type="button"
                // onClick={() => onReject(booking.id)}
                onClick={deleteModal.onTrue}
                className="flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-white hover:bg-red-700"
              >
                <X className="h-4 w-4" /> Reject
              </button>
            </div>
          </div>
        ))}
      </div>

      {openModal.value && <ChangeRequestModal open={openModal.value} onClose={openModal.onFalse} selectedData={selectedBooking} />}

      <QueryDialog
        open={confirmModal.value}
        title="Accept Request"
        content="Are you sure you want to accept this request?"
        onClose={confirmModal.onFalse}
        onConfirm={confirmModal.onTrue}
        isLoading={false}
        btnClassName="bg-green-700 text-white"
      />

      <ConfirmDialog
        open={deleteModal.value}
        title="Delete Request"
        content="Are you sure you want to delete this request?"
        onClose={() => {
          deleteModal.onFalse();
        }}
        onConfirm={() => {
          deleteModal.onFalse();
        }}
        isLoading={false}
      />
    </>
  );
};

export default PendingRequests;
