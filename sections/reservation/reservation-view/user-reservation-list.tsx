'use client';

import ConfirmDialog from '@/components/comfirm-dialog/confirm-dialog';
import QueryDialog from '@/components/comfirm-dialog/query-dialog';
import { useBoolean } from '@/hooks/useBoolean';
import { useGetUserReservationsQuery, useUpdateReservationStatusMutation } from '@/store/Reducer/reservations-api';
import { getErrorMessage } from '@/utils/api';
import { showError, showSuccess } from '@/utils/toast';
import React, { useState } from 'react';
import UpdateReservationModal from '../reservation-calendar/components/change-request-modal';
import { UserReservation } from './reservation-types';
import UserReservationCardSkelton from './user-reservation-card-skelton';

interface UserReservationsListProps {
  reservationId: string;
  companyOrganizer: string;
}

const UserReservationsList: React.FC<UserReservationsListProps> = ({ reservationId, companyOrganizer }) => {
  const updateModal = useBoolean();
  const deleteModal = useBoolean();
  const confirmModal = useBoolean();

  const [selectedId, setSelectedId] = useState('');
  const [selectedData, setSelectedData] = useState<UserReservation | undefined>(undefined);

  const [updateStatus, { isLoading: isUpdatingStatus }] = useUpdateReservationStatusMutation();

  const { data: apiData, isLoading, isFetching } = useGetUserReservationsQuery({ reservationId, companyOrganizer }, { skip: !companyOrganizer });
  const pendingRequests: UserReservation[] = apiData?.data || [];

  const handleSelectReservationId = (id: string, status: string) => {
    setSelectedId(id);
    if (status === 'confirmed') confirmModal.onTrue();
    else if (status === 'rejected') deleteModal.onTrue();
  };

  const handleSelectReservationData = (data: UserReservation) => {
    setSelectedData(data);
    updateModal.onTrue();
  };

  const handleUpdateStatus = async (status: string) => {
    if (!reservationId) return;

    try {
      const response = await updateStatus({ id: selectedId, status }).unwrap();
      if (response.error) {
        showError(getErrorMessage(response.error));
        return;
      }
      showSuccess(response?.message || 'Reservation status updated successfully');
      confirmModal.onFalse();
      deleteModal.onFalse();
    } catch (error) {
      showError(getErrorMessage(error));
    }
  };

  if (isLoading || isFetching) {
    return (
      <div className="mt-6 border-t pt-6">
        <h3 className="mb-4 text-xl font-bold">User Reservations</h3>
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
          <UserReservationCardSkelton count={2} />
        </div>
      </div>
    );
  }

  if (pendingRequests.length === 0) {
    return (
      <div className="mt-6 border-t pt-6">
        <h3 className="mb-4 text-xl font-bold">User Reservations</h3>
        <p className="text-gray-500">No user reservations found for this type.</p>
      </div>
    );
  }

  return (
    <>
      <div className="mt-6 border-t pt-6">
        <h3 className="mb-4 text-2xl font-bold">Pending Confirmation Requests</h3>
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
          {pendingRequests.map((request: any) => (
            <div
              key={request._id}
              className="rounded-lg border border-gray-200 bg-gray-50 px-4 py-5 shadow-sm dark:border-[#3c3a3aae] dark:bg-[#222121]"
            >
              {/* User details */}
              <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center justify-start gap-2">
                  <h4 className="text-xl font-bold">{request.userName}</h4>
                  <p className="border-balck inline-block rounded-full border bg-black px-2.5 py-1 text-xs font-semibold text-gray-50 dark:border-gray-200 dark:bg-gray-50 dark:text-gray-800">
                    {request.member}
                  </p>
                </div>

                {/* Date & Time */}
                <div className="text-right">
                  <div className="text-sm text-gray-600 dark:text-gray-300">{request?.timingSlots?.dateTimeSlots[0].date}</div>
                  <div className="text-sm font-semibold">
                    {request?.timingSlots?.dateTimeSlots[0].timeSlots[0]?.startTime} {request?.timingSlots?.dateTimeSlots[0].timeSlots[0]?.endTime}
                  </div>
                </div>
              </div>

              {/* Reservation Details */}
              <div className="mb-4 grid grid-cols-3 gap-3">
                <div>
                  <div className="mb-1 text-sm text-gray-500">Reservation Type</div>
                  <div className="text-md font-bold capitalize">{request.reservationType}</div>
                </div>
                <div>
                  <div className="mb-1 text-sm text-gray-500">Number of People</div>
                  <div className="text-md font-bold">{request?.partySize} guests</div>
                </div>
                <div>
                  <div className="mb-1 text-sm text-gray-500">Linked Event</div>
                  <div className="text-md font-bold">{request?.eventTitle}</div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-4 grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => handleSelectReservationId(request._id, 'confirmed')}
                  className="inline-flex cursor-pointer items-center justify-center gap-1.5 rounded-md bg-emerald-600 px-3 py-2 text-sm font-medium text-white hover:bg-emerald-500 focus-visible:ring-2 focus-visible:ring-emerald-600/50 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                >
                  ✔ Accept
                </button>
                <button
                  type="button"
                  onClick={() => handleSelectReservationData(request)}
                  className="inline-flex cursor-pointer items-center justify-center gap-1.5 rounded-md bg-blue-600 px-3 py-2 text-sm font-medium text-white hover:bg-blue-500 focus-visible:ring-2 focus-visible:ring-blue-600/50 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                >
                  ⇪ Update
                </button>
                <button
                  type="button"
                  onClick={() => handleSelectReservationId(request._id, 'rejected')}
                  className="inline-flex cursor-pointer items-center justify-center gap-1.5 rounded-md bg-red-600 px-3 py-2 text-sm font-medium text-white hover:bg-red-500 focus-visible:ring-2 focus-visible:ring-red-600/50 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                >
                  ✕ Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {updateModal.value && <UpdateReservationModal open={updateModal.value} onClose={updateModal.onFalse} selectedData={selectedData} />}

      <QueryDialog
        open={confirmModal.value}
        title="Accept Reservation"
        content="Are you sure you want to accept this reservation?"
        onClose={confirmModal.onFalse}
        onConfirm={() => handleUpdateStatus('confirmed')}
        isLoading={isUpdatingStatus}
        btnClassName="bg-green-700 hover:bg-green-800 text-white"
      />

      <ConfirmDialog
        open={deleteModal.value}
        title="Reject Reservation"
        content="Are you sure you want to rejected this reservation?"
        onClose={deleteModal.onFalse}
        onConfirm={() => handleUpdateStatus('rejected')}
        isLoading={isUpdatingStatus}
      />
    </>
  );
};

export default UserReservationsList;
