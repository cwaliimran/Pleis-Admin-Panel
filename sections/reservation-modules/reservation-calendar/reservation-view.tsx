'use client';

import FormProvider from '@/components/rhf';
import RHFCustomDropdown from '@/components/rhf/rhf-custom-dropdown';
import { useCompanySelectionState } from '@/hooks/useCompanySelectionState';
import { useGetOrganizationsOnOrganizerSideQuery } from '@/store/Reducer/organization';
import { useGetReservationCalendarQuery } from '@/store/Reducer/reservation-calendar-api';
import { yupResolver } from '@hookform/resolvers/yup';
import { format } from 'date-fns';
import React, { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import * as Yup from 'yup';
import ReservationGrid from '../../reservation-modules/reservation-view/new-reservation-chart';
import { getTimeIndex } from '../../reservation-modules/reservation-view/helpers';
import { ActiveBookings } from './components/active-bookings';
import PendingRequests from './components/pending-request';
import { CalendarReservation, SelectedSlot } from './components/types';

// ============================================================
// STORAGE HELPERS
// ============================================================

const ORGANIZER_ORG_STORAGE_KEY = 'reservation-calendar-organizer-organization';

interface StoredOrganizerOrganization {
  value: string;
  label: string;
}

const OrganizerOrganizationStorage = {
  get: (): StoredOrganizerOrganization | null => {
    if (typeof window === 'undefined') return null;
    try {
      const stored = localStorage.getItem(ORGANIZER_ORG_STORAGE_KEY);
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  },

  set: (organization: StoredOrganizerOrganization | null): void => {
    if (typeof window === 'undefined') return;
    try {
      if (organization) {
        localStorage.setItem(ORGANIZER_ORG_STORAGE_KEY, JSON.stringify(organization));
      } else {
        localStorage.removeItem(ORGANIZER_ORG_STORAGE_KEY);
      }
    } catch {
      // Silently fail
    }
  },

  getId: (): string => {
    const stored = OrganizerOrganizationStorage.get();
    return stored?.value || '';
  },
};

// ============================================================
// VALIDATION SCHEMA
// ============================================================

const organizationSchema = Yup.object().shape({
  organizationId: Yup.string().required('Organization is required'),
});

interface OrganizationFormValues {
  organizationId: string;
}

// ============================================================
// COMPONENT
// ============================================================

type ReservationCalendarProps = {
  userType: 'super-admin' | 'organizer';
};

const ReservationCalendar: React.FC<ReservationCalendarProps> = ({ userType }) => {
  const [click, setClick] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedSlot, setSelectedSlot] = useState<SelectedSlot | null>(null);

  const { organizationId: adminOrganizationId } = useCompanySelectionState();
  const isOrganizer = userType === 'organizer';

  // ============================================================
  // ORGANIZER ORGANIZATION FORM
  // ============================================================

  const organizationMethods = useForm<OrganizationFormValues>({
    resolver: yupResolver(organizationSchema),
    defaultValues: {
      organizationId: OrganizerOrganizationStorage.getId(),
    },
    mode: 'onChange',
  });

  const { watch: watchOrganization, setValue: setOrganizationValue } = organizationMethods;
  const selectedOrganizerOrganizationId = watchOrganization('organizationId');

  const {
    data: organizerOrganizationsResponse,
    isLoading: isLoadingOrganizerOrganizations,
    isFetching: isFetchingOrganizerOrganizations,
  } = useGetOrganizationsOnOrganizerSideQuery({}, { skip: !isOrganizer });

  const organizerOrganizationOptions = useMemo(
    () =>
      organizerOrganizationsResponse?.data?.map((organization: any) => ({
        label: organization?.title || organization?.basicInfo?.name || 'Unknown Organization',
        value: organization?._id,
      })) || [],
    [organizerOrganizationsResponse]
  );

  // Auto-select: 1. current valid, 2. localStorage, 3. first option
  useEffect(() => {
    if (!isOrganizer || organizerOrganizationOptions.length === 0) return;

    const currentSelection = selectedOrganizerOrganizationId;
    const storedOrgId = OrganizerOrganizationStorage.getId();

    if (currentSelection && organizerOrganizationOptions.some((opt: { value: string }) => opt.value === currentSelection)) {
      return;
    }

    if (storedOrgId && organizerOrganizationOptions.some((opt: { value: string }) => opt.value === storedOrgId)) {
      setOrganizationValue('organizationId', storedOrgId);
      return;
    }

    setOrganizationValue('organizationId', organizerOrganizationOptions[0].value);
  }, [isOrganizer, organizerOrganizationOptions, selectedOrganizerOrganizationId, setOrganizationValue]);

  // Persist selection to localStorage
  useEffect(() => {
    if (!isOrganizer) return;

    if (!selectedOrganizerOrganizationId) {
      OrganizerOrganizationStorage.set(null);
      return;
    }

    const selectedOption = organizerOrganizationOptions.find(
      (opt: { value: string; label: string }) => opt.value === selectedOrganizerOrganizationId
    );

    if (selectedOption) {
      OrganizerOrganizationStorage.set({
        value: selectedOption.value,
        label: selectedOption.label,
      });
    }
  }, [isOrganizer, selectedOrganizerOrganizationId, organizerOrganizationOptions]);

  // Resolve effective organizationId
  const organizationId = isOrganizer ? selectedOrganizerOrganizationId : adminOrganizationId;
  const isOrganizerOrgLoading = isLoadingOrganizerOrganizations || isFetchingOrganizerOrganizations;

  // ============================================================
  // DATA FETCHING
  // ============================================================

  const { data, isLoading, refetch } = useGetReservationCalendarQuery(
    { date: format(selectedDate, 'yyyy-MM-dd'), organization: organizationId },
    { skip: !organizationId, refetchOnMountOrArgChange: true }
  );

  // ============================================================
  // DERIVED STATE
  // ============================================================

  const filteredBookings = useMemo(() => {
    if (!selectedSlot || !data?.data) return [];

    const slotStartIdx = getTimeIndex(selectedSlot.startTime);
    const slotEndIdx = getTimeIndex(selectedSlot.endTime);

    return data.data.filter((booking: CalendarReservation) => {
      const reservationType = booking.reservation?.reservationType;
      const timeSlot = booking.timingSlots?.dateTimeSlots?.[0]?.timeSlots?.[0];

      if (!reservationType || !timeSlot) return false;
      if (reservationType !== selectedSlot.reservationType) return false;

      const bookingStartIdx = getTimeIndex(timeSlot.startTime);
      const bookingEndIdx = getTimeIndex(timeSlot.endTime);

      return bookingStartIdx <= slotEndIdx && bookingEndIdx >= slotStartIdx;
    });
  }, [data?.data, selectedSlot]);

  // ============================================================
  // HANDLERS
  // ============================================================

  const handleSlotClick = (slot: SelectedSlot) => {
    setSelectedSlot(slot);
    setClick(true);
  };

  const handleClose = () => {
    setClick(false);
    setSelectedSlot(null);
  };

  const handleStatusUpdate = () => {
    refetch();
  };

  // ============================================================
  // RENDER
  // ============================================================

  return (
    <div className="min-h-screen p-4">
      <div className="mx-auto w-full">
        {/* Header */}
        <div className="mb-8 flex items-end justify-between">
          <div className="heading">
            <h1 className="mb-2 text-3xl font-bold">Reservation Calendar</h1>
            <p>Manage timeslots and bookings across dates</p>
          </div>

          <div className="flex items-center gap-3">
            {/* Organization Dropdown (organizer only) */}
            {isOrganizer && (
              <FormProvider methods={organizationMethods} onSubmit={() => {}}>
                <div className="w-60">
                  <RHFCustomDropdown
                    name="organizationId"
                    placeholder="Select Organization"
                    options={organizerOrganizationOptions}
                    isLoading={isOrganizerOrgLoading}
                    showNone={false}
                  />
                </div>
              </FormProvider>
            )}

            {/* Close panel button */}
            {click && (
              <button
                title="close"
                type="button"
                onClick={handleClose}
                className="cursor-pointer rounded-md bg-gray-800 px-5 py-1.5 text-white hover:bg-gray-700 dark:bg-gray-300 dark:text-black dark:hover:bg-gray-400"
              >
                Close
              </button>
            )}
          </div>
        </div>

        {/* Guard: organizer must select org first */}
        {isOrganizer && !organizationId ? (
          <div className="py-16 text-center">
            <div className="mb-4 text-6xl opacity-30">🏢</div>
            <h3 className="mb-2 text-xl font-bold text-gray-900 dark:text-gray-100">Select an Organization</h3>
            <p className="text-sm text-gray-500 dark:text-gray-500">Please select an organization from the dropdown above to view the calendar</p>
          </div>
        ) : (
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
        )}
      </div>
    </div>
  );
};

export default ReservationCalendar;

// 'use client';

// import { useCompanySelectionState } from '@/hooks/useCompanySelectionState';
// import { useGetReservationCalendarQuery } from '@/store/Reducer/reservation-calendar-api';
// import { format } from 'date-fns';
// import React, { useMemo, useState } from 'react';
// import ReservationGrid from '../../reservation-modules/reservation-view/new-reservation-chart';
// import { getTimeIndex } from '../../reservation-modules/reservation-view/helpers';
// import { ActiveBookings } from './components/active-bookings';
// import PendingRequests from './components/pending-request';
// import { CalendarReservation, SelectedSlot } from './components/types';

// const ReservationCalendar: React.FC = () => {
//   const [click, setClick] = useState(false);
//   const [selectedDate, setSelectedDate] = useState<Date>(new Date());
//   const [selectedSlot, setSelectedSlot] = useState<SelectedSlot | null>(null);

//   const { organizationId } = useCompanySelectionState();

//   const { data, isLoading, refetch } = useGetReservationCalendarQuery(
//     { date: format(selectedDate, 'yyyy-MM-dd'), organization: organizationId },
//     { skip: !organizationId, refetchOnMountOrArgChange: true }
//   );

//   // Filter bookings based on selected slot (handles merged/overlapping slots)
//   const filteredBookings = useMemo(() => {
//     if (!selectedSlot || !data?.data) return [];

//     const slotStartIdx = getTimeIndex(selectedSlot.startTime);
//     const slotEndIdx = getTimeIndex(selectedSlot.endTime);

//     return data.data.filter((booking: CalendarReservation) => {
//       const reservationType = booking.reservation?.reservationType;
//       const timeSlot = booking.timingSlots?.dateTimeSlots?.[0]?.timeSlots?.[0];

//       if (!reservationType || !timeSlot) return false;

//       // Must match reservation type
//       if (reservationType !== selectedSlot.reservationType) return false;

//       // Check if booking's time range overlaps with the selected slot's time range
//       // Two intervals overlap if: bookingStart <= slotEnd AND bookingEnd >= slotStart
//       const bookingStartIdx = getTimeIndex(timeSlot.startTime);
//       const bookingEndIdx = getTimeIndex(timeSlot.endTime);

//       return bookingStartIdx <= slotEndIdx && bookingEndIdx >= slotStartIdx;
//     });
//   }, [data?.data, selectedSlot]);

//   // Handle slot click from grid
//   const handleSlotClick = (slot: SelectedSlot) => {
//     setSelectedSlot(slot);
//     setClick(true);
//   };

//   // Handle close panel
//   const handleClose = () => {
//     setClick(false);
//     setSelectedSlot(null);
//   };

//   // Handle refetch after status update (no loading state shown)
//   const handleStatusUpdate = () => {
//     refetch();
//   };

//   return (
//     <div className="min-h-screen p-4">
//       <div className="mx-auto w-full">
//         <div className="mb-8 flex items-end justify-between">
//           <div className="heading">
//             <h1 className="mb-2 text-3xl font-bold">Reservation Calendar</h1>
//             <p>Manage timeslots and bookings across dates</p>
//           </div>

//           {click && (
//             <div className="close_button">
//               <button
//                 title="close"
//                 type="button"
//                 onClick={handleClose}
//                 className="cursor-pointer rounded-md bg-gray-800 px-5 py-1.5 text-white hover:bg-gray-700 dark:bg-gray-300 dark:text-black dark:hover:bg-gray-400"
//               >
//                 Close
//               </button>
//             </div>
//           )}
//         </div>

//         <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
//           <div className={`col-span-12 space-y-6 ${click ? 'lg:col-span-7' : 'lg:col-span-12'}`}>
//             <ReservationGrid
//               setClick={setClick}
//               reservations={data?.data || []}
//               isLoading={isLoading}
//               selectedDate={selectedDate}
//               onDateChange={setSelectedDate}
//               onSlotClick={handleSlotClick}
//             />
//           </div>

//           {click && (
//             <div className="col-span-12 space-y-6 lg:col-span-5">
//               <div className="rounded-xl border bg-white p-4 dark:bg-[#1E1E1E]">
//                 <PendingRequests bookings={filteredBookings} selectedSlot={selectedSlot} onStatusUpdate={handleStatusUpdate} />
//               </div>

//               <ActiveBookings bookings={data?.data || []} />
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ReservationCalendar;
