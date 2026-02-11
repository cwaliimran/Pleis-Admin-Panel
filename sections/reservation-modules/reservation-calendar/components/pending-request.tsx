'use client';

import ConfirmDialog from '@/components/comfirm-dialog/confirm-dialog';
import QueryDialog from '@/components/comfirm-dialog/query-dialog';
import { useBoolean } from '@/hooks/useBoolean';
import { useUpdateReservationStatusMutation } from '@/store/Reducer/reservations-api';
import { getErrorMessage } from '@/utils/api';
import { showError, showSuccess } from '@/utils/toast';
import { Check, Clock, LogIn, X } from 'lucide-react';
import React, { useState } from 'react';
import UpdateReservationModal from './change-request-modal';
import { CalendarReservation, PendingRequestsProps } from './types';

const PendingRequests: React.FC<PendingRequestsProps> = ({ bookings, selectedSlot, onStatusUpdate }) => {
  const openModal = useBoolean();
  const confirmModal = useBoolean();
  const deleteModal = useBoolean();
  const checkinModal = useBoolean();
  const completeModal = useBoolean();

  const [selectedBooking, setSelectedBooking] = useState<CalendarReservation | null>(null);
  const [selectedId, setSelectedId] = useState<string>('');
  const [loadingAction, setLoadingAction] = useState<{ id: string; action: 'confirmed' | 'rejected' | 'checkedIn' | 'completed' } | null>(null);

  const STATUS_STYLES: Record<string, { light: string; dark: string }> = {
    pendingPayment: {
      light: 'bg-yellow-100 text-yellow-700',
      dark: 'dark:bg-yellow-900/30 dark:text-yellow-400',
    },
    needsConfirmation: {
      light: 'bg-orange-100 text-orange-700',
      dark: 'dark:bg-orange-900/30 dark:text-orange-400',
    },
    confirmed: {
      light: 'bg-green-100 text-green-700',
      dark: 'dark:bg-green-900/30 dark:text-green-400',
    },
    checkedIn: {
      light: 'bg-blue-100 text-blue-700',
      dark: 'dark:bg-blue-900/30 dark:text-blue-400',
    },
    completed: {
      light: 'bg-emerald-100 text-emerald-700',
      dark: 'dark:bg-emerald-900/30 dark:text-emerald-400',
    },
    rejected: {
      light: 'bg-red-100 text-red-700',
      dark: 'dark:bg-red-900/30 dark:text-red-400',
    },
    cancelled: {
      light: 'bg-gray-100 text-gray-700',
      dark: 'dark:bg-gray-800 dark:text-gray-300',
    },
  };

  // API mutation hook for updating reservation status
  const [updateStatus, { isLoading: isUpdatingStatus }] = useUpdateReservationStatusMutation();

  // Show empty state with slot info if no bookings
  if (bookings.length === 0) {
    return (
      <div className="space-y-4 rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-zinc-700 dark:bg-zinc-800">
        <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
          <Clock className="h-5 w-5" />
          <h3 className="font-semibold">No Pending Requests</h3>
        </div>
        {selectedSlot && (
          <p className="text-sm text-gray-500 dark:text-gray-400">
            No bookings found for {selectedSlot.reservationType} ({selectedSlot.startTime} - {selectedSlot.endTime})
          </p>
        )}
      </div>
    );
  }

  // Handle selecting a reservation for status update
  const handleSelectReservationId = (id: string, action: 'confirmed' | 'rejected' | 'checkedIn' | 'completed') => {
    setSelectedId(id);
    switch (action) {
      case 'confirmed':
        confirmModal.onTrue();
        break;
      case 'rejected':
        deleteModal.onTrue();
        break;
      case 'checkedIn':
        checkinModal.onTrue();
        break;
      case 'completed':
        completeModal.onTrue();
        break;
    }
  };

  // Handle API call to update reservation status
  const handleUpdateStatus = async (status: 'confirmed' | 'rejected' | 'checkedIn' | 'completed') => {
    if (!selectedId) return;

    setLoadingAction({ id: selectedId, action: status });

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
      setSelectedId('');

      // Refetch calendar data after successful update
      onStatusUpdate?.();
    } catch (error) {
      showError(getErrorMessage(error));
    } finally {
      setLoadingAction(null);
    }
  };

  const handleChangeReservation = (booking: CalendarReservation) => {
    setSelectedBooking(booking);
    openModal.onTrue();
  };

  // Helper to get time slot info
  const getTimeSlot = (booking: CalendarReservation) => {
    const dateSlot = booking.timingSlots?.dateTimeSlots?.[0];
    const timeSlot = dateSlot?.timeSlots?.[0];
    return {
      date: dateSlot?.date || '',
      startTime: timeSlot?.startTime || '',
      endTime: timeSlot?.endTime || '',
    };
  };

  // Helper to get member tier color
  const getMemberTierClass = (member: string) => {
    switch (member?.toLowerCase()) {
      case 'gold':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300';
      case 'silver':
        return 'bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
      case 'bronze':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  // Render action buttons based on booking status
  const renderActionButtons = (booking: CalendarReservation) => {
    const status = booking.status;
    const isLoading = loadingAction !== null;

    // Completed status - show banner
    if (status === 'completed') {
      return (
        <div className="rounded-md bg-emerald-100 px-4 py-3 text-center dark:bg-emerald-900/30">
          <span className="text-sm font-semibold text-emerald-700 dark:text-emerald-400">✓ Reservation Completed</span>
        </div>
      );
    }

    // Rejected or Cancelled status - show disabled buttons
    if (status === 'rejected' || status === 'cancelled') {
      return (
        <div className="flex gap-2">
          <button
            type="button"
            disabled
            className="flex flex-1 cursor-not-allowed items-center justify-center gap-2 rounded-lg bg-green-600 px-4 py-2 text-white opacity-50"
          >
            <Check className="h-4 w-4" />
            Confirm
          </button>
          <button type="button" disabled className="flex-1 cursor-not-allowed rounded-lg bg-blue-600 px-4 py-2 text-white opacity-50">
            Change
          </button>
          <button
            type="button"
            disabled
            className="flex flex-1 cursor-not-allowed items-center justify-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-white opacity-50"
          >
            <X className="h-4 w-4" />
            Reject
          </button>
        </div>
      );
    }

    // Confirmed status - show Check In button
    if (status === 'confirmed') {
      return (
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => handleSelectReservationId(booking._id, 'checkedIn')}
            disabled={isLoading}
            className="flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loadingAction?.id === booking._id && loadingAction?.action === 'checkedIn' ? (
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
            ) : (
              <LogIn className="h-4 w-4" />
            )}
            Check In
          </button>
        </div>
      );
    }

    // CheckedIn status - show Complete button
    if (status === 'checkedIn') {
      return (
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => handleSelectReservationId(booking._id, 'completed')}
            disabled={isLoading}
            className="flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-white hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loadingAction?.id === booking._id && loadingAction?.action === 'completed' ? (
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
            ) : (
              <Check className="h-4 w-4" />
            )}
            Complete
          </button>
        </div>
      );
    }

    // needsConfirmation or pendingPayment status (default) - show Confirm, Change, Reject buttons
    return (
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => handleSelectReservationId(booking._id, 'confirmed')}
          disabled={isLoading}
          className="flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-lg bg-green-600 px-4 py-2 text-white hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loadingAction?.id === booking._id && loadingAction?.action === 'confirmed' ? (
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
          ) : (
            <Check className="h-4 w-4" />
          )}
          Confirm
        </button>
        <button
          type="button"
          onClick={() => handleChangeReservation(booking)}
          disabled={isLoading}
          className="flex-1 cursor-pointer rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Change
        </button>
        <button
          type="button"
          onClick={() => handleSelectReservationId(booking._id, 'rejected')}
          disabled={isLoading}
          className="flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loadingAction?.id === booking._id && loadingAction?.action === 'rejected' ? (
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
          ) : (
            <X className="h-4 w-4" />
          )}
          Reject
        </button>
      </div>
    );
  };

  return (
    <>
      <div className="space-y-4 rounded-lg border border-orange-200 bg-orange-50 p-4 dark:border-[#155efcbd] dark:bg-[#155efcbd]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-orange-800 dark:text-white">
            <Clock className="h-5 w-5" />
            <h3 className="font-semibold">
              {selectedSlot ? `${selectedSlot.reservationType} Requests` : 'Pending Confirmation Requests'} ({bookings.length})
            </h3>
          </div>
          {selectedSlot && (
            <span className="text-xs text-orange-700 dark:text-orange-200">
              {selectedSlot.startTime} - {selectedSlot.endTime}
            </span>
          )}
        </div>

        {/* Scrollable container with fixed max height */}
        <div className="max-h-100 space-y-4 overflow-y-auto pr-1">
          {bookings?.map((booking: CalendarReservation) => {
            const timeSlot = getTimeSlot(booking);
            const customerName = `${booking.user?.firstName || ''} ${booking.user?.lastName || ''}`.trim();

            return (
              <div key={booking._id} className="dark:bg-secondary space-y-3 rounded-lg bg-white p-4 shadow-sm">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold">{customerName || 'Unknown Customer'}</span>
                      {booking.member && <span className={`rounded px-2 py-1 text-xs ${getMemberTierClass(booking.member)}`}>{booking.member}</span>}
                    </div>
                    <div className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                      {booking.reservation?.reservationType || 'N/A'} · {booking.partySize} guests · {timeSlot.startTime} - {timeSlot.endTime}
                    </div>
                    {booking.eventTitle && <div className="mt-1 text-xs text-gray-500 dark:text-gray-500">Event: {booking.eventTitle}</div>}
                    {booking.notes && <div className="mt-1 text-xs text-gray-500 italic dark:text-gray-500">Note: {booking.notes}</div>}
                    {booking.reservation?.amount && (
                      <div className="mt-1 text-xs font-medium text-green-600 dark:text-green-400">Amount: ${booking.reservation.amount}</div>
                    )}
                  </div>
                  <div className="ml-2">
                    <span
                      className={`rounded-full px-2 py-1 text-xs font-medium capitalize ${
                        STATUS_STYLES[booking.status]?.light ?? 'bg-gray-100 text-gray-700'
                      } ${STATUS_STYLES[booking.status]?.dark ?? ''}`}
                    >
                      {booking.status}
                    </span>
                  </div>
                </div>

                {/* Action Buttons */}
                {renderActionButtons(booking)}
              </div>
            );
          })}
        </div>
      </div>

      {openModal.value && (
        <UpdateReservationModal open={openModal.value} onClose={openModal.onFalse} selectedData={selectedBooking} onSuccess={onStatusUpdate} />
      )}

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
        content="Are you sure you want to reject this reservation?"
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

export default PendingRequests;

// 'use client';

// import ConfirmDialog from '@/components/comfirm-dialog/confirm-dialog';
// import QueryDialog from '@/components/comfirm-dialog/query-dialog';
// import { useBoolean } from '@/hooks/useBoolean';
// import { useUpdateReservationStatusMutation } from '@/store/Reducer/reservations-api';
// import { getErrorMessage } from '@/utils/api';
// import { showError, showSuccess } from '@/utils/toast';
// import { Check, Clock, X } from 'lucide-react';
// import React, { useState } from 'react';
// import { CalendarReservation, PendingRequestsProps } from './types';
// import UpdateReservationModal from './change-request-modal';

// const PendingRequests: React.FC<PendingRequestsProps> = ({ bookings, selectedSlot, onStatusUpdate }) => {
//   const openModal = useBoolean();
//   const confirmModal = useBoolean();
//   const deleteModal = useBoolean();

//   const [selectedBooking, setSelectedBooking] = useState<CalendarReservation | null>(null);
//   const [selectedId, setSelectedId] = useState<string>('');
//   const [loadingAction, setLoadingAction] = useState<{ id: string; action: 'confirm' | 'reject' } | null>(null);

//   const STATUS_STYLES: Record<string, { light: string; dark: string }> = {
//     pendingPayment: {
//       light: 'bg-yellow-100 text-yellow-700',
//       dark: 'dark:bg-yellow-900/30 dark:text-yellow-400',
//     },
//     needsConfirmation: {
//       light: 'bg-orange-100 text-orange-700',
//       dark: 'dark:bg-orange-900/30 dark:text-orange-400',
//     },
//     confirmed: {
//       light: 'bg-green-100 text-green-700',
//       dark: 'dark:bg-green-900/30 dark:text-green-400',
//     },
//     checkedIn: {
//       light: 'bg-blue-100 text-blue-700',
//       dark: 'dark:bg-blue-900/30 dark:text-blue-400',
//     },
//     completed: {
//       light: 'bg-emerald-100 text-emerald-700',
//       dark: 'dark:bg-emerald-900/30 dark:text-emerald-400',
//     },
//     rejected: {
//       light: 'bg-red-100 text-red-700',
//       dark: 'dark:bg-red-900/30 dark:text-red-400',
//     },
//     cancelled: {
//       light: 'bg-gray-100 text-gray-700',
//       dark: 'dark:bg-gray-800 dark:text-gray-300',
//     },
//   };

//   // API mutation hook for updating reservation status
//   const [updateStatus, { isLoading: isUpdatingStatus }] = useUpdateReservationStatusMutation();

//   // Show empty state with slot info if no bookings
//   if (bookings.length === 0) {
//     return (
//       <div className="space-y-4 rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-zinc-700 dark:bg-zinc-800">
//         <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
//           <Clock className="h-5 w-5" />
//           <h3 className="font-semibold">No Pending Requests</h3>
//         </div>
//         {selectedSlot && (
//           <p className="text-sm text-gray-500 dark:text-gray-400">
//             No bookings found for {selectedSlot.reservationType} ({selectedSlot.startTime} - {selectedSlot.endTime})
//           </p>
//         )}
//       </div>
//     );
//   }

//   // Handle selecting a reservation for confirm/reject
//   const handleSelectReservationId = (id: string, status: 'confirmed' | 'rejected') => {
//     setSelectedId(id);
//     if (status === 'confirmed') {
//       confirmModal.onTrue();
//     } else if (status === 'rejected') {
//       deleteModal.onTrue();
//     }
//   };

//   // Handle API call to update reservation status
//   const handleUpdateStatus = async (status: string) => {
//     if (!selectedId) return;

//     const action = status === 'confirmed' ? 'confirm' : 'reject';
//     setLoadingAction({ id: selectedId, action });

//     try {
//       const response = await updateStatus({ id: selectedId, status }).unwrap();
//       if (response.error) {
//         showError(getErrorMessage(response.error));
//         return;
//       }
//       showSuccess(response?.message || 'Reservation status updated successfully');
//       confirmModal.onFalse();
//       deleteModal.onFalse();
//       setSelectedId('');

//       // Refetch calendar data after successful update
//       onStatusUpdate?.();
//     } catch (error) {
//       showError(getErrorMessage(error));
//     } finally {
//       setLoadingAction(null);
//     }
//   };

//   const handleChangeReservation = (booking: CalendarReservation) => {
//     setSelectedBooking(booking);
//     openModal.onTrue();
//   };

//   // Helper to get time slot info
//   const getTimeSlot = (booking: CalendarReservation) => {
//     const dateSlot = booking.timingSlots?.dateTimeSlots?.[0];
//     const timeSlot = dateSlot?.timeSlots?.[0];
//     return {
//       date: dateSlot?.date || '',
//       startTime: timeSlot?.startTime || '',
//       endTime: timeSlot?.endTime || '',
//     };
//   };

//   // Helper to get member tier color
//   const getMemberTierClass = (member: string) => {
//     switch (member?.toLowerCase()) {
//       case 'gold':
//         return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300';
//       case 'silver':
//         return 'bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
//       case 'bronze':
//         return 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300';
//       default:
//         return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
//     }
//   };

//   return (
//     <>
//       <div className="space-y-4 rounded-lg border border-orange-200 bg-orange-50 p-4 dark:border-[#155efcbd] dark:bg-[#155efcbd]">
//         <div className="flex items-center justify-between">
//           <div className="flex items-center gap-2 text-orange-800 dark:text-white">
//             <Clock className="h-5 w-5" />
//             <h3 className="font-semibold">
//               {selectedSlot ? `${selectedSlot.reservationType} Requests` : 'Pending Confirmation Requests'} ({bookings.length})
//             </h3>
//           </div>
//           {selectedSlot && (
//             <span className="text-xs text-orange-700 dark:text-orange-200">
//               {selectedSlot.startTime} - {selectedSlot.endTime}
//             </span>
//           )}
//         </div>

//         {/* Scrollable container with fixed max height */}
//         <div className="max-h-100 space-y-4 overflow-y-auto pr-1">
//           {bookings?.map((booking: CalendarReservation) => {
//             const timeSlot = getTimeSlot(booking);
//             const customerName = `${booking.user?.firstName || ''} ${booking.user?.lastName || ''}`.trim();

//             return (
//               <div key={booking._id} className="dark:bg-secondary space-y-3 rounded-lg bg-white p-4 shadow-sm">
//                 <div className="flex items-start justify-between">
//                   <div className="flex-1">
//                     <div className="flex items-center gap-2">
//                       <span className="font-semibold">{customerName || 'Unknown Customer'}</span>
//                       {booking.member && <span className={`rounded px-2 py-1 text-xs ${getMemberTierClass(booking.member)}`}>{booking.member}</span>}
//                     </div>
//                     <div className="mt-1 text-sm text-gray-600 dark:text-gray-400">
//                       {booking.reservation?.reservationType || 'N/A'} · {booking.partySize} guests · {timeSlot.startTime} - {timeSlot.endTime}
//                     </div>
//                     {booking.eventTitle && <div className="mt-1 text-xs text-gray-500 dark:text-gray-500">Event: {booking.eventTitle}</div>}
//                     {booking.notes && <div className="mt-1 text-xs text-gray-500 italic dark:text-gray-500">Note: {booking.notes}</div>}
//                     {booking.reservation?.amount && (
//                       <div className="mt-1 text-xs font-medium text-green-600 dark:text-green-400">Amount: ${booking.reservation.amount}</div>
//                     )}
//                   </div>
//                   <div className="ml-2">
//                     <span
//                       className={`rounded-full px-2 py-1 text-xs font-medium capitalize ${
//                         STATUS_STYLES[booking.status]?.light ?? 'bg-gray-100 text-gray-700'
//                       } ${STATUS_STYLES[booking.status]?.dark ?? ''}`}
//                     >
//                       {booking.status}
//                     </span>
//                   </div>
//                 </div>

//                 <div className="flex gap-2">
//                   <button
//                     type="button"
//                     onClick={() => handleSelectReservationId(booking._id, 'confirmed')}
//                     disabled={loadingAction !== null}
//                     className="flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-lg bg-green-600 px-4 py-2 text-white hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50"
//                   >
//                     {loadingAction?.id === booking._id && loadingAction?.action === 'confirm' ? (
//                       <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
//                     ) : (
//                       <Check className="h-4 w-4" />
//                     )}
//                     Confirm
//                   </button>
//                   <button
//                     type="button"
//                     onClick={() => handleChangeReservation(booking)}
//                     disabled={loadingAction !== null}
//                     className="flex-1 cursor-pointer rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
//                   >
//                     Change
//                   </button>
//                   <button
//                     type="button"
//                     onClick={() => handleSelectReservationId(booking._id, 'rejected')}
//                     disabled={loadingAction !== null}
//                     className="flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
//                   >
//                     {loadingAction?.id === booking._id && loadingAction?.action === 'reject' ? (
//                       <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
//                     ) : (
//                       <X className="h-4 w-4" />
//                     )}
//                     Reject
//                   </button>
//                 </div>
//               </div>
//             );
//           })}
//         </div>
//       </div>

//       {openModal.value && (
//         <UpdateReservationModal open={openModal.value} onClose={openModal.onFalse} selectedData={selectedBooking} onSuccess={onStatusUpdate} />
//       )}

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
//         content="Are you sure you want to reject this reservation?"
//         onClose={deleteModal.onFalse}
//         onConfirm={() => handleUpdateStatus('rejected')}
//         isLoading={isUpdatingStatus}
//       />
//     </>
//   );
// };

// export default PendingRequests;
