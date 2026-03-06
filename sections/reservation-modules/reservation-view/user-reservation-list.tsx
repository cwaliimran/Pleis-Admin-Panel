'use client';

import ConfirmDialog from '@/components/comfirm-dialog/confirm-dialog';
import QueryDialog from '@/components/comfirm-dialog/query-dialog';
import { useBoolean } from '@/hooks/useBoolean';
import { useGetUserReservationsQuery, useUpdateReservationStatusMutation } from '@/store/Reducer/reservations-api';
import { getErrorMessage } from '@/utils/api';
import { showError, showSuccess } from '@/utils/toast';
import React, { useState } from 'react';
import UpdateReservationModal from '../reservation-calendar/components/change-request-modal';
import { normalizeTimeTo24 } from './helpers';
import { UserReservation } from './reservation-types';
import UserReservationCardSkelton from './user-reservation-card-skelton';

interface UserReservationsListProps {
  reservationId: string;
  companyOrganizer?: string;
  organizationId?: string | null;
}

const UserReservationsList: React.FC<UserReservationsListProps> = ({ reservationId, organizationId }) => {
  const updateModal = useBoolean();
  const deleteModal = useBoolean();
  const confirmModal = useBoolean();
  const checkinModal = useBoolean();
  const completeModal = useBoolean();

  const [selectedId, setSelectedId] = useState('');
  const [selectedData, setSelectedData] = useState<UserReservation | undefined>(undefined);

  const [updateStatus, { isLoading: isUpdatingStatus }] = useUpdateReservationStatusMutation();

  const {
    data: apiData,
    isLoading,
    isFetching,
  } = useGetUserReservationsQuery({ reservationId, organizationId: organizationId || undefined }, { skip: !organizationId });
  const pendingRequests: UserReservation[] = apiData?.data || [];

  const handleSelectReservationId = (id: string, action: string) => {
    setSelectedId(id);
    if (action === 'confirmed') confirmModal.onTrue();
    else if (action === 'rejected') deleteModal.onTrue();
    else if (action === 'checkedIn') checkinModal.onTrue();
    else if (action === 'completed') completeModal.onTrue();
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
      checkinModal.onFalse();
      completeModal.onFalse();
    } catch (error) {
      showError(getErrorMessage(error));
    }
  };

  const renderActionButtons = (request: any) => {
    const status = request?.status;

    // Completed status - show banner instead of buttons
    if (status === 'completed') {
      return (
        <div className="mt-4 rounded-md bg-emerald-100 px-4 py-3 text-center dark:bg-emerald-900/30">
          <span className="text-sm font-semibold text-emerald-700 dark:text-emerald-400">✓ Reservation Completed</span>
        </div>
      );
    }

    // Rejected or Cancelled status - show disabled buttons
    if (status === 'rejected' || status === 'cancelled') {
      return (
        <div className="mt-4 grid grid-cols-3 gap-2">
          <button
            type="button"
            disabled
            className="inline-flex cursor-not-allowed items-center justify-center gap-1.5 rounded-md bg-emerald-600 px-3 py-2 text-sm font-medium text-white opacity-50"
          >
            ✔ Accept
          </button>
          <button
            type="button"
            disabled
            className="inline-flex cursor-not-allowed items-center justify-center gap-1.5 rounded-md bg-blue-600 px-3 py-2 text-sm font-medium text-white opacity-50"
          >
            ⇪ Update
          </button>
          <button
            type="button"
            disabled
            className="inline-flex cursor-not-allowed items-center justify-center gap-1.5 rounded-md bg-red-600 px-3 py-2 text-sm font-medium text-white opacity-50"
          >
            ✕ Reject
          </button>
        </div>
      );
    }

    // Confirmed status - show Check In button
    if (status === 'confirmed') {
      return (
        <div className="mt-4">
          <button
            type="button"
            onClick={() => handleSelectReservationId(request._id, 'checkedIn')}
            className="inline-flex w-full cursor-pointer items-center justify-center gap-1.5 rounded-md bg-blue-600 px-3 py-2 text-sm font-medium text-white hover:bg-blue-500 focus-visible:ring-2 focus-visible:ring-blue-600/50 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
          >
            ✓ Check In
          </button>
        </div>
      );
    }

    // CheckedIn status - show Complete button
    if (status === 'checkedIn') {
      return (
        <div className="mt-4">
          <button
            type="button"
            onClick={() => handleSelectReservationId(request._id, 'completed')}
            className="inline-flex w-full cursor-pointer items-center justify-center gap-1.5 rounded-md bg-emerald-600 px-3 py-2 text-sm font-medium text-white hover:bg-emerald-500 focus-visible:ring-2 focus-visible:ring-emerald-600/50 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
          >
            ✓ Complete
          </button>
        </div>
      );
    }

    // needsConfirmation or pendingPayment status (default) - show Accept and Reject buttons
    return (
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
    );
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
                <div className="">
                  <h4 className="text-xl font-bold">
                    {request?.user?.firstName} {request?.user?.lastName}
                  </h4>
                  <div className="flex gap-x-1">
                    <p className="border-balck inline-block rounded-full border bg-black px-2.5 py-0.5 text-[10px] font-semibold text-gray-50 dark:border-gray-200 dark:bg-gray-50 dark:text-gray-800">
                      {request?.user?.tier?.title || 'N/A'}
                    </p>

                    <p className="border-balck inline-block rounded-full border bg-black px-2.5 py-0.5 text-[10px] font-semibold text-gray-50 capitalize dark:border-gray-200 dark:bg-gray-50 dark:text-gray-800">
                      {request?.status || 'N/A'}
                    </p>
                  </div>
                </div>

                {/* Date & Time */}
                <div className="text-right">
                  <div className="text-sm text-gray-600 dark:text-gray-300">{request?.timingSlots?.dateTimeSlots[0].date}</div>
                  <div className="text-sm font-semibold">
                    {normalizeTimeTo24(request?.timingSlots?.dateTimeSlots[0].timeSlots[0]?.startTime || '')} -{' '}
                    {normalizeTimeTo24(request?.timingSlots?.dateTimeSlots[0].timeSlots[0]?.endTime || '')}
                  </div>
                </div>
              </div>

              {/* Reservation Details */}
              <div className="mb-4 grid grid-cols-3 gap-3">
                <div>
                  <div className="mb-1 text-sm text-gray-500">Reservation Type</div>
                  <div className="text-md font-bold capitalize">{request?.reservation?.reservationType}</div>
                </div>
                <div>
                  <div className="mb-1 text-sm text-gray-500">Number of People</div>
                  <div className="text-md font-bold">{request?.partySize} guests</div>
                </div>
                <div>
                  <div className="mb-1 text-sm text-gray-500">Linked Event</div>
                  <div className="text-md font-bold">
                    {request?.event?.basicInfo?.title === 'No Event Title' ? 'No Event Selected' : request?.event?.basicInfo?.title}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              {renderActionButtons(request)}
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

      <QueryDialog
        open={checkinModal.value}
        title="Check In"
        content="Are you sure you want to check in this reservation?"
        onClose={checkinModal.onFalse}
        onConfirm={() => handleUpdateStatus('checkedIn')}
        isLoading={isUpdatingStatus}
        btnClassName="bg-blue-600 hover:bg-blue-700 text-white"
      />

      <QueryDialog
        open={completeModal.value}
        title="Complete Reservation"
        content="Are you sure you want to mark this reservation as complete?"
        onClose={completeModal.onFalse}
        onConfirm={() => handleUpdateStatus('completed')}
        isLoading={isUpdatingStatus}
        btnClassName="bg-emerald-600 hover:bg-emerald-700 text-white"
      />
    </>
  );
};

export default UserReservationsList;

// 'use client';

// import ConfirmDialog from '@/components/comfirm-dialog/confirm-dialog';
// import QueryDialog from '@/components/comfirm-dialog/query-dialog';
// import { useBoolean } from '@/hooks/useBoolean';
// import { useGetUserReservationsQuery, useUpdateReservationStatusMutation } from '@/store/Reducer/reservations-api';
// import { getErrorMessage } from '@/utils/api';
// import { showError, showSuccess } from '@/utils/toast';
// import React, { useState } from 'react';
// import UpdateReservationModal from '../reservation-calendar/components/change-request-modal';
// import { UserReservation } from './reservation-types';
// import UserReservationCardSkelton from './user-reservation-card-skelton';

// interface UserReservationsListProps {
//   reservationId: string;
//   companyOrganizer?: string;
//   organizationId?: string | null;
// }

// const UserReservationsList: React.FC<UserReservationsListProps> = ({ reservationId, organizationId }) => {
//   const updateModal = useBoolean();
//   const deleteModal = useBoolean();
//   const confirmModal = useBoolean();

//   const [selectedId, setSelectedId] = useState('');
//   const [selectedData, setSelectedData] = useState<UserReservation | undefined>(undefined);

//   const [updateStatus, { isLoading: isUpdatingStatus }] = useUpdateReservationStatusMutation();

//   const {
//     data: apiData,
//     isLoading,
//     isFetching,
//   } = useGetUserReservationsQuery({ reservationId, organizationId: organizationId || undefined }, { skip: !organizationId });
//   const pendingRequests: UserReservation[] = apiData?.data || [];

//   const handleSelectReservationId = (id: string, status: string) => {
//     setSelectedId(id);
//     if (status === 'confirmed') confirmModal.onTrue();
//     else if (status === 'rejected') deleteModal.onTrue();
//   };

//   const handleSelectReservationData = (data: UserReservation) => {
//     setSelectedData(data);
//     updateModal.onTrue();
//   };

//   const handleUpdateStatus = async (status: string) => {
//     if (!reservationId) return;

//     try {
//       const response = await updateStatus({ id: selectedId, status }).unwrap();
//       if (response.error) {
//         showError(getErrorMessage(response.error));
//         return;
//       }
//       showSuccess(response?.message || 'Reservation status updated successfully');
//       confirmModal.onFalse();
//       deleteModal.onFalse();
//     } catch (error) {
//       showError(getErrorMessage(error));
//     }
//   };

//   if (isLoading || isFetching) {
//     return (
//       <div className="mt-6 border-t pt-6">
//         <h3 className="mb-4 text-xl font-bold">User Reservations</h3>
//         <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
//           <UserReservationCardSkelton count={2} />
//         </div>
//       </div>
//     );
//   }

//   if (pendingRequests.length === 0) {
//     return (
//       <div className="mt-6 border-t pt-6">
//         <h3 className="mb-4 text-xl font-bold">User Reservations</h3>
//         <p className="text-gray-500">No user reservations found for this type.</p>
//       </div>
//     );
//   }

//   return (
//     <>
//       <div className="mt-6 border-t pt-6">
//         <h3 className="mb-4 text-2xl font-bold">Pending Confirmation Requests</h3>
//         <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
//           {pendingRequests.map((request: any) => (
//             <div
//               key={request._id}
//               className="rounded-lg border border-gray-200 bg-gray-50 px-4 py-5 shadow-sm dark:border-[#3c3a3aae] dark:bg-[#222121]"
//             >
//               {/* User details */}
//               <div className="mb-4 flex items-center justify-between">
//                 <div className="flex items-center justify-start gap-2">
//                   <h4 className="text-xl font-bold">
//                     {request?.user?.firstName} {request?.user?.lastName}
//                   </h4>
//                   <p className="border-balck inline-block rounded-full border bg-black px-2.5 py-1 text-xs font-semibold text-gray-50 dark:border-gray-200 dark:bg-gray-50 dark:text-gray-800">
//                     {request?.user?.tier?.title || 'N/A'}
//                   </p>

//                   <p className="border-balck inline-block rounded-full border bg-black px-2.5 py-1 text-xs font-semibold text-gray-50 capitalize dark:border-gray-200 dark:bg-gray-50 dark:text-gray-800">
//                     {request?.status || 'N/A'}
//                   </p>
//                 </div>

//                 {/* Date & Time */}
//                 <div className="text-right">
//                   <div className="text-sm text-gray-600 dark:text-gray-300">{request?.timingSlots?.dateTimeSlots[0].date}</div>
//                   <div className="text-sm font-semibold">
//                     {request?.timingSlots?.dateTimeSlots[0].timeSlots[0]?.startTime} {request?.timingSlots?.dateTimeSlots[0].timeSlots[0]?.endTime}
//                   </div>
//                 </div>
//               </div>

//               {/* Reservation Details */}
//               <div className="mb-4 grid grid-cols-3 gap-3">
//                 <div>
//                   <div className="mb-1 text-sm text-gray-500">Reservation Type</div>
//                   <div className="text-md font-bold capitalize">{request?.reservation?.reservationType}</div>
//                 </div>
//                 <div>
//                   <div className="mb-1 text-sm text-gray-500">Number of People</div>
//                   <div className="text-md font-bold">{request?.partySize} guests</div>
//                 </div>
//                 <div>
//                   <div className="mb-1 text-sm text-gray-500">Linked Event</div>
//                   <div className="text-md font-bold">
//                     {request?.event?.basicInfo?.title === 'No Event Title' ? 'No Event Selected' : request?.event?.basicInfo?.title}
//                   </div>
//                 </div>
//               </div>

//               {/* Action Buttons */}
//               <div className="mt-4 grid grid-cols-3 gap-2">
//                 <button
//                   type="button"
//                   onClick={() => handleSelectReservationId(request._id, 'confirmed')}
//                   className="inline-flex cursor-pointer items-center justify-center gap-1.5 rounded-md bg-emerald-600 px-3 py-2 text-sm font-medium text-white hover:bg-emerald-500 focus-visible:ring-2 focus-visible:ring-emerald-600/50 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
//                 >
//                   ✔ Accept
//                 </button>
//                 <button
//                   type="button"
//                   onClick={() => handleSelectReservationData(request)}
//                   className="inline-flex cursor-pointer items-center justify-center gap-1.5 rounded-md bg-blue-600 px-3 py-2 text-sm font-medium text-white hover:bg-blue-500 focus-visible:ring-2 focus-visible:ring-blue-600/50 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
//                 >
//                   ⇪ Update
//                 </button>
//                 <button
//                   type="button"
//                   onClick={() => handleSelectReservationId(request._id, 'rejected')}
//                   className="inline-flex cursor-pointer items-center justify-center gap-1.5 rounded-md bg-red-600 px-3 py-2 text-sm font-medium text-white hover:bg-red-500 focus-visible:ring-2 focus-visible:ring-red-600/50 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
//                 >
//                   ✕ Reject
//                 </button>
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>

//       {updateModal.value && <UpdateReservationModal open={updateModal.value} onClose={updateModal.onFalse} selectedData={selectedData} />}

//       <QueryDialog
//         open={confirmModal.value}
//         title="Accept Reservation"
//         content="Are you sure you want to accept this reservation?"
//         onClose={confirmModal.onFalse}
//         onConfirm={() => handleUpdateStatus('confirmed')}
//         isLoading={isUpdatingStatus}
//         btnClassName="bg-green-700 hover:bg-green-800 text-white"
//       />

//       <ConfirmDialog
//         open={deleteModal.value}
//         title="Reject Reservation"
//         content="Are you sure you want to rejected this reservation?"
//         onClose={deleteModal.onFalse}
//         onConfirm={() => handleUpdateStatus('rejected')}
//         isLoading={isUpdatingStatus}
//       />
//     </>
//   );
// };

// export default UserReservationsList;
